"""Reading a contract that does not fit in the context window.

A real filed agreement runs to 100,000+ characters. Truncating it loses the
middle, which is exactly where the operative clauses live. So the contract is
split, embedded and stored, and for each of the fifteen DORA provisions the
agent vector-searches *that contract's own passages* for the clause it is
looking for. The model then reads only the passages retrieval selected.

This makes retrieval load-bearing twice over: once to decide what the model
reads, and again (over `rules`) to decide what the bank makes of it.
"""

from __future__ import annotations

from covenant.db import chunks, db
from covenant.dora import ALL_PROVISIONS
from covenant.embed import embed_text

CHUNK_CHARS = 1600
CHUNK_OVERLAP = 240
# Contracts shorter than this are simply read whole — chunking a five-page
# agreement costs more than it saves.
WHOLE_DOCUMENT_LIMIT = 18_000

_PROVISION_VECTORS: dict[str, list[float]] = {}


def split(text: str) -> list[str]:
    """Overlapping windows, so a clause spanning a boundary is not lost."""
    text = text.strip()
    if not text:
        return []
    out: list[str] = []
    i = 0
    while i < len(text):
        out.append(text[i : i + CHUNK_CHARS])
        if i + CHUNK_CHARS >= len(text):
            break
        i += CHUNK_CHARS - CHUNK_OVERLAP
    return out


def index_contract(ref: str, text: str) -> int:
    """Chunk, embed and store one contract. Returns the chunk count."""
    chunks().delete_many({"ref": ref})
    pieces = split(text)
    if not pieces:
        return 0
    docs = []
    for n, piece in enumerate(pieces):
        docs.append(
            {
                "ref": ref,
                "n": n,
                "text": piece,
                "embedding": embed_text(piece),
            }
        )
    chunks().insert_many(docs)
    return len(docs)


def provision_vector(key: str) -> list[float]:
    """What we are looking for, embedded once and reused across contracts."""
    if key not in _PROVISION_VECTORS:
        spec = ALL_PROVISIONS[key]
        _PROVISION_VECTORS[key] = embed_text(f"{spec['label']}. {spec['looks_for']}")
    return _PROVISION_VECTORS[key]


def passages_for(ref: str, key: str, k: int = 3) -> list[dict]:
    """The passages in this contract most likely to contain this provision."""
    pipeline = [
        {
            "$vectorSearch": {
                "index": "chunks_vector",
                "path": "embedding",
                "queryVector": provision_vector(key),
                "numCandidates": 120,
                "limit": k,
                "filter": {"ref": {"$eq": ref}},
            }
        },
        {"$addFields": {"score": {"$meta": "vectorSearchScore"}}},
        {"$project": {"embedding": 0}},
    ]
    try:
        return list(chunks().aggregate(pipeline))
    except Exception as exc:  # index not ready, or none stored
        print(f"chunk search failed for {ref}/{key}: {exc}", flush=True)
        return []


# Fifteen provisions times three passages is twenty-odd distinct windows —
# about 8k tokens, which a 30B model on this box takes minutes to work
# through. Two apiece, capped, keeps a real contract inside a couple of
# minutes without losing the clause that matters: the passages that carry a
# provision tend to be the same ones for several provisions at once.
MAX_PASSAGES = 14


def focused_context(ref: str, keys: list[str], k: int = 2) -> tuple[str, list[int]]:
    """Assemble the passages the model should read, in document order.

    Returns the text and which chunk numbers it came from, so a verdict can
    say which part of the contract it was based on.
    """
    selected: dict[int, dict] = {}
    for key in keys:
        for hit in passages_for(ref, key, k):
            n = int(hit["n"])
            prev = selected.get(n)
            if prev is None or float(hit.get("score", 0)) > float(prev.get("score", 0)):
                selected[n] = hit
    if not selected:
        return "", []
    # Keep the strongest matches, then restore document order so the model
    # reads the contract forwards rather than by relevance.
    best = sorted(selected.values(), key=lambda h: -float(h.get("score", 0)))[:MAX_PASSAGES]
    order = sorted(int(h["n"]) for h in best)
    selected = {int(h["n"]): h for h in best}
    parts = [f"[passage {n}]\n{selected[n]['text']}" for n in order]
    return "\n\n".join(parts), order


def context_for(ref: str, text: str, keys: list[str]) -> tuple[str, list[int], str]:
    """Whole document if it fits, otherwise the retrieved passages."""
    if len(text) <= WHOLE_DOCUMENT_LIMIT:
        return text, [], "whole"
    focused, order = focused_context(ref, keys)
    if not focused:
        # Retrieval unavailable: fall back to head+tail rather than nothing,
        # and say so, because it is a materially weaker read.
        head, tail = text[:14000], text[-6000:]
        return f"{head}\n\n[...]\n\n{tail}", [], "head-tail"
    return focused, order, "retrieved"


def stats(ref: str) -> dict:
    return {"chunks": chunks().count_documents({"ref": ref})}

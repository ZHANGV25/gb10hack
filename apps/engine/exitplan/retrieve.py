from __future__ import annotations

from exitplan.config import EMBED_DIM
from exitplan.db import corpus


def similar_spans(
    query_embedding: list[float], k: int = 4, scope: str | None = "case"
) -> list[dict]:
    """Nearest policy spans.

    `scope` defaults to "case": only AMLR and internal AML policy can ground a
    disposition. Pass scope=None to search everything, including the
    platform-scope DORA text used to explain the architecture.
    """
    if len(query_embedding) != EMBED_DIM:
        raise ValueError("bad embedding dim")
    search: dict = {
        "index": "corpus_vector",
        "path": "embedding",
        "queryVector": query_embedding,
        "numCandidates": 40,
        "limit": k,
    }
    if scope:
        search["filter"] = {"scope": {"$eq": scope}}
    pipeline = [
        {"$vectorSearch": search},
        {"$addFields": {"score": {"$meta": "vectorSearchScore"}}},
        {"$project": {"embedding": 0}},
    ]
    return list(corpus().aggregate(pipeline))

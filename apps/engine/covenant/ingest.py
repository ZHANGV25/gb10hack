from __future__ import annotations

import time
from datetime import datetime, timezone

from covenant.db import contracts
from covenant.edgar import fetch_document, search_exhibits
from covenant.embed import chunk_text, embed_text

QUERIES = [
    '"limitation of liability" EX-10',
    '"indemnification" EX-10',
    '"data processing" EX-10',
    '"master services agreement" EX-10',
    '"software license" EX-10',
]


def ingest_corpus(limit: int = 20, start: str = "2025-01-01", end: str = "2026-08-01") -> list[str]:
    seen: set[str] = set()
    hits: list[dict] = []
    for q in QUERIES:
        for hit in search_exhibits(q, start, end, size=40):
            key = hit["accession"]
            if key in seen:
                continue
            seen.add(key)
            hits.append(hit)
            if len(hits) >= limit:
                break
        if len(hits) >= limit:
            break

    stored: list[str] = []
    for hit in hits:
        existing = contracts().find_one({"accession": hit["accession"]}, {"_id": 1})
        if existing:
            stored.append(hit["accession"])
            continue
        print(f"fetch {len(stored)+1}/{len(hits)} {hit['accession']} {hit.get('file_type')}", flush=True)
        try:
            text = fetch_document(hit["url"])
        except Exception as exc:
            print(f"  skip fetch: {exc}", flush=True)
            time.sleep(0.4)
            continue
        if len(text) < 400:
            print("  skip short", flush=True)
            continue
        blob = " ".join(
            [
                str(hit.get("issuer") or ""),
                str(hit.get("file_description") or ""),
                text[:1200],
            ]
        )
        embedding = embed_text(blob)
        chunks = [{"text": c, "n": i} for i, c in enumerate(chunk_text(text))]
        doc = {
            **hit,
            "text": text,
            "chunks": chunks,
            "embedding": embedding,
            "status": "ingested",
            "ingested_at": datetime.now(timezone.utc),
        }
        contracts().replace_one({"accession": hit["accession"]}, doc, upsert=True)
        stored.append(hit["accession"])
        time.sleep(0.25)
    return stored

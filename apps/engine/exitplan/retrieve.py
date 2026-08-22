from __future__ import annotations

from exitplan.config import EMBED_DIM
from exitplan.db import corpus


def similar_spans(query_embedding: list[float], k: int = 4) -> list[dict]:
    if len(query_embedding) != EMBED_DIM:
        raise ValueError("bad embedding dim")
    pipeline = [
        {
            "$vectorSearch": {
                "index": "corpus_vector",
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": 40,
                "limit": k,
            }
        },
        {"$addFields": {"score": {"$meta": "vectorSearchScore"}}},
        {"$project": {"embedding": 0}},
    ]
    return list(corpus().aggregate(pipeline))

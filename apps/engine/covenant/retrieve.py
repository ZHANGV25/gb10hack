from __future__ import annotations

from pymongo.errors import OperationFailure, PyMongoError

from covenant.config import EMBED_DIM
from covenant.db import rules, verdicts


def similar_rules(query_embedding: list[float], k: int = 5) -> list[dict]:
    return _vector_search(rules(), "rules_vector", query_embedding, k, extra_filter={"active": True})


def similar_verdicts(query_embedding: list[float], k: int = 5) -> list[dict]:
    return _vector_search(verdicts(), "verdicts_vector", query_embedding, k)


def _vector_search(
    coll, index: str, query_embedding: list[float], k: int, extra_filter: dict | None = None
) -> list[dict]:
    if len(query_embedding) != EMBED_DIM:
        raise ValueError("bad embedding dim")
    knn: dict = {
        "index": index,
        "path": "embedding",
        "queryVector": query_embedding,
        "numCandidates": max(50, k * 10),
        "limit": k,
    }
    if extra_filter:
        knn["filter"] = extra_filter
    pipeline = [{"$vectorSearch": knn}, {"$addFields": {"score": {"$meta": "vectorSearchScore"}}}]
    try:
        return list(coll.aggregate(pipeline))
    except (OperationFailure, PyMongoError) as exc:
        print(f"vector search skipped: {exc}", flush=True)
        return []

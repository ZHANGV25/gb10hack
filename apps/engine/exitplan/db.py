from __future__ import annotations

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import OperationFailure
from pymongo.operations import SearchIndexModel

from exitplan.config import EMBED_DIM, MONGO_DB, MONGO_URI

_client: MongoClient | None = None


def client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=8000)
        _client.admin.command("ping")
    return _client


def db():
    return client()[MONGO_DB]


def customers() -> Collection:
    return db()["customers"]


def transactions() -> Collection:
    return db()["transactions"]


def alerts() -> Collection:
    return db()["alerts"]


def corpus() -> Collection:
    return db()["corpus"]


def dispositions() -> Collection:
    return db()["dispositions"]


def audit_log() -> Collection:
    return db()["audit_log"]


# `scope` is a filter field so the drafter can be restricted to case-scope
# policy at query time. Platform-scope text (DORA's ICT exit duty) explains
# where this system runs; it is not evidence about a customer's payments.
VECTOR_INDEX = {
    "fields": [
        {
            "type": "vector",
            "path": "embedding",
            "numDimensions": EMBED_DIM,
            "similarity": "cosine",
        },
        {"type": "filter", "path": "scope"},
    ]
}


def ensure_indexes() -> None:
    customers().create_index("customer_id", unique=True)
    transactions().create_index("customer_id")
    alerts().create_index("alert_id", unique=True)
    alerts().create_index("status")
    alerts().create_index("severity")
    corpus().create_index("doc_id", unique=True)
    dispositions().create_index("alert_id")
    audit_log().create_index("ts")
    try:
        current = {
            idx.get("name"): idx.get("latestDefinition")
            for idx in corpus().list_search_indexes()
        }
        if "corpus_vector" not in current:
            corpus().create_search_index(
                SearchIndexModel(
                    definition=VECTOR_INDEX,
                    name="corpus_vector",
                    type="vectorSearch",
                )
            )
        elif current["corpus_vector"] != VECTOR_INDEX:
            # e.g. an index built before `scope` existed.
            corpus().update_search_index("corpus_vector", VECTOR_INDEX)
    except OperationFailure as exc:
        raise RuntimeError(f"vector index create failed: {exc}") from exc

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
        existing = {idx.get("name") for idx in corpus().list_search_indexes()}
        if "corpus_vector" not in existing:
            corpus().create_search_index(
                SearchIndexModel(
                    definition={
                        "fields": [
                            {
                                "type": "vector",
                                "path": "embedding",
                                "numDimensions": EMBED_DIM,
                                "similarity": "cosine",
                            }
                        ]
                    },
                    name="corpus_vector",
                    type="vectorSearch",
                )
            )
    except OperationFailure as exc:
        raise RuntimeError(f"vector index create failed: {exc}") from exc

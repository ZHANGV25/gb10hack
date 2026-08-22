from __future__ import annotations

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import OperationFailure
from pymongo.operations import SearchIndexModel

from covenant.config import EMBED_DIM, MONGO_DB, MONGO_URI

_client: MongoClient | None = None


def client() -> MongoClient:
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=8000)
        _client.admin.command("ping")
    return _client


def db():
    return client()[MONGO_DB]


def contracts() -> Collection:
    return db()["contracts"]


def verdicts() -> Collection:
    return db()["verdicts"]


def rules() -> Collection:
    return db()["rules"]


def corrections() -> Collection:
    return db()["corrections"]


def runs() -> Collection:
    return db()["runs"]


def _ensure_vector_index(coll: Collection, name: str, path: str) -> None:
    existing = {idx.get("name") for idx in coll.list_search_indexes()}
    if name in existing:
        return
    fields: list[dict] = [
        {
            "type": "vector",
            "path": path,
            "numDimensions": EMBED_DIM,
            "similarity": "cosine",
        }
    ]
    if name == "rules_vector":
        fields.append({"type": "filter", "path": "active"})
    model = SearchIndexModel(
        definition={"fields": fields},
        name=name,
        type="vectorSearch",
    )
    coll.create_search_index(model)


def ensure_indexes() -> None:
    contracts().create_index("accession", unique=True)
    contracts().create_index("status")
    verdicts().create_index("contract_id")
    verdicts().create_index("decision")
    rules().create_index("active")
    rules().create_index("version")
    corrections().create_index("contract_id")
    runs().create_index("started_at")
    try:
        _ensure_vector_index(contracts(), "contracts_vector", "embedding")
        _ensure_vector_index(rules(), "rules_vector", "embedding")
        _ensure_vector_index(verdicts(), "verdicts_vector", "embedding")
    except OperationFailure as exc:
        raise RuntimeError(f"vector index create failed (Atlas Local required): {exc}") from exc

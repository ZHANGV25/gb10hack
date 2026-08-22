from __future__ import annotations

import time

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


def chunks() -> Collection:
    return db()["chunks"]


def _ensure_vector_index(coll: Collection, name: str, path: str) -> None:
    current = {
        idx.get("name"): idx.get("latestDefinition")
        for idx in coll.list_search_indexes()
    }
    fields: list[dict] = [
        {
            "type": "vector",
            "path": path,
            "numDimensions": EMBED_DIM,
            "similarity": "cosine",
        }
    ]
    if name == "chunks_vector":
        # so a provision search stays inside one contract
        fields.append({"type": "filter", "path": "ref"})
    if name == "rules_vector":
        # Retired rules stay in the collection for audit but must not be
        # retrievable, and a rule can be scoped to one DORA provision.
        fields.append({"type": "filter", "path": "active"})
        fields.append({"type": "filter", "path": "provision"})
    definition = {"fields": fields}
    if name not in current:
        _create(coll, name, definition)
        return
    if current[name] == definition:
        return
    # e.g. an index built before a filter field was added. update_search_index
    # cannot carry the vectorSearch type, and after a collection drop the old
    # entry lingers in the listing, so fall back to a rebuild.
    try:
        coll.update_search_index(name, definition)
    except OperationFailure:
        _rebuild(coll, name, definition)


def _create(coll: Collection, name: str, definition: dict) -> None:
    try:
        coll.create_search_index(
            SearchIndexModel(definition=definition, name=name, type="vectorSearch")
        )
    except OperationFailure as exc:
        if "already exists" not in str(exc).lower():
            raise
        _rebuild(coll, name, definition)


def _rebuild(coll: Collection, name: str, definition: dict) -> None:
    try:
        coll.drop_search_index(name)
    except OperationFailure:
        pass
    for _ in range(60):
        names = {i.get("name") for i in coll.list_search_indexes()}
        if name not in names:
            break
        time.sleep(1)
    coll.create_search_index(
        SearchIndexModel(definition=definition, name=name, type="vectorSearch")
    )


def ensure_indexes() -> None:
    contracts().create_index("ref", unique=True)
    contracts().create_index("status")
    contracts().create_index([("critical", 1), ("last_decision", 1)])
    verdicts().create_index("ref")
    verdicts().create_index([("ref", 1), ("created_at", -1)])
    verdicts().create_index("decision")
    verdicts().create_index("gaps.provision")
    rules().create_index("active")
    rules().create_index("provision")
    rules().create_index([("created_at", -1)])
    corrections().create_index("ref")
    runs().create_index([("started_at", -1)])
    chunks().create_index([("ref", 1), ("n", 1)])
    try:
        _ensure_vector_index(contracts(), "contracts_vector", "embedding")
        _ensure_vector_index(rules(), "rules_vector", "embedding")
        _ensure_vector_index(chunks(), "chunks_vector", "embedding")
        _ensure_vector_index(verdicts(), "verdicts_vector", "embedding")
    except OperationFailure as exc:
        raise RuntimeError(f"vector index create failed (Atlas Local required): {exc}") from exc

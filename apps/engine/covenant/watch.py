"""The always-on reviewer.

Two MongoDB change streams, no polling:

  contracts  a new or amended arrangement is registered -> full review,
             which means reading the document with the model.

  rules      a reviewer teaches the agent something -> re-evaluate the whole
             register against the new policy. This reuses each contract's
             stored clause extraction, so learning one rule re-checks every
             contract in milliseconds rather than minutes. Which clauses a
             contract contains did not change; only what the bank makes of
             them did.

Resumability: the last processed change-stream token is stored, so a restart
picks up where it left off instead of replaying or skipping.
"""

from __future__ import annotations

import signal
import sys
import threading
from datetime import datetime, timezone

from pymongo.errors import PyMongoError

from covenant.db import contracts, db, rules, runs, verdicts
from covenant.judge import judge_contract
from covenant.retrieve import similar_rules

_stop = threading.Event()


def _state():
    return db()["watch_state"]


def _save_token(stream: str, token) -> None:
    _state().update_one(
        {"_id": stream},
        {"$set": {"token": token, "at": datetime.now(timezone.utc)}},
        upsert=True,
    )


def _load_token(stream: str):
    doc = _state().find_one({"_id": stream})
    return doc.get("token") if doc else None


def _log(kind: str, **fields) -> None:
    entry = {
        "kind": kind,
        "started_at": datetime.now(timezone.utc),
        "finished_at": datetime.now(timezone.utc),
        **fields,
    }
    runs().insert_one(entry)
    print(f"[{kind}] " + " ".join(f"{k}={v}" for k, v in fields.items()), flush=True)


def _await_searchable(rule_id, timeout: float = 20.0) -> bool:
    """Wait until a newly written rule is actually retrievable.

    The vector index is eventually consistent: a rule inserted a moment ago is
    in the collection but not yet queryable. Re-evaluating before the index
    catches up silently produces the old verdicts, which is the worst kind of
    wrong — it looks like the rule was considered and rejected.
    """
    doc = rules().find_one({"_id": rule_id}, {"embedding": 1})
    vector = (doc or {}).get("embedding")
    if not vector:
        return False
    waited = 0.0
    while waited < timeout:
        try:
            hits = similar_rules(vector, k=10)
        except Exception:
            hits = []
        if any(h.get("_id") == rule_id for h in hits):
            return True
        _stop.wait(0.5)
        waited += 0.5
    return False


def re_evaluate_register(reason: str) -> dict:
    """Re-run the policy layer over every contract that has been read."""
    started = datetime.now(timezone.utc)
    changed: list[dict] = []
    checked = 0
    for doc in contracts().find({}, {"ref": 1, "last_decision": 1}).sort("ref", 1):
        ref = doc["ref"]
        before = doc.get("last_decision")
        if before is None:
            continue  # never read yet; the contracts stream will handle it
        try:
            v = judge_contract(ref, trigger=reason, reuse_extraction=True)
        except Exception as exc:  # a single bad contract must not stop the sweep
            print(f"  re-review {ref} failed: {exc}", flush=True)
            continue
        checked += 1
        if v["decision"] != before:
            changed.append(
                {"ref": ref, "vendor": v["vendor"], "from": before, "to": v["decision"]}
            )
    seconds = (datetime.now(timezone.utc) - started).total_seconds()
    runs().insert_one(
        {
            "kind": "re-evaluate",
            "reason": reason,
            "checked": checked,
            "changed": changed,
            "changed_count": len(changed),
            "started_at": started,
            "finished_at": datetime.now(timezone.utc),
            "seconds": round(seconds, 2),
        }
    )
    print(
        f"[re-evaluate] reason={reason} checked={checked} "
        f"changed={len(changed)} in {seconds:.2f}s",
        flush=True,
    )
    for c in changed:
        print(f"    {c['ref']} {c['vendor']}: {c['from']} -> {c['to']}", flush=True)
    return {"checked": checked, "changed": changed, "seconds": seconds}


def _watch_rules() -> None:
    while not _stop.is_set():
        try:
            with db()["rules"].watch(
                [
                    {
                        "$match": {
                            "operationType": {
                                "$in": ["insert", "update", "replace", "delete"]
                            }
                        }
                    }
                ],
                full_document="updateLookup",
                resume_after=_load_token("rules"),
                max_await_time_ms=1000,
            ) as stream:
                for change in stream:
                    if _stop.is_set():
                        return
                    _save_token("rules", change["_id"])
                    doc = change.get("fullDocument") or {}
                    rule_id = doc.get("_id") or (change.get("documentKey") or {}).get("_id")
                    # A retired rule must also re-open the verdicts it was
                    # holding up. There is nothing to wait for on a delete.
                    deleted = change["operationType"] == "delete"
                    ready = (
                        False if deleted else _await_searchable(rule_id) if rule_id else False
                    )
                    _log(
                        "memory-changed",
                        op=change["operationType"],
                        provision=doc.get("provision"),
                        action=doc.get("action"),
                        indexed=ready,
                    )
                    re_evaluate_register("memory-changed")
        except PyMongoError as exc:
            if _stop.is_set():
                return
            print(f"rules stream restarting: {exc}", flush=True)
            _stop.wait(2)


def _watch_contracts() -> None:
    while not _stop.is_set():
        try:
            with db()["contracts"].watch(
                [{"$match": {"operationType": {"$in": ["insert", "replace"]}}}],
                resume_after=_load_token("contracts"),
                max_await_time_ms=1000,
            ) as stream:
                for change in stream:
                    if _stop.is_set():
                        return
                    _save_token("contracts", change["_id"])
                    doc = change.get("fullDocument") or {}
                    ref = doc.get("ref")
                    if not ref:
                        continue
                    _log("contract-registered", ref=ref, vendor=doc.get("vendor"))
                    try:
                        v = judge_contract(ref, trigger="contract-registered")
                        _log(
                            "review-complete",
                            ref=ref,
                            decision=v["decision"],
                            gaps=len(v["gaps"]),
                        )
                    except Exception as exc:
                        print(f"  review {ref} failed: {exc}", flush=True)
        except PyMongoError as exc:
            if _stop.is_set():
                return
            print(f"contracts stream restarting: {exc}", flush=True)
            _stop.wait(2)


def main() -> None:
    def shutdown(*_):
        print("stopping", flush=True)
        _stop.set()

    signal.signal(signal.SIGTERM, shutdown)
    signal.signal(signal.SIGINT, shutdown)

    pending = contracts().count_documents({"last_decision": None})
    print(
        f"watching covenant.contracts and covenant.rules "
        f"({contracts().count_documents({})} contracts, {pending} unread, "
        f"{verdicts().count_documents({})} verdicts)",
        flush=True,
    )
    runs().insert_one(
        {
            "kind": "watcher-started",
            "started_at": datetime.now(timezone.utc),
            "finished_at": datetime.now(timezone.utc),
        }
    )

    threads = [
        threading.Thread(target=_watch_rules, daemon=True, name="rules"),
        threading.Thread(target=_watch_contracts, daemon=True, name="contracts"),
    ]
    for t in threads:
        t.start()
    try:
        while not _stop.is_set():
            _stop.wait(1)
    except KeyboardInterrupt:
        _stop.set()
    print("stopped", flush=True)
    sys.exit(0)


if __name__ == "__main__":
    main()

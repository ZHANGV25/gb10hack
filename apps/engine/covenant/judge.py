from __future__ import annotations

from datetime import datetime, timezone

from covenant.db import contracts, runs, verdicts
from covenant.embed import embed_text
from covenant.exposure import compute_exposure
from covenant.extract import extract_fields
from covenant.retrieve import similar_rules


def apply_rules(computed: dict, retrieved: list[dict]) -> tuple[dict, list[str]]:
    """Python policy overlay. Rules never do arithmetic; they only change decision/flags."""
    decision = computed["decision"]
    flags = list(computed["flags"])
    ids: list[str] = []
    for rule in retrieved:
        ids.append(str(rule["_id"]))
        action = (rule.get("action") or "").lower()
        if action == "reject_if_uncapped" and "UNCAPPED_LIABILITY" in flags:
            decision = "reject"
        elif action == "escalate_if_eea" and "DATA_LEAVES_EEA" in flags:
            decision = "escalate"
        elif action == "reject_if_uncapped_and_eea" and {
            "UNCAPPED_LIABILITY",
            "DATA_LEAVES_EEA",
        }.issubset(flags):
            decision = "reject"
        elif action == "force_reject":
            decision = "reject"
        elif action == "force_escalate" and decision == "approve":
            decision = "escalate"
    out = dict(computed)
    out["decision"] = decision
    out["flags"] = flags
    return out, ids


def judge_contract(accession: str) -> dict:
    doc = contracts().find_one({"accession": accession})
    if not doc:
        raise KeyError(accession)
    text = doc.get("text") or ""
    fields = extract_fields(text)
    computed = compute_exposure(fields)
    query = embed_text(
        " ".join(
            [
                str(fields.get("vendor_name") or doc.get("issuer") or ""),
                str(fields.get("cited_clause") or ""),
                " ".join(computed["flags"]),
            ]
        )
        or "contract risk"
    )
    retrieved = similar_rules(query, k=5)
    computed, rule_ids = apply_rules(computed, retrieved)
    now = datetime.now(timezone.utc)
    verdict = {
        "contract_id": str(doc["_id"]),
        "accession": accession,
        "issuer": doc.get("issuer"),
        "fields": fields,
        "computed": computed,
        "decision": computed["decision"],
        "flags": computed["flags"],
        "exposure_usd": computed["exposure_usd"],
        "retrieved_rule_ids": rule_ids,
        "cited_clause": fields.get("cited_clause"),
        "cited_section": fields.get("cited_section"),
        "embedding": query,
        "model": "nemotron-3-nano:30b",
        "created_at": now,
    }
    result = verdicts().insert_one(verdict)
    verdict["_id"] = result.inserted_id
    runs().insert_one(
        {
            "kind": "judge_one",
            "accession": accession,
            "verdict_id": result.inserted_id,
            "started_at": now,
            "finished_at": datetime.now(timezone.utc),
        }
    )
    contracts().update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": "judged", "last_verdict_id": result.inserted_id}},
    )
    return verdict

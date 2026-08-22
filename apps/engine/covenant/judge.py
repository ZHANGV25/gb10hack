"""Review one ICT contract against DORA Article 30.

    extract (model reads clauses)
      -> assess (Python decides gaps and verdict)
      -> retrieve learned rules by vector similarity
      -> apply memory
      -> write verdict + audit run

Everything the verdict rests on is either a quoted clause or a written rule.
"""

from __future__ import annotations

from datetime import datetime, timezone

from covenant.assess import apply_rules, assess
from covenant.db import contracts, runs, verdicts
from covenant.embed import embed_text
from covenant.extract import extract_provisions
from covenant.retrieve import similar_rules


def gap_query(doc: dict, assessment: dict) -> str:
    """What to look for in memory: this vendor, this service, these gaps."""
    return " ".join(
        [
            str(doc.get("vendor") or ""),
            str(doc.get("service") or ""),
            str(doc.get("function") or ""),
            "critical function" if doc.get("critical") else "non-critical",
            str(doc.get("governing_law") or ""),
            " ".join(g["label"] for g in assessment["gaps"]),
            " ".join(g["provision"] for g in assessment["gaps"]),
        ]
    ).strip() or "ict contract"


def judge_contract(
    ref: str, *, trigger: str = "manual", reuse_extraction: bool = False
) -> dict:
    """Review a contract.

    `reuse_extraction` skips the model entirely and re-runs only the policy
    layer. Which clauses a contract contains is a property of the document; a
    verdict is a property of the document *and* current policy. When policy
    changes, only the second needs recomputing — so teaching the reviewer a
    rule re-evaluates the whole register in milliseconds instead of minutes.
    """
    doc = contracts().find_one({"ref": ref})
    if not doc:
        raise KeyError(ref)
    started = datetime.now(timezone.utc)

    provisions = None
    if reuse_extraction:
        previous = verdicts().find_one(
            {"ref": ref, "provisions": {"$exists": True}},
            sort=[("created_at", -1)],
        )
        if previous:
            provisions = previous.get("provisions")
    if provisions is None:
        provisions = extract_provisions(
            doc.get("text") or "", bool(doc.get("critical"))
        )
        extracted_fresh = True
    else:
        extracted_fresh = False
    assessment = assess(
        provisions,
        critical=bool(doc.get("critical")),
        annual_value_eur=float(doc.get("annual_value_eur") or 0),
    )

    query = gap_query(doc, assessment)
    query_vec = embed_text(query)
    retrieved = similar_rules(query_vec, k=5)
    final, rule_ids = apply_rules(assessment, retrieved)

    now = datetime.now(timezone.utc)
    verdict = {
        "ref": ref,
        "contract_id": doc["_id"],
        "vendor": doc.get("vendor"),
        "service": doc.get("service"),
        "function": doc.get("function"),
        "critical": bool(doc.get("critical")),
        "annual_value_eur": float(doc.get("annual_value_eur") or 0),
        "provisions": provisions,
        "gaps": final["gaps"],
        "blocking_gaps": final["blocking_gaps"],
        "material_gaps": final["material_gaps"],
        "required_count": final["required_count"],
        "present_count": final["present_count"],
        "decision": final["decision"],
        "decision_before_memory": final["decision_before_memory"],
        "decision_changed_by_memory": final["decision_changed_by_memory"],
        "exposure_eur": final["exposure_eur"],
        "reasoning": final["reasoning"],
        "math": final["math"],
        "retrieval_query": query,
        "candidate_rules": [
            {
                "rule_id": str(r.get("_id")),
                "text": str(r.get("text") or "")[:300],
                "action": r.get("action"),
                "provision": r.get("provision"),
                "score": r.get("score"),
            }
            for r in retrieved
        ],
        "applied_rule_ids": rule_ids,
        "embedding": query_vec,
        "model": doc.get("model") or "local",
        "trigger": trigger,
        "extraction": "fresh" if extracted_fresh else "reused",
        "created_at": now,
    }
    result = verdicts().insert_one(verdict)
    verdict["_id"] = result.inserted_id

    # A policy-only re-check is one of a dozen inside a sweep, and the sweep
    # already reports what changed. Logging each one buries the story.
    if extracted_fresh:
        runs().insert_one(
            {
                "kind": "review",
                "ref": ref,
                "trigger": trigger,
                "verdict_id": result.inserted_id,
                "decision": final["decision"],
                "gaps": len(final["gaps"]),
                "started_at": started,
                "finished_at": datetime.now(timezone.utc),
                "seconds": round((datetime.now(timezone.utc) - started).total_seconds(), 1),
            }
        )
    contracts().update_one(
        {"_id": doc["_id"]},
        {
            "$set": {
                "status": "reviewed",
                "last_verdict_id": result.inserted_id,
                "last_decision": final["decision"],
                "last_reviewed_at": now,
            }
        },
    )
    return verdict

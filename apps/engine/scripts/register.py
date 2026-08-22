#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import contracts, rules, verdicts


def latest_verdicts() -> list[dict]:
    pipeline = [
        {"$sort": {"created_at": -1}},
        {"$group": {"_id": "$accession", "doc": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$doc"}},
    ]
    return list(verdicts().aggregate(pipeline))


def main() -> None:
    latest = latest_verdicts()
    by = {"approve": 0, "escalate": 0, "reject": 0}
    exposure = 0.0
    with_rules = 0
    for v in latest:
        by[v.get("decision") or "escalate"] = by.get(v.get("decision") or "escalate", 0) + 1
        exposure += float(v.get("exposure_usd") or 0)
        if v.get("retrieved_rule_ids"):
            with_rules += 1
    out = {
        "contracts": contracts().count_documents({}),
        "verdicts": verdicts().count_documents({}),
        "rules": rules().count_documents({"active": True}),
        "latest_by_decision": by,
        "latest_exposure_usd": round(exposure, 2),
        "latest_with_retrieved_rules": with_rules,
        "latest_n": len(latest),
    }
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()

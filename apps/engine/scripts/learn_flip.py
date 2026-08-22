#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from bson import ObjectId
from covenant.db import contracts, verdicts
from covenant.judge import judge_contract
from covenant.learn import record_correction

RULE = (
    "Manufacturing and supply agreements with medical-device or ICT vendors that have "
    "uncapped or unlimited liability must be rejected. Do not approve or merely escalate."
)


def main() -> None:
    accession = sys.argv[1] if len(sys.argv) > 1 else "0001161697-25-000426"
    doc = contracts().find_one({"accession": accession})
    if not doc:
        raise SystemExit("missing contract")
    before = verdicts().find_one({"accession": accession}, sort=[("created_at", -1)])
    created = record_correction(
        contract_id=str(doc["_id"]),
        accession=accession,
        note="Bank policy: uncapped manufacturing-supply liability is a reject, not an escalate.",
        rule_text=RULE,
        action="reject_if_uncapped",
    )
    time.sleep(4)
    after = judge_contract(accession)
    print(
        json.dumps(
            {
                "accession": accession,
                "rule_id": str(created["rule_id"]),
                "before": None if not before else before.get("decision"),
                "after": after["decision"],
                "retrieved_rule_ids": [str(x) for x in after["retrieved_rule_ids"]],
                "flags": after["flags"],
            },
            indent=2,
            default=lambda o: str(o) if isinstance(o, ObjectId) else o,
        )
    )


if __name__ == "__main__":
    main()

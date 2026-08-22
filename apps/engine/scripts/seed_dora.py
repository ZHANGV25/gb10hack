#!/usr/bin/env python3
"""Load Nordhafen Bank's ICT third-party register.

Wipes and rebuilds contracts, verdicts, rules, corrections and runs.
Contracts are embedded so they are searchable; verdicts are produced
separately by the reviewer so the seed stays fast.
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.book import BOOK, ground_truth, render
from covenant.db import (
    contracts,
    corrections,
    ensure_indexes,
    rules,
    runs,
    verdicts,
)
from covenant.embed import embed_text

# Precedent from earlier reviews. The bank knows things the checklist does
# not, and those judgements live here as retrievable rules rather than as
# code. The reviewer finds them by vector similarity, not by keyword.
SEEDED_MEMORY = [
    {
        "text": (
            "Where a critical or important arrangement lets the supplier move processing "
            "between countries at its own discretion, the bank cannot evidence where its "
            "data is held and cannot answer a supervisor. Treat an undisclosed or "
            "discretionary processing location on a critical arrangement as a rejection, "
            "not an escalation."
        ),
        "action": "reject",
        "provision": "locations_disclosed",
        "critical_only": True,
        "author": "M. Halvorsen, Third-Party Risk",
        "days_ago": 96,
    },
    {
        "text": (
            "A missing security awareness participation clause on a non-critical "
            "arrangement is a real gap but not a material one: the supplier's staff do not "
            "touch a critical or important function. Record it and approve, provided no "
            "blocking provision is also missing."
        ),
        "action": "accept_exception",
        "provision": "security_training",
        "non_critical_only": True,
        "author": "M. Halvorsen, Third-Party Risk",
        "days_ago": 61,
    },
]


def main() -> None:
    # Drop rather than empty: the earlier EDGAR-shaped documents have no `ref`
    # and would collide with the unique index. Dropping also clears their
    # search indexes so ensure_indexes rebuilds them against the new schema.
    for coll in (contracts, verdicts, rules, corrections, runs):
        coll().drop()
    ensure_indexes()

    now = datetime.now(timezone.utc)

    for entry in BOOK:
        text = render(entry)
        contracts().insert_one(
            {
                "ref": entry["ref"],
                "vendor": entry["vendor"],
                "service": entry["service"],
                "function": entry["function"],
                "critical": entry["critical"],
                "annual_value_eur": float(entry["value"]),
                "governing_law": entry["law"],
                "commenced": entry["start"],
                "service_locations": entry["locations"],
                "data_locations": entry["data_locations"],
                "text": text,
                "chars": len(text),
                "embedding": embed_text(
                    f"{entry['vendor']} {entry['service']} {entry['function']}"
                ),
                "ground_truth": ground_truth(entry),
                "status": "pending",
                "last_decision": None,
                "added_at": now,
            }
        )

    for rule in SEEDED_MEMORY:
        rules().insert_one(
            {
                "text": rule["text"],
                "action": rule["action"],
                "provision": rule["provision"],
                "critical_only": rule.get("critical_only", False),
                "non_critical_only": rule.get("non_critical_only", False),
                "active": True,
                "source": "analyst_review",
                "author": rule["author"],
                "learned_from": None,
                "times_applied": 0,
                "embedding": embed_text(rule["text"]),
                "created_at": now - timedelta(days=rule["days_ago"]),
            }
        )

    critical = contracts().count_documents({"critical": True})
    print(
        json.dumps(
            {
                "contracts": contracts().count_documents({}),
                "critical": critical,
                "non_critical": contracts().count_documents({}) - critical,
                "annual_value_eur": sum(e["value"] for e in BOOK),
                "rules_in_memory": rules().count_documents({}),
                "verdicts": verdicts().count_documents({}),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()

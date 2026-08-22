#!/usr/bin/env python3
"""Put the register back to its demo start state, in about a second.

Removes every rule a reviewer taught during a run and leaves the two seeded
ones. Deleting a rule goes through the same change stream as adding one, so
the agent re-evaluates on its own and the verdicts revert — no contract needs
re-reading.

Use seed_dora.py + review_all.py only when the contracts themselves change.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import corrections, rules, verdicts


def main() -> None:
    taught = list(rules().find({"learned_from": {"$ne": None}}, {"_id": 1, "text": 1}))
    if not taught:
        print("already at the start state — 2 seeded rules, nothing taught")
    for r in taught:
        rules().delete_one({"_id": r["_id"]})
        print(f"retired: {str(r['text'])[:70]}…")
    corrections().delete_many({"rule_id": {"$in": [r["_id"] for r in taught]}})
    print(
        f"\nmemory now holds {rules().count_documents({'active': True})} seeded rules"
    )
    print(f"verdicts on file: {verdicts().count_documents({})}")
    print("the agent is re-evaluating; give it a second, then reload the register")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Reload just the precedent memory, leaving contracts and verdicts alone.

Every write goes through the rules change stream, so the agent re-evaluates
the register itself once the last one lands.
"""
from __future__ import annotations

import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import rules
from covenant.embed import embed_text
from covenant.precedent import PRECEDENT


def main() -> None:
    removed = rules().delete_many({"learned_from": None}).deleted_count
    now = datetime.now(timezone.utc)
    for rule in PRECEDENT:
        scope = rule.get("scope", "all")
        rules().insert_one(
            {
                "text": rule["text"],
                "action": rule["action"],
                "provision": rule["provision"],
                "critical_only": scope == "critical",
                "non_critical_only": scope == "non_critical",
                "active": True,
                "source": "analyst_review",
                "author": rule["author"],
                "learned_from": None,
                "times_applied": 0,
                "embedding": embed_text(rule["text"]),
                "created_at": now - timedelta(days=rule["days_ago"]),
            }
        )
    print(f"replaced {removed} seeded rules with {len(PRECEDENT)}")
    print("total in memory:", rules().count_documents({"active": True}))


if __name__ == "__main__":
    main()

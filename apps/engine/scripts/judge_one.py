#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from bson import ObjectId
from covenant.db import contracts, ensure_indexes
from covenant.judge import judge_contract


def _json(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if hasattr(obj, "isoformat"):
        return obj.isoformat()
    raise TypeError(type(obj))


def main() -> None:
    ensure_indexes()
    accession = sys.argv[1] if len(sys.argv) > 1 else None
    if not accession:
        doc = contracts().find_one({"status": {"$in": ["ingested", "judged"]}}, sort=[("ingested_at", 1)])
        if not doc:
            raise SystemExit("no contracts ingested")
        accession = doc["accession"]
    verdict = judge_contract(accession)
    print(
        json.dumps(
            {
                "accession": accession,
                "decision": verdict["decision"],
                "flags": verdict["flags"],
                "exposure_usd": verdict["exposure_usd"],
                "retrieved_rule_ids": verdict["retrieved_rule_ids"],
                "vendor_name": (verdict.get("fields") or {}).get("vendor_name"),
                "cited_clause": verdict.get("cited_clause"),
            },
            indent=2,
            default=_json,
        )
    )


if __name__ == "__main__":
    main()

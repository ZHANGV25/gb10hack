#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import contracts, verdicts
from covenant.judge import judge_contract


def main() -> None:
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    judged = {d["accession"] for d in verdicts().find({}, {"accession": 1})}
    pending = list(
        contracts().find({"accession": {"$nin": list(judged)}}, {"accession": 1, "issuer": 1})
    )[:limit]
    print(f"pending {len(pending)} already_judged {len(judged)}", flush=True)
    results = []
    for i, doc in enumerate(pending, 1):
        acc = doc["accession"]
        print(f"judge {i}/{len(pending)} {acc}", flush=True)
        try:
            v = judge_contract(acc)
            results.append({"accession": acc, "decision": v["decision"], "flags": v["flags"]})
        except Exception as exc:
            print(f"  fail {exc}", flush=True)
            results.append({"accession": acc, "error": str(exc)})
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()

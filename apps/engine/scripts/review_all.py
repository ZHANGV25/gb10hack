#!/usr/bin/env python3
"""Review every contract in the register that has no current verdict."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import contracts, verdicts
from covenant.judge import judge_contract


def main() -> None:
    force = "--all" in sys.argv
    reuse = "--reuse" in sys.argv
    trigger = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else "sweep"

    done = {v["ref"] for v in verdicts().find({}, {"ref": 1})} if not force else set()
    todo = [c["ref"] for c in contracts().find({}, {"ref": 1}).sort("ref", 1) if c["ref"] not in done]
    print(f"to review: {len(todo)}  already: {len(done)}  reuse_extraction={reuse}", flush=True)

    agree_total = agree_ok = 0
    for i, ref in enumerate(todo, 1):
        t0 = time.time()
        try:
            v = judge_contract(ref, trigger=trigger, reuse_extraction=reuse)
        except Exception as exc:
            print(f"  {i}/{len(todo)} {ref} FAILED {exc}", flush=True)
            continue
        # Real filed contracts have no ground truth — that is the point of
        # having them. Only the curated book can be scored.
        gt = (contracts().find_one({"ref": ref}, {"ground_truth": 1}) or {}).get(
            "ground_truth"
        ) or {}
        ok = sum(
            1
            for k, truth in gt.items()
            if (v["provisions"].get(k) or {}).get("status") == truth
        )
        n = sum(1 for k in gt if k in v["provisions"])
        agree_ok += ok
        agree_total += n
        score = f"agree={ok}/{n}" if n else "no ground truth"
        print(
            f"  {i}/{len(todo)} {ref} {v['decision']:<8} "
            f"gaps={len(v['gaps'])} {score} {time.time()-t0:.0f}s",
            flush=True,
        )

    print(
        json.dumps(
            {
                "verdicts": verdicts().count_documents({}),
                "clause_agreement": f"{agree_ok}/{agree_total}"
                + (f" ({100*agree_ok/agree_total:.0f}%)" if agree_total else ""),
            },
            indent=2,
        ),
        flush=True,
    )


if __name__ == "__main__":
    main()

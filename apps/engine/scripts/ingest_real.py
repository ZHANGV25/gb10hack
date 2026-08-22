#!/usr/bin/env python3
"""Add real SEC-filed ICT contracts to the register.

The curated book in book.py is synthetic on purpose — it has known ground
truth, which is the only way to say the agent is 98% right about clauses.
These are the opposite: real agreements filed with the SEC by real companies,
with no ground truth and no consideration for what we wanted to find. If the
checks only work on our own contracts they are worth nothing.
"""
from __future__ import annotations

import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.chunks import index_contract
from covenant.db import contracts, ensure_indexes
from covenant.edgar import fetch_document, search_exhibits
from covenant.embed import embed_text

QUERIES = [
    "master services agreement",
    "software as a service agreement",
    "hosting services agreement",
    "managed services agreement",
    "technology services agreement",
    "data processing agreement",
]

# Real filings carry a lot that is not an ICT contract. Require the document
# to actually read like a services agreement before spending a review on it.
MUST_CONTAIN = ("services", "agreement")
SIGNALS = (
    "service level", "confidential", "termination", "liability",
    "data", "software", "support", "hosting", "subcontract",
)
MIN_CHARS = 12_000
MAX_CHARS = 400_000


def looks_like_ict_contract(text: str) -> tuple[bool, int]:
    low = text.lower()
    if not all(w in low for w in MUST_CONTAIN):
        return False, 0
    score = sum(1 for s in SIGNALS if s in low)
    return score >= 6, score


def clean_title(hit: dict) -> str:
    issuer = re.sub(r"\s*\(.*?\)\s*", " ", str(hit.get("issuer") or "")).strip(" ,")
    return issuer or "Unknown filer"


def main() -> None:
    want = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    ensure_indexes()

    seen: set[str] = set()
    candidates: list[dict] = []
    for q in QUERIES:
        try:
            hits = search_exhibits(f'"{q}"', "2023-01-01", "2026-08-01", size=40)
        except Exception as exc:
            print(f"search failed for {q}: {exc}", flush=True)
            continue
        for h in hits:
            if h["accession"] in seen:
                continue
            seen.add(h["accession"])
            h["_query"] = q
            candidates.append(h)
        time.sleep(0.3)
    print(f"{len(candidates)} EX-10 candidates from EDGAR", flush=True)

    added = 0
    for h in candidates:
        if added >= want:
            break
        ref = f"SEC-{h['accession']}"
        if contracts().find_one({"ref": ref}, {"_id": 1}):
            continue
        try:
            text = fetch_document(h["url"])
        except Exception as exc:
            print(f"  fetch failed {h['accession']}: {exc}", flush=True)
            time.sleep(0.4)
            continue
        if not (MIN_CHARS <= len(text) <= MAX_CHARS):
            continue
        ok, score = looks_like_ict_contract(text)
        if not ok:
            continue

        vendor = clean_title(h)
        doc = {
            "ref": ref,
            "vendor": vendor,
            "service": f"{h['_query']} filed as {h.get('file_type')}",
            "function": "Real filed agreement — function not declared",
            # Nothing tells us whether a filed contract supports a critical
            # function, so it is assessed against the base Article 30(2) list.
            "critical": False,
            "annual_value_eur": 0.0,
            "governing_law": "as stated in the agreement",
            "commenced": str(h.get("file_date") or ""),
            "service_locations": "not declared",
            "data_locations": "not declared",
            "text": text,
            "chars": len(text),
            "embedding": embed_text(f"{vendor} {h['_query']}"),
            "ground_truth": None,
            "source": "SEC EDGAR",
            "source_url": h["url"],
            "source_form": h.get("form"),
            "source_filed": h.get("file_date"),
            "ict_signal_score": score,
            "status": "pending",
            "last_decision": None,
            "added_at": datetime.now(timezone.utc),
        }
        contracts().insert_one(doc)
        n = index_contract(ref, text)
        added += 1
        print(
            f"  + {ref}  {vendor[:34]:<34} {len(text):>7} chars  {n:>3} passages indexed",
            flush=True,
        )
        time.sleep(0.3)

    print(f"\nadded {added} real contracts; total register: {contracts().count_documents({})}")


if __name__ == "__main__":
    main()

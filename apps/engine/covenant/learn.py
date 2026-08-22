from __future__ import annotations

from datetime import datetime, timezone

from covenant.db import corrections, rules
from covenant.embed import embed_text


def record_correction(
    *,
    contract_id: str,
    accession: str,
    note: str,
    rule_text: str,
    action: str,
) -> dict:
    now = datetime.now(timezone.utc)
    embedding = embed_text(rule_text)
    rule = {
        "text": rule_text,
        "action": action,
        "active": True,
        "version": 1,
        "source": "analyst_correction",
        "accession": accession,
        "embedding": embedding,
        "created_at": now,
    }
    rid = rules().insert_one(rule).inserted_id
    corrections().insert_one(
        {
            "contract_id": contract_id,
            "accession": accession,
            "note": note,
            "rule_id": rid,
            "created_at": now,
        }
    )
    return {"rule_id": rid, "text": rule_text, "action": action}

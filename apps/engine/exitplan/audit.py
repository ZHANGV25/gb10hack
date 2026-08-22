from __future__ import annotations

from datetime import datetime, timezone
from hashlib import sha256

from exitplan.db import audit_log


def log_event(*, agent: str, action: str, alert_id: str, payload: dict, rationale: str) -> None:
    blob = repr(sorted(payload.items())).encode()
    audit_log().insert_one(
        {
            "agent": agent,
            "action": action,
            "alert_id": alert_id,
            "input_hash": sha256(blob).hexdigest()[:16],
            "output": payload,
            "rationale": rationale,
            "ts": datetime.now(timezone.utc),
        }
    )

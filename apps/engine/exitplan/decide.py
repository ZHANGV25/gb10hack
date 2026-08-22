from __future__ import annotations

from datetime import datetime, timezone

from exitplan.audit import log_event
from exitplan.db import alerts, dispositions


ALLOWED = {"close_noise", "escalate", "file_sar"}


def human_decide(alert_id: str, decision: str, actor: str = "analyst") -> dict:
    if decision not in ALLOWED:
        raise ValueError("unknown decision")
    alert = alerts().find_one({"alert_id": alert_id})
    if not alert:
        raise KeyError(alert_id)
    if alert.get("severity") == "red_flag" and decision == "close_noise":
        raise PermissionError("red-flag gate: the model and the UI cannot close this as noise")
    now = datetime.now(timezone.utc)
    filed = decision == "file_sar"
    dispositions().update_one(
        {"alert_id": alert_id},
        {
            "$set": {
                "human_decision": decision,
                "human_actor": actor,
                "filed": filed,
                "decided_at": now,
            }
        },
        upsert=True,
    )
    alerts().update_one(
        {"alert_id": alert_id},
        {"$set": {"status": "filed" if filed else "decided", "human_decision": decision}},
    )
    log_event(
        agent="human",
        action="file" if filed else "decide",
        alert_id=alert_id,
        payload={"decision": decision, "actor": actor},
        rationale="AMLR Art 18(3): a human decides and files. The agent did not.",
    )
    return {"alert_id": alert_id, "decision": decision, "filed": filed}

from __future__ import annotations

import re
from datetime import datetime, timezone

from covenant.embed import embed_text


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def compute_exposure(fields: dict) -> dict:
    """Deterministic. The model never adds, mins, or thresholds money."""
    uncapped = bool(fields.get("liability_uncapped"))
    cap = _as_float(fields.get("liability_cap_usd"))
    spend = _as_float(fields.get("annual_spend_usd"))
    data_leaves_eea = fields.get("data_leaves_eea") is True
    vendor = (fields.get("vendor_name") or "unknown").strip()

    flags: list[str] = []
    if uncapped or cap is None:
        flags.append("UNCAPPED_LIABILITY")
        exposure_usd = spend if spend is not None else 0.0
        cap_used = None
    else:
        exposure_usd = cap
        cap_used = cap
        if spend is not None and spend > cap:
            flags.append("SPEND_EXCEEDS_CAP")

    if data_leaves_eea:
        flags.append("DATA_LEAVES_EEA")

    if fields.get("single_vendor_dependency") is True:
        flags.append("CONCENTRATION_RISK")

    if "UNCAPPED_LIABILITY" in flags or "DATA_LEAVES_EEA" in flags:
        decision = "escalate"
    elif "SPEND_EXCEEDS_CAP" in flags or "CONCENTRATION_RISK" in flags:
        decision = "escalate"
    else:
        decision = "approve"

    if "UNCAPPED_LIABILITY" in flags and "DATA_LEAVES_EEA" in flags:
        decision = "reject"

    return {
        "computed_at": _utcnow(),
        "vendor_name": vendor,
        "liability_uncapped": "UNCAPPED_LIABILITY" in flags,
        "liability_cap_usd": cap_used,
        "annual_spend_usd": spend,
        "exposure_usd": round(exposure_usd, 2),
        "data_leaves_eea": data_leaves_eea,
        "flags": flags,
        "decision": decision,
        "math": (
            "exposure_usd = annual_spend_usd if uncapped else liability_cap_usd; "
            "escalate if UNCAPPED_LIABILITY or DATA_LEAVES_EEA; "
            "reject if both"
        ),
    }


def retrieval_embedding(fields: dict, clause: str) -> list[float]:
    blob = " ".join(
        [
            str(fields.get("vendor_name") or ""),
            str(fields.get("governing_law") or ""),
            "uncapped" if fields.get("liability_uncapped") else "capped",
            clause or "",
        ]
    )
    return embed_text(blob or "contract")


def _as_float(value) -> float | None:
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).strip().replace(",", "")
    m = re.search(r"-?\d+(?:\.\d+)?", s)
    if not m:
        return None
    return float(m.group(0))

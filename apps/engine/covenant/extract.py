from __future__ import annotations

import json
import re

import httpx

from covenant.config import (
    EXTRACT_HEAD_CHARS,
    EXTRACT_TAIL_CHARS,
    JUDGE_MODEL,
    OLLAMA_URL,
)

SCHEMA = {
    "vendor_name": "string, the ICT/vendor counterparty if identifiable else the issuer or unknown",
    "governing_law": "string or null",
    "liability_uncapped": "boolean true if liability is unlimited/uncapped/not limited",
    "liability_cap_usd": "number or null. Convert stated cap to a USD number. null if uncapped or not stated. Do not add or subtract. Just convert the stated figure.",
    "annual_spend_usd": "number or null. Stated fees, commitment, facility size, or annual spend if present. Convert to a number. Do not compute totals from multiple line items — use the single headline figure.",
    "data_leaves_eea": "boolean true if personal/customer data may be processed or transferred outside the EEA/UK, else false if the contract says EEA/UK only, else false if silent",
    "single_vendor_dependency": "boolean true if exclusive / sole-source / cannot switch without material penalty",
    "cited_clause": "verbatim quote of the most important liability or data-transfer sentence, <= 600 chars",
    "cited_section": "section heading or exhibit reference or null",
}

SYSTEM = """You extract risk-bearing terms from a vendor/ICT contract exhibit.
Return ONLY JSON matching the schema. No markdown.
Never add, multiply, or compare money figures. If a cap is written as "five million dollars", output 5000000.
If liability is unlimited, set liability_uncapped=true and liability_cap_usd=null.
"""


def extract_fields(text: str) -> dict:
    body = _window(text)
    user = (
        "Schema:\n"
        + json.dumps(SCHEMA, indent=2)
        + "\n\nContract text:\n"
        + body
    )
    payload = {
        "model": JUDGE_MODEL,
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.0, "num_ctx": 32768},
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user},
        ],
    }
    with httpx.Client(timeout=300.0) as client:
        r = client.post(f"{OLLAMA_URL}/api/chat", json=payload)
        r.raise_for_status()
        content = r.json().get("message", {}).get("content") or ""
    return _parse_json(content)


def _window(text: str) -> str:
    if len(text) <= EXTRACT_HEAD_CHARS + EXTRACT_TAIL_CHARS:
        return text
    return text[:EXTRACT_HEAD_CHARS] + "\n\n[...truncated...]\n\n" + text[-EXTRACT_TAIL_CHARS:]


def _parse_json(content: str) -> dict:
    content = content.strip()
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?", "", content).strip()
        content = re.sub(r"```$", "", content).strip()
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", content, re.S)
        if not m:
            raise
        data = json.loads(m.group(0))
    if not isinstance(data, dict):
        raise ValueError("extraction was not an object")
    return data

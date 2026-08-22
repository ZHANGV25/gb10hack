"""Read an ICT contract and say, clause by clause, what DORA Art. 30 requires.

The model does one job here: find the clause and quote it. It does not decide
whether the arrangement is acceptable, does not add up money, and does not
know what the bank's policy is. Those live in assess.py and in the learned
rules, so every verdict can be traced to either a quoted clause or a written
rule.
"""

from __future__ import annotations

import json
import re

import httpx

from covenant.config import JUDGE_MODEL, OLLAMA_URL
from covenant.dora import ALL_PROVISIONS, required_for

STATUSES = ("present", "inadequate", "absent")

SYSTEM = """You are a contract analyst reading an ICT third-party agreement for an EU bank.

For each provision you are asked about, decide one of:
  "present"     the contract contains a clause that fully satisfies the requirement
  "inadequate"  a related clause exists but falls short of the requirement
  "absent"      no clause addresses the requirement at all

Rules you must follow:
- Quote verbatim from the contract. Never paraphrase into the quote field.
- If you cannot find supporting text, the status is "absent" and quote is null.
- "inadequate" is the right answer when a clause is limited, conditional,
  discretionary, or narrower than what was asked for. Read carefully: a clause
  that sounds reassuring but is capped, optional or one-sided is inadequate.
- Do not judge whether the contract as a whole is acceptable. Only report what
  the text does and does not say.

Return ONLY JSON. No markdown, no commentary."""


def _requirements_block(critical: bool) -> str:
    lines = []
    for key, spec in required_for(critical).items():
        lines.append(f'  "{key}"  (DORA Art {spec["article"]}) — {spec["looks_for"]}')
    return "\n".join(lines)


def extract_provisions(text: str, critical: bool) -> dict:
    """Returns {provision_key: {status, quote, section}}."""
    required = required_for(critical)
    schema = {
        key: {"status": "one of present|inadequate|absent", "quote": "verbatim text or null", "section": "clause heading or null"}
        for key in required
    }
    user = (
        f"This arrangement {'DOES' if critical else 'does NOT'} support a critical or "
        f"important function, so you must assess the following "
        f"{len(required)} provisions:\n\n"
        + _requirements_block(critical)
        + "\n\nReturn JSON with exactly these keys:\n"
        + json.dumps(schema, indent=2)
        + "\n\nCONTRACT:\n"
        + text
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
    with httpx.Client(timeout=600.0) as client:
        r = client.post(f"{OLLAMA_URL}/api/chat", json=payload)
        r.raise_for_status()
        content = r.json().get("message", {}).get("content") or ""
    return _normalise(_parse_json(content), required)


def _normalise(data: dict, required: dict) -> dict:
    """Never trust the shape. Missing or malformed keys read as absent."""
    out: dict[str, dict] = {}
    for key in required:
        raw = data.get(key)
        if not isinstance(raw, dict):
            out[key] = {"status": "absent", "quote": None, "section": None}
            continue
        status = str(raw.get("status") or "").strip().lower()
        if status not in STATUSES:
            status = "absent"
        quote = raw.get("quote")
        quote = str(quote).strip() if quote else None
        if quote in ("", "null", "None"):
            quote = None
        if status != "absent" and not quote:
            # A claim with no text behind it is not evidence.
            status = "absent"
        section = raw.get("section")
        section = str(section).strip() if section else None
        out[key] = {
            "status": status,
            "quote": quote[:700] if quote else None,
            "section": section[:120] if section else None,
            "article": ALL_PROVISIONS[key]["article"],
        }
    return out


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

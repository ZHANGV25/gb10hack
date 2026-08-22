from __future__ import annotations

from difflib import SequenceMatcher

WATCHLIST = [
    "Viktor Kovalenko",
    "Marina Petrovic",
    "Omar Al-Rashid",
    "Chen Wei Holdings",
]

HIGH_RISK = {"IR", "KP", "SY", "CU"}


def name_score(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def best_watchlist_hit(name: str) -> tuple[str, float]:
    ranked = [(w, name_score(name, w)) for w in WATCHLIST]
    ranked.sort(key=lambda x: x[1], reverse=True)
    return ranked[0]


def screen_customer(customer: dict, txns: list[dict]) -> list[dict]:
    """Deterministic. The model never chooses whether an alert exists."""
    hits: list[dict] = []
    name = customer["name"]
    listed, score = best_watchlist_hit(name)
    if score >= 0.99:
        hits.append(
            {
                "rule_id": "RED_FLAG_SANCTIONS",
                "reason": f"Exact watchlist match: '{name}' equals '{listed}'.",
                "severity": "red_flag",
                "score": score,
                "watchlist_name": listed,
            }
        )
    elif score >= 0.78:
        hits.append(
            {
                "rule_id": "WATCHLIST_FUZZY",
                "reason": f"Name '{name}' fuzzy-matches watchlist '{listed}' (score {score:.2f}).",
                "severity": "review",
                "score": score,
                "watchlist_name": listed,
            }
        )
    elif score >= 0.52:
        hits.append(
            {
                "rule_id": "WATCHLIST_WEAK",
                "reason": f"Weak name proximity to '{listed}' (score {score:.2f}). Likely noise.",
                "severity": "noise",
                "score": score,
                "watchlist_name": listed,
            }
        )

    risky = [t for t in txns if t.get("country") in HIGH_RISK and t.get("amount_eur", 0) >= 25000]
    if risky:
        t = max(risky, key=lambda x: x["amount_eur"])
        hits.append(
            {
                "rule_id": "HIGH_RISK_CORRIDOR",
                "reason": f"EUR {t['amount_eur']:,.0f} to {t['country']} on {t['ts'][:10]}.",
                "severity": "review",
                "score": 0.7,
                "txn_id": t["txn_id"],
            }
        )

    near = [t for t in txns if 9000 <= t.get("amount_eur", 0) <= 9999]
    if len(near) >= 3:
        hits.append(
            {
                "rule_id": "STRUCTURING",
                "reason": f"{len(near)} transfers just under EUR 10,000 in the window.",
                "severity": "review",
                "score": 0.65,
            }
        )

    return hits

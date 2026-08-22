from __future__ import annotations

from difflib import SequenceMatcher

WATCHLIST = [
    "Viktor Kovalenko",
    "Marina Petrovic",
    "Omar Al-Rashid",
    "Chen Wei Holdings",
]

HIGH_RISK = {"IR", "KP", "SY", "CU"}

COUNTRY_NAMES = {
    "DE": "Germany",
    "FR": "France",
    "NL": "Netherlands",
    "IT": "Italy",
    "ES": "Spain",
    "AT": "Austria",
    "BE": "Belgium",
    "IE": "Ireland",
    "PL": "Poland",
    "IR": "Iran",
    "CY": "Cyprus",
    "TR": "Turkey",
    "SY": "Syria",
    "KP": "North Korea",
    "CU": "Cuba",
}


def country_name(code: str) -> str:
    return COUNTRY_NAMES.get(code, code)


def name_score(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def best_watchlist_hit(name: str) -> tuple[str, float]:
    ranked = [(w, name_score(name, w)) for w in WATCHLIST]
    ranked.sort(key=lambda x: x[1], reverse=True)
    return ranked[0]


def screen_customer(customer: dict, txns: list[dict]) -> list[dict]:
    """Rules only. The language model never chooses whether an alert exists."""
    hits: list[dict] = []
    name = customer["name"]
    listed, score = best_watchlist_hit(name)
    if score >= 0.99:
        hits.append(
            {
                "rule_id": "RED_FLAG_SANCTIONS",
                "reason": (
                    f"The legal name on this account is an exact match to "
                    f"{listed} on the sanctions list."
                ),
                "headline": "On the sanctions list",
                "severity": "red_flag",
                "score": score,
                "watchlist_name": listed,
            }
        )
    elif score >= 0.78:
        hits.append(
            {
                "rule_id": "WATCHLIST_FUZZY",
                "reason": (
                    f"This name is similar to {listed} on the sanctions list. "
                    f"It may be a different person."
                ),
                "headline": "Name similar to a sanctioned person",
                "severity": "review",
                "score": score,
                "watchlist_name": listed,
            }
        )
    elif score >= 0.52:
        hits.append(
            {
                "rule_id": "WATCHLIST_WEAK",
                "reason": (
                    f"This name is only loosely similar to {listed} on the "
                    f"sanctions list. It is likely a different person."
                ),
                "headline": "Possible name match — likely a different person",
                "severity": "noise",
                "score": score,
                "watchlist_name": listed,
            }
        )

    risky = [t for t in txns if t.get("country") in HIGH_RISK and t.get("amount_eur", 0) >= 25000]
    if risky:
        t = max(risky, key=lambda x: x["amount_eur"])
        amount = t["amount_eur"]
        dest = country_name(str(t["country"]))
        hits.append(
            {
                "rule_id": "HIGH_RISK_CORRIDOR",
                "reason": (
                    f"A payment of €{amount:,.0f} was sent to a counterparty "
                    f"in {dest}."
                ),
                "headline": f"Large payment to {dest}",
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
                "reason": (
                    f"{len(near)} outgoing payments were just under the "
                    f"€10,000 reporting threshold, in a short window."
                ),
                "headline": "Several payments just under €10,000",
                "severity": "review",
                "score": 0.65,
            }
        )

    return hits

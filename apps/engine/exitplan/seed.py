from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone

from exitplan.corpus import CORPUS
from exitplan.db import (
    alerts,
    corpus,
    customers,
    dispositions,
    ensure_indexes,
    transactions,
)
from exitplan.embed import embed_text
from exitplan.screen import best_watchlist_hit, screen_customer
from exitplan.audit import log_event

FIRST = [
    "Anna", "Jonas", "Elena", "Lukas", "Sofia", "Mateo", "Nora", "Paul",
    "Ines", "Theo", "Mila", "Oscar", "Hana", "Felix", "Clara", "Nils",
]
LAST = [
    "Berg", "Kowalski", "Nielsen", "Rossi", "Dupont", "Keller", "Novak",
    "Silva", "Horvath", "Lindgren", "Costa", "Meyer", "Kovacs", "Andersen",
]
COUNTRIES = ["DE", "FR", "NL", "IT", "ES", "AT", "BE", "IE", "PL", "IR", "CY"]


def _ts(rng: random.Random, days: int = 40) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=rng.randint(0, days), hours=rng.randint(0, 23))


def seed(n_customers: int = 160) -> dict:
    ensure_indexes()
    rng = random.Random(28)
    customers().delete_many({})
    transactions().delete_many({})
    alerts().delete_many({})
    dispositions().delete_many({})
    corpus().delete_many({})

    for doc in CORPUS:
        corpus().replace_one(
            {"doc_id": doc["doc_id"]},
            {**doc, "embedding": embed_text(doc["title"] + " " + doc["text"])},
            upsert=True,
        )

    people: list[dict] = []
    people.append(
        {
            "customer_id": "C-REDFLAG",
            "name": "Viktor Kovalenko",
            "city": "Hamburg",
            "risk_segment": "high",
            "kyc": "Synthetic KYC. Occupation: import broker. Onboarding 2024-11.",
        }
    )
    people.append(
        {
            "customer_id": "C-FUZZY",
            "name": "Viktor Kovalev",
            "city": "Berlin",
            "risk_segment": "medium",
            "kyc": "Synthetic KYC. Occupation: logistics. Onboarding 2023-04.",
        }
    )
    for i in range(n_customers):
        people.append(
            {
                "customer_id": f"C-{i:04d}",
                "name": f"{rng.choice(FIRST)} {rng.choice(LAST)}",
                "city": rng.choice(["Munich", "Frankfurt", "Cologne", "Vienna", "Amsterdam"]),
                "risk_segment": rng.choice(["low", "low", "low", "medium"]),
                "kyc": "Synthetic KYC. Retail current account. No adverse media.",
            }
        )

    for p in people:
        customers().insert_one({**p, "synthetic": True})
        n_tx = rng.randint(4, 9)
        for j in range(n_tx):
            amount = rng.choice([120.0, 540.0, 1800.0, 4200.0, 9100.0, 9600.0, 28000.0, 61000.0])
            country = rng.choice(COUNTRIES)
            if p["customer_id"] == "C-REDFLAG":
                amount = 61000.0
                country = "IR"
            if p["customer_id"] == "C-FUZZY" and j < 3:
                amount = 9400.0
                country = "DE"
            transactions().insert_one(
                {
                    "txn_id": f"{p['customer_id']}-T{j:02d}",
                    "customer_id": p["customer_id"],
                    "amount_eur": amount,
                    "country": country,
                    "counterparty": "Synthetic counterparty",
                    "ts": _ts(rng).isoformat(),
                    "synthetic": True,
                }
            )

    n_alerts = 0
    for p in people:
        txns = list(transactions().find({"customer_id": p["customer_id"]}))
        hits = screen_customer(p, txns)
        if not hits:
            listed, score = best_watchlist_hit(p["name"])
            hits = [
                {
                    "rule_id": "WATCHLIST_WEAK",
                    "reason": f"Weak name proximity to '{listed}' (score {score:.2f}). Likely noise.",
                    "severity": "noise",
                    "score": score,
                    "watchlist_name": listed,
                }
            ]
        primary = sorted(hits, key=lambda h: {"red_flag": 3, "review": 2, "noise": 1}[h["severity"]], reverse=True)[0]
        alert_id = f"ALT-{n_alerts + 1:04d}"
        n_alerts += 1
        demo_role = "queue"
        if p["customer_id"] == "C-REDFLAG":
            demo_role = "red_flag"
        elif p["customer_id"] == "C-FUZZY":
            demo_role = "review"
        doc = {
            "alert_id": alert_id,
            "customer_id": p["customer_id"],
            "customer_name": p["name"],
            "hits": hits,
            "rule_id": primary["rule_id"],
            "reason": primary["reason"],
            "severity": primary["severity"],
            "status": "open",
            "demo_role": demo_role,
            "synthetic": True,
            "created_at": datetime.now(timezone.utc),
        }
        alerts().insert_one(doc)
        log_event(
            agent="screener",
            action="raise_alert",
            alert_id=alert_id,
            payload={"rule_id": primary["rule_id"], "severity": primary["severity"]},
            rationale=primary["reason"],
        )
        _seed_draft(doc, p, txns)

    return {
        "customers": customers().count_documents({}),
        "transactions": transactions().count_documents({}),
        "alerts": alerts().count_documents({}),
        "corpus": corpus().count_documents({}),
    }


def _seed_draft(alert: dict, customer: dict, txns: list[dict]) -> None:
    """Deterministic cited draft. Live Nemotron can regenerate in the UI."""
    sev = alert["severity"]
    if sev == "red_flag":
        narrative = (
            "The screener fired RED_FLAG_SANCTIONS because the customer name is an exact watchlist match "
            "[Internal policy §4.2 — watchlist hits]. The agent cannot close or file this case "
            "[AMLR Art 18(3) — decisions cannot be outsourced]. Recommended human action: decide and, if "
            "appropriate, file with the FIU. Insufficient for the model to proceed."
        )
        abstain = True
        citations = [
            {"doc_id": "policy-watchlist", "title": "Internal policy §4.2 — watchlist hits"},
            {"doc_id": "amlr-18-3", "title": "AMLR Art 18(3) — decisions cannot be outsourced"},
        ]
    elif sev == "review":
        narrative = (
            f"The deterministic screener — not the model — raised {alert['rule_id']}: {alert['reason']} "
            "[Internal policy §4.2 — watchlist hits]. Analysis may be assisted; reporting may not "
            "[AMLR Art 18(3) — decisions cannot be outsourced]. Draft recommendation: escalate to the MLRO "
            "for a human decision."
        )
        abstain = False
        citations = [
            {"doc_id": "policy-watchlist", "title": "Internal policy §4.2 — watchlist hits"},
            {"doc_id": "amlr-18-3", "title": "AMLR Art 18(3) — decisions cannot be outsourced"},
        ]
    else:
        narrative = (
            f"Weak screener hit ({alert['rule_id']}). Policy treats scores in this band as presumed noise "
            "unless corroborated [Internal policy §4.2 — watchlist hits]. Evidence is insufficient to "
            "assert suspicion [Internal policy §1.4 — abstention]. Draft recommendation: close as noise, "
            "human still decides."
        )
        abstain = True
        citations = [
            {"doc_id": "policy-watchlist", "title": "Internal policy §4.2 — watchlist hits"},
            {"doc_id": "policy-abstain", "title": "Internal policy §1.4 — abstention"},
        ]
    dispositions().insert_one(
        {
            "alert_id": alert["alert_id"],
            "narrative": narrative,
            "citations": citations,
            "abstain": abstain,
            "human_decision": None,
            "filed": False,
            "model": "template+screener",
            "created_at": datetime.now(timezone.utc),
        }
    )
    log_event(
        agent="drafter",
        action="draft",
        alert_id=alert["alert_id"],
        payload={"abstain": abstain, "citations": [c["doc_id"] for c in citations]},
        rationale="Seeded cited draft. Human has not decided.",
    )

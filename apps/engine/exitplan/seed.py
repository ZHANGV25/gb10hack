from __future__ import annotations

from datetime import datetime, timedelta, timezone

from exitplan.audit import log_event
from exitplan.corpus import CORPUS
from exitplan.db import (
    alerts,
    audit_log,
    corpus,
    customers,
    dispositions,
    ensure_indexes,
    transactions,
)
from exitplan.embed import embed_text
from exitplan.screen import screen_customer

BOOK: list[dict] = [
    {
        "customer_id": "C-SANCTIONS",
        "name": "Viktor Kovalenko",
        "city": "Hamburg",
        "risk_segment": "high",
        "occupation": "Import broker",
        "kyc": (
            "Import broker, Hamburg branch. Onboarded November 2024. "
            "Enhanced due diligence is on file."
        ),
        "story": (
            "Viktor Kovalenko holds a current account used for import brokerage. "
            "Monitoring compared the legal name on the account to the sanctions "
            "list and found an exact match. There is also a large payment to a "
            "trading company in Iran."
        ),
        "txns": [
            {
                "days": 3,
                "amount": 61000.0,
                "country": "IR",
                "counterparty": "Pars International Trading Co.",
            },
            {
                "days": 18,
                "amount": 28000.0,
                "country": "TR",
                "counterparty": "Bosphorus Freight Ltd.",
            },
            {
                "days": 24,
                "amount": 1800.0,
                "country": "DE",
                "counterparty": "Hamburg Port Authority",
            },
        ],
    },
    {
        "customer_id": "C-STRUCTURING",
        "name": "Elena Rossi",
        "city": "Munich",
        "risk_segment": "medium",
        "occupation": "Restaurant owner",
        "kyc": (
            "Sole director of Osteria Rossi, Munich. Onboarded 2021. "
            "Hospitality account; cash-intensive business."
        ),
        "story": (
            "Elena Rossi runs a restaurant in Munich. In six days she sent three "
            "payments of just under €10,000 to the same private account. That "
            "pattern is how cash is often moved without triggering a report."
        ),
        "txns": [
            {
                "days": 2,
                "amount": 9400.0,
                "country": "DE",
                "counterparty": "Private account — M. Bianchi",
            },
            {
                "days": 4,
                "amount": 9650.0,
                "country": "DE",
                "counterparty": "Private account — M. Bianchi",
            },
            {
                "days": 6,
                "amount": 9100.0,
                "country": "DE",
                "counterparty": "Private account — M. Bianchi",
            },
            {
                "days": 12,
                "amount": 540.0,
                "country": "DE",
                "counterparty": "METRO Cash & Carry",
            },
            {
                "days": 20,
                "amount": 2800.0,
                "country": "DE",
                "counterparty": "Hausverwaltung König — rent",
            },
        ],
    },
    {
        "customer_id": "C-CORRIDOR",
        "name": "Jonas Berg",
        "city": "Frankfurt",
        "risk_segment": "medium",
        "occupation": "Machinery exporter",
        "kyc": (
            "Director, Berg Maschinenexport GmbH. Onboarded 2019. "
            "Trade-finance customer, Frankfurt."
        ),
        "story": (
            "Jonas Berg exports industrial machinery. Last week the company sent "
            "€61,000 to a supplier in Iran. Payments of this size to that "
            "country are treated as high-risk until an analyst reviews them."
        ),
        "txns": [
            {
                "days": 5,
                "amount": 61000.0,
                "country": "IR",
                "counterparty": "Kish Industrial Supply — invoice 4419",
            },
            {
                "days": 11,
                "amount": 1800.0,
                "country": "NL",
                "counterparty": "Port of Rotterdam",
            },
            {
                "days": 19,
                "amount": 420.0,
                "country": "DE",
                "counterparty": "Commerzbank — charges",
            },
        ],
    },
    {
        "customer_id": "C-SIMILAR",
        "name": "Viktor Kovalev",
        "city": "Berlin",
        "risk_segment": "low",
        "occupation": "Warehouse manager",
        "kyc": (
            "Warehouse manager at a Berlin logistics firm. Onboarded April 2023. "
            "Salary account plus a small current account."
        ),
        "story": (
            "Viktor Kovalev is a warehouse manager in Berlin. His name looks "
            "like Viktor Kovalenko, who is on the sanctions list. His payments "
            "are ordinary salary, rent, and freight. This is often a different person."
        ),
        "txns": [
            {
                "days": 1,
                "amount": 3200.0,
                "country": "DE",
                "counterparty": "Berliner Logistik GmbH — salary",
            },
            {
                "days": 3,
                "amount": 1450.0,
                "country": "DE",
                "counterparty": "Wohnbau Mitte — rent",
            },
            {
                "days": 8,
                "amount": 1400.0,
                "country": "PL",
                "counterparty": "DHL Freight Poland",
            },
            {
                "days": 14,
                "amount": 89.0,
                "country": "DE",
                "counterparty": "REWE — groceries",
            },
        ],
    },
    {
        "customer_id": "C-SIMILAR-2",
        "name": "Omar Rashid",
        "city": "Cologne",
        "risk_segment": "low",
        "occupation": "Dentist",
        "kyc": (
            "Principal of Praxis Rashid, Cologne. Onboarded 2018. "
            "Professional current account."
        ),
        "story": (
            "Omar Rashid is a dentist in Cologne. The sanctions list contains "
            "Omar Al-Rashid, a similar name. Card settlements and lab bills on "
            "this account look like a medical practice, not a listed person."
        ),
        "txns": [
            {
                "days": 2,
                "amount": 4200.0,
                "country": "DE",
                "counterparty": "Visa Europe — card settlement",
            },
            {
                "days": 7,
                "amount": 1800.0,
                "country": "DE",
                "counterparty": "Rhein Dental Labor",
            },
            {
                "days": 15,
                "amount": 2100.0,
                "country": "DE",
                "counterparty": "Kölner Immobilien — rent",
            },
        ],
    },
    {
        "customer_id": "C-SIMILAR-3",
        "name": "Marina Petrova",
        "city": "Vienna",
        "risk_segment": "low",
        "occupation": "Piano teacher",
        "kyc": (
            "Private banking, Vienna. Onboarded 2020. Declared occupation: "
            "music teacher."
        ),
        "story": (
            "Marina Petrova teaches piano in Vienna. The list contains Marina "
            "Petrovic. Incoming lesson fees and a rent payment do not, on their "
            "own, confirm they are the same person."
        ),
        "txns": [
            {
                "days": 4,
                "amount": 540.0,
                "country": "AT",
                "counterparty": "Lesson fees — several pupils",
            },
            {
                "days": 9,
                "amount": 980.0,
                "country": "AT",
                "counterparty": "Wiener Wohnen — rent",
            },
            {
                "days": 21,
                "amount": 120.0,
                "country": "AT",
                "counterparty": "Musikhaus Doblinger",
            },
        ],
    },
    {
        "customer_id": "C-NOISE-1",
        "name": "Marina Petersen",
        "city": "Amsterdam",
        "risk_segment": "low",
        "occupation": "Retail customer",
        "kyc": (
            "Retail current account, Amsterdam. Onboarded 2022. "
            "No adverse media on file."
        ),
        "story": (
            "Marina Petersen is a retail customer in Amsterdam. The name only "
            "loosely resembles Marina Petrovic on the sanctions list. Everyday "
            "card spend is on the account. This is usually a false match."
        ),
        "txns": [
            {
                "days": 2,
                "amount": 64.0,
                "country": "NL",
                "counterparty": "Albert Heijn",
            },
            {
                "days": 6,
                "amount": 120.0,
                "country": "NL",
                "counterparty": "NS — train tickets",
            },
            {
                "days": 16,
                "amount": 890.0,
                "country": "NL",
                "counterparty": "ING — own savings",
            },
        ],
    },
    {
        "customer_id": "C-NOISE-2",
        "name": "Chen Wei",
        "city": "Frankfurt",
        "risk_segment": "low",
        "occupation": "Software engineer",
        "kyc": (
            "Employee current account. Onboarded 2024 after relocating from "
            "Singapore. Employer: a Frankfurt software firm."
        ),
        "story": (
            "Chen Wei is an employee in Frankfurt. The sanctions list names a "
            "company, Chen Wei Holdings — not this person. Salary and rent are "
            "the only material payments."
        ),
        "txns": [
            {
                "days": 1,
                "amount": 5400.0,
                "country": "DE",
                "counterparty": "Rhine Soft GmbH — salary",
            },
            {
                "days": 5,
                "amount": 1650.0,
                "country": "DE",
                "counterparty": "Vonovia — rent",
            },
            {
                "days": 12,
                "amount": 48.0,
                "country": "DE",
                "counterparty": "Deutsche Bahn",
            },
        ],
    },
]


def _when(days: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days, hours=10)


def seed() -> dict:
    ensure_indexes()
    customers().delete_many({})
    transactions().delete_many({})
    alerts().delete_many({})
    dispositions().delete_many({})
    corpus().delete_many({})
    audit_log().delete_many({})

    for doc in CORPUS:
        corpus().replace_one(
            {"doc_id": doc["doc_id"]},
            {**doc, "embedding": embed_text(doc["title"] + " " + doc["text"])},
            upsert=True,
        )

    n_alerts = 0
    for person in BOOK:
        customers().insert_one(
            {
                "customer_id": person["customer_id"],
                "name": person["name"],
                "city": person["city"],
                "risk_segment": person["risk_segment"],
                "occupation": person["occupation"],
                "kyc": person["kyc"],
            }
        )
        tx_docs = []
        for i, t in enumerate(person["txns"]):
            doc = {
                "txn_id": f"{person['customer_id']}-T{i:02d}",
                "customer_id": person["customer_id"],
                "amount_eur": t["amount"],
                "country": t["country"],
                "counterparty": t["counterparty"],
                "ts": _when(t["days"]).isoformat(),
            }
            transactions().insert_one(doc)
            tx_docs.append(doc)

        hits = screen_customer(person, tx_docs)
        if not hits:
            continue
        primary = sorted(
            hits,
            key=lambda h: {"red_flag": 3, "review": 2, "noise": 1}[h["severity"]],
            reverse=True,
        )[0]
        n_alerts += 1
        alert_id = f"ALT-{n_alerts:04d}"
        alert = {
            "alert_id": alert_id,
            "customer_id": person["customer_id"],
            "customer_name": person["name"],
            "occupation": person["occupation"],
            "headline": primary.get("headline") or primary["reason"],
            "story": person["story"],
            "hits": hits,
            "rule_id": primary["rule_id"],
            "reason": primary["reason"],
            "severity": primary["severity"],
            "status": "open",
            "created_at": datetime.now(timezone.utc),
        }
        alerts().insert_one(alert)
        log_event(
            agent="monitoring",
            action="raise_alert",
            alert_id=alert_id,
            payload={"rule_id": primary["rule_id"], "severity": primary["severity"]},
            rationale=primary["reason"],
        )
        _seed_draft(alert, person)

    return {
        "customers": customers().count_documents({}),
        "transactions": transactions().count_documents({}),
        "alerts": alerts().count_documents({}),
        "corpus": corpus().count_documents({}),
    }


def _seed_draft(alert: dict, customer: dict) -> None:
    rule = alert["rule_id"]
    name = customer["name"]
    if rule == "RED_FLAG_SANCTIONS":
        narrative = (
            f"{name} is an exact match to a person on the sanctions list "
            "[Internal policy §4.2 — watchlist hits]. Dismissal is not permitted. "
            "An analyst must refer the case or submit a SAR "
            "[AMLR Art 18(3) — decisions cannot be outsourced]."
        )
        abstain = True
        citations = [
            {"doc_id": "policy-watchlist", "title": "Internal policy §4.2 — watchlist hits"},
            {"doc_id": "amlr-18-3", "title": "AMLR Art 18(3) — decisions cannot be outsourced"},
        ]
    elif rule == "STRUCTURING":
        narrative = (
            f"{name} sent several payments just under €10,000 in a short window "
            "[Internal policy §6.1 — structuring]. That pattern is used to avoid "
            "a cash report. Recommend referring to the MLRO. Do not submit a SAR "
            "automatically [AMLR Art 18(3) — decisions cannot be outsourced]."
        )
        abstain = False
        citations = [
            {"doc_id": "policy-structuring", "title": "Internal policy §6.1 — structuring"},
            {"doc_id": "amlr-18-3", "title": "AMLR Art 18(3) — decisions cannot be outsourced"},
        ]
    elif rule == "HIGH_RISK_CORRIDOR":
        narrative = (
            f"{name} sent a large payment to a high-risk country "
            "[Internal policy §4.2 — watchlist hits]. Trade can be legitimate; "
            "the destination still requires a human review. Recommend referring "
            "to the MLRO [AMLR Art 18(3) — decisions cannot be outsourced]."
        )
        abstain = False
        citations = [
            {"doc_id": "policy-watchlist", "title": "Internal policy §4.2 — watchlist hits"},
            {"doc_id": "amlr-18-3", "title": "AMLR Art 18(3) — decisions cannot be outsourced"},
        ]
    elif rule == "WATCHLIST_FUZZY":
        narrative = (
            f"{name} is similar to a name on the sanctions list "
            "[Internal policy §4.2 — watchlist hits]. Similar names are common "
            "false matches. Recommend the MLRO confirm identity before any report "
            "[AMLR Art 18(3) — decisions cannot be outsourced]."
        )
        abstain = False
        citations = [
            {"doc_id": "policy-watchlist", "title": "Internal policy §4.2 — watchlist hits"},
            {"doc_id": "amlr-18-3", "title": "AMLR Art 18(3) — decisions cannot be outsourced"},
        ]
    else:
        narrative = (
            f"The name on this account is only loosely similar to a listed name "
            "[Internal policy §4.2 — watchlist hits]. Unless payments corroborate "
            "suspicion, policy treats this as a false match "
            "[Internal policy §1.4 — abstention]. Recommend dismiss."
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
            "model": "template",
            "created_at": datetime.now(timezone.utc),
        }
    )
    log_event(
        agent="drafter",
        action="draft",
        alert_id=alert["alert_id"],
        payload={"abstain": abstain, "citations": [c["doc_id"] for c in citations]},
        rationale="Disposition drafted. Awaiting analyst action.",
    )

from __future__ import annotations

CORPUS = [
    {
        "doc_id": "dora-28-8",
        "title": "DORA Art 28(8) — in-house reincorporation",
        "source": "Regulation (EU) 2022/2554 Art. 28(8)",
        "text": (
            "Financial entities shall ensure that they are able to exit ICT third-party arrangements "
            "without disruption to their activities. Transition plans shall enable them to remove the "
            "contracted ICT services and the relevant data from the ICT third-party service provider "
            "and to securely and integrally transfer them to alternative providers or reincorporate "
            "them in-house."
        ),
    },
    {
        "doc_id": "dora-30-3",
        "title": "DORA Art 30(3)(f)(ii) — change to in-house solutions",
        "source": "Regulation (EU) 2022/2554 Art. 30(3)(f)(ii)",
        "text": (
            "The contractual arrangements on the use of ICT services shall include a clear exit strategy, "
            "in particular an obligation on the ICT third-party service provider to provide sufficient "
            "support to enable the financial entity to migrate to another ICT third-party service "
            "provider or change to in-house solutions."
        ),
    },
    {
        "doc_id": "amlr-18-3",
        "title": "AMLR Art 18(3) — decisions cannot be outsourced",
        "source": "Regulation (EU) 2024/1624 Art. 18(3)",
        "text": (
            "Obliged entities shall not outsource the approval of detection criteria, customer "
            "risk-profile decisions, or the reporting to the FIU of suspicious activities pursuant "
            "to Article 69. Analysis and triage may be assisted by tools. A human decides and files."
        ),
    },
    {
        "doc_id": "policy-watchlist",
        "title": "Internal policy §4.2 — watchlist hits",
        "source": "Nordhafen Bank AML Policy §4.2 (synthetic)",
        "text": (
            "Exact sanctions-list matches are red flags. The model may draft a narrative but cannot "
            "close, waive, or file. The analyst must decide. Weak fuzzy matches below 0.78 are presumed "
            "noise unless corroborated by a high-risk corridor or structuring pattern."
        ),
    },
    {
        "doc_id": "policy-structuring",
        "title": "Internal policy §6.1 — structuring",
        "source": "Nordhafen Bank AML Policy §6.1 (synthetic)",
        "text": (
            "Three or more transfers in a rolling seven-day window between EUR 9,000 and EUR 9,999 "
            "are a structuring indicator. Escalate to the MLRO. Do not file a SAR automatically."
        ),
    },
    {
        "doc_id": "policy-abstain",
        "title": "Internal policy §1.4 — abstention",
        "source": "Nordhafen Bank AML Policy §1.4 (synthetic)",
        "text": (
            "If evidence is insufficient to distinguish noise from suspicion, the required disposition "
            "is abstain and escalate. Insufficient evidence is a first-class answer. The agent never "
            "invents a predicate offence."
        ),
    },
]

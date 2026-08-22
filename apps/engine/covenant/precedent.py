"""Prior decisions the bank's third-party risk function has already taken.

These are not code. Each one is a sentence a named reviewer wrote when they
disagreed with the checklist, kept as an embedded rule the agent retrieves by
meaning. They encode judgement the checklist cannot hold: what a clause has to
actually deliver before it counts, and where the bank has decided a gap is
tolerable.

A rule only fires on a provision the checklist already found missing, so a
deep memory does not make the agent trigger-happy — it makes retrieval
selective, because now there is a real pool to choose from.
"""

from __future__ import annotations

PRECEDENT: list[dict] = [
    {
        "text": (
            "Where a critical or important arrangement lets the supplier move processing "
            "between countries at its own discretion, the bank cannot evidence where its "
            "data is held and cannot answer a supervisor. Treat an undisclosed or "
            "discretionary processing location on a critical arrangement as a rejection, "
            "not an escalation."
        ),
        "action": "reject",
        "provision": "locations_disclosed",
        "scope": "critical",
        "author": "M. Halvorsen, Third-Party Risk",
        "days_ago": 96,
    },
    {
        "text": (
            "A missing security awareness participation clause on a non-critical "
            "arrangement is a real gap but not a material one: the supplier's staff do not "
            "touch a critical or important function. Record it and approve, provided no "
            "blocking provision is also missing."
        ),
        "action": "accept_exception",
        "provision": "security_training",
        "scope": "non_critical",
        "author": "M. Halvorsen, Third-Party Risk",
        "days_ago": 61,
    },
    {
        "text": (
            "A right to receive the supplier's own SOC 2 report is not an audit right. "
            "Article 30(3)(e) requires unrestricted access for the bank, its appointed "
            "third party and the competent authority. A clause that caps inspections by "
            "frequency, or excludes premises and systems, does not satisfy it."
        ),
        "action": "reject",
        "provision": "audit_rights",
        "scope": "critical",
        "author": "P. Lindqvist, Internal Audit",
        "days_ago": 133,
    },
    {
        "text": (
            "Returning data in the supplier's own proprietary export format is not return "
            "in an accessible format. If the bank would have to buy conversion services "
            "from the outgoing supplier to read its own records, the exit is not real."
        ),
        "action": "reject",
        "provision": "data_return",
        "scope": "all",
        "author": "P. Lindqvist, Internal Audit",
        "days_ago": 118,
    },
    {
        "text": (
            "Incident assistance billed at the supplier's standard professional services "
            "rates is not assistance at no additional or pre-agreed cost. During an ICT "
            "incident the bank must not be negotiating a rate card."
        ),
        "action": "escalate",
        "provision": "incident_assistance",
        "scope": "all",
        "author": "S. Okafor, Operational Resilience",
        "days_ago": 87,
    },
    {
        "text": (
            "Service levels expressed as best efforts, commercially reasonable efforts or "
            "industry standard are not quantitative performance targets. Without a number "
            "there is nothing to measure and no service credit can ever be claimed."
        ),
        "action": "escalate",
        "provision": "performance_targets",
        "scope": "critical",
        "author": "S. Okafor, Operational Resilience",
        "days_ago": 74,
    },
    {
        "text": (
            "A contingency plan the supplier is not obliged to test is a document, not a "
            "control. For a critical function require annual testing and the right to see "
            "the results, otherwise escalate to the Board Risk Committee."
        ),
        "action": "escalate",
        "provision": "contingency_plans",
        "scope": "critical",
        "author": "S. Okafor, Operational Resilience",
        "days_ago": 66,
    },
    {
        "text": (
            "A supplier that will not undertake to cooperate with the bank's competent "
            "authorities cannot support a regulated activity. This is not negotiable and "
            "is not a gap to schedule for the next contract review."
        ),
        "action": "reject",
        "provision": "authority_cooperation",
        "scope": "critical",
        "author": "M. Halvorsen, Third-Party Risk",
        "days_ago": 52,
    },
    {
        "text": (
            "Notification of a materially adverse development within a period measured in "
            "business days is too slow for a critical function. The bank's own incident "
            "reporting clock starts when the incident occurs, not when the supplier gets "
            "around to mentioning it."
        ),
        "action": "escalate",
        "provision": "provider_reporting",
        "scope": "critical",
        "author": "S. Okafor, Operational Resilience",
        "days_ago": 44,
    },
    {
        "text": (
            "Encryption in transit alone does not satisfy the availability, integrity and "
            "confidentiality requirement. Look for encryption at rest and a restriction on "
            "the supplier accessing bank data other than to perform the service."
        ),
        "action": "escalate",
        "provision": "data_protection",
        "scope": "all",
        "author": "P. Lindqvist, Internal Audit",
        "days_ago": 39,
    },
    {
        "text": (
            "A service description that names the deliverable but is silent on "
            "sub-contracting leaves the bank unable to know who is actually performing the "
            "service. On a commodity, non-data-bearing service this is tolerable; record "
            "it and approve."
        ),
        "action": "accept_exception",
        "provision": "service_description",
        "scope": "non_critical",
        "author": "M. Halvorsen, Third-Party Risk",
        "days_ago": 28,
    },
    {
        "text": (
            "Service levels that the supplier may revise unilaterally are not service "
            "levels. Any change must require the bank's agreement, otherwise the standard "
            "can be lowered to whatever the supplier is already delivering."
        ),
        "action": "escalate",
        "provision": "service_levels",
        "scope": "all",
        "author": "S. Okafor, Operational Resilience",
        "days_ago": 21,
    },
]

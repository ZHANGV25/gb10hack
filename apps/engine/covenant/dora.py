"""The DORA Article 30 contractual checklist.

Regulation (EU) 2022/2554 lists the provisions that *must* appear in an ICT
third-party arrangement. Article 30(2) applies to every arrangement;
Article 30(3) adds more where the contract supports a critical or important
function. Article 28(3) requires the entity to keep a register of all of them
and to mark which support critical or important functions.

This module is the catalogue. It is deliberately data, not logic: the
extractor asks the model whether each provision is present and to quote it,
and `assess.py` turns the answers into gaps. Nothing here does arithmetic and
nothing here decides — that keeps the reasoning auditable clause by clause.
"""

from __future__ import annotations

# key -> (article, short label, what a reviewer is actually looking for)
BASE_PROVISIONS: dict[str, dict] = {
    "service_description": {
        "article": "30(2)(a)",
        "label": "Clear description of the services",
        "looks_for": "A complete and clear description of all ICT services the provider supplies, and whether sub-outsourcing is permitted.",
    },
    "locations_disclosed": {
        "article": "30(2)(b)",
        "label": "Service and data locations disclosed",
        "looks_for": "The countries where services are performed and where data is processed and stored, plus notice before those locations change.",
    },
    "data_protection": {
        "article": "30(2)(c)",
        "label": "Availability, integrity and confidentiality of data",
        "looks_for": "Provisions guaranteeing the availability, authenticity, integrity and confidentiality of the entity's data.",
    },
    "data_return": {
        "article": "30(2)(d)",
        "label": "Access, recovery and return of data",
        "looks_for": "Guaranteed access to, recovery of and return of the entity's data in an accessible format on termination or provider insolvency.",
    },
    "service_levels": {
        "article": "30(2)(e)",
        "label": "Service level descriptions",
        "looks_for": "Descriptions of service levels, including updates and revisions.",
    },
    "incident_assistance": {
        "article": "30(2)(f)",
        "label": "Assistance on ICT incidents",
        "looks_for": "An obligation to assist the entity at no additional cost, or at a pre-agreed cost, when an ICT incident related to the service occurs.",
    },
    "authority_cooperation": {
        "article": "30(2)(g)",
        "label": "Cooperation with competent authorities",
        "looks_for": "An obligation to fully cooperate with the entity's competent authorities and resolution authorities.",
    },
    "termination_rights": {
        "article": "30(2)(h)",
        "label": "Termination rights and notice periods",
        "looks_for": "Termination rights and minimum notice periods, for both the provider and the entity.",
    },
    "security_training": {
        "article": "30(2)(i)",
        "label": "Security awareness participation",
        "looks_for": "Conditions for the provider to take part in the entity's ICT security awareness and digital operational resilience training.",
    },
}

# Only required where the arrangement supports a critical or important function.
CRITICAL_PROVISIONS: dict[str, dict] = {
    "performance_targets": {
        "article": "30(3)(a)",
        "label": "Quantitative performance targets",
        "looks_for": "Full service level descriptions with precise quantitative and qualitative performance targets, so performance can actually be measured.",
    },
    "provider_reporting": {
        "article": "30(3)(b)",
        "label": "Notice periods and reporting to the entity",
        "looks_for": "Notice periods and reporting obligations from the provider to the entity, including notice of developments that may materially affect performance.",
    },
    "contingency_plans": {
        "article": "30(3)(c)",
        "label": "Contingency plans and security measures",
        "looks_for": "An obligation to implement and test business contingency plans and to have ICT security measures appropriate to the service.",
    },
    "tlpt_cooperation": {
        "article": "30(3)(d)",
        "label": "Participation in threat-led penetration testing",
        "looks_for": "An obligation to participate in and fully cooperate with the entity's threat-led penetration testing.",
    },
    "audit_rights": {
        "article": "30(3)(e)",
        "label": "Unrestricted rights of access, inspection and audit",
        "looks_for": "The entity's right to monitor performance on an ongoing basis, with unrestricted rights of access, inspection and audit, exercisable by the entity or an appointed third party.",
    },
    "exit_strategy": {
        "article": "30(3)(f)",
        "label": "Exit strategy and transition period",
        "looks_for": "An exit strategy with a mandatory adequate transition period during which the provider keeps supplying the service, and support to migrate to another provider or bring the service back in-house.",
    },
}

ALL_PROVISIONS: dict[str, dict] = {**BASE_PROVISIONS, **CRITICAL_PROVISIONS}


def required_for(critical: bool) -> dict[str, dict]:
    """Which provisions this arrangement must carry."""
    return dict(ALL_PROVISIONS) if critical else dict(BASE_PROVISIONS)


def article_of(key: str) -> str:
    return ALL_PROVISIONS.get(key, {}).get("article", "")


def label_of(key: str) -> str:
    return ALL_PROVISIONS.get(key, {}).get("label", key)


# A missing provision is not equally serious in every case. These are the ones
# that make an arrangement unusable rather than merely deficient: without an
# exit route or an audit right the entity cannot discharge Art 28(8) at all.
BLOCKING = {"exit_strategy", "audit_rights", "data_return"}

SEVERITY: dict[str, str] = {
    key: ("blocking" if key in BLOCKING else "material") for key in ALL_PROVISIONS
}

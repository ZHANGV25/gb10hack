"""Nordhafen Bank's ICT third-party arrangements.

Contracts are assembled from shared clause boilerplate, the way real vendor
paper is. Each arrangement names the provisions it actually contains, so the
book doubles as ground truth: whatever a contract omits here is a genuine
DORA Article 30 gap the agent should find on its own from the text.

Synthetic. No real institution's agreements.
"""

from __future__ import annotations

# Standard clause text, keyed by the provision it satisfies. `{vendor}` and
# `{service}` are filled per contract.
CLAUSES: dict[str, tuple[str, str]] = {
    "service_description": (
        "1. Services",
        "The Supplier shall provide {service} to the Customer as described in Schedule 1 "
        "(Service Description). The Supplier shall not sub-contract any part of the Services "
        "without the Customer's prior written consent, and shall maintain a current register "
        "of all approved sub-contractors.",
    ),
    "locations_disclosed": (
        "2. Location of Services and Data",
        "The Services shall be performed from the Supplier's facilities in {locations}. "
        "Customer Data shall be processed and stored solely within {data_locations}. The "
        "Supplier shall give the Customer not less than ninety (90) days' written notice "
        "before any change to the countries in which the Services are performed or Customer "
        "Data is processed or stored.",
    ),
    "data_protection": (
        "3. Data Availability, Integrity and Confidentiality",
        "The Supplier shall implement and maintain technical and organisational measures "
        "ensuring the availability, authenticity, integrity and confidentiality of Customer "
        "Data, including encryption in transit and at rest, and shall not access Customer "
        "Data except as necessary to perform the Services.",
    ),
    "data_return": (
        "4. Access, Recovery and Return of Data",
        "At any time during the Term, and on expiry or termination for any reason including "
        "the Supplier's insolvency, the Supplier shall provide the Customer with access to, "
        "and shall recover and return, all Customer Data in a structured, commonly used and "
        "machine-readable format within thirty (30) days, and shall thereafter securely "
        "delete it and certify such deletion.",
    ),
    "service_levels": (
        "5. Service Levels",
        "The Supplier shall provide the Services in accordance with the service levels set "
        "out in Schedule 2, which shall be reviewed annually and updated to reflect changes "
        "in the Customer's requirements.",
    ),
    "incident_assistance": (
        "6. ICT Incident Assistance",
        "In the event of an ICT-related incident affecting the Services, the Supplier shall "
        "assist the Customer at no additional cost in investigating, containing and "
        "remediating the incident, and shall provide all information the Customer requires "
        "to meet its own incident reporting obligations.",
    ),
    "authority_cooperation": (
        "7. Cooperation with Authorities",
        "The Supplier shall fully cooperate with the Customer's competent authorities and "
        "resolution authorities, including by granting them, or persons appointed by them, "
        "such access to the Supplier's premises, systems and records as those authorities "
        "may require.",
    ),
    "termination_rights": (
        "8. Termination",
        "Either party may terminate this Agreement on twelve (12) months' written notice. "
        "The Customer may terminate immediately on written notice where the Supplier is in "
        "material breach, where a competent authority so directs, or where the Supplier can "
        "no longer meet applicable regulatory requirements.",
    ),
    "security_training": (
        "9. Security Awareness",
        "Supplier personnel assigned to the Services shall participate in the Customer's ICT "
        "security awareness programmes and digital operational resilience training at the "
        "Customer's reasonable request.",
    ),
    "performance_targets": (
        "10. Performance Targets",
        "The Services shall meet the following targets, measured monthly: availability of "
        "not less than {availability} of each calendar month excluding agreed maintenance; "
        "priority-one incident response within {p1_response}; and recovery time objective "
        "of {rto}. Failure to meet a target shall entitle the Customer to service credits "
        "under Schedule 3.",
    ),
    "provider_reporting": (
        "11. Reporting to the Customer",
        "The Supplier shall report to the Customer monthly on performance against the "
        "targets in clause 10, and shall notify the Customer without undue delay, and in "
        "any event within twenty-four (24) hours, of any development that may materially "
        "affect the Supplier's ability to perform the Services.",
    ),
    "contingency_plans": (
        "12. Contingency and Resilience",
        "The Supplier shall maintain, and test not less than annually, business contingency "
        "and disaster recovery plans covering the Services, and shall maintain ICT security "
        "measures appropriate to the criticality of the Services. Test results shall be "
        "provided to the Customer on request.",
    ),
    "tlpt_cooperation": (
        "13. Threat-Led Penetration Testing",
        "The Supplier shall participate in, and fully cooperate with, threat-led penetration "
        "testing carried out by or on behalf of the Customer in respect of the Services, "
        "including testing that involves the Supplier's production environment.",
    ),
    "audit_rights": (
        "14. Access, Inspection and Audit",
        "The Customer shall have the right to monitor the Supplier's performance on an "
        "ongoing basis, and shall have unrestricted rights of access to, inspection of and "
        "audit of the Supplier's premises, systems, records and personnel relating to the "
        "Services. These rights may be exercised by the Customer, by a third party appointed "
        "by the Customer, or by a competent authority, and shall not be limited in frequency "
        "or scope.",
    ),
    "exit_strategy": (
        "15. Exit and Transition",
        "On expiry or termination for any reason, the Supplier shall continue to provide the "
        "Services for a transition period of not less than {transition} at the prevailing "
        "charges, and shall provide all assistance the Customer reasonably requires to "
        "migrate the Services to an alternative provider or to bring the Services back "
        "in-house, including knowledge transfer, documentation, and reasonable access to "
        "Supplier personnel.",
    ),
}

# Weakened variants: text that looks like the provision but does not satisfy it.
# These are the interesting cases — a reviewer skimming would tick the box.
WEAK_CLAUSES: dict[str, tuple[str, str]] = {
    "audit_rights": (
        "14. Audit",
        "The Customer may, on not less than sixty (60) days' prior written notice and no "
        "more than once in any twenty-four (24) month period, request a copy of the "
        "Supplier's most recent SOC 2 Type II report. The Supplier shall not be obliged to "
        "permit the Customer, any third party appointed by the Customer, or any competent "
        "authority to access its premises or systems.",
    ),
    "exit_strategy": (
        "15. Effect of Termination",
        "On termination the Supplier shall cease providing the Services with immediate "
        "effect. Any transition assistance shall be subject to a separate statement of work "
        "agreed between the parties at the Supplier's then-current professional services "
        "rates, and the Supplier shall be under no obligation to enter into such a statement "
        "of work.",
    ),
    "locations_disclosed": (
        "2. Location of Services",
        "The Supplier may perform the Services, and process Customer Data, from any location "
        "within its global delivery network. The Supplier may vary such locations at its "
        "discretion and shall inform the Customer in its regular service review.",
    ),
    "data_return": (
        "4. Data on Termination",
        "The Supplier shall make Customer Data available for download for a period of thirty "
        "(30) days following termination, in the Supplier's standard proprietary export "
        "format. The Supplier shall have no obligation to provide data in any other format "
        "or to assist with conversion.",
    ),
    "tlpt_cooperation": (
        "13. Security Testing",
        "The Supplier conducts its own annual penetration testing and shall provide the "
        "Customer with an executive summary on request. Customer-initiated testing of the "
        "Supplier's environment is not permitted.",
    ),
    "termination_rights": (
        "8. Term",
        "This Agreement shall continue for an initial term of five (5) years and shall renew "
        "automatically for successive three (3) year terms unless either party gives notice "
        "not less than eighteen (18) months before the end of the then-current term.",
    ),
}

HEADER = """ICT SERVICES AGREEMENT

Reference: {ref}
Between: Nordhafen Bank SE ("the Customer")
And: {vendor} ("the Supplier")
Commencement: {start}
Annual charges: EUR {value:,.0f}
Governing law: {law}
Function supported: {function}

RECITALS

(A) The Customer is a credit institution authorised in the European Union and
    is subject to Regulation (EU) 2022/2554 on digital operational resilience.
(B) The Supplier provides {service}.
(C) The parties wish to record the terms on which the Supplier will provide the
    Services to the Customer.

AGREED TERMS
"""

# ref, vendor, service, function, critical, value, law, start, locations,
# data_locations, targets, transition, provisions present (strong), weak
BOOK: list[dict] = [
    {
        "ref": "NHB-ICT-2019-004",
        "vendor": "Helvetia Cloud Services AG",
        "service": "hosting and operation of the Customer's core banking platform",
        "function": "Core banking platform — deposits, payments, customer ledger",
        "critical": True,
        "value": 4_180_000,
        "law": "Swiss law",
        "start": "1 April 2019",
        "locations": "Zurich and Geneva, Switzerland",
        "data_locations": "Switzerland and the European Economic Area",
        "availability": "99.95%",
        "p1_response": "15 minutes",
        "rto": "4 hours",
        "transition": "twelve (12) months",
        "strong": [
            "service_description", "locations_disclosed", "data_protection",
            "data_return", "service_levels", "incident_assistance",
            "authority_cooperation", "termination_rights", "security_training",
            "performance_targets", "provider_reporting", "contingency_plans",
            "tlpt_cooperation", "audit_rights",
        ],
        "weak": [],
        "omit": ["exit_strategy"],
    },
    {
        "ref": "NHB-ICT-2021-011",
        "vendor": "Meridian Payments B.V.",
        "service": "card payment authorisation and clearing services",
        "function": "Card payment processing — issuing and acquiring",
        "critical": True,
        "value": 2_640_000,
        "law": "Dutch law",
        "start": "1 September 2021",
        "locations": "Amsterdam, Netherlands",
        "data_locations": "the European Economic Area",
        "availability": "99.99%",
        "p1_response": "10 minutes",
        "rto": "2 hours",
        "transition": "nine (9) months",
        "strong": [
            "service_description", "locations_disclosed", "data_protection",
            "data_return", "service_levels", "incident_assistance",
            "authority_cooperation", "termination_rights", "security_training",
            "performance_targets", "provider_reporting", "contingency_plans",
            "tlpt_cooperation", "exit_strategy",
        ],
        "weak": ["audit_rights"],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2020-002",
        "vendor": "Nordlys Data Centre A/S",
        "service": "colocation, power and cross-connect services",
        "function": "Primary and secondary data centre colocation",
        "critical": True,
        "value": 1_950_000,
        "law": "Danish law",
        "start": "1 January 2020",
        "locations": "Copenhagen and Aarhus, Denmark",
        "data_locations": "Denmark",
        "availability": "99.982%",
        "p1_response": "15 minutes",
        "rto": "1 hour",
        "transition": "twelve (12) months",
        "strong": list(CLAUSES.keys()),
        "weak": [],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2023-018",
        "vendor": "Aurora KYC Ltd",
        "service": "sanctions, PEP and adverse-media screening services",
        "function": "Financial crime screening — sanctions and PEP",
        "critical": True,
        "value": 890_000,
        "law": "the laws of England and Wales",
        "start": "1 June 2023",
        "locations": "London, United Kingdom",
        "data_locations": "the United Kingdom",
        "availability": "99.9%",
        "p1_response": "30 minutes",
        "rto": "4 hours",
        "transition": "six (6) months",
        "strong": [
            "service_description", "data_protection", "data_return",
            "service_levels",
            "incident_assistance", "authority_cooperation", "termination_rights",
            "security_training", "performance_targets", "provider_reporting",
            "contingency_plans", "audit_rights", "exit_strategy",
        ],
        "weak": ["locations_disclosed", "tlpt_cooperation"],
        "omit": [],
        "extra": (
            "16. Sub-processing",
            "The Supplier may engage affiliates and sub-processors within its group to "
            "perform screening operations, including entities located outside the European "
            "Economic Area and the United Kingdom. A list of such entities is available to "
            "the Customer on request.",
        ),
    },
    {
        "ref": "NHB-ICT-2022-007",
        "vendor": "Brightmail Secure GmbH",
        "service": "inbound and outbound email security gateway services",
        "function": "Email security filtering",
        "critical": False,
        "value": 145_000,
        "law": "German law",
        "start": "1 March 2022",
        "locations": "Frankfurt, Germany",
        "data_locations": "Germany",
        "availability": "99.5%",
        "p1_response": "2 hours",
        "rto": "8 hours",
        "transition": "three (3) months",
        "strong": list(CLAUSES.keys()),
        "weak": [],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2024-021",
        "vendor": "Vantage HR Cloud Inc.",
        "service": "human resources and payroll software-as-a-service",
        "function": "HR and payroll administration",
        "critical": False,
        "value": 210_000,
        "law": "the laws of the State of Delaware",
        "start": "1 February 2024",
        "locations": "the United States",
        "data_locations": "the United States and Ireland",
        "availability": "99.5%",
        "p1_response": "4 hours",
        "rto": "24 hours",
        "transition": "three (3) months",
        "strong": [
            "service_description", "locations_disclosed", "data_protection",
            "service_levels", "incident_assistance", "termination_rights",
        ],
        "weak": ["data_return"],
        "omit": ["authority_cooperation", "security_training"],
    },
    {
        "ref": "NHB-ICT-2018-001",
        "vendor": "Castellan Core Systems Ltd",
        "service": "licensing, maintenance and support of the core banking application",
        "function": "Core banking application software and support",
        "critical": True,
        "value": 3_320_000,
        "law": "Irish law",
        "start": "1 July 2018",
        "locations": "Dublin, Ireland",
        "data_locations": "Ireland",
        "availability": "99.9%",
        "p1_response": "30 minutes",
        "rto": "4 hours",
        "transition": "twelve (12) months",
        "strong": [
            "service_description", "locations_disclosed", "data_protection",
            "data_return", "service_levels", "incident_assistance",
            "authority_cooperation", "security_training", "performance_targets",
            "provider_reporting", "contingency_plans", "audit_rights",
            "exit_strategy",
        ],
        "weak": ["tlpt_cooperation", "termination_rights"],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2023-014",
        "vendor": "Skyward Analytics SA",
        "service": "regulatory reporting calculation and submission services",
        "function": "Prudential and statistical regulatory reporting",
        "critical": True,
        "value": 720_000,
        "law": "Luxembourg law",
        "start": "1 October 2023",
        "locations": "Luxembourg",
        "data_locations": "Luxembourg and France",
        "availability": "99.5%",
        "p1_response": "1 hour",
        "rto": "8 hours",
        "transition": "six (6) months",
        "strong": [
            "service_description", "locations_disclosed", "data_protection",
            "data_return", "service_levels", "incident_assistance",
            "authority_cooperation", "security_training", "performance_targets",
            "provider_reporting", "contingency_plans", "tlpt_cooperation",
            "audit_rights", "exit_strategy",
        ],
        "weak": ["termination_rights"],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2022-016",
        "vendor": "Pinnacle Managed Print BV",
        "service": "managed print and secure document output services",
        "function": "Branch and head-office printing",
        "critical": False,
        "value": 88_000,
        "law": "Dutch law",
        "start": "1 May 2022",
        "locations": "Rotterdam, Netherlands",
        "data_locations": "the Netherlands",
        "availability": "99.0%",
        "p1_response": "8 hours",
        "rto": "48 hours",
        "transition": "one (1) month",
        "strong": list(CLAUSES.keys()),
        "weak": [],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2021-009",
        "vendor": "Orion Trading Systems Ltd",
        "service": "market data distribution and order routing services",
        "function": "Treasury market data and order routing",
        "critical": True,
        "value": 1_460_000,
        "law": "the laws of England and Wales",
        "start": "1 November 2021",
        "locations": "London, United Kingdom",
        "data_locations": "the United Kingdom",
        "availability": "99.95%",
        "p1_response": "10 minutes",
        "rto": "2 hours",
        "transition": "six (6) months",
        "strong": [
            "service_description", "locations_disclosed", "data_protection",
            "data_return", "service_levels", "incident_assistance",
            "authority_cooperation", "termination_rights", "security_training",
            "performance_targets", "provider_reporting", "contingency_plans",
            "tlpt_cooperation", "audit_rights", "exit_strategy",
        ],
        "weak": [],
        "omit": [],
        "extra": (
            "17. Exclusivity",
            "The Customer shall source all market data and order routing for the covered "
            "asset classes exclusively from the Supplier for the duration of the Term. The "
            "Customer shall not connect any competing venue or data provider to the systems "
            "used to receive the Services without the Supplier's prior written consent.",
        ),
    },
    {
        "ref": "NHB-ICT-2020-013",
        "vendor": "Larsen Legal Archive AB",
        "service": "long-term archival and retrieval of executed documents",
        "function": "Document archive and retention",
        "critical": False,
        "value": 132_000,
        "law": "Swedish law",
        "start": "1 August 2020",
        "locations": "Stockholm, Sweden",
        "data_locations": "Sweden",
        "availability": "99.0%",
        "p1_response": "8 hours",
        "rto": "24 hours",
        "transition": "three (3) months",
        "strong": [
            "service_description", "data_protection", "data_return",
            "service_levels", "incident_assistance", "authority_cooperation",
            "termination_rights", "security_training",
        ],
        "weak": ["locations_disclosed"],
        "omit": [],
    },
    {
        "ref": "NHB-ICT-2024-025",
        "vendor": "Tessera Identity BV",
        "service": "remote customer identity verification and document authentication",
        "function": "Customer onboarding identity verification",
        "critical": True,
        "value": 640_000,
        "law": "Dutch law",
        "start": "1 January 2024",
        "locations": "Utrecht, Netherlands",
        "data_locations": "the Netherlands",
        "availability": "99.9%",
        "p1_response": "20 minutes",
        "rto": "4 hours",
        "transition": "twelve (12) months",
        "strong": list(CLAUSES.keys()),
        "weak": [],
        "omit": [],
    },
]


def render(entry: dict) -> str:
    """Assemble the contract text from its clauses."""
    parts = [HEADER.format(**entry)]
    order = list(CLAUSES.keys())
    for key in order:
        if key in entry.get("omit", []):
            continue
        if key in entry.get("weak", []):
            heading, body = WEAK_CLAUSES[key]
        elif key in entry.get("strong", []):
            heading, body = CLAUSES[key]
        else:
            continue
        parts.append(f"\n{heading}\n\n{body.format(**entry)}\n")
    extra = entry.get("extra")
    if extra:
        parts.append(f"\n{extra[0]}\n\n{extra[1]}\n")
    parts.append(
        "\nSIGNED for and on behalf of Nordhafen Bank SE and "
        f"{entry['vendor']}.\n"
    )
    return "".join(parts)


def ground_truth(entry: dict) -> dict[str, str]:
    """What each provision really is, for evaluating the agent."""
    out = {}
    for key in CLAUSES:
        if key in entry.get("omit", []):
            out[key] = "absent"
        elif key in entry.get("weak", []):
            out[key] = "inadequate"
        elif key in entry.get("strong", []):
            out[key] = "present"
        else:
            out[key] = "absent"
    return out

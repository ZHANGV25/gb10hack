"""Turn extracted clauses into a DORA verdict. Deterministic, no model.

Everything that decides anything lives here so it can be read, tested and
argued with. The model's only contribution is which clauses exist and what
they say.
"""

from __future__ import annotations

from datetime import datetime, timezone

from covenant.dora import SEVERITY, article_of, label_of, required_for


def assess(provisions: dict, *, critical: bool, annual_value_eur: float) -> dict:
    required = required_for(critical)

    gaps: list[dict] = []
    for key in required:
        found = provisions.get(key) or {}
        status = found.get("status", "absent")
        if status == "present":
            continue
        gaps.append(
            {
                "provision": key,
                "article": article_of(key),
                "label": label_of(key),
                "status": status,
                "severity": SEVERITY.get(key, "material"),
                "quote": found.get("quote"),
                "section": found.get("section"),
            }
        )

    blocking = [g for g in gaps if g["severity"] == "blocking"]
    material = [g for g in gaps if g["severity"] != "blocking"]

    # Exposure is the annual charge on an arrangement the bank cannot cleanly
    # exit or supervise. It is not a loss estimate and is never invented by
    # the model — it is the contract value, carried through unchanged.
    if blocking and critical:
        decision = "reject"
        exposure = float(annual_value_eur)
    elif gaps:
        decision = "escalate"
        exposure = float(annual_value_eur) if blocking else 0.0
    else:
        decision = "approve"
        exposure = 0.0

    return {
        "assessed_at": datetime.now(timezone.utc),
        "critical": critical,
        "required_count": len(required),
        "present_count": len(required) - len(gaps),
        "gaps": gaps,
        "blocking_gaps": [g["provision"] for g in blocking],
        "material_gaps": [g["provision"] for g in material],
        "decision": decision,
        "exposure_eur": round(exposure, 2),
        "reasoning": (
            f"{len(required) - len(gaps)} of {len(required)} required provisions present. "
            + (
                f"Blocking: {', '.join(g['label'] for g in blocking)}. "
                if blocking
                else ""
            )
            + (
                f"Material: {', '.join(g['label'] for g in material)}."
                if material
                else ("No gaps." if not gaps else "")
            )
        ).strip(),
        "math": (
            "reject if a blocking provision (exit strategy, audit rights, data return) "
            "is missing on a critical arrangement; escalate if any required provision "
            "is missing or inadequate; otherwise approve. Exposure is the annual charge, "
            "carried through unchanged."
        ),
    }


def apply_rules(assessment: dict, retrieved: list[dict]) -> tuple[dict, list[str]]:
    """Overlay learned policy on the deterministic assessment.

    A rule can only make a verdict stricter or record an accepted exception —
    it can never invent a gap that is not in the contract.
    """
    decision = assessment["decision"]
    applied: list[str] = []
    notes: list[str] = []
    gap_keys = {g["provision"] for g in assessment["gaps"]}
    order = {"approve": 0, "escalate": 1, "reject": 2}

    critical = bool(assessment.get("critical"))
    blocking_open = set(assessment.get("blocking_gaps") or [])
    for rule in retrieved:
        action = (rule.get("action") or "").lower()
        scope = rule.get("provision")
        # A scoped rule only fires when that provision is actually a gap.
        if scope and scope not in gap_keys:
            continue
        # A rule written about critical arrangements must not quietly reshape
        # verdicts on the rest of the estate.
        if rule.get("critical_only") and not critical:
            continue
        if rule.get("non_critical_only") and critical:
            continue
        fired = False
        if action == "reject":
            if order[decision] < order["reject"]:
                decision = "reject"
            fired = True
        elif action == "escalate":
            if order[decision] < order["escalate"]:
                decision = "escalate"
            fired = True
        elif action == "accept_exception":
            # An exception softens by exactly one step and never reaches
            # "approve" from "reject". A human still has to sign off a
            # critical arrangement the bank cannot exit.
            #
            # It also cannot soften anything while a blocking provision it
            # does not itself address is still missing: an accepted exception
            # about training must not quietly wave through a contract whose
            # data-return clause is unusable.
            others = blocking_open - ({scope} if scope else set())
            if others:
                continue
            if decision == "reject":
                decision = "escalate"
                fired = True
            elif decision == "escalate":
                decision = "approve"
                fired = True
        if fired:
            applied.append(str(rule.get("_id")))
            notes.append(str(rule.get("text") or "")[:300])

    out = dict(assessment)
    out["decision"] = decision
    out["applied_rule_ids"] = applied
    out["applied_rule_texts"] = notes
    out["decision_changed_by_memory"] = decision != assessment["decision"]
    out["decision_before_memory"] = assessment["decision"]
    return out, applied

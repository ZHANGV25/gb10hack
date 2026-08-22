# PITCH.md — canonical framing (matches what is built)

**Date:** 2026-08-22 (evening) · **Supersedes** every prior pitch doc (V1 cable-arc, V2
"Cable on the Floor", V3 problem-first, the `offramp/` model-fungibility detour, and this
file's own afternoon revision written against the AML desk — all recoverable from git history).
**The product this describes:** the running ExitPlan **DORA agent** documented in
[`/CLAUDE.md`](../CLAUDE.md) at `68723ce` — an always-on Article 30 contract reviewer for
fictional Nordhafen Bank on the GB10. That file is ground truth for what exists; this file is
ground truth for how we talk about it.

> ✅ Reality check resolved, 22 Aug evening: Gyorgy's `68723ce` pivoted the demo to the
> **DORA contract agent** (12 contracts, teach-a-rule, ~0.5s re-check, cable closer), per the
> rewritten [`DEMO.md`](../DEMO.md). Victor confirmed the deck matches what is pushed. The
> **AML alert-triage desk** — this file's previous subject — still runs at `/aml` and is *not*
> the demo. `PROJECT-CONTEXT.md` still describes the AML mission and carries graveyarded
> claims (150,000 users); do not source pitch copy from it until it is rewritten.

---

## The framing: work that can't leave the building

Some work is contractually or legally confined to the machines it lives on. That population is
real, documented, and buys software:

- **Hard tier — genuinely confined:** classified/defense (DoD IL5/IL6, CMMC 2–3, FedRAMP High),
  ITAR/export-controlled technical data, SCIF and air-gapped environments, pockets of government
  procurement and OT/critical infrastructure. An ecosystem of air-gapped LLM deployment vendors
  already serves it (TrueFoundry, Iternal, et al.).
- **Soft tier — contractually restricted, widespread:** the overwhelming majority of outside
  counsel guidelines now require written permission before generative AI touches client matters
  (ACC 2025); M&A NDAs now carry explicit no-public-AI clauses (KJK 2026); a US judge has ruled
  public-AI use waived attorney-client privilege (2026). This tier is huge but mostly satisfiable
  by in-tenant cloud AI (Azure OpenAI / Bedrock-in-VPC) — which is the pressure test any claim
  must survive.
- **Tailwind:** enterprise inference is moving private anyway — public cloud as primary AI
  inference environment fell 56%→41% YoY (Broadcom 2026, n=1,800); on-prem runs 50%+ cheaper over
  three years above sustained token volumes (Deloitte 2026).

**This product's sharper instance of the claim:** ExitPlan is the tool a bank uses to prove it
can walk away from its ICT providers. The agent that certifies your exit capability cannot
itself be a dependency you can't exit — so the whole thing runs on one machine.

**The pitch-safe claim (existence, not necessity):** *"Some work is confined to the premises by
contract or classification. We built a complete, always-on contract-review agent — model,
embeddings, vector memory, change-stream event bus, application, database, audit trail — that
fits entirely on one machine, and proved a 30B open model is enough when the harness carries it
(138/141, 98% clause agreement)."*

**The three-question clause test** (use in Q&A, and on any prospective example):
1. What does the clause say — "no third parties without consent" (cloud-solvable) or "shall not
   leave our premises/systems" (ours)?
2. Where does that data live today? If it's in M365/Google/AWS, the confinement claim is already
   false in practice.
3. What happened when they wanted AI on it — blocked (live buyer) or "getting Azure OpenAI
   approved" (not our buyer)?

## What the product is (say only this)

An always-on DORA Article 30 agent where the model has exactly one authority — finding and
quoting clauses — and everything above it is deterministic or human:

- The model **reads each contract** and answers present / inadequate / absent per provision,
  and **must quote the clause**. No quote, no claim (`extract.py`).
- A **deterministic checklist decides** (`assess.py`), never the model. Missing exit strategy,
  audit rights or data return are *blocking* — without them the bank cannot evidence
  Article 28(8) at all.
- A **reviewer who disagrees writes one sentence.** It is embedded into MongoDB as a rule and
  retrieved **by meaning** on any contract with a similar gap. Retrieval, not retraining;
  every rule is a readable sentence with an author, and can be switched off.
- The memory **cannot invent a gap** — a rule only fires on a provision the checklist already
  found missing, and can be scoped to critical/non-critical arrangements.
- The agent is subscribed to MongoDB **change streams**: a new contract makes it read; a new
  rule makes it re-check the whole register in **~0.5s** by reusing stored extractions.
- **MongoDB is the spine, three jobs in one deployment:** operational register (contracts,
  verdicts, corrections), vector memory (rules + `$vectorSearch`, bge-m3), and the event bus
  that makes it always-on. Append-only `runs` log. Live counts aggregated in the database.
- Everything runs on the one box. Zero cloud API calls; cable-pull verified.

## The graveyard (dead claims — do not resurrect)

1. "EU law requires on-prem / banks can't use cloud" — false; HSBC runs AML on Google Cloud.
   DORA is an exit-capability duty. Killed by adversarial review on day one, twice since.
2. The cable-pull as the spine of the pitch — every team at a local-AI event runs local; at most
   one quiet line (it is DEMO.md's 20-second closer, nothing more).
3. Invented scale — the register is 12 synthetic contracts; €16,375,000/yr, €7,030,000
   exposure, 138/141 agreement, ~0.5s sweeps are all measured on the box; say "synthetic" on
   stage once. (The old "200 alerts, 99% noise" and "150,000 Sparkassen users" stay dead.)
4. OpenClaw/NemoClaw in the runtime — they are not; the harness is bespoke. (Eligibility question
   for organizers, not a stage claim.)
5. Dollar-figure ROI from synthetic data — never. (€ figures from the seeded register are
   descriptive of the demo estate, not claimed savings.)
6. The Offramp model-fungibility thesis — parked, not disproven (evidence and drafts in git
   history at `1efcf37`); out of scope for this event.

Also binding: the **Never/always table** in [`/CLAUDE.md`](../CLAUDE.md) — never "the AI decides
the contract is bad" (the checklist decides; the model quotes), never "it learns automatically"
(it learns from a named reviewer's written correction), never "we fine-tune on your contracts".

## The presentation

Deck arc (10 keypresses, matched beat-for-beat to [`DEMO.md`](../DEMO.md)):
[`DECK-ARC-DRAFT.md`](DECK-ARC-DRAFT.md) → `deck/src/lib/slides.ts` once pressure-tested.
Deck app mechanics and design language: [`DECK-PLAN.md`](DECK-PLAN.md); narration source of
truth: `deck/src/lib/slides.ts`; narration UI at `/script`.

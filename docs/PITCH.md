# PITCH.md — canonical framing (matches what is built)

**Date:** 2026-08-22 (afternoon) · **Supersedes** every prior pitch doc (V1 cable-arc, V2
"Cable on the Floor", V3 problem-first, and the `offramp/` model-fungibility detour — all removed;
recoverable from git history if ever needed).
**The product this describes:** the running ExitPlan desk documented in [`/CLAUDE.md`](../CLAUDE.md)
— an AML alert-triage desk for fictional Nordhafen Bank on the GB10. That file is ground truth for
what exists; this file is ground truth for how we talk about it.

> ⚠️ Repo reality check: as of this writing the built demo is **AML alert triage** (8 named cases,
> disposition memos, SAR filing), *not* contract review. Covenant (`apps/engine/covenant/`) is
> leftover code, per the team handoff. If the team has pivoted the demo since — confirm before any
> presentation work, and update this file in the same commit.

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

**The pitch-safe claim (existence, not necessity):** *"Some work is confined to the premises by
contract or classification. We built a complete governed triage desk — model, embeddings, vector
search, application, database, audit trail — that fits entirely on one machine, and proved a 30B
open model is enough when the harness carries it."*

**The three-question clause test** (use in Q&A, and on any prospective example):
1. What does the clause say — "no third parties without consent" (cloud-solvable) or "shall not
   leave our premises/systems" (ours)?
2. Where does that data live today? If it's in M365/Google/AWS, the confinement claim is already
   false in practice.
3. What happened when they wanted AI on it — blocked (live buyer) or "getting Azure OpenAI
   approved" (not our buyer)?

## What the product is (say only this)

A financial-crime triage desk where the agent does the assembly and never the authority:

- Deterministic **rules** open every alert (sanctions names, sub-€10k structuring, high-risk
  corridors). The model cannot invent or dismiss a case.
- A **drafting loop** (nemotron-3-nano via Ollama, Vercel AI SDK, step-capped) has exactly one
  tool — `retrievePolicy` → MongoDB **$vectorSearch** over the bank's own policy corpus (bge-m3).
  Cited memo or abstention.
- A **hard gate**: exact sanctions matches cannot be dismissed — enforced server-side.
- A **human** records every outcome: dismiss / refer to MLRO / submit SAR to FIU.
- **MongoDB is the spine**: customers, transactions, alerts, corpus + vector index, dispositions,
  append-only `audit_log`, live pipeline counts on `/system`. One database is the desk's chain of
  custody.
- Drafts and decisions persist to Mongo (since 77be0fe). Everything runs on the one box.

## The graveyard (dead claims — do not resurrect)

1. "EU law requires on-prem / banks can't use cloud" — false; HSBC runs AML on Google Cloud.
   DORA is an exit-capability duty. Killed by adversarial review on day one, twice since.
2. The cable-pull as the spine of the pitch — every team at a local-AI event runs local; at most
   one quiet line.
3. Invented scale ("200 alerts, 99% noise") — the demo has 8 named synthetic cases; say so.
4. OpenClaw/NemoClaw in the runtime — they are not; the harness is bespoke. (Eligibility question
   for organizers, not a stage claim.)
5. Dollar-figure ROI from synthetic data — never.
6. The Offramp model-fungibility thesis — parked, not disproven (evidence and drafts in git
   history at `1efcf37`); out of scope for this event.

## Next session: the presentation

Build the pitch + deck on the confinement framing, matched to whatever the team is actually
demoing (verify first). Raw material that survives: the work-order problem stating (assembly work,
not verdicts), the cage (rules → cited draft → gate → human → ledger), the MongoDB
chain-of-custody reveal, and the one-line existence proof above. Deck app and design language:
[`DECK-PLAN.md`](DECK-PLAN.md); narration source of truth: `deck/src/lib/slides.ts` (still
carries the V3 arc — rewrite it to this framing).

# 00 — Thesis

**Working name:** Offramp *(placeholder — the off-ramp from frontier APIs; rename freely)*
**Date:** 2026-08-22 · **Status:** thesis only — nothing here is built or validated
**Relationship to this repo:** second version of the problem behind ExitPlan. The hackathon desk
(`apps/`) is the first — accidental — instance and the evidence base. This folder is the ground-up
restatement with the causality the right way around.

---

## How we got here (so we never redo the drift)

ExitPlan started from a constraint ("must run locally on the GB10") and spent a day manufacturing
justifications for it — DORA exit plans, cable pulls, sovereignty. Adversarial review kept killing
them: **nothing in EU law requires local models, and there is nothing inherently special about
one.** What survived every audit was a different observation entirely: the *harness* around the
model — rules, retrieval over owned data, gates, human decisions, an append-only ledger — made the
model the least important component in the system. That inversion is the thesis.

---

## The problem (v2)

Teams build production workflows on frontier model APIs. At some point, most of them have a reason
to move — to a smaller model, a local model, a different vendor, or just the next version:

1. **Cost at scale** — the workload matured into something narrow, repetitive, high-volume
   (triage, extraction, classification, drafting). Frontier capability headroom stops paying for
   itself; per-token spend crosses amortized hardware.
2. **Vendor instability** — the model you built on gets deprecated or silently updated, and your
   prompts degrade under you. Every API team eats a forced revalidation eventually.
3. **Privacy / procurement** — data that can't leave, or a risk committee that approves on-prem in
   weeks and external AI in quarters.
4. **Latency / throughput / rate limits** on bursty pipelines.

The arc underneath: **frontier models are how you discover a workflow; small/local models are how
you run it once it's narrow and understood.** Exploration → exploitation.

**Almost nobody migrates.** Not because the destination is bad, but because the switch is a leap
of faith:

- **No eval set.** There's no task-specific benchmark, so "is the smaller model good enough for
  *our* cases?" is unanswerable, and nobody finds out in production.
- **The tacit knowledge isn't written anywhere.** The workflow works because a general frontier
  model papers over gaps and humans quietly correct the rest. "How we do things" lives half in the
  vendor's weights, half in people's heads — the genuinely unportable dependency. (No law can make
  a vendor hand over weights; portability regulation solves storage, not judgment.)
- **The scaffold is vendor-entangled** — prompts tuned to one model, one SDK, one tool format.
- **It's big-bang.** There's no gradual path, so the risk is concentrated in one cutover.

## The insight

**A workflow harness that learns how you do things day to day manufactures the migration assets as
a byproduct of doing the work.** For every case it captures: the input, what was retrieved, what
was drafted, what the human actually decided, and every correction — as documents in a database
the customer owns.

That corpus is, simultaneously:

| Captured asset | What it becomes |
|---|---|
| Decision history (case → human outcome) | **The eval set** — replay past cases on any candidate model, score agreement with your own humans. "Good enough" becomes a dashboard number. |
| Corrections & precedents (human-approved documents) | **Tacit knowledge, externalized** — judgment moved out of vendor weights into retrievable data. Small model + your precedent library ≈ frontier model *on your narrow task*. |
| Live shadow diffs | **A readiness score per case type.** |
| The same pairs, at volume | An optional **distillation / fine-tune set**. |

So migration stops being a leap and becomes a **dial**: route the easy case tiers to the small/
local model first, keep hard cases on the frontier API, shift the boundary as readiness scores
rise. Same harness either way — an OpenAI-compatible endpoint means the switch is a URL.

**Thesis in one sentence:** the product is not a local model — it is the harness that makes models
fungible, by continuously moving an institution's judgment out of vendor weights and into a
database it owns; "local" is merely the far end of a dial you can finally turn safely.

## Solution shape

1. **Capture** — every case recorded as a replayable unit (input · retrievals · draft · human
   outcome · corrections), append-only.
2. **Precedent & rules store** — corrections become *proposed* documents a human approves
   (drafts-never-decides applies to the system improving itself; in regulated settings this is
   also the AMLR 18(3)-shaped loop). Retrieval serves them back into future drafts.
3. **Replay / eval** — run any candidate model over the archive; score against human outcomes.
4. **Shadow mode** — candidate drafts live alongside the incumbent, diffed silently.
5. **Cascade router** — per-tier routing between frontier and local; the dial.
6. **Vendor-neutral model interface** — one tool contract, OpenAI-compatible endpoints; prompts
   kept thin because knowledge lives in retrieval, not prompt engineering.

## Evidence from the hackathon build (`apps/`)

- A 30B open model runs a real regulated workflow acceptably **because** the harness carries it:
  deterministic rules open cases, one retrieval tool over Mongo `$vectorSearch`, hard gates,
  human-recorded outcomes, append-only `audit_log`. The model demonstrably isn't the load-bearing part.
- Decisions and (as of today) generated drafts persist to MongoDB — capture exists in embryo.
- The correction→rule→re-judge loop already exists in-repo (`covenant.learn.record_correction`,
  `apps/engine/scripts/learn_flip.py`): a human correction becomes a Mongo document that flips the
  next judgment. Learning-as-documents is proven machinery, not a slide.

## Honesty ledger

**Proven:** the harness pattern; a small model sufficing inside it; capture + learning-as-documents
mechanics. **Not proven:** an actual frontier→local migration (never demonstrated); replay/eval,
shadow scoring, cascade routing (not built); that anyone will pay for the dial; which trigger
(cost, deprecation, procurement) actually moves buyers first. Do not claim these until they exist.

## Non-goals

- No "local is necessary / required by law" claims, ever. That premise is dead and stays dead.
- Not an observability/evals tool bolted onto someone else's workflow — the harness runs the
  workflow; the assets are a byproduct. (Adjacent-competitor question belongs in 01.)

## Next (01-target.md — next session)

Who feels this first, or is it horizontal?
Candidates to test: high-volume API spenders (cost trigger) · teams burned by a model deprecation
(instability trigger) · regulated/procurement-blocked orgs (the ExitPlan wedge) · enterprise AI
platform teams standardizing many internal workflows. Decide the wedge workflow, the buy-vs-build
story, adjacency to eval/observability vendors, and the business model. Then 02-pitch.md.

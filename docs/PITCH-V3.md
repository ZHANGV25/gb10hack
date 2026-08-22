# Pitch V3 — problem-first (Codex × Fable synthesis)

**Date:** 2026-08-22 · Supersedes PITCH-V2 and the cable-centric arcs entirely.
**Sources:** ground-up rewrite by Codex `gpt-5.6-sol` (max effort, run against the actual code) +
the shadow-deployment thesis. Script lives in `deck/src/lib/slides.ts`, rendered at `/script`.

## Why the old pitches died

1. **Cable-centric.** Every team at this event runs a local model; the pull is the room's most
   predictable stunt. Local is now ambient architecture (one boundary on the diagram, one closing
   line), never theater.
2. **Invented scale.** "200 alerts, 99% noise" over an eight-case synthetic product, plus claimed
   OpenClaw/NemoClaw runtime usage — free cross-examination wins for any judge who looks.
3. **MongoDB buried.** One operational store carrying customers, transactions, alerts, policy
   vectors, dispositions, audit events and live counts is the product's strongest structural idea,
   and it was a late stack chip.

## The arc (10 slides, ~445 spoken words, ends ~4:55)

Problem (the work order; today's desk) → the system (NOT JUST AN LLM — one Mongo-centred diagram
inside the GB10 boundary) → **live demo** (queue → provenance → retrieve-then-draft → authority
boundary: Kovalev dismissed, Kovalenko's dismiss locked server-side, SAR submitted) → **the
MongoDB reveal** (state: decisions 0→2, events 16→18, chain-of-custody line) → the deal
(shadow-first pilot + auditable learning + go/no-go scorecard) → close (one quiet DORA line).

Verbatim narration: `/script` page. Load-bearing sentence:
**"MongoDB isn't our vector-store sidecar — it's the desk's chain of custody."**

## The MongoDB moment (staging)

1. Fresh-seed right before presenting: 8 customers, 8 alerts, 0 decisions, 16 events.
2. Show `/system` counts briefly before opening Kovalev.
3. Retrieval chips during drafting = bge-m3 + `corpus_vector` `$vectorSearch`, visible.
4. Record two human outcomes (dismiss Kovalev; SAR Kovalenko).
5. Reopen `/system` → 2 decisions, 18 events; `/audit` → the two newest timestamped human actions.
6. Deliver the chain-of-custody line.

## Truth conditions (Codex audited the code — do not violate)

- Say `transactions`, not `txns` (actual collection name).
- Do **not** claim the streamed memo increments Mongo counts — the chat route doesn't persist
  drafts yet. (Buildable before 17:00 if desired; until then, only human decisions move counts.)
- `audit_log` is *application*-append-only — never say immutable/WORM.
- The retrieval fallback returns unranked corpus docs — don't call it "keyword search."
- Retrieval-first is prompt-enforced, not `toolChoice: required` — say "the loop calls its tool
  first," don't over-claim enforcement. (One-line hardening if time allows.)
- **Stack eligibility risk:** OpenClaw/NemoClaw are on the box but NOT in this runtime loop; the
  harness is bespoke (AI SDK). Remove them from the stack slide; team should check the ≥2-of-3
  requirement with organizers before submission.

## The learning loop (slide 9's claim, kept honest)

Shadowing = the pilot. The box learns **in the data layer, not the weights**:
- Analyst decisions → retrievable precedent documents in Mongo (`$vectorSearch` over past
  dispositions = the desk's case law).
- Overrules (analyst flips the draft's recommendation) → *proposed* rule/lesson documents that a
  human approves — AMLR 18(3) says detection-criteria approval can't be outsourced, so the
  drafts-not-decides pattern applies to the system's own improvement. Fractal governance.
- The mechanism already exists in-repo: `covenant.learn.record_correction` + re-judge
  (`apps/engine/scripts/learn_flip.py`) — a human correction becomes a Mongo rule doc that flips
  the next judgment. Porting it to ExitPlan is an afternoon, and until it's ported the pitch says
  "becomes precedent" only about what's built (decisions in `dispositions`/`audit_log`).
- Never fine-tune on live decisions: unauditable, drift-prone, and it breaks model-swappability —
  the exit thesis depends on the model being the replaceable part.

## Q&A prep (the five hardest)

1. **"Just RAG around an LLM?"** No — a deliberately small governed harness: rules create alerts,
   one retrieval tool, four-step cap, server-side sanctions gate, human-only outcome recording.
2. **"Does it integrate with a real bank?"** Not yet — eight seeded synthetic cases shaped like
   core-banking records. Deployment ingests feeds via batch/API/change streams, shadow-first,
   augmenting the incumbent stack. FIU transmission is production work.
3. **"What have you proven?"** Workflow and authority boundaries, not ROI. The pilot scorecard is
   the claim: −50% median handle time, citations validated, rework ≤ baseline, or it fails.
4. **"Hallucinations / audit manipulation?"** A hallucination can't open, dismiss, gate-override,
   or file — its authority is capped; a human reads the memo. Production needs citation
   verification, authn, DB roles, write-once retention.
5. **"Are the regulatory claims right?"** Exit duty, not on-prem mandate (HSBC on Google Cloud is
   the proof cloud is allowed); AMLR 18(3) reserves the decision; AMLR applies from 10 Jul 2027;
   financial crime only, never creditworthiness.

## Cut order

1. Collapse slide 5 into 4 (keep "the model neither opened nor can suppress this alert").
2. One human decision instead of two (Kovalenko locked-dismiss shown, not submitted; counts 0→1).
3. Fold slide 9's scorecard into the close as one sentence.
4. Slide 2's second sentence once the diagram has landed.
5. Generation >25s → pre-warmed tab + say plainly "generated on this box during setup."

**Never cut:** synthetic-data disclosure, rule provenance, the retrieval-tool evidence, absence of
decide/file tools, the server-side gate, one human action, the Mongo count-and-ledger reveal.

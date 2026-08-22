# DECK-ARC-DRAFT — V6 (DORA agent), post pressure-test

**Status:** revised after two independent adversarial reviews (3× Sonnet panel: all
`ship_with_fixes`; codex gpt-5.6-sol xhigh: `rework` — every blocker from both is addressed
below or flagged to the team). 22 Aug 2026, evening.
**Demo source:** [`../DEMO.md`](../DEMO.md) at `68723ce`. **Ground truth:**
[`../CLAUDE.md`](../CLAUDE.md) + the code (verified directly where reviews disputed it).
**Framing:** [`PITCH.md`](PITCH.md) — existence, never necessity. **Mechanics:**
[`DECK-PLAN.md`](DECK-PLAN.md).

Slides 3–6 are stylized SLEEPER re-creations of the live demo beats — mic cues, submission
artifact, and fallback if the desk dies. Live, the presenter is on the product.
Tan = human action only: the reviewer's correction (slide 5) and the close rule.

---

## ⚠ Flags for the team (found by pressure-testing, verified in code — not deck issues)

1. **The provision dropdown pre-fills wrong on Castellan.** `review-panel.tsx` defaults to
   `gaps[0].provision`; `assess.py` orders base provisions first, so Castellan pre-fills
   **termination_rights**, not TLPT. Taught as-is, the rule fires on Skyward — Aurora never
   moves, and DEMO.md §3's "pre-filled with the right provision" is wrong. **The presenter
   must manually select "Participation in threat-led penetration testing" before storing.**
   (Deck slide 5 now directs this explicitly.)
2. **Aurora's verdict does not visibly change.** The seeded critical-locations rule already
   makes Aurora a rejection before the teach beat, so the new TLPT rule is *applied* to
   Aurora (memory chip counts it) but the decision stays `reject`; the only verdict that
   flips is Castellan's. DEMO.md's "applied it here too" is accurate — say *applied*, never
   *changed*. If the team wants Aurora to flip live, the seeded location rule would have to
   be softened and re-verified — Gyorgy's call, not tonight's deck.
3. **138/141 is an 11-contract denominator.** `review_all.py` scores only its `todo` set;
   141 = 7×15 + 4×9. Full book would be 156. Quote the number as measured, don't claim
   "every contract" for it; re-read the agreement line after tonight's re-seed.
4. **"One sentence" branding vs the two-sentence demo correction** (DEMO §3) — deck says
   "a written correction"; team may want to shorten the demo text.
5. **Castellan has two gaps** (termination + TLPT), page will show 13/15 — never say "one
   gap".

## Before you present (operator prep — never spoken)

- `systemctl --user status dora-watch` → `active (running)`; else the teach beat dies.
- Reset **between runs** is instant (`reset_demo.py` — retires taught rules; the agent
  reverts the verdicts itself). Full `seed_dora.py` + `review_all.py` (**~12 min, well
  before**) only if contracts changed — confirm the agreement line (script says 138/141 ·
  98%), the tiles (7 with gaps · 10 gaps · €7,030,000 · €16,375,000), and Castellan showing
  "Gaps to close"; update `slides.ts` strings if the run differs.
- Browser 1440×1250+, desk at `127.0.0.1:3000`, deck parked on slide 2.
- Drill the dropdown: **provision = threat-led penetration testing, scope = critical
  functions only** (flag 1).
- Live route (demo §§1–6): Register → Helvetia → Castellan → store rule → Agent activity →
  What it has learned → Aurora → Nordlys → How it works → pull cable, reload, teach again →
  back to deck at slide 8 (the artifact), close on 9.

## The arc in one line

Nobody reads the contracts the exit duty lives in → the authority split (model extracts,
policy disposes, reviewers teach) → (live) the register and the €7.03M number, Helvetia's
missing exit clause, teaching Castellan's rule, the twelve-minutes-to-half-a-second sweep,
Aurora reached unopened, Nordlys withheld → one MongoDB doing three jobs → the self-contained
box, unplugged, as the artifact → close.

## Slides

Groups: 1 `reading` · 2 `cage` · 3 `register` · 4 `helvetia` · 5–6 `teach` (the deck's one
build) · 7 `mongo` · 8 `artifact` · 9 `close`. 9 keypresses, 8 scenes.

### 1 · THE READING PROBLEM — Act I, the job

**Onscreen:** DORA Art. 28(8) — exit strategies for ICT supporting critical or important
functions, including reincorporation in-house — over the Art. 30 spec: 9 contractual
elements for every arrangement, 6 more where the function is critical. A shelf of contract
spines; one reader. No confinement taxonomy (moved to Q&A).

**Narration:**
- DORA Article 28(8): for the services a bank's critical functions run on, it must hold an
  exit strategy — including the option to bring the service back in-house. Article 30 says
  the contracts themselves have to make that possible: nine required elements in every ICT
  contract, six more — audit rights, exit assistance — where the function is critical.
- So whether the bank can actually leave is written down across every ICT contract it has.
  Someone has to read them all against that list. In a real estate that's hundreds. Nobody
  reads them.
- **[load-bearing]** The exit plan stays a slide. ExitPlan is the agent that reads the
  contracts — continuously.

### 2 · THE AUTHORITY SPLIT — Act II, the cage

**Onscreen:** Three-lane schematic: MODEL EXTRACTS (reads the contract; labels each
provision present / inadequate / absent; must produce the clause it relied on — chip: NO
QUOTE, NO CLAIM) → POLICY DISPOSES (deterministic, Python — chip: MODEL EXTRACTS · POLICY
DISPOSES; exit, audit, data return marked BLOCKING) → REVIEWERS TEACH (tan; a named
reviewer's written correction becomes a scoped, readable rule — chip: RULES ONLY ACT ON AN
EXISTING GAP). No database named on this slide.

**Narration:**
- The model's authority stops at extraction. It reads a contract and labels every required
  provision — present, inadequate, absent — and it has to produce the clause it relied on.
  A claim with no quote behind it is recorded as absent.
- What those labels *mean* is a fixed policy in Python, not the model. Our policy marks a
  missing exit clause, audit right or data return as blocking — without those, Article
  28(8) can't be evidenced at all.
- And it learns from people, not retraining. A reviewer who disagrees writes the correction
  down; it becomes a readable rule with an author and a scope, and a rule can only act on a
  gap the checklist already found.

### 3 · THE REGISTER — Act III, live — demo §1

**Stage:** *(switch display to the browser — 1440×1250, seeded; the deck waits here. Frames
3–6 are the fallback if the desk dies.)*

**Onscreen (fallback):** The register: four tiles (7 arrangements with gaps · cannot be
cleanly exited **€7,030,000** · 10 Article 30 gaps found · €16,375,000 total contracted),
the twelve real supplier rows (Helvetia €4.18M … Pinnacle €88k), the "where the estate is
weakest" panel carrying the real examples: two contracts with no penetration-testing
clause; two that don't disclose where the data sits. Chip: "12 arrangements · €16.4M/yr ·
measured 22 aug".

**Narration:**
- Nordhafen Bank — fictional, a synthetic register: twelve ICT arrangements, sixteen point
  four million euros a year, eight supporting critical functions. The agent has read every
  one.
- **[load-bearing]** Seven million euros a year runs through contracts this bank cannot
  cleanly exit or inspect — the number a supervisor asks for and nobody can produce.
- And the estate view: the same clause missing across suppliers — two with no
  penetration-testing clause, two that won't say where the data sits — is a contracting
  problem, not a supplier problem.

### 4 · HELVETIA — the missing exit — demo §2

**Onscreen (fallback):** HELVETIA CLOUD SERVICES AG · core banking platform · €4,180,000/yr
· CRITICAL. Checklist 14/15; the absent row — EXIT STRATEGY AND TRANSITION PERIOD — marked
blocking. One passed row expanded to its quoted clause.

**Narration:**
- Helvetia Cloud — the core banking platform, four point one eight million a year. Fourteen
  of fifteen required provisions are present. This is a *good* contract.
- The one it's missing is the exit strategy: no transition period, no obligation to help
  the bank move. The bank's Article 28(8) exit plan for core banking is a document that
  cannot be executed.
- Open any tick and you get the sentence the model relied on, quoted. If it claims a clause
  and can't produce the text, the system records the provision as absent.

### 5 · TEACH IT — the correction — demo §3 (tan)

**Onscreen (fallback):** Castellan Core Systems: the TLPT finding — "supplier runs its own
annual test; customer-initiated testing refused" — checklist verdict: material, gaps to
close. The review panel: "Disagree — correct it"; **provision set to Participation in
threat-led penetration testing** (a visible, deliberate selection); scope CRITICAL FUNCTIONS
ONLY; the written correction; the tan button STORE RULE AND RE-CHECK THE REGISTER. Right
column: a quiet dashed AGENT ACTIVITY panel, idle. 

**Narration:**
- Castellan Core — core banking software. Look at its penetration-testing finding: the
  supplier tests itself, once a year, and refuses customer-initiated testing. The checklist
  calls that a material gap — something to schedule. A third-party risk officer would say:
  for core banking, that's not a gap to schedule. That's a stop.
- So they disagree in writing. The correction names the provision — threat-led penetration
  testing — is scoped to critical functions only, and says why, in plain language.
- **[load-bearing]** Store the rule. No retraining happened. A sentence a human wrote just
  became policy — and the agent notices on its own.

### 6 · THE HALF-SECOND — what just happened — demo §4 (build on 5)

**Onscreen:** The right column fills with the causal timeline: RULE STORED → INDEX
SEARCHABLE → **12 RE-CHECKED · 0 RE-READ · ~0.5s**. Beneath it three evidence cards:
CASTELLAN — verdict changed (the rule's origin) · AURORA KYC — rule retrieved and applied;
contract never opened · NORDLYS — considered, withheld: no gap to attach to. The memory
chip, verbatim UI copy: "changing 2 verdicts now".

**Narration:**
- **[load-bearing]** Reading all twelve contracts took the local model twelve minutes.
  Re-checking all twelve after that correction took half a second — it re-read nothing,
  because which clauses a contract contains hasn't changed. Only what the bank makes of
  them has.
- Castellan's verdict flips — that's the rule doing its job at home. The interesting one is
  Aurora KYC: nobody opened that contract, and the correction was retrieved there by
  meaning and applied to the same gap the checklist had already found.
- And Nordlys — considered, withheld. It has a testing clause; there is no gap for the rule
  to attach to. A rule can make an existing finding stricter. It cannot invent one.

### 7 · ONE DATABASE, THREE JOBS — Act IV, the reveal — demo §5

**Onscreen:** First naming of the store. The MongoDB panel: OPERATIONAL REGISTER (contracts
· verdicts · corrections) · VECTOR MEMORY (rules + `$vectorSearch`, bge-m3 1024-d) · EVENT
BUS (change streams → the always-on agent). Live counts row, NumberFlow. Dashed on-prem
boundary.

**Narration:**
- Everything you just watched moved through one MongoDB doing three jobs. The operational
  register. The vector memory the correction was retrieved from. And — through change
  streams — the event bus: a new contract makes the agent read; a new rule makes it
  re-check the register. It's a service that never polls.
- The counts on screen are aggregated in the database, live, with an append-only run log
  of every read and every sweep.
- **[load-bearing]** MongoDB isn't a sidecar here — it's the register, the memory and the
  nervous system, in one deployment.

### 8 · THE ARTIFACT — Act V, unplugged — demo §6

**Stage:** *(live: pull the cable, reload, teach another rule — then back to the deck.)*

**Onscreen:** Unit-spec runtime rail: nemotron-3-nano · 30B (Ollama) / bge-m3 1024-d /
MongoDB Atlas Local — change streams + vector index / Next.js register / Dell Pro Max GB10 ·
uplink: not required. Measured line: CLAUSE AGREEMENT 138/141 · 98% · measured on the box.

**Narration:**
- We just pulled the network. Reading, embedding, retrieval, storage — everything you
  watched runs on this one machine, a thirty-billion-parameter open model carried by the
  harness: quote-or-absent, fixed policy, human rules. Measured on the box: ninety-eight
  percent clause agreement, one hundred thirty-eight of one hundred forty-one calls.
- DORA does not require on-prem — and we don't claim it does. We built the runtime
  self-contained because of what this tool *is*: host your exit auditor in the cloud and it
  becomes row thirteen in its own register, with an exit clause of its own to negotiate.
- **[load-bearing]** Ask a bank for its DORA exit plan and you'll get a slide. This is the
  artifact — and there is no third party to lose.

### 9 · CLOSE

**Onscreen:** EXITPLAN wordmark, tan rule, "The model extracts. Policy decides. Reviewers
teach." Footer: synthetic register · business analysis, not legal advice.

**Narration:**
- ExitPlan. The model extracts. Policy decides. Reviewers teach it.
- (stop talking)

---

## Q&A — rehearsed answers (rendered on /script, never slides)

- **"Why not run this in your Azure tenant?"** — "You could — DORA doesn't forbid it, and
  we don't claim it does. But then the tool that audits your ICT third parties is itself an
  ICT third party — row thirteen in its own register, with its own exit clause to
  negotiate. We're proving existence, not necessity: the complete agent — model, memory,
  event bus, evidence — fits on one machine you own."
- **"You wrote the contracts *and* the ground truth. What does 98% mean?"** — "That the
  model finds what we know is there and doesn't invent what isn't — a validity check on the
  harness, not a benchmark claim about real contracts. On a real estate you'd re-measure.
  What carries over is the constraint: no quote, no claim."
- **"Everyone here pulled a cable. What's actually hard?"** — "Separating extraction from
  judgment. Reading a contract costs the model twelve minutes across the register;
  re-judging it costs half a second, because extractions are stored and only policy
  changed. Plus an always-on agent on change streams — no cron, no polling — that waits
  for the vector index to be consistent before it re-evaluates, so a taught rule can never
  silently produce stale verdicts."
- **AML desk** — only if asked about reuse: "the same box runs our earlier AML disposition
  desk at /aml; tonight is the DORA agent."

## Claims ledger — corrections from review

All V5 rows stand except: Castellan "one gap" (two — say "finding", never count); Aurora
"changed" → **applied** (seeded location rule already rejects Aurora; only Castellan flips);
"the model never decides" → "model extracts, policy disposes" (extract.py labels, assess.py
maps); "can only tighten" chip → "rules only act on an existing gap" (accepted exceptions
soften one step, never past an open blocker); 98% = 138/141 over the 11-contract `todo` set
of the measured run — quote as measured, don't claim all twelve; Art. 30 split stated as
9 base + 6 critical, with "blocking" explicitly our policy; live-counts citation →
app/system/page.tsx + lib/dora.ts (systemCounts); register chip carries no "synthetic"
(spoken once, slide 3).

## Timing — honest arithmetic (recounted after verification)

Bookends actually spoken sequentially (slides 1, 2, 8, 9): **346 words ≈ 2:28** at 140 wpm.
Slides 3–7 are cue cards spoken over the live demo; DEMO.md's beat budgets sum to **5:20**
(45+60+90+60+45+20). Realistic full run: **~7:45**. If the slot is 5:00, narration-trimming
alone cannot get there — demo *actions* must go: skip the live "How it works" visit (slide 7
already carries it as a designed frame, −45s), fold the cable-pull to reload-only (−10s),
tighten the register open and the Castellan wind-up (−25s of talk), cut slide 1 to its
load-bearing line + one sentence (−30s) and slide 8 to its last two lines (−25s) →
≈ **5:30**; anything tighter has to shorten the typed correction (pre-agree an abbreviation
with the team). Never trim slide 2, the €7.03M line, or the twelve-minutes-to-half-a-second
line. The typed correction and dropdown selection have a physical floor no talking speed
changes.

# Deck Plan — ExitPlan video + stage pitch

**Date:** 2026-08-22 · **Owner:** presentation team (Victor)
**Format:** one Next.js web deck at `deck/` in this repo, used twice:
1. **Video** (demo submission, pre-eval) — the deck screen-recorded with narration, product
   screen-recordings embedded as componentized scenes.
2. **Stage pitch** (top-8, 5 min) — the same deck, presenter-paced with arrow keys, submitted
   as a public URL (BuilderBase requires "accessible for anyone with the link" → deploy to Vercel).

**Judging map (from BuilderBase):** Local-first + always-on 30% · Business value 30% ·
Demo + pitch 30% · Technical execution 10%. Submission closes **22:00**.
The deck's job: the cable-pull carries criterion 1, the DORA/AMLR framing carries criterion 2,
this arc carries criterion 3, and exactly one spec-sheet slide carries criterion 4.

---

## Method (extracted from the shopifyhack deck — what made it work)

1. **Narration carries the argument; the screen carries one idea at a time.** Words on screen
   are labels, not content. One dense slide allowed, where reading *is* the point.
2. **A vocabulary rule.** Words that import a concept before it's needed never appear.
   Banned here, on screen and in narration: *RAG · vector search · embeddings · inference ·
   orchestration · LLM · hallucination · agentic*. Say what things do: "it finds the paragraph,"
   "it drafts," "rules fire."
3. **One object carries through.** Theirs was a coupon. Ours is **one alert** — it appears in
   the queue, opens, gets drafted, gets red-flagged, gets decided, survives the unplug.
4. **Builds, not slide changes.** Objects persist and animate between adjacent slides
   (shared scene groups; a keypress changes a prop, never remounts).
5. **One conceptual leap gets room.** Theirs: price = odds. Ours: *the exit plan is a legal
   duty that exists only as a slide.* The joke ("ask a bank — you'll get a PowerPoint") does
   the work; give it its own beat and a beat of silence.
6. **A load-bearing sentence.** Theirs: "the money arrives at the same moment the bill does."
   Ours: **"That's the exit plan — executing."** Said once, at the cable pull, slowest
   sentence in the recording.
7. **Honesty rules.** Anything simulated wears a chip; nothing stale wears "live."
   We say "synthetic data" on screen, once, small, in the queue scene.

## Design language — "SLEEPER" (from the GRMNT reference)

Different theme from shopifyhack's soft monochrome. This is **technical-editorial**: a studio
paper background, one enormous display word per act sitting *behind* the subject, and
engineering-drawing annotation on top.

- **Canvas:** warm paper `#E9E7E2`, faint vignette, static grain. No grid drift — the GRMNT
  frame is still; motion belongs to the marks, not the background.
- **Display type:** Anton (Google Fonts), near-black `#141412`, tracking tight, sized to bleed
  off-frame (~35–45vh cap height). The word sits behind the hero object; the object occludes it.
- **Body/label type:** Space Grotesk for labels; IBM Plex Mono for annotation chips and figures.
- **Annotation chips:** small near-black chips, 9–11px mono white text, a title row + 2–3 spec
  lines, connected by 1px leader lines with a 3px square terminal. They type on.
- **Instrument marks:** hairline crosshairs `+`, ruler ticks, tiny sparklines in margins,
  registration marks in corners. Draw in with `pathLength`, staggered.
- **The one accent — leather tan `#A9683C`:** reserved exclusively for **human action**
  (the Decide/File button, the highlighted verbs in the regulation, the analyst). The machine
  is monochrome; the human is warm. This rule is semantic, not decorative — it *is* the
  Art 18(3) argument rendered as color.
- **Motion rules:** one ease everywhere `[0.19, 1, 0.22, 1]`, no bounce. Lines draw, chips
  type, words slide behind objects with slight parallax, numbers roll (`@number-flow/react`).
  `prefers-reduced-motion` collapses everything (primitive already handles it).

## The arc — 12 slides, ~3:40 narrated · ~5:00 on stage with the live demo inserted

Giant backdrop words, in order:
`IN-HOUSE → A SLIDE → EXITPLAN → MONDAY → RULES → CITED → OVERRULED → DECIDE → UNPLUGGED → (spec) → (numbers) → EXITPLAN`

### Act I — the duty (0:00–0:50)

**1 — the regulation.** Full-bleed excerpt of DORA Art 28(8), typeset like a legal page;
the words **"reincorporate them in-house"** underlined in tan as they're spoken. Giant word
behind: `IN-HOUSE`.
> *"There's a sentence in EU law that every bank running a cloud AI has to answer to.
> DORA, Article 28(8): every financial entity must hold a transition plan to remove its
> ICT services from its provider — and reincorporate them in-house."*

**2 — the punchline.** Giant word: `A SLIDE`. A small, deliberately sad PowerPoint-frame mock
sits in front of it.
> *"Ask a bank what that plan looks like. You'll get a PowerPoint."* (beat)
> *"We built the artifact instead."*

**3 — the reveal.** The GB10 box (clean SVG, lattice front), SLEEPER-composed against giant
`EXITPLAN`, callout chips typing on: `COMPUTE — NVIDIA GB10 · 128GB unified` ·
`MODELS — on the disk, not an API` · `UPLINK — not required`.
> *"This is ExitPlan. A financial-crime triage agent for EU banks that runs entirely on this
> box — no cloud, no API keys, nothing leaves the room."*

### Act II — the workflow (0:50–2:20) — business value

**4 — the Monday.** Giant word: `MONDAY`. The alert queue: 200 rows, dense, mono. A chip:
`200 ALERTS · 99% NOISE · SYNTHETIC DATA`.
> *"This is a compliance analyst's Monday. Two hundred alerts. Ninety-nine percent of them
> are noise, and every one of them takes half an hour by hand."*

**5 — the alert opens** *(build from 4 — the row expands; the queue recedes)*. Giant word:
`RULES`. The screener's reason renders as an annotation: the rule that fired, the fuzzy
name match, the jurisdiction.
> *"One opens. Notice what found it: a rule. A deterministic screener owns the queue —
> the model never invents an alert, and it can't make one disappear."*

**6 — the draft.** Giant word: `CITED`. The disposition draft, the one dense slide: every
sentence followed by a citation chip; one chip expands to the exact source span (customer
file · policy paragraph · regulation). Leader lines connect sentence → source.
> *"Then the agent drafts the disposition. Every sentence carries its source — the customer
> file, the policy paragraph, the regulation — down to the exact span. If the evidence isn't
> there, it says so and escalates. It never fills a gap."*

**7 — the override.** Giant word: `OVERRULED`. The draft says one thing; a hard rule fires;
a red-flag bar stamps across it.
> *"And when a hard rule disagrees with the model — the rule wins. The model never
> overrules the rules."*

**8 — the human.** Giant word: `DECIDE`. The whole frame is monochrome except the tan
**Decide** and **File** buttons. A cursor — the only cursor in the deck — clicks.
> *"The agent drafts. A human decides, and a human files. That's Anti-Money-Laundering
> Regulation, Article 18(3) — the decision legally cannot be outsourced. Not to a vendor,
> not to a model. Our architecture isn't cautious. It's literal."*

### Act III — the cable (2:20–3:00) — local-first / always-on

**9 — the unplug.** Giant word: `UNPLUGGED`.
*Video:* footage of the hand pulling the uplink mid-triage, UI keeps moving; a status chip
flips `UPLINK — none` and nothing else changes.
*Stage:* this slide is the handoff to the live pull in the room, then back.
> *"Now the part every other AI product dreads."* (pull) *"No cloud, no fallback, no
> degraded mode — the next alert drafts exactly like the last one."* (beat)
> **"That's the exit plan — executing."**

### Act IV — proof and close (3:00–3:40)

**10 — the spec sheet.** The whole stack as a GRMNT-style spec table (the one slide for
technical execution): OpenClaw · NemoClaw · OpenShell · MongoDB vector search · bge-m3 ·
nemotron-3-nano 30B · GB10. Fast; no narration dwell.
> *"Under the hood: the full event stack — OpenClaw orchestrating, NemoClaw auditing every
> step into an append-only ledger, OpenShell sandboxing execution, MongoDB holding the
> evidence and the vectors. All of it on the box you just watched go dark."*

**11 — the market.** One number, huge: `150,000`.
> *"And this isn't a hobbyist's constraint. Finanz Informatik runs a hundred and fifty
> thousand banking users on models in its own data centers today. Every EU bank has the
> Article 28(8) duty. We're what the plan looks like when it's real."*

**12 — close.** `EXITPLAN` alone on paper, one tan underline, one line under it:
*"The artifact, not the slide."* Registration marks. Silence.

### Cut order if long
1. Slide 11 (fold the stat into 12's narration) · 2. Slide 2's mock (keep the line, cut the
visual beat) · 3. Merge 7 into 6 as a build.
**Never cut:** 1, 5, 6, 8, 9. The rules→cited→decide→unplug chain *is* the product.

## Build plan

- `deck/` — Next 16 + Tailwind 4 + `motion` + `@number-flow/react`, same architecture as
  shopifyhack's deck: scene groups keyed by slide number, keypress advance, `#n` deep links,
  `/script` page renders narration for the recording session.
- Product screens (queue, draft, override) are **componentized recreations**, not screen
  recordings — they animate on our timing, never break, and double as the stage visuals.
  If the real analyst UI lands in time, we film it for slide 9's cable shot only.
- Deploy: Vercel, root = `deck/` (public URL for the BuilderBase submission).
- Record at 1920×1080, cursor hidden (idle-hide is built in), narration to the `/script` text.

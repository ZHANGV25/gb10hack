# ExitPlan

**It reads the contracts. It shows the way out. Nothing leaves the building.**

An always-on compliance agent for the DORA exit-capability duty, running **entirely on one Dell Pro Max GB10**. European law (DORA Art. 28(8)) says a bank must be able to take any critical ICT service back in-house — and the proof lives in hundreds of vendor contracts nobody reads. ExitPlan reads them all, around the clock, against the Article 30 checklist, and keeps a register a regulator can actually ask for.

Synthetic register plus four real SEC-filed agreements. Business analysis, not legal advice.

**▶ The pitch deck (with the film embedded): [exitplan-deck.vercel.app](https://exitplan-deck.vercel.app/#0)**

## What the agent does

1. **It reads every contract.** For each ICT arrangement it works through the provisions DORA Article 30 requires (9 for every arrangement, 15 where a critical function is involved) and must **quote the clause it relied on** — a claim with no verbatim text behind it is recorded as absent. Contracts too big for the context window (one SEC filing is 113,731 characters) are split; vector retrieval picks the passages worth reading.
2. **A fixed checklist decides.** Verdicts come from deterministic policy (exit strategy, audit rights and data return are blocking), never from the model.
3. **People correct it, and it learns.** A reviewer who disagrees writes the reason in one or two sentences. That sentence is stored as a rule — as a vector, found later by meaning — and the register is re-checked in under two seconds. No retraining. Every rule carries its author's name and can be switched off.
4. **It never sleeps.** A change-stream watcher (`deploy/dora-watch.service`) wakes the agent the moment a contract or a rule changes. Restart it mid-teach and it replays what it missed from its resume token.

One MongoDB (Atlas Local, `:27018`) does three jobs: the **register** (contracts, verdicts, corrections — the evidence you hand a regulator), the **memory** (rules + `$vectorSearch` over bge-m3 embeddings), and the **alarm** (change streams driving the always-on agent).

The same box also runs our earlier AML disposition desk at `/aml` — a different governed workflow on the same stack.

## The stack

| | |
|---|---|
| Model | `nemotron-3-nano:30b` on Ollama, local |
| Embeddings | `bge-m3` (1024-d), local |
| Store | MongoDB Atlas Local — collections, vector index, change streams |
| App | Next.js register at `127.0.0.1:3000` |
| Box | Dell Pro Max GB10 — no uplink required in the runtime path |
| Built with | OpenClaw driving the box (build tool, not the runtime) |

Measured on the curated book: clause agreement 138/141 (98%). The four SEC filings carry no ground truth — they are the control, not the benchmark.

## Repo map

```
apps/engine/exitplan/    # register engine: dora.py (Art. 30 catalogue), extract / assess / judge,
                         # memory, watch (change-stream agent), seeds
apps/engine/scripts/     # seed_dora.py · review_all.py · reset_demo.py · ingest_real.py · seed_memory.py
apps/web/                # the register UI: / (ICT register) · /contracts/[ref] · /memory
                         # (what it has learned) · /activity · /system (how it works) · /aml (older desk)
deck/                    # stage deck + /script (V19 narration, Q&A, preshow) — dev server :3001
presentation/            # the 5-minute pitch site: cover → 2 slides → the film (embedded, Enter
                         # rolls it) → close, appendix of recorded frames — dev server :3010
demo/                    # Playwright demo recorder + narration script for the film
docs/                    # PITCH.md (framing + graveyard), DEMO.md, DECK-PLAN.md
```

## Run it

On the GB10 (or any machine with Ollama + Atlas Local):

```bash
PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/seed_dora.py     # seed the register
PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/review_all.py    # first full read (~12 min)
npm run dev --prefix apps/web -- --hostname 127.0.0.1 --port 3000
```

Between demo runs: `reset_demo.py` retires taught rules and the agent reverts the verdicts itself (instant). Mongo is `mongodb://127.0.0.1:27018` — ours; do not touch `:27017`.

The pitch site: live at [exitplan-deck.vercel.app](https://exitplan-deck.vercel.app/#0), or locally with `npm run dev --prefix presentation -- --port 3010`. Keys: → / Space advance, ← back, **Enter rolls the film** on slide 3. Presenter narration and rehearsed Q&A at `/script`.

## The film

A ~2-minute screen recording of the live desk (in `presentation/public/film.mp4`): the register and the trapped €7M → the Helvetia contract one exit clause short of freedom → a risk officer overruling the machine in two sentences → the half-second sweep catching a contract nobody opened → the real SEC filing read by retrieval → one database, three jobs.

## Say / never say

- Say: **"Regulation requires a tested exit path. We built the artifact."**
- Say "synthetic" out loud once; it appears nowhere in the product.
- Never: "EU law requires on-prem" (false — the duty is exit *capability*).
- Never: invented scale or dollar ROI from synthetic data.
- Never: OpenClaw as the runtime — it built and drove the box; the harness is bespoke.

Canonical framing: [`docs/PITCH.md`](./docs/PITCH.md). Narration source of truth: `deck/src/lib/slides.ts`. Agent handoff: [`CLAUDE.md`](./CLAUDE.md).

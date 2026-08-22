# ExitPlan — agent handoff

Read this before changing anything. Pitch and regulation live in [`PROJECT-CONTEXT.md`](./PROJECT-CONTEXT.md). This file is the **running product** as of 22 Aug 2026, for Claude Code / Cursor / anyone picking up Gyorgy’s work.

**Team:** EuroMaxing (Gyorgy Varga / `gyurmatag`). **Repo:** https://github.com/ZHANGV25/gb10hack (`main`). **Event:** Dell × NVIDIA GB10 hackathon. Submissions **18:00** the same day.

---

## What it is

**ExitPlan** is an on-box **financial-crime triage desk** for a fictional bank (**Nordhafen Bank**).

- Monitoring **rules** open alerts (sanctions names, split payments under €10k, high-risk countries). The model **cannot invent an alert**.
- A local **drafter** writes a disposition memo and cites policy. It **cannot dismiss, escalate, or file**.
- An **analyst** records: dismiss as false positive, refer to MLRO, or submit a SAR to the FIU.
- Exact sanctions match (**Viktor Kovalenko**) **cannot be dismissed**.
- Everything stays on the Dell Pro Max GB10. **Zero cloud LLM** in the runtime path. No Vercel AI Gateway.

Pitch in one line: DORA Art. 28(8) is an **exit path** (reincorporate ICT in-house), not a cloud ban. AMLR Art. 18(3): the agent drafts; a human decides and files. Cable-pull is the demo closer.

**Not** FieldMedic (old medical product, git tag `pre-bank-pivot`). **Not** Covenant (ICT contract register). Covenant Python still exists under `apps/engine/covenant/` but the **UI is ExitPlan**.

---

## Never / always (product + copy)

| Never | Always |
|---|---|
| “EU law requires on-prem” | “Regulation requires an exit path. We built it.” |
| Demo / fake / synthetic / GPU / GB10 / Nemotron / hackathon in the **UI** | Production voice: analyst desk, dispositions, SAR |
| Model decides or files | Human clicks Dismiss / Refer to MLRO / Submit SAR to FIU |
| Credit scoring / creditworthiness | Financial-crime detection only (AI Act carve-out) |
| “Run Nemotron on this GPU” | **Generate disposition** |
| Claiming uploaded PDFs/spreadsheets | Cases come from core banking + rules |

UI must stay **compact** (internal tool density: `text-sm`, tight rows). Do not blow up type again.

Say “synthetic data” **on stage**, not as chrome in the product.

---

## Runtime (GB10)

| Thing | Value |
|---|---|
| Host | `promaxgb10-851d` / `10.0.0.166` |
| Gyorgy’s tree | `/home/dell/gyuri/gb10hack` **only** (shared `dell` account) |
| Mac clone | `/Users/gyurmatag/Projects/gb10hack` |
| SSH | `ssh -S /tmp/dell.sock dell@10.0.0.166 '…'` (human holds master; plain ssh hangs) |
| UI | Next.js `127.0.0.1:3000` — tunnel to Mac `http://127.0.0.1:3000` |
| Next log | `/tmp/covenant-web.log` (legacy name) |
| Mongo **ours** | `mongodb://127.0.0.1:27018` db `exitplan` (Atlas Local `gyuri-atlas-local`) |
| Mongo **not ours** | `:27017` (`hack-mongo`, other team) — **do not touch** |
| Ollama | `http://127.0.0.1:11434` — chat `nemotron-3-nano:30b`, embed `bge-m3` (1024-d) |
| ⚠ `.env` | must contain **exactly one** `EMBED_MODEL` line, `bge-m3`. A stale `nomic-embed-text` line silently made the seeder write 768-d vectors into a 1024-d index, and `$vectorSearch` returned nothing. `config.py` now takes the last value per key. |
| Do not kill | Jupyter `:8888`, OpenClaw TUI, other teams’ containers |

Seed (wipes customers, txns, alerts, dispositions, corpus, audit_log):

```bash
cd /home/dell/gyuri/gb10hack
PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/seed_exitplan.py
```

Expect **8 customers, 8 alerts, 6 corpus chunks**.

Deploy from the Mac (after commit + `git push origin main`):

```bash
rsync -az --exclude node_modules --exclude .next \
  -e "ssh -S /tmp/dell.sock" \
  /Users/gyurmatag/Projects/gb10hack/apps/web/ \
  dell@10.0.0.166:/home/dell/gyuri/gb10hack/apps/web/
rsync -az -e "ssh -S /tmp/dell.sock" \
  /Users/gyurmatag/Projects/gb10hack/apps/engine/exitplan/ \
  dell@10.0.0.166:/home/dell/gyuri/gb10hack/apps/engine/exitplan/
```

No `npm run deploy:web`. No Vercel. Re-seed on the box if engine seed/screen/corpus changed.

---

## Repo map

```
apps/engine/exitplan/     # product engine
  screen.py               # rules (watchlist / corridor / structuring)
  seed.py                 # eight named cases (BOOK)
  corpus.py               # DORA + AMLR + Nordhafen policy chunks
  embed.py / retrieve.py  # bge-m3 → Mongo $vectorSearch
  decide.py               # human decide/file; red-flag gate
  db.py                   # Mongo indexes + corpus_vector
apps/engine/scripts/seed_exitplan.py
apps/engine/covenant/     # leftover; not the demo
apps/web/                 # Next.js 16 desk
  app/globals.css         # design tokens (light only, hairline/small-radius)
  app/page.tsx            # Alert queue + stat tiles + "what this desk does"
  app/system/page.tsx     # "How it works" — architecture diagram + live counts
  app/audit/page.tsx      # Activity log
  app/alerts/[alertId]/   # Case
  app/api/chat/route.ts   # streamText → Ollama; tool retrievePolicy
  app/api/decide/route.ts
  lib/architecture.ts     # PIPELINE source of truth (7 stages, CASE_STAGES = 4)
  lib/format.ts           # headlines, rule labels, tones, countries, €, audit
  components/shell.tsx    # sidebar + Page header
  components/system-diagram.tsx   # the /system architecture diagram
  components/pipeline-strip.tsx   # 4-step strip on a case
  components/how-it-works.tsx     # 3-step band on the queue
  components/pill.tsx     # Pill / Dot / Rail / Eyebrow
  components/case-workspace.tsx
  components/memo-text.tsx        # renders the drafter's light markdown
deck/                     # pitch deck (other teammates). Do not mix into the desk.
```

Web talks to Mongo and Ollama **on the box**. AI SDK: `createOpenAICompatible` → `http://127.0.0.1:11434/v1`.

---

## The eight cases

Only these alerts exist (rules fire; no forced noise on random people).

| Who | Why it’s open |
|---|---|
| Viktor Kovalenko | Exact sanctions match + €61k to Iran. **Dismiss locked.** |
| Elena Rossi | Restaurant; three payments just under €10k to M. Bianchi |
| Jonas Berg | Exporter; €61k to Kish Industrial Supply, Iran |
| Viktor Kovalev | Name similar to Kovalenko; ordinary Berlin salary/rent |
| Omar Rashid | Similar to listed Omar Al-Rashid; Cologne dentist |
| Marina Petrova | Similar to Marina Petrovic; Vienna piano teacher |
| Marina Petersen | Weak name match; retail Amsterdam |
| Chen Wei | Weak match vs listed **company** Chen Wei Holdings |

Watchlist in `screen.py`: Kovalenko, Marina Petrovic, Omar Al-Rashid, Chen Wei Holdings.

Headlines/stories live on the alert document (`headline`, `story`). Change cases in `seed.py` then re-seed.

---

## UI loop

Left sidebar: **Alert queue · Activity · How it works**, with live counts and
the on-prem footer. Layout is desktop-first; under 1024px the sidebar collapses
to a top nav.

1. **Alert queue** — four stat tiles (awaiting / value in review / decisions / where it runs),
   a three-step "what this desk does" band, then the case table: customer, why it
   opened, rule chips, value, status. Tabs default to **Needs a decision**.
2. Open a case — header carries severity, value, payment count, rules fired.
   The 4-step strip (Alert opened → Policy retrieval → Disposition draft → Analyst
   decision) highlights where the case is *now*, live during generation.
3. Left column: why it opened (one card per rule, with the mechanic in plain
   English), who the customer is, payments with the rule-triggering rows marked.
4. **Generate disposition** — streams; shows the vector query, the matched policy
   titles and their cosine scores. **~30–60s** end to end; ~31s measured.
   Suggestion chips include "Can you file this SAR for me?" (it refuses).
5. **Record the decision** — three option rows with their consequence. Dismissal
   is visibly locked on a red flag.
6. **Activity** — actor-coloured timeline, decision-specific rationale.
7. **How it works** — the architecture diagram (5 bands, live counts, MongoDB
   collections), stage-by-stage table, guardrails.

If you change the pipeline, edit `apps/web/lib/architecture.ts` (case strip +
`/system` both read it). Demo script: [`DEMO.md`](./DEMO.md).

---

## Safety stack (must not regress)

1. **Rules own the hit** (`screen.py`). Chat prompt: do not invent txns or watchlist hits.
2. **Retrieval-grounded draft** — `retrievePolicy` → `searchCorpus` (`$vectorSearch`;
   falls back to a keyword scan when the index errors **or returns zero rows**, so a memo
   is never written against an empty policy set).
3. **Abstention** is valid.
4. **Red-flag gate** in decide API + UI. Verified: `POST /api/decide` with
   `close_noise` on `ALT-0001` returns **HTTP 409**.
5. **Append-only** `audit_log`.
6. **Cable-pull**: no cloud APIs.

---

## Pitch demo (updated labels)

Queue → **Kovalev** (similar name, rules not the model) → **Generate disposition** → ask “Can you file this?” (must refuse) → **Refer to MLRO** → **Kovalenko** (dismiss locked) → **Submit SAR to FIU** → **Activity** → pull Wi-Fi.

SAR = suspicious activity report to the FIU, not a file upload.

---

## Git / process

- Conventional commits (`feat` / `fix` / `chore`). No Cursor attribution, no `Co-authored-by`.
- Push `origin/main`, rsync to `/home/dell/gyuri/gb10hack`, re-seed if data/rules changed.
- Do not force-push main. Rebase if rejected.

When facts here change, **update this file in the same commit**.

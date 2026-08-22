# ExitPlan — agent handoff

Read this before changing anything. Pitch and regulation live in [`PROJECT-CONTEXT.md`](./PROJECT-CONTEXT.md). This file is the **running product** as of 22 Aug 2026, for Claude Code / Cursor / anyone picking up Gyorgy’s work.

**Team:** EuroMaxing (Gyorgy Varga / `gyurmatag`). **Repo:** https://github.com/ZHANGV25/gb10hack (`main`). **Event:** Dell × NVIDIA GB10 hackathon. Submissions **18:00** the same day.

---

## What it is

**ExitPlan** is an **always-on DORA agent** that reads every ICT third-party
contract a fictional bank (**Nordhafen Bank**) depends on, checks it against
the provisions **DORA Article 30** requires, and **learns from the reviewers
who correct it**.

- A local model **reads each contract** and answers, for each of the fifteen
  Article 30 provisions: present, inadequate, or absent — and must quote the
  clause. A claim with no quote is recorded as absent.
- **Python decides**, not the model (`assess.py`). Missing exit rights, audit
  rights or data return are *blocking*; the rest are *material*.
- A reviewer who disagrees writes one sentence. It is embedded and stored in
  MongoDB as a **rule**. The agent retrieves it by meaning on any contract with
  a similar gap. **No fine-tuning.**
- The agent is subscribed to MongoDB **change streams**. A new contract makes
  it read; a new rule makes it **re-check the whole register in ~0.5s** by
  reusing stored extractions.
- Everything on the Dell Pro Max GB10. **Zero cloud API calls.**

Pitch in one line: DORA Art. 28(8) requires a bank to be able to pull an ICT
service back in-house — this is the agent that tells it, contract by contract,
whether it actually can. Cable-pull is the demo closer.

Measured: **138/141 (98%)** clause agreement against the book's ground truth.

**Not** FieldMedic (git tag `pre-bank-pivot`). The **AML disposition desk** —
the earlier financial-crime build — still runs at `/aml` and is not the demo.

## Never / always (product + copy)

| Never | Always |
|---|---|
| “EU law requires on-prem” | “Regulation requires an exit path. We built the thing that proves you have one.” |
| Demo / fake / synthetic / GPU / GB10 / Nemotron / hackathon in the **UI** | Production voice: register, arrangement, provision, reviewer |
| “The AI decides the contract is bad” | The checklist decides; the model finds and quotes clauses |
| “It learns automatically” | It learns **from a named reviewer's written correction** |
| “We fine-tune on your contracts” | Retrieval, not retraining — every rule is a readable sentence you can switch off |
| Claiming it reads uploaded PDFs | Contracts come from the register in MongoDB |

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

Seed the register (wipes contracts, verdicts, rules, corrections, runs):

```bash
cd /home/dell/gyuri/gb10hack
PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/seed_dora.py
PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/review_all.py   # ~12 min
```

Expect **12 contracts (8 critical), 2 rules**, then `138/141 (98%)` agreement.

The agent runs as a supervised user service (lingering is on, so it survives
logout):

```bash
systemctl --user status dora-watch
journalctl --user -u dora-watch -f
```

⚠ Start long-running processes on the box with `systemd-run --user`, **not**
`nohup … &` over ssh — the ssh channel closing kills them.

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
apps/engine/covenant/     # the DORA agent (package name is historical)
  dora.py                 # the Article 30 catalogue — 15 provisions, 3 blocking
  book.py                 # 12 ICT contracts, assembled from clause boilerplate
                          #   + ground_truth() for evaluating the agent
  extract.py              # model reads the contract -> present/inadequate/absent + quote
  assess.py               # deterministic gaps -> verdict; apply_rules() = memory overlay
  judge.py                # extract -> assess -> retrieve rules -> verdict + audit run
  watch.py                # ALWAYS-ON: change streams on contracts and rules
  learn.py                # a correction becomes an embedded rule
  retrieve.py / embed.py  # $vectorSearch over rules_vector
  db.py                   # collections, indexes, self-updating vector indexes
apps/engine/scripts/
  seed_dora.py            # load the register + 2 seeded rules
  review_all.py           # read every unreviewed contract, report agreement
apps/engine/exitplan/     # the earlier AML desk engine (still used by /aml)
apps/web/
  app/page.tsx            # the ICT register
  app/contracts/[ref]/    # one contract: checklist, quoted clauses, review panel
  app/memory/page.tsx     # what it has learned
  app/activity/page.tsx   # what the always-on agent has done
  app/system/page.tsx     # architecture + what MongoDB is doing
  app/api/review/route.ts # a reviewer's correction -> a rule (the agent does the rest)
  app/aml/, app/alerts/   # the earlier AML desk, off the nav
  lib/dora.ts             # register aggregation ($lookup, gap frequency)
  lib/provisions.ts       # the Article 30 checklist, for display
  components/register-table.tsx, provision-checklist.tsx, review-panel.tsx,
             dora-diagram.tsx, memory/activity views
deck/                     # pitch deck (other teammates). Do not mix in.
```

**The split that matters:** the model only ever says *what a clause says*.
`assess.py` decides what that means, and `rules` (written by humans) can make
a verdict stricter. Keep it that way.

## The register

Twelve ICT arrangements, €16,375,000/yr, 8 critical. `book.py` declares which
clauses each contract contains, so whatever it omits is a real gap the agent
must find from the text alone.

| Supplier | Function | Critical | Intended gaps |
|---|---|---|---|
| Helvetia Cloud Services | Core banking hosting | yes | exit strategy |
| Meridian Payments | Card processing | yes | audit rights (SOC 2 only) |
| Nordlys Data Centre | Colocation | yes | — |
| Aurora KYC | Sanctions screening | yes | locations, TLPT |
| Brightmail Secure | Email security | no | — |
| Vantage HR Cloud | HR and payroll | no | data return, authority cooperation, training |
| Castellan Core Systems | Core banking software | yes | termination rights, TLPT |
| Skyward Analytics | Regulatory reporting | yes | termination rights |
| Pinnacle Managed Print | Printing | no | — |
| Orion Trading Systems | Market data | yes | — (exclusivity clause) |
| Larsen Legal Archive | Document archive | no | locations |
| Tessera Identity | Identity verification | yes | — |

Change the book in `book.py`, then re-seed and re-review.

## UI loop

Sidebar: **ICT register · What it has learned · Agent activity · How it works**.

1. **Register** — four tiles (arrangements with gaps, value that cannot be
   cleanly exited, Article 30 gaps, total contracted), a three-step explainer,
   the table, and a live aggregation of which provision the estate is weakest on.
2. **A contract** — verdict and reasoning, then the Article 30 checklist. Each
   row expands to the **verbatim clause** the agent relied on.
3. **Reviewer decision** — agree, or disagree and write one sentence. That
   sentence becomes a rule. The route only writes; the agent re-evaluates.
4. **Memory consulted** — the rules retrieved for this contract, their cosine
   scores, and whether each one actually fired.
5. **What it has learned** — every rule, its author, the contract it came
   from, and how many verdicts it is changing right now.
6. **Agent activity** — change-stream events and re-evaluation sweeps with
   before/after verdicts.

## Safety stack (must not regress)

1. **The checklist decides, not the model.** `assess.py` is deterministic.
2. **No quote, no claim.** A provision reported present without verbatim text
   is downgraded to absent in `extract.py`.
3. **Memory cannot invent a gap.** A rule only fires on a provision the
   checklist already found missing, and can be scoped to critical or
   non-critical arrangements.
4. **An exception softens by one step and never blesses a blocking gap.**
   `reject → escalate → approve`, and refused entirely while an unaddressed
   blocking provision is outstanding.
5. **Wait for the index.** The watcher confirms a new rule is retrievable
   before re-evaluating — Atlas Search is eventually consistent, and
   re-evaluating too early silently produces the old verdicts.
6. **Append-only `runs`** — every read, sweep and memory change.
7. **Cable-pull**: no cloud APIs.

## Pitch demo

Register → **Helvetia Cloud** (14/15, missing only the exit clause — the
Art. 28(8) case) → **Castellan Core** → disagree, teach a rule → **Agent
activity** (12 contracts re-checked in ~0.5s) → **Aurora KYC**, which nobody
opened, now carries the same rule → **Nordlys**, where it correctly did not
apply → **How it works** → pull the cable.

Full script: [`DEMO.md`](./DEMO.md).

## Git / process

- Conventional commits (`feat` / `fix` / `chore`). No Cursor attribution, no `Co-authored-by`.
- Push `origin/main`, rsync to `/home/dell/gyuri/gb10hack`, re-seed if data/rules changed.
- Do not force-push main. Rebase if rejected.

When facts here change, **update this file in the same commit**.

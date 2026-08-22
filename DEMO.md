# ExitPlan — demo script

An **always-on DORA agent that reads every ICT contract** the bank depends on,
finds the Article 30 provisions that are missing, and **learns from the people
who correct it**. Every step below was clicked against the running system.

Runtime **5 minutes**. All figures here are real, measured on the box.

---

## The one-sentence version

> DORA Article 28(8) says a bank must be able to pull an ICT service back
> in-house. To know whether it can, someone has to read every contract and
> check for an exit clause, an audit right, a data-return clause. Nobody does,
> because there are hundreds. This agent does it continuously, and it gets
> better every time a reviewer disagrees with it.

---

## Before you start

```bash
ssh -S /tmp/dell.sock dell@10.0.0.166 'systemctl --user status dora-watch --no-pager | head -3'
```

Expect `active (running)`. That is the agent. It is a supervised user service,
so it survives logout and restarts itself on failure.

Reset between runs — **instant**, use this one:

```bash
ssh -S /tmp/dell.sock dell@10.0.0.166 'cd /home/dell/gyuri/gb10hack && PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/reset_demo.py'
```

It retires whatever you taught during the last run and leaves the two seeded
rules. Deleting a rule goes through the same change stream as adding one, so
the agent reverts the verdicts by itself. Nothing is re-read.

Full rebuild — only if the contracts themselves change:

```bash
ssh -S /tmp/dell.sock dell@10.0.0.166 'cd /home/dell/gyuri/gb10hack && PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/seed_dora.py && PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/review_all.py'
```

The seed is instant; **the review takes about 12 minutes** because the agent
reads all twelve contracts with the local model. Do it well before you
present. Expect `clause_agreement: 138/141 (98%)`.

Checks:

| Check | Expect |
|---|---|
| `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/` | `200` |
| Register page | 12 arrangements, 7 with gaps, €7,030,000 not cleanly exitable |
| Castellan Core | **Gaps to close** — this is the one you flip |
| Memory page | 2 rules, both from earlier reviews |

Browser at **1440×1250 or wider**.

---

## The run

### 1 · The register — "somebody has to read all of these" (45s)

Open `http://127.0.0.1:3000/`.

> Twelve ICT arrangements, €16.4 million a year. Eight support a critical
> function, so the longer Article 30 list applies to them. The agent has read
> every one and found ten gaps.
>
> **€7 million a year runs through contracts this bank cannot cleanly exit or
> inspect.** That is the number a supervisor asks for and nobody can produce.

Point at the right-hand panel:

> The same provision missing across several suppliers is a contracting
> problem, not a supplier problem. Two contracts have no penetration-testing
> clause. Two don't disclose where the data actually sits.

### 2 · Helvetia Cloud — the Article 28(8) case (60s)

Click **Helvetia Cloud Services AG**.

> The core banking platform. €4.18 million a year. Fourteen of the fifteen
> required provisions are in the contract — this is a *good* contract.
>
> The one it is missing is the exit strategy. There is no transition period
> and no obligation to help the bank move. Which means the bank's DORA
> Article 28(8) exit plan for its core banking platform is a document that
> cannot be executed.

Expand a provision — click **show clause** on one that passed:

> Every tick is backed by the actual sentence in the contract. The model's job
> is to find the clause and quote it. If it claims a provision is present and
> can't produce the text, it gets recorded as absent.

### 3 · Castellan Core — teaching it (90s)

Back to the register, open **Castellan Core Systems Ltd** (`NHB-ICT-2018-001`).

> One gap: threat-led penetration testing. The clause says the supplier does
> its own annual test and won't allow customer-initiated testing. The
> checklist calls that a material gap — "gaps to close".
>
> A third-party risk officer would disagree. For a core banking supplier that
> is not a gap to schedule, that's a stop.

Click **Disagree — correct it**. The form is pre-filled with the right
provision. Set **Apply this to → critical functions only**, and write:

> A supplier that refuses customer-initiated penetration testing of its
> production environment cannot be assured for a critical function. Treat a
> self-testing-only clause as not compliant, not a routine gap.

Click **Store rule and re-check the register**. It takes about three
seconds — that is the local embedding model turning your sentence into a
vector.

> No retraining. That sentence was embedded and written to MongoDB. The agent
> is subscribed to that collection, so it woke up on its own.

### 4 · What just happened — the point of the whole thing (60s)

Open **Agent activity**.

> The rule landed, the agent waited for the vector index to catch up, then
> re-checked **all twelve contracts in half a second**. It did not re-read a
> single document — which clauses a contract contains hasn't changed, only
> what the bank makes of them.

Open **What it has learned**. The new rule says *changing 2 verdicts now*.

Now the punchline — open **Aurora KYC Ltd** (`NHB-ICT-2023-018`):

> Nobody opened this contract. It has the same weakness, so the agent found
> the rule by meaning and applied it here too. That is the difference between
> a rule engine and a memory.

And show it withholding correctly — open **Nordlys Data Centre**:

> Same rule considered, not applied. Nordlys has a penetration-testing clause,
> so there is no gap for the rule to attach to. It can only make a verdict
> stricter on a gap the checklist already found. It cannot invent one.

### 5 · How it works (45s)

Open **How it works**.

> One MongoDB doing three jobs: the register, the vector store for the agent's
> memory, and the event bus that makes it always-on. Change streams, not a
> cron job. Everything inside the dashed line is on the bank's own hardware.

### 6 · Pull the cable (20s)

Unplug the network. Reload. Open a contract. Teach it a rule.

> Reading, embedding, retrieval, storage — all of it local. There is no third
> party to lose.

---

## If something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| Taught a rule, nothing changed | vector index hadn't caught up | the agent waits for it; check `indexed=True` in the journal |
| Buttons do nothing | stale Turbopack dev chunks (403 on a JS chunk) | restart the dev server |
| Register shows "Not yet read" | review never ran | `review_all.py`, ~12 min |
| Agent not reacting | service stopped | `systemctl --user restart dora-watch` |

Agent log: `journalctl --user -u dora-watch -f`

---

## The recorded walkthrough

A narrated 3:18 cut of everything below is on the Desktop:

| File | What it is |
|---|---|
| `ExitPlan-DORA-agent-demo-narrated.mp4` | 3:18, voiceover, subtitles embedded |
| `ExitPlan-DORA-agent-demo-narrated.srt` | the same subtitles, separately |
| `ExitPlan-DORA-agent-demo.mp4` | an earlier 1:52 silent cut with on-screen captions |
| `ExitPlan-DORA-agent-demo-transcript.md` | beat table, the narration, and what the video does *not* show |

It was driven against the live desk by [`demo/record-demo.js`](./demo/record-demo.js)
(Playwright), with each beat held for exactly as long as its narration segment
— worst-case drift 11 ms. Narration text is in
[`demo/narration-script.json`](./demo/narration-script.json). Re-record with:

```bash
node demo/record-demo.js /tmp/dora-vo
```

The voiceover was generated with a cloud text-to-speech service. That is
post-production on a video; nothing in the product's runtime path leaves the
box, and the cable-pull claim is unaffected. Say so if anyone asks how the
video was made.

---

## Answering the three judging criteria

Have these ready — each one is a click, not a claim.

### "The agent survives its own sandbox"

Stop it, change policy while it is dead, start it again:

```bash
ssh -S /tmp/dell.sock dell@10.0.0.166 'systemctl --user stop dora-watch'
# teach a rule in the UI, or edit one directly — the agent is not running
ssh -S /tmp/dell.sock dell@10.0.0.166 'systemctl --user start dora-watch'
ssh -S /tmp/dell.sock dell@10.0.0.166 'journalctl --user -u dora-watch -n 5 --no-pager -o cat'
```

It replays the change it missed from the resume token in `watch_state` and
re-evaluates without being asked. Nothing lives in process memory: memory,
verdicts, cached readings and the stream position are all in MongoDB.

### "A retriever that changes behaviour"

Two retrievers, both load-bearing.

**It decides what the model reads.** Open **Sunrise Communications AG**. The
agreement is 113,731 characters. The page says it was split into passages and
eleven were retrieved by vector search — the model never saw the rest. Without
retrieval this contract cannot be read at all.

**It decides what the bank makes of it.** Teach the Castellan rule and watch
the verdict flip, then retire it and watch it revert. On **Vantage HR** the
memory panel shows the data-return rule *Applied* at 0.767 and others
*Considered, did not apply*.

If asked whether the ranking matters: memory holds twelve precedents from
three reviewers, and search is scoped per gap. A blended query put the
deciding rule seventh of twelve — that is why it is scoped.

### "Real business data"

Four genuine EX-10 material contracts pulled from SEC EDGAR full-text search —
Sunrise Communications, Edgemode, Platinum Analytics, NuScale Power — 58k to
114k characters, marked **filed** in the register with a link to the filing.

> The bank's own twelve are synthetic, and deliberately so: they have known
> ground truth, which is the only reason the 98% clause figure means anything.
> These four are the control. Nobody wrote them for us, they carry no ground
> truth, and the same checks run over them unchanged.

---

## Numbers worth knowing

| | |
|---|---|
| Contracts in the register | 12 curated (8 critical), €16,375,000/yr + 4 real SEC filings |
| Provisions checked | 15 per critical arrangement, 9 otherwise |
| Clause agreement vs ground truth | **138/141 (98%)** |
| Reading a curated contract | 35–95s (local model) |
| Reading a 113k-char real filing | ~77s, via 11 retrieved passages |
| Rules in memory | 12 precedents, 3 reviewers |
| Re-checking all 12 after a correction | **~0.5s** |
| Cloud API calls | 0 |

---

## Also on this box

The AML disposition desk (the earlier financial-crime build) still runs at
`/aml`. It is not part of this demo.

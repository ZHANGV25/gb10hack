# ExitPlan — demo script

Verified end to end in the browser on 22 Aug 2026 against the running desk.
Total runtime **4–5 minutes**. Every step below was actually clicked and the
result checked, including the timings.

---

## Before you start

```bash
ssh -S /tmp/dell.sock dell@10.0.0.166 'cd /home/dell/gyuri/gb10hack && PYTHONPATH=apps/engine .venv/bin/python apps/engine/scripts/seed_exitplan.py'
```

Expect `8 customers · 27 transactions · 8 alerts · 6 corpus`. This wipes every
decision, so the queue opens clean at **8 awaiting, 0 decided**.

Then check the three things that can break the demo:

| Check | Command | Expect |
|---|---|---|
| Desk is up | `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/` | `200` |
| Vector search returns real hits | see snippet below | 4 rows, top score ≈ 0.78 |
| Draft model responds | open any case, click **Generate disposition** | first tokens in ~10s |

```bash
ssh -S /tmp/dell.sock dell@10.0.0.166 'cd /home/dell/gyuri/gb10hack && PYTHONPATH=apps/engine .venv/bin/python -c "
from exitplan.embed import embed_text
from exitplan.retrieve import similar_spans
for h in similar_spans(embed_text(\"name similarity false positive watchlist policy\"), 4):
    print(round(h[\"score\"],3), h[\"title\"])"'
```

If that prints nothing, the corpus embeddings and the `corpus_vector` index
disagree on dimensions — re-seed, and check that `.env` has exactly one
`EMBED_MODEL` line and it says `bge-m3`.

Browser at **1440×900 or wider**, light mode. Below 1024px the sidebar collapses.

---

## The run

### 1 · The queue — "this is a real morning's work" (30s)

Open `http://127.0.0.1:3000/`.

> Overnight, monitoring screened 27 payments across 8 customers and opened 8
> cases. €112,000 is sitting in review. Every one of these needs an analyst
> decision today — that's the job this desk exists to do.

Point at the three-step band: **rules open the case → the desk drafts → you
decide**. Say the line that matters:

> The model never opens a case and never closes one.

### 2 · Viktor Kovalev — the false positive (90s)

Click **Viktor Kovalev** (`ALT-0004`, "Name similar to a sanctioned person").

Point at **Why monitoring opened this**:

> A deterministic rule scored his name against the sanctions list at 87% —
> Viktor Kovalev versus Viktor Kovalenko. A rule found that, not a model.
> His payments are salary, rent, freight, groceries.

Click **Generate disposition**. While it runs, narrate the pipeline strip
lighting up:

- **Policy retrieval** — the case becomes a 1024-dimension vector and MongoDB
  `$vectorSearch` returns the four closest policy passages, with scores on
  screen. *"It can only cite text that came back from that search."*
- **Disposition draft** — the memo streams in. **30–60 seconds**; keep talking.

The memo lands with bracketed citations and recommends **abstain from filing,
refer to the MLRO** — which is the right answer for a weak match.

### 3 · Ask it to file — the refusal (30s)

Click the suggestion chip **"Can you file this SAR for me?"**

Verified response:

> *"I'm not able to submit a SAR on your behalf. In our workflow the SAR must
> be prepared and filed by a designated analyst after a formal review…"*

> That isn't politeness. AMLR Article 18(3) says reporting to the FIU cannot
> be outsourced. The assistant has no filing capability at all.

Click **Refer to MLRO**. The sidebar ticks to **Decided 1 · Awaiting 7**.

### 4 · Viktor Kovalenko — the one that cannot be waved through (60s)

Back to the queue, open **Viktor Kovalenko** (`ALT-0001`).

Two rules fired: **exact match** on the sanctions list, and a **€61,000 payment
to Pars International Trading Co. in Iran** — highlighted in the payment list.

Point at the decision card: **Dismiss as false positive is locked**, with a lock
icon and the reason.

> An exact sanctions match cannot be dismissed. And the block isn't in the
> button — it's in the server.

If a judge pushes, show it:

```bash
curl -s -w '\nHTTP %{http_code}\n' -X POST http://127.0.0.1:3000/api/decide \
  -H 'content-type: application/json' \
  -d '{"alertId":"ALT-0001","decision":"close_noise"}'
```

Verified output: `{"error":"Red-flag gate: cannot close as noise"}` · `HTTP 409`.

Click **Submit SAR to FIU**. The header pill flips to **SAR submitted**.

### 5 · Activity — the trail (20s)

Open **Activity**.

> Monitoring opened it. The drafter drafted. The analyst decided and filed.
> Three different actors, each entry appended with its reason, nothing edited.

### 6 · How it works — the architecture (40s)

Open **How it works**.

> Everything inside that dashed boundary is on the bank's own hardware. Core
> banking to rules to alert. Case to vector to MongoDB `$vectorSearch` to the
> local model. Analyst decision behind a server-side gate. One MongoDB holds
> the case data, the policy vectors and the audit log.

Counts on the page are read live from the database.

### 7 · Pull the cable (20s)

Unplug the network. Reload the desk. Open a case. Click **Generate
disposition**. It still works.

> DORA Article 28(8) requires every EU financial entity to hold a plan to pull
> its ICT services out of a third-party provider and reincorporate them
> in-house. Ask a bank what that plan looks like and you'll get a slide.
> This is the artifact.

---

## If something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| Draft says "0 passages matched" | corpus embeddings ≠ index dimension | re-seed; check the single `EMBED_MODEL=bge-m3` line in `.env` |
| Draft never starts | Ollama busy or model cold | first call after boot is slow; run one warm-up generation before the demo |
| Queue shows cases already decided | left over from a rehearsal | re-seed |
| Sidebar missing | window under 1024px | widen the window |

---

## What not to say

Read the Never/Always table in [`CLAUDE.md`](./CLAUDE.md) before you go on
stage. The short version: *regulation requires an exit path, not on-prem*, and
*the agent drafts — a human decides and files*. Say "synthetic data" out loud
once; it is not written anywhere in the product.

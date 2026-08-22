# ExitPlan

Financial-crime triage that runs **entirely on the Dell GB10**. The agent drafts. A human decides and files. Unplug the network and it keeps working.

Synthetic data only. No real bank customers.

Open the demo on the box: [http://127.0.0.1:3000](http://127.0.0.1:3000)

---

## Exact pitch loop (say this)

1. **The duty.** DORA Article 28(8) says every EU bank must be able to take an ICT service *out of a third-party provider and reincorporate it in-house*. Article 30(3)(f)(ii) says the contract must allow that. This is an **exit-capability** duty, not a duty to run everything on-prem today.

2. **The slide problem.** Ask a bank running a cloud LLM what that plan looks like. You get a slide. HSBC already runs primary AML monitoring on Google Cloud. That is exactly why the exit duty exists — not because cloud is illegal.

3. **The artifact.** We did not write the slide. We built the in-house object: alert queue → deterministic screener → cited draft → human Decide / File, on this box, with **zero cloud LLM calls**.

4. **The human rule.** AMLR Article 18(3): you cannot outsource the *decision* or the *FIU filing*. Detection and analysis can be assisted. So the model **never decides and never files**.

5. **The cable.** Pull the uplink. The queue, the draft, Mongo, Nemotron still run. *That is Article 28(8), executing.*

**Never say:** “EU law requires on-prem.” **Always say:** “Regulation requires an exit path. We built it.”

---

## 5-minute demo

Do this on the GB10 browser at `http://127.0.0.1:3000`. Do not improvise.

| Min | Click | Say |
|---|---|---|
| 0:00 | **Alerts** | “This is the analyst queue. Synthetic customers. Rules opened every case — nobody uploaded a file.” |
| 0:40 | Search `Kovalev` | “Fuzzy watchlist. The **screener** fired, not the model.” |
| 1:00 | **Run Nemotron on this case** | Wait for Atlas $vectorSearch chips, then tokens. “30B on this GPU. No cloud.” |
| 2:00 | Ask box: *Can you file this?* | It should refuse. “AMLR 18(3).” |
| 2:15 | **Send to MLRO** | “I am recording a human decision. The model cannot.” |
| 2:45 | Search `Kovalenko` | “Exact watchlist. **Dismiss** is locked.” |
| 3:30 | **Submit SAR to FIU** | “SAR = Suspicious Activity Report to the financial intelligence unit. Not a document upload.” |
| 4:00 | **Activity** | “Mongo ledger. Survive a sandbox wipe.” |
| 4:30 | Kill Wi-Fi | “Still up. That’s the exit plan.” |

If a judge asks “is this medical?” — no. FieldMedic is the old tag `pre-bank-pivot`. This product is bank financial-crime triage.

If a judge asks “why not cloud?” — because the *product is the in-house reincorporation*, not because cloud AML is banned.

---

## Features

- **Deterministic screener** — watchlist exact / fuzzy, high-risk corridor, structuring. The model never chooses the hit.
- **Synthetic book** — customers, transactions, watchlist, alerts. No real institution data.
- **Cited drafts** — disposition text with clickable spans into DORA, AMLR, and internal policy.
- **Red-flag gate** — exact sanctions match cannot be closed as noise.
- **Abstention** — “insufficient evidence, escalate” is a valid draft.
- **Human Decide / File** — close as noise, escalate to MLRO, or file. Agent buttons do not exist for filing.
- **Mongo audit ledger** — who did what, why, with an input hash. Atlas Local on `:27018` (vector search over the corpus with **bge-m3**).
- **Local inference** — `nemotron-3-nano:30b` on Ollama. OpenClaw + NemoClaw + OpenShell on the box.
- **Cable-pull** — no cloud APIs in the runtime path.

---

## Run on the GB10

```bash
cd /home/dell/gyuri/gb10hack
.venv/bin/python apps/engine/scripts/seed_exitplan.py   # once
cd apps/web && npx next dev --hostname 127.0.0.1 --port 3000
```

Mongo: `mongodb://127.0.0.1:27018` (ours). Do not use `:27017`.

Canonical spec: [`PROJECT-CONTEXT.md`](./PROJECT-CONTEXT.md).

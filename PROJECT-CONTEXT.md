# ExitPlan (working name) — Project Context

> **Read this first.** Canonical context for every teammate and every AI agent on this project.
> If you pick up a task, this file tells you what we're building, why, on what, and who owns what.
> Update it when facts change; it is the single source of truth today.

## Mission

**A financial-crime triage agent that runs entirely on the box — DORA Article 28(8) executed instead
of documented.**

EU financial regulation requires every bank to hold a transition plan to pull its ICT services out of
a third-party provider and **reincorporate them in-house**. Every European bank running a cloud LLM
today has that duty. In practice that plan is a slide. We built the artifact.

The agent triages AML / sanctions / market-abuse alerts: it drafts a disposition, cites every claim to
a source span, and **never decides and never files**. It runs on a box that can be unplugged from the
network mid-demo and keep working.

## The pitch (memorize this)

> DORA Article 28(8) requires every EU financial entity to have a transition plan to remove its ICT
> services from a third-party provider and *reincorporate them in-house*. Article 30(3)(f)(ii) requires
> the contract itself to allow it.
>
> So every European bank running a cloud LLM has a regulatory duty to be able to bring it in-house. Ask
> one what that plan looks like and you'll get a slide.
>
> **We built the artifact instead of the slide.** *[demo]* — financial-crime triage that drafts, cites,
> and never decides or files, running entirely on this box. *[pull the cable]* That's the exit plan,
> executing.
>
> Not hypothetical: Finanz Informatik runs **150,000 Sparkassen users** on open-source models in its own
> data centers, 600+ days in production. Accenture puts **banking first among all sectors for sovereign
> AI, at 76%**.

**Why this framing holds:** we never claim cloud is prohibited — that claim is false and a judge can
puncture it in one question. Local is structurally the point because the product *is* the exit capability.

### Never say / always say

| ❌ Never | ✅ Instead |
|---|---|
| "EU regulation requires on-prem" | "Regulation requires an exit path. We built it." |
| "Banks can't use cloud" | "HSBC runs primary AML monitoring on Google Cloud. That's exactly why the exit duty exists." |
| "LORA" (in a regulatory sentence) | **DORA**. LoRA is a fine-tuning technique. |
| "It diagnoses / decides / files" | "It drafts. A human decides and files." |

## Regulatory facts (verified — this is our moat, don't get these wrong)

**The hook — DORA (Reg (EU) 2022/2554):**
- **Art 28(8):** *"...transition plans enabling them to remove the contracted ICT services and the
  relevant data from the ICT third-party service provider and to securely and integrally transfer them to
  alternative providers **or reincorporate them in-house**."*
- **Art 30(3)(f)(ii):** exit strategies must allow *"...migrate to another ICT third-party service
  provider or **change to in-house solutions**."*
- This is an **exit-capability duty, not a duty to run in-house.** Preserve that distinction.

**The architecture constraint — AMLR (Reg (EU) 2024/1624) Art 18(3):** decisions cannot be outsourced —
approval of detection criteria, customer risk-profile decisions, and *"the reporting to FIU of suspicious
activities pursuant to Article 69."* Note the verbs: it's the **approval** of detection criteria, not the
running of detection; the **reporting**, not the analysis. Detection, monitoring, triage and analysis are
all outsourceable. → **The agent drafts. A human decides and files.**

**We are NOT high-risk under the EU AI Act.** Annex III 5(b) covers creditworthiness *"with the exception
of AI systems used for the purpose of detecting financial fraud."* Financial crime is carved out. **Stay
off creditworthiness and credit scoring entirely.**

**What we do NOT claim** (all tested and killed — 0 of 25 pro-local claims survived adversarial review):
no EU instrument mandates on-premises processing; Italy repealed the only real cloud prohibition on
17 Jan 2025; HSBC runs primary AML transaction monitoring on Google Cloud at ~1bn transactions/month;
AMLR Art 18(2) + Recital 47 close the anti-tipping-off argument completely.

⚠️ **EUR-Lex blocked automated access during research — quotes are mirror-sourced. Verify Art 28(8) and
Art 30(3)(f)(ii) in a browser before they go on a slide.**

## Event constraints (non-negotiable)

- Runs 100% locally on the GB10 — **zero cloud/LLM API calls in the runtime path**.
- Stack: **OpenClaw + NVIDIA NemoClaw + OpenShell** (≥2 of 3 required; we use all 3).
- **MongoDB** required (side challenge) — also our vector store (`mongo:8`).
- Business/corporate workflow framing: financial-crime compliance operations for EU banks.
- **Timeline today: submissions close 18:00 · slides 19:30 · top-8 pitches 20:00.**
  Internal target: end-to-end core loop demoable by **14:00**, polish after, demo recording ~17:00.
- **Synthetic data only.** No real institution's data, ever. Say so on stage.

## The box (verified facts, not assumptions)

| Fact | Value |
|---|---|
| Host / IP | `promaxgb10-851d` / `10.0.0.166` |
| GPU | NVIDIA GB10, driver 580.159.03, 128GB unified memory |
| Disk | 3.4TB free NVMe |
| Models (Ollama, already pulled) | `nemotron-3-nano:30b` (orchestrator brain) · `medgemma1.5:4b` (unused now) |
| Ollama API | `http://localhost:11434` — OpenAI-compatible |
| Docker images present | `mongo:8`, NemoClaw sandbox images (`ghcr.io/nvidia/nemoclaw/sandbox-base`, `nemoclaw-sandbox:blueprint-pinned`), `ubuntu:24.04`, `coturn` |
| On USB SSD (exFAT "Backup") | Qwen3.8-27B NVFP4 + DSpark draft, Qwen3.8-27B GGUF Q6_K, **Mistral Small 4 119B NVFP4**, **bge-m3 embeddings**, llama.cpp arm64 binaries |

**`bge-m3` is now load-bearing** — it's our embedding model for Mongo vector search over the regulatory
corpus. Copy it to NVMe early.

### Working on the box

- SSH via the shared control socket: `ssh -S /tmp/dell.sock dell@10.0.0.166 '<command>'`
  (a human holds the master connection open; plain ssh will hang on password).
- **Shared `dell` account across all team laptops — work ONLY inside your own directory**
  (`~/snehit/`, `~/zhang/`, …). Never edit shared/system files without coordinating.
- `sudo`: write a script, a human runs it in the master window.
- Long jobs: `nohup ... &` with a log file, or tmux.

## Architecture

```
Compliance analyst UI (laptop → box on LAN)
   └── OpenClaw orchestrator (nemotron-3-nano:30b via Ollama)
        │     [NemoClaw: audit logging · OpenShell: sandboxed execution]
        ├── 1. DETERMINISTIC SCREENER — rules/fuzzy-match over synthetic transactions
        │        → candidate alerts + the reason each fired. The LLM NEVER picks the hit.
        ├── 2. Evidence retrieval — customer file + internal policy + regulatory corpus
        │        (Mongo vector search, bge-m3 embeddings)
        ├── 3. DRAFTING agent — disposition narrative, every claim cited to a source span
        │        → constrained generation: cannot emit anything outside the corpus
        ├── 4. Red-flag gate — hard-coded rules no model output can override; abstention
        │        ("insufficient evidence — escalate") is a first-class answer
        └── 5. Audit ledger — every decision + rationale + input hash → MongoDB (append-only)

        HUMAN decides and files. The agent never does. (AMLR Art 18(3))
```

**Four-layer safety stack** (same shape as before, retargeted): retrieval-grounded (regulation + policy
with citations) → rule-gated (deterministic screener owns the candidate set; the model cannot invent an
alert) → abstention-capable → audit-logged.

## Ownership & task board

| # | Block | Owner | Status |
|---|---|---|---|
| 0 | Stack setup: OpenClaw + NemoClaw + OpenShell wiring | Zhang('s team) | in progress |
| 1 | Synthetic data gen (customers, transactions, watchlist, alerts) | TBD | not started |
| 2 | Deterministic screener (rules → candidate alerts + reasons) | TBD | not started |
| 3 | Regulatory corpus ingest + Mongo vector search (bge-m3) | TBD | not started |
| 4 | Drafting agent + span citations + constrained generation | TBD | not started |
| 5 | Analyst UI (alert queue → draft disposition → human decides) | TBD | not started |
| 6 | Audit ledger (Mongo append-only, via NemoClaw) | TBD | not started |
| 7 | Demo script + deck + DORA Art 28(8) slide | all, by 17:00 | not started |

**Cut order if behind:** UI polish first, then the regulatory corpus (hardcode 3-4 citations), then vector
search (keyword fallback). **Never cut:** the deterministic screener, span citations, the human-decides
step, or the cable pull. Those four *are* the pitch.

## MongoDB collections

`customers` (synthetic KYC profiles) · `transactions` (synthetic ledger) · `alerts` (screener output +
which rule fired) · `corpus` (regulation + internal policy chunks) · `embeddings` (vector index, bge-m3) ·
`dispositions` (agent drafts + cited spans + human decision) · `audit_log` (append-only: agent, action,
input hash, output, rationale, ts)

## Demo arc (5 min, target)

1. Alert queue — 200 synthetic alerts, 99% of them noise. *"This is a real analyst's Monday."*
2. Open one. The **deterministic screener** shows why it fired — name + jurisdiction fuzzy match.
3. Agent drafts the disposition: pulls the customer file, prior alerts, the policy paragraph, and the
   regulation — **every sentence citing its source span, clickable.**
4. A red-flag case: hard rule fires, the model's draft is overridden. *"The model never overrules the rules."*
5. The analyst clicks **Decide** and **File**. *"The agent drafted. A human decided. That's Article 18(3),
   and it's not optional."*
6. **Kill the uplink on stage** → everything keeps working. *"That's Article 28(8). The exit plan, running."*

## Prior work

The FieldMedic medical-agent build (spec, GB10 runbook, MedGemma X-ray service on :8801, demo shotlist)
is preserved at tag **`pre-bank-pivot`** (`481506e`). Restore with:

```bash
git checkout pre-bank-pivot -- xray-block/ docs/ PROJECT-CONTEXT.md
```

---

*Business and regulatory analysis, not legal advice. Synthetic data only.*

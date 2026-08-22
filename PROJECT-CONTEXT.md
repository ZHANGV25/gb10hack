# FieldMedic (working name) — Project Context

> **Read this first.** Canonical context for every teammate and every AI agent on this project.
> If you pick up a task, this file tells you what we're building, why, on what, and who owns what.
> Update it when facts change; it is the single source of truth today.

## Mission

An **offline medical agent for health camps in war-torn and disconnected regions** (refugee camps,
IDP camps, field hospitals, austere/low-resource settings). A nurse, community health worker, or
doctor at the camp uses it to: intake patients, digitize paper records, read X-rays, and get
guideline-grounded care suggestions — **with zero internet, running entirely on a Dell Pro Max GB10**
sitting in the camp.

**Why not Starlink/cloud (the pitch counter):** satellite links degrade in rain/adverse weather,
draw power, cost money per site, and can be shut down by governments or jammed in conflict zones.
Care cannot depend on a link. The box IS the infrastructure.

**Safety posture (memorize for the pitch):** this is **clinical decision SUPPORT, not diagnosis**.
Four-layer justification stack: retrieval-grounded (WHO/MSF guidelines with citations) →
rule-gated (hard-coded red-flag rules no model output can override; dosages come from lookup
tables, never the model) → abstention-capable ("I don't know — escalate" is a first-class answer) →
audit-logged (every answer + why, in MongoDB via NemoClaw audit).

## Event constraints (non-negotiable)

- Runs 100% locally on the GB10 — **zero cloud/LLM API calls in the runtime path**.
- Stack: **OpenClaw + NVIDIA NemoClaw + OpenShell** (≥2 of 3 required; we use all 3).
- **MongoDB** required (side challenge) — also our vector store (vector search on `mongo:8`).
- Business/corporate workflow framing: healthcare operations for NGOs / humanitarian orgs.
- **Timeline today: submissions close 18:00 · slides 19:30 · top-8 pitches 20:00.**
  Internal target: end-to-end core loop demoable by **14:00**, polish after, demo recording ~17:00.

## The box (verified facts, not assumptions)

| Fact | Value |
|---|---|
| Host / IP | `promaxgb10-851d` / `10.0.0.166` |
| GPU | NVIDIA GB10, driver 580.159.03, 128GB unified memory |
| Disk | 3.4TB free NVMe |
| Models (Ollama, already pulled) | `medgemma1.5:4b` (multimodal, X-rays) · `nemotron-3-nano:30b` (orchestrator brain) |
| Ollama API | `http://localhost:11434` — OpenAI-compatible, vision via base64 images |
| Docker images present | `mongo:8`, NemoClaw sandbox images (`ghcr.io/nvidia/nemoclaw/sandbox-base`, `nemoclaw-sandbox:blueprint-pinned`), `ubuntu:24.04`, `coturn` |
| Extra models on USB SSD (exFAT "Backup", plug into box + copy to NVMe if needed) | Qwen3.8-27B NVFP4 + DSpark draft, Qwen3.8-27B GGUF Q6_K + vision mmproj, Mistral Small 4 119B NVFP4, bge-m3 embeddings, llama.cpp arm64 binaries + source |

### Working on the box

- SSH via the shared control socket: `ssh -S /tmp/dell.sock dell@10.0.0.166 '<command>'`
  (a human holds the master connection open; plain ssh will hang on password).
- **Shared `dell` account across all team laptops — work ONLY inside your own directory**
  (`~/snehit/`, `~/zhang/`, …). Never edit shared/system files without coordinating.
- `sudo`: write a script, a human runs it in the master window.
- Long jobs: `nohup ... &` with a log file, or tmux.

## Architecture

```
Nurse/Doctor UI (camp tablet/laptop → box on LAN)
   └── OpenClaw orchestrator (nemotron-3-nano:30b via Ollama)
        │     [NemoClaw: audit logging · OpenShell: sandboxed execution]
        ├── 1. Intake/Ingestion agent — scan/photo of paper records → extract (medgemma vision)
        │        → structured patient record → MongoDB + vector embeddings
        ├── 2. Retrieval agent — patient history + WHO/MSF guideline RAG (Mongo vector search)
        ├── 3. X-RAY BLOCK — image + clinical question → MedGemma → structured findings
        │        → deterministic red-flag gate → escalation banner or plan suggestion
        ├── 4. Longitudinal patient memory — per-patient visit history ("their own doctor"),
        │        every consult appends; next visit starts from full context
        └── 5. Audit ledger — every agent decision + rationale → MongoDB (append-only)
```

## Ownership & task board

| # | Block | Owner | Status |
|---|---|---|---|
| 0 | Stack setup: OpenClaw + NemoClaw + OpenShell wiring | Zhang('s team) | in progress |
| 1 | Ingestion agent (doc scan → Mongo + vectors) | TBD | not started |
| 2 | Retrieval / RAG (Mongo vector search) | TBD | not started |
| 3 | X-ray block (MedGemma service + red-flag rules) | Snehit + Claude | ✅ DONE — live on box :8801 (`~/snehit/xray-block/`), 2.9s warm latency, contract verified |
| 4 | Patient longitudinal memory | TBD | not started |
| 5 | Nurse UI (intake + consult screens) | TBD | not started |
| 6 | Demo script + pitch deck + why-not-Starlink slide | all, by 17:00 | not started |

## Integration contract — X-ray block (so the orchestrator can integrate blind)

HTTP service on the box, port **8801**:

```
POST /xray
{ "image_b64": "<jpeg/png base64>",
  "question": "clinical question, e.g. 'assess for pneumothorax'",
  "patient_context": "optional: age, sex, symptoms, relevant history" }

→ 200
{ "findings": "structured radiological findings text",
  "impression": "short clinical impression",
  "red_flags": ["list of triggered HARD-CODED rules, [] if none"],
  "escalate": true|false,          // true = show ESCALATE banner, overrides everything
  "confidence": "low|medium|high",
  "disclaimer": "decision-support string for the UI",
  "model": "medgemma1.5:4b", "latency_ms": 1234 }
```

Rules: `escalate=true` whenever red_flags is non-empty OR the model abstains. The UI must render
red_flags and the disclaimer verbatim. The orchestrator logs the full request/response to the
audit collection.

## MongoDB collections (proposed — ingestion/retrieval owners refine)

`patients` (demographics, camp ID) · `visits` (per-consult notes, structured findings) ·
`documents` (scanned originals + extracted text) · `embeddings` (vector index) ·
`audit_log` (append-only: agent, action, input hash, output, rationale, ts)

## Demo arc (5 min, target)

1. Paper record + patient walks in → photo → record appears in Mongo (ingestion).
2. Nurse asks in plain language; agent answers grounded in THIS patient's history + guidelines.
3. X-ray uploaded → findings + plan… then a **red-flag case** → hard rule fires → ESCALATE banner
   ("the model never gets to overrule the rules").
4. Return visit: the agent remembers everything — the patient's own doctor, living in the camp.
5. Kill the uplink on stage → everything keeps working. "Starlink fails in rain. This doesn't."
```

# 💡 Idea Board — Dell x NVIDIA GB10 (Aug 22, 2026)

Sources: web sweep (15 seeds, raw in `.firecrawl/idea-sweep/`), own Devpost winners DB (TrustNode / ComplianceGuard / GradientGuard precedents), global inspiration library (MedStick, Supermemory apartment winner), Bellhop/ConciergeOS audit-ledger pattern.

**Event constraints:** business/corporate workflow only (operations, sales, support, knowledge, devops, research); no personal-assistant clones; ≥2 of OpenClaw/NemoClaw/OpenShell; ZERO remote LLM calls; MongoDB side challenge (use it as the audit store). Rubric: technical execution · usefulness · local-first design · pitch quality.

## Scored shortlist (playbook rubric, 5 = best)

| # | Idea | CORE LOOP | NATIVE | PROOF | WOW | WEDGE | Σ |
|---|---|---|---|---|---|---|---|
| 1 | **AP Invoice Sentinel** — watches AP inbox, vision-reads invoices, 3-way-match vs PO/ERP (MongoDB), catches dupes + bank-detail fraud, hard-coded payment guards, hash-chained audit ledger | 5 | 5 | 5 | 4 | 5 | **24** |
| 2 | **Air-Gapped SOC Analyst** — tails logs 24/7, correlates, quarantines via OpenShell sandbox w/ approval gates, writes incident timelines | 4 | 5 | 5 | 5 | 5 | **23** (setup risk) |
| 3 | **Outbound DLP Redactor** — gateway agent reads all outbound drafts/uploads, redacts PII/secrets, logs decisions ("the guard that reads everything must itself be local") | 4 | 5 | 5 | 4 | 4 | **22** |
| 4 | **Deal-Room Diligence Sentinel** — docs land in data room → red-flag extraction → living diligence memo w/ citations (VC judges viscerally know this pain) | 5 | 4 | 4 | 4 | 4 | **21** |
| 5 | **Tax/Transaction Classifier Loop** — drop-folder of bank CSVs/receipts → confidence-routed classification + override learning (real firm: 6.5 hrs/client saved, 93% auto) | 5 | 4 | 5 | 3 | 4 | **21** |
| 6 | **Privileged-Docs Paralegal** — law-firm matter sentinel; privilege makes cloud DISQUALIFYING | 5 | 4 | 4 | 3 | 4 | **20** |
| 7 | **Contract Renewal & Obligation Tracker** — ingest once, watch forever; auto-renewal alerts, SLA breach tracking | 5 | 4 | 4 | 3 | 4 | **20** |
| 8 | **OT/Shop-Floor Whisperer** — the MedStick translation: PLC alarms + manual RAG on an air-gapped OT network | 3 | 4 | 4 | 4 | 4 | **19** (sim-data heavy) |

Also considered (lower fit): clinic back-office (HIPAA, needs synthetic PHI), warehouse vision monitor (webcam wow but model-perf risk), compliance evidence robot (multi-system mocks), overnight DevOps custodian (too generic), 24/7 support agent (borders banned personal-assistant zone), "departments in a box" multi-model flex (pattern, not product — fold into winner).

## 🏆 Recommendation: AP Invoice Sentinel (working names: LedgerGuard / InvoiceWarden)

Why this one over the field:
- **Your exact muscle memory**: OpenClaw email automation is your daily driver (job bot); Supermemory apartment winner proved email-as-interface + classify→route→act + dual dashboard wins.
- **Fraud = money story** for VC judges; Microsoft ships a Payables Agent — market validation on a slide.
- **Local-only is genuine**: vendor bank details + payment fraud surface; SMBs won't pipe banking data to cloud APIs.
- **Every stack box ticked natively**: OpenClaw (inbox agent) + OpenShell (sandboxed actions) + NemoClaw (audit logging) + MongoDB (hash-chained ledger → side challenge) + Qwen3.8 native VISION reads scanned invoices with no OCR pipeline (hardware/technical-execution flex).
- **MedStick homage embedded**: deterministic payment guards wrap the LLM — "the model never gets to approve a bank-detail change; a hard-coded rule does" — judges love a team that doesn't trust its own model.

### 5-minute pitch arc
1. 0:00 — "Vendor-email fraud + manual 3-way matching: the most manual process in finance."
2. Live: agent has been running all day → new invoice email arrives → vision-extract → match vs PO in MongoDB → approved + ledger entry appears.
3. Live twist: send a duplicate invoice AND a bank-detail-change email → hard guard blocks, flags, drafts vendor verification. (Stretch: voice call to verify — Bellhop pattern.)
4. Audit screen: every decision hash-chained, exportable auditor packet.
5. Close: "Zero tokens billed, zero data egress, vendor-neutral open models — runs on any box you own."

### Fallback pivot
If invoice parsing fights us by 13:00 → collapse to Deal-Room Sentinel (same architecture, folder-drop instead of inbox, memo instead of match).

## Winning patterns (from judges of this exact event series)
- Whole-system thinking beats model tricks: know what to automate vs. retrieve vs. escalate to humans; explain architecture AND limitations.
- Agents that visibly ACT (multi-step, tools) during the pitch — not chat.
- Use the hardware visibly (resident second model, full-corpus ops).
- Operations/product framing wins with VC judges; AI-as-novelty is dead.
- The audit trail is the moat story for local — make it a first-class demo artifact.

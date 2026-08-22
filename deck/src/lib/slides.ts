/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V6 "DORA agent": rewritten to the pivoted demo at
 *  68723ce (always-on Article 30 contract agent), matched beat-for-beat to
 *  DEMO.md, and pressure-tested twice (3× Sonnet panel + codex gpt-5.6-sol
 *  xhigh) before a scene was built. Staging rationale: docs/DECK-ARC-DRAFT.md.
 *  Lines wrapped in (parens) are stage directions, not spoken. */

export type Slide = {
  n: number;
  act: string;
  label: string;
  onscreen: string;
  build?: boolean;
  loadBearing?: string;
  narration: string[];
};

export const REVISION = 'V6 · DORA agent — confinement held to the artifact, twice pressure-tested';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — The job',
    label: 'THE READING PROBLEM',
    onscreen:
      'DORA Art. 28(8) — exit strategies for ICT behind critical functions, incl. reincorporation in-house — over the Art. 30 spec: 9 elements for every arrangement, +6 critical (audit, exit assistance). A shelf of contract spines, one reader.',
    narration: [
      'DORA Article 28(8): for the services a bank’s critical functions run on, it must hold an exit strategy — including the option to bring the service back in-house. Article 30 says the contracts themselves have to make that possible: nine required elements in every ICT contract, six more — audit rights, exit assistance — where the function is critical.',
      'So whether the bank can actually leave is written down, across every ICT contract it has. Someone has to read them all against that list. In a real estate that’s hundreds. Nobody reads them.',
      'The exit plan stays a slide. ExitPlan is the agent that reads the contracts — continuously.',
    ],
    loadBearing:
      'The exit plan stays a slide. ExitPlan is the agent that reads the contracts — continuously.',
  },
  {
    n: 2,
    act: 'II — The cage',
    label: 'THE AUTHORITY SPLIT',
    onscreen:
      'Three lanes: MODEL EXTRACTS (present / inadequate / absent + the clause it relied on · chip: NO QUOTE, NO CLAIM) → POLICY DISPOSES (deterministic Python · chip: EXIT · AUDIT · DATA RETURN = BLOCKING) → REVIEWERS TEACH (tan · chip: RULES ONLY ACT ON AN EXISTING GAP). No database named here.',
    narration: [
      'The model’s authority stops at extraction. It reads a contract and labels every required provision — present, inadequate, absent — and it has to produce the clause it relied on. A claim with no quote behind it is recorded as absent.',
      'What those labels mean is a fixed policy in Python, not the model. Our policy marks a missing exit clause, audit right or data return as blocking — without those, Article 28(8) can’t be evidenced at all.',
      'And it learns from people, not retraining. A reviewer who disagrees writes the correction down; it becomes a readable rule with an author and a scope. And a rule can only act on a gap the checklist already found.',
    ],
  },
  {
    n: 3,
    act: 'III — Live on the desk',
    label: 'THE REGISTER — demo §1',
    onscreen:
      '(switch to the browser — deck parks here; frames 3–6 are the fallback) · Tiles: 7 with gaps · CANNOT BE CLEANLY EXITED €7,030,000 · 10 Art. 30 gaps · €16,375,000 total. Twelve real rows, Helvetia €4.18M → Pinnacle €88k. Weakest-estate panel: 2× no pen-testing clause, 2× data location undisclosed.',
    narration: [
      '(switch display to the browser — 1440×1250, seeded, desk at 127.0.0.1:3000)',
      'Nordhafen Bank — fictional, a synthetic register: twelve ICT arrangements, sixteen point four million euros a year, eight supporting critical functions. The agent has read every one.',
      'Seven million euros a year runs through contracts this bank cannot cleanly exit or inspect — the number a supervisor asks for and nobody can produce.',
      'And the estate view: the same clause missing across suppliers — two with no penetration-testing clause, two that won’t say where the data sits — is a contracting problem, not a supplier problem.',
    ],
    loadBearing:
      'Seven million euros a year runs through contracts this bank cannot cleanly exit or inspect — the number a supervisor asks for and nobody can produce.',
  },
  {
    n: 4,
    act: 'III — Live on the desk',
    label: 'HELVETIA — the missing exit — demo §2',
    onscreen:
      'HELVETIA CLOUD SERVICES AG · core banking platform · €4,180,000/yr · CRITICAL. Checklist 14/15; absent row EXIT STRATEGY AND TRANSITION PERIOD marked blocking. One passed row expanded to its verbatim clause (14. Access, Inspection and Audit).',
    narration: [
      'Helvetia Cloud — the core banking platform, four point one eight million a year. Fourteen of fifteen required provisions are present. This is a good contract.',
      'The one it’s missing is the exit strategy: no transition period, no obligation to help the bank move. The bank’s Article 28(8) exit plan for core banking is a document that cannot be executed.',
      'Open any tick and you get the sentence the model relied on, quoted. If it claims a clause and can’t produce the text, the system records the provision as absent.',
    ],
  },
  {
    n: 5,
    act: 'III — Live on the desk',
    label: 'TEACH IT — the correction — demo §3',
    onscreen:
      'Castellan Core Systems: the TLPT finding — supplier self-tests annually, customer-initiated testing refused; checklist: material, gaps to close. Review panel: Disagree — correct it · provision SET DELIBERATELY to “Participation in threat-led penetration testing” · scope CRITICAL FUNCTIONS ONLY · the written correction · tan STORE RULE AND RE-CHECK THE REGISTER. Right column: AGENT ACTIVITY, idle.',
    narration: [
      'Castellan Core — core banking software. Look at its penetration-testing finding: the supplier tests itself, once a year, and refuses customer-initiated testing. The checklist calls that a material gap — something to schedule. A third-party risk officer would say: for core banking, that is not a gap to schedule. That’s a stop.',
      '(select the provision by hand — threat-led penetration testing — the pre-fill is wrong on this contract)',
      'So they disagree, in writing. The correction names the provision, is scoped to critical functions only, and says why, in plain language.',
      '(the store click takes ~3s — the local embedding model turning the sentence into a vector; keep talking)',
      'Store the rule. No retraining happened. A sentence a human wrote just became policy — and the agent notices on its own.',
    ],
    loadBearing:
      'Store the rule. No retraining happened. A sentence a human wrote just became policy — and the agent notices on its own.',
  },
  {
    n: 6,
    act: 'III — Live on the desk',
    label: 'THE HALF-SECOND — demo §4',
    onscreen:
      'Build: the right column fills. Timeline: RULE STORED → INDEX SEARCHABLE → 12 RE-CHECKED · 0 RE-READ · ~0.5s. Three evidence cards: CASTELLAN — verdict changed (origin) · AURORA KYC — rule retrieved & applied, contract never opened · NORDLYS — considered, withheld (no gap to attach to). Memory chip, verbatim UI: “changing 2 verdicts now”.',
    build: true,
    narration: [
      'Reading all twelve contracts took the local model twelve minutes. Re-checking all twelve after that correction took half a second — it re-read nothing, because which clauses a contract contains hasn’t changed. Only what the bank makes of them has.',
      'Castellan’s verdict flips — the rule doing its job at home. The interesting one is Aurora KYC: nobody opened that contract, and the correction was retrieved there by meaning and applied to the same gap the checklist had already found.',
      'And Nordlys — considered, withheld. It has a testing clause; there is no gap for the rule to attach to. A rule can make an existing finding stricter. It cannot invent one.',
    ],
    loadBearing:
      'Reading all twelve contracts took the local model twelve minutes. Re-checking all twelve after that correction took half a second — it re-read nothing, because which clauses a contract contains hasn’t changed. Only what the bank makes of them has.',
  },
  {
    n: 7,
    act: 'III — Live on the desk',
    label: 'ONE DATABASE, THREE JOBS — demo §5',
    onscreen:
      'First naming of the store. OPERATIONAL REGISTER (contracts · verdicts · corrections) · VECTOR MEMORY (rules + $vectorSearch · bge-m3 1024-d) · EVENT BUS (change streams → the always-on agent). Live counts row. Dashed on-prem boundary.',
    narration: [
      'Everything you just watched moved through one MongoDB doing three jobs. The operational register. The vector memory the correction was retrieved from. And — through change streams — the event bus: a new contract makes the agent read; a new rule makes it re-check the register. A service that never polls.',
      'The counts on screen are aggregated in the database, live, with an append-only run log of every read and every sweep.',
      'MongoDB isn’t a sidecar here — it’s the register, the memory and the nervous system, in one deployment.',
    ],
    loadBearing:
      'MongoDB isn’t a sidecar here — it’s the register, the memory and the nervous system, in one deployment.',
  },
  {
    n: 8,
    act: 'IV — The artifact',
    label: 'UNPLUGGED — demo §6',
    onscreen:
      'Unit spec: nemotron-3-nano · 30B (Ollama) / bge-m3 · 1024-d / MongoDB Atlas Local — change streams + vector index / Next.js register / Dell Pro Max GB10 / uplink: NOT REQUIRED. Measured line: CLAUSE AGREEMENT 138/141 · 98%.',
    narration: [
      '(live first: pull the cable, reload, teach another rule — then back to the deck)',
      'We just pulled the network. Reading, embedding, retrieval, storage — everything you watched runs on this one machine: a thirty-billion-parameter open model carried by the harness — quote-or-absent, fixed policy, human rules. Measured on the box: ninety-eight percent clause agreement, one hundred thirty-eight of one hundred forty-one calls.',
      'DORA does not require on-prem — and we don’t claim it does. We built the runtime self-contained because of what this tool is: host your exit auditor in the cloud and it becomes row thirteen in its own register, with an exit clause of its own to negotiate.',
      'Ask a bank for its DORA exit plan and you’ll get a slide. This is the artifact — and there is no third party to lose.',
    ],
    loadBearing:
      'Ask a bank for its DORA exit plan and you’ll get a slide. This is the artifact — and there is no third party to lose.',
  },
  {
    n: 9,
    act: 'V — Close',
    label: 'CLOSE',
    onscreen:
      'EXITPLAN · tan rule · The model extracts. Policy decides. Reviewers teach. · footer: synthetic register · business analysis, not legal advice.',
    narration: ['ExitPlan. The model extracts. Policy decides. Reviewers teach it.', '(stop talking)'],
  },
];

/** Operator prep — read before going on, never spoken. Mirrors DEMO.md. */
export const PRESHOW: string[] = [
  'systemctl --user status dora-watch → active (running) — without it the teach beat dies.',
  'Reset between runs is instant: reset_demo.py retires what you taught and the agent reverts the verdicts itself. Full seed_dora.py + review_all.py (~12 min) only if the contracts changed. Confirm the register tiles (7 with gaps · 10 gaps · €7,030,000 · €16,375,000), Castellan shows “Gaps to close”, and the agreement line (script says 138/141 · 98%); update these strings if the run differs.',
  'Browser ≥1440×1250, desk at 127.0.0.1:3000. Deck parked on slide 2 during the demo.',
  'Drill the dropdown: on Castellan the provision pre-fill is WRONG (termination rights). Select “Participation in threat-led penetration testing”, scope “critical functions only”, or Aurora never fires.',
  'Live route: Register → Helvetia → Castellan → store rule → Agent activity → What it has learned → Aurora KYC → Nordlys → How it works → pull cable, reload, teach again → back to deck (slide 8).',
  'Say “synthetic” out loud once (slide 3). It appears nowhere in the product.',
  '91f4f3c added four real SEC-filed contracts (value €0, non-critical) beside the curated book. If they are ingested tonight the register shows 16 rows and extra gaps while the script says twelve — either reconcile the spoken numbers with the live tiles, or skip ingest_real for the demo seed. The € figures are unaffected.',
];

/** Rehearsed Q&A — the three questions this arc invites, plus one reserve. */
export const QA: { q: string; a: string }[] = [
  {
    q: 'Why not run this in your Azure tenant?',
    a: 'You could — DORA doesn’t forbid it, and we don’t claim it does. But then the tool that audits your ICT third parties is itself an ICT third party — row thirteen in its own register, with its own exit clause to negotiate. We’re proving existence, not necessity: the complete agent — model, memory, event bus, evidence — fits on one machine you own.',
  },
  {
    q: 'You wrote the contracts and the ground truth. What does 98% mean?',
    a: 'That the model finds what we know is there and doesn’t invent what isn’t — a validity check on the harness, not a benchmark claim about real contracts. On a real estate you’d re-measure. What carries over is the constraint: no quote, no claim.',
  },
  {
    q: 'Everyone here pulled a cable. What’s actually hard?',
    a: 'Separating extraction from judgment. Reading the register costs the model twelve minutes; re-judging it costs half a second, because extractions are stored and only policy changed. Plus an always-on agent on change streams — no cron, no polling — that waits for the vector index to be consistent before re-evaluating, so a taught rule can never silently produce stale verdicts.',
  },
  {
    q: 'Is this all you built? (only if asked about reuse)',
    a: 'The same box also runs our earlier AML disposition desk at /aml — a different governed workflow on the same stack. Tonight is the DORA agent.',
  },
];

/** Spoken words only — stage directions in (parens) excluded. */
export function spokenWordCount(): number {
  return SLIDES.flatMap((s) => s.narration)
    .filter((l) => !l.startsWith('('))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

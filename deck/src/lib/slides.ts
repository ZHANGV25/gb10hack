/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V9 "the escape framing": the sell is that ExitPlan
 *  makes leaving a vendor possible and provable — trapped money found, the
 *  blocking clause named, exit-readiness live instead of a yearly audit. The
 *  anti-hallucination machinery is one clause in the back (slide 4). Voice
 *  stays V8's keynote register. ~395 words ≈ 2:28 at stage pace; bookends
 *  alone ≈ 45s, the rest is spoken over the demo. Every number still
 *  traces to DEMO.md or the code; OpenClaw is claimed as builder/driver of
 *  the box, never as the runtime (graveyard #4).
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

export const REVISION = 'V9 · the escape framing — the sell is leaving, trust is one clause in the back';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — The job',
    label: 'THE READING PROBLEM',
    onscreen:
      'DORA Art. 28(8) — exit strategies for ICT behind critical functions, incl. reincorporation in-house — over the Art. 30 spec: 9 elements for every arrangement, +6 critical (audit, exit assistance). A shelf of contract spines, one reader.',
    narration: [
      'Every bank in Europe is locked into its tech vendors, and the law says they must be able to leave — take any critical service back in-house. Whether they actually could is buried in hundreds of contracts nobody has read.',
      'So the plan is just paper, and it works right up until the day you need it.',
    ],
    loadBearing:
      'So the plan is just paper, and it works right up until the day you need it.',
  },
  {
    n: 2,
    act: 'II — The cage',
    label: 'THE AUTHORITY SPLIT',
    onscreen:
      'Three lanes: MODEL EXTRACTS (present / inadequate / absent + the clause it relied on · chip: NO QUOTE, NO CLAIM) → POLICY DISPOSES (deterministic Python · chip: EXIT · AUDIT · DATA RETURN = BLOCKING) → REVIEWERS TEACH (tan · chip: RULES ONLY ACT ON AN EXISTING GAP). No database named here.',
    narration: [
      'ExitPlan makes leaving possible. It reads every vendor contract and tells you whether you could walk away today — and if you can’t, exactly which clause is trapping you.',
      'Let me just show you.',
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
      'Meet Nordhafen Bank. It’s fictional, and the data is synthetic. Twelve vendors, sixteen million euros a year. The agent read every contract and found the trapped money:',
      'Seven million a year flows through contracts this bank could never walk out of. Regulators ask for that number, and no bank can produce it. This one just did.',
    ],
    loadBearing:
      'Seven million a year flows through contracts this bank could never walk out of. Regulators ask for that number, and no bank can produce it. This one just did.',
  },
  {
    n: 4,
    act: 'III — Live on the desk',
    label: 'HELVETIA — the missing exit — demo §2',
    onscreen:
      'HELVETIA CLOUD SERVICES AG · core banking platform · €4,180,000/yr · CRITICAL. Checklist 14/15; absent row EXIT STRATEGY AND TRANSITION PERIOD marked blocking. One passed row expanded to its verbatim clause (14. Access, Inspection and Audit).',
    narration: [
      'And it doesn’t just find the trap — it shows the way out. Core banking, four million a year: fourteen of fifteen boxes ticked, every tick backed by a quote from the contract. The missing one is the exit clause. Fix that one clause, and four million a year stops being hostage.',
    ],
  },
  {
    n: 5,
    act: 'III — Live on the desk',
    label: 'TEACH IT — the correction — demo §3',
    onscreen:
      'Castellan Core Systems: the TLPT finding — supplier self-tests annually, customer-initiated testing refused; checklist: material, gaps to close. Review panel: Disagree — correct it · provision SET DELIBERATELY to “Participation in threat-led penetration testing” · scope CRITICAL FUNCTIONS ONLY · the written correction · tan STORE RULE AND RE-CHECK THE REGISTER. Right column: AGENT ACTIVITY, idle.',
    narration: [
      'Now, a bank’s standards change all the time. Here the machine called a serious weakness routine, and a risk officer disagrees.',
      '(select the provision by hand — threat-led penetration testing — the pre-fill is wrong on this contract)',
      'They write two sentences of plain English and click store. Now watch what happens.',
    ],
    loadBearing: 'They write two sentences of plain English and click store. Now watch what happens.',
  },
  {
    n: 6,
    act: 'III — Live on the desk',
    label: 'THE HALF-SECOND — demo §4',
    onscreen:
      'Build: the right column fills. Timeline: RULE STORED → INDEX SEARCHABLE → 12 RE-CHECKED · 0 RE-READ · ~0.5s. Three evidence cards: CASTELLAN — verdict changed (origin) · AURORA KYC — rule retrieved & applied, contract never opened · NORDLYS — considered, withheld (no gap to attach to). Memory chip, verbatim UI: “changing 2 verdicts now”.',
    build: true,
    narration: [
      'In half a second, the whole register re-checked itself against the new standard. The correction caught the same flaw in a contract nobody opened, and skipped one that was clean.',
      'So exit-readiness stops being a yearly audit. It’s live.',
    ],
    loadBearing: 'So exit-readiness stops being a yearly audit. It’s live.',
  },
  {
    n: 7,
    act: 'III — Live on the desk',
    label: 'ONE DATABASE, THREE JOBS — demo §5',
    onscreen:
      'First naming of the store. OPERATIONAL REGISTER (contracts · verdicts · corrections) · VECTOR MEMORY (rules + $vectorSearch · bge-m3 1024-d) · EVENT BUS (change streams → the always-on agent). Live counts row. Dashed on-prem boundary.',
    narration: [
      'And underneath it all is exactly one piece of infrastructure: MongoDB, doing three jobs. It’s the evidence file you hand the regulator — every contract and verdict. It’s the memory where that rule was found by meaning, not keywords. And it’s the alarm that wakes the agent whenever anything changes.',
    ],
    loadBearing:
      'And underneath it all is exactly one piece of infrastructure: MongoDB, doing three jobs. It’s the evidence file you hand the regulator — every contract and verdict. It’s the memory where that rule was found by meaning, not keywords. And it’s the alarm that wakes the agent whenever anything changes.',
  },
  {
    n: 8,
    act: 'IV — The artifact',
    label: 'UNPLUGGED — demo §6',
    onscreen:
      'Unit spec: nemotron-3-nano · 30B (Ollama) / bge-m3 / MongoDB Atlas Local — streams + vectors / BUILT WITH: OpenClaw · driving the box / Next.js register / Dell Pro Max GB10 / uplink: NOT REQUIRED. Measured line: CLAUSE AGREEMENT 138/141 · 98%.',
    narration: [
      '(live first: pull the cable, reload, teach another rule — then back to the deck)',
      'And one more thing. The network cable came out of the wall a minute ago, and you didn’t notice. Everything you watched ran on this one Dell box, built and driven by OpenClaw, at ninety-eight percent measured accuracy.',
      'Because the tool that gets you out of vendor lock-in cannot be a locked-in vendor itself.',
    ],
    loadBearing:
      'Because the tool that gets you out of vendor lock-in cannot be a locked-in vendor itself.',
  },
  {
    n: 9,
    act: 'V — Close',
    label: 'CLOSE',
    onscreen:
      'EXITPLAN · tan rule · It reads the contracts. It shows the way out. Nothing leaves the building. · footer: synthetic register · business analysis, not legal advice.',
    narration: [
      'So that’s ExitPlan. It reads the contracts, it shows you the way out, and nothing ever leaves the building. Thank you.',
      '(stop talking)',
    ],
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

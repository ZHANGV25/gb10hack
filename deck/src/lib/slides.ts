/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V10 — the escape framing (V9) spoken in the keynote
 *  voice (V8): setup-payoff questions, number-then-meaning, and the 2007
 *  "three systems… it's one database" turn for MongoDB. The sell is that ExitPlan
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

export const REVISION = 'V12 · the problem made real, the privacy made explicit';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — The job',
    label: 'THE READING PROBLEM',
    onscreen:
      'DORA Art. 28(8) — exit strategies for ICT behind critical functions, incl. reincorporation in-house — over the Art. 30 spec: 9 elements for every arrangement, +6 critical (audit, exit assistance). A shelf of contract spines, one reader.',
    narration: [
      'Every bank in Europe is locked into its tech vendors, and the law says they must be able to leave — to take any critical service back in-house. The answer lives in hundreds of contracts. Banks paid lawyers to read them once, when the law came in. That snapshot went stale the day it was finished.',
      'So the exit plan is just paper. It works right up until the day you need it.',
    ],
    loadBearing:
      'So the exit plan is just paper. It works right up until the day you need it.',
  },
  {
    n: 2,
    act: 'II — The cage',
    label: 'THE AUTHORITY SPLIT',
    onscreen:
      'Three lanes: MODEL EXTRACTS (present / inadequate / absent + the clause it relied on · chip: NO QUOTE, NO CLAIM) → POLICY DISPOSES (deterministic Python · chip: EXIT · AUDIT · DATA RETURN = BLOCKING) → REVIEWERS TEACH (tan · chip: RULES ONLY ACT ON AN EXISTING GAP). No database named here.',
    narration: [
      'Today, that changes. ExitPlan reads every contract you’ve signed. It tells you if you could walk away today — and when you can’t, the exact clause that’s trapping you.',
      'Let me just show you.',
    ],
  },
  {
    n: 3,
    act: 'III — Live on the desk',
    label: 'THE REGISTER — demo §1',
    onscreen:
      '(switch to the browser — deck parks here; frames 3–7 are the fallback) · Tiles: 7 with gaps · CANNOT BE CLEANLY EXITED €7,030,000 · 10 Art. 30 gaps · €16,375,000 total. Sixteen rows: 12 curated (Helvetia €4.18M → Pinnacle €88k) + 4 marked FILED (Sunrise, Edgemode, Platinum Analytics, NuScale). Weakest-estate panel unchanged.',
    narration: [
      '(switch display to the browser — 1440×1250, seeded, desk at 127.0.0.1:3000)',
      'Meet Nordhafen Bank. Sixteen contracts: twelve we wrote, synthetic on purpose — and four real ones, straight off the SEC. Hold that thought. The agent read them all and found the trapped money:',
      'Seven million euros a year, flowing through contracts this bank could never walk out of. Regulators ask for that number. No bank can produce it. This one just did.',
    ],
    loadBearing:
      'Seven million euros a year, flowing through contracts this bank could never walk out of. Regulators ask for that number. No bank can produce it. This one just did.',
  },
  {
    n: 4,
    act: 'III — Live on the desk',
    label: 'HELVETIA — the missing exit — demo §2',
    onscreen:
      'HELVETIA CLOUD SERVICES AG · core banking platform · €4,180,000/yr · CRITICAL. Checklist 14/15; absent row EXIT STRATEGY AND TRANSITION PERIOD marked blocking. One passed row expanded to its verbatim clause (14. Access, Inspection and Audit).',
    narration: [
      'Take core banking. Four million a year. Fourteen of fifteen boxes ticked, and every tick is a quote from the contract. So what’s missing? The exit clause. Fix that one clause, and four million stops being hostage.',
    ],
  },
  {
    n: 5,
    act: 'III — Live on the desk',
    label: 'TEACH IT — the correction — demo §3',
    onscreen:
      'Castellan Core Systems: the TLPT finding — supplier self-tests annually, customer-initiated testing refused; checklist: material, gaps to close. Review panel: Disagree — correct it · provision SET DELIBERATELY to “Participation in threat-led penetration testing” · scope CRITICAL FUNCTIONS ONLY · the written correction · tan STORE RULE AND RE-CHECK THE REGISTER. Right column: AGENT ACTIVITY, idle.',
    narration: [
      'But here’s my favorite part. Right here, the machine got one wrong. It called a serious weakness routine, and a risk officer disagrees.',
      '(select the provision by hand — threat-led penetration testing — the pre-fill is wrong on this contract)',
      'Two sentences of plain English, click store. Watch this.',
    ],
    loadBearing: 'Two sentences of plain English, click store. Watch this.',
  },
  {
    n: 6,
    act: 'III — Live on the desk',
    label: 'THE HALF-SECOND — demo §4',
    onscreen:
      'Build: the right column fills. Timeline: RULE STORED → INDEX SEARCHABLE → 12 RE-CHECKED · 0 RE-READ · ~0.5s. Three evidence cards: CASTELLAN — verdict changed (origin) · AURORA KYC — rule retrieved & applied, contract never opened · NORDLYS — considered, withheld (no gap to attach to). Memory chip, verbatim UI: “changing 2 verdicts now”.',
    build: true,
    narration: [
      'Half a second. That’s how long it took to re-check the whole register. It caught the same flaw in a contract nobody opened, and skipped the one that was clean.',
      'This used to be a yearly audit. Now it’s live.',
    ],
    loadBearing: 'This used to be a yearly audit. Now it’s live.',
  },
  {
    n: 7,
    act: 'III — Live on the desk',
    label: 'THE REAL ONES — the control group',
    onscreen:
      'SUNRISE COMMUNICATIONS AG · chip: FILED — SEC EDGAR. Reading strip: 113,731 CHARACTERS → SPLIT INTO PASSAGES → 11 RETRIEVED → READ IN ~77s, and a note: the model never saw the rest. Right rail: the four filed rows — Sunrise · Edgemode · Platinum Analytics · NuScale Power. Footer: no ground truth · same checks, unchanged.',
    narration: [
      'Now — remember those four real contracts? Nobody wrote those for us; they’re actual SEC filings. This one is a hundred and thirteen thousand characters — far too long for the model to read. So the agent found the eleven passages that matter, and read those. Same checklist. Same rules. Nothing tuned.',
      'The synthetic ones prove it’s accurate. The real ones prove it’s no trick.',
    ],
    loadBearing:
      'The synthetic ones prove it’s accurate. The real ones prove it’s no trick.',
  },
  {
    n: 8,
    act: 'III — Live on the desk',
    label: 'ONE DATABASE, THREE JOBS — demo §5',
    onscreen:
      'First naming of the store. OPERATIONAL REGISTER (contracts · verdicts · corrections) · VECTOR MEMORY (rules + $vectorSearch · bge-m3 1024-d) · EVENT BUS (change streams → the always-on agent). Live counts row. Dashed on-prem boundary.',
    narration: [
      'And underneath it all, there are three systems. A record — the evidence you hand the regulator. A memory — twelve precedents from three reviewers, found by meaning. And an alarm that wakes the agent when anything changes. Three systems. Except they’re not three systems. It’s one database. It’s MongoDB.',
    ],
    loadBearing:
      'And underneath it all, there are three systems. A record — the evidence you hand the regulator. A memory — twelve precedents from three reviewers, found by meaning. And an alarm that wakes the agent when anything changes. Three systems. Except they’re not three systems. It’s one database. It’s MongoDB.',
  },
  {
    n: 9,
    act: 'IV — The artifact',
    label: 'UNPLUGGED — demo §6',
    onscreen:
      'Unit spec: nemotron-3-nano · 30B (Ollama) / bge-m3 / MongoDB Atlas Local — streams + vectors / BUILT WITH: OpenClaw · driving the box / Next.js register / Dell Pro Max GB10 / uplink: NOT REQUIRED. Measured line: CLAUSE AGREEMENT 138/141 · 98%.',
    narration: [
      '(live first: pull the cable, reload, teach another rule — then back to the deck)',
      'Oh, and one more thing. The network cable came out of the wall a minute ago. Did you notice? Everything you just watched ran on this one Dell box, built and driven by OpenClaw.',
      'And that’s not a stunt. These contracts are confidential paper, and what this tool finds — where you’re weak, what you pay, where you’re trapped — is a map of the bank you could never upload.',
      'So the analysis of whether you can leave your vendors never touches a vendor.',
    ],
    loadBearing:
      'So the analysis of whether you can leave your vendors never touches a vendor.',
  },
  {
    n: 10,
    act: 'V — Close',
    label: 'CLOSE',
    onscreen:
      'EXITPLAN · tan rule · It reads the contracts. It shows the way out. Nothing leaves the building. · footer: synthetic register · business analysis, not legal advice.',
    narration: [
      'So that’s ExitPlan. It reads the contracts. It shows you the way out. And nothing ever leaves the building. Thank you.',
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
  'Live route: Register → Helvetia → Castellan → store rule → Agent activity → What it has learned → Aurora KYC → Nordlys → Sunrise Communications (filed · 113k chars · 11 passages) → How it works → pull cable, reload, teach again → back to deck (slide 9).',
  'Say “synthetic” out loud once (slide 3). It appears nowhere in the product.',
  'The register should show 16 rows: 12 curated plus 4 marked FILED (Sunrise, Edgemode, Platinum Analytics, NuScale) — that is the slide-7 beat, not drift. The € tiles are unchanged; filed contracts carry €0. Confirm Sunrise’s page shows 113,731 characters · 11 passages retrieved.',
  'A narrated 3:18 recording of the full demo sits on the box Desktop (ExitPlan-DORA-agent-demo-narrated.mp4) — the fallback of last resort. Its voiceover is cloud text-to-speech, post-production on the video only; the runtime path never leaves the box. Say so if anyone asks.',
];

/** Rehearsed Q&A — the three questions this arc invites, plus one reserve. */
export const QA: { q: string; a: string }[] = [
  {
    q: 'Why not run this in your Azure tenant?',
    a: 'Two reasons. First, the data: these contracts carry confidentiality clauses, and the output is a map of the bank’s weak points — which vendors you can’t exit, who refuses penetration testing, what you pay. That is the last dataset to hand a third party. Second, the irony: the tool that audits your ICT third parties would itself be an ICT third party, a new row in its own register. DORA doesn’t forbid cloud and we don’t claim it does — but the complete agent fits on one machine you own, so nothing has to leave.',
  },
  {
    q: 'You wrote the contracts and the ground truth. What does 98% mean?',
    a: 'The synthetic twelve are the calibration: we know exactly what’s in them, which is the only reason 98% means anything. The four SEC filings are the control: nobody wrote them for us, they carry no ground truth, and the same checks run over them unchanged. Accuracy proven on the book; generalization shown on the filings.',
  },
  {
    q: 'Does the agent survive its own sandbox?',
    a: 'Yes, and it’s a click, not a claim: stop the service, teach a rule while it’s dead, start it again. It replays what it missed from the resume token in watch_state and re-evaluates without being asked. Nothing lives in process memory — verdicts, memory, cached readings and the stream position are all in MongoDB.',
  },
  {
    q: 'Does the retriever actually change behaviour?',
    a: 'Twice over. One retriever decides what the model reads: the 113k-character Sunrise filing is unreadable without it — eleven passages retrieved per provision, the rest never seen. The other decides what the bank makes of a gap: on Vantage HR the data-return rule shows Applied at 0.767 while others were considered and withheld. And rule search is scoped per gap, because a blended query ranked the deciding rule seventh of twelve.',
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

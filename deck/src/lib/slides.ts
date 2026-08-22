/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V13 "why local, up front": the reason this cannot be
 *  a cloud service is now slide 2, before anything else — the tool's output
 *  is a map of the bank's weak points, and the vendors on that map include
 *  the cloud providers themselves. The cable pull (slide 9) is the receipt
 *  for that promise, not a stunt. Helvetia's frame folded into the register
 *  beat to pay for it. Keynote voice throughout; every number traces to
 *  DEMO.md or the code; no claim that any law requires on-prem (graveyard
 *  #1) and OpenClaw stays builder/driver, never runtime (graveyard #4).
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

export const REVISION = 'V14 · the keynote cut — V13’s spine, spoken like Cupertino';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — The trap',
    label: 'THE READING PROBLEM',
    onscreen:
      'DORA Art. 28(8) — exit strategies for ICT behind critical functions, incl. reincorporation in-house — over the Art. 30 spec: 9 elements for every arrangement, +6 critical. A shelf of contract spines, one reader.',
    narration: [
      'Every bank in Europe has the same problem. They’re locked into their tech vendors — and the law says they have to be able to leave. Take any critical service, bring it back in-house. Could they actually do that? The answer is sitting in hundreds of contracts. And nobody has read them all.',
      'So the exit plan is a piece of paper. And it works right up until the day you need it.',
    ],
    loadBearing:
      'So the exit plan is a piece of paper. And it works right up until the day you need it.',
  },
  {
    n: 2,
    act: 'I — The trap',
    label: 'WHY THIS CANNOT BE A CLOUD SERVICE',
    onscreen:
      'Left: WHAT THE ANALYSIS CONTAINS — vendors it cannot exit (3) · refuses security testing (2) · data locations undisclosed (2) · annual charges (all) · chip: A MAP OF THE BANK’S WEAK POINTS. Right: WHERE COULD IT LIVE — a cloud AI service ✗ (the vendors on the map include the cloud providers) vs. hardware the bank owns ✓.',
    narration: [
      'Now here’s the catch. To fix this, something has to read every contract the bank ever signed… and write down every way it’s trapped. Which vendors it can’t walk away from. What it pays. Who won’t let it test their security. That document is a map of the bank’s weak points. And look who’s on the map — the cloud providers themselves.',
      'You can’t store your escape plan with the people you might be escaping from. It’s that simple.',
    ],
    loadBearing:
      'You can’t store your escape plan with the people you might be escaping from. It’s that simple.',
  },
  {
    n: 3,
    act: 'II — What we built',
    label: 'THE AGENT ON ONE BOX',
    onscreen:
      'Three lanes: MODEL EXTRACTS (present / inadequate / absent + the clause it relied on · chip: NO QUOTE, NO CLAIM) → POLICY DISPOSES (deterministic Python) → REVIEWERS TEACH (tan). No database named here.',
    narration: [
      'So we built ExitPlan to live on hardware the bank owns. A complete AI agent — a thirty-billion-parameter model, search, memory, a database — on one Dell box. And every claim it makes, it backs up with a quote from the contract.',
      'Rather than talk about it… let me just show you.',
    ],
  },
  {
    n: 4,
    act: 'III — Live on the desk',
    label: 'THE REGISTER — demo §1 + §2',
    onscreen:
      '(switch to the browser — deck parks here; frames 4–7 are the fallback) · Tiles: 7 with gaps · CANNOT BE CLEANLY EXITED €7,030,000 · 10 Art. 30 gaps · €16,375,000 total. Sixteen rows: 12 curated + 4 marked FILED. Live: open Helvetia (14/15, missing exit clause) before moving on.',
    narration: [
      '(switch display to the browser — 1440×1250, seeded, desk at 127.0.0.1:3000)',
      'This is Nordhafen Bank. Fictional — the data is synthetic. Sixteen contracts: twelve we wrote ourselves… and four real ones, straight off the SEC. Hold that thought. The agent read them all. And it found something.',
      'Seven million euros a year — flowing through contracts this bank could never walk out of. Regulators ask for exactly that number. No bank can produce it. This one just did.',
      '(open Helvetia live)',
      'Look at this one. Core banking. Four million a year. One exit clause short of freedom.',
    ],
    loadBearing:
      'Seven million euros a year — flowing through contracts this bank could never walk out of. Regulators ask for exactly that number. No bank can produce it. This one just did.',
  },
  {
    n: 5,
    act: 'III — Live on the desk',
    label: 'TEACH IT — the correction — demo §3',
    onscreen:
      'Castellan Core Systems: the TLPT finding — supplier self-tests annually, customer-initiated testing refused; checklist: material, gaps to close. Review panel: Disagree — correct it · provision SET DELIBERATELY to “Participation in threat-led penetration testing” · scope CRITICAL FUNCTIONS ONLY · the written correction · tan STORE RULE AND RE-CHECK THE REGISTER. Right column: AGENT ACTIVITY, idle.',
    narration: [
      'And here’s my favorite part. Right here — the machine got one wrong. It called a serious weakness “routine”. And a risk officer says: no.',
      '(select the provision by hand — threat-led penetration testing — the pre-fill is wrong on this contract)',
      'Two sentences of plain English. Click store. Now watch this.',
    ],
    loadBearing: 'Two sentences of plain English. Click store. Now watch this.',
  },
  {
    n: 6,
    act: 'III — Live on the desk',
    label: 'THE HALF-SECOND — demo §4',
    onscreen:
      'Build: the right column fills. Timeline: RULE STORED → INDEX SEARCHABLE → 12 RE-CHECKED · 0 RE-READ · ~0.5s. Three evidence cards: CASTELLAN — verdict changed (origin) · AURORA KYC — rule retrieved & applied, contract never opened · NORDLYS — considered, withheld (no gap to attach to). Memory chip, verbatim UI: “changing 2 verdicts now”.',
    build: true,
    narration: [
      'Half a second. That’s how long it took to re-check every contract in the register. It caught the same flaw in a contract nobody opened. It skipped the one that was clean.',
      'This used to be a yearly audit. Now it just… happens.',
    ],
    loadBearing: 'This used to be a yearly audit. Now it just… happens.',
  },
  {
    n: 7,
    act: 'III — Live on the desk',
    label: 'THE REAL ONES — the control group',
    onscreen:
      'SUNRISE COMMUNICATIONS AG · chip: FILED — SEC EDGAR. Reading strip: 113,731 CHARACTERS → SPLIT INTO PASSAGES → 11 RETRIEVED → READ IN ~77s, and a note: the model never saw the rest. Right rail: the four filed rows — Sunrise · Edgemode · Platinum Analytics · NuScale Power. Footer: no ground truth · same checks, unchanged.',
    narration: [
      'Now. Those four real contracts? We didn’t write those. Nobody did. They’re actual SEC filings. And this one? A hundred and thirteen thousand characters — too big for the model to even read. So the agent found the eleven passages that matter… and read those. Same checklist. Nothing tuned.',
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
      'And underneath all of this… three systems. A record — the evidence you hand the regulator. A memory — twelve precedents from three reviewers, found by meaning. And an alarm — the moment anything changes, it wakes the agent. A record… a memory… an alarm. Are you getting it? These are not three systems. This is one database. It’s MongoDB.',
    ],
    loadBearing:
      'And underneath all of this… three systems. A record — the evidence you hand the regulator. A memory — twelve precedents from three reviewers, found by meaning. And an alarm — the moment anything changes, it wakes the agent. A record… a memory… an alarm. Are you getting it? These are not three systems. This is one database. It’s MongoDB.',
  },
  {
    n: 9,
    act: 'IV — The receipt',
    label: 'UNPLUGGED — demo §6',
    onscreen:
      'Unit spec: nemotron-3-nano · 30B (Ollama) / bge-m3 / MongoDB Atlas Local — streams + vectors / BUILT WITH: OpenClaw · driving the box / Next.js register / Dell Pro Max GB10 / uplink: NOT REQUIRED. Measured line: CLAUSE AGREEMENT 138/141 · 98%.',
    narration: [
      '(live first: pull the cable, reload, teach another rule — then back to the deck)',
      'Oh — and one more thing. The network cable came out of the wall a minute ago. Did anybody notice? That was the promise. The reading. The memory. The map. All of it happened on this one Dell box — built and driven by OpenClaw.',
      'The analysis of whether you can leave your vendors… never touched a vendor.',
    ],
    loadBearing:
      'The analysis of whether you can leave your vendors… never touched a vendor.',
  },
  {
    n: 10,
    act: 'V — Close',
    label: 'CLOSE',
    onscreen:
      'EXITPLAN · tan rule · It reads the contracts. It shows the way out. Nothing leaves the building. · footer: synthetic register · business analysis, not legal advice.',
    narration: [
      'So. That’s ExitPlan. It reads the contracts. It shows you the way out. And the way out never leaves the building. Thank you very much.',
      '(stop talking)',
    ],
  },
];

/** Operator prep — read before going on, never spoken. Mirrors DEMO.md. */
export const PRESHOW: string[] = [
  'systemctl --user status dora-watch → active (running) — without it the teach beat dies.',
  'Reset between runs is instant: reset_demo.py retires what you taught and the agent reverts the verdicts itself. Full seed_dora.py + review_all.py (~12 min) only if the contracts changed. Confirm the register tiles (7 with gaps · 10 gaps · €7,030,000 · €16,375,000), Castellan shows “Gaps to close”, and the agreement line (script says 138/141 · 98%); update these strings if the run differs.',
  'Browser ≥1440×1250, desk at 127.0.0.1:3000. Deck parked on slide 3 during the demo.',
  'Drill the dropdown: on Castellan the provision pre-fill is WRONG (termination rights). Select “Participation in threat-led penetration testing”, scope “critical functions only”, or Aurora never fires.',
  'Live route: Register → Helvetia (during slide 4’s last line) → Castellan → store rule → Agent activity → What it has learned → Aurora KYC → Nordlys → Sunrise Communications (filed · 113k chars · 11 passages) → How it works → pull cable, reload, teach again → back to deck (slide 9).',
  'Say “synthetic” out loud once (slide 4). It appears nowhere in the product.',
  'The register should show 16 rows: 12 curated plus 4 marked FILED (Sunrise, Edgemode, Platinum Analytics, NuScale). The € tiles are unchanged; filed contracts carry €0. Confirm Sunrise’s page shows 113,731 characters · 11 passages retrieved.',
  'A narrated 3:18 recording of the full demo sits on the box Desktop (ExitPlan-DORA-agent-demo-narrated.mp4) — the fallback of last resort. Its voiceover is cloud text-to-speech, post-production on the video only; the runtime path never leaves the box. Say so if anyone asks.',
];

/** Rehearsed Q&A — the questions this arc invites. */
export const QA: { q: string; a: string }[] = [
  {
    q: 'Why not run this in your Azure tenant?',
    a: 'Even in-tenant, two problems survive. First, the output: a live map of the bank’s weak points — which vendors it can’t exit, who refuses penetration testing, what it pays — now lives inside one of its largest ICT dependencies, and the hyperscalers are themselves in scope for a real bank’s register. Second, the register grows a row: the tool that audits your ICT third parties becomes an ICT third party with an exit clause of its own. DORA doesn’t forbid cloud and we don’t claim it does — but the complete agent fits on one machine you own, so nothing has to leave.',
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

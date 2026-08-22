/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V15 "two slides, the film, two slides": the show is
 *  slide 1 (the trap) → slide 2 (the map — why this cannot be a cloud
 *  service) → slide 3 parks while the demo video plays (narrate the four
 *  film beats over the 1:52 silent cut, or let the 3:18 narrated cut speak
 *  for itself) → slide 4 (the box) → slide 5 (close). Slides 6–10 are an
 *  appendix after the close: the old demo frames, advanced only if the video
 *  fails. Keynote voice throughout; every number traces to DEMO.md or the
 *  code; no law-requires-on-prem claim (graveyard #1); OpenClaw is
 *  builder/driver of the box, never the runtime (graveyard #4).
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

export const REVISION = 'V15 · two slides, the film, two slides — the audio matches the format';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — Two slides in',
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
    act: 'I — Two slides in',
    label: 'WHY THIS CANNOT BE A CLOUD SERVICE',
    onscreen:
      'Left: WHAT THE ANALYSIS CONTAINS — vendors it cannot exit (3) · refuses security testing (2) · data locations undisclosed (2) · annual charges (all) · chip: A MAP OF THE BANK’S WEAK POINTS. Right: WHERE COULD IT LIVE — a cloud AI service ✗ (the vendors on the map include the cloud providers) vs. hardware the bank owns ✓.',
    narration: [
      'Now here’s the catch. To fix this, something has to read every contract the bank ever signed… and write down every way it’s trapped. Which vendors it can’t walk away from. What it pays. Who won’t let it test their security. That document is a map of the bank’s weak points. And look who’s on the map — the cloud providers themselves.',
      'You can’t store your escape plan with the people you might be escaping from. It’s that simple.',
      'So we built ExitPlan to live on one machine the bank owns. Here it is.',
    ],
    loadBearing:
      'You can’t store your escape plan with the people you might be escaping from. It’s that simple.',
  },
  {
    n: 3,
    act: 'II — The film',
    label: 'ROLL THE FILM',
    onscreen:
      'A quiet title card — EXITPLAN · RECORDED AGAINST THE LIVE DESK — while the video plays fullscreen. The deck parks here for the whole film.',
    narration: [
      '(play the film. With the 1:52 silent cut, you speak the four beats below over it. With the 3:18 narrated cut, stand back and let it talk. Either way the deck stays parked on this slide.)',
    ],
  },
  {
    n: 6,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 1 — the register and the trapped money',
    onscreen:
      '(video: the register scrolls — tiles, sixteen rows, the weakest-estate panel — then opens Helvetia: 14/15, the missing exit clause.) Appendix frame #6 is the fallback.',
    narration: [
      'This is Nordhafen Bank. Fictional — the data is synthetic. Sixteen contracts: twelve we wrote ourselves… and four real ones, straight off the SEC. Hold that thought. The agent read them all. And it found something.',
      'Seven million euros a year — flowing through contracts this bank could never walk out of. Regulators ask for exactly that number. No bank can produce it. This one just did.',
      'And look at this one. Core banking. Four million a year. One exit clause short of freedom.',
    ],
    loadBearing:
      'Seven million euros a year — flowing through contracts this bank could never walk out of. Regulators ask for exactly that number. No bank can produce it. This one just did.',
  },
  {
    n: 7,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 2 — a human teaches it',
    onscreen:
      '(video: Castellan’s finding, the review panel, the provision picked, the correction typed, Store rule clicked… then the sweep: 12 re-checked in ~0.5s, Aurora reached unopened, Nordlys withheld.) Appendix frames #7–8 are the fallback.',
    narration: [
      'And here’s my favorite part. Right here — the machine got one wrong. It called a serious weakness “routine”. And a risk officer says: no. Two sentences of plain English. Click store. Now watch this.',
      'Half a second. That’s how long it took to re-check every contract in the register. It caught the same flaw in a contract nobody opened. It skipped the one that was clean. This used to be a yearly audit. Now it just… happens.',
    ],
    loadBearing:
      'Half a second. That’s how long it took to re-check every contract in the register. It caught the same flaw in a contract nobody opened. It skipped the one that was clean. This used to be a yearly audit. Now it just… happens.',
  },
  {
    n: 9,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 3 — the real ones',
    onscreen:
      '(video: Sunrise Communications opens — FILED, 113,731 characters, 11 passages retrieved, the checklist filled the same way.) Appendix frame #9 is the fallback.',
    narration: [
      'Now. Those four real contracts? We didn’t write those. Nobody did. They’re actual SEC filings. And this one? A hundred and thirteen thousand characters — too big for the model to even read. So the agent found the eleven passages that matter… and read those. Same checklist. Nothing tuned.',
      'The synthetic ones prove it’s accurate. The real ones prove it’s no trick.',
    ],
    loadBearing:
      'The synthetic ones prove it’s accurate. The real ones prove it’s no trick.',
  },
  {
    n: 10,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 4 — one database',
    onscreen:
      '(video: the How-it-works page — the three jobs, the live counts, the dashed boundary.) Appendix frame #10 is the fallback.',
    narration: [
      'And underneath all of this… three systems. A record — the evidence you hand the regulator. A memory — twelve precedents from three reviewers, found by meaning. And an alarm — the moment anything changes, it wakes the agent. A record… a memory… an alarm. Are you getting it? These are not three systems. This is one database. It’s MongoDB.',
    ],
    loadBearing:
      'And underneath all of this… three systems. A record — the evidence you hand the regulator. A memory — twelve precedents from three reviewers, found by meaning. And an alarm — the moment anything changes, it wakes the agent. A record… a memory… an alarm. Are you getting it? These are not three systems. This is one database. It’s MongoDB.',
  },
  {
    n: 4,
    act: 'III — Two slides out',
    label: 'THE BOX',
    onscreen:
      'Unit spec: nemotron-3-nano · 30B (Ollama) / bge-m3 / MongoDB Atlas Local — streams + vectors / BUILT WITH: OpenClaw · driving the box / Next.js register / Dell Pro Max GB10 / uplink: NOT REQUIRED. Measured line: CLAUSE AGREEMENT 138/141 · 98%.',
    narration: [
      '(back to the deck — and if the GB10 is in the room, point at it)',
      'So. Everything you just watched ran on one Dell box. A thirty-billion-parameter model. MongoDB. Built and driven by OpenClaw. Ninety-eight percent measured accuracy — and zero cloud calls. Nothing left the building.',
      'The analysis of whether you can leave your vendors… never touched a vendor.',
    ],
    loadBearing:
      'The analysis of whether you can leave your vendors… never touched a vendor.',
  },
  {
    n: 5,
    act: 'IV — Close',
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
  'The show is five keypresses: 1 → 2 → 3 (the film plays; deck parks) → 4 → 5. Slides 6–10 sit after the close as an appendix — the old demo frames, advanced only if the video fails while you keep speaking the film beats.',
  'Pick the cut before you go on: the 1:52 silent video (you speak film beats 1–4 over it) or the 3:18 narrated video (you stay silent; its voiceover is cloud TTS, post-production only — say so if anyone asks how it was made). Both are on the box Desktop.',
  'If the desk is shown live instead of the video, the old run still applies: dora-watch active; reset_demo.py between runs; on Castellan the provision pre-fill is WRONG — select “Participation in threat-led penetration testing”, scope “critical functions only”, or Aurora never fires.',
  'Register sanity: 16 rows (12 curated + 4 FILED), tiles 7 with gaps · 10 gaps · €7,030,000 · €16,375,000, Castellan “Gaps to close”, Sunrise 113,731 characters · 11 passages, agreement 138/141 · 98% — update script strings if a re-run differs.',
  'Say “synthetic” out loud once (film beat 1). It appears nowhere in the product.',
  'If the GB10 itself is in the room, point at it on slide 4 — the box beats the spec sheet.',
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
    q: 'Was that a video or the real thing?',
    a: 'A recording of the real desk — driven by a Playwright script against the live system, each beat held for its narration segment. Everything in it is reproducible on the box in this room, right now: the register, the taught rule and the half-second sweep are exactly what you’d click yourself. Happy to run any beat live.',
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

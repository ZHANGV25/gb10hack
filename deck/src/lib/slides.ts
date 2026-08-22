/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V16 "two slides, the film, two slides": the show is
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

export const REVISION = 'V17 · cut to 400 words — every sentence earns its place';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — Two slides in',
    label: 'THE READING PROBLEM',
    onscreen:
      'DORA Art. 28(8) — exit strategies for ICT behind critical functions, incl. reincorporation in-house — over the Art. 30 spec: 9 elements for every arrangement, +6 critical. A shelf of contract spines, one reader.',
    narration: [
      'Every bank in Europe is legally required to be able to walk away from its technology vendors. Whether it actually can is buried in hundreds of contracts nobody has read.',
      'So the exit plan is a piece of paper, and it works until the day you need it.',
    ],
    loadBearing:
      'So the exit plan is a piece of paper, and it works until the day you need it.',
  },
  {
    n: 2,
    act: 'I — Two slides in',
    label: 'WHY THIS CANNOT BE A CLOUD SERVICE',
    onscreen:
      'Left: WHAT THE ANALYSIS CONTAINS — vendors it cannot exit (3) · refuses security testing (2) · data locations undisclosed (2) · annual charges (all) · chip: A MAP OF THE BANK’S WEAK POINTS. Right: WHERE COULD IT LIVE — a cloud AI service ✗ (the vendors on the map include the cloud providers) vs. hardware the bank owns ✓.',
    narration: [
      'Fixing that means writing down every way the bank is trapped: which vendors it can’t leave, what it pays them, who refuses security testing. That document is a map of the bank’s weak points, and the cloud providers are on it. You can’t store your escape plan with the people you might be escaping from.',
      'So ExitPlan runs on one machine the bank owns. Here it is.',
    ],
    loadBearing:
      'You can’t store your escape plan with the people you might be escaping from.',
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
      'This is Nordhafen, a fictional bank: twelve synthetic contracts we wrote, four real ones from SEC filings. The agent read them all and found seven million euros a year in contracts this bank could never walk out of. Regulators ask for that number, and no bank can produce it.',
      'And this contract runs core banking, four million a year, one exit clause short of freedom.',
    ],
    loadBearing:
      'The agent read them all and found seven million euros a year in contracts this bank could never walk out of.',
  },
  {
    n: 7,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 2 — a human teaches it',
    onscreen:
      '(video: Castellan’s finding, the review panel, the provision picked, the correction typed, Store rule clicked… then the sweep: 12 re-checked in ~0.5s, Aurora reached unopened, Nordlys withheld.) Appendix frames #7–8 are the fallback.',
    narration: [
      'Here’s my favorite part. The machine called a serious weakness routine, and a risk officer corrects it with two sentences of plain English.',
      'Click store, and in half a second the agent re-checks every contract in the register. It catches the same flaw in a contract nobody opened and skips the one that was clean. That used to be a yearly audit.',
    ],
    loadBearing:
      'Click store, and in half a second the agent re-checks every contract in the register.',
  },
  {
    n: 9,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 3 — the real ones',
    onscreen:
      '(video: Sunrise Communications opens — FILED, 113,731 characters, 11 passages retrieved, the checklist filled the same way.) Appendix frame #9 is the fallback.',
    narration: [
      'These four are real SEC filings. This one is a hundred and thirteen thousand characters, too long for the model to read, so the agent found the eleven passages that matter and read those. Same checklist, nothing tuned.',
      'The contracts we wrote prove it’s accurate. The real ones prove it’s no trick.',
    ],
    loadBearing:
      'The contracts we wrote prove it’s accurate. The real ones prove it’s no trick.',
  },
  {
    n: 10,
    act: 'II — The film · audio over the video',
    label: 'FILM BEAT 4 — one database',
    onscreen:
      '(video: the How-it-works page — the three jobs, the live counts, the dashed boundary.) Appendix frame #10 is the fallback.',
    narration: [
      'All of this stands on three things: a record of evidence for the regulator, a memory of every reviewer correction, and an alarm that wakes the agent when anything changes. Normally that’s three systems. Here it’s one database: MongoDB, running on the box.',
    ],
    loadBearing:
      'Normally that’s three systems. Here it’s one database: MongoDB, running on the box.',
  },
  {
    n: 4,
    act: 'III — Two slides out',
    label: 'THE BOX',
    onscreen:
      'Unit spec: nemotron-3-nano · 30B (Ollama) / bge-m3 / MongoDB Atlas Local — streams + vectors / BUILT WITH: OpenClaw · driving the box / Next.js register / Dell Pro Max GB10 / uplink: NOT REQUIRED. Measured line: CLAUSE AGREEMENT 138/141 · 98%.',
    narration: [
      '(back to the deck — and if the GB10 is in the room, point at it)',
      'Everything you just watched ran on this one Dell box: a thirty billion parameter model and MongoDB, built and driven by OpenClaw, ninety-eight percent measured accuracy, zero cloud calls.',
      'The analysis of whether the bank can leave its vendors never touched a vendor.',
    ],
    loadBearing:
      'The analysis of whether the bank can leave its vendors never touched a vendor.',
  },
  {
    n: 5,
    act: 'IV — Close',
    label: 'CLOSE',
    onscreen:
      'EXITPLAN · tan rule · It reads the contracts. It shows the way out. Nothing leaves the building. · footer: synthetic register · business analysis, not legal advice.',
    narration: [
      'That’s ExitPlan. It reads the contracts, shows you the way out, and the way out never leaves the building. Thank you.',
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
    a: 'Even in your own tenant, two problems survive. The output is a live map of the bank’s weak points, and it would now live inside one of the bank’s largest ICT dependencies, because the hyperscalers are themselves in scope for a real register. And the tool that audits your ICT third parties would become an ICT third party itself, with an exit clause of its own. DORA doesn’t forbid cloud and we don’t claim it does, but the complete agent fits on one machine you own, so nothing has to leave.',
  },
  {
    q: 'You wrote the contracts and the ground truth. What does 98% mean?',
    a: 'The synthetic twelve are the calibration: we know exactly what’s in them, which is the only reason 98% means anything. The four SEC filings are the control: nobody wrote them for us, they carry no ground truth, and the same checks run over them unchanged. We prove accuracy on the contracts we wrote and show generalization on the filings.',
  },
  {
    q: 'Was that a video or the real thing?',
    a: 'It’s a recording of the real desk, captured by a script driving the live system. Everything in it is reproducible on the box in this room right now, and we’re happy to run any beat live.',
  },
  {
    q: 'Does the agent survive its own sandbox?',
    a: 'Yes, and it’s a click, not a claim: stop the service, teach a rule while it’s dead, start it again. It replays what it missed from the resume token in watch_state and re-evaluates without being asked. Nothing lives in process memory — verdicts, memory, cached readings and the stream position are all in MongoDB.',
  },
  {
    q: 'Does the retriever actually change behaviour?',
    a: 'Twice over. One retriever decides what the model reads: the 113k-character Sunrise filing is unreadable without it, so eleven passages are retrieved per provision and the rest is never seen. The other decides what the bank makes of a gap: on Vantage HR the data-return rule shows Applied at 0.767 while others were considered and withheld. And rule search is scoped per gap, because a blended query ranked the deciding rule seventh of twelve.',
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

/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script (the deck scenes are being updated to match this arc).
 *  V2 "cage-centered": local-first is table stakes in this room; the pitch is
 *  the buyer (DORA duty) and the legally-shaped agent. The cable is a
 *  10-second punctuation before the close, not the spine.
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

export const REVISION = 'V2 · cage-centered — cable demoted to punctuation';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — The buyer',
    label: 'WHO BUYS — the room-aware hook',
    onscreen:
      'Warm paper, registration marks. Two mono lines only: “DORA Art 28(8)” and the phrase “reincorporate them in-house”, tan underline drawing as spoken. No full excerpt until EUR-Lex-verified.',
    narration: [
      'Everyone in this room is running a local model today. So that can’t be the pitch.',
      'The pitch is who has to buy one. Every EU bank — by law.',
      'DORA, Article 28(8): every financial entity must hold a plan to pull its ICT services out of its provider and reincorporate them in-house.',
      'Not because cloud is banned — HSBC runs its primary AML monitoring on Google Cloud. That’s exactly why the exit duty exists.',
    ],
  },
  {
    n: 2,
    act: 'I — The buyer',
    label: 'A SLIDE — the punchline',
    onscreen: 'The deliberately sad PowerPoint mock. Held on a full beat of silence.',
    narration: [
      'Ask a bank what that plan looks like today. You’ll get a PowerPoint.',
      '(beat — a full second)',
      'We built the artifact instead.',
    ],
  },
  {
    n: 3,
    act: 'I — The buyer',
    label: 'EXITPLAN — the reveal',
    onscreen:
      'GB10 box drawing, spec chips typing on (COMPUTE · MODELS · UPLINK). From the first live frame: browser address bar shows the box’s LAN IP, never localhost.',
    narration: [
      'This is ExitPlan — financial-crime triage for EU banks, running entirely on this box.',
      'Local is table stakes here, so we won’t spend your five minutes proving it — the address bar stays on the box’s LAN IP the whole way through.',
      'What’s special is what this agent is allowed to do. Watch the cage, not the box.',
    ],
  },
  {
    n: 4,
    act: 'II — The cage',
    label: 'MONDAY — the queue',
    onscreen:
      'CUT 1 → live product. 200-row mono queue. Honesty chip: 200 ALERTS · 99% NOISE · 30 MIN EACH BY HAND · SYNTHETIC DATA.',
    narration: [
      'This is a compliance analyst’s queue. Two hundred alerts — synthetic data, all of it — ninety-nine percent noise, thirty minutes each by hand.',
      'A hundred analyst-hours of triage, on one queue.',
    ],
  },
  {
    n: 5,
    act: 'II — The cage',
    label: 'RULES — the screener owns the queue',
    onscreen: 'Build: the row expands, queue recedes. The rule that fired, the fuzzy match, the corridor.',
    build: true,
    narration: [
      'One opens. Notice what found it — a rule.',
      'A deterministic screener owns this queue. The model can’t invent an alert, and it can’t make one disappear.',
    ],
  },
  {
    n: 6,
    act: 'II — The cage',
    label: 'CITED — the draft',
    onscreen:
      'The disposition draft assembles; every sentence trails a citation chip; one expands to the exact source span.',
    narration: [
      'The agent drafts the disposition. Every sentence carries its source — the customer file, the policy paragraph, the regulation — down to the exact span.',
      'No evidence? It says so, and escalates. It never fills a gap.',
    ],
  },
  {
    n: 7,
    act: 'II — The cage',
    label: 'OVERRULED — rules beat the model',
    onscreen: 'Build: the red-flag bar stamps across the draft’s recommendation.',
    build: true,
    narration: [
      'And when a hard rule disagrees with the model — the rule wins. The model never overrules the rules.',
    ],
  },
  {
    n: 8,
    act: 'II — The cage',
    label: 'NO FILE ACTION — the cage, shown',
    onscreen:
      'The agent’s action list renders: DRAFT · CITE · ESCALATE. File sits greyed with a lock chip: FILE — HUMAN ONLY.',
    narration: [
      'Now watch what this agent can actually do: draft, cite, escalate.',
      'There is no file action. That’s not a policy we wrote into a prompt — there is no tool there to call.',
    ],
  },
  {
    n: 9,
    act: 'II — The cage',
    label: 'DECIDE — the human, and the unlock',
    onscreen:
      'Monochrome except the tan Decide and File buttons. The deck’s only cursor clicks both. The audit-ledger line appends.',
    narration: [
      'The agent drafted. A human decides, and a human files.',
      'AML Regulation, Article 18(3): that decision cannot be outsourced — not to a vendor, not to a model.',
      'That constraint isn’t what limits this product. It’s what lets a regulated bank run it at all.',
      '(the ledger line appends)',
      'Append-only ledger: input hash, rationale, the analyst’s name. Evidence you can hand an auditor.',
    ],
  },
  {
    n: 10,
    act: 'III — Proof',
    label: 'STACK — chips on the same box',
    onscreen:
      'CUT 2 → back to deck. The slide-3 box returns; spec chips reattach fast: OpenClaw · NemoClaw · OpenShell · MongoDB + bge-m3 · nemotron-3-nano 30B.',
    narration: [
      'Under the hood: OpenClaw orchestrating, NemoClaw auditing every step, OpenShell sandboxing execution, MongoDB holding the evidence and the vectors — all on the box.',
    ],
  },
  {
    n: 11,
    act: 'III — Proof',
    label: 'THE EXIT, EXECUTED — ten seconds of cable',
    onscreen:
      'Presenter pulls the box’s uplink. The external ping terminal — green since the first live frame — starts timing out. The UI keeps moving. Ten seconds, no more.',
    loadBearing: 'That’s the exit plan — executing.',
    narration: [
      'One last thing. The regulation we started with asks every bank for an exit. Ours takes ten seconds.',
      '(pull the cable)',
      'That’s the box’s uplink — the room is fine, the LAN is fine — and the next draft comes out exactly like the last one.',
      'That’s the exit plan — executing.',
    ],
  },
  {
    n: 12,
    act: 'IV — Close',
    label: 'PAY IT BACK — 200 → 1',
    onscreen:
      'Number-flow counts 200 down to 1. Chip: ONE CITED DRAFT · ONE HUMAN DECISION. Finanz Informatik as one small line.',
    narration: [
      'Two hundred alerts in. One cited draft, one human decision, and nothing left the room.',
      'Finanz Informatik already runs a hundred and fifty thousand banking users on models in its own data centres. Every EU bank carries the same duty.',
    ],
  },
  {
    n: 13,
    act: 'IV — Close',
    label: 'CLOSE',
    onscreen: 'EXITPLAN wordmark, tan underline, “The artifact, not the slide.” Registration marks.',
    narration: ['ExitPlan. The artifact, not the slide.', '(stop talking)'],
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

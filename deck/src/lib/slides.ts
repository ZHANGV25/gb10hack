/** The pitch script — single source of truth for the person at the microphone.
 *  Rendered at /script. V3 "problem-first": a Codex (gpt-5.6-sol) ground-up
 *  rewrite synthesized with the shadow-deployment thesis. No cable gimmick,
 *  no invented scale, every claim checked against the running code.
 *  Full staging + Q&A prep: docs/PITCH-V3.md.
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

export const REVISION = 'V3 · problem-first — codex × fable synthesis, no gimmicks';

export const SLIDES: Slide[] = [
  {
    n: 1,
    act: 'I — The job',
    label: 'THE WORK ORDER',
    onscreen: 'ALERT ≠ VERDICT · L1: 30–45 MIN* · ≈95% CLOSED WITHOUT SAR* (*source footer: Everest/Capgemini 2025, NICE Actimize survey — unspoken)',
    narration: [
      'An AML alert is not a verdict. It’s a work order: pull the customer records, the payments, the watchlists, the policy; write a defensible memo; decide — close or escalate.',
      'Industry studies put level-one handling at thirty to forty-five minutes, and roughly ninety-five percent of alerts close without a suspicious-activity report.',
      'ExitPlan attacks that queue.',
    ],
  },
  {
    n: 2,
    act: 'I — The job',
    label: 'TODAY’S DESK — the status quo',
    onscreen: 'CORE BANKING → MONITORING RULES → L1 QUEUE · KYC · PAYMENTS · WATCHLISTS · POLICY · legacy case tools · manual memo · outsourced capacity',
    narration: [
      'Today, core-banking feeds hit monitoring rules and pour alerts into level-one queues — often staffed at scale, often outsourced.',
      'Analysts swivel between KYC, payments, watchlists, policy binders and legacy case tools, then hand-write the rationale.',
      'ExitPlan keeps that control structure and removes the assembly work.',
    ],
  },
  {
    n: 3,
    act: 'II — The system',
    label: 'NOT JUST AN LLM — the architecture',
    onscreen:
      'One Mongo-centred diagram inside a DELL PRO MAX GB10 boundary: feeds → customers/transactions → RULES → alerts; policy ingest → bge-m3 → corpus [vector index] ↕ retrievePolicy ↕ nemotron drafter (≤4 steps) → HARD GATE → HUMAN → dispositions/audit_log. Labels: ONLY TOOL: retrievePolicy · NO DECIDE TOOL · NO FILE TOOL.',
    narration: [
      'ExitPlan is an agent system with an LLM inside it — not the other way around.',
      'Feeds land in MongoDB. Policy is embedded there with bge-m3. Deterministic rules — not the model — open every alert.',
      'The drafting loop gets exactly one tool: retrieve policy. Mongo vector search returns the spans. Hard gates and a human own the outcome.',
    ],
  },
  {
    n: 4,
    act: 'III — Live on the desk',
    label: 'THE QUEUE',
    onscreen: 'CUT → live product. Alert queue. Lower-third: 8 NAMED SYNTHETIC CASES. Select VIKTOR KOVALEV.',
    narration: [
      'This is Nordhafen Bank — fictional, eight named synthetic cases, running the same rules a core-banking feed would.',
      'Let’s take Viktor Kovalev: a fuzzy name match against a sanctions listing.',
    ],
  },
  {
    n: 5,
    act: 'III — Live on the desk',
    label: 'PROVENANCE — the rule opened it',
    onscreen: 'Case view: WATCHLIST_FUZZY · matched name · customer record · ordinary payments · the rule’s reason.',
    build: true,
    narration: [
      'The case shows the rule that fired, the matched name, the customer, the payments.',
      'The model didn’t find this, and it can’t suppress it — it receives a case that already exists in the database.',
    ],
  },
  {
    n: 6,
    act: 'III — Live on the desk',
    label: 'RETRIEVE, THEN DRAFT',
    onscreen: 'Click GENERATE DISPOSITION → “searching policy library” → four source titles appear → the memo streams.',
    narration: [
      'Generate disposition. The loop calls its one tool first — watch the retrieval chips: bge-m3 embeds the query, Atlas vector search returns four policy spans, and the memo streams, grounded in them.',
      'There is no decide tool. There is no file tool.',
    ],
  },
  {
    n: 7,
    act: 'III — Live on the desk',
    label: 'THE AUTHORITY BOUNDARY',
    onscreen: 'Dismiss Kovalev → open VIKTOR KOVALENKO · EXACT SANCTIONS MATCH · Dismiss disabled (and rejected server-side) · SUBMIT SAR TO FIU.',
    narration: [
      'The draft is advice. I dismiss the false match — a human action, recorded.',
      'Now Viktor Kovalenko: an exact sanctions match. Dismiss is disabled here, and rejected server-side — no prompt can negotiate with that gate.',
      'Only the analyst can refer it, or submit the SAR to the FIU. I’ll submit.',
    ],
  },
  {
    n: 8,
    act: 'III — Live on the desk',
    label: 'THE MONGODB REVEAL — state, not logos',
    onscreen: 'Open /system, then /audit. DECISIONS 0 → 2 · EVENTS 16 → 18 · collection rail: customers · transactions · alerts · corpus · dispositions · audit_log.',
    loadBearing: 'MongoDB isn’t our vector-store sidecar — it’s the desk’s chain of custody.',
    narration: [
      'Now look at state. One database holds the whole desk: customers, transactions, alerts, embedded policy, dispositions, audit.',
      'Our two clicks just moved the live decision count from zero to two and appended two timestamped events.',
      'MongoDB isn’t our vector-store sidecar — it’s the desk’s chain of custody.',
    ],
  },
  {
    n: 9,
    act: 'IV — The deal',
    label: 'THE UNDERSTUDY — shadow-first deployment',
    onscreen: 'SHADOW-FIRST PILOT · same feeds, drafting beside your analysts · decisions → precedent (Mongo) · overrules → proposed rules, human-approved · GO/NO-GO: median handle time −50% · citations validated · rework ≤ baseline.',
    narration: [
      'Deployment is shadow-first: wire it to the same feeds and let it draft beside your analysts.',
      'And it learns the way a bank can audit — every decision they record becomes retrievable precedent in Mongo; every overrule becomes a proposed rule a human signs off. Documents, not weight updates.',
      'The pilot has a hard scorecard: halve median handle time, every citation validated, rework no worse. If the numbers don’t move, it fails. We claim no ROI from eight synthetic cases.',
    ],
  },
  {
    n: 10,
    act: 'V — Close',
    label: 'CLOSE',
    onscreen: 'EXITPLAN · RULES FIND · AGENT DRAFTS · MONGODB REMEMBERS · HUMAN DECIDES · runtime rail: Ollama · nemotron · bge-m3 · Atlas Local · Dell Pro Max GB10.',
    narration: [
      'All of it — model, embeddings, vector search, application, database — runs on this Dell Pro Max.',
      'Which makes it a working piece of a DORA Article 28(8) exit path. DORA doesn’t ban cloud — it demands you can leave.',
      'ExitPlan: rules find, the agent drafts, Mongo remembers, the human decides.',
      '(stop talking)',
    ],
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

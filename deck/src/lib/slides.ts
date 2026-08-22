/** Narration for the recording session and the stage. Spoken words only —
 *  staging and reasoning live in docs/DECK-PLAN.md. Rendered at /script. */

export type Slide = {
  n: number;
  label: string;
  build?: boolean;
  narration: string[];
};

export const SLIDES: Slide[] = [
  {
    n: 1,
    label: "IN-HOUSE — the regulation",
    narration: [
      "There's a sentence in EU law that every bank running a cloud AI has to answer to.",
      "DORA, Article 28(8): every financial entity must hold a transition plan to remove its ICT services from its provider — and reincorporate them in-house.",
    ],
  },
  {
    n: 2,
    label: "A SLIDE — the punchline",
    narration: [
      "Ask a bank what that plan looks like. You'll get a PowerPoint.",
      "(beat)",
      "We built the artifact instead.",
    ],
  },
  {
    n: 3,
    label: "EXITPLAN — the box",
    narration: [
      "This is ExitPlan. A financial-crime triage agent for EU banks that runs entirely on this box — no cloud, no API keys, nothing leaves the room.",
    ],
  },
  {
    n: 4,
    label: "MONDAY — the queue",
    narration: [
      "This is a compliance analyst's Monday. Two hundred alerts. Ninety-nine percent of them are noise, and every one of them takes half an hour by hand.",
    ],
  },
  {
    n: 5,
    label: "RULES — the screener (build)",
    build: true,
    narration: [
      "One opens. Notice what found it: a rule. A deterministic screener owns the queue — the model never invents an alert, and it can't make one disappear.",
    ],
  },
  {
    n: 6,
    label: "CITED — the draft",
    narration: [
      "Then the agent drafts the disposition. Every sentence carries its source — the customer file, the policy paragraph, the regulation — down to the exact span.",
      "If the evidence isn't there, it says so and escalates. It never fills a gap.",
    ],
  },
  {
    n: 7,
    label: "OVERRULED — the red flag (build)",
    build: true,
    narration: [
      "And when a hard rule disagrees with the model — the rule wins. The model never overrules the rules.",
    ],
  },
  {
    n: 8,
    label: "DECIDE — the human",
    narration: [
      "The agent drafts. A human decides, and a human files.",
      "That's Anti-Money-Laundering Regulation, Article 18(3) — the decision legally cannot be outsourced. Not to a vendor, not to a model.",
      "Our architecture isn't cautious. It's literal.",
    ],
  },
  {
    n: 9,
    label: "UNPLUGGED — the cable",
    narration: [
      "Now the part every other AI product dreads.",
      "(pull the cable)",
      "No cloud, no fallback, no degraded mode — the next alert drafts exactly like the last one.",
      "(beat — slowest sentence in the deck:)",
      "That's the exit plan — executing.",
    ],
  },
  {
    n: 10,
    label: "INSIDE — the spec sheet",
    narration: [
      "Under the hood: the full event stack — OpenClaw orchestrating, NemoClaw auditing every step into an append-only ledger, OpenShell sandboxing execution, MongoDB holding the evidence and the vectors. All of it on the box you just watched go dark.",
    ],
  },
  {
    n: 11,
    label: "150,000 — the market",
    narration: [
      "And this isn't a hobbyist's constraint. Finanz Informatik runs a hundred and fifty thousand banking users on models in its own data centers today.",
      "Every EU bank has the Article 28(8) duty. We're what the plan looks like when it's real.",
    ],
  },
  {
    n: 12,
    label: "Close",
    narration: ["ExitPlan. The artifact, not the slide.", "(stop talking)"],
  },
];

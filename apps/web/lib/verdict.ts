import type { Decision } from "./dora";
import type { Tone } from "./format";

/** How a verdict reads to a reviewer, and how it is coloured. */
export function decisionTone(d: Decision | null): Tone {
  if (d === "reject") return "flag";
  if (d === "escalate") return "watch";
  return "clear";
}

export function decisionLabel(d: Decision | null) {
  if (d === "reject") return "Not compliant";
  if (d === "escalate") return "Gaps to close";
  if (d === "approve") return "Compliant";
  return "Not yet read";
}

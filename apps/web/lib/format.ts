export const COUNTRY_NAMES: Record<string, string> = {
  DE: "Germany",
  FR: "France",
  NL: "Netherlands",
  IT: "Italy",
  ES: "Spain",
  AT: "Austria",
  BE: "Belgium",
  IE: "Ireland",
  PL: "Poland",
  IR: "Iran",
  CY: "Cyprus",
  TR: "Turkey",
  SY: "Syria",
  KP: "North Korea",
  CU: "Cuba",
};

export const HIGH_RISK_COUNTRIES = new Set(["IR", "KP", "SY", "CU"]);

export function countryName(code: string) {
  return COUNTRY_NAMES[code] ?? code;
}

export function euros(amount: number) {
  return `€${Math.round(amount).toLocaleString("en-GB")}`;
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function cleanKyc(text: string) {
  return text.replace(/^Synthetic KYC\.\s*/i, "").trim();
}

export function caseHeadline(ruleId: string, fallback: string) {
  if (fallback && !/score |fuzzy-match|screener|synthetic/i.test(fallback)) {
    if (
      fallback.length < 80 &&
      !fallback.toLowerCase().startsWith("the legal") &&
      !fallback.toLowerCase().startsWith("a payment") &&
      !fallback.toLowerCase().startsWith("this name") &&
      !fallback.toLowerCase().startsWith("this customer")
    ) {
      return fallback;
    }
  }
  switch (ruleId) {
    case "RED_FLAG_SANCTIONS":
      return "On the sanctions list";
    case "WATCHLIST_FUZZY":
      return "Name similar to a sanctioned person";
    case "WATCHLIST_WEAK":
      return "Possible name match — likely a different person";
    case "HIGH_RISK_CORRIDOR":
      return "Large payment to a high-risk country";
    case "STRUCTURING":
      return "Several payments just under €10,000";
    default:
      return fallback;
  }
}

/** Short chip label for the rule that opened the case. */
export function ruleLabel(ruleId: string) {
  switch (ruleId) {
    case "RED_FLAG_SANCTIONS":
      return "Sanctions list";
    case "WATCHLIST_FUZZY":
      return "Name match";
    case "WATCHLIST_WEAK":
      return "Weak name match";
    case "HIGH_RISK_CORRIDOR":
      return "Country risk";
    case "STRUCTURING":
      return "Threshold pattern";
    default:
      return "Monitoring rule";
  }
}

/** What the rule actually measured, in one line an outsider can read. */
export function ruleMechanic(ruleId: string) {
  switch (ruleId) {
    case "RED_FLAG_SANCTIONS":
      return "Account name compared letter-by-letter against the sanctions list.";
    case "WATCHLIST_FUZZY":
      return "Account name scored against the sanctions list; above the review threshold.";
    case "WATCHLIST_WEAK":
      return "Account name scored against the sanctions list; below the review threshold.";
    case "HIGH_RISK_CORRIDOR":
      return "Outgoing payment over €25,000 to a jurisdiction on the high-risk list.";
    case "STRUCTURING":
      return "Three or more payments between €9,000 and €9,999 in a short window.";
    default:
      return "Deterministic monitoring rule.";
  }
}

export type Tone = "flag" | "watch" | "clear";

export function severityTone(severity: string): Tone {
  if (severity === "red_flag") return "flag";
  if (severity === "review") return "watch";
  return "clear";
}

export function severityLabel(severity: string) {
  if (severity === "red_flag") return "Red flag";
  if (severity === "review") return "Needs review";
  return "Likely false alert";
}

export function decisionLabel(decision: string | null, severity: string) {
  if (decision === "close_noise") return "Dismissed";
  if (decision === "escalate") return "Referred to MLRO";
  if (decision === "file_sar") return "SAR submitted";
  return severityLabel(severity);
}

export function decisionShort(decision: string) {
  if (decision === "close_noise") return "Dismissed as false positive";
  if (decision === "escalate") return "Referred to MLRO";
  if (decision === "file_sar") return "SAR submitted to FIU";
  return decision;
}

export function auditActor(agent: string) {
  if (agent === "human") return "Analyst";
  if (agent === "drafter") return "Drafter";
  if (agent === "monitoring" || agent === "screener") return "Monitoring";
  return agent;
}

export function auditAction(action: string) {
  if (action === "raise_alert") return "Alert opened";
  if (action === "draft") return "Disposition drafted";
  if (action === "decide") return "Decision recorded";
  if (action === "file") return "SAR submitted";
  return action;
}

export function auditTone(agent: string): Tone {
  if (agent === "human") return "flag";
  if (agent === "drafter") return "watch";
  return "clear";
}

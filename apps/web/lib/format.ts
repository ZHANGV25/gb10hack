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

export const PIPELINE = [
  {
    id: "activity",
    n: 1,
    title: "Customer activity",
    summary: "Account details and payments arrive from core banking.",
    actor: "Bank systems",
    countKey: "customers" as const,
  },
  {
    id: "rules",
    n: 2,
    title: "Monitoring rules",
    summary:
      "Sanctions names, payments just under €10,000, and high-risk countries. The language model does not run this step.",
    actor: "Rules — not the model",
    countKey: "alerts" as const,
  },
  {
    id: "alert",
    n: 3,
    title: "Alert opened",
    summary: "A case is created for an analyst. The model cannot invent an alert.",
    actor: "Queue",
    countKey: "alerts" as const,
  },
  {
    id: "draft",
    n: 4,
    title: "Disposition draft",
    summary:
      "Related policy is retrieved and a memo is written. This cannot close or file the case.",
    actor: "Assisted drafting",
    countKey: "drafts" as const,
  },
  {
    id: "decide",
    n: 5,
    title: "Analyst decision",
    summary: "Dismiss, refer to the MLRO, or submit a SAR to the FIU.",
    actor: "Human only",
    countKey: "decided" as const,
  },
  {
    id: "audit",
    n: 6,
    title: "Activity log",
    summary: "Every alert, draft, and decision is kept for audit.",
    actor: "Ledger",
    countKey: "audit" as const,
  },
] as const;

export type StageId = (typeof PIPELINE)[number]["id"];

export type PipelineCounts = {
  customers: number;
  alerts: number;
  drafts: number;
  decided: number;
  audit: number;
};

export function completedStages(current: StageId): StageId[] {
  const order = PIPELINE.map((s) => s.id);
  const idx = order.indexOf(current);
  return order.slice(0, Math.max(idx, 0));
}

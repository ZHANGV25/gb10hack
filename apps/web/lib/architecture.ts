/**
 * Single source of truth for the case pipeline. The queue strip, the case
 * strip and the /system diagram all read this.
 */
export const PIPELINE = [
  {
    id: "activity",
    n: 1,
    title: "Customer activity",
    short: "Activity",
    summary: "Account details and payments arrive from core banking.",
    actor: "Bank systems",
    tech: "MongoDB · customers, transactions",
    countKey: "customers" as const,
    countLabel: "customer records",
  },
  {
    id: "rules",
    n: 2,
    title: "Monitoring rules",
    short: "Rules",
    summary:
      "Sanctions names, payments just under €10,000, and high-risk countries. The language model does not run this step and cannot open a case.",
    actor: "Rules — not the model",
    tech: "Deterministic screener",
    countKey: "alerts" as const,
    countLabel: "alerts opened by rules",
  },
  {
    id: "alert",
    n: 3,
    title: "Alert opened",
    short: "Alert",
    summary:
      "A case lands in the queue with the rule that fired and the evidence behind it.",
    actor: "Queue",
    tech: "MongoDB · alerts",
    countKey: "alerts" as const,
    countLabel: "cases in the queue",
  },
  {
    id: "retrieve",
    n: 4,
    title: "Policy retrieval",
    short: "Retrieval",
    summary:
      "The case is turned into a vector and matched against bank policy and EU rules, so the draft can only cite text that exists.",
    actor: "Vector search",
    tech: "MongoDB $vectorSearch · 1024-dim",
    countKey: "corpus" as const,
    countLabel: "policy passages indexed",
  },
  {
    id: "draft",
    n: 5,
    title: "Disposition draft",
    short: "Draft",
    summary:
      "A memo is written from the retrieved policy. It cannot dismiss, escalate or file anything.",
    actor: "Assisted drafting",
    tech: "Local language model",
    countKey: "drafts" as const,
    countLabel: "dispositions on file",
  },
  {
    id: "decide",
    n: 6,
    title: "Analyst decision",
    short: "Decision",
    summary:
      "Dismiss as a false positive, refer to the MLRO, or submit a SAR to the FIU. Humans only.",
    actor: "Human only",
    tech: "Red-flag gate enforced server-side",
    countKey: "decided" as const,
    countLabel: "analyst decisions",
  },
  {
    id: "audit",
    n: 7,
    title: "Activity log",
    short: "Audit",
    summary:
      "Every alert, draft and decision is appended with its actor and reason.",
    actor: "Ledger",
    tech: "MongoDB · audit_log, append-only",
    countKey: "audit" as const,
    countLabel: "activity events",
  },
] as const;

export type StageId = (typeof PIPELINE)[number]["id"];

/** Stages shown on a case: the part an analyst actually walks through. */
export const CASE_STAGES: StageId[] = ["alert", "retrieve", "draft", "decide"];

export type PipelineCounts = {
  customers: number;
  alerts: number;
  corpus: number;
  drafts: number;
  decided: number;
  audit: number;
};

export function completedStages(current: StageId): StageId[] {
  const order = PIPELINE.map((s) => s.id);
  const idx = order.indexOf(current);
  return order.slice(0, Math.max(idx, 0));
}

export function countFor(
  key: keyof PipelineCounts,
  counts: PipelineCounts,
): number {
  return counts[key] ?? 0;
}

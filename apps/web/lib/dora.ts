import { db } from "./mongo";

/** The ICT third-party register lives in its own database. */
export const DORA_DB = process.env.DORA_DB ?? "covenant";

const doraDb = () => db(DORA_DB);

/** Aggregation results are shaped by the pipeline, not by a collection schema. */
type Row = Record<string, unknown>;

const str = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const num = (v: unknown, fallback = 0) => (v == null ? fallback : Number(v));
const iso = (v: unknown) =>
  v ? new Date(v as string | number | Date).toISOString() : null;


export type Decision = "approve" | "escalate" | "reject";

export type Gap = {
  provision: string;
  article: string;
  label: string;
  status: "absent" | "inadequate";
  severity: "blocking" | "material";
  quote: string | null;
  section: string | null;
};

export type RegisterRow = {
  ref: string;
  vendor: string;
  service: string;
  function: string;
  critical: boolean;
  annualValueEur: number;
  governingLaw: string;
  dataLocations: string;
  status: string;
  decision: Decision | null;
  decisionBeforeMemory: Decision | null;
  changedByMemory: boolean;
  gaps: Gap[];
  blockingGaps: string[];
  presentCount: number;
  requiredCount: number;
  exposureEur: number;
  reviewedAt: string | null;
  /** Set when the contract is a real filing rather than the curated book. */
  source: string | null;
  sourceUrl: string | null;
  sourceForm: string | null;
  chars: number;
  readMode: string | null;
  passagesRead: number;
};

/**
 * The register, each arrangement joined to its most recent verdict.
 *
 * The join is a correlated $lookup rather than a second round trip, and the
 * verdict's embedding and full clause extraction are projected away before
 * anything crosses the wire — those are large and the list does not need them.
 */
export async function listRegister(): Promise<RegisterRow[]> {
  const database = await doraDb();
  const rows = await database
    .collection("contracts")
    .aggregate([
      {
        $lookup: {
          from: "verdicts",
          let: { ref: "$ref" },
          pipeline: [
            { $match: { $expr: { $eq: ["$ref", "$$ref"] } } },
            { $sort: { created_at: -1 } },
            { $limit: 1 },
            { $project: { embedding: 0, provisions: 0, candidate_rules: 0 } },
          ],
          as: "verdict",
        },
      },
      { $unwind: { path: "$verdict", preserveNullAndEmptyArrays: true } },
      { $project: { embedding: 0, text: 0, ground_truth: 0 } },
      { $sort: { critical: -1, annual_value_eur: -1 } },
    ])
    .toArray();

  return rows.map((d: Row) => {
    const v = (d.verdict ?? {}) as Row;
    return {
      ref: String(d.ref),
      vendor: String(d.vendor ?? ""),
      service: String(d.service ?? ""),
      function: String(d.function ?? ""),
      critical: Boolean(d.critical),
      annualValueEur: Number(d.annual_value_eur ?? 0),
      governingLaw: String(d.governing_law ?? ""),
      dataLocations: String(d.data_locations ?? ""),
      status: String(d.status ?? "pending"),
      decision: (v.decision as Decision) ?? null,
      decisionBeforeMemory: (v.decision_before_memory as Decision) ?? null,
      changedByMemory: Boolean(v.decision_changed_by_memory),
      gaps: (Array.isArray(v.gaps) ? v.gaps : []) as Gap[],
      blockingGaps: Array.isArray(v.blocking_gaps)
        ? v.blocking_gaps.map(String)
        : [],
      presentCount: Number(v.present_count ?? 0),
      requiredCount: Number(v.required_count ?? 0),
      exposureEur: Number(v.exposure_eur ?? 0),
      reviewedAt: iso(v.created_at),
      source: d.source ? str(d.source) : null,
      sourceUrl: d.source_url ? str(d.source_url) : null,
      sourceForm: d.source_form ? str(d.source_form) : null,
      chars: num(d.chars),
      readMode: (v.reading as Row | undefined)?.mode
        ? str((v.reading as Row).mode)
        : null,
      passagesRead: Array.isArray((v.reading as Row | undefined)?.passages)
        ? ((v.reading as Row).passages as unknown[]).length
        : 0,
    };
  });
}

/**
 * Which DORA provisions the estate is weakest on.
 *
 * Aggregated across the latest verdicts rather than counted in the app, so it
 * stays correct as the register grows.
 */
export async function gapFrequency() {
  const database = await doraDb();
  const rows = await database
    .collection("verdicts")
    .aggregate([
      { $sort: { created_at: -1 } },
      { $group: { _id: "$ref", latest: { $first: "$$ROOT" } } },
      { $unwind: "$latest.gaps" },
      {
        $group: {
          _id: {
            provision: "$latest.gaps.provision",
            article: "$latest.gaps.article",
            label: "$latest.gaps.label",
            severity: "$latest.gaps.severity",
          },
          contracts: { $sum: 1 },
          value: { $sum: "$latest.annual_value_eur" },
        },
      },
      { $sort: { contracts: -1, value: -1 } },
    ])
    .toArray();
  return rows.map((r: Row) => {
    const id = (r._id ?? {}) as Row;
    return {
      provision: str(id.provision),
      article: str(id.article),
      label: str(id.label),
      severity: str(id.severity) as "blocking" | "material",
      contracts: num(r.contracts),
      valueEur: num(r.value),
    };
  });
}

export async function getReview(ref: string) {
  const database = await doraDb();
  const contract = await database
    .collection("contracts")
    .findOne({ ref }, { projection: { embedding: 0 } });
  if (!contract) return null;
  const verdict = await database
    .collection("verdicts")
    .findOne({ ref }, { sort: { created_at: -1 }, projection: { embedding: 0 } });
  const history = await database
    .collection("verdicts")
    .find(
      { ref },
      {
        sort: { created_at: -1 },
        limit: 8,
        projection: {
          embedding: 0,
          provisions: 0,
          gaps: 0,
          candidate_rules: 0,
        },
      },
    )
    .toArray();
  return { contract, verdict, history };
}

export async function listMemory() {
  const database = await doraDb();
  const rules = await database
    .collection("rules")
    .find({}, { projection: { embedding: 0 }, sort: { created_at: -1 } })
    .toArray();
  // How often each rule actually changed a verdict, straight from the verdicts.
  const usage = await database
    .collection("verdicts")
    .aggregate([
      { $sort: { created_at: -1 } },
      { $group: { _id: "$ref", latest: { $first: "$$ROOT" } } },
      { $unwind: "$latest.applied_rule_ids" },
      { $group: { _id: "$latest.applied_rule_ids", contracts: { $sum: 1 } } },
    ])
    .toArray();
  const applied = new Map(
    usage.map((u: Row) => [String(u._id), Number(u.contracts)]),
  );
  return rules.map((r: Row) => ({
    id: String(r._id),
    text: String(r.text ?? ""),
    action: String(r.action ?? ""),
    provision: r.provision ? String(r.provision) : null,
    active: r.active !== false,
    author: String(r.author ?? "Third-Party Risk"),
    source: String(r.source ?? "analyst_review"),
    learnedFrom: r.learned_from ? String(r.learned_from) : null,
    createdAt: iso(r.created_at),
    appliedTo: applied.get(String(r._id)) ?? 0,
  }));
}

export async function listActivity(limit = 60) {
  const database = await doraDb();
  return database
    .collection("runs")
    .find({}, { sort: { started_at: -1 }, limit })
    .toArray();
}

export async function registerSummary() {
  const rows = await listRegister();
  const reviewed = rows.filter((r) => r.decision);
  const sum = (f: (r: RegisterRow) => number) => rows.reduce((a, r) => a + f(r), 0);
  return {
    contracts: rows.length,
    critical: rows.filter((r) => r.critical).length,
    reviewed: reviewed.length,
    pending: rows.length - reviewed.length,
    approve: rows.filter((r) => r.decision === "approve").length,
    escalate: rows.filter((r) => r.decision === "escalate").length,
    reject: rows.filter((r) => r.decision === "reject").length,
    annualValueEur: sum((r) => r.annualValueEur),
    exposureEur: sum((r) => r.exposureEur),
    gapCount: sum((r) => r.gaps.length),
    blockingCount: sum((r) => r.blockingGaps.length),
    changedByMemory: rows.filter((r) => r.changedByMemory).length,
  };
}

/** Live counts for the architecture diagram. */
export async function systemCounts() {
  const database = await doraDb();
  const [contracts, critical, verdicts, rules, runs, corrections] =
    await Promise.all([
      database.collection("contracts").countDocuments(),
      database.collection("contracts").countDocuments({ critical: true }),
      database.collection("verdicts").countDocuments(),
      database.collection("rules").countDocuments({ active: true }),
      database.collection("runs").countDocuments(),
      database.collection("corrections").countDocuments(),
    ]);
  const summary = await registerSummary();
  return {
    contracts,
    critical,
    reviewed: summary.reviewed,
    verdicts,
    rules,
    runs,
    corrections,
    gaps: summary.gapCount,
  };
}

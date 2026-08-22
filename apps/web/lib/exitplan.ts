import { db } from "./mongo";

export type Severity = "noise" | "review" | "red_flag";

export type AlertRow = {
  alertId: string;
  customerName: string;
  customerId: string;
  ruleId: string;
  reason: string;
  severity: Severity;
  status: string;
  humanDecision: string | null;
  demoRole: string;
};

export async function listAlerts(): Promise<AlertRow[]> {
  const database = await db();
  const docs = await database
    .collection("alerts")
    .find({})
    .sort({ created_at: 1 })
    .toArray();
  return docs.map((d) => ({
    alertId: String(d.alert_id),
    customerName: String(d.customer_name),
    customerId: String(d.customer_id),
    ruleId: String(d.rule_id),
    reason: String(d.reason),
    severity: d.severity as Severity,
    status: String(d.status ?? "open"),
    humanDecision: d.human_decision ? String(d.human_decision) : null,
    demoRole: String(d.demo_role ?? "queue"),
  }));
}

export async function getAlert(alertId: string) {
  const database = await db();
  const alert = await database.collection("alerts").findOne({ alert_id: alertId });
  if (!alert) return null;
  const customer = await database
    .collection("customers")
    .findOne({ customer_id: alert.customer_id }, { projection: { embedding: 0 } });
  const txns = await database
    .collection("transactions")
    .find({ customer_id: alert.customer_id })
    .sort({ ts: -1 })
    .limit(8)
    .toArray();
  const disposition = await database
    .collection("dispositions")
    .findOne({ alert_id: alertId }, { sort: { created_at: -1 } });
  const citations = Array.isArray(disposition?.citations)
    ? disposition.citations
    : [];
  const ids = citations.map((c: { doc_id?: string }) => c.doc_id).filter(Boolean);
  const sources = ids.length
    ? await database
        .collection("corpus")
        .find({ doc_id: { $in: ids } }, { projection: { embedding: 0 } })
        .toArray()
    : [];
  return { alert, customer, txns, disposition, sources };
}

export async function listAudit(limit = 40) {
  const database = await db();
  return database
    .collection("audit_log")
    .find({}, { projection: { output: 0 } })
    .sort({ ts: -1 })
    .limit(limit)
    .toArray();
}

export async function stats() {
  const rows = await listAlerts();
  return {
    total: rows.length,
    noise: rows.filter((r) => r.severity === "noise").length,
    review: rows.filter((r) => r.severity === "review").length,
    redFlag: rows.filter((r) => r.severity === "red_flag").length,
    decided: rows.filter((r) => r.humanDecision).length,
  };
}

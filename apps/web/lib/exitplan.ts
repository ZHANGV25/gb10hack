import { db } from "./mongo";
import { caseHeadline, cleanKyc } from "./format";

export type Severity = "noise" | "review" | "red_flag";

export type AlertRow = {
  alertId: string;
  customerName: string;
  customerId: string;
  occupation: string;
  headline: string;
  story: string;
  ruleId: string;
  reason: string;
  severity: Severity;
  status: string;
  humanDecision: string | null;
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
    occupation: String(d.occupation ?? ""),
    headline: caseHeadline(String(d.rule_id), String(d.headline ?? d.reason ?? "")),
    story: String(d.story ?? ""),
    ruleId: String(d.rule_id),
    reason: String(d.reason),
    severity: d.severity as Severity,
    status: String(d.status ?? "open"),
    humanDecision: d.human_decision ? String(d.human_decision) : null,
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
  const occupation = String(
    alert.occupation ?? customer?.occupation ?? "",
  );
  return {
    alert,
    customer,
    txns,
    disposition,
    sources,
    view: {
      alertId: String(alert.alert_id),
      customerName: String(alert.customer_name),
      occupation,
      city: String(customer?.city ?? ""),
      kyc: cleanKyc(String(customer?.kyc ?? "Customer record on file.")),
      riskSegment: String(customer?.risk_segment ?? ""),
      headline: caseHeadline(
        String(alert.rule_id),
        String(alert.headline ?? alert.reason ?? ""),
      ),
      story: String(alert.story ?? alert.reason ?? ""),
      reason: String(alert.reason),
      ruleId: String(alert.rule_id),
      severity: String(alert.severity),
      redFlag: alert.severity === "red_flag",
      stub: String(disposition?.narrative ?? "No disposition on file yet."),
      currentDecision: disposition?.human_decision
        ? String(disposition.human_decision)
        : null,
      hits: Array.isArray(alert.hits)
        ? alert.hits.map((h: { rule_id?: string; reason?: string; headline?: string }) => ({
            ruleId: String(h.rule_id ?? ""),
            headline: caseHeadline(String(h.rule_id ?? ""), String(h.headline ?? h.reason ?? "")),
            reason: String(h.reason ?? ""),
          }))
        : [],
      txns: txns.map((t) => ({
        id: String(t.txn_id),
        ts: String(t.ts),
        amount: Number(t.amount_eur),
        country: String(t.country),
        counterparty: String(t.counterparty ?? ""),
      })),
      sources: sources.map((s) => ({
        docId: String(s.doc_id),
        title: String(s.title),
        source: String(s.source),
        text: String(s.text),
      })),
    },
  };
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

export async function embedQuery(text: string): Promise<number[]> {
  const model = process.env.EMBED_MODEL ?? "bge-m3";
  const base = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
  const r = await fetch(`${base}/api/embeddings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, prompt: text.slice(0, 4000) }),
  });
  if (!r.ok) throw new Error(`embed failed ${r.status}`);
  const json = (await r.json()) as { embedding?: number[] };
  if (!json.embedding?.length) throw new Error("empty embedding");
  return json.embedding;
}

export async function searchCorpus(query: string, k = 4) {
  const database = await db();
  const queryVector = await embedQuery(query);
  try {
    return await database
      .collection("corpus")
      .aggregate([
        {
          $vectorSearch: {
            index: "corpus_vector",
            path: "embedding",
            queryVector,
            numCandidates: 40,
            limit: k,
          },
        },
        { $addFields: { score: { $meta: "vectorSearchScore" } } },
        { $project: { embedding: 0 } },
      ])
      .toArray();
  } catch {
    return database
      .collection("corpus")
      .find({}, { projection: { embedding: 0 } })
      .limit(k)
      .toArray();
  }
}

export async function stats() {
  const database = await db();
  const rows = await listAlerts();
  const [customers, drafts, audit] = await Promise.all([
    database.collection("customers").countDocuments(),
    database.collection("dispositions").countDocuments(),
    database.collection("audit_log").countDocuments(),
  ]);
  return {
    total: rows.length,
    noise: rows.filter((r) => r.severity === "noise").length,
    review: rows.filter((r) => r.severity === "review").length,
    redFlag: rows.filter((r) => r.severity === "red_flag").length,
    decided: rows.filter((r) => r.humanDecision).length,
    customers,
    drafts,
    audit,
  };
}

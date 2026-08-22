import type { Collection } from "mongodb";

import { db } from "./mongo";
import { caseHeadline, cleanKyc } from "./format";

export type Severity = "noise" | "review" | "red_flag";

export type AlertRow = {
  alertId: string;
  customerName: string;
  customerId: string;
  occupation: string;
  city: string;
  headline: string;
  story: string;
  ruleId: string;
  ruleIds: string[];
  reason: string;
  severity: Severity;
  status: string;
  humanDecision: string | null;
  exposureEur: number;
  largestEur: number;
  txnCount: number;
  openedAt: string | null;
};

type TxnAgg = {
  _id: string;
  total: number;
  largest: number;
  count: number;
};

export async function listAlerts(): Promise<AlertRow[]> {
  const database = await db();
  const [docs, customers, agg] = await Promise.all([
    database.collection("alerts").find({}).sort({ created_at: 1 }).toArray(),
    database
      .collection("customers")
      .find({}, { projection: { embedding: 0 } })
      .toArray(),
    database
      .collection("transactions")
      .aggregate<TxnAgg>([
        {
          $group: {
            _id: "$customer_id",
            total: { $sum: "$amount_eur" },
            largest: { $max: "$amount_eur" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
  ]);

  const byCustomer = new Map(customers.map((c) => [String(c.customer_id), c]));
  const money = new Map(agg.map((a) => [String(a._id), a]));

  return docs.map((d) => {
    const customerId = String(d.customer_id);
    const m = money.get(customerId);
    const hits = Array.isArray(d.hits) ? d.hits : [];
    return {
      alertId: String(d.alert_id),
      customerName: String(d.customer_name),
      customerId,
      occupation: String(d.occupation ?? byCustomer.get(customerId)?.occupation ?? ""),
      city: String(byCustomer.get(customerId)?.city ?? ""),
      headline: caseHeadline(
        String(d.rule_id),
        String(d.headline ?? d.reason ?? ""),
      ),
      story: String(d.story ?? ""),
      ruleId: String(d.rule_id),
      ruleIds: hits.map((h: { rule_id?: string }) => String(h.rule_id ?? "")).filter(Boolean),
      reason: String(d.reason),
      severity: d.severity as Severity,
      status: String(d.status ?? "open"),
      humanDecision: d.human_decision ? String(d.human_decision) : null,
      exposureEur: Number(m?.total ?? 0),
      largestEur: Number(m?.largest ?? 0),
      txnCount: Number(m?.count ?? 0),
      openedAt: d.created_at ? new Date(d.created_at).toISOString() : null,
    };
  });
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
  const occupation = String(alert.occupation ?? customer?.occupation ?? "");
  const hits = Array.isArray(alert.hits) ? alert.hits : [];
  const triggerTxnIds = hits
    .map((h: { txn_id?: string }) => h.txn_id)
    .filter(Boolean)
    .map(String);
  const structuring = hits.some(
    (h: { rule_id?: string }) => h.rule_id === "STRUCTURING",
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
      customerId: String(alert.customer_id),
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
      openedAt: alert.created_at ? new Date(alert.created_at).toISOString() : null,
      stub: String(disposition?.narrative ?? ""),
      currentDecision: disposition?.human_decision
        ? String(disposition.human_decision)
        : null,
      hits: hits.map(
        (h: {
          rule_id?: string;
          reason?: string;
          headline?: string;
          severity?: string;
          score?: number;
        }) => ({
          ruleId: String(h.rule_id ?? ""),
          headline: caseHeadline(
            String(h.rule_id ?? ""),
            String(h.headline ?? h.reason ?? ""),
          ),
          reason: String(h.reason ?? ""),
          severity: String(h.severity ?? ""),
          score: typeof h.score === "number" ? h.score : null,
        }),
      ),
      txns: txns.map((t) => {
        const amount = Number(t.amount_eur);
        return {
          id: String(t.txn_id),
          ts: String(t.ts),
          amount,
          country: String(t.country),
          counterparty: String(t.counterparty ?? ""),
          flagged:
            triggerTxnIds.includes(String(t.txn_id)) ||
            (structuring && amount >= 9000 && amount <= 9999),
        };
      }),
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
  const collection = database.collection("corpus");
  try {
    const queryVector = await embedQuery(query);
    const hits = await collection
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
    if (hits.length) return hits;
    console.warn(
      "[retrieval] vector search returned nothing — check that the corpus embeddings and corpus_vector index share a dimension",
    );
  } catch (err) {
    console.error("[retrieval] vector search failed", err);
  }
  return keywordFallback(collection, query, k);
}

/**
 * A draft must never be written against an empty policy set. If vector search
 * is unavailable or matches nothing, fall back to a keyword scan and then to
 * the head of the corpus.
 */
async function keywordFallback(
  collection: Collection,
  query: string,
  k: number,
) {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9€]+/)
    .filter((w) => w.length > 3)
    .slice(0, 6);
  if (terms.length) {
    const rx = new RegExp(terms.join("|"), "i");
    const matched = await collection
      .find(
        { $or: [{ title: rx }, { text: rx }, { source: rx }] },
        { projection: { embedding: 0 } },
      )
      .limit(k)
      .toArray();
    if (matched.length) return matched;
  }
  return collection
    .find({}, { projection: { embedding: 0 } })
    .limit(k)
    .toArray();
}

export async function stats() {
  const database = await db();
  const rows = await listAlerts();
  const [customers, transactions, corpus, drafts, audit] = await Promise.all([
    database.collection("customers").countDocuments(),
    database.collection("transactions").countDocuments(),
    database.collection("corpus").countDocuments(),
    database.collection("dispositions").countDocuments(),
    database.collection("audit_log").countDocuments(),
  ]);
  return {
    total: rows.length,
    noise: rows.filter((r) => r.severity === "noise").length,
    review: rows.filter((r) => r.severity === "review").length,
    redFlag: rows.filter((r) => r.severity === "red_flag").length,
    decided: rows.filter((r) => r.humanDecision).length,
    filed: rows.filter((r) => r.humanDecision === "file_sar").length,
    escalated: rows.filter((r) => r.humanDecision === "escalate").length,
    dismissed: rows.filter((r) => r.humanDecision === "close_noise").length,
    reviewedValue: rows.reduce((sum, r) => sum + r.exposureEur, 0),
    customers,
    transactions,
    corpus,
    drafts,
    audit,
  };
}

export type SystemStats = Awaited<ReturnType<typeof stats>>;

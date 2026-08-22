import { NextResponse } from "next/server";

import { DORA_DB } from "@/lib/dora";
import { db } from "@/lib/mongo";
import { PROVISION_BY_KEY } from "@/lib/provisions";

/**
 * A reviewer's judgement becomes a rule the agent keeps.
 *
 * This route only writes. It deliberately does not re-run the assessment:
 * the always-on agent is watching the `rules` collection and re-evaluates the
 * whole register itself. That keeps one owner for what a verdict means.
 */

const ACTION: Record<string, string> = {
  reject: "reject",
  escalate: "escalate",
  accept: "accept_exception",
};

const OUTCOME_LABEL: Record<string, string> = {
  reject: "not compliant",
  escalate: "gaps to close",
  accept: "acceptable as written",
};

async function embed(text: string): Promise<number[]> {
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

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { ref, outcome, provision, reason, scope } = body as {
    ref?: string;
    outcome?: string;
    provision?: string;
    reason?: string;
    scope?: "all" | "critical" | "non_critical";
  };

  if (!ref || !outcome || !reason?.trim()) {
    return NextResponse.json(
      { error: "A reference, an outcome and a written reason are required." },
      { status: 400 },
    );
  }
  const action = ACTION[outcome];
  if (!action) {
    return NextResponse.json({ error: "Unknown outcome." }, { status: 400 });
  }
  if (provision && !PROVISION_BY_KEY.has(provision)) {
    return NextResponse.json({ error: "Unknown provision." }, { status: 400 });
  }
  if (reason.trim().length < 15) {
    return NextResponse.json(
      {
        error:
          "Write the reason in a full sentence — it becomes the rule the agent applies to other contracts.",
      },
      { status: 400 },
    );
  }

  const database = await db(DORA_DB);
  const contract = await database.collection("contracts").findOne({ ref });
  if (!contract) {
    return NextResponse.json({ error: "Unknown arrangement." }, { status: 404 });
  }

  const text = reason.trim();
  let embedding: number[];
  try {
    embedding = await embed(text);
  } catch (err) {
    console.error("[review] could not embed the rule", err);
    return NextResponse.json(
      { error: "Could not store the rule — the local embedding model did not respond." },
      { status: 503 },
    );
  }

  const now = new Date();
  const rule = await database.collection("rules").insertOne({
    text,
    action,
    provision: provision ?? null,
    critical_only: scope === "critical",
    non_critical_only: scope === "non_critical",
    active: true,
    source: "analyst_review",
    author: "M. Halvorsen, Third-Party Risk",
    learned_from: ref,
    learned_from_vendor: contract.vendor ?? null,
    embedding,
    created_at: now,
  });

  await database.collection("corrections").insertOne({
    ref,
    vendor: contract.vendor ?? null,
    outcome,
    outcome_label: OUTCOME_LABEL[outcome],
    provision: provision ?? null,
    note: text,
    rule_id: rule.insertedId,
    reviewer: "M. Halvorsen, Third-Party Risk",
    created_at: now,
  });

  return NextResponse.json({
    ok: true,
    ruleId: String(rule.insertedId),
    action,
    provision: provision ?? null,
  });
}

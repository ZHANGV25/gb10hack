import { NextResponse } from "next/server";

import { db } from "@/lib/mongo";

export async function POST(req: Request) {
  const { alertId, decision } = await req.json();
  if (!alertId || !decision) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const database = await db();
  const alert = await database.collection("alerts").findOne({ alert_id: alertId });
  if (!alert) {
    return NextResponse.json({ error: "unknown alert" }, { status: 404 });
  }
  if (alert.severity === "red_flag" && decision === "close_noise") {
    return NextResponse.json(
      { error: "Red-flag gate: cannot close as noise" },
      { status: 409 },
    );
  }
  const RATIONALE: Record<string, string> = {
    close_noise:
      "Analyst dismissed the case as a false positive. No report to the FIU.",
    escalate:
      "Analyst referred the case to the MLRO for a second review.",
    file_sar:
      "Analyst submitted a suspicious activity report to the FIU.",
  };
  const filed = decision === "file_sar";
  const now = new Date();
  await database.collection("dispositions").updateOne(
    { alert_id: alertId },
    {
      $set: {
        human_decision: decision,
        human_actor: "analyst",
        filed,
        decided_at: now,
      },
    },
    { upsert: true },
  );
  await database.collection("alerts").updateOne(
    { alert_id: alertId },
    { $set: { status: filed ? "filed" : "decided", human_decision: decision } },
  );
  await database.collection("audit_log").insertOne({
    agent: "human",
    action: filed ? "file" : "decide",
    alert_id: alertId,
    input_hash: `${alertId}:${decision}`,
    rationale:
      RATIONALE[decision] ??
      "Analyst recorded a decision. Assisted drafting cannot file.",
    decision,
    ts: now,
  });
  return NextResponse.json({ ok: true, decision, filed });
}

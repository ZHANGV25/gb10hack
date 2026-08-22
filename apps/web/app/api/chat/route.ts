import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

import { getAlert, searchCorpus } from "@/lib/exitplan";
import { db } from "@/lib/mongo";
import { judgeModel, ollama } from "@/lib/ollama";

export const maxDuration = 300;

/** The exact text the "Generate disposition" button sends. Keep in sync with case-ai.tsx. */
const DRAFT_REQUEST =
  "Write a short disposition memo for this case. Call retrievePolicy first. Cite source titles in brackets. Do not decide or file.";

export async function POST(req: Request) {
  const { messages, alertId }: { messages: UIMessage[]; alertId?: string } =
    await req.json();
  const data = alertId ? await getAlert(alertId) : null;
  const payments = data?.view.txns
    .map(
      (t) =>
        `${t.ts.slice(0, 10)} | ${t.counterparty} | EUR ${Math.round(t.amount)} | ${t.country}`,
    )
    .join("\n");
  const ruleHits = data?.view.hits
    .map(
      (h) =>
        `${h.ruleId} (${h.severity})${
          typeof h.score === "number" ? ` score ${h.score.toFixed(2)}` : ""
        }: ${h.reason}`,
    )
    .join("\n");

  // Only the canned draft request is persisted as the case disposition;
  // follow-up questions are conversation, not the memo on file.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastText = lastUser?.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
  const isDraftRequest = lastText === DRAFT_REQUEST;
  const retrieved: { doc_id: string; title: string; source: string }[] = [];

  const result = streamText({
    model: ollama(judgeModel),
    system: [
      "You are the drafting assistant for Nordhafen Bank financial-crime operations.",
      "Write like an internal bank memo: name the customer, state what happened in plain language, and cite policy titles in brackets.",
      "You never decide a case and never file a SAR. A human analyst must take those actions.",
      "Always call retrievePolicy first. Only cite spans it returns. If evidence is thin, recommend abstention and MLRO referral.",
      "Do not invent transactions or watchlist hits. Monitoring has already determined that an alert exists.",
      "The only rule scores are the ones given below under 'Rules that fired'. The numbers beside retrieved policy passages are search-relevance scores — never quote them as case evidence.",
      `Today is ${new Date().toISOString().slice(0, 10)}. Use that date if the memo needs one; never invent a different date.`,
      data
        ? [
            `Customer ${data.view.customerName} (${data.view.occupation}, ${data.view.city}).`,
            data.view.story,
            `Alert ${data.view.alertId}: ${data.view.headline}. ${data.view.reason}`,
            ruleHits ? `Rules that fired:\n${ruleHits}` : "",
            payments ? `Payments:\n${payments}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "No case loaded.",
    ].join("\n"),
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(4),
    onEnd: async ({ text }) => {
      if (!alertId || !isDraftRequest) return;
      const narrative = text?.trim();
      if (!narrative) return;
      const citations = [
        ...new Map(retrieved.map((c) => [c.doc_id, c])).values(),
      ];
      try {
        const database = await db();
        const now = new Date();
        await database.collection("dispositions").updateOne(
          { alert_id: alertId },
          {
            $set: {
              narrative,
              citations,
              drafted_at: now,
              drafted_by: "drafter",
            },
          },
          { upsert: true },
        );
        await database.collection("audit_log").insertOne({
          agent: "drafter",
          action: "draft",
          alert_id: alertId,
          rationale:
            `Disposition drafted from ${citations.length} retrieved policy ` +
            "passages. No decision taken.",
          ts: now,
        });
      } catch (err) {
        console.error("[draft] could not save the disposition", err);
      }
    },
    tools: {
      retrievePolicy: tool({
        description: "Search bank policy and EU rules related to this case.",
        inputSchema: z.object({
          query: z.string().describe("What to retrieve, e.g. watchlist red flag"),
        }),
        execute: async ({ query }) => {
          const hits = await searchCorpus(query, 4);
          for (const h of hits) {
            retrieved.push({
              doc_id: String(h.doc_id),
              title: String(h.title),
              source: String(h.source),
            });
          }
          return hits.map((h) => ({
            doc_id: h.doc_id,
            title: h.title,
            source: h.source,
            text: h.text,
            score: h.score,
          }));
        },
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

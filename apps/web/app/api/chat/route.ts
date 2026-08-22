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
import { judgeModel, ollama } from "@/lib/ollama";

export const maxDuration = 300;

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

  const result = streamText({
    model: ollama(judgeModel),
    system: [
      "You are the drafting assistant for Nordhafen Bank financial-crime operations.",
      "Write like an internal bank memo: name the customer, state what happened in plain language, and cite policy titles in brackets.",
      "You never decide a case and never file a SAR. A human analyst must take those actions.",
      "Always call retrievePolicy first. Only cite spans it returns. If evidence is thin, recommend abstention and MLRO referral.",
      "Do not invent transactions or watchlist hits. Monitoring has already determined that an alert exists.",
      data
        ? [
            `Customer ${data.view.customerName} (${data.view.occupation}, ${data.view.city}).`,
            data.view.story,
            `Alert ${data.view.alertId}: ${data.view.headline}. ${data.view.reason}`,
            payments ? `Payments:\n${payments}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "No case loaded.",
    ].join("\n"),
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(4),
    tools: {
      retrievePolicy: tool({
        description: "Search bank policy and EU rules related to this case.",
        inputSchema: z.object({
          query: z.string().describe("What to retrieve, e.g. watchlist red flag"),
        }),
        execute: async ({ query }) => {
          const hits = await searchCorpus(query, 4);
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

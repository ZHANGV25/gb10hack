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

  const result = streamText({
    model: ollama(judgeModel),
    system: [
      "You are the on-prem drafting model for a bank financial-crime desk.",
      "You run on this GB10 via Ollama. You never decide and never file a SAR.",
      "Always call retrievePolicy first. Only cite spans it returns. If evidence is thin, say abstain and escalate.",
      "Do not invent transactions or watchlist hits. The screener already decided the alert exists.",
      data
        ? `Case ${data.alert.alert_id}. Customer ${data.alert.customer_name}. Rule ${data.alert.rule_id}. ${data.alert.reason}. Severity ${data.alert.severity}.`
        : "No case loaded.",
    ].join("\n"),
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(4),
    tools: {
      retrievePolicy: tool({
        description:
          "Atlas Local vector search over DORA, AMLR, and internal policy chunks.",
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

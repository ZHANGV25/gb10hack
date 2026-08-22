import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

import { getAlert } from "@/lib/exitplan";
import { judgeModel, ollama } from "@/lib/ollama";

export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages, alertId }: { messages: UIMessage[]; alertId?: string } =
    await req.json();
  const data = alertId ? await getAlert(alertId) : null;
  const sources = (data?.sources ?? [])
    .map((s) => `${s.title}: ${s.text}`)
    .join("\n\n");

  const result = streamText({
    model: ollama(judgeModel),
    system: [
      "You are ExitPlan. You draft AML dispositions. You never decide and never file.",
      "Only use the source spans below. If evidence is thin, abstain and escalate.",
      "Do not invent offences. Do not compute. Cite source titles in brackets.",
      sources || "No corpus spans retrieved.",
      data
        ? `Alert ${data.alert.alert_id}. Screener: ${data.alert.rule_id}. ${data.alert.reason}. Severity ${data.alert.severity}.`
        : "",
    ].join("\n"),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}

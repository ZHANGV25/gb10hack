"use client";

import { DefaultChatTransport, isToolUIPart } from "ai";
import { useChat } from "@ai-sdk/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DRAFT_PROMPT =
  "Write a short disposition memo for this case. Call retrievePolicy first. Cite source titles in brackets. Do not decide or file.";

export function CaseAi({
  alertId,
  stub,
}: {
  alertId: string;
  stub: string;
}) {
  const [input, setInput] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { alertId },
      }),
    [alertId],
  );
  const { messages, sendMessage, status } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const live = messages.length > 0;

  return (
    <section className="rounded-2xl border border-border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">On-box model</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Nemotron 3 Nano 30B via Ollama on this GB10. It can pull policy
            with Atlas vector search. It cannot dismiss or submit a SAR.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 font-mono text-[11px]">
          nemotron-3-nano:30b
        </span>
      </div>

      {!live ? (
        <div className="mt-4 rounded-xl bg-muted/60 p-4">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
            Placeholder memo · not the GPU
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{stub}</p>
        </div>
      ) : null}

      <div className="mt-4 space-y-3 text-sm leading-6">
        {messages.map((message) => (
          <div key={message.id}>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
              {message.role === "user" ? "You" : "Nemotron · local"}
            </p>
            {message.parts.map((part, i) => {
              if (part.type === "text" && part.text) {
                return (
                  <p key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                    {part.text}
                  </p>
                );
              }
              if (isToolUIPart(part) && part.type === "tool-retrievePolicy") {
                const rows =
                  part.state === "output-available" && Array.isArray(part.output)
                    ? part.output
                    : [];
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="my-2 rounded-xl bg-muted px-3 py-2 text-xs"
                  >
                    <p className="font-medium">
                      Atlas $vectorSearch · {part.state}
                    </p>
                    {rows.map((row: { title?: string; score?: number }) => (
                      <p key={String(row.title)} className="text-muted-foreground">
                        {String(row.title)}
                        {typeof row.score === "number"
                          ? ` · ${row.score.toFixed(3)}`
                          : ""}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
        {busy ? (
          <p className="text-xs text-muted-foreground">
            Running on the GB10 GPU — first tokens can take a few seconds.
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          className="rounded-full px-4"
          disabled={busy}
          onClick={() => sendMessage({ text: DRAFT_PROMPT })}
        >
          {busy ? "Generating…" : "Run Nemotron on this case"}
        </Button>
      </div>

      {live ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || busy) return;
            sendMessage({ text: input });
            setInput("");
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask why this fired, or what the policy says"
            disabled={busy}
          />
          <Button type="submit" variant="outline" className="rounded-full" disabled={busy}>
            Ask
          </Button>
        </form>
      ) : null}
    </section>
  );
}

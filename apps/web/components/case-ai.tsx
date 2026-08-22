"use client";

import { DefaultChatTransport, isToolUIPart } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DRAFT_PROMPT =
  "Write a short disposition memo for this case. Call retrievePolicy first. Cite source titles in brackets. Do not decide or file.";

function toolState(state: string) {
  if (state === "output-available") return "Policy retrieved";
  if (state === "input-available" || state === "input-streaming") {
    return "Searching policy library";
  }
  return "Policy lookup";
}

export function CaseAi({
  alertId,
  stub,
  onStatus,
}: {
  alertId: string;
  stub: string;
  onStatus?: (status: "idle" | "drafting" | "done") => void;
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
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;

  useEffect(() => {
    if (busy) onStatusRef.current?.("drafting");
    else if (live) onStatusRef.current?.("done");
    else onStatusRef.current?.("idle");
  }, [busy, live]);

  return (
    <section className="rounded-2xl border border-border p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Disposition</h2>
          <p className="mt-2 max-w-xl text-base leading-7 text-muted-foreground">
            Assisted drafting against current policy. This is not a decision
            and not a SAR filing.
          </p>
        </div>
      </div>

      {!live ? (
        <div className="mt-5 rounded-2xl bg-muted/70 p-5">
          <p className="text-sm tracking-wide text-muted-foreground uppercase">
            Last saved draft
          </p>
          <p className="mt-3 text-lg leading-8">{stub}</p>
        </div>
      ) : null}

      <div className="mt-5 space-y-4 text-lg leading-8">
        {messages.map((message) => (
          <div key={message.id}>
            <p className="text-sm tracking-wide text-muted-foreground uppercase">
              {message.role === "user" ? "Analyst" : "Drafter"}
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
                    className="my-3 rounded-2xl bg-muted px-4 py-3 text-base"
                  >
                    <p className="font-medium">{toolState(part.state)}</p>
                    {rows.map((row: { title?: string; score?: number }) => (
                      <p key={String(row.title)} className="text-muted-foreground">
                        {String(row.title)}
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
          <p className="text-base text-muted-foreground">
            Generating disposition…
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <Button
          className="h-12 rounded-full px-6 text-base"
          disabled={busy}
          onClick={() => sendMessage({ text: DRAFT_PROMPT })}
        >
          {busy ? "Generating…" : "Generate disposition"}
        </Button>
      </div>

      {live ? (
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
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
            placeholder="Ask about this case or the applicable policy"
            disabled={busy}
            className="h-12 rounded-full px-5 text-base md:text-base"
          />
          <Button
            type="submit"
            variant="outline"
            className="h-12 rounded-full px-6 text-base"
            disabled={busy}
          >
            Send
          </Button>
        </form>
      ) : null}
    </section>
  );
}

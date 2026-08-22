"use client";

import { DefaultChatTransport, isToolUIPart } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MemoText } from "@/components/memo-text";
import { Eyebrow } from "@/components/pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type DraftPhase = "idle" | "retrieving" | "drafting" | "done";

const DRAFT_PROMPT =
  "Write a short disposition memo for this case. Call retrievePolicy first. Cite source titles in brackets. Do not decide or file.";

const SUGGESTIONS = [
  { label: "Can you file this SAR for me?", text: "Can you file this SAR for me?" },
  {
    label: "What would change your recommendation?",
    text: "What additional evidence would change your recommendation on this case?",
  },
  {
    label: "Quote the policy you relied on",
    text: "Quote the exact policy text you relied on, with its source.",
  },
];

export function CaseAi({
  alertId,
  stub,
  customerName,
  onPhase,
}: {
  alertId: string;
  stub: string;
  customerName: string;
  onPhase?: (phase: DraftPhase) => void;
}) {
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const startedRef = useRef(0);
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

  // Where the model is right now: before the policy lookup, inside it, or
  // writing from what came back.
  const step = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last) return "start" as const;
    let seen: "none" | "open" | "done" = "none";
    for (const part of last.parts) {
      if (isToolUIPart(part) && part.type === "tool-retrievePolicy") {
        seen =
          part.state === "output-available" || part.state === "output-error"
            ? "done"
            : "open";
      }
    }
    if (seen === "done") return "writing" as const;
    if (seen === "open") return "searching" as const;
    return last.role === "assistant" ? "writing" : ("start" as const);
  }, [messages]);

  const firstTurn = messages.length <= 2;
  const busyLabel = !firstTurn
    ? "Answering"
    : step === "searching"
      ? "Matching policy"
      : step === "writing"
        ? "Writing the memo"
        : "Reading the case";

  const phase: DraftPhase = busy
    ? firstTurn && step !== "writing"
      ? "retrieving"
      : "drafting"
    : live
      ? "done"
      : "idle";

  useEffect(() => {
    onPhase?.(phase);
  }, [phase, onPhase]);

  useEffect(() => {
    if (!busy) return;
    const id = setInterval(
      () => setElapsed(Math.round((Date.now() - startedRef.current) / 1000)),
      400,
    );
    return () => clearInterval(id);
  }, [busy]);

  function ask(text: string) {
    startedRef.current = Date.now();
    setElapsed(0);
    sendMessage({ text });
  }

  return (
    <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <h2 className="text-[12px] font-medium">Disposition draft</h2>
        <span className="text-[11px] text-muted-foreground">
          Drafts only — it cannot decide or file
        </span>
      </div>

      <div className="px-4 py-3">
        {!live ? (
          <>
            <p className="text-[12px] leading-5 text-muted-foreground">
              Retrieves the bank policy and EU articles that apply to{" "}
              {customerName}, then writes a memo that cites them. Nothing about
              this case is sent outside the bank.
            </p>
            {stub ? (
              <div className="mt-3 rounded-md border border-hairline bg-surface-muted/70 px-3 py-2.5">
                <Eyebrow>Last saved draft</Eyebrow>
                <p className="mt-1 text-[13px] leading-[1.6]">{stub}</p>
              </div>
            ) : null}
            <div className="mt-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => ask(DRAFT_PROMPT)}
              >
                Generate disposition
              </Button>
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                Usually 30&ndash;60 seconds on the bank&rsquo;s own hardware
              </p>
            </div>
          </>
        ) : null}

        {live ? (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="ep-in">
                <Eyebrow>
                  {message.role === "user" ? "Analyst" : "Drafting assistant"}
                </Eyebrow>
                {message.parts.map((part, i) => {
                  if (part.type === "text" && part.text) {
                    const canned = part.text === DRAFT_PROMPT;
                    if (canned) {
                      return (
                        <p
                          key={`${message.id}-${i}`}
                          className="mt-1 text-[13px] leading-[1.65] text-muted-foreground italic"
                        >
                          Requested a disposition for this case.
                        </p>
                      );
                    }
                    return (
                      <div key={`${message.id}-${i}`} className="mt-1">
                        <MemoText text={part.text} />
                      </div>
                    );
                  }
                  if (isToolUIPart(part) && part.type === "tool-retrievePolicy") {
                    const done = part.state === "output-available";
                    const rows =
                      done && Array.isArray(part.output) ? part.output : [];
                    const query =
                      part.input &&
                      typeof part.input === "object" &&
                      "query" in part.input
                        ? String((part.input as { query?: string }).query ?? "")
                        : "";
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="my-2 rounded-md border border-hairline bg-surface-muted/60 px-3 py-2"
                      >
                        <p className="flex items-center gap-1.5 text-[11px] font-medium">
                          <span
                            className={`size-1.5 rounded-full ${
                              done ? "bg-emerald-500" : "ep-live bg-watch"
                            }`}
                          />
                          {done
                            ? `Policy library searched — ${rows.length} passages matched`
                            : "Searching the policy library"}
                        </p>
                        {query ? (
                          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                            vector query: {query}
                          </p>
                        ) : null}
                        <ul className="mt-1.5 space-y-0.5">
                          {rows.map(
                            (row: { title?: string; score?: number }) => (
                              <li
                                key={String(row.title)}
                                className="flex items-baseline justify-between gap-3 text-[11px]"
                              >
                                <span className="min-w-0 truncate text-foreground/80">
                                  {String(row.title)}
                                </span>
                                {typeof row.score === "number" ? (
                                  <span className="shrink-0 font-mono text-muted-foreground">
                                    {row.score.toFixed(3)}
                                  </span>
                                ) : null}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {busy ? (
              <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="ep-live size-1.5 rounded-full bg-foreground" />
                {busyLabel} ·{" "}
                <span className="font-mono tabular-nums">{elapsed}s</span>
              </p>
            ) : (
              <p className="rounded-md border border-hairline bg-surface-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
                Draft ready. It is a recommendation only — the case stays open
                until you record a decision below.
              </p>
            )}
          </div>
        ) : null}
      </div>

      {live ? (
        <div className="border-t border-hairline px-4 py-3">
          <div className="mb-2 flex flex-wrap gap-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={busy}
                onClick={() => ask(s.text)}
                className="rounded-full border border-hairline px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground disabled:opacity-40"
              >
                {s.label}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim() || busy) return;
              ask(input);
              setInput("");
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask about this case or the policy"
              disabled={busy}
              className="h-8"
            />
            <Button type="submit" variant="outline" disabled={busy}>
              Ask
            </Button>
          </form>
        </div>
      ) : null}
    </section>
  );
}

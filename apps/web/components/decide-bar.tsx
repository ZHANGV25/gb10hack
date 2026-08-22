"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const ACTIONS = [
  {
    id: "close_noise",
    label: "Dismiss as false positive",
    hint: "No report. Case closed.",
    variant: "outline" as const,
  },
  {
    id: "escalate",
    label: "Send to MLRO",
    hint: "Money-laundering reporting officer reviews it.",
    variant: "outline" as const,
  },
  {
    id: "file_sar",
    label: "Submit SAR to FIU",
    hint: "Suspicious Activity Report — not a computer file.",
    variant: "default" as const,
  },
];

export function DecideBar({
  alertId,
  redFlag,
  current,
}: {
  alertId: string;
  redFlag: boolean;
  current: string | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: string) {
    setError(null);
    setPending(decision);
    const res = await fetch("/api/decide", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ alertId, decision }),
    });
    const body = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setError(body.error ?? "Could not record the decision");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">Your decision</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          There is nothing to attach. These buttons record what{" "}
          <span className="text-foreground">you</span> want done with the case.
          The model cannot click them.
        </p>
      </div>
      <div className="grid gap-2">
        {ACTIONS.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.hint}</p>
            </div>
            <Button
              className="rounded-full px-4"
              size="sm"
              variant={a.variant}
              disabled={
                pending !== null || (redFlag && a.id === "close_noise")
              }
              onClick={() => decide(a.id)}
            >
              {pending === a.id ? "…" : "Record"}
            </Button>
          </div>
        ))}
      </div>
      {redFlag ? (
        <p className="text-sm">
          Exact watchlist match — dismiss is locked. A human still has to send
          it on.
        </p>
      ) : null}
      {current ? (
        <p className="text-sm text-muted-foreground">
          Recorded:{" "}
          {ACTIONS.find((a) => a.id === current)?.label ?? current}
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

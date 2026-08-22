"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const ACTIONS = [
  {
    id: "close_noise",
    label: "Dismiss as false positive",
    hint: "Close with no regulatory report.",
    variant: "outline" as const,
  },
  {
    id: "escalate",
    label: "Refer to MLRO",
    hint: "Money-laundering reporting officer.",
    variant: "outline" as const,
  },
  {
    id: "file_sar",
    label: "Submit SAR to FIU",
    hint: "Suspicious activity report.",
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
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-medium">Record a decision</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Required. Assisted drafting cannot dismiss, escalate, or file.
        </p>
      </div>
      <div className="grid gap-2">
        {ACTIONS.map((a) => {
          const locked = redFlag && a.id === "close_noise";
          return (
            <div key={a.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm">{a.label}</p>
                <p className="text-xs text-muted-foreground">
                  {locked ? "Not permitted on an exact sanctions match." : a.hint}
                </p>
              </div>
              <Button
                className="rounded-full px-3"
                size="sm"
                variant={a.variant}
                disabled={pending !== null || locked}
                onClick={() => decide(a.id)}
              >
                {pending === a.id ? "…" : "Record"}
              </Button>
            </div>
          );
        })}
      </div>
      {current ? (
        <p className="text-xs text-muted-foreground">
          Recorded: {ACTIONS.find((a) => a.id === current)?.label ?? current}
        </p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

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
    hint: "Money-laundering reporting officer reviews next.",
    variant: "outline" as const,
  },
  {
    id: "file_sar",
    label: "Submit SAR to FIU",
    hint: "Suspicious activity report to the financial intelligence unit.",
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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Record a decision</h2>
        <p className="mt-2 text-base leading-7 text-muted-foreground">
          Required. Assisted drafting cannot dismiss, escalate, or file.
        </p>
      </div>
      <div className="grid gap-3">
        {ACTIONS.map((a) => {
          const locked = redFlag && a.id === "close_noise";
          return (
            <Button
              key={a.id}
              className="h-auto min-h-14 justify-start rounded-2xl px-5 py-4 text-left text-base whitespace-normal"
              variant={a.variant}
              disabled={pending !== null || locked}
              onClick={() => decide(a.id)}
            >
              <span className="block">
                <span className="block text-lg font-medium">
                  {pending === a.id ? "Recording…" : a.label}
                </span>
                <span className="mt-1 block font-normal opacity-80">
                  {locked ? "Not permitted on an exact sanctions match." : a.hint}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
      {current ? (
        <p className="text-lg">
          Recorded: {ACTIONS.find((a) => a.id === current)?.label ?? current}
        </p>
      ) : null}
      {error ? <p className="text-base text-destructive">{error}</p> : null}
    </div>
  );
}

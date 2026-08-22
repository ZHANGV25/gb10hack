"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

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
      setError(body.error ?? "Could not record the human decision");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        The agent drafted. Only you can decide or file.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          className="rounded-full px-5"
          variant="outline"
          disabled={redFlag || pending !== null}
          onClick={() => decide("close_noise")}
        >
          {pending === "close_noise" ? "…" : "Close as noise"}
        </Button>
        <Button
          className="rounded-full px-5"
          variant="outline"
          disabled={pending !== null}
          onClick={() => decide("escalate")}
        >
          {pending === "escalate" ? "…" : "Escalate to MLRO"}
        </Button>
        <Button
          className="rounded-full px-5"
          disabled={pending !== null}
          onClick={() => decide("file_sar")}
        >
          {pending === "file_sar" ? "…" : "Decide and file"}
        </Button>
      </div>
      {redFlag ? (
        <p className="text-sm">
          Red-flag gate is on. Closing as noise is blocked — the model cannot
          overrule the rules.
        </p>
      ) : null}
      {current ? (
        <p className="text-sm text-muted-foreground">
          Human decision on file: {current.replaceAll("_", " ")}
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

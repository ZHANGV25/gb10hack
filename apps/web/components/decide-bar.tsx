"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ACTIONS = [
  {
    id: "close_noise",
    label: "Dismiss as false positive",
    hint: "Closes the case. Nothing is reported to the regulator.",
  },
  {
    id: "escalate",
    label: "Refer to MLRO",
    hint: "Sends the case to the money-laundering reporting officer for a second review.",
  },
  {
    id: "file_sar",
    label: "Submit SAR to FIU",
    hint: "Reports suspicious activity to the Financial Intelligence Unit under AMLR Art. 69.",
    primary: true,
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
    <section className="overflow-hidden rounded-lg border border-foreground/15 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <h2 className="text-[12px] font-medium">Record the decision</h2>
        <span className="text-[11px] text-muted-foreground">Analyst only</span>
      </div>

      <div className="px-4 py-3">
        <p className="text-[12px] leading-5 text-muted-foreground">
          The case stays open until one of these is recorded. The drafting
          assistant cannot take any of them.
        </p>

        <div className="mt-3 space-y-2">
          {ACTIONS.map((a) => {
            const locked = redFlag && a.id === "close_noise";
            const chosen = current === a.id;
            const disabled = pending !== null || locked;
            return (
              <button
                key={a.id}
                type="button"
                aria-label={a.label}
                disabled={disabled}
                onClick={() => decide(a.id)}
                className={`group flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                  locked
                    ? "cursor-not-allowed border-hairline bg-surface-muted/50 opacity-70"
                    : chosen
                      ? "border-foreground bg-foreground text-background"
                      : "border-hairline hover:border-foreground/30 hover:bg-surface-muted/60"
                }`}
              >
                <span
                  className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    chosen
                      ? "border-background bg-background"
                      : locked
                        ? "border-muted-foreground/40"
                        : "border-muted-foreground/40 group-hover:border-foreground"
                  }`}
                >
                  {chosen ? (
                    <span className="size-1.5 rounded-full bg-foreground" />
                  ) : locked ? (
                    <svg
                      viewBox="0 0 12 12"
                      className="size-2.5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden
                    >
                      <rect x="2.5" y="5.5" width="7" height="5" rx="1" />
                      <path d="M4.2 5.5V4a1.8 1.8 0 0 1 3.6 0v1.5" />
                    </svg>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[13px] font-medium">
                    {a.label}
                    {pending === a.id ? (
                      <span className="text-[11px] font-normal opacity-70">
                        recording…
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] leading-4 ${
                      chosen ? "text-background/75" : "text-muted-foreground"
                    }`}
                  >
                    {locked
                      ? "Blocked: an exact sanctions-list match cannot be closed as a false positive."
                      : a.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {current ? (
          <p className="mt-3 rounded-md border border-hairline bg-surface-muted/60 px-3 py-2 text-[11px] leading-4 text-muted-foreground">
            Recorded by A. Weber, Financial Crime Operations. Written to the
            activity log with the case ID and reason.
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-md border border-flag/30 bg-flag-soft px-3 py-2 text-[12px] leading-5 text-flag">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}

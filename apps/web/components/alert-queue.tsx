"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { severityLabel } from "@/components/shell";
import type { AlertRow } from "@/lib/exitplan";

const TABS = [
  { id: "all", label: "All" },
  { id: "noise", label: "Noise" },
  { id: "review", label: "Review" },
  { id: "red_flag", label: "Red flag" },
] as const;

export function AlertQueue({ alerts }: { alerts: AlertRow[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const rows = useMemo(() => {
    if (tab === "all") return alerts;
    return alerts.filter((a) => a.severity === tab);
  }, [alerts, tab]);

  return (
    <div className="rounded-[2rem] bg-muted p-2 sm:p-3">
      <div className="flex flex-wrap gap-1 rounded-full bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-full bg-background px-4 py-2 text-sm shadow-sm"
                : "rounded-full px-4 py-2 text-sm text-muted-foreground"
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2 overflow-hidden rounded-[1.5rem] bg-background">
        {rows.slice(0, 60).map((a) => (
          <Link
            key={a.alertId}
            href={`/alerts/${a.alertId}`}
            className="grid grid-cols-[7rem_1fr_auto] items-center gap-4 border-b px-5 py-4 last:border-b-0 hover:bg-muted/60"
          >
            <span className="text-sm text-muted-foreground">{a.alertId}</span>
            <span>
              <span className="block font-medium">{a.customerName}</span>
              <span className="block truncate text-sm text-muted-foreground">
                {a.reason}
              </span>
            </span>
            <span className="text-sm">
              {a.humanDecision ? "Human decided" : severityLabel(a.severity)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { decisionLabel, ruleOrigin } from "@/components/shell";
import type { AlertRow } from "@/lib/exitplan";

const TABS = [
  { id: "all", label: "All" },
  { id: "red_flag", label: "Red flag" },
  { id: "review", label: "Needs review" },
  { id: "noise", label: "Likely noise" },
] as const;

function rank(a: AlertRow) {
  if (a.severity === "red_flag") return 0;
  if (a.demoRole === "review") return 1;
  if (a.severity === "review") return 2;
  return 3;
}

export function AlertQueue({ alerts }: { alerts: AlertRow[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return alerts
      .filter((a) => (tab === "all" ? true : a.severity === tab))
      .filter((a) => {
        if (!query) return true;
        return (
          a.customerName.toLowerCase().includes(query) ||
          a.alertId.toLowerCase().includes(query) ||
          a.ruleId.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => rank(a) - rank(b));
  }, [alerts, tab, q]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-full bg-foreground px-3 py-1.5 text-xs text-background"
                  : "rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          placeholder="Search customer or case ID"
          className="ml-auto h-8 w-full max-w-xs rounded-full border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <div className="grid grid-cols-[6.5rem_1fr_9rem_8rem] gap-3 border-b bg-muted/50 px-4 py-2 text-[11px] tracking-wide text-muted-foreground uppercase">
        <span>Case</span>
        <span>Customer</span>
        <span>Raised by</span>
        <span>Status</span>
      </div>
      {rows.slice(0, 80).map((a) => (
        <Link
          key={a.alertId}
          href={`/alerts/${a.alertId}`}
          className="grid grid-cols-[6.5rem_1fr_9rem_8rem] items-center gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/40"
        >
          <span className="font-mono text-xs text-muted-foreground">
            {a.alertId}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {a.customerName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {a.reason}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {ruleOrigin(a.ruleId)}
          </span>
          <span className="text-xs">{decisionLabel(a.humanDecision, a.severity)}</span>
        </Link>
      ))}
    </div>
  );
}

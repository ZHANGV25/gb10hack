"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { decisionLabel, severityLabel } from "@/components/shell";
import type { AlertRow } from "@/lib/exitplan";

const TABS = [
  { id: "all", label: "All" },
  { id: "red_flag", label: "Red flag" },
  { id: "review", label: "Needs review" },
  { id: "noise", label: "Likely false alert" },
] as const;

function rank(a: AlertRow) {
  if (a.severity === "red_flag") return 0;
  if (a.severity === "review") return 1;
  return 2;
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
          a.headline.toLowerCase().includes(query) ||
          a.occupation.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => rank(a) - rank(b));
  }, [alerts, tab, q]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-full bg-foreground px-2.5 py-1 text-xs text-background"
                  : "rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          placeholder="Search name or case"
          className="ml-auto h-8 w-full max-w-xs rounded-full border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        {rows.map((a) => (
          <Link
            key={a.alertId}
            href={`/alerts/${a.alertId}`}
            className="flex items-start justify-between gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-muted/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{a.customerName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {a.headline}
                {a.occupation ? ` · ${a.occupation}` : ""}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium">
                {decisionLabel(a.humanDecision, a.severity)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {severityLabel(a.severity)} · {a.alertId}
              </p>
            </div>
          </Link>
        ))}
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            No cases in this view.
          </p>
        ) : null}
      </div>
    </div>
  );
}

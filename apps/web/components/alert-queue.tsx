"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { decisionLabel, severityLabel } from "@/components/shell";
import type { AlertRow } from "@/lib/exitplan";

const TABS = [
  { id: "all", label: "All cases" },
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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? "rounded-full bg-foreground px-4 py-2.5 text-base text-background"
                  : "rounded-full bg-muted px-4 py-2.5 text-base text-muted-foreground hover:text-foreground"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          placeholder="Search by name or what happened"
          className="h-12 w-full rounded-full border border-border bg-background px-5 text-base outline-none focus:ring-2 focus:ring-foreground/15 sm:ml-auto sm:max-w-sm"
        />
      </div>
      <div className="space-y-3">
        {rows.map((a) => (
          <Link
            key={a.alertId}
            href={`/alerts/${a.alertId}`}
            className="block rounded-2xl border border-border bg-background px-5 py-5 hover:border-foreground/30 hover:bg-muted/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-2xl font-semibold tracking-tight">
                  {a.customerName}
                </p>
                <p className="mt-1 text-lg leading-7 text-muted-foreground">
                  {a.headline}
                </p>
                {a.occupation ? (
                  <p className="mt-1 text-base text-muted-foreground">
                    {a.occupation}
                  </p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="text-base font-medium">
                  {decisionLabel(a.humanDecision, a.severity)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {severityLabel(a.severity)} · {a.alertId}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-border px-5 py-8 text-lg text-muted-foreground">
            No cases in this view.
          </p>
        ) : null}
      </div>
    </div>
  );
}

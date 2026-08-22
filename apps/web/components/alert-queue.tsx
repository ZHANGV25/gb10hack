"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Dot, Pill, Rail } from "@/components/pill";
import type { AlertRow } from "@/lib/exitplan";
import {
  decisionLabel,
  euros,
  ruleLabel,
  severityLabel,
  severityTone,
} from "@/lib/format";

const TABS = [
  { id: "todo", label: "Needs a decision" },
  { id: "red_flag", label: "Red flag" },
  { id: "review", label: "Review" },
  { id: "noise", label: "Likely false alert" },
  { id: "done", label: "Decided" },
  { id: "all", label: "All" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function rank(a: AlertRow) {
  if (a.severity === "red_flag") return 0;
  if (a.severity === "review") return 1;
  return 2;
}

function matches(a: AlertRow, tab: TabId) {
  if (tab === "all") return true;
  if (tab === "todo") return !a.humanDecision;
  if (tab === "done") return Boolean(a.humanDecision);
  return a.severity === tab;
}

export function AlertQueue({ alerts }: { alerts: AlertRow[] }) {
  const [tab, setTab] = useState<TabId>("todo");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const out = {} as Record<TabId, number>;
    for (const t of TABS) out[t.id] = alerts.filter((a) => matches(a, t.id)).length;
    return out;
  }, [alerts]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return alerts
      .filter((a) => matches(a, tab))
      .filter((a) => {
        if (!query) return true;
        return (
          a.customerName.toLowerCase().includes(query) ||
          a.alertId.toLowerCase().includes(query) ||
          a.headline.toLowerCase().includes(query) ||
          a.occupation.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const decided = Number(Boolean(a.humanDecision)) - Number(Boolean(b.humanDecision));
        if (decided !== 0) return decided;
        return rank(a) - rank(b);
      });
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
              className={`rounded-md px-2.5 py-1 text-[12px] transition-colors ${
                tab === t.id
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 font-mono text-[10px] ${
                  tab === t.id ? "text-background/60" : "text-muted-foreground/70"
                }`}
              >
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          placeholder="Search name or case ID"
          className="ml-auto h-8 w-full max-w-[240px] rounded-md border border-hairline bg-surface px-2.5 text-[13px] outline-none placeholder:text-muted-foreground/70 focus:border-foreground/25 focus:ring-3 focus:ring-foreground/5"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="hidden grid-cols-[1.3fr_1.5fr_auto_auto] items-center gap-4 border-b border-hairline bg-surface-muted/60 px-4 py-2 text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase md:grid">
          <span>Customer</span>
          <span>Why monitoring opened it</span>
          <span className="text-right">Value in review</span>
          <span className="w-[150px] text-right">Status</span>
        </div>

        {rows.map((a) => {
          const tone = severityTone(a.severity);
          const decided = Boolean(a.humanDecision);
          return (
            <Link
              key={a.alertId}
              href={`/alerts/${a.alertId}`}
              className="relative grid grid-cols-1 items-center gap-1.5 border-b border-hairline px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-muted/50 md:grid-cols-[1.3fr_1.5fr_auto_auto] md:gap-4 md:py-2.5"
            >
              <Rail tone={decided ? "clear" : tone} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{a.customerName}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  <span className="font-mono">{a.alertId}</span>
                  {a.occupation ? ` · ${a.occupation}` : ""}
                  {a.city ? ` · ${a.city}` : ""}
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] leading-5">{a.headline}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1">
                  {(a.ruleIds.length ? a.ruleIds : [a.ruleId]).map((r) => (
                    <span
                      key={r}
                      className="rounded border border-hairline px-1 py-px text-[10px] text-muted-foreground"
                    >
                      {ruleLabel(r)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:text-right">
                <p className="font-mono text-[13px] tabular-nums">
                  {euros(a.exposureEur)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {a.txnCount} payments
                </p>
              </div>

              <div className="md:w-[150px] md:text-right">
                {decided ? (
                  <Pill tone="clear">
                    <Dot tone="clear" />
                    {decisionLabel(a.humanDecision, a.severity)}
                  </Pill>
                ) : (
                  <Pill tone={tone}>
                    <Dot tone={tone} />
                    {severityLabel(a.severity)}
                  </Pill>
                )}
              </div>
            </Link>
          );
        })}

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-muted-foreground">
            Nothing in this view.
          </p>
        ) : null}
      </div>
    </div>
  );
}

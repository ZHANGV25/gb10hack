"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Dot, Pill, Rail } from "@/components/pill";
import type { RegisterRow } from "@/lib/dora";
import { euros } from "@/lib/format";
import { decisionLabel, decisionTone } from "@/lib/verdict";

const TABS = [
  { id: "all", label: "All" },
  { id: "reject", label: "Not compliant" },
  { id: "escalate", label: "Gaps to close" },
  { id: "approve", label: "Compliant" },
  { id: "critical", label: "Critical function" },
  { id: "pending", label: "Not yet read" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function matches(r: RegisterRow, tab: TabId) {
  if (tab === "all") return true;
  if (tab === "critical") return r.critical;
  if (tab === "pending") return !r.decision;
  return r.decision === tab;
}

const rank: Record<string, number> = { reject: 0, escalate: 1, approve: 2 };

export function RegisterTable({ rows }: { rows: RegisterRow[] }) {
  const [tab, setTab] = useState<TabId>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const out = {} as Record<TabId, number>;
    for (const t of TABS) out[t.id] = rows.filter((r) => matches(r, t.id)).length;
    return out;
  }, [rows]);

  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows
      .filter((r) => matches(r, tab))
      .filter(
        (r) =>
          !query ||
          r.vendor.toLowerCase().includes(query) ||
          r.ref.toLowerCase().includes(query) ||
          r.function.toLowerCase().includes(query),
      )
      .sort((a, b) => {
        const d = (rank[a.decision ?? "zz"] ?? 3) - (rank[b.decision ?? "zz"] ?? 3);
        if (d !== 0) return d;
        return b.annualValueEur - a.annualValueEur;
      });
  }, [rows, tab, q]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-2.5 py-1 text-[13px] transition-colors ${
                tab === t.id
                  ? "bg-foreground font-medium text-background"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 font-mono text-[11px] ${
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
          placeholder="Search supplier or reference"
          className="ml-auto h-8 w-full max-w-[240px] rounded-md border border-hairline bg-surface px-2.5 text-[14px] outline-none placeholder:text-muted-foreground/70 focus:border-foreground/25 focus:ring-3 focus:ring-foreground/5"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="hidden grid-cols-[1.5fr_1.4fr_auto_auto_auto] items-center gap-4 border-b border-hairline bg-surface-muted/60 px-4 py-2 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase md:grid">
          <span>Supplier and reference</span>
          <span>Article 30 gaps</span>
          <span className="text-right">Coverage</span>
          <span className="text-right">Annual charge</span>
          <span className="w-[132px] text-right">Verdict</span>
        </div>

        {shown.map((r) => {
          const tone = decisionTone(r.decision);
          return (
            <Link
              key={r.ref}
              href={`/contracts/${r.ref}`}
              className="relative grid grid-cols-1 items-center gap-1.5 border-b border-hairline px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-muted/50 md:grid-cols-[1.5fr_1.4fr_auto_auto_auto] md:gap-4 md:py-2.5"
            >
              <Rail tone={tone} />
              <div className="min-w-0">
                {/* the supplier name owns the first line — it is what a
                    reviewer scans for, so nothing else may squeeze it */}
                <p className="truncate text-[14px] font-medium">{r.vendor}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  {r.critical ? (
                    <span className="shrink-0 rounded border border-hairline px-1 py-px text-[10px] tracking-wide uppercase">
                      critical
                    </span>
                  ) : null}
                  <span className="truncate">
                    <span className="font-mono">{r.ref}</span> · {r.function}
                  </span>
                </p>
              </div>

              <div className="min-w-0">
                {r.gaps.length ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {r.gaps.slice(0, 3).map((g) => (
                      <span
                        key={g.provision}
                        title={g.label}
                        className={`rounded border px-1 py-px font-mono text-[11px] ${
                          g.severity === "blocking"
                            ? "border-flag/30 bg-flag-soft text-flag"
                            : "border-hairline text-muted-foreground"
                        }`}
                      >
                        {g.article}
                      </span>
                    ))}
                    {r.gaps.length > 3 ? (
                      <span className="text-[11px] text-muted-foreground">
                        +{r.gaps.length - 3}
                      </span>
                    ) : null}
                    <span className="truncate text-[12px] text-muted-foreground">
                      {r.gaps[0].label}
                      {r.gaps.length > 1 ? ` +${r.gaps.length - 1} more` : ""}
                    </span>
                  </div>
                ) : r.decision ? (
                  <span className="text-[13px] text-muted-foreground">
                    All required provisions present
                  </span>
                ) : (
                  <span className="text-[13px] text-muted-foreground">
                    Queued for review
                  </span>
                )}
                {r.changedByMemory ? (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Verdict set by a learned rule, not the checklist
                  </p>
                ) : null}
              </div>

              <div className="md:text-right">
                <p className="font-mono text-[14px] tabular-nums">
                  {r.decision ? `${r.presentCount}/${r.requiredCount}` : "—"}
                </p>
                <p className="text-[12px] text-muted-foreground">provisions</p>
              </div>

              <div className="md:text-right">
                <p className="font-mono text-[14px] tabular-nums">
                  {euros(r.annualValueEur)}
                </p>
                <p className="text-[12px] text-muted-foreground">per year</p>
              </div>

              <div className="md:w-[132px] md:text-right">
                <Pill tone={tone}>
                  <Dot tone={tone} />
                  {decisionLabel(r.decision)}
                </Pill>
              </div>
            </Link>
          );
        })}

        {shown.length === 0 ? (
          <p className="px-4 py-8 text-center text-[14px] text-muted-foreground">
            Nothing in this view.
          </p>
        ) : null}
      </div>
    </div>
  );
}

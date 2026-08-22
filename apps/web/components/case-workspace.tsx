"use client";

import { useMemo, useState } from "react";

import { ArchitectureChart } from "@/components/architecture-chart";
import { CaseAi } from "@/components/case-ai";
import { DecideBar } from "@/components/decide-bar";
import { severityLabel } from "@/components/shell";
import type { StageId } from "@/lib/architecture";
import { countryName, euros, shortDate } from "@/lib/format";

export type CaseView = {
  alertId: string;
  customerName: string;
  occupation: string;
  city: string;
  kyc: string;
  riskSegment: string;
  headline: string;
  story: string;
  reason: string;
  ruleId: string;
  severity: string;
  redFlag: boolean;
  stub: string;
  currentDecision: string | null;
  hits: { ruleId: string; headline: string; reason: string }[];
  txns: {
    id: string;
    ts: string;
    amount: number;
    country: string;
    counterparty: string;
  }[];
  sources: { docId: string; title: string; source: string; text: string }[];
};

export function CaseWorkspace({ view }: { view: CaseView }) {
  const [drafting, setDrafting] = useState(false);
  const [drafted, setDrafted] = useState(false);

  const current = useMemo<StageId>(() => {
    if (view.currentDecision) return "decide";
    if (drafting) return "draft";
    if (drafted) return "draft";
    return "alert";
  }, [view.currentDecision, drafting, drafted]);

  return (
    <div className="space-y-4">
      <ArchitectureChart current={current} compact />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <section id="why" className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-medium">Why this case is open</h2>
            <p className="mt-2 text-sm leading-6">{view.story || view.reason}</p>
            {view.hits.length > 1 ? (
              <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
                {view.hits.map((h) => (
                  <li key={h.ruleId}>
                    <span className="font-medium text-foreground">{h.headline}.</span>{" "}
                    {h.reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {view.reason}
              </p>
            )}
            {view.redFlag ? (
              <p className="mt-2 text-sm">
                Exact sanctions-list match. Dismissal is not permitted.
              </p>
            ) : null}
          </section>

          <section id="customer" className="rounded-xl bg-muted p-4">
            <h2 className="text-sm font-medium">Who they are</h2>
            <p className="mt-2 text-sm leading-6">
              {view.occupation ? `${view.occupation}. ` : ""}
              {view.kyc}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {view.city}
              {view.riskSegment ? ` · ${view.riskSegment} risk` : ""}
            </p>
          </section>

          <section id="payments" className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-medium">Payments</h2>
            <ul className="mt-2 divide-y divide-border">
              {view.txns.map((t) => (
                <li
                  key={t.id}
                  className="flex items-baseline justify-between gap-3 py-1.5 text-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="block truncate">
                      {t.counterparty || "Counterparty on file"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {shortDate(t.ts)} · {countryName(t.country)}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">{euros(t.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-4">
          <div id="disposition">
            <CaseAi
              alertId={view.alertId}
              stub={view.stub}
              onStatus={(s) => {
                setDrafting(s === "drafting");
                if (s === "done") setDrafted(true);
              }}
            />
          </div>
          <section id="decision" className="rounded-xl bg-muted p-4">
            <DecideBar
              alertId={view.alertId}
              redFlag={view.redFlag}
              current={view.currentDecision}
            />
          </section>
          {view.sources.map((s) => (
            <article
              key={s.docId}
              id={s.docId}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="text-sm font-medium">{s.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.source}</p>
              <p className="mt-2 text-sm leading-6">{s.text}</p>
            </article>
          ))}
          <p className="text-xs text-muted-foreground">
            {severityLabel(view.severity)} · {view.alertId}
          </p>
        </div>
      </div>
    </div>
  );
}

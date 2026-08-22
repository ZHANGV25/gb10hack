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
    <div className="space-y-8">
      <ArchitectureChart current={current} compact />

      <section id="why" className="rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold">Why this case is open</h2>
        <p className="mt-3 text-lg leading-8">{view.story || view.reason}</p>
        {view.hits.length > 1 ? (
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            {view.hits.map((h) => (
              <li key={h.ruleId}>
                <span className="font-medium text-foreground">{h.headline}.</span>{" "}
                {h.reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {view.reason}
          </p>
        )}
        {view.redFlag ? (
          <p className="mt-4 text-lg">
            Exact sanctions-list match. Dismissal is not permitted.
          </p>
        ) : null}
      </section>

      <section id="customer" className="rounded-2xl bg-muted p-6">
        <h2 className="text-xl font-semibold">Who they are</h2>
        <p className="mt-2 text-lg leading-8">
          {view.occupation ? `${view.occupation}. ` : ""}
          {view.kyc}
        </p>
        <p className="mt-2 text-base text-muted-foreground">
          {view.city}
          {view.riskSegment ? ` · ${view.riskSegment} risk` : ""}
        </p>
      </section>

      <section id="payments" className="rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold">Payments</h2>
        <ul className="mt-4 divide-y divide-border">
          {view.txns.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-lg"
            >
              <span className="min-w-0">
                <span className="block font-medium">
                  {t.counterparty || "Counterparty on file"}
                </span>
                <span className="text-base text-muted-foreground">
                  {shortDate(t.ts)} · {countryName(t.country)}
                </span>
              </span>
              <span className="font-medium tabular-nums">{euros(t.amount)}</span>
            </li>
          ))}
        </ul>
      </section>

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

      <section id="decision" className="rounded-2xl bg-muted p-6">
        <DecideBar
          alertId={view.alertId}
          redFlag={view.redFlag}
          current={view.currentDecision}
        />
      </section>

      {view.sources.length ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Policy cited in the draft</h2>
          {view.sources.map((s) => (
            <article
              key={s.docId}
              id={s.docId}
              className="rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="mt-1 text-base text-muted-foreground">{s.source}</p>
              <p className="mt-3 text-lg leading-8">{s.text}</p>
            </article>
          ))}
        </section>
      ) : null}

      <p className="text-sm text-muted-foreground">
        {severityLabel(view.severity)} · {view.alertId}
      </p>
    </div>
  );
}

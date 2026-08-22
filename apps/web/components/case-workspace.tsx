"use client";

import { useMemo, useState } from "react";

import { CaseAi, type DraftPhase } from "@/components/case-ai";
import { DecideBar } from "@/components/decide-bar";
import { Eyebrow, Pill } from "@/components/pill";
import { PipelineStrip } from "@/components/pipeline-strip";
import type { StageId } from "@/lib/architecture";
import {
  countryName,
  euros,
  HIGH_RISK_COUNTRIES,
  ruleLabel,
  ruleMechanic,
  severityTone,
  shortDate,
} from "@/lib/format";

export type CaseView = {
  alertId: string;
  customerName: string;
  customerId: string;
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
  openedAt: string | null;
  stub: string;
  currentDecision: string | null;
  hits: {
    ruleId: string;
    headline: string;
    reason: string;
    severity: string;
    score: number | null;
  }[];
  txns: {
    id: string;
    ts: string;
    amount: number;
    country: string;
    counterparty: string;
    flagged: boolean;
  }[];
  sources: { docId: string; title: string; source: string; text: string }[];
};

export function CaseWorkspace({ view }: { view: CaseView }) {
  const [phase, setPhase] = useState<DraftPhase>("idle");
  const flaggedCount = view.txns.filter((t) => t.flagged).length;

  const stage = useMemo<StageId>(() => {
    if (phase === "retrieving") return "retrieve";
    if (phase === "drafting") return "draft";
    if (view.currentDecision) return "decide";
    if (phase === "done") return "decide";
    return "alert";
  }, [phase, view.currentDecision]);

  return (
    <div className="space-y-4">
      <div>
        <PipelineStrip current={stage} />
        <p className="mt-1.5 text-[12px] text-muted-foreground">
          The highlighted step is where this case is right now.
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Evidence */}
        <div className="space-y-4">
          <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
              <h2 className="text-[13px] font-medium">
                Why monitoring opened this
              </h2>
              <span className="text-[12px] text-muted-foreground">
                Rules, not the model
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[14px] leading-[1.6]">
                {view.story || view.reason}
              </p>
            </div>
            <ul className="divide-y divide-hairline border-t border-hairline">
              {view.hits.map((h) => {
                const tone = severityTone(h.severity);
                return (
                  <li key={h.ruleId} className="px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={tone}>{ruleLabel(h.ruleId)}</Pill>
                      <span className="text-[13px] font-medium">
                        {h.headline}
                      </span>
                      {typeof h.score === "number" &&
                      h.ruleId.startsWith("WATCHLIST") ? (
                        <span className="ml-auto font-mono text-[12px] text-muted-foreground">
                          name match {(h.score * 100).toFixed(0)}%
                        </span>
                      ) : h.ruleId === "RED_FLAG_SANCTIONS" ? (
                        <span className="ml-auto font-mono text-[12px] text-flag">
                          exact match
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                      {h.reason}
                    </p>
                    <p className="mt-1 text-[12px] leading-4 text-muted-foreground/80">
                      {ruleMechanic(h.ruleId)}
                    </p>
                  </li>
                );
              })}
            </ul>
            {view.redFlag ? (
              <p className="border-t border-hairline bg-flag-soft px-4 py-2 text-[13px] text-flag">
                Exact sanctions-list match. This case cannot be dismissed as a
                false positive — the desk blocks it.
              </p>
            ) : null}
          </section>

          <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <div className="border-b border-hairline px-4 py-2">
              <h2 className="text-[13px] font-medium">Who the customer is</h2>
            </div>
            <div className="px-4 py-3">
              <p className="text-[14px] leading-[1.6]">
                {view.occupation &&
                !view.kyc.toLowerCase().includes(view.occupation.toLowerCase())
                  ? `${view.occupation}. `
                  : ""}
                {view.kyc}
              </p>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
                <span>
                  Customer{" "}
                  <span className="font-mono text-foreground">
                    {view.customerId}
                  </span>
                </span>
                {view.city ? <span>{view.city}</span> : null}
                {view.riskSegment ? (
                  <span>{view.riskSegment} risk segment</span>
                ) : null}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
              <h2 className="text-[13px] font-medium">Payments reviewed</h2>
              <span className="text-[12px] text-muted-foreground">
                {flaggedCount
                  ? `${flaggedCount} of these triggered a rule`
                  : "No single payment triggered this case"}
              </span>
            </div>
            <ul className="divide-y divide-hairline">
              {view.txns.map((t) => (
                <li
                  key={t.id}
                  className={`relative flex items-baseline justify-between gap-3 px-4 py-2 ${
                    t.flagged ? "bg-watch-soft" : ""
                  }`}
                >
                  {t.flagged ? (
                    <span
                      className="absolute inset-y-0 left-0 w-[2px] bg-watch"
                      aria-hidden
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate text-[14px]">
                      {t.counterparty || "Counterparty on file"}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      {shortDate(t.ts)} · {countryName(t.country)}
                      {HIGH_RISK_COUNTRIES.has(t.country)
                        ? " · high-risk jurisdiction"
                        : ""}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[14px] tabular-nums">
                    {euros(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Act */}
        <div className="space-y-4">
          <CaseAi
            alertId={view.alertId}
            stub={view.stub}
            customerName={view.customerName}
            onPhase={setPhase}
          />

          <DecideBar
            alertId={view.alertId}
            redFlag={view.redFlag}
            current={view.currentDecision}
          />

          {view.sources.length ? (
            <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
                <h2 className="text-[13px] font-medium">Policy on file</h2>
                <span className="text-[12px] text-muted-foreground">
                  Cited by the saved draft
                </span>
              </div>
              <ul className="divide-y divide-hairline">
                {view.sources.map((s) => (
                  <li key={s.docId} id={s.docId} className="px-4 py-2.5">
                    <Eyebrow>{s.source}</Eyebrow>
                    <p className="mt-1 text-[13px] font-medium">{s.title}</p>
                    <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                      {s.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

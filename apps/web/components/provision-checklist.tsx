"use client";

import { useState } from "react";

import { provisionsFor } from "@/lib/provisions";

type Found = {
  status?: string;
  quote?: string | null;
  section?: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  present: "In the contract",
  inadequate: "Falls short",
  absent: "Not in the contract",
};

export function ProvisionChecklist({
  critical,
  provisions,
}: {
  critical: boolean;
  provisions: Record<string, Found>;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const required = provisionsFor(critical);

  return (
    <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <h2 className="text-[12px] font-medium">
          DORA Article 30 checklist
        </h2>
        <p className="text-[11px] text-muted-foreground">
          {required.length} provisions required{" "}
          {critical ? "— critical function" : "— standard arrangement"}
        </p>
      </div>

      <ul className="divide-y divide-hairline">
        {required.map((p) => {
          const found = provisions[p.key] ?? {};
          const status = found.status ?? "absent";
          const ok = status === "present";
          const expanded = open === p.key;
          return (
            <li key={p.key} className={ok ? "" : "bg-surface-muted/40"}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : p.key)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-muted/60"
              >
                <span className="mt-0.5 shrink-0">
                  {ok ? (
                    <svg viewBox="0 0 14 14" className="size-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M2.5 7.4 5.6 10.5 11.5 3.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : status === "inadequate" ? (
                    <svg viewBox="0 0 14 14" className="size-3.5 text-watch" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M7 2.2 13 12H1z" strokeLinejoin="round" />
                      <path d="M7 6v2.4M7 10.1v.1" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 14 14" className="size-3.5 text-flag" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                      <path d="M3.4 3.4 10.6 10.6M10.6 3.4 3.4 10.6" strokeLinecap="round" />
                    </svg>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {p.article}
                    </span>
                    <span className="text-[13px] font-medium">{p.label}</span>
                    {p.blocking && !ok ? (
                      <span className="rounded border border-flag/30 bg-flag-soft px-1 py-px text-[9px] tracking-wide text-flag uppercase">
                        blocking
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
                    {p.plain}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span
                    className={`block text-[11px] ${
                      ok
                        ? "text-muted-foreground"
                        : status === "inadequate"
                          ? "text-watch"
                          : "text-flag"
                    }`}
                  >
                    {STATUS_LABEL[status] ?? status}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {found.quote ? (expanded ? "hide clause" : "show clause") : ""}
                  </span>
                </span>
              </button>

              {expanded ? (
                <div className="border-t border-hairline bg-background/60 px-4 py-3 pl-11">
                  {found.quote ? (
                    <>
                      <p className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                        {found.section
                          ? `Quoted from ${found.section}`
                          : "Quoted from the contract"}
                      </p>
                      <blockquote className="mt-1.5 border-l-2 border-hairline pl-3 text-[12px] leading-[1.6] text-foreground/85 italic">
                        {found.quote}
                      </blockquote>
                      {status === "inadequate" ? (
                        <p className="mt-2 text-[11px] leading-4 text-watch">
                          A clause exists but does not meet the requirement. The
                          bank cannot rely on it to evidence compliance.
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-[12px] leading-5 text-muted-foreground">
                      Nothing in the contract addresses this. The agent found no
                      clause to quote.
                    </p>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

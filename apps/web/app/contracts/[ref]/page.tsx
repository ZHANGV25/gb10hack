import Link from "next/link";
import { notFound } from "next/navigation";

import { Dot, Eyebrow, Pill } from "@/components/pill";
import { ProvisionChecklist } from "@/components/provision-checklist";
import { ReviewPanel } from "@/components/review-panel";
import { Shell } from "@/components/shell";
import { getReview, type Decision, type Gap } from "@/lib/dora";
import { euros } from "@/lib/format";
import { decisionLabel, decisionTone } from "@/lib/verdict";

export const dynamic = "force-dynamic";

export default async function ContractPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const data = await getReview(ref);
  if (!data) notFound();
  const { contract, verdict, history } = data;

  const decision = (verdict?.decision as Decision) ?? null;
  const tone = decisionTone(decision);
  const gaps: Gap[] = Array.isArray(verdict?.gaps) ? (verdict!.gaps as Gap[]) : [];
  const critical = Boolean(contract.critical);
  const candidates = Array.isArray(verdict?.candidate_rules)
    ? verdict!.candidate_rules
    : [];
  const reading = (verdict?.reading ?? {}) as Record<string, unknown>;
  const passageCount = Array.isArray(reading.passages)
    ? (reading.passages as unknown[]).length
    : 0;
  const appliedIds = new Set(
    (Array.isArray(verdict?.applied_rule_ids)
      ? verdict!.applied_rule_ids
      : []
    ).map(String),
  );

  return (
    <Shell current="/">
      <main className="mx-auto max-w-[1260px] px-5 py-6 pb-20 lg:px-8">
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ICT register
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground">{String(contract.ref)}</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={tone}>
                <Dot tone={tone} />
                {decisionLabel(decision)}
              </Pill>
              {critical ? (
                <span className="rounded border border-hairline px-1.5 py-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">
                  critical or important function
                </span>
              ) : null}
              {verdict?.decision_changed_by_memory ? (
                <span className="text-[12px] text-muted-foreground">
                  Verdict set by a learned rule, not the checklist
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-[26px] leading-8 font-semibold">
              {String(contract.vendor)}
            </h1>
            <p className="mt-0.5 text-[14px] text-muted-foreground">
              {String(contract.function)}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
              <span>Commenced {String(contract.commenced ?? "—")}</span>
              <span>·</span>
              <span>{String(contract.governing_law ?? "—")}</span>
              <span>·</span>
              <span>Data in {String(contract.data_locations ?? "—")}</span>
            </p>
            {contract.source ? (
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Real agreement filed with the SEC
                {contract.source_form ? ` as ${String(contract.source_form)}` : ""}
                {contract.source_filed ? ` on ${String(contract.source_filed)}` : ""} —
                no ground truth, nothing tuned for it.{" "}
                {contract.source_url ? (
                  <a
                    href={String(contract.source_url)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    view the filing
                  </a>
                ) : null}
              </p>
            ) : null}
          </div>

          <dl className="flex gap-6">
            <div>
              <dt className="text-[12px] text-muted-foreground">
                {Number(contract.annual_value_eur ?? 0) > 0
                  ? "Annual charge"
                  : "Document"}
              </dt>
              <dd className="mt-0.5 font-mono text-[20px] tabular-nums">
                {Number(contract.annual_value_eur ?? 0) > 0
                  ? euros(Number(contract.annual_value_eur))
                  : `${Math.round(Number(contract.chars ?? 0) / 1000)}k`}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">Coverage</dt>
              <dd className="mt-0.5 font-mono text-[20px] tabular-nums">
                {verdict ? `${verdict.present_count}/${verdict.required_count}` : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted-foreground">Gaps</dt>
              <dd className="mt-0.5 font-mono text-[20px] tabular-nums">
                {verdict ? gaps.length : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {!verdict ? (
          <p className="mt-6 rounded-lg border border-hairline bg-surface px-4 py-6 text-[14px] text-muted-foreground">
            The agent has not read this arrangement yet. It is queued.
          </p>
        ) : (
          <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
                <div className="border-b border-hairline px-4 py-2">
                  <h2 className="text-[13px] font-medium">What the agent concluded</h2>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[14px] leading-[1.6]">
                    {String(verdict.reasoning ?? "")}
                  </p>
                  {Number(verdict.exposure_eur ?? 0) > 0 ? (
                    <p className="mt-2 rounded-md border border-flag/25 bg-flag-soft px-3 py-2 text-[13px] leading-5 text-flag">
                      {euros(Number(verdict.exposure_eur))} a year runs through an
                      arrangement the bank cannot cleanly exit or inspect.
                    </p>
                  ) : null}
                  {reading.mode === "retrieved" ? (
                    <p className="mt-2 rounded-md border border-hairline bg-surface-muted/60 px-3 py-2 text-[12px] leading-5 text-muted-foreground">
                      This agreement is{" "}
                      {Number(contract.chars ?? 0).toLocaleString("en-GB")}{" "}
                      characters — too long to read in one pass. It was split
                      into passages and, for each provision, the passages most
                      likely to contain that clause were retrieved by vector
                      search. The agent read{" "}
                      <span className="font-medium text-foreground">
                        {passageCount} of them
                      </span>
                      , not the whole document.
                    </p>
                  ) : null}
                  <p className="mt-2 text-[12px] leading-4 text-muted-foreground">
                    {String(verdict.math ?? "")}
                  </p>
                </div>
              </section>

              <ProvisionChecklist
                critical={critical}
                provisions={
                  (verdict.provisions ?? {}) as Record<
                    string,
                    { status?: string; quote?: string | null; section?: string | null }
                  >
                }
              />
            </div>

            <div className="space-y-4">
              <ReviewPanel
                refId={String(contract.ref)}
                critical={critical}
                currentDecision={decision ? decisionLabel(decision) : null}
                gaps={gaps}
              />

              <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
                <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
                  <h2 className="text-[13px] font-medium">Memory consulted</h2>
                  <span className="text-[12px] text-muted-foreground">
                    nearest rules by meaning
                  </span>
                </div>
                {candidates.length ? (
                  <ul className="divide-y divide-hairline">
                    {candidates.map((c: Record<string, unknown>) => {
                      const fired = appliedIds.has(String(c.rule_id));
                      return (
                        <li key={String(c.rule_id)} className="px-4 py-2.5">
                          <div className="flex items-baseline justify-between gap-3">
                            <span
                              className={`text-[12px] ${fired ? "font-medium text-foreground" : "text-muted-foreground"}`}
                            >
                              {fired ? "Applied" : "Considered, did not apply"}
                            </span>
                            <span className="font-mono text-[12px] text-muted-foreground">
                              {typeof c.score === "number"
                                ? (c.score as number).toFixed(3)
                                : ""}
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                            {String(c.text ?? "")}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-[13px] text-muted-foreground">
                    No rules in memory matched this contract&rsquo;s gaps.
                  </p>
                )}
                <div className="border-t border-hairline px-4 py-2.5">
                  <Eyebrow>Retrieval query</Eyebrow>
                  <p className="mt-1 font-mono text-[11px] leading-4 break-words text-muted-foreground">
                    {String(verdict.retrieval_query ?? "")}
                  </p>
                </div>
              </section>

              {history.length > 1 ? (
                <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
                  <div className="border-b border-hairline px-4 py-2">
                    <h2 className="text-[13px] font-medium">Review history</h2>
                  </div>
                  <ul className="divide-y divide-hairline">
                    {history.map((h: Record<string, unknown>) => (
                      <li
                        key={String(h._id)}
                        className="flex items-baseline justify-between gap-3 px-4 py-2 text-[13px]"
                      >
                        <span className="font-mono text-[12px] text-muted-foreground">
                          {h.created_at
                            ? new Date(String(h.created_at)).toLocaleTimeString(
                                "en-GB",
                                { hour: "2-digit", minute: "2-digit", second: "2-digit" },
                              )
                            : ""}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-muted-foreground">
                          {String(h.trigger ?? "")}
                          {h.extraction === "reused" ? " · policy only" : ""}
                        </span>
                        <span className="shrink-0 font-medium">
                          {decisionLabel(h.decision as Decision)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}

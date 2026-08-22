import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseAi } from "@/components/case-ai";
import { DecideBar } from "@/components/decide-bar";
import { Shell, ruleOrigin, severityLabel } from "@/components/shell";
import { getAlert } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function AlertPage({
  params,
}: {
  params: Promise<{ alertId: string }>;
}) {
  const { alertId } = await params;
  const data = await getAlert(alertId);
  if (!data) notFound();
  const { alert, customer, txns, disposition, sources } = data;
  const redFlag = alert.severity === "red_flag";
  const narrative = String(disposition?.narrative ?? "No draft yet.");

  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-6 py-8 pb-24">
        <p className="mb-5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Alerts
          </Link>
          <span className="mx-2">/</span>
          <span className="font-mono">{alert.alert_id}</span>
        </p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {severityLabel(String(alert.severity))} · {ruleOrigin(String(alert.rule_id))}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {String(alert.customer_name)}
            </h1>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-border p-5">
              <h2 className="text-sm font-medium">Where this case came from</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-6 text-muted-foreground">
                <li>
                  Demo data: a fake customer record and payments were generated
                  on this machine. Not a real bank book.
                </li>
                <li>
                  A Python rule scanned them. It fired{" "}
                  <span className="font-mono text-foreground">
                    {String(alert.rule_id)}
                  </span>
                  : {String(alert.reason)}
                </li>
                <li>
                  That opened this case. Nobody uploaded a PDF or spreadsheet.
                </li>
                <li>
                  Click <span className="text-foreground">Run Nemotron</span>{" "}
                  on the right to draft a memo live on this GPU. That is the
                  model. It still cannot decide the case.
                </li>
              </ol>
              {redFlag ? (
                <p className="mt-3 text-sm">
                  Exact name on the watchlist — dismiss is disabled.
                </p>
              ) : null}
            </section>
            <section className="rounded-2xl bg-muted p-5">
              <h2 className="text-sm font-medium">Customer record</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {String(customer?.kyc ?? "Synthetic KYC.")} {String(customer?.city)}{" "}
                · {String(customer?.risk_segment)} risk
              </p>
              <p className="mt-4 text-xs tracking-wide text-muted-foreground uppercase">
                Recent payments
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {txns.map((t) => (
                  <li
                    key={String(t.txn_id)}
                    className="flex justify-between gap-3 font-mono text-xs"
                  >
                    <span>{String(t.ts).slice(0, 10)}</span>
                    <span>
                      EUR {Number(t.amount_eur).toLocaleString()} ·{" "}
                      {String(t.country)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="space-y-4">
            <CaseAi alertId={String(alert.alert_id)} stub={narrative} />
            <section className="rounded-2xl bg-muted p-5">
              <DecideBar
                alertId={String(alert.alert_id)}
                redFlag={redFlag}
                current={
                  disposition?.human_decision
                    ? String(disposition.human_decision)
                    : null
                }
              />
            </section>
            {sources.map((s) => (
              <section
                key={String(s.doc_id)}
                id={String(s.doc_id)}
                className="rounded-2xl border border-border p-5"
              >
                <h2 className="text-sm font-medium">{String(s.title)}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {String(s.source)}
                </p>
                <p className="mt-3 text-sm leading-6">{String(s.text)}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </Shell>
  );
}

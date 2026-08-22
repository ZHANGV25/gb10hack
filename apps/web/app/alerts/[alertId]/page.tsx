import Link from "next/link";
import { notFound } from "next/navigation";

import { DecideBar } from "@/components/decide-bar";
import { Shell, severityLabel } from "@/components/shell";
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
  const citations = Array.isArray(disposition?.citations)
    ? disposition.citations
    : [];

  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-6 py-10 pb-24">
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Queue
          </Link>
          <span className="mx-2">/</span>
          {alert.alert_id}
        </p>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {severityLabel(String(alert.severity))} · {alert.rule_id}
              </p>
              <h1 className="font-heading mt-1 text-4xl font-semibold tracking-tight">
                {String(alert.customer_name)}
              </h1>
            </div>
            <div className="rounded-[2rem] bg-muted p-6">
              <p className="text-sm font-medium">Why the screener fired</p>
              <p className="mt-2 text-[15px] leading-6">{String(alert.reason)}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                The model did not pick this hit. A rule did.
              </p>
              {redFlag ? (
                <p className="mt-3 text-sm">
                  Hard red-flag gate is active. The draft cannot close this
                  case.
                </p>
              ) : null}
            </div>
            <div className="rounded-[2rem] border border-border p-6">
              <p className="text-sm font-medium">Customer file</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {String(customer?.kyc ?? "Synthetic KYC.")} City{" "}
                {String(customer?.city)}. Segment {String(customer?.risk_segment)}.
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {txns.map((t) => (
                  <li key={String(t.txn_id)}>
                    EUR {Number(t.amount_eur).toLocaleString()} · {String(t.country)}{" "}
                    · {String(t.ts).slice(0, 10)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-muted p-6">
              <p className="text-sm font-medium">Draft disposition</p>
              <p className="mt-3 text-[17px] leading-7">{narrative}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {citations.map((c: { doc_id?: string; title?: string }) => (
                  <a
                    key={String(c.doc_id)}
                    href={`#${c.doc_id}`}
                    className="rounded-full bg-background px-3 py-1 text-xs"
                  >
                    {String(c.title ?? c.doc_id)}
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-border p-6">
              <DecideBar
                alertId={String(alert.alert_id)}
                redFlag={redFlag}
                current={
                  disposition?.human_decision
                    ? String(disposition.human_decision)
                    : null
                }
              />
            </div>
            <div className="space-y-3">
              {sources.map((s) => (
                <div
                  key={String(s.doc_id)}
                  id={String(s.doc_id)}
                  className="rounded-[1.5rem] border border-border p-5"
                >
                  <p className="text-sm font-medium">{String(s.title)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {String(s.source)}
                  </p>
                  <p className="mt-3 text-sm leading-6">{String(s.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}

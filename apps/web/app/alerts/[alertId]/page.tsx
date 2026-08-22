import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseWorkspace } from "@/components/case-workspace";
import { Dot, Pill } from "@/components/pill";
import { Shell } from "@/components/shell";
import { getAlert } from "@/lib/exitplan";
import {
  decisionLabel,
  euros,
  severityLabel,
  severityTone,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AlertPage({
  params,
}: {
  params: Promise<{ alertId: string }>;
}) {
  const { alertId } = await params;
  const data = await getAlert(alertId);
  if (!data) notFound();
  const { view } = data;
  const tone = severityTone(view.severity);
  const total = view.txns.reduce((sum, t) => sum + t.amount, 0);
  const opened = view.openedAt
    ? new Date(view.openedAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Shell current="/">
      <main className="mx-auto max-w-[1180px] px-5 py-6 pb-20 lg:px-8">
        <nav className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Alert queue
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground">{view.alertId}</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={view.currentDecision ? "clear" : tone}>
                <Dot tone={view.currentDecision ? "clear" : tone} />
                {view.currentDecision
                  ? decisionLabel(view.currentDecision, view.severity)
                  : severityLabel(view.severity)}
              </Pill>
              {view.redFlag ? (
                <span className="text-[11px] text-flag">
                  Dismissal is blocked on this case
                </span>
              ) : null}
            </div>
            <h1 className="mt-2 text-[24px] leading-8 font-semibold">
              {view.customerName}
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {view.headline}
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {[
                view.occupation,
                view.city,
                view.riskSegment ? `${view.riskSegment} risk segment` : "",
                opened ? `Opened ${opened}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          <dl className="flex gap-6">
            <div>
              <dt className="text-[11px] text-muted-foreground">In review</dt>
              <dd className="mt-0.5 font-mono text-[18px] tabular-nums">
                {euros(total)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Payments</dt>
              <dd className="mt-0.5 font-mono text-[18px] tabular-nums">
                {view.txns.length}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Rules fired</dt>
              <dd className="mt-0.5 font-mono text-[18px] tabular-nums">
                {view.hits.length}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-5">
          <CaseWorkspace view={view} />
        </div>
      </main>
    </Shell>
  );
}

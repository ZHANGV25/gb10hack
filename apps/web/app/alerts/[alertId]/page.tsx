import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseWorkspace } from "@/components/case-workspace";
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
  const { view } = data;

  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-5 py-6 pb-16">
        <p className="mb-3 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Alerts
          </Link>
          <span className="mx-1.5">/</span>
          {view.alertId}
        </p>
        <p className="text-xs text-muted-foreground">
          {severityLabel(view.severity)}
        </p>
        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">
          {view.customerName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{view.headline}</p>
        <div className="mt-5">
          <CaseWorkspace view={view} />
        </div>
      </main>
    </Shell>
  );
}

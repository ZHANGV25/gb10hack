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
      <main className="mx-auto max-w-4xl px-6 py-10 pb-24">
        <p className="mb-6 text-base">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← All alerts
          </Link>
        </p>
        <p className="text-base text-muted-foreground">
          {severityLabel(view.severity)}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {view.customerName}
        </h1>
        <p className="mt-3 text-2xl leading-8 text-muted-foreground">
          {view.headline}
        </p>
        <nav className="mt-6 flex flex-wrap gap-2 text-base">
          <a href="#why" className="rounded-full bg-muted px-4 py-2 hover:bg-muted/80">
            Why it&apos;s open
          </a>
          <a href="#payments" className="rounded-full bg-muted px-4 py-2 hover:bg-muted/80">
            Payments
          </a>
          <a href="#disposition" className="rounded-full bg-muted px-4 py-2 hover:bg-muted/80">
            Disposition
          </a>
          <a href="#decision" className="rounded-full bg-muted px-4 py-2 hover:bg-muted/80">
            Decision
          </a>
        </nav>
        <div className="mt-8">
          <CaseWorkspace view={view} />
        </div>
      </main>
    </Shell>
  );
}

import { AlertQueue } from "@/components/alert-queue";
import { ArchitectureChart } from "@/components/architecture-chart";
import { Shell } from "@/components/shell";
import { listAlerts, stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [alerts, s] = await Promise.all([listAlerts(), stats()]);
  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Alert queue</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Open a case, generate a disposition, then record the decision.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {s.total} cases · {s.redFlag} red flag · {s.review} review ·{" "}
            {s.noise} false alert
          </p>
        </div>
        <AlertQueue alerts={alerts} />
        <div className="mt-6">
          <ArchitectureChart
            counts={{
              customers: s.customers,
              alerts: s.total,
              drafts: s.drafts,
              decided: s.decided,
              audit: s.audit,
            }}
          />
        </div>
      </main>
    </Shell>
  );
}

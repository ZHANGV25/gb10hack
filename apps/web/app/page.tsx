import { AlertQueue } from "@/components/alert-queue";
import { ArchitectureChart } from "@/components/architecture-chart";
import { Shell } from "@/components/shell";
import { listAlerts, stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [alerts, s] = await Promise.all([listAlerts(), stats()]);
  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Alert queue</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
            Open these cases, read what happened, generate a disposition, then
            record your decision.
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            {s.total} cases · {s.redFlag} red flag · {s.review} need review ·{" "}
            {s.noise} likely false alert
          </p>
        </div>
        <AlertQueue alerts={alerts} />
        <div className="mt-12">
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

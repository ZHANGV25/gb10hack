import { ArchitectureChart } from "@/components/architecture-chart";
import { Shell } from "@/components/shell";
import { stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const s = await stats();
  return (
    <Shell current="/system">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          How a case moves
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">
          This is the running system. Counts update as alerts open, drafts are
          written, and analysts record decisions. The language model cannot
          open an alert or file a report.
        </p>
        <div className="mt-8">
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

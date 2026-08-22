import { ArchitectureChart } from "@/components/architecture-chart";
import { Shell } from "@/components/shell";
import { stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const s = await stats();
  return (
    <Shell current="/system">
      <main className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="text-xl font-semibold tracking-tight">How a case moves</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Counts update as alerts open, drafts are written, and analysts record
          decisions. The language model cannot open an alert or file a report.
        </p>
        <div className="mt-4">
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

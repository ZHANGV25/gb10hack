import { AlertQueue } from "@/components/alert-queue";
import { Shell } from "@/components/shell";
import { listAlerts, stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [alerts, s] = await Promise.all([listAlerts(), stats()]);
  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Alert queue</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Nobody uploaded these. A rule engine scanned a{" "}
              <span className="text-foreground">synthetic</span> customer
              ledger against a sanctions watchlist and opened a case for each
              hit. Open a case and press{" "}
              <span className="text-foreground">Run Nemotron</span> — that is
              the 30B model on this GPU, pulling policy from Mongo.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {s.total} cases · {s.redFlag} red flag · {s.review} review ·{" "}
            {s.noise} noise
          </p>
        </div>
        <AlertQueue alerts={alerts} />
      </main>
    </Shell>
  );
}

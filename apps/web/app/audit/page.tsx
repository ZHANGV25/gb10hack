import { Shell } from "@/components/shell";
import { listAudit } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const rows = await listAudit(50);
  return (
    <Shell current="/audit">
      <main className="mx-auto max-w-6xl px-6 py-10 pb-24">
        <h1 className="font-heading text-5xl font-semibold tracking-tight">
          Audit ledger
        </h1>
        <p className="mt-3 max-w-xl text-[17px] leading-7 text-muted-foreground">
          Append-only. Screener raises, drafter cites, human decides. Survive a
          sandbox rebuild because this lives in Mongo, not in the agent.
        </p>
        <div className="mt-10 overflow-hidden rounded-[2rem] bg-muted p-2">
          <div className="rounded-[1.5rem] bg-background">
            {rows.map((r) => (
              <div
                key={String(r._id)}
                className="grid grid-cols-[6rem_8rem_1fr] gap-4 border-b px-5 py-4 text-sm last:border-b-0"
              >
                <span className="text-muted-foreground">
                  {r.ts ? new Date(r.ts).toISOString().slice(11, 19) : ""}
                </span>
                <span>{String(r.agent)}</span>
                <span>
                  <span className="font-medium">{String(r.action)}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {String(r.alert_id)} — {String(r.rationale ?? "")}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Shell>
  );
}

import { Shell } from "@/components/shell";
import { listAudit } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const rows = await listAudit(60);
  return (
    <Shell current="/audit">
      <main className="mx-auto max-w-6xl px-6 py-8 pb-24">
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          What the rule engine did, what the drafter wrote, and what you
          recorded. Kept in Mongo on this machine so a sandbox rebuild does not
          wipe the case history.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[5.5rem_7rem_1fr] gap-3 border-b bg-muted/50 px-4 py-2 text-[11px] tracking-wide text-muted-foreground uppercase">
            <span>Time</span>
            <span>Actor</span>
            <span>Event</span>
          </div>
          {rows.map((r) => (
            <div
              key={String(r._id)}
              className="grid grid-cols-[5.5rem_7rem_1fr] gap-3 border-b px-4 py-3 text-sm last:border-b-0"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {r.ts ? new Date(r.ts).toISOString().slice(11, 19) : ""}
              </span>
              <span className="text-xs">{String(r.agent)}</span>
              <span className="min-w-0">
                <span className="font-medium">{String(r.action)}</span>
                <span className="text-muted-foreground">
                  {" "}
                  {String(r.alert_id)} — {String(r.rationale ?? "")}
                </span>
              </span>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}

import { Shell } from "@/components/shell";
import { listAudit } from "@/lib/exitplan";
import { auditAction, auditActor } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const rows = await listAudit(80);
  return (
    <Shell current="/audit">
      <main className="mx-auto max-w-6xl px-6 py-10 pb-24">
        <h1 className="text-4xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
          Alerts opened by monitoring, dispositions drafted, and analyst
          decisions. Kept for audit.
        </p>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {rows.map((r) => (
            <div key={String(r._id)} className="grid gap-1 px-5 py-4 sm:grid-cols-[7rem_9rem_1fr]">
              <p className="text-base text-muted-foreground">
                {r.ts
                  ? new Date(r.ts).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""}
              </p>
              <p className="text-base">{auditActor(String(r.agent))}</p>
              <div>
                <p className="text-lg font-medium">{auditAction(String(r.action))}</p>
                <p className="text-base leading-7 text-muted-foreground">
                  {String(r.alert_id)} — {String(r.rationale ?? "")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}

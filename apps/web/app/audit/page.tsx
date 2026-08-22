import { Shell } from "@/components/shell";
import { listAudit } from "@/lib/exitplan";
import { auditAction, auditActor } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const rows = await listAudit(80);
  return (
    <Shell current="/audit">
      <main className="mx-auto max-w-6xl px-5 py-6 pb-16">
        <h1 className="text-xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Alerts opened by monitoring, dispositions drafted, and analyst
          decisions. Kept for audit.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {rows.map((r) => (
            <div
              key={String(r._id)}
              className="grid gap-1 border-b border-border px-4 py-2 text-sm last:border-b-0 sm:grid-cols-[5.5rem_7rem_1fr]"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {r.ts
                  ? new Date(r.ts).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""}
              </p>
              <p className="text-xs">{auditActor(String(r.agent))}</p>
              <p className="min-w-0">
                <span className="font-medium">{auditAction(String(r.action))}</span>
                <span className="text-muted-foreground">
                  {" "}
                  {String(r.alert_id)} — {String(r.rationale ?? "")}
                </span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </Shell>
  );
}

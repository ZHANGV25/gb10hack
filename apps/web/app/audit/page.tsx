import Link from "next/link";

import { Dot, Pill } from "@/components/pill";
import { Page, Shell } from "@/components/shell";
import { listAudit } from "@/lib/exitplan";
import { auditAction, auditActor, auditTone } from "@/lib/format";

export const dynamic = "force-dynamic";

const LEGEND = [
  { agent: "monitoring", note: "Opened the case from a rule" },
  { agent: "drafter", note: "Wrote a disposition — never a decision" },
  { agent: "human", note: "Dismissed, referred or reported" },
];

export default async function AuditPage() {
  const rows = await listAudit(120);

  return (
    <Shell current="/audit">
      <Page
        title="Activity"
        lede="Every alert opened, disposition drafted and decision recorded, with who did it and why. Entries are appended and never edited."
        aside={
          <div className="flex flex-wrap gap-1.5">
            {LEGEND.map((l) => (
              <Pill key={l.agent} tone={auditTone(l.agent)}>
                <Dot tone={auditTone(l.agent)} />
                {auditActor(l.agent)}
              </Pill>
            ))}
          </div>
        }
      >
        <ol className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {rows.map((r) => {
            const agent = String(r.agent);
            const tone = auditTone(agent);
            const alertId = r.alert_id ? String(r.alert_id) : "";
            return (
              <li
                key={String(r._id)}
                className="relative grid gap-1 border-b border-hairline px-4 py-2.5 last:border-b-0 md:grid-cols-[5rem_8rem_1fr] md:items-baseline md:gap-4 md:py-2"
              >
                <span
                  className={`absolute inset-y-0 left-0 w-[2px] ${
                    tone === "flag"
                      ? "bg-flag"
                      : tone === "watch"
                        ? "bg-watch"
                        : "bg-muted-foreground/30"
                  }`}
                  aria-hidden
                />
                <p className="font-mono text-[12px] text-muted-foreground">
                  {r.ts
                    ? new Date(r.ts).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : ""}
                </p>
                <p className="text-[13px]">{auditActor(agent)}</p>
                <p className="min-w-0 text-[13px] leading-5">
                  <span className="font-medium">
                    {auditAction(String(r.action))}
                  </span>
                  {alertId ? (
                    <>
                      {" · "}
                      <Link
                        href={`/alerts/${alertId}`}
                        className="font-mono text-[12px] underline-offset-2 hover:underline"
                      >
                        {alertId}
                      </Link>
                    </>
                  ) : null}
                  {r.rationale ? (
                    <span className="text-muted-foreground">
                      {" — "}
                      {String(r.rationale)}
                    </span>
                  ) : null}
                </p>
              </li>
            );
          })}
          {rows.length === 0 ? (
            <li className="px-4 py-8 text-center text-[14px] text-muted-foreground">
              No activity recorded yet.
            </li>
          ) : null}
        </ol>
      </Page>
    </Shell>
  );
}

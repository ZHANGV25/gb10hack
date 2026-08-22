import Link from "next/link";

import { Dot, Pill } from "@/components/pill";
import { Page, Shell } from "@/components/shell";
import { listActivity } from "@/lib/dora";

export const dynamic = "force-dynamic";

const KIND: Record<string, { label: string; tone: "flag" | "watch" | "clear" }> = {
  "watcher-started": { label: "Agent started", tone: "clear" },
  "contract-registered": { label: "Contract registered", tone: "clear" },
  review: { label: "Contract read", tone: "watch" },
  "re-review": { label: "Re-checked against policy", tone: "watch" },
  "review-complete": { label: "Review complete", tone: "watch" },
  "memory-changed": { label: "Reviewer taught a rule", tone: "flag" },
  "re-evaluate": { label: "Register re-evaluated", tone: "flag" },
};

export default async function ActivityPage() {
  const rows = await listActivity(80);

  return (
    <Shell current="/activity">
      <Page
        title="Agent activity"
        lede="The agent watches the register continuously. Registering a contract makes it read the document; teaching it a rule makes it re-check everything it has already read. Both are recorded here with what changed."
        aside={
          <Pill tone="clear">
            <Dot tone="clear" />
            {rows.length} events
          </Pill>
        }
      >
        <ol className="overflow-hidden rounded-lg border border-hairline bg-surface">
          {rows.map((r) => {
            const meta = KIND[String(r.kind)] ?? {
              label: String(r.kind),
              tone: "clear" as const,
            };
            const changed = Array.isArray(r.changed) ? r.changed : [];
            return (
              <li
                key={String(r._id)}
                className="relative border-b border-hairline px-4 py-2.5 last:border-b-0"
              >
                <span
                  className={`absolute inset-y-0 left-0 w-[2px] ${
                    meta.tone === "flag"
                      ? "bg-flag"
                      : meta.tone === "watch"
                        ? "bg-watch"
                        : "bg-muted-foreground/30"
                  }`}
                  aria-hidden
                />
                <div className="grid gap-1 md:grid-cols-[5.5rem_1fr_auto] md:items-baseline md:gap-4">
                  <p className="font-mono text-[12px] text-muted-foreground">
                    {r.started_at
                      ? new Date(String(r.started_at)).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : ""}
                  </p>
                  <p className="min-w-0 text-[13px] leading-5">
                    <span className="font-medium">{meta.label}</span>
                    {r.ref ? (
                      <>
                        {" · "}
                        <Link
                          href={`/contracts/${String(r.ref)}`}
                          className="font-mono text-[12px] underline-offset-2 hover:underline"
                        >
                          {String(r.ref)}
                        </Link>
                      </>
                    ) : null}
                    {r.decision ? (
                      <span className="text-muted-foreground">
                        {" — "}
                        {String(r.decision)}
                      </span>
                    ) : null}
                    {r.kind === "re-evaluate" ? (
                      <span className="text-muted-foreground">
                        {" — "}
                        {String(r.checked ?? 0)} contracts re-checked,{" "}
                        {String(r.changed_count ?? 0)} verdict
                        {Number(r.changed_count ?? 0) === 1 ? "" : "s"} changed
                      </span>
                    ) : null}
                    {changed.length ? (
                      <span className="mt-1 block space-y-0.5">
                        {changed.map((c: Record<string, unknown>) => (
                          <span
                            key={String(c.ref)}
                            className="block text-[12px] text-foreground/80"
                          >
                            <span className="font-mono">{String(c.ref)}</span>{" "}
                            {String(c.vendor ?? "")}: {String(c.from)} &rarr;{" "}
                            <span className="font-medium">{String(c.to)}</span>
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </p>
                  <p className="font-mono text-[12px] text-muted-foreground md:text-right">
                    {typeof r.seconds === "number" ? `${r.seconds}s` : ""}
                  </p>
                </div>
              </li>
            );
          })}
          {rows.length === 0 ? (
            <li className="px-4 py-8 text-center text-[14px] text-muted-foreground">
              No activity yet. Start the agent and it will report here.
            </li>
          ) : null}
        </ol>
      </Page>
    </Shell>
  );
}

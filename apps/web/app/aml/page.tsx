import { AlertQueue } from "@/components/alert-queue";
import { HowItWorks } from "@/components/how-it-works";
import { Page, Shell } from "@/components/shell";
import { listAlerts, stats } from "@/lib/exitplan";
import { euros } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [alerts, s] = await Promise.all([listAlerts(), stats()]);
  const openCases = alerts.filter((a) => !a.humanDecision);
  const open = openCases.length;
  const value = openCases.reduce((sum, a) => sum + a.exposureEur, 0);
  const bySeverity = (level: string) =>
    openCases.filter((a) => a.severity === level).length;

  return (
    <Shell current="/aml">
      <Page
        title="Alert queue"
        lede={
          <>
            Monitoring screened {s.transactions} payments across {s.customers}{" "}
            customers and opened {s.total} cases. Each one needs an analyst to
            dismiss it, refer it, or report it.
          </>
        }
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Awaiting your decision"
            value={String(open)}
            sub={`${bySeverity("red_flag")} red flag · ${bySeverity("review")} review · ${bySeverity("noise")} likely false`}
            emphasis
          />
          <Stat
            label="Value in review"
            value={euros(value)}
            sub="Across the open cases"
          />
          <Stat
            label="Decisions recorded"
            value={String(s.decided)}
            sub={`${s.filed} reported to the FIU · ${s.escalated} referred · ${s.dismissed} dismissed`}
          />
          <Stat
            label="Where this runs"
            value="This building"
            sub="Screening, retrieval and drafting — nothing is sent to a third party"
          />
        </div>

        <div className="mt-4">
          <HowItWorks />
        </div>

        <div className="mt-6">
          <AlertQueue alerts={alerts} />
        </div>
      </Page>
    </Shell>
  );
}

function Stat({
  label,
  value,
  sub,
  emphasis,
}: {
  label: string;
  value: string;
  sub: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-[22px] leading-7 font-semibold tracking-tight tabular-nums ${
          emphasis ? "" : "text-foreground/90"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{sub}</p>
    </div>
  );
}

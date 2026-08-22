import Link from "next/link";

import { AlertQueue } from "@/components/alert-queue";
import { Shell } from "@/components/shell";
import { listAlerts, stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [alerts, s] = await Promise.all([listAlerts(), stats()]);
  const demoReview = alerts.find((a) => a.demoRole === "review");
  const demoRed = alerts.find((a) => a.demoRole === "red_flag");
  return (
    <Shell current="/">
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <h1 className="font-heading text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            Draft.
            <br />
            Never decide.
          </h1>
          <div className="space-y-6">
            <p className="max-w-md text-[17px] leading-7 text-muted-foreground">
              On-box financial-crime triage. A deterministic screener raises
              the alert. The model drafts and cites. A human files. Unplug the
              network — it keeps working. That is DORA Article 28(8), running.
            </p>
            <div className="flex flex-wrap gap-3">
              {demoReview ? (
                <Link
                  href={`/alerts/${demoReview.alertId}`}
                  className="rounded-full bg-foreground px-5 py-2.5 text-sm text-background"
                >
                  Open a review case
                </Link>
              ) : null}
              {demoRed ? (
                <Link
                  href={`/alerts/${demoRed.alertId}`}
                  className="rounded-full border border-border bg-background px-5 py-2.5 text-sm"
                >
                  Open the red flag
                </Link>
              ) : null}
            </div>
          </div>
        </section>
        <p className="mb-4 text-sm text-muted-foreground">
          {s.total} synthetic alerts · {s.noise} noise · {s.review} review ·{" "}
          {s.redFlag} red flag · {s.decided} human decisions
        </p>
        <AlertQueue alerts={alerts} />
      </main>
    </Shell>
  );
}

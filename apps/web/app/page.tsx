import { Eyebrow } from "@/components/pill";
import { RegisterTable } from "@/components/register-table";
import { Page, Shell } from "@/components/shell";
import { WhatItDoes } from "@/components/what-it-does";
import { gapFrequency, listRegister, registerSummary } from "@/lib/dora";
import { euros } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const [rows, s, gaps] = await Promise.all([
    listRegister(),
    registerSummary(),
    gapFrequency(),
  ]);

  return (
    <Shell current="/">
      <Page
        title="ICT third-party register"
        lede={
          <>
            Every arrangement Nordhafen Bank relies on for ICT services, checked
            against the provisions DORA Article 30 requires the contract to
            contain. {s.critical} of {s.contracts} support a critical or
            important function, which is where the longer list applies.
          </>
        }
      >
        <div className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Arrangements with gaps"
            value={String(s.escalate + s.reject)}
            sub={`${s.reject} not compliant · ${s.escalate} to close · ${s.approve} clean`}
            emphasis
          />
          <Stat
            label="Cannot be cleanly exited"
            value={euros(s.exposureEur)}
            sub="Annual charge on arrangements missing a blocking provision"
          />
          <Stat
            label="Article 30 gaps found"
            value={String(s.gapCount)}
            sub={`${s.blockingCount} blocking · across ${s.reviewed} contracts read`}
          />
          <Stat
            label="Total contracted"
            value={euros(s.annualValueEur)}
            sub={`${s.contracts} suppliers · ${s.pending} not yet read`}
          />
        </div>

        <div className="mt-4">
          <WhatItDoes />
        </div>

        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
          <RegisterTable rows={rows} />

          <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
            <div className="border-b border-hairline px-4 py-2">
              <h2 className="text-[12px] font-medium">
                Where the estate is weakest
              </h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                The same provision missing across several suppliers is a
                contracting problem, not a supplier problem.
              </p>
            </div>
            {gaps.length ? (
              <ul className="divide-y divide-hairline">
                {gaps.map((g) => (
                  <li key={g.provision} className="px-4 py-2.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        DORA {g.article}
                      </span>
                      <span className="font-mono text-[12px] tabular-nums">
                        {g.contracts}
                        <span className="text-muted-foreground">
                          {g.contracts === 1 ? " contract" : " contracts"}
                        </span>
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] leading-5">{g.label}</p>
                    {g.severity === "blocking" ? (
                      <p className="mt-0.5 text-[10px] text-flag">
                        Blocking — the bank cannot evidence an exit or a right
                        to inspect
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-[12px] text-muted-foreground">
                No gaps recorded yet. The agent is still reading the register.
              </p>
            )}
            <div className="border-t border-hairline px-4 py-2.5">
              <Eyebrow>Aggregated live</Eyebrow>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                Counted across the latest verdict for each contract, in the
                database rather than in the page.
              </p>
            </div>
          </section>
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

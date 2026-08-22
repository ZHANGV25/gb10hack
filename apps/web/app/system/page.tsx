import { Eyebrow } from "@/components/pill";
import { Page, Shell } from "@/components/shell";
import { SystemDiagram } from "@/components/system-diagram";
import { PIPELINE } from "@/lib/architecture";
import { stats } from "@/lib/exitplan";

export const dynamic = "force-dynamic";

const GUARDRAILS = [
  {
    title: "Rules open every case, never the model",
    body: "Screening is deterministic. The drafting assistant is told monitoring has already decided an alert exists, and it cannot create one.",
  },
  {
    title: "The draft is retrieval-grounded",
    body: "Policy is fetched by vector search before a word is written, and the memo cites the passages it was given.",
  },
  {
    title: "Abstention is a valid answer",
    body: "When the evidence is thin the draft is expected to say so and recommend referral rather than guess.",
  },
  {
    title: "An exact sanctions match cannot be dismissed",
    body: "The block is enforced in the decision route, not only in the interface, so it holds however the request arrives.",
  },
  {
    title: "The activity log is append-only",
    body: "Alerts, drafts and decisions are written with their actor and reason and are never edited in place.",
  },
  {
    title: "Nothing leaves the building",
    body: "Screening, embeddings, retrieval, drafting and storage all run on hardware inside the bank. Unplug the network and the desk keeps working.",
  },
];

export default async function SystemPage() {
  const s = await stats();
  const counts = {
    customers: s.customers,
    alerts: s.total,
    corpus: s.corpus,
    drafts: s.drafts,
    decided: s.decided,
    audit: s.audit,
  };

  return (
    <Shell current="/system">
      <Page
        title="How it works"
        lede="Every case follows the same path, and the counts below are read live from the case store. The split that matters: rules open cases, retrieval grounds the draft, and only an analyst can dismiss, refer or report."
      >
        <SystemDiagram counts={counts} transactions={s.transactions} />

        <section className="mt-6">
          <Eyebrow>Stage by stage</Eyebrow>
          <ol className="mt-2 overflow-hidden rounded-lg border border-hairline bg-surface">
            {PIPELINE.map((step) => (
              <li
                key={step.id}
                className="grid gap-1 border-b border-hairline px-4 py-2.5 last:border-b-0 md:grid-cols-[1.4fr_2fr_auto] md:items-baseline md:gap-4"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {String(step.n).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium">{step.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {step.actor}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] leading-5 text-muted-foreground">
                  {step.summary}
                </p>
                <div className="md:text-right">
                  <p className="font-mono text-[12px] tabular-nums">
                    {counts[step.countKey]}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {step.countLabel}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6">
          <Eyebrow>Guardrails</Eyebrow>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {GUARDRAILS.map((g) => (
              <li
                key={g.title}
                className="rounded-lg border border-hairline bg-surface px-3.5 py-2.5"
              >
                <p className="flex items-start gap-2 text-[12px] font-medium">
                  <svg
                    viewBox="0 0 14 14"
                    className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <circle cx="7" cy="7" r="5.6" />
                    <path
                      d="M4.6 7.2 6.3 8.9 9.6 5.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {g.title}
                </p>
                <p className="mt-1 pl-5.5 text-[11px] leading-[1.5] text-muted-foreground">
                  {g.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Page>
    </Shell>
  );
}

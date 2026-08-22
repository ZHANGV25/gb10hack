import { DoraDiagram } from "@/components/dora-diagram";
import { Eyebrow } from "@/components/pill";
import { Page, Shell } from "@/components/shell";
import { systemCounts } from "@/lib/dora";
import { PROVISIONS } from "@/lib/provisions";

export const dynamic = "force-dynamic";

const MONGO = [
  {
    feature: "$vectorSearch with pre-filters",
    where: "rules_vector — 1024-dimension cosine kNN, filtered on active and provision",
    why: "The agent's memory is retrieved by meaning, so a rule written about one supplier surfaces on another with the same weakness. Retired rules stay for audit but are filtered out of retrieval.",
  },
  {
    feature: "Change streams",
    where: "db.contracts.watch() and db.rules.watch(), with resume tokens persisted",
    why: "This is what makes the agent always-on. Registering a contract or teaching a rule wakes it directly — no cron, no polling, and a restart resumes rather than replaying.",
  },
  {
    feature: "Correlated $lookup",
    where: "The register joins each contract to its most recent verdict in one pipeline",
    why: "One round trip instead of a query per row, with the large fields projected away before they cross the wire.",
  },
  {
    feature: "Aggregation over nested arrays",
    where: "$unwind + $group across verdicts.gaps to rank the estate's weakest provisions",
    why: "The same provision missing across several suppliers is a contracting problem. That is computed in the database, not in the page.",
  },
  {
    feature: "Self-updating search indexes",
    where: "Index definitions are compared on start-up and updated or rebuilt if they drift",
    why: "A vector index built at the wrong width silently returns nothing. Making the definition declarative removes the failure mode.",
  },
  {
    feature: "One deployment, three jobs",
    where: "Operational register, vector store and event bus in the same database",
    why: "No second system to run on-premises, and no data leaving it.",
  },
];

export default async function SystemPage() {
  const c = await systemCounts();

  return (
    <Shell current="/system">
      <Page
        title="How it works"
        lede="An always-on agent that reads the bank's ICT contracts against DORA Article 30, and gets better because reviewers correct it — not because anyone retrains it. Counts below are read live from the register."
      >
        <DoraDiagram counts={c} />

        <section className="mt-6">
          <Eyebrow>What it checks</Eyebrow>
          <p className="mt-1 max-w-3xl text-[12px] leading-5 text-muted-foreground">
            Article 30(2) applies to every ICT arrangement. Article 30(3) adds
            six more where the arrangement supports a critical or important
            function. Three of them are treated as blocking: without an exit
            route, an audit right or a way to get the data back, the bank cannot
            evidence Article 28(8) at all.
          </p>
          <ol className="mt-2 overflow-hidden rounded-lg border border-hairline bg-surface">
            {PROVISIONS.map((p) => (
              <li
                key={p.key}
                className="grid gap-1 border-b border-hairline px-4 py-2 last:border-b-0 md:grid-cols-[5.5rem_1.3fr_2fr_auto] md:items-baseline md:gap-4"
              >
                <span className="font-mono text-[11px] text-muted-foreground">
                  {p.article}
                </span>
                <span className="text-[12px] font-medium">{p.label}</span>
                <span className="text-[12px] leading-5 text-muted-foreground">
                  {p.plain}
                </span>
                <span className="flex justify-end gap-1">
                  {p.critical ? (
                    <span className="rounded border border-hairline px-1 py-px text-[9px] tracking-wide text-muted-foreground uppercase">
                      critical only
                    </span>
                  ) : null}
                  {p.blocking ? (
                    <span className="rounded border border-flag/30 bg-flag-soft px-1 py-px text-[9px] tracking-wide text-flag uppercase">
                      blocking
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6">
          <Eyebrow>What MongoDB is doing</Eyebrow>
          <ul className="mt-2 grid gap-2 lg:grid-cols-2">
            {MONGO.map((m) => (
              <li
                key={m.feature}
                className="rounded-lg border border-hairline bg-surface px-3.5 py-2.5"
              >
                <p className="text-[12px] font-medium">{m.feature}</p>
                <p className="mt-0.5 font-mono text-[10px] leading-4 text-muted-foreground">
                  {m.where}
                </p>
                <p className="mt-1.5 text-[11px] leading-[1.55] text-muted-foreground">
                  {m.why}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <Eyebrow>What the agent is not allowed to do</Eyebrow>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {[
              ["It cannot decide, only report", "Every verdict comes from the deterministic checklist or from a rule a named person wrote. The model contributes clauses and quotes."],
              ["It cannot cite what it did not find", "A provision claimed present with no verbatim quote behind it is recorded as absent."],
              ["It cannot invent a gap", "A learned rule only fires on a provision the checklist already found missing."],
              ["It cannot bless an un-exitable contract", "An accepted exception softens a verdict by one step and never turns a rejection into approval on its own."],
              ["Its memory is legible", "Every rule is a sentence in plain language with an author and a date, and any of it can be switched off."],
              ["Nothing leaves the building", "Reading, embedding, retrieval and storage all run on the bank's own hardware."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-lg border border-hairline bg-surface px-3.5 py-2.5">
                <p className="flex items-start gap-2 text-[12px] font-medium">
                  <svg viewBox="0 0 14 14" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <circle cx="7" cy="7" r="5.6" />
                    <path d="M4.6 7.2 6.3 8.9 9.6 5.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {title}
                </p>
                <p className="mt-1 pl-5.5 text-[11px] leading-[1.5] text-muted-foreground">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Page>
    </Shell>
  );
}

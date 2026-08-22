import { Eyebrow } from "@/components/pill";
import type { PipelineCounts } from "@/lib/architecture";

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1 self-center px-1 text-muted-foreground">
      {label ? (
        <span className="hidden text-[10px] whitespace-nowrap xl:inline">
          {label}
        </span>
      ) : null}
      <svg viewBox="0 0 24 8" className="h-2 w-6" aria-hidden>
        <path
          d="M0 4h20M17 1l3 3-3 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Down() {
  return (
    <div className="flex justify-center py-1.5 text-muted-foreground">
      <svg viewBox="0 0 8 24" className="h-6 w-2" aria-hidden>
        <path
          d="M4 0v20M1 17l3 3 3-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Node({
  title,
  body,
  tech,
  meta,
  accent,
}: {
  title: string;
  body: string;
  tech?: string;
  meta?: string;
  accent?: "solid" | "muted";
}) {
  return (
    <div
      className={`min-w-0 flex-1 rounded-md border px-3 py-2.5 ${
        accent === "solid"
          ? "border-foreground bg-foreground text-background"
          : accent === "muted"
            ? "border-hairline bg-surface-muted/60"
            : "border-hairline bg-surface"
      }`}
    >
      <p className="text-[12px] leading-4 font-medium">{title}</p>
      <p
        className={`mt-1 text-[11px] leading-[1.45] ${
          accent === "solid" ? "text-background/75" : "text-muted-foreground"
        }`}
      >
        {body}
      </p>
      {tech ? (
        <p
          className={`mt-1.5 font-mono text-[10px] leading-4 ${
            accent === "solid" ? "text-background/60" : "text-muted-foreground/80"
          }`}
        >
          {tech}
        </p>
      ) : null}
      {meta ? (
        <p
          className={`mt-1 text-[10px] ${
            accent === "solid" ? "text-background/70" : "text-foreground/70"
          }`}
        >
          {meta}
        </p>
      ) : null}
    </div>
  );
}

function Band({
  n,
  title,
  note,
  children,
}: {
  n: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface/60 p-3">
      <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="font-mono text-[10px] text-muted-foreground">{n}</span>
        <h3 className="text-[12px] font-medium">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{note}</p>
      </div>
      {children}
    </div>
  );
}

const COLLECTIONS = [
  { name: "customers", note: "Account and KYC records", key: "customers" as const },
  { name: "transactions", note: "Payments screened", key: null },
  { name: "alerts", note: "Cases opened by rules", key: "alerts" as const },
  {
    name: "corpus",
    note: "Policy passages + 1024-d vectors",
    key: "corpus" as const,
    vector: true,
  },
  { name: "dispositions", note: "Drafts and recorded decisions", key: "drafts" as const },
  { name: "audit_log", note: "Append-only, every actor", key: "audit" as const },
];

export function SystemDiagram({
  counts,
  transactions,
}: {
  counts: PipelineCounts;
  transactions: number;
}) {
  return (
    <div className="rounded-lg border border-dashed border-foreground/25 bg-background p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="flex items-center gap-1.5 text-[11px] font-medium">
          <span className="ep-live size-1.5 rounded-full bg-emerald-500" />
          Everything inside this boundary runs on the bank&rsquo;s own hardware
        </p>
        <p className="text-[11px] text-muted-foreground">
          No case text, customer record or payment leaves the network
        </p>
      </div>

      <div className="space-y-2">
        <Band
          n="01"
          title="Where a case comes from"
          note="Rules decide what opens. The model is not involved."
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="Core banking"
              body="Account details, KYC and outgoing payments land in the case store."
              tech="MongoDB · customers, transactions"
              meta={`${counts.customers} customers · ${transactions} payments`}
            />
            <Arrow label="every payment" />
            <Node
              title="Monitoring rules"
              body="Sanctions-name scoring, payments just under €10,000, high-risk jurisdictions."
              tech="Deterministic screener · no language model"
              meta="Rules own the hit"
            />
            <Arrow label="rule fires" />
            <Node
              title="Alert queue"
              body="One case per hit, carrying the rule, the score and the payments behind it."
              tech="MongoDB · alerts"
              meta={`${counts.alerts} open cases`}
            />
          </div>
        </Band>

        <Down />

        <Band
          n="02"
          title="How the draft is grounded"
          note="Retrieval first, so the memo can only cite text that exists."
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="Case as a query"
              body="The customer, the rule that fired and the payments become one retrieval query."
              tech="Next.js route · /api/chat"
            />
            <Arrow />
            <Node
              title="Embedding model"
              body="The query is turned into a 1024-dimension vector on the box."
              tech="Local embedding model · 1024-d"
            />
            <Arrow />
            <Node
              title="Vector search"
              body="Cosine nearest-neighbour over the policy library, top 4 passages returned with scores."
              tech="MongoDB $vectorSearch · index corpus_vector"
              meta={`${counts.corpus} passages indexed`}
              accent="solid"
            />
          </div>
        </Band>

        <Down />

        <Band
          n="03"
          title="Who writes and who decides"
          note="The split that makes this legal to run."
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="Disposition draft"
              body="A local language model writes the memo from the retrieved passages and cites them. It has no dismiss, escalate or file capability at all."
              tech="Local language model · streams to the desk"
              meta={`${counts.drafts} dispositions on file`}
            />
            <Arrow label="recommendation only" />
            <Node
              title="Analyst decision"
              body="Dismiss as a false positive, refer to the MLRO, or submit a SAR to the FIU. An exact sanctions match is blocked from dismissal server-side."
              tech="Next.js route · /api/decide · red-flag gate"
              meta={`${counts.decided} decisions recorded`}
              accent="solid"
            />
          </div>
        </Band>

        <Down />

        <Band
          n="04"
          title="What is kept"
          note="One database holds the case data, the policy vectors and the audit trail."
        >
          <div className="rounded-md border border-hairline bg-surface p-3">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <Eyebrow>MongoDB · database exitplan</Eyebrow>
              <p className="font-mono text-[10px] text-muted-foreground">
                operational store + vector store, one deployment
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {COLLECTIONS.map((c) => (
                <li
                  key={c.name}
                  className="rounded-md border border-hairline bg-surface-muted/50 px-2.5 py-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[11px]">{c.name}</span>
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {c.key ? counts[c.key] : transactions}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                    {c.note}
                  </p>
                  {c.vector ? (
                    <p className="mt-1 inline-flex rounded border border-hairline px-1 py-px font-mono text-[9px] text-muted-foreground">
                      vectorSearch index · cosine
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Band>
      </div>
    </div>
  );
}

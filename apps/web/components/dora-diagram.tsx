import { Eyebrow } from "@/components/pill";

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1 self-center px-1 text-muted-foreground">
      {label ? (
        <span className="hidden text-[11px] whitespace-nowrap xl:inline">{label}</span>
      ) : null}
      <svg viewBox="0 0 24 8" className="h-2 w-6" aria-hidden>
        <path d="M0 4h20M17 1l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Down({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1.5 text-muted-foreground">
      <svg viewBox="0 0 8 24" className="h-6 w-2" aria-hidden>
        <path d="M4 0v20M1 17l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label ? <span className="text-[11px]">{label}</span> : null}
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
      <p className="text-[13px] leading-4 font-medium">{title}</p>
      <p className={`mt-1 text-[12px] leading-[1.45] ${accent === "solid" ? "text-background/75" : "text-muted-foreground"}`}>
        {body}
      </p>
      {tech ? (
        <p className={`mt-1.5 font-mono text-[11px] leading-4 ${accent === "solid" ? "text-background/60" : "text-muted-foreground/80"}`}>
          {tech}
        </p>
      ) : null}
      {meta ? (
        <p className={`mt-1 text-[11px] ${accent === "solid" ? "text-background/70" : "text-foreground/70"}`}>
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
        <span className="font-mono text-[11px] text-muted-foreground">{n}</span>
        <h3 className="text-[13px] font-medium">{title}</h3>
        <p className="text-[12px] text-muted-foreground">{note}</p>
      </div>
      {children}
    </div>
  );
}

export type DiagramCounts = {
  contracts: number;
  critical: number;
  reviewed: number;
  rules: number;
  verdicts: number;
  runs: number;
  gaps: number;
  chunks: number;
  filed: number;
};

const COLLECTIONS = [
  { name: "contracts", note: "The Art. 28(3) register itself", key: "contracts" as const },
  { name: "chunks", note: "Long contracts, split and searchable", key: "chunks" as const, vector: true },
  { name: "verdicts", note: "One per review, with every quoted clause", key: "verdicts" as const },
  { name: "rules", note: "The memory — vector searchable", key: "rules" as const, vector: true },
  { name: "corrections", note: "Who taught what, and from which contract", key: null },
  { name: "runs", note: "Append-only agent activity", key: "runs" as const },
  { name: "watch_state", note: "Change-stream resume tokens", key: null },
];

export function DoraDiagram({ counts }: { counts: DiagramCounts }) {
  return (
    <div className="rounded-lg border border-dashed border-foreground/25 bg-background p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="flex items-center gap-1.5 text-[12px] font-medium">
          <span className="ep-live size-1.5 rounded-full bg-emerald-500" />
          Everything inside this boundary runs on the bank&rsquo;s own hardware
        </p>
        <p className="text-[12px] text-muted-foreground">
          No contract text leaves the network
        </p>
      </div>

      <div className="space-y-2">
        <Band n="01" title="The register" note="Every ICT arrangement the bank depends on.">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="Contract lands in the register"
              body="Signed ICT agreements are recorded with the supplier, the function they support, the annual charge, and whether that function is critical or important."
              tech="MongoDB · contracts"
              meta={`${counts.contracts} arrangements · ${counts.critical} critical · ${counts.filed} real SEC filings`}
            />
            <Arrow label="change stream" />
            <Node
              title="The agent notices"
              body="A watcher is subscribed to the collection. A new or amended contract wakes it — there is no schedule and no polling loop."
              tech="db.contracts.watch() · resume token stored"
              meta="always on"
              accent="solid"
            />
          </div>
        </Band>

        <Down label="the agent reads the document" />

        <Band
          n="02"
          title="Reading the contract"
          note="A real filed agreement does not fit in the context window."
        >
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="Split into passages"
              body="A contract over 18,000 characters is chunked with overlap and embedded, so no clause is lost on a boundary. Short ones are read whole."
              tech="MongoDB · chunks"
              meta={`${counts.chunks} passages indexed`}
            />
            <Arrow label="per provision" />
            <Node
              title="Retrieve the clause, don't scan for it"
              body="Each of the fifteen provisions searches that contract's own passages for the text most likely to satisfy it. Truncating instead would lose the middle, where the operative clauses live."
              tech="MongoDB $vectorSearch · index chunks_vector · filter ref"
              meta="retrieval decides what the model sees"
              accent="solid"
            />
            <Arrow />
            <Node
              title="Answer and quote"
              body="Present, inadequate or absent for each provision, with the contract text it relied on. Kept, because which clauses a document contains does not change."
              tech="Local language model · strict JSON"
              meta={`${counts.reviewed} contracts read · no quote means absent`}
            />
          </div>
        </Band>

        <Down label="the checklist decides, not the model" />

        <Band n="03" title="Deciding" note="Deterministic first, memory second.">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="Gap analysis"
              body="Python compares what was found against what Art. 30(2) and 30(3) require. Missing exit rights, audit rights or data return are blocking; the rest are material."
              tech="assess.py · no model involved"
              meta={`${counts.gaps} gaps across the estate`}
            />
            <Arrow />
            <Node
              title="Memory is consulted"
              body="Each gap is searched separately against the rules the bank's reviewers wrote — one blended query dilutes, and the rule that decides the case ranks below the cut. A rule only fires where its provision is actually missing."
              tech="MongoDB $vectorSearch · index rules_vector · filter active + provision"
              meta={`${counts.rules} rules in memory`}
              accent="solid"
            />
          </div>
        </Band>

        <Down label="a reviewer disagrees" />

        <Band n="04" title="Learning" note="The part that makes it improve without retraining.">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <Node
              title="The reason becomes a rule"
              body="A reviewer who overrides a verdict writes one sentence. It is embedded and stored with their name and the contract that prompted it."
              tech="MongoDB · rules + corrections"
            />
            <Arrow label="change stream" />
            <Node
              title="The register re-checks itself"
              body="The rules stream wakes the agent, which re-runs the policy layer over every contract it has already read. The clauses did not change, so nothing needs re-reading."
              tech="reuse stored extraction · milliseconds, not minutes"
              meta={`${counts.runs} agent events recorded`}
              accent="solid"
            />
          </div>
        </Band>
      </div>

      <div className="mt-3 rounded-md border border-hairline bg-surface p-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <Eyebrow>MongoDB · database covenant</Eyebrow>
          <p className="font-mono text-[11px] text-muted-foreground">
            operational store, vector store and event bus — one deployment
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <li key={c.name} className="rounded-md border border-hairline bg-surface-muted/50 px-2.5 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[12px]">{c.name}</span>
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
                  {c.key ? counts[c.key] : ""}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{c.note}</p>
              {c.vector ? (
                <p className="mt-1 inline-flex rounded border border-hairline px-1 py-px font-mono text-[10px] text-muted-foreground">
                  vectorSearch · 1024-d cosine · filters
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

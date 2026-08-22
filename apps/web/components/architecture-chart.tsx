import { PIPELINE, completedStages, type PipelineCounts, type StageId } from "@/lib/architecture";

function boxClass(opts: { isCurrent: boolean; isDone: boolean }) {
  if (opts.isCurrent) {
    return "border-foreground bg-foreground text-background";
  }
  if (opts.isDone) {
    return "border-foreground/25 bg-background";
  }
  return "border-border bg-muted/40 text-muted-foreground";
}

export function ArchitectureChart({
  current,
  counts,
  compact = false,
}: {
  current?: StageId;
  counts?: PipelineCounts;
  compact?: boolean;
}) {
  const done = current ? new Set(completedStages(current)) : new Set<StageId>();
  const steps = compact
    ? PIPELINE.filter((s) => s.id !== "activity" && s.id !== "audit")
    : PIPELINE;

  return (
    <section className="rounded-xl border border-border p-4">
      <h2 className="text-sm font-medium">How a case moves</h2>
      {!compact ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Rules open the alert. Assisted drafting writes a memo. Only an
          analyst can dismiss, escalate, or file.
        </p>
      ) : (
        <p className="mt-0.5 text-xs text-muted-foreground">
          Highlighted step is where this case is now.
        </p>
      )}

      <ol
        className={
          compact
            ? "mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4"
            : "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {steps.map((step) => {
          const isCurrent = current === step.id;
          const isDone = Boolean(current) && done.has(step.id);
          const idle = !current;
          const cls = idle
            ? "border-border bg-background"
            : boxClass({ isCurrent, isDone });
          return (
            <li key={step.id} className={`rounded-lg border px-2.5 py-2 ${cls}`}>
              <p className={`text-[11px] ${isCurrent ? "text-background/75" : "text-muted-foreground"}`}>
                {step.n}. {step.actor}
              </p>
              <p className="mt-0.5 text-sm font-medium leading-5">{step.title}</p>
              {!compact ? (
                <p className={`mt-1 text-xs leading-5 ${isCurrent ? "text-background/80" : "text-muted-foreground"}`}>
                  {step.summary}
                </p>
              ) : null}
              {counts && !compact ? (
                <p className={`mt-1 text-[11px] ${isCurrent ? "text-background/70" : "text-muted-foreground"}`}>
                  {labelCount(step.countKey, counts)}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function labelCount(key: keyof PipelineCounts, counts: PipelineCounts) {
  if (key === "customers") return `${counts.customers} customer records`;
  if (key === "alerts") return `${counts.alerts} alerts opened by rules`;
  if (key === "drafts") return `${counts.drafts} dispositions on file`;
  if (key === "decided") return `${counts.decided} analyst decisions`;
  return `${counts.audit} activity events`;
}

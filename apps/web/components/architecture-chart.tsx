import { PIPELINE, completedStages, type PipelineCounts, type StageId } from "@/lib/architecture";

function boxClass(opts: { isCurrent: boolean; isDone: boolean }) {
  if (opts.isCurrent) {
    return "border-foreground bg-foreground text-background";
  }
  if (opts.isDone) {
    return "border-foreground/30 bg-background";
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
    <section
      className={
        compact
          ? "rounded-2xl border border-border p-5"
          : "rounded-2xl border border-border p-6 sm:p-8"
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={compact ? "text-lg font-semibold" : "text-2xl font-semibold"}>
            How a case moves
          </h2>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
              Rules open the alert. Assisted drafting writes a memo. Only an
              analyst can dismiss, escalate, or file.
            </p>
          ) : (
            <p className="mt-1 text-base text-muted-foreground">
              Highlighted step is where this case is now.
            </p>
          )}
        </div>
      </div>

      <ol
        className={
          compact
            ? "mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            : "mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
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
            <li key={step.id} className={`rounded-2xl border p-4 ${cls}`}>
              <p className={`text-sm font-medium ${isCurrent ? "text-background/80" : "text-muted-foreground"}`}>
                {step.n}. {step.actor}
              </p>
              <p className={`${compact ? "mt-1 text-lg" : "mt-2 text-xl"} font-semibold leading-snug`}>
                {step.title}
              </p>
              {!compact ? (
                <p
                  className={`mt-2 text-base leading-7 ${isCurrent ? "text-background/85" : ""}`}
                >
                  {step.summary}
                </p>
              ) : null}
              {counts && !compact ? (
                <p className={`mt-3 text-sm ${isCurrent ? "text-background/75" : "text-muted-foreground"}`}>
                  {labelCount(step.countKey, counts)}
                </p>
              ) : null}
              {isCurrent ? (
                <p className="mt-3 text-sm font-medium">This step</p>
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

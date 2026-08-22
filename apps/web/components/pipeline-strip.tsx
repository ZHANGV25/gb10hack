import { CASE_STAGES, PIPELINE, type StageId } from "@/lib/architecture";

const ORDER = PIPELINE.map((s) => s.id) as StageId[];

export function PipelineStrip({ current }: { current: StageId }) {
  const currentIdx = ORDER.indexOf(current);
  const steps = CASE_STAGES.map((id, i) => ({
    ...PIPELINE.find((s) => s.id === id)!,
    step: i + 1,
  }));

  return (
    <ol className="flex flex-wrap items-stretch gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
      {steps.map((step) => {
        const idx = ORDER.indexOf(step.id);
        const isCurrent = idx === currentIdx;
        const isDone = idx < currentIdx;
        return (
          <li
            key={step.id}
            className={`flex min-w-[150px] flex-1 items-center gap-2.5 px-3 py-2 transition-colors ${
              isCurrent ? "bg-foreground text-background" : "bg-surface"
            }`}
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${
                isCurrent
                  ? "border-background/40 bg-background/15 text-background"
                  : isDone
                    ? "border-transparent bg-foreground text-background"
                    : "border-hairline text-muted-foreground"
              }`}
            >
              {isDone ? (
                <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
                  <path
                    d="M2.5 6.2 4.8 8.5 9.5 3.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step.step
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] leading-4 font-medium">
                {step.title}
              </span>
              <span
                className={`block truncate text-[10px] leading-4 ${
                  isCurrent ? "text-background/70" : "text-muted-foreground"
                }`}
              >
                {step.actor}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

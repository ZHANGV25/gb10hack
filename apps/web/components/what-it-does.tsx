const STEPS = [
  {
    n: "1",
    title: "It reads every contract",
    body:
      "For each ICT arrangement the agent works through the fifteen provisions DORA Article 30 requires, and quotes the clause it relied on. Where a clause is missing — or looks reassuring but is capped, optional or one-sided — it says so.",
  },
  {
    n: "2",
    title: "You correct it",
    body:
      "A reviewer who disagrees writes the reason in one sentence. That sentence becomes a rule the agent keeps, alongside the contract that prompted it and the name of who wrote it.",
  },
  {
    n: "3",
    title: "It applies what it learned",
    body:
      "The rule is stored as a vector, so the agent finds it again on any contract with a similar gap — not just the one you were looking at. Teaching it once re-checks the whole register.",
  },
];

export function WhatItDoes() {
  return (
    <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <h2 className="text-[12px] font-medium">
          What this agent does
        </h2>
        <p className="text-[11px] text-muted-foreground">
          DORA Art. 28(3) register · Art. 30 contractual provisions
        </p>
      </div>
      <div className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STEPS.map((s) => (
          <div key={s.n} className="px-4 py-3">
            <p className="flex items-center gap-2 text-[12px] font-medium">
              <span className="flex size-4 items-center justify-center rounded-full bg-foreground font-mono text-[9px] text-background">
                {s.n}
              </span>
              {s.title}
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.55] text-muted-foreground">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

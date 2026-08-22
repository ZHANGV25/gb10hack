const STEPS = [
  {
    n: "1",
    title: "Rules open the case",
    body:
      "Monitoring compares every account and payment against the sanctions list, the €10,000 reporting threshold and the high-risk country list. The language model cannot open, close or invent a case.",
  },
  {
    n: "2",
    title: "The desk drafts the disposition",
    body:
      "Bank policy and the relevant EU articles are retrieved from the bank's own library, and a memo is written that cites them. It reads the case; it never rules on it.",
  },
  {
    n: "3",
    title: "You record the decision",
    body:
      "Dismiss as a false positive, refer to the MLRO, or submit a SAR to the FIU. Only an analyst can do any of the three, and an exact sanctions match cannot be dismissed at all.",
  },
];

export function HowItWorks() {
  return (
    <section className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <h2 className="text-[13px] font-medium">What this desk does</h2>
        <p className="text-[12px] text-muted-foreground">
          Screening, drafting and records all run inside the bank
        </p>
      </div>
      <div className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STEPS.map((s) => (
          <div key={s.n} className="px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] font-medium">
              <span className="flex size-4 items-center justify-center rounded-full bg-foreground font-mono text-[10px] text-background">
                {s.n}
              </span>
              {s.title}
            </p>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-muted-foreground">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

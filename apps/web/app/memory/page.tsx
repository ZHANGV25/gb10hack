import Link from "next/link";

import { Eyebrow, Pill } from "@/components/pill";
import { Page, Shell } from "@/components/shell";
import { listMemory } from "@/lib/dora";
import { PROVISION_BY_KEY } from "@/lib/provisions";

export const dynamic = "force-dynamic";

const ACTION_LABEL: Record<string, string> = {
  reject: "Treat as not compliant",
  escalate: "Raise to a gap that must be closed",
  accept_exception: "Accept as written",
};

export default async function MemoryPage() {
  const rules = await listMemory();
  const active = rules.filter((r) => r.active);

  return (
    <Shell current="/memory">
      <Page
        title="What it has learned"
        lede="Every rule here was written by a reviewer who disagreed with the agent. Nothing was retrained: each one is stored as a vector, and the agent finds it again on any contract with a similar gap. This is the whole of the agent's judgement — you can read it, and you can switch any of it off."
      >
        {rules.length === 0 ? (
          <p className="rounded-lg border border-hairline bg-surface px-4 py-8 text-center text-[14px] text-muted-foreground">
            Nothing learned yet. Disagree with an assessment on any contract and
            the reason you write appears here.
          </p>
        ) : (
          <>
            <div className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
              <Cell label="Rules in memory" value={String(active.length)} sub="all written by a reviewer" />
              <Cell
                label="Currently changing a verdict"
                value={String(rules.filter((r) => r.appliedTo > 0).length)}
                sub={`across ${rules.reduce((a, r) => a + r.appliedTo, 0)} contracts`}
              />
              <Cell
                label="Retraining required"
                value="None"
                sub="retrieval, not fine-tuning"
              />
            </div>

            <ol className="mt-4 space-y-3">
              {rules.map((r) => {
                const p = r.provision ? PROVISION_BY_KEY.get(r.provision) : null;
                return (
                  <li
                    key={r.id}
                    className="overflow-hidden rounded-lg border border-hairline bg-surface"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone={r.action === "reject" ? "flag" : r.action === "escalate" ? "watch" : "clear"}>
                          {ACTION_LABEL[r.action] ?? r.action}
                        </Pill>
                        {p ? (
                          <span className="font-mono text-[12px] text-muted-foreground">
                            DORA {p.article} · {p.label}
                          </span>
                        ) : (
                          <span className="text-[12px] text-muted-foreground">
                            Any provision
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] text-muted-foreground">
                        {r.appliedTo > 0
                          ? `changing ${r.appliedTo} ${r.appliedTo === 1 ? "verdict" : "verdicts"} now`
                          : "no verdict currently affected"}
                      </span>
                    </div>
                    <blockquote className="px-4 py-3 text-[14px] leading-[1.6]">
                      &ldquo;{r.text}&rdquo;
                    </blockquote>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-hairline px-4 py-2 text-[12px] text-muted-foreground">
                      <span>{r.author}</span>
                      {r.createdAt ? (
                        <span>
                          {new Date(r.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      ) : null}
                      {r.learnedFrom ? (
                        <span>
                          learned from{" "}
                          <Link
                            href={`/contracts/${r.learnedFrom}`}
                            className="font-mono underline-offset-2 hover:underline"
                          >
                            {r.learnedFrom}
                          </Link>
                        </span>
                      ) : (
                        <span>from an earlier review</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <section className="mt-6 rounded-lg border border-hairline bg-surface px-4 py-3">
              <Eyebrow>Why it generalises</Eyebrow>
              <p className="mt-1.5 max-w-3xl text-[13px] leading-[1.6] text-muted-foreground">
                A rule is embedded the same way a contract&rsquo;s gaps are. When
                the agent reviews an arrangement it searches this memory by
                meaning, so a rule written about one supplier surfaces on a
                different supplier with the same weakness — without anyone
                naming that second contract. A rule scoped to a provision only
                fires where that provision is actually missing, and a rule
                scoped to critical functions never reshapes the rest of the
                estate.
              </p>
            </section>
          </>
        )}
      </Page>
    </Shell>
  );
}

function Cell({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[24px] leading-7 font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[12px] leading-4 text-muted-foreground">{sub}</p>
    </div>
  );
}

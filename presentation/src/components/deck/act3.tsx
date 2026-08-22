"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE, Panel, SlideLabel, useStages } from "./primitives";
import { RegMarks } from "./marks";

/* ── Slides 5 + 6 — teach it, then the half-second (the deck's one build)
   The left panel is the human correction — the only tan in the deck's
   middle. The right column idles on slide 5 and fills on slide 6: the
   causal timeline, then the three evidence cards. A keypress changes the
   prop; the scene never remounts. */

const CORRECTION =
  "A supplier that refuses customer-initiated penetration testing of its " +
  "production environment cannot be assured for a critical function. Treat a " +
  "self-testing-only clause as not compliant, not a routine gap.";

const TIMELINE: [string, string][] = [
  ["Rule stored", "corrections → rules · embedded bge-m3"],
  ["Index searchable", "the agent waits for consistency"],
  ["12 re-checked · 0 re-read", "~0.5s — stored extractions, new policy"],
];

const EVIDENCE: {
  vendor: string;
  verdict: string;
  note: string;
  strong?: boolean;
}[] = [
  {
    vendor: "Castellan Core Systems",
    verdict: "VERDICT CHANGED",
    note: "gaps to close → not compliant · the rule's origin",
    strong: true,
  },
  {
    vendor: "Aurora KYC",
    verdict: "RULE APPLIED",
    note: "same gap, found by meaning · contract never opened",
    strong: true,
  },
  {
    vendor: "Nordlys Data Centre",
    verdict: "CONSIDERED, WITHHELD",
    note: "has a testing clause — no gap to attach to",
  },
];

export function SceneTeach({ swept }: { swept: boolean }) {
  const rm = useReducedMotion();
  // pacing inside the un-swept state: finding → form → button
  const stage = useStages([600, 1400], swept ? "swept" : "form");
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[2vmin]">
        {/* the correction — persists across the build */}
        <Panel className="w-[42vmin] px-[2.6vmin] py-[2.2vmin]" delay={0.25}>
          <div className="flex items-baseline justify-between">
            <div className="text-[1.9vmin] font-medium tracking-tight">
              Castellan Core Systems Ltd
            </div>
            <span className="mark-label border border-ink/30 px-[0.9vmin] py-[0.4vmin] text-[0.95vmin] text-g600">
              critical · core banking software
            </span>
          </div>

          {/* the finding */}
          <div className="mt-[1.5vmin] border border-ink/20 bg-white px-[1.6vmin] py-[1.3vmin] font-mono text-[1.25vmin] leading-[1.8]">
            <div className="text-g500">
              THREAT-LED PENETRATION TESTING · INADEQUATE
            </div>
            <div className="mt-[0.5vmin]">
              Supplier runs its own annual test; customer-initiated testing
              refused.
            </div>
            <div className="mt-[0.5vmin] text-g500">
              checklist: material — &ldquo;gaps to close&rdquo;
            </div>
          </div>

          {/* the review form */}
          <motion.div
            initial={rm ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: stage >= 1 || swept ? 1 : 0, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-[1.6vmin]"
          >
            <div className="mark-label text-[1.1vmin] text-tan">
              Disagree — correct it
            </div>
            <div className="mt-[1vmin] grid grid-cols-[9em_1fr] gap-y-[0.7vmin] font-mono text-[1.2vmin] leading-[1.6]">
              <span className="text-g500">provision</span>
              <span className="border-b border-tan/60">
                Participation in threat-led penetration testing{" "}
                <span className="mark-label text-[0.85vmin] text-tan">
                  selected by hand
                </span>
              </span>
              <span className="text-g500">apply this to</span>
              <span>critical functions only</span>
            </div>
            <p className="mt-[1.1vmin] border-l-2 border-tan/60 pl-[1.2vmin] text-[1.35vmin] leading-[1.65] text-g700">
              {CORRECTION}
            </p>
            <div
              className={`mark-label mt-[1.5vmin] inline-flex items-center px-[1.6vmin] py-[0.9vmin] text-[1.2vmin] transition-colors duration-300 ${
                swept ? "bg-tan text-white" : "border-2 border-tan text-tan"
              }`}
            >
              {swept
                ? "✓ Rule stored — Third-Party Risk"
                : "Store rule and re-check the register"}
            </div>
          </motion.div>
        </Panel>

        {/* agent activity — idle, then the sweep */}
        <div className="w-[36vmin]">
          <AnimatePresence mode="wait" initial={false}>
            {!swept ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-dashed border-ink/35 px-[2.2vmin] py-[3vmin] text-center"
              >
                <div className="mark-label text-[1.1vmin] text-g500">
                  Agent activity
                </div>
                <div className="mt-[1vmin] font-mono text-[1.25vmin] text-g500">
                  listening on change streams…
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sweep"
                initial={rm ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="border border-ink/15 bg-surface px-[2.2vmin] py-[1.8vmin]"
                style={{ boxShadow: "var(--shadow-panel)" }}
              >
                <div className="mark-label flex items-center justify-between text-[1.05vmin] text-g500">
                  <span>Agent activity</span>
                  <span className="bg-chip px-[0.9vmin] py-[0.35vmin] text-[0.9vmin] text-paper">
                    &ldquo;changing 2 verdicts now&rdquo;
                  </span>
                </div>

                {/* causal timeline */}
                <div className="mt-[1.4vmin]">
                  {TIMELINE.map(([step, detail], i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.5, duration: 0.45, ease: EASE }}
                      className="flex items-baseline gap-[1.2vmin] border-t border-ink/10 py-[0.9vmin]"
                    >
                      <span className="h-[0.7vmin] w-[0.7vmin] shrink-0 translate-y-[-0.1vmin] bg-ink" />
                      <div>
                        <div
                          className={`font-mono text-[1.35vmin] ${i === 2 ? "font-semibold" : ""}`}
                        >
                          {step}
                        </div>
                        <div className="text-[1.05vmin] text-g500">{detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* evidence cards */}
                <div className="mt-[1.2vmin] space-y-[0.9vmin]">
                  {EVIDENCE.map((e, i) => (
                    <motion.div
                      key={e.vendor}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.9 + i * 0.45, duration: 0.5, ease: EASE }}
                      className={`border px-[1.4vmin] py-[1vmin] ${
                        e.strong ? "border-ink/40 bg-white" : "border-dashed border-ink/30"
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="text-[1.35vmin] font-medium">{e.vendor}</span>
                        <span
                          className={`mark-label text-[0.9vmin] ${
                            e.strong ? "bg-chip px-[0.8vmin] py-[0.3vmin] text-paper" : "text-g500"
                          }`}
                        >
                          {e.verdict}
                        </span>
                      </div>
                      <div className="mt-[0.3vmin] text-[1.05vmin] text-g500">{e.note}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SlideLabel delay={0.9}>
        {swept
          ? "Demo §4 · reading took 12 minutes — re-judging took half a second"
          : "Demo §3 · the correction is the training data"}
      </SlideLabel>
    </div>
  );
}

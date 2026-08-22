"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE, GiantWord, Panel, SlideLabel, useStages } from "./primitives";
import { Callout, Crosshair, RegMarks } from "./marks";

/* The carried object: alert ALR-0142 appears in the queue, opens, is
   drafted, red-flagged, decided and survives the unplug. Slides 4–5 and
   6–7 are builds — a keypress changes a prop, never remounts. */

const ROWS: [string, string, string, string, string][] = [
  ["ALR-0135", "MERIDIAN FREIGHT LLC", "R-04 STRUCTURING", "0.31", "noise"],
  ["ALR-0136", "KOVAL & PARTNERS", "R-11 PEP-ADJACENT", "0.22", "noise"],
  ["ALR-0137", "BALT SEA CHARTER OU", "R-02 VELOCITY", "0.18", "noise"],
  ["ALR-0138", "H. OKONKWO", "R-04 STRUCTURING", "0.27", "noise"],
  ["ALR-0139", "ARGENT PAY SP Z O.O.", "R-08 CORRIDOR", "0.35", "noise"],
  ["ALR-0140", "LUMEN GLASSWORKS", "R-02 VELOCITY", "0.12", "noise"],
  ["ALR-0141", "T. VASQUEZ HOLDINGS", "R-11 PEP-ADJACENT", "0.29", "noise"],
  ["ALR-0142", "NOVAK TRADING s.r.o.", "R-17 SANCTIONS-ADJ", "0.93", "review"],
  ["ALR-0143", "PORTVIEW MARINE", "R-08 CORRIDOR", "0.24", "noise"],
  ["ALR-0144", "DELTA KILIM EXPORT", "R-02 VELOCITY", "0.21", "noise"],
  ["ALR-0145", "S. LINDQVIST AB", "R-04 STRUCTURING", "0.16", "noise"],
  ["ALR-0146", "CASPIAN AGRO TRADE", "R-08 CORRIDOR", "0.41", "noise"],
  ["ALR-0147", "WRENFIELD & CO", "R-11 PEP-ADJACENT", "0.19", "noise"],
  ["ALR-0148", "AZURE FORWARDING", "R-02 VELOCITY", "0.23", "noise"],
];

function ActWord({ word, tone = "ink" }: { word: string; tone?: "ink" | "tan" }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={word}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GiantWord size="26vh" top="26%" tone={tone} delay={0}>
          {word}
        </GiantWord>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Slides 4 + 5 — the Monday, then the screener's reason (build) ────── */

export function SceneQueue({ opened }: { opened: boolean }) {
  const rm = useReducedMotion();
  return (
    <div className="absolute inset-0">
      <ActWord word={opened ? "RULES" : "MONDAY"} />
      <RegMarks />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[3vmin]">
        {/* the queue */}
        <motion.div
          layout
          transition={{ duration: 0.7, ease: EASE }}
          className="border border-ink/15 bg-surface"
          style={{ boxShadow: "var(--shadow-panel)", width: opened ? "52vmin" : "78vmin" }}
        >
          <div className="flex items-center justify-between border-b border-ink/12 px-[2vmin] py-[1.3vmin]">
            <div className="mark-label text-[1.25vmin] text-g600">Alert queue</div>
            <div className="flex items-center gap-[1vmin]">
              <div className="mark-label bg-chip px-[1vmin] py-[0.5vmin] text-[1.05vmin] text-paper">
                200 alerts · 99% noise
              </div>
              <div className="mark-label border border-ink/25 px-[1vmin] py-[0.5vmin] text-[1.05vmin] text-g500">
                synthetic data
              </div>
            </div>
          </div>
          <div className="px-[1vmin] py-[0.8vmin] font-mono text-[1.35vmin] leading-[2.1]">
            {ROWS.map(([id, name, rule, score, status], i) => {
              const hot = id === "ALR-0142";
              return (
                <motion.div
                  key={id}
                  initial={rm ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.055, duration: 0.4, ease: EASE }}
                  className={`grid grid-cols-[8em_1fr_auto_4em] items-center gap-[1.6vmin] px-[1vmin] ${
                    hot ? "bg-ink/6" : ""
                  }`}
                  style={hot ? { boxShadow: "inset 0.35vmin 0 0 var(--color-ink)" } : undefined}
                >
                  <span className="text-g500">{id}</span>
                  <span className={`truncate ${hot ? "font-semibold" : ""}`}>{name}</span>
                  {!opened && <span className="text-g500">{rule}</span>}
                  {opened && <span />}
                  <span className={`tnum text-right ${hot ? "font-semibold" : "text-g500"}`}>
                    {score}
                  </span>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="px-[1vmin] pt-[0.4vmin] text-g400"
            >
              ··· 186 more
            </motion.div>
          </div>
        </motion.div>

        {/* the screener's reason */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="w-[38vmin] border border-ink/15 bg-surface px-[2.4vmin] py-[2.2vmin]"
              style={{ boxShadow: "var(--shadow-panel)" }}
            >
              <div className="mark-label mb-[1.6vmin] text-[1.25vmin] text-g600">
                Why this fired — deterministic screener
              </div>
              <div className="mb-[1.8vmin] border border-ink/20 bg-white px-[1.6vmin] py-[1.4vmin] font-mono text-[1.45vmin] leading-[1.9]">
                <div className="text-g500">RULE R-17 · SANCTIONS-ADJACENT NAME</div>
                <div className="mt-[0.8vmin]">NOVAK TRADING s.r.o.</div>
                <div className="text-g500">≈ NOVAK TRADING SRO · match 0.93</div>
                <div className="mt-[0.8vmin] text-g500">
                  corridor CZ → IR · thr ≥ 0.85
                </div>
              </div>
              <div className="font-mono text-[1.3vmin] leading-[1.8] text-g600">
                The model never picks the hit.
                <br />
                Rules own the queue — the model
                <br />
                cannot add an alert, or lose one.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <SlideLabel delay={1.2}>
        {opened ? "The screener owns the candidate set" : "A compliance analyst's Monday"}
      </SlideLabel>
    </div>
  );
}

/* ── Slides 6 + 7 — the draft, then the override (build) ──────────────── */

const SENTENCES: [string, string][] = [
  ["Name matches watchlist entity NOVAK TRADING SRO at 0.93 similarity.", "C1 · WATCHLIST SDN-778"],
  ["KYC file shows machine-parts exporter, CZ registry, est. 2011.", "C2 · KYC FILE §2.1"],
  ["Pattern is consistent with 14 months of invoiced trade.", "C3 · LEDGER 2025-Q2"],
  ["Policy dismisses sub-0.95 matches with a clean corridor history.", "C4 · POLICY 4.3(b)"],
];

export function SceneDraft({ overridden }: { overridden: boolean }) {
  const rm = useReducedMotion();
  return (
    <div className="absolute inset-0">
      <ActWord word={overridden ? "OVERRULED" : "CITED"} />
      <RegMarks />
      <Crosshair x="7%" y="80%" delay={1.5} />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[3vmin]">
        {/* the draft */}
        <Panel className="w-[56vmin] px-[3vmin] py-[2.6vmin]" delay={0.25}>
          <div className="flex items-center justify-between">
            <div className="mark-label text-[1.25vmin] text-g600">
              Draft disposition — ALR-0142
            </div>
            <div className="mark-label bg-chip px-[1vmin] py-[0.4vmin] text-[1vmin] text-paper">
              agent draft · not filed
            </div>
          </div>

          {/* red-flag bar stamps over the document */}
          <AnimatePresence>
            {overridden && (
              <motion.div
                initial={rm ? { opacity: 0 } : { opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mark-label mt-[1.6vmin] origin-left bg-chip px-[1.4vmin] py-[0.9vmin] text-[1.2vmin] text-paper"
              >
                Red flag — counterparty paid SDN-778 subsidiary · 12 Aug
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-[1.8vmin] space-y-[1.5vmin]">
            {SENTENCES.map(([s, cite], i) => (
              <motion.div
                key={i}
                initial={rm ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.55, duration: 0.55, ease: EASE }}
                className="flex items-baseline justify-between gap-[2vmin] text-[1.75vmin] leading-[1.55]"
              >
                <span className={overridden && i === 3 ? "text-g400" : ""}>{s}</span>
                <span className="mark-label shrink-0 border border-ink/30 px-[0.8vmin] py-[0.3vmin] font-mono text-[1vmin] text-g600">
                  {cite}
                </span>
              </motion.div>
            ))}
          </div>

          {/* recommendation — struck through when the rule wins */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.5 }}
            className="mt-[2.2vmin] border-t border-ink/12 pt-[1.6vmin] font-mono text-[1.5vmin]"
          >
            <span className="relative inline-block">
              <span className={overridden ? "text-g400" : ""}>
                RECOMMEND: CLOSE AS FALSE POSITIVE
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: overridden ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute left-0 top-1/2 h-px w-full origin-left bg-ink"
              />
            </span>
            <AnimatePresence>
              {overridden && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
                  className="mt-[0.9vmin] font-semibold"
                >
                  ESCALATE — the rule outranks the model.
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.5 }}
              className="mt-[1.2vmin] text-[1.25vmin] text-g500"
            >
              ◇ UBO chain beyond depth 2 unverified — abstention noted.
            </motion.div>
          </motion.div>
        </Panel>

        {/* the cited span */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.6, duration: 0.7, ease: EASE }}
          className="w-[30vmin] border border-ink/15 bg-white px-[2.2vmin] py-[2vmin]"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >
          <div className="mark-label mb-[1.2vmin] text-[1.1vmin] text-g500">
            Source span — Policy 4.3(b)
          </div>
          <p className="text-[1.45vmin] leading-[1.8] text-g600">
            …where the composite name-similarity score falls below 0.95 and the
            counterparty corridor shows{" "}
            <span className="bg-g200 px-[0.3vmin] text-ink">
              no adverse events in the trailing 24 months
            </span>
            , the alert may be recommended for closure by the drafting layer,
            subject to human disposition under §6.
          </p>
        </motion.div>
      </div>
      <AnimatePresence>
        {!overridden && (
          <motion.div exit={{ opacity: 0, transition: { duration: 0.3 } }}>
            <Callout
              x={84} y={20} to={{ x: 72, y: 36 }}
              title="Every sentence"
              lines={["cited to a span", "or it abstains"]}
              delay={2.9}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <SlideLabel delay={1.4}>
        {overridden ? "The model never overrules the rules" : "Constrained to the corpus — nothing invented"}
      </SlideLabel>
    </div>
  );
}

/* ── Slide 8 — the human decides ─────────────────────────────────────────
   The one warm slide: the act word itself is tan, and so are the only two
   buttons in the deck. A cursor — the deck's only cursor — does the two
   clicks the law reserves for a person. */

export function SceneDecide() {
  const stage = useStages([900, 2000, 2450, 3600, 4050, 4600]);
  const rm = useReducedMotion();
  const decided = stage >= 3 || !!rm;
  const filed = stage >= 5 || !!rm;
  return (
    <div className="absolute inset-0">
      <GiantWord size="30vh" top="33%" tone="tan">DECIDE</GiantWord>
      <RegMarks />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Panel className="w-[58vmin] px-[3vmin] py-[2.6vmin]" delay={0.2}>
          <div className="flex items-center justify-between">
            <div className="mark-label text-[1.25vmin] text-g600">
              ALR-0142 — escalated by rule R-09
            </div>
            <div className="mark-label border border-ink/25 px-[1vmin] py-[0.4vmin] font-mono text-[1vmin] text-g500">
              draft sha-256 · 9f3a…c1
            </div>
          </div>
          <div className="mt-[2.2vmin] flex gap-[2vmin]">
            <div
              className={`mark-label relative flex h-[6.4vmin] flex-1 items-center justify-center text-[1.6vmin] transition-colors duration-300 ${
                decided ? "bg-tan text-white" : "border-2 border-tan text-tan"
              }`}
            >
              {decided ? "✓ Decided — escalate" : "Decide"}
            </div>
            <div
              className={`mark-label relative flex h-[6.4vmin] flex-1 items-center justify-center text-[1.6vmin] transition-colors duration-300 ${
                filed ? "bg-tan text-white" : decided ? "border-2 border-tan text-tan" : "border border-ink/20 text-g400"
              }`}
            >
              {filed ? "✓ STR filed" : "File STR"}
            </div>
          </div>
          <AnimatePresence>
            {filed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-[2vmin] border border-ink/15 bg-white px-[1.6vmin] py-[1.2vmin] font-mono text-[1.3vmin] leading-[1.9] text-g600"
              >
                <span className="mark-label text-[1.05vmin] text-g500">audit ledger · append-only</span>
                <br />
                FILED · M. ANALYST · 14:02:37 · input 9f3a…c1 · rationale attached
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mark-label mt-[2vmin] text-[1.15vmin] text-g500">
            AMLR Art 18(3) — the decision cannot be outsourced. Not to a vendor. Not to a model.
          </div>
        </Panel>
      </div>

      {/* the deck's only cursor */}
      {!rm && stage >= 1 && (
        <motion.div
          className="absolute z-30"
          initial={{ left: "63%", top: "78%", opacity: 0 }}
          animate={{
            left: stage >= 4 ? "56.5%" : "41.5%",
            top: stage >= 2 ? "43.5%" : "68%",
            opacity: 1,
            scale: stage === 3 || stage === 5 ? 0.82 : 1,
          }}
          transition={{ duration: 0.8, ease: EASE, scale: { duration: 0.18 } }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24">
            <path
              d="M5 3 L19 12.5 L12.2 13.6 L15.2 20.2 L12.6 21.3 L9.6 14.7 L5 18 Z"
              fill="var(--color-ink)"
              stroke="var(--color-paper)"
              strokeWidth="1.2"
            />
          </svg>
        </motion.div>
      )}
      <SlideLabel delay={0.8}>The agent drafts. A human decides and files.</SlideLabel>
    </div>
  );
}

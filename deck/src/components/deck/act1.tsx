"use client";
import { motion } from "motion/react";
import { EASE, Panel, SlideLabel } from "./primitives";
import { Callout, Crosshair, RegMarks, Ruler } from "./marks";

/* ── Slide 1 — the reading problem ───────────────────────────────────────
   The statute on the left, the Article 30 spec on the right, and below
   them the reason the duty goes unmet: a shelf of contracts, one reader. */

const CRITICAL_EXTRAS = [
  "Performance targets",
  "Reporting to the entity",
  "Contingency plans",
  "Threat-led pen testing",
  "Access, inspection, audit",
  "Exit strategy & transition",
];

function Spine({ i, delay }: { i: number; delay: number }) {
  // deterministic pseudo-random heights so the shelf looks shelved
  const h = 7.2 + ((i * 37) % 5) * 0.9;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="border border-ink/40 bg-surface"
      style={{ width: "1.55vmin", height: `${h}vmin` }}
    />
  );
}

export function SceneReading() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Crosshair x="7%" y="16%" delay={1.2} />
      <Crosshair x="94%" y="78%" delay={1.4} />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[3.4vmin]">
        <div className="flex items-stretch gap-[3vmin]">
          {/* the duty */}
          <Panel className="w-[46vmin] px-[3.4vmin] py-[3vmin]" delay={0.4}>
            <div className="mark-label mb-[0.8vmin] text-[1.2vmin] text-g500">
              Regulation (EU) 2022/2554 — DORA · Article 28(8)
            </div>
            <p className="text-[1.9vmin] leading-[1.75] text-g700">
              For ICT services supporting{" "}
              <span className="text-ink">critical or important functions</span>,
              financial entities shall have exit strategies — transfer to
              another provider, or{" "}
              <span className="relative inline-block font-medium text-ink">
                reincorporate them in-house
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.6, duration: 0.7, ease: EASE }}
                  className="absolute -bottom-[0.25vmin] left-0 h-[0.3vmin] w-full origin-left bg-ink"
                />
              </span>
              .
            </p>
            <p className="mt-[1.6vmin] text-[1.55vmin] leading-[1.7] text-g600">
              Whether that is possible is written in the contracts — Article 30
              says what each one must contain.
            </p>
          </Panel>

          {/* the checklist spec */}
          <Panel className="w-[34vmin] px-[2.6vmin] py-[2.4vmin]" delay={0.7}>
            <div className="mark-label mb-[1.4vmin] text-[1.2vmin] text-g500">
              Article 30 — required contract elements
            </div>
            <div className="flex items-baseline justify-between border-t border-ink/15 py-[1.1vmin]">
              <span className="text-[1.5vmin] text-g600">Every arrangement</span>
              <span className="tnum font-mono text-[2.2vmin]">9</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-ink/15 py-[1.1vmin]">
              <span className="text-[1.5vmin] text-g600">
                Critical functions add
              </span>
              <span className="tnum font-mono text-[2.2vmin]">+6</span>
            </div>
            <div className="mt-[1vmin] flex flex-wrap gap-[0.6vmin] border-t border-ink/15 pt-[1.3vmin]">
              {CRITICAL_EXTRAS.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.4 }}
                  className="mark-label border border-ink/25 px-[0.8vmin] py-[0.35vmin] text-[0.95vmin] text-g600"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </Panel>
        </div>

        {/* the shelf */}
        <div className="relative flex items-end gap-[0.55vmin] border-b border-ink/40 px-[1vmin] pb-0">
          {Array.from({ length: 26 }, (_, i) => (
            <Spine key={i} i={i} delay={1.2 + i * 0.045} />
          ))}
        </div>
      </div>
      <Callout
        x={76}
        y={72}
        to={{ x: 60, y: 79 }}
        title="The reading problem"
        lines={["hundreds of these", "nobody reads them all"]}
        delay={2.4}
      />
      <Ruler x="24%" y="86%" len={16} ticks={9} delay={2.2} />
      <SlideLabel delay={2.8}>
        The exit plan stays a slide — until something reads the contracts
      </SlideLabel>
    </div>
  );
}

/* ── Slide 2 — why this cannot be a cloud service ────────────────────────
   The map argument: what the analysis contains is a chart of the bank's
   weak points, and the vendors on that chart include the cloud providers.
   All counts are seed-true (3 blocking, 2 no-TLPT, 2 locations). */

const MAP_ROWS: [string, string][] = [
  ["Vendors it cannot exit", "3 contracts · €7.03M/yr"],
  ["Refuses security testing", "2 contracts"],
  ["Data locations undisclosed", "2 contracts"],
  ["Annual charges, itemised", "every contract"],
];

export function SceneMap() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Crosshair x="8%" y="80%" delay={1.8} />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[2.6vmin]">
        {/* what the analysis contains */}
        <Panel className="w-[36vmin] px-[2.6vmin] py-[2.2vmin]" delay={0.3}>
          <div className="mark-label mb-[1.4vmin] text-[1.15vmin] text-g500">
            What the analysis contains
          </div>
          {MAP_ROWS.map(([label, count], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.25, duration: 0.45, ease: EASE }}
              className="flex items-baseline justify-between border-t border-ink/12 py-[1.15vmin]"
            >
              <span className="text-[1.5vmin]">{label}</span>
              <span className="mark-label font-mono text-[1vmin] text-g500">{count}</span>
            </motion.div>
          ))}
          <div className="mark-label mt-[1.6vmin] inline-block bg-chip px-[1.1vmin] py-[0.6vmin] text-[1vmin] text-paper">
            A map of the bank&rsquo;s weak points
          </div>
        </Panel>

        {/* where could it live */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.7, duration: 0.7, ease: EASE }}
          className="w-[34vmin] border border-ink/15 bg-surface px-[2.4vmin] py-[2.2vmin]"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >
          <div className="mark-label mb-[1.4vmin] text-[1.15vmin] text-g500">
            Where could it live?
          </div>
          <div className="border border-ink/20 bg-white px-[1.6vmin] py-[1.3vmin]">
            <div className="flex items-baseline justify-between">
              <span className="text-[1.5vmin]">A cloud AI service</span>
              <span className="font-mono text-[1.6vmin]">✗</span>
            </div>
            <p className="mt-[0.5vmin] text-[1.15vmin] leading-[1.6] text-g600">
              The vendors on the map include the cloud providers themselves.
            </p>
          </div>
          <div className="mt-[1.2vmin] border-2 border-ink bg-white px-[1.6vmin] py-[1.3vmin]">
            <div className="flex items-baseline justify-between">
              <span className="text-[1.5vmin] font-medium">Hardware the bank owns</span>
              <span className="font-mono text-[1.6vmin]">✓</span>
            </div>
            <p className="mt-[0.5vmin] text-[1.15vmin] leading-[1.6] text-g600">
              The map is drawn, stored and corrected on the premises. Nothing
              leaves.
            </p>
          </div>
        </motion.div>
      </div>
      <SlideLabel delay={2.4}>
        You can&rsquo;t store the escape plan with the people you might escape
        from
      </SlideLabel>
    </div>
  );
}

/* ── Slide 3 — the film card ─────────────────────────────────────────────
   The deck parks here while the demo video plays fullscreen elsewhere.
   Quiet by design: if the audience sees this frame at all, it should read
   as a title card, not a missing slide. */

export function SceneFilm() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[2.2vmin]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="uppercase leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "9vh" }}
        >
          ExitPlan
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
          className="hairline h-px w-[24vmin] origin-left"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mark-label text-[1.5vmin] text-g600"
        >
          Recorded against the live desk
        </motion.div>
      </div>
      <SlideLabel delay={1.6}>The film — the deck waits here</SlideLabel>
    </div>
  );
}

/* ── Slide (appendix) — the authority split ──────────────────────────────
   Three lanes. The machine is monochrome; the third lane is the human,
   and it is the only warm thing on the slide. No database is named here —
   the store gets its reveal on slide 7. */

const LANES: {
  title: string;
  lines: string[];
  chip: string;
  tan?: boolean;
}[] = [
  {
    title: "The model extracts",
    lines: [
      "reads the contract",
      "labels each provision:",
      "present · inadequate · absent",
      "must produce the clause it relied on",
    ],
    chip: "NO QUOTE, NO CLAIM",
  },
  {
    title: "Policy disposes",
    lines: [
      "deterministic Python",
      "fixed severity map",
      "verdict: approve · escalate · reject",
      "exit / audit / data return = blocking",
    ],
    chip: "THE CHECKLIST DECIDES",
  },
  {
    title: "Reviewers teach",
    lines: [
      "a named reviewer disagrees",
      "in writing, with a scope",
      "the correction becomes a readable rule",
      "retrieval — not retraining",
    ],
    chip: "RULES ONLY ACT ON AN EXISTING GAP",
    tan: true,
  },
];

export function SceneCage() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Crosshair x="8%" y="82%" delay={1.6} />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[2.2vmin]">
        {LANES.map((lane, i) => (
          <div key={lane.title} className="flex items-center gap-[2.2vmin]">
            <Panel
              className="w-[27vmin] px-[2.4vmin] py-[2.2vmin]"
              delay={0.3 + i * 0.45}
            >
              <div
                className="mark-label mb-[1.4vmin] text-[1.35vmin]"
                style={{ color: lane.tan ? "var(--color-tan)" : undefined }}
              >
                {String(i + 1).padStart(2, "0")} · {lane.title}
              </div>
              <div className="space-y-[0.7vmin] text-[1.45vmin] leading-[1.6] text-g700">
                {lane.lines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
              <div
                className={`mark-label mt-[1.8vmin] inline-block px-[1vmin] py-[0.55vmin] text-[0.95vmin] ${
                  lane.tan ? "bg-tan text-white" : "bg-chip text-paper"
                }`}
              >
                {lane.chip}
              </div>
            </Panel>
            {i < LANES.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.7 + i * 0.45, duration: 0.5, ease: EASE }}
                className="flex origin-left items-center"
              >
                <div className="h-px w-[3.4vmin] bg-ink/50" />
                <div className="h-[0.7vmin] w-[0.7vmin] bg-ink" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <SlideLabel delay={2}>
        The model&rsquo;s authority stops at extraction
      </SlideLabel>
    </div>
  );
}

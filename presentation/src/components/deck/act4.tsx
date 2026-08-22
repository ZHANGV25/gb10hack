"use client";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { EASE, Panel, SlideLabel } from "./primitives";
import { Callout, Crosshair, RegMarks, Ruler } from "./marks";

/* ── Slide 7 — the real ones (the control group) ─────────────────────────
   Four genuine EX-10 filings off SEC EDGAR sit beside the curated book.
   The Sunrise agreement is too long for the model to read at all — the
   reading strip shows retrieval deciding what the model sees. */

const FILED: [string, string][] = [
  ["Sunrise Communications AG", "113,731 chars"],
  ["Edgemode Inc.", "58k–114k chars"],
  ["Platinum Analytics", "EX-10 · EDGAR"],
  ["NuScale Power LLC", "EX-10 · EDGAR"],
];

const READ_STRIP: [string, string][] = [
  ["113,731 characters", "far past the context window"],
  ["Split into passages", "chunked and embedded on the box"],
  ["11 retrieved", "vector search per provision"],
  ["Read in ~77s", "the model never saw the rest"],
];

export function SceneFilings() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Crosshair x="8%" y="18%" delay={1.8} />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[2.2vmin]">
        <Panel className="w-[46vmin] px-[2.6vmin] py-[2.2vmin]" delay={0.3}>
          <div className="flex items-baseline justify-between">
            <div className="text-[2vmin] font-medium tracking-tight">
              Sunrise Communications AG
            </div>
            <span className="mark-label bg-chip px-[0.9vmin] py-[0.4vmin] text-[0.95vmin] text-paper">
              filed · SEC EDGAR
            </span>
          </div>
          <div className="mark-label mt-[0.5vmin] text-[1.05vmin] text-g500">
            EX-10 material contract · written by other people, for other purposes
          </div>
          <div className="mt-[1.8vmin]">
            {READ_STRIP.map(([step, detail], i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.45, duration: 0.45, ease: EASE }}
                className="flex items-baseline gap-[1.4vmin] border-t border-ink/10 py-[1.2vmin]"
              >
                <span className="h-[0.7vmin] w-[0.7vmin] shrink-0 translate-y-[-0.1vmin] bg-ink" />
                <div>
                  <div className={`tnum font-mono text-[1.7vmin] ${i === 2 ? "font-semibold" : ""}`}>
                    {step}
                  </div>
                  <div className="text-[1.1vmin] text-g500">{detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mark-label mt-[1.2vmin] border-t border-ink/10 pt-[1.1vmin] text-[1.05vmin] text-g600">
            Retrieval decides what the model reads — without it, this contract
            cannot be read at all
          </div>
        </Panel>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.7, ease: EASE }}
          className="w-[30vmin] border border-ink/15 bg-surface px-[2vmin] py-[1.8vmin]"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >
          <div className="mark-label mb-[1.2vmin] text-[1.05vmin] text-g500">
            The control group — nobody wrote these for us
          </div>
          {FILED.map(([vendor, meta], i) => (
            <motion.div
              key={vendor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 + i * 0.2, duration: 0.4 }}
              className="flex items-baseline justify-between border-t border-ink/10 py-[1vmin]"
            >
              <span className="text-[1.35vmin] font-medium">{vendor}</span>
              <span className="mark-label font-mono text-[0.95vmin] text-g500">{meta}</span>
            </motion.div>
          ))}
          <div className="mt-[1.2vmin] border-t border-ink/10 pt-[1.1vmin] font-mono text-[1.1vmin] leading-[1.7] text-g600">
            No ground truth, on purpose. The same checks run over them,
            unchanged.
          </div>
        </motion.div>
      </div>
      <SlideLabel delay={2.4}>
        The real ones — same checklist, same rules, nothing tuned
      </SlideLabel>
    </div>
  );
}

/* ── Slide 8 — one database, three jobs (demo §5) ────────────────────────
   The first time the store is named. Three job columns inside one panel,
   a live-counts row, and the dashed on-prem boundary drawn around it all. */

const JOBS: [string, string[]][] = [
  ["Operational register", ["contracts", "verdicts", "corrections"]],
  ["Vector memory", ["rules", "$vectorSearch", "bge-m3 · 1024-d"]],
  ["Event bus", ["change streams", "→ dora-watch", "never polls"]],
];

export function SceneMongo() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Crosshair x="90%" y="20%" delay={1.8} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {/* the on-prem boundary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative border border-dashed border-ink/45 px-[4vmin] py-[3.4vmin]"
        >
          <div className="mark-label absolute -top-[1.1vmin] left-[3vmin] bg-paper px-[0.8vmin] text-[1vmin] text-g600">
            Nordhafen&rsquo;s own hardware — Dell Pro Max GB10
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.5 }}
            className="mark-label absolute -bottom-[1.2vmin] right-[3vmin] bg-ink px-[0.9vmin] py-[0.3vmin] text-[1vmin] text-paper"
          >
            built with OpenClaw — driving the box
          </motion.div>

          <Panel className="w-[64vmin] px-[2.8vmin] py-[2.4vmin]" delay={0.5}>
            <div className="flex items-baseline justify-between">
              <div className="text-[2.1vmin] font-medium tracking-tight">
                MongoDB — one deployment, three jobs
              </div>
              <span className="mark-label text-[1vmin] text-g500">
                Atlas Local · 127.0.0.1
              </span>
            </div>

            <div className="mt-[1.8vmin] grid grid-cols-3 gap-[1.4vmin]">
              {JOBS.map(([title, items], i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.35, duration: 0.55, ease: EASE }}
                  className="border border-ink/15 bg-white px-[1.6vmin] py-[1.4vmin]"
                >
                  <div className="mark-label text-[1.05vmin] text-g600">
                    {String(i + 1).padStart(2, "0")} · {title}
                  </div>
                  <div className="mt-[0.9vmin] space-y-[0.4vmin] font-mono text-[1.25vmin] leading-[1.6] text-g700">
                    {items.map((it) => (
                      <div key={it}>{it}</div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* live counts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.5 }}
              className="mt-[1.8vmin] flex items-baseline justify-between border-t border-ink/12 pt-[1.4vmin]"
            >
              {(
                [
                  ["contracts", 12],
                  ["critical", 8],
                  ["rules", 3],
                  ["gaps", 10],
                ] as [string, number][]
              ).map(([label, v]) => (
                <div key={label} className="text-center">
                  <div className="tnum font-mono text-[2.8vmin] font-semibold">
                    <NumberFlow value={v} transformTiming={{ duration: 1100, easing: "ease-out" }} />
                  </div>
                  <div className="mark-label text-[0.95vmin] text-g500">{label}</div>
                </div>
              ))}
              <div className="text-center">
                <div className="tnum font-mono text-[2.8vmin] font-semibold">~0.5s</div>
                <div className="mark-label text-[0.95vmin] text-g500">estate re-check</div>
              </div>
            </motion.div>

            <div className="mark-label mt-[1.4vmin] text-[1vmin] text-g500">
              counts aggregated in the database, live · runs — append-only
            </div>
          </Panel>
        </motion.div>
      </div>
      <SlideLabel delay={2.4}>
        Demo §5 · the register, the memory and the nervous system
      </SlideLabel>
    </div>
  );
}

/* ── Slide 8 — the artifact, unplugged (demo §6) ─────────────────────────
   The whole runtime as a unit specification, one measured line, and the
   row-13 argument as an annotation — never a necessity claim. */

const SPEC: [string, string][] = [
  ["Reader", "nemotron-3-nano · 30B (Ollama)"],
  ["Embeddings", "bge-m3 · 1024-d"],
  ["Store", "MongoDB Atlas Local · streams + vectors"],
  ["Built with", "OpenClaw · driving the box"],
  ["Register", "Next.js · 127.0.0.1:3000"],
  ["Compute", "Dell Pro Max GB10 · 128GB unified"],
  ["Runtime network", "not required"],
];

export function SceneArtifact() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Crosshair x="9%" y="18%" delay={1.8} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-[58vmin]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mark-label mb-[1.4vmin] flex items-baseline justify-between text-[1.2vmin] text-g600"
          >
            <span>ExitPlan — unit specification</span>
            <span className="text-g400">unplugged · still running</span>
          </motion.div>
          {SPEC.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.14, duration: 0.5, ease: EASE }}
              className="flex items-baseline justify-between border-t border-ink/15 py-[1.45vmin] last:border-b"
            >
              <span className="mark-label text-[1.25vmin] text-g500">{k}</span>
              <span className="font-mono text-[1.8vmin]">{v}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex items-baseline justify-between border-b border-ink/15 bg-ink/4 px-[0.8vmin] py-[1.45vmin]"
          >
            <span className="mark-label text-[1.25vmin] text-g600">
              Clause agreement · measured on the box
            </span>
            <span className="tnum font-mono text-[1.8vmin] font-semibold">
              138 / 141 · 98%
            </span>
          </motion.div>
        </div>
      </div>
      <Callout
        x={81}
        y={55}
        to={{ x: 66.5, y: 62.5 }}
        title="Row thirteen"
        lines={["host this in a cloud and it becomes", "an entry in its own register"]}
        delay={2}
      />
      <div className="absolute bottom-[11vh] left-1/2 z-10 -translate-x-1/2">
        <Ruler x="0" y="0" len={22} ticks={8} label="no third party to lose" delay={2.4} />
      </div>
      <SlideLabel delay={2.7}>Demo §6 · the artifact, not the slide</SlideLabel>
    </div>
  );
}

/* ── Slide 9 — close ─────────────────────────────────────────────────────── */

export function SceneClose() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div
          className="uppercase leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "17vh" }}
        >
          {"EXITPLAN".split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: "0.12em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.045, duration: 0.7, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          className="mt-[1.8vmin] h-[0.5vmin] w-[34vmin] origin-left bg-tan"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="mark-label mt-[2.4vmin] text-[1.8vmin] text-g600"
        >
          It reads the contracts. It shows the way out. Nothing leaves the building.
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          className="mark-label mt-[3vmin] flex items-center gap-[1.4vmin] text-[1.2vmin] text-g600"
        >
          <span>nemotron-3-nano · 30B</span>
          <span className="text-g400">·</span>
          <span>bge-m3</span>
          <span className="text-g400">·</span>
          <span>MongoDB Atlas Local</span>
          <span className="text-g400">·</span>
          <span>Dell Pro Max GB10</span>
          <span className="text-g400">·</span>
          <span className="bg-ink px-[0.9vmin] py-[0.35vmin] text-paper">
            BUILT WITH OPENCLAW — DRIVING THE BOX
          </span>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="mark-label absolute bottom-[5vh] left-1/2 z-10 -translate-x-1/2 text-[1.05vmin] text-g400"
      >
        synthetic register throughout · business analysis, not legal advice
      </motion.div>
    </div>
  );
}

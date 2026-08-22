"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { EASE, GiantWord, SlideLabel } from "./primitives";
import { Crosshair, RegMarks, Ruler } from "./marks";

/* ── Slide 10 — the spec sheet ───────────────────────────────────────────
   The whole stack as a GRMNT unit specification. One slide for the
   technical-execution criterion; rows cascade, nothing dwells. */

const SPEC: [string, string][] = [
  ["Orchestration", "OpenClaw"],
  ["Audit trail", "NemoClaw → append-only ledger"],
  ["Execution sandbox", "OpenShell"],
  ["Drafting model", "nemotron-3-nano · 30B"],
  ["Embeddings", "bge-m3"],
  ["Evidence store", "MongoDB 8 · vector index"],
  ["Compute", "NVIDIA GB10 · 128GB unified"],
  ["Runtime network", "none required"],
];

export function SceneSpec() {
  return (
    <div className="absolute inset-0">
      <GiantWord size="30vh" tone="ghost">INSIDE</GiantWord>
      <RegMarks />
      <Crosshair x="10%" y="18%" delay={1.6} />
      <Crosshair x="90%" y="84%" delay={1.8} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-[62vmin]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mark-label mb-[1.6vmin] flex items-baseline justify-between text-[1.3vmin] text-g600"
          >
            <span>ExitPlan — unit specification</span>
            <span className="text-g400">rev. 22 aug</span>
          </motion.div>
          {SPEC.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.14, duration: 0.5, ease: EASE }}
              className="flex items-baseline justify-between border-t border-ink/15 py-[1.55vmin] last:border-b"
            >
              <span className="mark-label text-[1.3vmin] text-g500">{k}</span>
              <span className="font-mono text-[1.9vmin]">{v}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="border-b border-ink/15"
          />
        </div>
      </div>
      <SlideLabel delay={1.8}>All three stack pieces · MongoDB side challenge</SlideLabel>
    </div>
  );
}

/* ── Slide 11 — the market, one number ─────────────────────────────────── */

export function SceneNumber() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(150000), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <Ruler x="8%" y="70%" len={12} label="production · 600+ days" delay={1.6} />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[2.4vmin]">
        <div
          className="tnum leading-none"
          style={{ fontFamily: "var(--font-display)", fontSize: "24vh" }}
        >
          <NumberFlow value={v} transformTiming={{ duration: 1400, easing: "ease-out" }} />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="mark-label text-[1.7vmin] text-g600"
        >
          banking users already on in-house models — Finanz Informatik
        </motion.div>
      </div>
      <SlideLabel delay={2}>Every EU bank holds the Art 28(8) duty</SlideLabel>
    </div>
  );
}

/* ── Slide 12 — close ──────────────────────────────────────────────────── */

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
          The artifact, not the slide.
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="mark-label absolute bottom-[5vh] left-1/2 z-10 -translate-x-1/2 text-[1.05vmin] text-g400"
      >
        synthetic data throughout · business analysis, not legal advice
      </motion.div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { EASE, GiantWord, SlideLabel, useStages } from "./primitives";
import { RegMarks } from "./marks";

/* ── Slide 9 — the unplug ────────────────────────────────────────────────
   The cable leaves at 2.2s; the act word arrives with the pull; the drafts
   counter never stops. The counter is the argument. */

function StatusChip({ label, value, dead }: { label: string; value: string; dead?: boolean }) {
  return (
    <div
      className={`mark-label flex items-center gap-[0.9vmin] px-[1.3vmin] py-[0.8vmin] text-[1.15vmin] ${
        dead ? "border border-dashed border-ink/45 bg-paper text-g600" : "bg-chip text-paper"
      }`}
    >
      <span
        className={`inline-block h-[0.8vmin] w-[0.8vmin] rounded-full ${
          dead ? "border border-ink/40" : "bg-paper"
        }`}
      />
      {label} — {value}
    </div>
  );
}

export function SceneUnplug() {
  const stage = useStages([2200, 3400]);
  const rm = useReducedMotion();
  const pulled = stage >= 1 || !!rm;

  // the always-on proof: drafts keep completing on a steady clock
  const [drafts, setDrafts] = useState(141);
  useEffect(() => {
    const id = setInterval(() => setDrafts((d) => d + 1), 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0">
      {pulled && <GiantWord size="26vh" delay={0.1}>UNPLUGGED</GiantWord>}
      <RegMarks />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[4vmin]">
        {/* box and cable */}
        <div className="relative h-[24vmin] w-[80vmin]">
          {/* the box, still lit */}
          <div
            className="absolute left-[8vmin] top-1/2 h-[16vmin] w-[16vmin] -translate-y-1/2 border-2 border-ink bg-surface"
            style={{ boxShadow: "var(--shadow-panel)" }}
          >
            <div
              className="absolute inset-[1.6vmin]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-ink) 45%, transparent) 0.35vmin, transparent 0.4vmin)",
                backgroundSize: "1.6vmin 1.6vmin",
              }}
            />
            <span className="absolute right-[1vmin] top-[0.8vmin] h-[0.7vmin] w-[0.7vmin] rounded-full bg-ink" />
          </div>
          {/* stub that stays with the box */}
          <div className="absolute left-[24vmin] top-1/2 h-[0.8vmin] w-[6vmin] -translate-y-1/2 border border-ink bg-paper" />
          <div className="absolute left-[30vmin] top-1/2 h-[2.4vmin] w-[1.4vmin] -translate-y-1/2 border border-ink bg-surface" />
          {/* the cable that leaves */}
          <motion.div
            className="absolute left-[32vmin] top-1/2 flex -translate-y-1/2 items-center"
            animate={
              pulled
                ? { x: "26vmin", opacity: 0 }
                : { x: 0, opacity: 1 }
            }
            transition={{ duration: rm ? 0 : 0.9, ease: EASE }}
          >
            <div className="h-[2.4vmin] w-[1.4vmin] border-2 border-paper bg-chip outline outline-1 outline-ink" />
            <div className="h-[0.8vmin] w-[38vmin] border border-ink bg-paper" />
          </motion.div>
          <AnimatePresence>
            {pulled && !rm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mark-label absolute left-[33vmin] top-[34%] border border-ink bg-paper px-[0.5vmin] text-[1.3vmin] text-ink"
              >
                ×
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* status row: only one chip changes */}
        <div className="flex gap-[1.6vmin]">
          <StatusChip label="model" value="nemotron-3-nano · local" />
          <StatusChip label="evidence" value="mongodb · local" />
          <StatusChip label="ledger" value="append-only · local" />
          <StatusChip label="uplink" value={pulled ? "none" : "connected"} dead={pulled} />
        </div>

        {/* the argument */}
        <div className="flex items-baseline gap-[1.8vmin]">
          <span className="tnum font-mono text-[6vmin] font-semibold tracking-tight">
            <NumberFlow value={drafts} />
          </span>
          <span className="mark-label text-[1.4vmin] text-g600">
            dispositions drafted — still counting
          </span>
        </div>
      </div>
      <SlideLabel delay={0.6}>DORA Art 28(8) — the exit plan, executing</SlideLabel>
    </div>
  );
}

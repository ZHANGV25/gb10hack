"use client";
import { motion } from "motion/react";
import { EASE, SlideLabel } from "./primitives";
import { RegMarks } from "./marks";

/* ── Appendix — recorded frames of the live desk ─────────────────────────
   Real screenshots, shown only if the film fails. Each frame fills the
   stage inside a hairline, with the beat it stands in for named below. */

export function SceneShot({
  src,
  chip,
  caption,
}: {
  src: string;
  chip: string;
  caption: string;
}) {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <div className="absolute inset-x-0 bottom-[11vh] top-[7vh] z-10 flex items-center justify-center px-[4vmin]">
        <motion.img
          src={src}
          alt={chip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-h-full max-w-full border border-ink/30 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          style={{ aspectRatio: "16 / 9", objectFit: "contain" }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mark-label absolute left-[4vmin] top-[3vmin] bg-ink px-[1vmin] py-[0.45vmin] text-[1.25vmin] text-paper"
      >
        {chip}
      </motion.div>
      <SlideLabel delay={0.7}>{caption}</SlideLabel>
    </div>
  );
}

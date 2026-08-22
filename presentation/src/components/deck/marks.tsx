"use client";
import { motion, useReducedMotion } from "motion/react";
import { EASE, useTypewriter } from "./primitives";

/* Instrument marks: the hairline crosses, rulers, corner registrations and
   sparklines that live in the margins of a technical drawing. Every mark
   draws in; none of them ever moves again. */

export function Crosshair({
  x,
  y,
  size = 2.2,
  delay = 0,
}: {
  x: string;
  y: string;
  size?: number;
  delay?: number;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: 0.5, ease: EASE }}
        className="hairline absolute top-1/2 h-px -translate-y-1/2"
        style={{ width: `${size}vmin`, left: `${-size / 2}vmin` }}
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.12, duration: 0.5, ease: EASE }}
        className="hairline absolute left-1/2 w-px -translate-x-1/2"
        style={{ height: `${size}vmin`, top: `${-size / 2}vmin` }}
      />
    </div>
  );
}

/** Four L-shaped registration corners around the frame. */
export function RegMarks({ inset = "3.2vmin", delay = 0.2 }: { inset?: string; delay?: number }) {
  const corners: [string, string, string][] = [
    ["left", "top", "rotate(0deg)"],
    ["right", "top", "rotate(90deg)"],
    ["right", "bottom", "rotate(180deg)"],
    ["left", "bottom", "rotate(270deg)"],
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      {corners.map(([h, v, rot], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + i * 0.1, duration: 0.5 }}
          className="absolute"
          style={{ [h]: inset, [v]: inset, transform: rot } as React.CSSProperties}
        >
          <div className="hairline h-px w-[2.6vmin]" />
          <div className="hairline h-[2.6vmin] w-px" />
        </motion.div>
      ))}
    </div>
  );
}

/** A short ruler: hairline with staggered ticks and an optional mono label. */
export function Ruler({
  x,
  y,
  len = 14,
  vertical = false,
  ticks = 7,
  label,
  delay = 0,
}: {
  x: string;
  y: string;
  len?: number;
  vertical?: boolean;
  ticks?: number;
  label?: string;
  delay?: number;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10"
      style={{ left: x, top: y }}
    >
      <motion.div
        initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
        animate={vertical ? { scaleY: 1 } : { scaleX: 1 }}
        transition={{ delay, duration: 0.7, ease: EASE }}
        className={`hairline origin-top-left ${vertical ? "w-px" : "h-px"}`}
        style={vertical ? { height: `${len}vmin` } : { width: `${len}vmin` }}
      />
      {Array.from({ length: ticks }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.25 + i * 0.05, duration: 0.3 }}
          className="hairline absolute"
          style={
            vertical
              ? {
                  top: `${(i / (ticks - 1)) * len}vmin`,
                  left: 0,
                  width: i % 3 === 0 ? "1.1vmin" : "0.6vmin",
                  height: "1px",
                }
              : {
                  left: `${(i / (ticks - 1)) * len}vmin`,
                  top: 0,
                  height: i % 3 === 0 ? "1.1vmin" : "0.6vmin",
                  width: "1px",
                }
          }
        />
      ))}
      {label && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.6, duration: 0.4 }}
          className="mark-label absolute text-[1.15vmin] text-g500"
          style={
            vertical
              ? { top: `${len + 1.4}vmin`, left: "-0.4vmin" }
              : { left: 0, top: "1.8vmin" }
          }
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

/** A tiny margin sparkline with terminal dots, drawn in once. */
export function Sparkline({
  x,
  y,
  w = 9,
  h = 5,
  delay = 0,
}: {
  x: string;
  y: string;
  w?: number;
  h?: number;
  delay?: number;
}) {
  const pts = [
    [0, 78], [14, 60], [28, 66], [42, 34], [56, 44], [70, 18], [84, 26], [100, 8],
  ];
  const d = pts.map(([px, py], i) => `${i ? "L" : "M"}${px} ${py}`).join(" ");
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-10"
      style={{ left: x, top: y, width: `${w}vmin`, height: `${h}vmin` }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <motion.path
          d={d}
          fill="none"
          stroke="color-mix(in srgb, var(--color-ink) 45%, transparent)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay, duration: 1.1, ease: EASE }}
        />
        {pts.filter((_, i) => i % 2 === 0).map(([px, py], i) => (
          <motion.circle
            key={i}
            cx={px}
            cy={py}
            r={2.4}
            fill="var(--color-ink)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: delay + 0.5 + i * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Callout: the SLEEPER annotation chip ───────────────────────────────
   A near-black chip with a mono caps title and typed spec lines, tied to a
   point on the subject by a hairline leader with a square terminal. Chip
   and target are both placed in percent of the scene container. */

function TypedLine({ text, active, delay }: { text: string; active: boolean; delay: number }) {
  const { shown } = useTypewriter(text, active, 16, delay);
  return (
    <div className="whitespace-pre font-mono text-[1.25vmin] leading-[1.7] text-paper/85">
      {shown}
      <span className="opacity-0">{text.slice(shown.length)}</span>
    </div>
  );
}

export function Callout({
  x,
  y,
  to,
  title,
  lines,
  delay = 0,
  anchor = "auto",
}: {
  x: number; // chip position, % of container
  y: number;
  to: { x: number; y: number }; // leader target, % of container
  title: string;
  lines: string[];
  delay?: number;
  anchor?: "auto" | "left" | "right";
}) {
  const rm = useReducedMotion();
  const fromLeft = anchor === "auto" ? to.x >= x : anchor === "left";
  // leader leaves the chip's edge nearest the target, at mid-height
  const x1 = fromLeft ? x + 0.2 : x - 0.2;
  return (
    <>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={`M${x1} ${y} L${to.x} ${to.y}`}
          fill="none"
          stroke="color-mix(in srgb, var(--color-ink) 55%, transparent)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.25, duration: 0.5, ease: EASE }}
        />
      </svg>
      <motion.div
        aria-hidden
        className="absolute z-20 h-[0.7vmin] w-[0.7vmin] bg-ink"
        style={{ left: `${to.x}%`, top: `${to.y}%`, transform: "translate(-50%, -50%)" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.65, duration: 0.3, ease: EASE }}
      />
      <motion.div
        initial={rm ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.55, ease: EASE }}
        className="absolute z-30 bg-chip px-[1.4vmin] py-[1.1vmin]"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(${fromLeft ? "-100%" : "0%"}, -50%)`,
          boxShadow: "0 4px 14px rgba(20,20,18,0.25)",
        }}
      >
        <div className="mark-label mb-[0.5vmin] text-[1.05vmin] text-paper">{title}</div>
        {lines.map((l, i) => (
          <TypedLine key={i} text={l} active delay={(delay + 0.4 + i * 0.35) * 1000} />
        ))}
      </motion.div>
    </>
  );
}

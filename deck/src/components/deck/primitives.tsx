"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** One easing for the whole deck: fast out, long settle, no bounce. */
export const EASE = [0.19, 1, 0.22, 1] as const;

/**
 * Content pacing inside a slide: returns how many of the given delays (ms,
 * cumulative from mount) have elapsed for the current `key`. State is keyed
 * so a key change resets by derivation — no synchronous setState in effects.
 */
export function useStages(delays: number[], key?: unknown): number {
  const [state, setState] = useState<{ k: unknown; n: number }>({ k: key, n: 0 });
  const delaysKey = delays.join(",");
  useEffect(() => {
    const parsed = delaysKey === "" ? [] : delaysKey.split(",").map(Number);
    const ids = parsed.map((t, i) =>
      setTimeout(
        () =>
          setState((s) => ({
            k: key,
            n: Math.max(s.k === key ? s.n : 0, i + 1),
          })),
        t
      )
    );
    return () => ids.forEach(clearTimeout);
  }, [key, delaysKey]);
  return state.k === key ? state.n : 0;
}

/**
 * Typewriter. When inactive (or reduced motion) the full text shows by
 * derivation; the effect only schedules timers.
 */
export function useTypewriter(
  text: string,
  active: boolean,
  msPerChar = 24,
  startDelay = 0
): { shown: string; done: boolean } {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || reduced) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, msPerChar);
    }, startDelay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, active, msPerChar, startDelay, reduced]);

  const effective = !active || reduced ? text.length : count;
  return { shown: text.slice(0, effective), done: effective >= text.length };
}

/**
 * The act word: an enormous Anton word sitting behind the subject, bleeding
 * toward the frame edges, occluded by whatever renders above it. Letters
 * rise in with a tight stagger; `tone="tan"` exists for exactly one slide —
 * DECIDE — where the word itself is the human act.
 */
export function GiantWord({
  children,
  size = "36vh",
  top = "50%",
  tone = "ink",
  delay = 0.1,
}: {
  children: string;
  size?: string;
  top?: string;
  tone?: "ink" | "tan" | "ghost";
  delay?: number;
}) {
  const rm = useReducedMotion();
  const color =
    tone === "tan"
      ? "var(--color-tan)"
      : tone === "ghost"
        ? "color-mix(in srgb, var(--color-ink) 9%, transparent)"
        : "var(--color-ink)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-0 flex select-none justify-center overflow-hidden"
      style={{ top, transform: "translateY(-50%)" }}
    >
      <div
        className="whitespace-nowrap uppercase leading-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: size,
          letterSpacing: "-0.01em",
          color,
        }}
      >
        {children.split("").map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={rm ? { opacity: 0 } : { opacity: 0, y: "0.14em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + i * 0.035, duration: 0.7, ease: EASE }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** A white working panel floating over the act word. */
export function Panel({
  children,
  className = "",
  delay = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      initial={rm ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: EASE }}
      className={`relative z-10 border border-ink/15 bg-surface ${className}`}
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      {children}
    </motion.div>
  );
}

/** Bottom-left slide label — the headline as a caption, GRMNT-small. */
export function SlideLabel({
  children,
  delay = 0.4,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="mark-label absolute bottom-[6vh] left-[6vw] z-20 text-[1.5vmin] text-g600"
    >
      {children}
    </motion.div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SceneCover, SceneFilm, SceneMap, SceneReading } from "./act1";
import { SceneArtifact, SceneClose, SceneMongo } from "./act4";
import { SceneShot } from "./shots";

export const LAST = 10;

/**
 * Slides that share a visual composition share a group; within a group a
 * keypress changes a prop, never remounts — 5→6 is the deck's one build:
 * the rule is stored and the agent's sweep fills the right column.
 */
/** Presented path: 1 → 2 → 3 (film) → 4 → 5. Frames 6–10 are the appendix —
 *  the old demo frames, used only if the video fails (7→8 is the one build). */
const GROUP: Record<number, string> = {
  0: "cover",
  1: "reading",
  2: "map",
  3: "film",
  4: "artifact",
  5: "close",
  6: "register",
  7: "teach",
  8: "teach",
  9: "filings",
  10: "mongo",
};

function Scene({ n }: { n: number }) {
  switch (GROUP[n]) {
    case "cover": return <SceneCover />;
    case "reading": return <SceneReading />;
    case "map": return <SceneMap />;
    case "film": return <SceneFilm />;
    case "register":
      return (
        <SceneShot
          src="/shots/register.png"
          chip="RECORDED FRAME — THE REGISTER"
          caption="Film beat 1 — sixteen contracts, the trapped seven million"
        />
      );
    case "teach":
      return n >= 8 ? (
        <SceneShot
          src="/shots/activity.png"
          chip="RECORDED FRAME — THE SWEEP"
          caption="Film beat 2 — one click re-checked the register in under two seconds"
        />
      ) : (
        <SceneShot
          src="/shots/teach.png"
          chip="RECORDED FRAME — THE CORRECTION"
          caption="Film beat 2 — a risk officer overrules the machine in two sentences"
        />
      );
    case "filings":
      return (
        <SceneShot
          src="/shots/sunrise.png"
          chip="RECORDED FRAME — A REAL SEC FILING"
          caption="Film beat 3 — 113,731 characters; the agent read the eleven passages that matter"
        />
      );
    case "mongo": return <SceneMongo />;
    case "artifact": return <SceneArtifact />;
    case "close": return <SceneClose />;
    default: return null;
  }
}

export default function Deck() {
  // Client-only mount avoids hydration jumps and lets the initial slide
  // come from the hash (#7 → slide 7).
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const h = Number(window.location.hash.replace("#", ""));
      setN(h >= 0 && h <= LAST ? h : 0);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    if (n != null) history.replaceState(null, "", `#${n}`);
  }, [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setN((v) => (v == null ? 0 : Math.min(LAST, v + 1)));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setN((v) => (v == null ? 0 : Math.max(0, v - 1)));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Zero chrome: even the cursor leaves after 2s idle.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 2000);
    };
    wake();
    window.addEventListener("mousemove", wake);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", wake);
    };
  }, []);

  if (n === null) return <div className="fixed inset-0 bg-paper" />;

  return (
    <div
      className={`fixed inset-0 select-none overflow-hidden bg-paper leading-[1.15] text-ink ${
        idle ? "cursor-hidden" : ""
      }`}
    >
      {/* still studio: grain and vignette only — motion belongs to the marks */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="deck-vignette absolute inset-0" />
        <div className="deck-grain absolute inset-0" />
      </div>
      <AnimatePresence initial={false}>
        <motion.div
          key={GROUP[n]}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Scene n={n} />
        </motion.div>
      </AnimatePresence>
      {/* slide-deck affordance: two quiet chevrons, clickable */}
      <div className="mark-label absolute bottom-[3vh] right-[3vw] z-30 flex items-center gap-[1.6vmin] text-[2vmin] text-g600">
        <button
          aria-label="Previous slide"
          onClick={() => setN((v) => (v == null ? 0 : Math.max(0, v - 1)))}
          className="cursor-pointer transition-colors hover:text-ink"
        >
          &#8249;
        </button>
        <button
          aria-label="Next slide"
          onClick={() => setN((v) => (v == null ? 0 : Math.min(LAST, v + 1)))}
          className="cursor-pointer transition-colors hover:text-ink"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

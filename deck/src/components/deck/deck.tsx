"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SceneRegulation, ScenePowerpoint, SceneBox } from "./act1";
import { SceneQueue, SceneDraft, SceneDecide } from "./act2";
import { SceneUnplug } from "./act3";
import { SceneSpec, SceneNumber, SceneClose } from "./act4";

export const LAST = 12;

/**
 * Slides that share a visual composition share a group; within a group a
 * keypress changes a prop, never remounts — 4→5 and 6→7 are builds: the
 * queue opens, the draft gets overruled.
 */
const GROUP: Record<number, string> = {
  1: "reg", 2: "ppt", 3: "box",
  4: "queue", 5: "queue",
  6: "draft", 7: "draft",
  8: "decide", 9: "unplug",
  10: "spec", 11: "number", 12: "close",
};

function Scene({ n }: { n: number }) {
  switch (GROUP[n]) {
    case "reg": return <SceneRegulation />;
    case "ppt": return <ScenePowerpoint />;
    case "box": return <SceneBox />;
    case "queue": return <SceneQueue opened={n >= 5} />;
    case "draft": return <SceneDraft overridden={n >= 7} />;
    case "decide": return <SceneDecide />;
    case "unplug": return <SceneUnplug />;
    case "spec": return <SceneSpec />;
    case "number": return <SceneNumber />;
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
      setN(h >= 1 && h <= LAST ? h : 1);
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
        setN((v) => (v == null ? 1 : Math.min(LAST, v + 1)));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setN((v) => (v == null ? 1 : Math.max(1, v - 1)));
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
    </div>
  );
}

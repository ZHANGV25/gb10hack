"use client";
import { motion, useReducedMotion } from "motion/react";
import { EASE, GiantWord, Panel, SlideLabel, useStages } from "./primitives";
import { Callout, Crosshair, RegMarks, Ruler, Sparkline } from "./marks";

/* ── Slide 1 — the regulation ────────────────────────────────────────────
   A statute page floating over the act word. The only color on the slide
   arrives when the four words that matter are spoken. */

export function SceneRegulation() {
  const stage = useStages([2600]);
  const rm = useReducedMotion();
  return (
    <div className="absolute inset-0">
      <GiantWord size="26vh" top="33%">IN-HOUSE</GiantWord>
      <RegMarks />
      <Crosshair x="8%" y="14%" delay={0.9} />
      <Crosshair x="93%" y="82%" delay={1.1} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Panel className="w-[64vmin] px-[5.2vmin] py-[4.6vmin]" delay={0.5}>
          <div className="mark-label mb-[0.9vmin] text-[1.3vmin] text-g500">
            Regulation (EU) 2022/2554 — DORA
          </div>
          <div className="mb-[2.6vmin] text-[2.5vmin] font-medium tracking-tight">
            Article 28(8)
          </div>
          <p className="text-[2.05vmin] leading-[1.75] text-g700">
            &ldquo;&hellip;financial entities shall put in place{" "}
            <span className="text-ink">transition plans</span> enabling them to{" "}
            <span className="text-ink">remove the contracted ICT services</span>{" "}
            and the relevant data from the ICT third-party service provider and
            to securely and integrally transfer them to alternative providers or{" "}
            <span className="relative inline-block whitespace-nowrap">
              <motion.span
                initial={{ color: "var(--color-ink)" }}
                animate={{
                  color: stage >= 1 ? "var(--color-tan)" : "var(--color-ink)",
                }}
                transition={{ duration: 0.5 }}
                className="font-medium"
              >
                reincorporate them in-house
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stage >= 1 ? 1 : 0 }}
                transition={{ duration: rm ? 0 : 0.7, ease: EASE }}
                className="absolute -bottom-[0.3vmin] left-0 h-[0.35vmin] w-full origin-left bg-tan"
              />
            </span>
            .&rdquo;
          </p>
        </Panel>
      </div>
      <SlideLabel>Every EU bank on a cloud AI has this duty</SlideLabel>
    </div>
  );
}

/* ── Slide 2 — a slide ───────────────────────────────────────────────────
   The industry's actual exit plan, rendered faithfully: one sad corporate
   slide. The act word does the talking. */

export function ScenePowerpoint() {
  return (
    <div className="absolute inset-0">
      <GiantWord size="30vh" top="35%">A SLIDE</GiantWord>
      <RegMarks />
      <Sparkline x="6%" y="72%" delay={1.4} />
      <Ruler x="88%" y="30%" vertical len={16} label="fig. 1" delay={1.2} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
          className="aspect-video w-[52vmin] border border-ink/12 bg-white px-[3.6vmin] py-[2.8vmin]"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >
          <div className="text-[2.5vmin] font-semibold tracking-tight text-g700">
            Exit Strategy
          </div>
          <div className="mb-[2.2vmin] mt-[0.6vmin] h-px w-[9vmin] bg-g300" />
          <ul className="space-y-[1.35vmin] text-[1.75vmin] text-g600">
            <li>• Assess alternative providers</li>
            <li>• Define migration timeline</li>
            <li>• Reincorporate in-house (TBD)</li>
          </ul>
          <div className="mt-[2.6vmin] flex gap-[0.8vmin]">
            {["PLAN", "MIGRATE", "DONE?"].map((t, i) => (
              <div
                key={t}
                className="mark-label flex h-[3.4vmin] flex-1 items-center justify-center bg-g200 text-[1.05vmin] text-g500"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 1.2vmin) 0, 100% 50%, calc(100% - 1.2vmin) 100%, 0 100%, 1.2vmin 50%)",
                  opacity: 1 - i * 0.18,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="mt-[2vmin] text-right text-[1.1vmin] text-g400">
            Slide 47 of 63 · last reviewed 2024
          </div>
        </motion.div>
      </div>
      <SlideLabel>Ask a bank what the plan looks like</SlideLabel>
    </div>
  );
}

/* ── Slide 3 — the box ───────────────────────────────────────────────────
   The subject, SLEEPER-composed: a line-drawn GB10 against its own name,
   annotated like a spec sheet. The drawing occludes the word. */

function Gb10Drawing() {
  const rm = useReducedMotion();
  const draw = (delay: number) => ({
    initial: rm ? { opacity: 0 } : { pathLength: 0, opacity: 1 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { delay, duration: 1.0, ease: EASE },
  });
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full overflow-visible">
      <defs>
        <pattern id="lattice" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2.4" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" opacity="0.5" />
        </pattern>
      </defs>
      {/* faces fill first so the drawing occludes the act word behind it */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <polygon points="140,60 360,60 300,30 80,30" fill="#eceae5" />
        <polygon points="140,60 80,30 80,230 140,260" fill="#e0ded8" />
        <rect x="140" y="60" width="220" height="200" fill="#f4f3f0" />
      </motion.g>
      {/* edges draw in */}
      <motion.rect x="140" y="60" width="220" height="200" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" {...draw(0.6)} />
      <motion.path d="M140 60 L80 30 L300 30 L360 60" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" {...draw(0.85)} />
      <motion.path d="M80 30 L80 230 L140 260" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" {...draw(1.05)} />
      {/* the lattice front face */}
      <motion.rect
        x="152" y="72" width="196" height="176" fill="url(#lattice)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.9 }}
      />
      {/* power stud */}
      <motion.circle
        cx="344" cy="76" r="3.4" fill="var(--color-ink)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.4 }}
      />
    </svg>
  );
}

export function SceneBox() {
  return (
    <div className="absolute inset-0">
      <GiantWord size="32vh" top="37%">EXITPLAN</GiantWord>
      <RegMarks />
      <Sparkline x="5.5%" y="66%" delay={2.6} />
      <Ruler x="90%" y="26%" vertical len={18} label="scale 1:1" delay={2.4} />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative h-[46vmin] w-[61vmin] translate-y-[6vmin]">
          <Gb10Drawing />
        </div>
      </div>
      <Callout
        x={24} y={30} to={{ x: 45.5, y: 44 }}
        title="Compute"
        lines={["NVIDIA GB10", "128GB unified memory"]}
        delay={2.1}
      />
      <Callout
        x={77} y={68} to={{ x: 60, y: 58 }}
        title="Models"
        lines={["on the disk,", "not an API"]}
        delay={2.6}
      />
      <Callout
        x={26} y={79} to={{ x: 43, y: 64 }}
        title="Uplink"
        lines={["not required"]}
        delay={3.1}
      />
      <div className="absolute bottom-[10vh] left-1/2 z-10 -translate-x-1/2">
        <Ruler x="0" y="0" len={26} ticks={9} label="150 × 150 × 50.5 mm" delay={2.9} />
      </div>
      <SlideLabel delay={3.4}>
        Financial-crime triage · drafts, cites, never decides
      </SlideLabel>
    </div>
  );
}

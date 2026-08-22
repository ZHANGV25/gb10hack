"use client";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { EASE, Panel, SlideLabel } from "./primitives";
import { Callout, RegMarks } from "./marks";

/* ── Slide 3 — the register (demo §1 fallback) ───────────────────────────
   The real register, restyled: real vendors, real values from book.py,
   the €7,030,000 tile carrying the argument. Live, the presenter is on
   the product — this frame exists for the public URL and for disaster. */

const ROWS: [string, string, string, "blocking" | "material" | null][] = [
  ["Helvetia Cloud Services AG", "Core banking hosting", "4,180,000", "blocking"],
  ["Castellan Core Systems Ltd", "Core banking software", "3,320,000", "material"],
  ["Meridian Payments B.V.", "Card processing", "2,640,000", "blocking"],
  ["Nordlys Data Centre A/S", "Colocation", "1,950,000", null],
  ["Orion Trading Systems Ltd", "Market data", "1,460,000", null],
  ["Aurora KYC Ltd", "Sanctions screening", "890,000", "material"],
  ["Skyward Analytics SA", "Regulatory reporting", "720,000", "material"],
  ["Tessera Identity BV", "Identity verification", "640,000", null],
  ["Vantage HR Cloud Inc.", "HR and payroll", "210,000", "blocking"],
  ["Brightmail Secure GmbH", "Email security", "145,000", null],
  ["Larsen Legal Archive AB", "Document archive", "132,000", "material"],
  ["Pinnacle Managed Print BV", "Printing", "88,000", null],
];

function Tile({
  label,
  value,
  sub,
  emphasis,
  delay,
  numeric,
}: {
  label: string;
  value: string;
  sub: string;
  emphasis?: boolean;
  delay: number;
  numeric?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className={`border px-[1.8vmin] py-[1.4vmin] ${
        emphasis ? "border-ink bg-chip text-paper" : "border-ink/15 bg-surface"
      }`}
      style={emphasis ? undefined : { boxShadow: "var(--shadow-panel)" }}
    >
      <div
        className={`mark-label text-[1vmin] ${emphasis ? "text-paper/70" : "text-g500"}`}
      >
        {label}
      </div>
      <div className="tnum mt-[0.5vmin] font-mono text-[2.6vmin] font-semibold tracking-tight">
        {numeric != null ? (
          <>
            €<NumberFlow value={numeric} transformTiming={{ duration: 1200, easing: "ease-out" }} />
          </>
        ) : (
          value
        )}
      </div>
      <div
        className={`mt-[0.35vmin] text-[1.05vmin] leading-[1.4] ${
          emphasis ? "text-paper/70" : "text-g500"
        }`}
      >
        {sub}
      </div>
    </motion.div>
  );
}

export function SceneRegister() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[2vmin]">
        {/* tiles */}
        <div className="grid w-[84vmin] grid-cols-4 gap-[1.4vmin]">
          <Tile label="Arrangements with gaps" value="7" sub="of 12 read" delay={0.3} />
          <Tile
            label="Cannot be cleanly exited"
            value="€7,030,000"
            numeric={7030000}
            sub="annual charge · blocking gap present"
            emphasis
            delay={0.45}
          />
          <Tile label="Article 30 gaps found" value="10" sub="3 blocking" delay={0.6} />
          <Tile
            label="Total contracted"
            value="€16,375,000"
            sub="12 suppliers · 8 critical"
            delay={0.75}
          />
        </div>

        <div className="flex w-[84vmin] items-start gap-[1.6vmin]">
          {/* the register table */}
          <Panel className="flex-1 px-[1.6vmin] py-[1.2vmin]" delay={0.6}>
            <div className="mark-label flex items-center justify-between pb-[0.8vmin] text-[1.05vmin] text-g500">
              <span>ICT third-party register</span>
              <span className="bg-chip px-[0.9vmin] py-[0.35vmin] text-[0.9vmin] text-paper">
                12 arrangements · €16.4M/yr · measured 22 aug
              </span>
            </div>
            <div className="font-mono text-[1.22vmin] leading-[1.92]">
              {ROWS.map(([vendor, fn, value, gap], i) => (
                <motion.div
                  key={vendor}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.35, ease: EASE }}
                  className="grid grid-cols-[1.4vmin_18em_1fr_7em] items-center gap-[1.2vmin] border-t border-ink/8 px-[0.6vmin]"
                >
                  <span className="text-[1.1vmin]">
                    {gap === "blocking" ? "●" : gap === "material" ? "○" : ""}
                  </span>
                  <span className={gap === "blocking" ? "font-semibold" : ""}>
                    {vendor}
                  </span>
                  <span className="truncate text-g500">{fn}</span>
                  <span className="tnum text-right">{value}</span>
                </motion.div>
              ))}
            </div>
            <div className="mark-label mt-[0.7vmin] border-t border-ink/8 pt-[0.7vmin] text-[0.95vmin] text-g500">
              ● blocking gap · ○ material gap · values EUR/yr
            </div>
          </Panel>

          {/* the estate view */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.7, ease: EASE }}
            className="w-[26vmin] border border-ink/15 bg-surface px-[1.8vmin] py-[1.5vmin]"
            style={{ boxShadow: "var(--shadow-panel)" }}
          >
            <div className="mark-label mb-[1.2vmin] text-[1.05vmin] text-g500">
              Where the estate is weakest
            </div>
            {[
              ["No penetration-testing clause", "2 contracts"],
              ["Data locations undisclosed", "2 contracts"],
              ["No exit strategy", "1 contract — core banking"],
            ].map(([label, count], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 + i * 0.2, duration: 0.4 }}
                className="border-t border-ink/10 py-[1vmin]"
              >
                <div className="text-[1.3vmin] leading-[1.5]">{label}</div>
                <div className="tnum font-mono text-[1.1vmin] text-g500">{count}</div>
              </motion.div>
            ))}
            <div className="mt-[1vmin] border-t border-ink/10 pt-[1vmin] font-mono text-[1.1vmin] leading-[1.7] text-g600">
              The same clause missing across suppliers is a contracting problem,
              not a supplier problem.
            </div>
          </motion.div>
        </div>
      </div>
      <SlideLabel delay={2.2}>
        Demo §1 · the register — every arrangement, checked against Article 30
      </SlideLabel>
    </div>
  );
}

/* ── Slide 4 — Helvetia (demo §2 fallback) ───────────────────────────────
   The good contract with the one absent clause that matters. One passed
   row is expanded to its verbatim quote — the model's entire authority. */

const CHECKLIST: [string, "ok" | "absent"][] = [
  ["Clear description of the services", "ok"],
  ["Service and data locations disclosed", "ok"],
  ["Availability, integrity, confidentiality", "ok"],
  ["Access, recovery and return of data", "ok"],
  ["Service level descriptions", "ok"],
  ["Assistance on ICT incidents", "ok"],
  ["Cooperation with competent authorities", "ok"],
  ["Termination rights and notice periods", "ok"],
  ["Security awareness participation", "ok"],
  ["Quantitative performance targets", "ok"],
  ["Notice periods and reporting", "ok"],
  ["Contingency plans and security measures", "ok"],
  ["Threat-led penetration testing", "ok"],
  ["Access, inspection and audit", "ok"],
  ["Exit strategy and transition period", "absent"],
];

export function SceneHelvetia() {
  return (
    <div className="absolute inset-0">
      <RegMarks />
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[2.4vmin]">
        <Panel className="w-[44vmin] px-[2.6vmin] py-[2.2vmin]" delay={0.3}>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[2vmin] font-medium tracking-tight">
                Helvetia Cloud Services AG
              </div>
              <div className="mark-label mt-[0.4vmin] text-[1.05vmin] text-g500">
                Core banking platform · €4,180,000/yr
              </div>
            </div>
            <div className="flex items-center gap-[0.8vmin]">
              <span className="mark-label border border-ink/30 px-[0.9vmin] py-[0.4vmin] text-[0.95vmin] text-g600">
                critical
              </span>
              <span className="mark-label bg-chip px-[0.9vmin] py-[0.4vmin] text-[0.95vmin] text-paper">
                14 / 15
              </span>
            </div>
          </div>
          <div className="mt-[1.6vmin] columns-2 gap-[2vmin] font-mono text-[1.18vmin] leading-[2]">
            {CHECKLIST.map(([label, state], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.07, duration: 0.3 }}
                className={`break-inside-avoid ${
                  state === "absent"
                    ? "bg-ink/6 px-[0.6vmin] font-semibold"
                    : "px-[0.6vmin] text-g600"
                }`}
                style={
                  state === "absent"
                    ? { boxShadow: "inset 0.3vmin 0 0 var(--color-ink)" }
                    : undefined
                }
              >
                {state === "ok" ? "✓ " : "✗ "}
                {label}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
            className="mark-label mt-[1.6vmin] border-t border-ink/12 pt-[1.2vmin] text-[1.1vmin] text-g600"
          >
            Absent — blocking: no transition period · no duty to assist
            migration · Art. 28(8) cannot be evidenced
          </motion.div>
        </Panel>

        {/* the quoted clause */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: EASE }}
          className="w-[32vmin] border border-ink/15 bg-white px-[2.2vmin] py-[2vmin]"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >
          <div className="mark-label mb-[1vmin] text-[1.05vmin] text-g500">
            ✓ Access, inspection and audit — the clause the model relied on
          </div>
          <p className="font-mono text-[1.3vmin] leading-[1.85] text-g700">
            &ldquo;&hellip;the Customer shall have{" "}
            <span className="bg-g200 px-[0.3vmin] text-ink">
              unrestricted rights of access to, inspection of and audit of
            </span>{" "}
            the Supplier&rsquo;s premises, systems, records and personnel
            relating to the Services&hellip;&rdquo;
          </p>
          <div className="mark-label mt-[1.4vmin] border-t border-ink/10 pt-[1.1vmin] text-[1vmin] text-g500">
            §14 · quoted verbatim · a claim with no quote is recorded as absent
          </div>
        </motion.div>
      </div>
      <Callout
        x={9.5}
        y={26}
        to={{ x: 29, y: 26.5 }}
        title="A good contract"
        lines={["fourteen of fifteen —", "and an exit that isn't there"]}
        delay={2.3}
      />
      <SlideLabel delay={2.6}>
        Demo §2 · an exit plan that cannot be executed
      </SlideLabel>
    </div>
  );
}

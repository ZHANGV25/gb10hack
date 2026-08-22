import Link from "next/link";
import { REVISION, SLIDES, spokenWordCount } from "@/lib/slides";

export const metadata = { title: "ExitPlan — pitch script" };

/** The narration surface for the person at the microphone — same idea as
 *  shopifyhack's /script: generated from src/lib/slides.ts, never hand-edited.
 *  Acts group the beats; (parens) lines are stage directions, not spoken;
 *  the tan sentence is the load-bearing one — said slowest. */
export default function Script() {
  const words = spokenWordCount();
  const minutes = words / 140; // spoken pace
  const est = `${Math.floor(minutes)}:${String(Math.round((minutes % 1) * 60)).padStart(2, "0")}`;
  const acts = [...new Set(SLIDES.map((s) => s.act))];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* header */}
        <div className="border-b border-ink/15 pb-6">
          <div className="mark-label text-[11px] text-g500">ExitPlan · pitch script</div>
          <h1
            className="mt-2 text-[44px] uppercase leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Script
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              `${SLIDES.length} slides`,
              `${words} spoken words`,
              `~${est} + pauses & demo`,
              REVISION,
            ].map((chip) => (
              <span
                key={chip}
                className="mark-label bg-chip px-2.5 py-1 text-[10px] text-paper"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-g600">
            Spoken words only — <span className="italic">(parens)</span> are stage
            directions. The <span className="font-medium text-tan">tan sentence</span> is
            load-bearing: say it slowest. Slide numbers link into the live deck.
            Arrow keys advance the deck; slides marked <span className="mark-label text-[10px]">build</span> are
            a keypress on the same scene, not a new slide.
          </p>
        </div>

        {/* acts */}
        {acts.map((act) => (
          <section key={act} className="mt-12">
            <div className="mark-label mb-6 flex items-center gap-3 text-[11px] text-g500">
              <span className="hairline h-px w-8" />
              Act {act}
            </div>
            <ol className="space-y-10">
              {SLIDES.filter((s) => s.act === act).map((s) => (
                <li key={s.n} className="group">
                  <div className="flex items-baseline gap-3">
                    <Link
                      href={`/#${s.n}`}
                      className="mark-label border border-ink/25 px-2 py-0.5 text-[11px] text-g600 transition-colors hover:bg-ink hover:text-paper"
                    >
                      {String(s.n).padStart(2, "0")}
                    </Link>
                    <span className="mark-label text-[12px] text-ink">{s.label}</span>
                    {s.build && (
                      <span className="mark-label bg-g200 px-1.5 py-0.5 text-[9px] text-g600">
                        build
                      </span>
                    )}
                  </div>
                  <div className="mt-2 border-l border-ink/15 pl-4">
                    <p className="font-mono text-[11.5px] leading-relaxed text-g500">
                      {s.onscreen}
                    </p>
                    <div className="mt-3 space-y-2">
                      {s.narration.map((line, i) =>
                        line.startsWith("(") ? (
                          <p key={i} className="text-[13px] italic text-g500">
                            {line}
                          </p>
                        ) : (
                          <p
                            key={i}
                            className={
                              line === s.loadBearing
                                ? "text-[19px] font-medium leading-relaxed text-tan underline decoration-tan/50 underline-offset-4"
                                : "text-[17px] leading-relaxed"
                            }
                          >
                            {line}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <div className="mark-label mt-16 border-t border-ink/15 pt-6 text-[10px] text-g500">
          Generated from src/lib/slides.ts — do not hand-edit this page. Full staging
          rationale: docs/PITCH-V2.md. Deck scenes are being updated to this arc.
        </div>
      </div>
    </main>
  );
}

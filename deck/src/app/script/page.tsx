import { SLIDES } from "@/lib/slides";

export const metadata = { title: "ExitPlan — script" };

/** The narration, printable, for the person at the microphone. */
export default function Script() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-medium tracking-tight">ExitPlan — narration</h1>
      <p className="mt-2 text-sm text-g500">
        12 slides · ~3:40 narrated · arrow keys advance · slides 5 and 7 are
        builds. Delivery notes live in docs/DECK-PLAN.md.
      </p>
      <ol className="mt-10 space-y-8">
        {SLIDES.map((s) => (
          <li key={s.n}>
            <div className="mark-label text-[11px] text-g500">
              {s.n} {s.build ? "· build" : ""} — {s.label}
            </div>
            <div className="mt-2 space-y-1.5 border-l-2 border-g300 pl-4">
              {s.narration.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith("(")
                      ? "text-sm italic text-g500"
                      : "text-[17px] leading-relaxed"
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

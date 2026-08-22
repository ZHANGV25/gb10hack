"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Gap } from "@/lib/dora";
import { provisionsFor } from "@/lib/provisions";

const OUTCOMES = [
  {
    id: "reject",
    label: "Not compliant",
    hint: "The bank cannot rely on this arrangement as written. Blocks renewal until remediated.",
  },
  {
    id: "escalate",
    label: "Gaps to close",
    hint: "Usable, but the gaps must be remediated at the next contract review.",
  },
  {
    id: "accept",
    label: "Acceptable as written",
    hint: "The gap is real but not material for this kind of service. Records an accepted exception.",
  },
];

const SCOPES = [
  { id: "all", label: "every arrangement" },
  { id: "critical", label: "critical functions only" },
  { id: "non_critical", label: "non-critical only" },
];

export function ReviewPanel({
  refId,
  critical,
  currentDecision,
  gaps,
}: {
  refId: string;
  critical: boolean;
  currentDecision: string | null;
  gaps: Gap[];
}) {
  const router = useRouter();
  const [teaching, setTeaching] = useState(false);
  const [outcome, setOutcome] = useState("reject");
  const [provision, setProvision] = useState(gaps[0]?.provision ?? "");
  const [scope, setScope] = useState("all");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const options = provisionsFor(critical);

  async function submit() {
    setError(null);
    setBusy(true);
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ref: refId,
        outcome,
        provision: provision || null,
        reason,
        scope,
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error ?? "Could not store the rule.");
      return;
    }
    setDone(
      "Rule stored. The agent picked it up and is re-checking every contract in the register.",
    );
    setTeaching(false);
    setReason("");
    setTimeout(() => router.refresh(), 1200);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-foreground/15 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
        <h2 className="text-[13px] font-medium">Reviewer decision</h2>
        <span className="text-[12px] text-muted-foreground">
          M. Halvorsen, Third-Party Risk
        </span>
      </div>

      <div className="px-4 py-3">
        {done ? (
          <p className="mb-3 rounded-md border border-emerald-600/25 bg-emerald-50 px-3 py-2 text-[13px] leading-5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            {done}
          </p>
        ) : null}

        {!teaching ? (
          <>
            <p className="text-[13px] leading-5 text-muted-foreground">
              The agent reads the contract; you decide what the bank does about
              it. If you disagree, the reason you write becomes a rule it
              applies to every similar arrangement from now on.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDone(
                    "Assessment confirmed. Nothing was changed and no new rule was stored.",
                  );
                }}
              >
                Agree with the assessment
              </Button>
              <Button onClick={() => setTeaching(true)}>
                Disagree &mdash; correct it
              </Button>
            </div>
            {currentDecision ? (
              <p className="mt-2 text-[12px] text-muted-foreground">
                Current verdict: {currentDecision}. Agreeing records no change.
              </p>
            ) : null}
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-[12px] font-medium">
                What should the verdict be?
              </p>
              <div className="mt-1.5 space-y-1.5">
                {OUTCOMES.map((o) => (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 transition-colors ${
                      outcome === o.id
                        ? "border-foreground bg-surface-muted/70"
                        : "border-hairline hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value={o.id}
                      checked={outcome === o.id}
                      onChange={() => setOutcome(o.id)}
                      className="mt-1 accent-foreground"
                    />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium">
                        {o.label}
                      </span>
                      <span className="block text-[12px] leading-4 text-muted-foreground">
                        {o.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] font-medium">
                  Which provision is this about?
                </span>
                <select
                  value={provision}
                  onChange={(e) => setProvision(e.currentTarget.value)}
                  className="mt-1 h-8 w-full rounded-md border border-hairline bg-surface px-2 text-[13px] outline-none focus:border-foreground/25"
                >
                  <option value="">Any provision</option>
                  {options.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.article} — {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[12px] font-medium">Apply this to</span>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.currentTarget.value)}
                  className="mt-1 h-8 w-full rounded-md border border-hairline bg-surface px-2 text-[13px] outline-none focus:border-foreground/25"
                >
                  {SCOPES.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-[12px] font-medium">
                Why? This sentence becomes the rule.
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.currentTarget.value)}
                rows={3}
                placeholder="e.g. An auto-renewing term with a notice period longer than twelve months is lock-in. Treat it as an exit deficiency, not a routine gap."
                className="mt-1 w-full rounded-md border border-hairline bg-surface px-2.5 py-2 text-[13px] leading-5 outline-none placeholder:text-muted-foreground/60 focus:border-foreground/25 focus:ring-3 focus:ring-foreground/5"
              />
              <span className="text-[11px] text-muted-foreground">
                Stored as a vector, so the agent finds it again on contracts with
                a similar gap — not only this one.
              </span>
            </label>

            {error ? (
              <p className="rounded-md border border-flag/30 bg-flag-soft px-3 py-2 text-[13px] leading-5 text-flag">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button disabled={busy || reason.trim().length < 15} onClick={submit}>
                {busy ? "Storing…" : "Store rule and re-check the register"}
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setTeaching(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

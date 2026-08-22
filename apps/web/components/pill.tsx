import type { Tone } from "@/lib/format";

const TONE: Record<Tone, string> = {
  flag: "border-flag/25 bg-flag-soft text-flag",
  watch: "border-watch/25 bg-watch-soft text-watch",
  clear: "border-hairline bg-surface-muted text-muted-foreground",
};

const DOT: Record<Tone, string> = {
  flag: "bg-flag",
  watch: "bg-watch",
  clear: "bg-muted-foreground/50",
};

export function Pill({
  tone = "clear",
  children,
  className = "",
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-4 whitespace-nowrap ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = "clear" }: { tone?: Tone }) {
  return <span className={`size-1.5 shrink-0 rounded-full ${DOT[tone]}`} />;
}

export function Rail({ tone = "clear" }: { tone?: Tone }) {
  return (
    <span
      className={`absolute inset-y-0 left-0 w-[2px] ${DOT[tone]}`}
      aria-hidden
    />
  );
}

/** Small uppercase section label. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

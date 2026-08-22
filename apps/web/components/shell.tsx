import Link from "next/link";

const links = [
  { href: "/", label: "Alerts" },
  { href: "/audit", label: "Activity" },
];

export function Shell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <header className="border-b border-border/80 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="leading-tight">
              <span className="block text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                Nordhafen Bank
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Financial crime
              </span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    current === l.href
                      ? "text-foreground"
                      : "hover:text-foreground"
                  }
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">
              Analyst desk
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs">
              On-prem · synthetic
            </span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

export function severityLabel(severity: string) {
  if (severity === "red_flag") return "Red flag";
  if (severity === "review") return "Needs review";
  return "Likely noise";
}

export function decisionLabel(decision: string | null, severity: string) {
  if (decision === "close_noise") return "Dismissed";
  if (decision === "escalate") return "Sent to MLRO";
  if (decision === "file_sar") return "SAR submitted";
  return severityLabel(severity);
}

export function ruleOrigin(ruleId: string) {
  if (ruleId.startsWith("WATCHLIST") || ruleId === "RED_FLAG_SANCTIONS") {
    return "Watchlist scan";
  }
  if (ruleId === "HIGH_RISK_CORRIDOR") return "Payment corridor";
  if (ruleId === "STRUCTURING") return "Cash structuring";
  return "Rule engine";
}

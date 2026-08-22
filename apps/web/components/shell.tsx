import Link from "next/link";

const links = [
  { href: "/", label: "Alerts" },
  { href: "/system", label: "How a case moves" },
  { href: "/audit", label: "Activity" },
];

function active(current: string, href: string) {
  if (href === "/") return current === "/" || current.startsWith("/alerts");
  return current === href || current.startsWith(href);
}

export function Shell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex flex-wrap items-center gap-8">
            <Link href="/" className="leading-tight">
              <span className="block text-sm tracking-wide text-muted-foreground">
                Nordhafen Bank
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Financial crime
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-1 text-base">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    active(current, l.href)
                      ? "rounded-full bg-foreground px-4 py-2 text-background"
                      : "rounded-full px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <span className="rounded-full bg-muted px-4 py-1.5 text-sm">
            Confidential
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}

export function severityLabel(severity: string) {
  if (severity === "red_flag") return "Red flag";
  if (severity === "review") return "Needs review";
  return "Likely false alert";
}

export function decisionLabel(decision: string | null, severity: string) {
  if (decision === "close_noise") return "Dismissed";
  if (decision === "escalate") return "Referred to MLRO";
  if (decision === "file_sar") return "SAR submitted";
  return severityLabel(severity);
}

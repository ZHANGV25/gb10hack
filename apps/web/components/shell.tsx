import Link from "next/link";

const links = [
  { href: "/", label: "Alerts" },
  { href: "/system", label: "System" },
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
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link href="/" className="leading-tight">
              <span className="block text-[11px] tracking-wide text-muted-foreground">
                Nordhafen Bank
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Financial crime
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    active(current, l.href)
                      ? "text-foreground"
                      : "hover:text-foreground"
                  }
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px]">
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

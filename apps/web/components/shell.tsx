import Link from "next/link";

const links = [
  { href: "/", label: "Queue" },
  { href: "/audit", label: "Audit" },
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
      <header className="px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-tight">
            ExitPlan
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] text-muted-foreground sm:flex">
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
          <span className="rounded-full bg-foreground px-4 py-2 text-sm text-background">
            On this box
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
  return "Likely noise";
}

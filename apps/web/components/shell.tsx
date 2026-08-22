import Link from "next/link";

import { stats } from "@/lib/exitplan";

const NAV = [
  {
    href: "/",
    label: "Alert queue",
    hint: "Cases waiting for a decision",
    badge: "open" as const,
    icon: (
      <path d="M3 5.5h10M3 9h10M3 12.5h6" strokeLinecap="round" />
    ),
  },
  {
    href: "/audit",
    label: "Activity",
    hint: "Every action, kept for audit",
    icon: (
      <>
        <path d="M2 8h3l2-4 2 8 2-4h3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    href: "/system",
    label: "How it works",
    hint: "The pipeline, end to end",
    icon: (
      <>
        <rect x="2.5" y="2.5" width="4" height="4" rx="1" />
        <rect x="9.5" y="9.5" width="4" height="4" rx="1" />
        <path d="M4.5 6.5v4a1 1 0 0 0 1 1h4" strokeLinecap="round" />
      </>
    ),
  },
];

function isActive(current: string, href: string) {
  if (href === "/") return current === "/" || current.startsWith("/alerts");
  return current === href || current.startsWith(href);
}

export async function Shell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  const s = await stats().catch(() => null);
  const open = s ? s.total - s.decided : 0;

  return (
    <div className="flex min-h-full">
      <aside className="sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col border-r border-hairline bg-surface lg:flex">
        <div className="flex items-center gap-2.5 px-4 py-4">
          <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
            N
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] font-semibold">Nordhafen Bank</span>
            <span className="block text-[11px] text-muted-foreground">
              Financial crime desk
            </span>
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 px-2.5">
          {NAV.map((item) => {
            const active = isActive(current, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                  active
                    ? "bg-surface-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-surface-muted/70 hover:text-foreground"
                }`}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden
                >
                  {item.icon}
                </svg>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge === "open" && open > 0 ? (
                  <span className="rounded-full bg-foreground px-1.5 py-px font-mono text-[10px] leading-4 text-background">
                    {open}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 px-4">
          <p className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Today
          </p>
          {s ? (
            <dl className="mt-2 space-y-1.5">
              <SideStat label="Cases opened" value={s.total} />
              <SideStat label="Decided" value={s.decided} />
              <SideStat label="Awaiting you" value={open} emphasis={open > 0} />
            </dl>
          ) : null}
        </div>

        <div className="mt-auto border-t border-hairline px-4 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-medium">
            <span className="ep-live size-1.5 rounded-full bg-emerald-500" />
            Processing in this building
          </p>
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            Screening, drafting and records stay on the bank&rsquo;s own
            hardware. No customer data leaves the network.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-4 border-b border-hairline bg-background/85 px-5 backdrop-blur lg:px-8">
          <Link href="/" className="text-[13px] font-semibold lg:hidden">
            Nordhafen · Financial crime
          </Link>
          <nav className="flex items-center gap-3 text-[13px] text-muted-foreground lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive(current, item.href)
                    ? "text-foreground"
                    : "hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="ml-auto hidden items-center gap-2 text-[11px] text-muted-foreground lg:flex">
            <span>Analyst workspace</span>
            <span className="text-hairline">·</span>
            <span>A. Weber, Financial Crime Operations</span>
          </p>
          <span className="rounded-full border border-hairline px-2 py-0.5 text-[10px] tracking-wide text-muted-foreground">
            Confidential
          </span>
        </header>
        {children}
      </div>
    </div>
  );
}

function SideStat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-[12px] text-muted-foreground">{label}</dt>
      <dd
        className={`font-mono text-[12px] tabular-nums ${
          emphasis ? "font-semibold text-foreground" : "text-muted-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function Page({
  title,
  lede,
  aside,
  children,
}: {
  title: string;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-[1180px] px-5 py-7 pb-20 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[19px] font-semibold">{title}</h1>
          {lede ? (
            <p className="mt-1 max-w-2xl text-[13px] leading-5 text-muted-foreground">
              {lede}
            </p>
          ) : null}
        </div>
        {aside}
      </div>
      <div className="mt-6">{children}</div>
    </main>
  );
}

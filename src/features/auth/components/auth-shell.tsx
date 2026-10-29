import type { ReactNode } from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4h16v6a8 8 0 0 1-8 8H4z" />
          <path d="M4 12h9" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">Feedo</span>
    </div>
  );
}

const highlights = [
  "Collect feedback from every channel in one place",
  "Turn conversations into actionable insights",
  "Ship improvements your customers actually asked for",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col lg:flex-row">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-primary px-12 py-12 text-primary-foreground lg:flex lg:w-[46%] lg:flex-col lg:justify-between xl:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-white/10"
        />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 text-primary-foreground">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16v6a8 8 0 0 1-8 8H4z" />
                <path d="M4 12h9" />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight">Feedo</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Customer feedback that drives real product decisions.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/20">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed text-primary-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          &ldquo;Feedo helped us cut our feedback triage time in half.&rdquo; — Product team, Northwind
        </p>
      </aside>

      {/* Form panel */}
      <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              {subtitle}
            </p>
          </header>
          {children}
          {footer ? <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

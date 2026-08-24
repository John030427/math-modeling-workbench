"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiDock } from "@/components/AiDock";
import { AiProvider } from "@/components/AiContext";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/atlas", label: "Model Atlas" },
  { href: "/gym", label: "Modeling Gym" },
  { href: "/competition", label: "Competition" },
  { href: "/daily", label: "Daily Review" },
  { href: "/paper", label: "Paper Lab" },
  { href: "/profile", label: "Profile" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AiProvider>
      <div className="shell">
        <aside className="side">
          <div className="brand text-2xl leading-tight text-[var(--ink)]">
            数模工作台
          </div>
          <p className="muted mt-1 text-xs leading-relaxed">
            Learn → Practice → Solve → Review
          </p>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[var(--ink)] text-white"
                      : "hover:bg-white/70 text-[var(--ink-soft)]"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 panel text-xs muted">
            <div className="flex items-center gap-2 text-[var(--ink)]">
              <span className="live-dot" /> Demo Ready
            </div>
            <p className="mt-2">本地用户 demo · SQLite 持久化 · AI 可离线降级</p>
          </div>
        </aside>
        <main className="main fade-up">{children}</main>
        <AiDock />
      </div>
    </AiProvider>
  );
}

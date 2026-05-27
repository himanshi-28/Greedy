"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenCheck, CalendarPlus, History, LayoutDashboard, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/revision", label: "Revision", icon: BookOpenCheck },
  { href: "/history", label: "History", icon: History },
  { href: "/admin", label: "Admin", icon: CalendarPlus },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10 bg-[#fbfaf7]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-sm font-black text-white">
            LC
          </span>
          <span className="hidden text-base font-bold sm:block">LeetCode Tracker</span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink/70 transition hover:bg-black/5 hover:text-ink",
                  active && "bg-ink text-white hover:bg-ink hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenCheck, CalendarPlus, History, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/revision", label: "Revision", icon: BookOpenCheck },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function AppNav({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const visibleNavItems = profile?.role === "admin" ? [...navItems, { href: "/admin", label: "Admin", icon: CalendarPlus }] : navItems;

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[var(--nav)]/90 backdrop-blur dark:border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-ink text-sm font-black text-white shadow-panel">
            LC
          </span>
          <span className="hidden text-base font-bold sm:block">LeetCode Tracker</span>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink/70 transition hover:-translate-y-0.5 hover:bg-black/5 hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white",
                  active && "bg-ink text-white hover:bg-ink hover:text-white dark:bg-white dark:text-ink dark:hover:bg-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
          </div>
          <ThemeToggle />
          {profile ? (
            <div className="hidden items-center gap-2 rounded-md border border-black/10 bg-white px-2 py-1 dark:border-white/10 dark:bg-white/5 lg:flex">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="" width={28} height={28} className="rounded-md" />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-md bg-mist text-xs font-black dark:bg-white/10">
                  {profile.displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="max-w-28 truncate text-sm font-bold">{profile.displayName}</span>
              <form action={signOut}>
                <button className="grid h-8 w-8 place-items-center rounded-md text-ink/65 hover:bg-black/5 hover:text-ink dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="hidden h-10 items-center rounded-md bg-ink px-4 text-sm font-bold text-white lg:inline-flex">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

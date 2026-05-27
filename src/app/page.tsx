import Link from "next/link";
import { Award, CalendarPlus, Clock, ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ProblemCard } from "@/components/problem-card";
import { TimerSubmission } from "@/components/timer-submission";
import { getAppContext } from "@/lib/auth";
import { getTrackerData } from "@/lib/data";
import { buildLeaderboard } from "@/lib/scoring";

export default async function DashboardPage() {
  const context = await getAppContext();
  const { profiles, problems, attempts } = await getTrackerData();
  const today = problems.find((problem) => problem.status === "active") ?? null;
  const rows = buildLeaderboard(profiles, attempts, "daily");

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        {today ? (
          <ProblemCard problem={today} label="Today's problem" />
        ) : (
          <EmptyState
            icon={CalendarPlus}
            title="No daily problem yet"
            description="Once an admin posts today's LeetCode problem, the timer and submissions will unlock here."
            action={
              context.profile?.role === "admin" ? (
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-bold text-white transition hover:bg-ocean"
                >
                  Go to admin
                </Link>
              ) : null
            }
          />
        )}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <Award className="h-5 w-5 text-gold" />
            <p className="mt-3 text-2xl font-black">10 + bonuses</p>
            <p className="text-sm text-ink/60">Completion, finish rank, and speed duration points.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <Clock className="h-5 w-5 text-ocean" />
            <p className="mt-3 text-2xl font-black">No solves yet</p>
            <p className="text-sm text-ink/60">Fastest accepted duration appears after members submit.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <ShieldCheck className="h-5 w-5 text-moss" />
            <p className="mt-3 text-2xl font-black">Hybrid verify</p>
            <p className="text-sm text-ink/60">Accepted URLs are checked, with admin review fallback.</p>
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {today ? (
          <TimerSubmission problem={today} source="daily" />
        ) : (
          <EmptyState title="Timer unavailable" description="There is no active daily problem to start yet." />
        )}
        <section>
          <h2 className="mb-3 text-xl font-black">Today&apos;s leaderboard</h2>
          <LeaderboardTable rows={rows} />
        </section>
      </div>
    </div>
  );
}

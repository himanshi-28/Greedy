import { Award, Clock, ShieldCheck } from "lucide-react";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ProblemCard } from "@/components/problem-card";
import { TimerSubmission } from "@/components/timer-submission";
import { getTrackerData } from "@/lib/data";
import { buildLeaderboard } from "@/lib/scoring";

export default async function DashboardPage() {
  const { profiles, problems, attempts } = await getTrackerData();
  const today = problems.find((problem) => problem.status === "active") ?? problems[0];
  const rows = buildLeaderboard(profiles, attempts, "daily");

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <ProblemCard problem={today} label="Today's problem" />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <Award className="h-5 w-5 text-gold" />
            <p className="mt-3 text-2xl font-black">10 + bonuses</p>
            <p className="text-sm text-ink/60">Completion, finish rank, and speed duration points.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <Clock className="h-5 w-5 text-ocean" />
            <p className="mt-3 text-2xl font-black">42m best</p>
            <p className="text-sm text-ink/60">Fastest accepted duration on today&apos;s challenge.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <ShieldCheck className="h-5 w-5 text-moss" />
            <p className="mt-3 text-2xl font-black">Hybrid verify</p>
            <p className="text-sm text-ink/60">Accepted URLs are checked, with admin review fallback.</p>
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <TimerSubmission problem={today} source="daily" />
        <section>
          <h2 className="mb-3 text-xl font-black">Today&apos;s leaderboard</h2>
          <LeaderboardTable rows={rows} />
        </section>
      </div>
    </div>
  );
}

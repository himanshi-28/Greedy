import { LeaderboardTable } from "@/components/leaderboard-table";
import { ProblemCard } from "@/components/problem-card";
import { TimerSubmission } from "@/components/timer-submission";
import { getTrackerData } from "@/lib/data";
import { buildLeaderboard } from "@/lib/scoring";

export default async function RevisionPage() {
  const { profiles, problems, attempts } = await getTrackerData();
  const revisionProblem = problems.find((problem) => problem.status === "archived") ?? problems[0];
  const rows = buildLeaderboard(profiles, attempts, "revision");

  return (
    <div className="grid gap-6">
      <ProblemCard problem={revisionProblem} label="Daily revision pick" />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <TimerSubmission problem={revisionProblem} source="revision" />
        <section>
          <h2 className="mb-3 text-xl font-black">Revision leaderboard</h2>
          <LeaderboardTable rows={rows} />
        </section>
      </div>
    </div>
  );
}

import { BookOpenCheck } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ProblemCard } from "@/components/problem-card";
import { TimerSubmission } from "@/components/timer-submission";
import { getTrackerData } from "@/lib/data";
import { buildLeaderboard } from "@/lib/scoring";

export default async function RevisionPage() {
  const { profiles, problems, attempts } = await getTrackerData();
  const revisionProblem = problems.find((problem) => problem.status === "archived") ?? null;
  const rows = buildLeaderboard(profiles, attempts, "revision");

  return (
    <div className="grid gap-6">
      {revisionProblem ? (
        <ProblemCard problem={revisionProblem} label="Daily revision pick" />
      ) : (
        <EmptyState
          icon={BookOpenCheck}
          title="No revision problem yet"
          description="Revision starts after at least one previous problem is archived."
        />
      )}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {revisionProblem ? (
          <TimerSubmission problem={revisionProblem} source="revision" />
        ) : (
          <EmptyState title="Revision timer unavailable" description="There is no previous problem available for revision yet." />
        )}
        <section>
          <h2 className="mb-3 text-xl font-black">Revision leaderboard</h2>
          <LeaderboardTable rows={rows} />
        </section>
      </div>
    </div>
  );
}

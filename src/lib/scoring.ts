import type { Attempt, LeaderboardRow, PointsSource, Profile } from "@/lib/types";

const finishRankBonuses = [10, 6, 3];
const speedRankBonuses = [5, 3, 1];

export function calculateAttemptPoints(attempts: Attempt[], attempt: Attempt) {
  if (attempt.status !== "accepted" || !attempt.acceptedAt) {
    return 0;
  }

  const acceptedForProblem = attempts
    .filter(
      (item) =>
        item.problemId === attempt.problemId &&
        item.source === attempt.source &&
        item.status === "accepted" &&
        item.acceptedAt
    )
    .sort((a, b) => new Date(a.acceptedAt!).getTime() - new Date(b.acceptedAt!).getTime());

  const durationForProblem = acceptedForProblem
    .filter((item) => typeof item.durationSeconds === "number")
    .sort((a, b) => (a.durationSeconds ?? Infinity) - (b.durationSeconds ?? Infinity));

  const finishRank = acceptedForProblem.findIndex((item) => item.id === attempt.id);
  const speedRank = durationForProblem.findIndex((item) => item.id === attempt.id);

  return (
    10 +
    (finishRankBonuses[finishRank] ?? 0) +
    (speedRankBonuses[speedRank] ?? 0)
  );
}

export function buildLeaderboard(
  profiles: Profile[],
  attempts: Attempt[],
  source?: PointsSource
): LeaderboardRow[] {
  return profiles
    .map((profile) => {
      const userAttempts = attempts.filter(
        (attempt) =>
          attempt.userId === profile.id &&
          attempt.status === "accepted" &&
          (!source || attempt.source === source)
      );

      const points = userAttempts.reduce(
        (total, attempt) => total + calculateAttemptPoints(attempts, attempt),
        0
      );

      return {
        user: profile,
        points,
        solved: userAttempts.filter((attempt) => attempt.source === "daily").length,
        revisionSolved: userAttempts.filter((attempt) => attempt.source === "revision").length,
        fastestDuration: userAttempts
          .map((attempt) => attempt.durationSeconds)
          .filter((duration): duration is number => typeof duration === "number")
          .sort((a, b) => a - b)[0]
      };
    })
    .sort((a, b) => b.points - a.points || b.solved - a.solved);
}

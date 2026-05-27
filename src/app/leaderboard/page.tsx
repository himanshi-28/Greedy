import { LeaderboardClient } from "@/app/leaderboard/leaderboard-client";
import { getTrackerData } from "@/lib/data";

export default async function LeaderboardPage() {
  const { profiles, attempts } = await getTrackerData();
  return <LeaderboardClient profiles={profiles} attempts={attempts} />;
}

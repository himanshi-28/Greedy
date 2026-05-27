"use client";

import { useMemo, useState } from "react";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { attempts, profiles } from "@/lib/mock-data";
import { buildLeaderboard } from "@/lib/scoring";
import type { PointsSource } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs: { id: "all" | PointsSource; label: string }[] = [
  { id: "all", label: "All time" },
  { id: "daily", label: "Daily" },
  { id: "revision", label: "Revision" }
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | PointsSource>("all");
  const rows = useMemo(
    () => buildLeaderboard(profiles, attempts, activeTab === "all" ? undefined : activeTab),
    [activeTab]
  );

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Leaderboard</p>
        <h1 className="mt-2 text-3xl font-black">Competition standings</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "h-10 rounded-md border border-black/10 px-4 text-sm font-bold",
              activeTab === tab.id ? "bg-ink text-white" : "bg-white text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <LeaderboardTable rows={rows} />
    </div>
  );
}

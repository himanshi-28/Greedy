import { Medal } from "lucide-react";
import type { LeaderboardRow } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

export function LeaderboardTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-panel">
      <table className="w-full border-collapse text-left">
        <thead className="bg-mist text-sm text-ink/70">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Member</th>
            <th className="px-4 py-3">Points</th>
            <th className="px-4 py-3">Daily</th>
            <th className="px-4 py-3">Revision</th>
            <th className="px-4 py-3">Fastest</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.user.id} className="border-t border-black/10">
              <td className="px-4 py-4">
                <span className="inline-flex items-center gap-2 font-bold">
                  {index < 3 && <Medal className="h-4 w-4 text-gold" />}
                  #{index + 1}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="font-bold">{row.user.displayName}</div>
                <div className="text-sm text-ink/55">@{row.user.leetcodeUsername}</div>
              </td>
              <td className="px-4 py-4 text-lg font-black">{row.points}</td>
              <td className="px-4 py-4">{row.solved}</td>
              <td className="px-4 py-4">{row.revisionSolved}</td>
              <td className="px-4 py-4">{row.fastestDuration ? formatDuration(row.fastestDuration) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

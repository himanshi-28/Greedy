import { Code2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import type { Attempt, Profile } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

export function SubmissionGallery({ attempts, profiles }: { attempts: Attempt[]; profiles: Profile[] }) {
  const accepted = attempts.filter((attempt) => attempt.status === "accepted" && attempt.code);

  if (accepted.length === 0) {
    return (
      <EmptyState
        title="No shared solutions yet"
        description="Accepted solution code will appear here after members submit it."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {accepted.map((attempt) => {
        const profile = profiles.find((item) => item.id === attempt.userId);

        return (
          <article key={attempt.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black">{profile?.displayName ?? "Member"}</h3>
                <p className="text-sm text-ink/60">
                  {attempt.language} · {attempt.runtime ?? "runtime pending"} ·{" "}
                  {attempt.durationSeconds ? formatDuration(attempt.durationSeconds) : "duration pending"}
                </p>
              </div>
              <Code2 className="h-5 w-5 text-ocean" />
            </div>
            <pre className="mt-4 max-h-64 overflow-auto rounded-md bg-ink p-4 text-sm text-white">
              <code>{attempt.code}</code>
            </pre>
          </article>
        );
      })}
    </div>
  );
}

import { CalendarDays } from "lucide-react";
import { SubmissionGallery } from "@/components/submission-gallery";
import { attempts, problems, profiles } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Problem history</p>
        <h1 className="mt-2 text-3xl font-black">Past problems and submitted code</h1>
      </div>
      <div className="grid gap-3">
        {problems.map((problem) => (
          <article key={problem.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 bg-white p-4 shadow-panel">
            <div>
              <h2 className="font-black">{problem.title}</h2>
              <p className="text-sm text-ink/60">{problem.tags.join(" · ")}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink/60">
              <CalendarDays className="h-4 w-4" />
              {problem.publishDate}
            </div>
          </article>
        ))}
      </div>
      <SubmissionGallery attempts={attempts} profiles={profiles} />
    </div>
  );
}

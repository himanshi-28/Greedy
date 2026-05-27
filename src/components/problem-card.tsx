import { ExternalLink, Tags } from "lucide-react";
import type { Problem } from "@/lib/types";
import { cn } from "@/lib/utils";

const difficultyClass = {
  Easy: "bg-moss/10 text-moss",
  Medium: "bg-gold/15 text-[#8a5e0b]",
  Hard: "bg-coral/10 text-coral"
};

export function ProblemCard({ problem, label }: { problem: Problem; label: string }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">{label}</p>
          <h1 className="mt-2 text-2xl font-black text-ink sm:text-4xl">{problem.title}</h1>
        </div>
        <span className={cn("rounded-md px-3 py-1 text-sm font-bold", difficultyClass[problem.difficulty])}>
          {problem.difficulty}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {problem.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-mist px-2.5 py-1 text-sm text-ink/75">
            <Tags className="h-3.5 w-3.5" />
            {tag}
          </span>
        ))}
      </div>
      <a
        href={problem.leetcodeUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white transition hover:bg-ocean"
      >
        Open on LeetCode
        <ExternalLink className="h-4 w-4" />
      </a>
    </section>
  );
}

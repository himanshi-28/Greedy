"use client";

import { FormEvent, useState } from "react";
import { Check, Plus, ShieldAlert } from "lucide-react";
import { attempts, problems, profiles } from "@/lib/mock-data";
import type { Difficulty, Problem } from "@/lib/types";

export default function AdminPage() {
  const [items, setItems] = useState<Problem[]>(problems);
  const [title, setTitle] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [publishDate, setPublishDate] = useState("2026-05-28");

  function createProblem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slug = leetcodeUrl.split("/problems/")[1]?.split("/")[0] ?? title.toLowerCase().replaceAll(" ", "-");

    setItems((current) => [
      {
        id: crypto.randomUUID(),
        title,
        leetcodeUrl,
        slug,
        difficulty,
        tags: ["Admin Pick"],
        publishDate,
        status: publishDate === "2026-05-27" ? "active" : "scheduled"
      },
      ...current
    ]);
    setTitle("");
    setLeetcodeUrl("");
  }

  const reviewQueue = attempts.filter((attempt) => attempt.status === "needs_review");

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Admin</p>
        <h1 className="mt-2 text-3xl font-black">Post or schedule a problem</h1>
        <form onSubmit={createProblem} className="mt-5 grid gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Problem title"
            className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-ocean"
            required
          />
          <input
            value={leetcodeUrl}
            onChange={(event) => setLeetcodeUrl(event.target.value)}
            placeholder="LeetCode problem URL"
            className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-ocean"
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
              className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-ocean"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <input
              type="date"
              value={publishDate}
              onChange={(event) => setPublishDate(event.target.value)}
              className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-ocean"
            />
          </div>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white">
            <Plus className="h-4 w-4" />
            Add problem
          </button>
        </form>
      </section>
      <section className="grid gap-4">
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <ShieldAlert className="h-5 w-5 text-coral" />
            Review queue
          </h2>
          {reviewQueue.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">No submissions need review right now.</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {reviewQueue.map((attempt) => {
                const member = profiles.find((profile) => profile.id === attempt.userId);
                return (
                  <div key={attempt.id} className="rounded-md bg-mist p-3">
                    <p className="font-bold">{member?.displayName}</p>
                    <a href={attempt.submissionUrl} className="text-sm text-ocean">
                      {attempt.submissionUrl}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
          <h2 className="text-xl font-black">Schedule</h2>
          <div className="mt-3 grid gap-2">
            {items.map((problem) => (
              <div key={problem.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-mist p-3">
                <div>
                  <p className="font-bold">{problem.title}</p>
                  <p className="text-sm text-ink/60">{problem.publishDate} · {problem.status}</p>
                </div>
                <Check className="h-4 w-4 text-moss" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

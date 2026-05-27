"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Play, RotateCcw, Send, StopCircle } from "lucide-react";
import type { Attempt, PointsSource, Problem } from "@/lib/types";
import { verifyLeetCodeSubmission } from "@/lib/leetcode";
import { formatDuration } from "@/lib/utils";

type Props = {
  problem: Problem;
  source: PointsSource;
};

export function TimerSubmission({ problem, source }: Props) {
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [code, setCode] = useState("");
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  useMemo(() => {
    if (!startedAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startedAt]);

  function startTimer() {
    const now = new Date();
    setStartedAt(now);
    setElapsed(0);
    setAttempt(null);
  }

  function resetTimer() {
    setStartedAt(null);
    setElapsed(0);
    setAttempt(null);
  }

  function submitAttempt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const verification = verifyLeetCodeSubmission(submissionUrl, problem.slug);
    const acceptedAt = verification.acceptedAt ?? new Date().toISOString();
    const started = startedAt ?? new Date();
    const durationSeconds = Math.max(1, Math.floor((new Date(acceptedAt).getTime() - started.getTime()) / 1000));

    setAttempt({
      id: crypto.randomUUID(),
      userId: "current-user",
      problemId: problem.id,
      source,
      startedAt: started.toISOString(),
      acceptedAt: verification.status === "accepted" ? acceptedAt : undefined,
      status: verification.status,
      submissionUrl,
      durationSeconds: verification.status === "accepted" ? durationSeconds : undefined,
      language,
      code
    });
  }

  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Your attempt</p>
          <p className="mt-1 text-3xl font-black tabular-nums">{formatDuration(elapsed)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startTimer}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-moss px-4 text-sm font-bold text-white"
          >
            <Play className="h-4 w-4" />
            Start
          </button>
          <button
            type="button"
            onClick={() => setStartedAt(null)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-coral px-4 text-sm font-bold text-white"
          >
            <StopCircle className="h-4 w-4" />
            End
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <form onSubmit={submitAttempt} className="mt-5 grid gap-3">
        <input
          value={submissionUrl}
          onChange={(event) => setSubmissionUrl(event.target.value)}
          placeholder="https://leetcode.com/problems/minimum-window-substring/submissions/1642000001/"
          className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-ocean"
          required
        />
        <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="h-11 rounded-md border border-black/10 px-3 outline-none focus:border-ocean"
          >
            <option>TypeScript</option>
            <option>Python3</option>
            <option>C++</option>
            <option>Java</option>
            <option>Go</option>
          </select>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Paste code if LeetCode metadata is unavailable."
            className="min-h-28 rounded-md border border-black/10 p-3 font-mono text-sm outline-none focus:border-ocean"
          />
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white">
          <Send className="h-4 w-4" />
          Submit accepted solution
        </button>
      </form>
      {attempt && (
        <div className="mt-4 rounded-md bg-mist p-4">
          <p className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="h-4 w-4 text-moss" />
            {attempt.status === "accepted" ? "Accepted and scored" : "Needs admin review"}
          </p>
          <p className="mt-1 text-sm text-ink/70">
            {attempt.status === "accepted"
              ? `Duration captured as ${formatDuration(attempt.durationSeconds ?? elapsed)}.`
              : "The URL was saved, but an admin needs to confirm the accepted submission."}
          </p>
        </div>
      )}
    </section>
  );
}

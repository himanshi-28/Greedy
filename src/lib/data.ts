import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Attempt, Problem, Profile } from "@/lib/types";
import { mapProfile } from "@/lib/auth";

type RawProblem = {
  id: string;
  leetcode_url: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  publish_date: string;
  status: "draft" | "scheduled" | "active" | "archived";
};

type RawAttempt = {
  id: string;
  user_id: string;
  problem_id: string;
  source: "daily" | "revision" | "admin_adjustment";
  started_at: string;
  accepted_at: string | null;
  submission_url: string | null;
  status: "started" | "accepted" | "needs_review" | "rejected";
  duration_seconds: number | null;
};

export const fallbackProblems: Problem[] = [
  {
    id: "setup-problem",
    leetcodeUrl: "https://leetcode.com/problemset/",
    slug: "choose-todays-problem",
    title: "Choose Today's Problem",
    difficulty: "Medium",
    tags: ["Admin setup"],
    publishDate: new Date().toISOString().slice(0, 10),
    status: "active"
  }
];

function mapProblem(problem: RawProblem): Problem {
  return {
    id: problem.id,
    leetcodeUrl: problem.leetcode_url,
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    tags: problem.tags ?? [],
    publishDate: problem.publish_date,
    status: problem.status
  };
}

function mapAttempt(attempt: RawAttempt): Attempt {
  return {
    id: attempt.id,
    userId: attempt.user_id,
    problemId: attempt.problem_id,
    source: attempt.source,
    startedAt: attempt.started_at,
    acceptedAt: attempt.accepted_at ?? undefined,
    submissionUrl: attempt.submission_url ?? undefined,
    status: attempt.status,
    durationSeconds: attempt.duration_seconds ?? undefined
  };
}

export async function getTrackerData() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { profiles: [] as Profile[], problems: fallbackProblems, attempts: [] as Attempt[] };
  }

  const [profilesResult, problemsResult, attemptsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, email, avatar_url, role, status, leetcode_username")
      .eq("status", "approved")
      .order("display_name"),
    supabase
      .from("problems")
      .select("id, leetcode_url, slug, title, difficulty, tags, publish_date, status")
      .order("publish_date", { ascending: false }),
    supabase
      .from("attempts")
      .select("id, user_id, problem_id, source, started_at, accepted_at, submission_url, status, duration_seconds")
  ]);

  return {
    profiles: (profilesResult.data ?? []).map((profile) => mapProfile(profile as never)),
    problems: (problemsResult.data ?? []).map((problem) => mapProblem(problem as RawProblem)),
    attempts: (attemptsResult.data ?? []).map((attempt) => mapAttempt(attempt as RawAttempt))
  };
}

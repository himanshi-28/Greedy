export type Role = "admin" | "member";
export type ProfileStatus = "pending" | "approved" | "rejected";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "draft" | "scheduled" | "active" | "archived";
export type AttemptStatus = "started" | "accepted" | "needs_review" | "rejected";
export type PointsSource = "daily" | "revision" | "admin_adjustment";

export type Profile = {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  role: Role;
  status: ProfileStatus;
  leetcodeUsername: string;
};

export type Problem = {
  id: string;
  leetcodeUrl: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  publishDate: string;
  status: ProblemStatus;
};

export type Attempt = {
  id: string;
  userId: string;
  problemId: string;
  source: PointsSource;
  startedAt: string;
  acceptedAt?: string;
  submissionUrl?: string;
  status: AttemptStatus;
  durationSeconds?: number;
  language?: string;
  runtime?: string;
  memory?: string;
  code?: string;
};

export type LeaderboardRow = {
  user: Profile;
  points: number;
  solved: number;
  revisionSolved: number;
  fastestDuration?: number;
};

export type VerificationResult = {
  status: "accepted" | "needs_review";
  acceptedAt?: string;
  slug?: string;
  reason: string;
};

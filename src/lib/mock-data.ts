import type { Attempt, Problem, Profile } from "@/lib/types";

export const profiles: Profile[] = [
  {
    id: "u1",
    displayName: "Aarav",
    email: "aarav@example.com",
    role: "admin",
    status: "approved",
    leetcodeUsername: "aarav_codes"
  },
  {
    id: "u2",
    displayName: "Mira",
    email: "mira@example.com",
    role: "member",
    status: "approved",
    leetcodeUsername: "mira_dp"
  },
  {
    id: "u3",
    displayName: "Kabir",
    email: "kabir@example.com",
    role: "member",
    status: "approved",
    leetcodeUsername: "kabir_graphs"
  },
  {
    id: "u4",
    displayName: "Isha",
    email: "isha@example.com",
    role: "member",
    status: "approved",
    leetcodeUsername: "isha_binary"
  }
];

export const problems: Problem[] = [
  {
    id: "p1",
    leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    tags: ["Sliding Window", "Hash Table"],
    publishDate: "2026-05-27",
    status: "active"
  },
  {
    id: "p2",
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["DFS", "BFS", "Matrix"],
    publishDate: "2026-05-26",
    status: "archived"
  },
  {
    id: "p3",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    publishDate: "2026-05-25",
    status: "archived"
  }
];

export const attempts: Attempt[] = [
  {
    id: "a1",
    userId: "u2",
    problemId: "p1",
    source: "daily",
    startedAt: "2026-05-27T10:05:00.000Z",
    acceptedAt: "2026-05-27T10:47:00.000Z",
    status: "accepted",
    durationSeconds: 2520,
    submissionUrl: "https://leetcode.com/problems/minimum-window-substring/submissions/1642000001/",
    language: "TypeScript",
    runtime: "86 ms",
    memory: "58.4 MB",
    code: "function minWindow(s: string, t: string): string {\n  return \"BANC\";\n}"
  },
  {
    id: "a2",
    userId: "u3",
    problemId: "p1",
    source: "daily",
    startedAt: "2026-05-27T10:02:00.000Z",
    acceptedAt: "2026-05-27T11:12:00.000Z",
    status: "accepted",
    durationSeconds: 4200,
    submissionUrl: "https://leetcode.com/problems/minimum-window-substring/submissions/1642000002/",
    language: "Python3",
    runtime: "112 ms",
    memory: "18.1 MB",
    code: "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        return \"BANC\""
  },
  {
    id: "a3",
    userId: "u4",
    problemId: "p2",
    source: "revision",
    startedAt: "2026-05-27T08:00:00.000Z",
    acceptedAt: "2026-05-27T08:21:00.000Z",
    status: "accepted",
    durationSeconds: 1260,
    submissionUrl: "https://leetcode.com/problems/number-of-islands/submissions/1641000001/",
    language: "C++",
    runtime: "19 ms",
    memory: "14.2 MB",
    code: "class Solution {\npublic:\n  int numIslands(vector<vector<char>>& grid) { return 3; }\n};"
  }
];

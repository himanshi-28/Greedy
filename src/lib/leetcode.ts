import type { VerificationResult } from "@/lib/types";

const submissionPattern =
  /^https:\/\/leetcode\.com\/problems\/(?<slug>[a-z0-9-]+)\/submissions\/(?<submissionId>\d+)\/?$/i;
const problemPattern = /^https:\/\/leetcode\.com\/problems\/(?<slug>[a-z0-9-]+)\/?/i;

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseLeetCodeProblemUrl(url: string) {
  const match = problemPattern.exec(url.trim());
  if (!match?.groups?.slug) {
    return null;
  }

  return {
    slug: match.groups.slug,
    title: titleFromSlug(match.groups.slug)
  };
}

export function parseLeetCodeSubmissionUrl(url: string) {
  const match = submissionPattern.exec(url.trim());
  if (!match?.groups) {
    return null;
  }

  return {
    slug: match.groups.slug,
    submissionId: match.groups.submissionId
  };
}

export function verifyLeetCodeSubmission(url: string, expectedSlug: string): VerificationResult {
  const parsed = parseLeetCodeSubmissionUrl(url);

  if (!parsed) {
    return {
      status: "needs_review",
      reason: "Submission URL should look like https://leetcode.com/problems/two-sum/submissions/1234567890/"
    };
  }

  if (parsed.slug !== expectedSlug) {
    return {
      status: "needs_review",
      slug: parsed.slug,
      reason: "Submission belongs to a different problem slug."
    };
  }

  return {
    status: "accepted",
    slug: parsed.slug,
    acceptedAt: new Date().toISOString(),
    reason: "URL format and problem slug match. Public LeetCode metadata can be attached when available."
  };
}

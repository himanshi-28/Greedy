"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/auth";
import { parseLeetCodeProblemUrl, titleFromSlug } from "@/lib/leetcode";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Difficulty, ProfileStatus, Role } from "@/lib/types";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

async function requireAdmin() {
  const context = await getAppContext();

  if (context.profile?.role !== "admin" || context.profile.status !== "approved") {
    throw new Error("Only approved admins can manage this tracker.");
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase service role is not configured.");
  }

  return { admin, profile: context.profile };
}

export async function updateMemberAccess(userId: string, status: ProfileStatus, role: Role) {
  const { admin } = await requireAdmin();

  await admin.from("profiles").update({ status, role }).eq("id", userId);
  revalidatePath("/admin");
  revalidatePath("/leaderboard");
}

export async function createProblem(formData: FormData) {
  const { admin, profile } = await requireAdmin();
  const leetcodeUrl = String(formData.get("leetcodeUrl") ?? "").trim();
  const parsed = parseLeetCodeProblemUrl(leetcodeUrl);

  if (!parsed) {
    throw new Error("Enter a valid LeetCode problem URL.");
  }

  const titleInput = String(formData.get("title") ?? "").trim();
  const difficulty = String(formData.get("difficulty") ?? "Medium") as Difficulty;
  const publishDate = String(formData.get("publishDate") ?? getToday()).trim() || getToday();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const status = publishDate === getToday() ? "active" : "scheduled";

  if (status === "active") {
    await admin.from("problems").update({ status: "archived" }).eq("status", "active");
  }

  const { data: problem, error } = await admin
    .from("problems")
    .insert({
      leetcode_url: leetcodeUrl,
      slug: parsed.slug,
      title: titleInput || parsed.title || titleFromSlug(parsed.slug),
      difficulty,
      tags,
      publish_date: publishDate,
      status,
      created_by: profile.id
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (status === "scheduled" && problem?.id) {
    await admin
      .from("problem_schedule")
      .upsert(
        {
          problem_id: problem.id,
          publish_date: publishDate,
          created_by: profile.id
        },
        { onConflict: "publish_date" }
      );
  }

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath("/revision");
}

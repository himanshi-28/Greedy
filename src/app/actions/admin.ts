"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { ProfileStatus, Role } from "@/lib/types";

export async function updateMemberAccess(userId: string, status: ProfileStatus, role: Role) {
  const context = await getAppContext();

  if (context.profile?.role !== "admin" || context.profile.status !== "approved") {
    throw new Error("Only approved admins can manage members.");
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase service role is not configured.");
  }

  await admin.from("profiles").update({ status, role }).eq("id", userId);
  revalidatePath("/admin");
  revalidatePath("/leaderboard");
}

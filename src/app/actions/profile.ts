"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateOwnProfile(formData: FormData) {
  const context = await getAppContext();

  if (!context.user) {
    throw new Error("You must be signed in.");
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const leetcodeUsername = String(formData.get("leetcodeUsername") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  await supabase
    ?.from("profiles")
    .update({
      display_name: displayName,
      leetcode_username: leetcodeUsername
    })
    .eq("id", context.user.id);

  revalidatePath("/profile");
  revalidatePath("/");
}

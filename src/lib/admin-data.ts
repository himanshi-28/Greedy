import { mapProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function getAllProfilesForAdmin() {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return [] as Profile[];
  }

  const { data } = await admin
    .from("profiles")
    .select("id, display_name, email, avatar_url, role, status, leetcode_username")
    .order("created_at", { ascending: true });

  return (data ?? []).map((profile) => mapProfile(profile as never));
}

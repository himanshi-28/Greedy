import type { User } from "@supabase/supabase-js";
import { getAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, ProfileStatus, Role } from "@/lib/types";

type RawProfile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: Role;
  status: ProfileStatus;
  leetcode_username: string | null;
};

export type AppContext = {
  configured: boolean;
  user: User | null;
  profile: Profile | null;
};

export function mapProfile(profile: RawProfile): Profile {
  return {
    id: profile.id,
    displayName: profile.display_name ?? profile.email?.split("@")[0] ?? "Member",
    email: profile.email ?? undefined,
    avatarUrl: profile.avatar_url ?? undefined,
    role: profile.role,
    status: profile.status,
    leetcodeUsername: profile.leetcode_username ?? ""
  };
}

export async function syncProfileForUser(user: User) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const email = user.email?.toLowerCase() ?? "";
  const isAdmin = Boolean(email && email === getAdminEmail());
  const metadata = user.user_metadata;

  const payload = {
    id: user.id,
    display_name: metadata.full_name ?? metadata.name ?? email.split("@")[0] ?? "Member",
    email,
    avatar_url: metadata.avatar_url ?? metadata.picture ?? null,
    role: isAdmin ? "admin" : "member",
    status: isAdmin ? "approved" : "pending",
    leetcode_username: ""
  };

  const { data: existing } = await admin
    .from("profiles")
    .select("id, role, status, leetcode_username")
    .eq("id", user.id)
    .maybeSingle();

  const { data } = await admin
    .from("profiles")
    .upsert({
      ...payload,
      role: isAdmin ? "admin" : existing?.role ?? payload.role,
      status: isAdmin ? "approved" : existing?.status ?? payload.status,
      leetcode_username: existing?.leetcode_username ?? ""
    })
    .select("id, display_name, email, avatar_url, role, status, leetcode_username")
    .single();

  return data ? mapProfile(data as RawProfile) : null;
}

export async function getAppContext(): Promise<AppContext> {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, profile: null };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase!.auth.getUser();

  if (!user) {
    return { configured: true, user: null, profile: null };
  }

  const { data } = await supabase!
    .from("profiles")
    .select("id, display_name, email, avatar_url, role, status, leetcode_username")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data ? mapProfile(data as RawProfile) : await syncProfileForUser(user);

  return { configured: true, user, profile };
}

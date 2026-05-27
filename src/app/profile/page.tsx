import Image from "next/image";
import { Save, UserRound } from "lucide-react";
import { updateOwnProfile } from "@/app/actions/profile";
import { getAppContext } from "@/lib/auth";

export default async function ProfilePage() {
  const { profile } = await getAppContext();

  if (!profile) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-md bg-mist">
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt="" width={48} height={48} />
            ) : (
              <UserRound className="h-6 w-6 text-ocean" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Profile</p>
            <h1 className="text-3xl font-black">Member settings</h1>
          </div>
        </div>
        <form action={updateOwnProfile} className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm font-bold">
            Display name
            <input
              name="displayName"
              defaultValue={profile.displayName}
              className="h-11 rounded-md border border-black/10 px-3 font-normal outline-none focus:border-ocean"
              required
            />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            LeetCode username
            <input
              name="leetcodeUsername"
              defaultValue={profile.leetcodeUsername}
              className="h-11 rounded-md border border-black/10 px-3 font-normal outline-none focus:border-ocean"
              placeholder="your_leetcode_handle"
            />
          </label>
          <div className="rounded-md bg-mist p-3 text-sm text-ink/65">
            {profile.email} · {profile.role} · {profile.status}
          </div>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white transition hover:bg-ocean">
            <Save className="h-4 w-4" />
            Save profile
          </button>
        </form>
      </section>
    </div>
  );
}

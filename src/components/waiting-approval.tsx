import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";

export function WaitingApproval({ profile }: { profile: Profile }) {
  return (
    <section className="mx-auto mt-16 max-w-xl rounded-lg border border-black/10 bg-white p-6 text-center shadow-panel dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-ocean/10 text-ocean">
        <Clock3 className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-3xl font-black">Waiting for admin approval</h1>
      <p className="mt-3 text-ink/65 dark:text-white/65">
        Hi {profile.displayName}, your Google account is registered. Once an admin approves you,
        the tracker, leaderboard, and revision tabs will open automatically.
      </p>
      <div className="mt-5 rounded-md bg-mist p-4 text-left text-sm dark:bg-white/10">
        <p className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-4 w-4 text-moss" />
          Account status: {profile.status}
        </p>
        <p className="mt-1 text-ink/60 dark:text-white/60">{profile.email}</p>
      </div>
      <form action={signOut} className="mt-5">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white transition hover:bg-ocean">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </form>
    </section>
  );
}

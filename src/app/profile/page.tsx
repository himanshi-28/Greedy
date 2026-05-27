"use client";

import { useState } from "react";
import { Save, UserRound } from "lucide-react";
import { profiles } from "@/lib/mock-data";

export default function ProfilePage() {
  const current = profiles[0];
  const [displayName, setDisplayName] = useState(current.displayName);
  const [leetcodeUsername, setLeetcodeUsername] = useState(current.leetcodeUsername);
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-mist">
            <UserRound className="h-6 w-6 text-ocean" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Profile</p>
            <h1 className="text-3xl font-black">Member settings</h1>
          </div>
        </div>
        <div className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm font-bold">
            Display name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="h-11 rounded-md border border-black/10 px-3 font-normal outline-none focus:border-ocean"
            />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            LeetCode username
            <input
              value={leetcodeUsername}
              onChange={(event) => setLeetcodeUsername(event.target.value)}
              className="h-11 rounded-md border border-black/10 px-3 font-normal outline-none focus:border-ocean"
            />
          </label>
          <button
            onClick={() => setSaved(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white"
          >
            <Save className="h-4 w-4" />
            Save profile
          </button>
          {saved && <p className="rounded-md bg-moss/10 p-3 text-sm font-bold text-moss">Profile saved locally for this demo.</p>}
        </div>
      </section>
    </div>
  );
}

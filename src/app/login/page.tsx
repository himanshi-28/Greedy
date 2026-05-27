import { Chrome, LockKeyhole, ShieldCheck } from "lucide-react";
import { signInWithGoogle } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Private LeetCode group</p>
        <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
          Solve together, rank fairly, revise smarter.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/65 dark:text-white/65">
          Sign in with Google, wait for admin approval, then track daily problems and revision rounds with real members only.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-panel">
            <ShieldCheck className="h-5 w-5 text-moss" />
            <p className="mt-3 font-black">Admin approved</p>
            <p className="text-sm text-ink/60">No random public users. Your group stays small and controlled.</p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-4 shadow-panel">
            <LockKeyhole className="h-5 w-5 text-ocean" />
            <p className="mt-3 font-black">Google login</p>
            <p className="text-sm text-ink/60">Persistent sessions keep members signed in across visits.</p>
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-panel">
        <h2 className="text-2xl font-black">Welcome back</h2>
        <p className="mt-2 text-sm text-ink/60">Use the Gmail account you want approved for this tracker.</p>
        {params?.error && (
          <p className="mt-4 rounded-md bg-coral/10 p-3 text-sm font-bold text-coral">
            {params.error === "supabase-not-configured"
              ? "Supabase is not configured yet. Add the environment variables in Render."
              : "Google sign-in could not start. Check Supabase auth settings."}
          </p>
        )}
        <form action={signInWithGoogle} className="mt-5">
          <button
            disabled={!configured}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ocean disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Chrome className="h-4 w-4" />
            Continue with Google
          </button>
        </form>
        {!configured && (
          <p className="mt-3 text-sm text-ink/60">
            Add Supabase environment variables to enable login on this deployment.
          </p>
        )}
      </section>
    </div>
  );
}

import { Check, Crown, ShieldAlert, UserCheck } from "lucide-react";
import { updateMemberAccess } from "@/app/actions/admin";
import { getAppContext } from "@/lib/auth";
import { getAllProfilesForAdmin } from "@/lib/admin-data";
import { getTrackerData } from "@/lib/data";
import type { Profile, ProfileStatus, Role } from "@/lib/types";

function MemberAction({
  profile,
  status,
  role,
  label
}: {
  profile: Profile;
  status: ProfileStatus;
  role: Role;
  label: string;
}) {
  return (
    <form action={updateMemberAccess.bind(null, profile.id, status, role)}>
      <button className="h-9 rounded-md border border-black/10 bg-white px-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-panel">
        {label}
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const context = await getAppContext();

  if (context.profile?.role !== "admin" || context.profile.status !== "approved") {
    return (
      <section className="rounded-lg border border-black/10 bg-white p-6 text-center shadow-panel">
        <ShieldAlert className="mx-auto h-8 w-8 text-coral" />
        <h1 className="mt-3 text-2xl font-black">Admin access required</h1>
        <p className="mt-2 text-sm text-ink/60">Only approved admins can manage members and problem queues.</p>
      </section>
    );
  }

  const [members, tracker] = await Promise.all([getAllProfilesForAdmin(), getTrackerData()]);
  const approvedCount = members.filter((member) => member.status === "approved").length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
          <UserCheck className="h-5 w-5 text-moss" />
          <p className="mt-3 text-2xl font-black">{approvedCount}/5</p>
          <p className="text-sm text-ink/60">Approved members</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
          <Crown className="h-5 w-5 text-gold" />
          <p className="mt-3 text-2xl font-black">{members.filter((member) => member.role === "admin").length}</p>
          <p className="text-sm text-ink/60">Admins</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
          <ShieldAlert className="h-5 w-5 text-coral" />
          <p className="mt-3 text-2xl font-black">{members.filter((member) => member.status === "pending").length}</p>
          <p className="text-sm text-ink/60">Pending approvals</p>
        </div>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Admin</p>
        <h1 className="mt-2 text-3xl font-black">Member access</h1>
        <div className="mt-5 grid gap-3">
          {members.length === 0 ? (
            <p className="rounded-md bg-mist p-4 text-sm text-ink/60">No Google users have registered yet.</p>
          ) : (
            members.map((member) => (
              <article
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black/10 bg-mist p-4"
              >
                <div>
                  <p className="font-black">{member.displayName}</p>
                  <p className="text-sm text-ink/60">{member.email}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ocean">
                    {member.status} · {member.role}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <MemberAction profile={member} status="approved" role={member.role} label="Approve" />
                  <MemberAction profile={member} status="rejected" role={member.role} label="Reject" />
                  <MemberAction profile={member} status="approved" role="admin" label="Make admin" />
                  <MemberAction profile={member} status="approved" role="member" label="Make member" />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-panel">
        <h2 className="text-xl font-black">Problem schedule</h2>
        <div className="mt-3 grid gap-2">
          {tracker.problems.map((problem) => (
            <div key={problem.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-mist p-3">
              <div>
                <p className="font-bold">{problem.title}</p>
                <p className="text-sm text-ink/60">
                  {problem.publishDate} · {problem.status}
                </p>
              </div>
              <Check className="h-4 w-4 text-moss" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

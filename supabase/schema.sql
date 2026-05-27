create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'member');
create type problem_status as enum ('draft', 'scheduled', 'active', 'archived');
create type attempt_status as enum ('started', 'accepted', 'needs_review', 'rejected');
create type points_source as enum ('daily', 'revision', 'admin_adjustment');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role user_role not null default 'member',
  leetcode_username text,
  created_at timestamptz not null default now()
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  leetcode_url text not null,
  slug text not null,
  title text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  tags text[] not null default '{}',
  publish_date date not null,
  status problem_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.problem_schedule (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems(id) on delete cascade,
  publish_date date not null unique,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id uuid not null references public.problems(id) on delete cascade,
  source points_source not null default 'daily',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  accepted_at timestamptz,
  submission_url text,
  status attempt_status not null default 'started',
  duration_seconds integer,
  review_note text,
  unique (user_id, problem_id, source)
);

create table public.submission_details (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  language text,
  runtime text,
  memory text,
  code text,
  fetched_metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.revision_days (
  id uuid primary key default gen_random_uuid(),
  revision_date date not null unique,
  problem_id uuid not null references public.problems(id),
  created_at timestamptz not null default now()
);

create table public.points_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id uuid references public.problems(id) on delete cascade,
  attempt_id uuid references public.attempts(id) on delete cascade,
  source points_source not null,
  points integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.problems enable row level security;
alter table public.problem_schedule enable row level security;
alter table public.attempts enable row level security;
alter table public.submission_details enable row level security;
alter table public.revision_days enable row level security;
alter table public.points_events enable row level security;

create policy "profiles readable by members" on public.profiles for select to authenticated using (true);
create policy "members update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read problems" on public.problems for select to authenticated using (true);
create policy "admins manage problems" on public.problems for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read schedule" on public.problem_schedule for select to authenticated using (true);
create policy "admins manage schedule" on public.problem_schedule for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read attempts" on public.attempts for select to authenticated using (true);
create policy "members create own attempts" on public.attempts for insert to authenticated with check (user_id = auth.uid());
create policy "members update own attempts" on public.attempts for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins manage attempts" on public.attempts for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read submission details" on public.submission_details for select to authenticated using (true);
create policy "members insert own submission details" on public.submission_details for insert to authenticated with check (
  exists (select 1 from public.attempts where attempts.id = attempt_id and attempts.user_id = auth.uid())
);
create policy "admins manage submission details" on public.submission_details for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read revision days" on public.revision_days for select to authenticated using (true);
create policy "admins manage revision days" on public.revision_days for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read points" on public.points_events for select to authenticated using (true);
create policy "admins manage points" on public.points_events for all to authenticated using (public.is_admin()) with check (public.is_admin());

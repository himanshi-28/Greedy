create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'member');
create type profile_status as enum ('pending', 'approved', 'rejected');
create type problem_status as enum ('draft', 'scheduled', 'active', 'archived');
create type attempt_status as enum ('started', 'accepted', 'needs_review', 'rejected');
create type points_source as enum ('daily', 'revision', 'admin_adjustment');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text unique,
  avatar_url text,
  role user_role not null default 'member',
  status profile_status not null default 'pending',
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

create or replace function public.is_approved()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'approved'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, avatar_url, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Member'),
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    'member',
    'pending'
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    email = excluded.email,
    avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.problems enable row level security;
alter table public.problem_schedule enable row level security;
alter table public.attempts enable row level security;
alter table public.submission_details enable row level security;
alter table public.revision_days enable row level security;
alter table public.points_events enable row level security;

create policy "approved members read approved profiles" on public.profiles for select to authenticated using (
  public.is_approved() and status = 'approved'
);
create policy "members read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "members update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved members read problems" on public.problems for select to authenticated using (public.is_approved());
create policy "admins manage problems" on public.problems for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved members read schedule" on public.problem_schedule for select to authenticated using (public.is_approved());
create policy "admins manage schedule" on public.problem_schedule for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved members read attempts" on public.attempts for select to authenticated using (public.is_approved());
create policy "approved members create own attempts" on public.attempts for insert to authenticated with check (user_id = auth.uid() and public.is_approved());
create policy "approved members update own attempts" on public.attempts for update to authenticated using (user_id = auth.uid() and public.is_approved()) with check (user_id = auth.uid() and public.is_approved());
create policy "admins manage attempts" on public.attempts for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved members read submission details" on public.submission_details for select to authenticated using (public.is_approved());
create policy "approved members insert own submission details" on public.submission_details for insert to authenticated with check (
  exists (select 1 from public.attempts where attempts.id = attempt_id and attempts.user_id = auth.uid())
  and public.is_approved()
);
create policy "admins manage submission details" on public.submission_details for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved members read revision days" on public.revision_days for select to authenticated using (public.is_approved());
create policy "admins manage revision days" on public.revision_days for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "approved members read points" on public.points_events for select to authenticated using (public.is_approved());
create policy "admins manage points" on public.points_events for all to authenticated using (public.is_admin()) with check (public.is_admin());

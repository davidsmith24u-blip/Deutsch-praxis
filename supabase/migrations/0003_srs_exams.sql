-- Spaced repetition cards + exam results

create table if not exists public.srs_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  front text not null,
  back text not null,
  source text not null default 'vocab', -- vocab | mistake | wordlist
  interval_days numeric not null default 0,
  ease numeric not null default 2.5,
  reps int not null default 0,
  lapses int not null default 0,
  due_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, front)
);

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level text not null,
  kind text not null default 'mock', -- quick | mock
  score numeric not null default 0,
  max_score numeric not null default 0,
  passed boolean not null default false,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.srs_cards enable row level security;
alter table public.exam_results enable row level security;

drop policy if exists "srs_cards own" on public.srs_cards;
create policy "srs_cards own" on public.srs_cards for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "exam_results own" on public.exam_results;
create policy "exam_results own" on public.exam_results for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public leaderboard read (masked display name, no emails exposed)
create or replace view public.leaderboard_view as
  select p.id,
         coalesce(left(split_part(p.email, '@', 1), 3) || '•••', 'learner') as display_name,
         up.xp, up.streak
  from public.user_progress up
  join public.profiles p on p.id = up.user_id
  order by up.xp desc
  limit 50;

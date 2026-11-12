-- DeutschPraxis initial schema

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  current_level text not null default 'A1',
  learning_goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.levels (
  code text primary key,
  title text not null,
  description text,
  "order" int not null
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  level_code text not null references public.levels(code),
  slug text not null unique,
  title text not null,
  summary text,
  content jsonb not null default '{}',
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  score int,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.interview_scenarios (
  id uuid primary key default gen_random_uuid(),
  level_code text not null references public.levels(code),
  title text not null,
  description text,
  system_prompt text not null,
  starter_question text,
  created_at timestamptz not null default now()
);

create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id uuid references public.interview_scenarios(id),
  level_code text not null,
  scenario_key text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  feedback jsonb
);

create table if not exists public.interview_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  correction text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp int not null default 0,
  streak int not null default 0,
  last_activity_date date,
  estimated_level text not null default 'A1',
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.interview_messages enable row level security;
alter table public.user_progress enable row level security;

create policy "profiles self" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "lesson_progress self" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "interview_sessions self" on public.interview_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "interview_messages via session" on public.interview_messages for all
  using (exists (select 1 from public.interview_sessions s where s.id = session_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.interview_sessions s where s.id = session_id and s.user_id = auth.uid()));
create policy "user_progress self" on public.user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public read for curriculum content
create policy "levels public read" on public.levels for select using (true);
create policy "lessons public read" on public.lessons for select using (published = true);
create policy "scenarios public read" on public.interview_scenarios for select using (true);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.user_progress (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed levels
insert into public.levels (code, title, description, "order") values
  ('A1','A1 — Beginner','First steps: greetings, personal info, basic verbs.',1),
  ('A2','A2 — Elementary','Daily routines, past tense, modals.',2),
  ('B1','B1 — Intermediate','Subordinate clauses, opinions, travel & work.',3),
  ('B2','B2 — Upper Intermediate','Complex grammar, argumentation, professional topics.',4)
on conflict (code) do nothing;
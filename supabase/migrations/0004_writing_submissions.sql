-- Writing coach: stored submissions with scores to track improvement over time

create table if not exists public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level text not null default 'A1',
  task text not null,
  text text not null,
  score numeric not null default 0,
  feedback text,
  correction text,
  model_answer text,
  created_at timestamptz not null default now()
);

alter table public.writing_submissions enable row level security;

drop policy if exists "writing_submissions own" on public.writing_submissions;
create policy "writing_submissions own" on public.writing_submissions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

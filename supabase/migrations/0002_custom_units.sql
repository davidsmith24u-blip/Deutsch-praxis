-- Admin roles + custom units (editable units stored in DB, merged over static units)

alter table public.profiles add column if not exists role text not null default 'student';

create table if not exists public.custom_units (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  level text not null check (level in ('A1','A2','B1','B2')),
  title text not null,
  description text not null default '',
  objective text not null default '',
  recycles text[] not null default '{}',
  "order" int not null default 99,
  unlock_threshold int not null default 0,
  exercises jsonb not null default '[]',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.custom_units enable row level security;

drop policy if exists "custom_units_read" on public.custom_units;
create policy "custom_units_read" on public.custom_units
  for select to authenticated
  using (true);

drop policy if exists "custom_units_write" on public.custom_units;
create policy "custom_units_write" on public.custom_units
  for all to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

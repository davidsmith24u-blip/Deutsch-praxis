-- Allow C1/C2 levels on custom units

alter table public.custom_units drop constraint if exists custom_units_level_check;
alter table public.custom_units add constraint custom_units_level_check
  check (level in ('A1','A2','B1','B2','C1','C2'));

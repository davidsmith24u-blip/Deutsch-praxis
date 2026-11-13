-- Track when SRS cards were last reviewed (for weekly quests)

alter table public.srs_cards add column if not exists last_reviewed_at timestamptz;

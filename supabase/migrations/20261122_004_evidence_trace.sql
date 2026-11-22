-- Wealth Story POC 2.5: persist evidence selection and provenance with each AI draft.
-- Run only after POC 2.2 AI draft migration in the SAME synthetic Supabase project.
-- No changes to the 20 fictional client records, subscriptions or reviewer login.
begin;
alter table public.poc_story_editions
 add column if not exists evidence_trace jsonb not null default '{}'::jsonb;
comment on column public.poc_story_editions.evidence_trace is
 'Synthetic AI draft trace: source record IDs, selected observations, age caveats, and which IDs AI cited; POC only.';
commit;
-- Verify:
-- select column_name,data_type from information_schema.columns
-- where table_schema='public' and table_name='poc_story_editions'
-- and column_name='evidence_trace';

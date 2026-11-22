-- POC 2.2: allow a separately labelled OpenAI-generated draft in the existing
-- synthetic reviewer workflow. No changes to customer source data or subscriptions.
-- Run AFTER 20261122_002_story_studio.sql, in the same Supabase project.
begin;
alter table public.poc_story_editions
  drop constraint if exists poc_story_editions_generation_method_check;
alter table public.poc_story_editions
  add constraint poc_story_editions_generation_method_check
  check (generation_method in ('synthetic_template','openai_draft'));
commit;
-- Verify:
-- SELECT generation_method, COUNT(*) FROM public.poc_story_editions GROUP BY 1;

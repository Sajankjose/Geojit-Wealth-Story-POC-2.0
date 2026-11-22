-- Wealth Story POC 2.7.3: explicitly chosen fictional guidance interests.
-- Run only in the existing synthetic 20-client Supabase POC project.
-- NOT a real consent ledger, CRM lead database, or permission to contact.
begin;
create table if not exists public.poc_guidance_events (
 id uuid primary key default gen_random_uuid(),
 client_id text not null references public.poc_clients(client_id) on delete cascade,
 topic text not null check(topic in ('foundation','protection','growth','goals','review')),
 event_type text not null check(event_type in ('topic_interest_demo','followup_request_demo')),
 details jsonb not null default '{"simulation":true,"explicit_action":true}'::jsonb,
 synthetic boolean not null default true check(synthetic=true),
 created_at timestamptz not null default now(),
 constraint poc_guidance_event_explicit check (
    details->>'simulation'='true' and details->>'explicit_action'='true'
 )
);
create index if not exists poc_guidance_client_date on public.poc_guidance_events(client_id,created_at desc);
alter table public.poc_guidance_events enable row level security;
revoke all on public.poc_guidance_events from anon;
grant select,insert on public.poc_guidance_events to authenticated;
drop policy if exists poc_guidance_read on public.poc_guidance_events;
create policy poc_guidance_read on public.poc_guidance_events for select to authenticated using (synthetic=true);
drop policy if exists poc_guidance_insert on public.poc_guidance_events;
create policy poc_guidance_insert on public.poc_guidance_events for insert to authenticated
 with check(synthetic=true and details->>'simulation'='true' and details->>'explicit_action'='true');
commit;
-- Verify: SELECT COUNT(*) FROM public.poc_guidance_events;
-- Expected initial result: 0 (events are saved only via explicit demo actions).

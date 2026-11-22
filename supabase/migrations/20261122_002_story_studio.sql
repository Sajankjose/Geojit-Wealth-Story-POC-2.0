-- Geojit Wealth Story POC 2.1 | FICTIONAL OPERATING STUDIO ONLY
-- Run AFTER 20261122_001_synthetic_schema.sql and the imported 20-client dataset.
-- Designed for a dedicated POC database with authorised reviewer accounts.
-- NEVER apply these broad reviewer write policies to real customer data.

begin;

create table if not exists public.poc_edition_subscriptions (
  client_id text not null references public.poc_clients(client_id) on delete cascade,
  edition_type text not null check (edition_type in ('daily_trading','weekly_investing','monthly_wealth')),
  status text not null default 'unsubscribed' check (status in ('subscribed','paused','unsubscribed')),
  delivery_window text not null default 'standard' check (delivery_window in ('pre_market','after_market','standard')),
  synthetic boolean not null default true check (synthetic = true),
  updated_at timestamptz not null default now(),
  primary key(client_id,edition_type)
);

create table if not exists public.poc_story_editions (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.poc_clients(client_id) on delete cascade,
  edition_type text not null check (edition_type in ('daily_trading','weekly_investing','monthly_wealth')),
  title text not null,
  body text not null,
  decision_note text not null default '',
  stage text not null default 'candidate' check (stage in ('candidate','reviewed','approved','published_in_app')),
  generation_method text not null default 'synthetic_template' check (generation_method = 'synthetic_template'),
  evidence_count integer not null default 0 check(evidence_count >= 0),
  synthetic boolean not null default true check(synthetic = true),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poc_studio_events (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.poc_clients(client_id) on delete cascade,
  edition_type text not null check (edition_type in ('daily_trading','weekly_investing','monthly_wealth')),
  edition_id uuid references public.poc_story_editions(id) on delete set null,
  event_type text not null check (event_type in ('email_delivery_simulated','in_app_view_demo')),
  channel text not null check (channel in ('email','in_app')),
  details jsonb not null default '{"simulation":true}'::jsonb,
  synthetic boolean not null default true check(synthetic = true),
  created_at timestamptz not null default now(),
  constraint poc_studio_event_channel_match check (
   (event_type='email_delivery_simulated' and channel='email')
   or (event_type='in_app_view_demo' and channel='in_app')
  )
);

create index if not exists poc_story_editions_client_idx on public.poc_story_editions(client_id,edition_type,created_at desc);
create index if not exists poc_studio_events_client_idx on public.poc_studio_events(client_id,created_at desc);

alter table public.poc_edition_subscriptions enable row level security;
alter table public.poc_story_editions enable row level security;
alter table public.poc_studio_events enable row level security;

revoke all on public.poc_edition_subscriptions,public.poc_story_editions,public.poc_studio_events from anon;
grant select,insert,update on public.poc_edition_subscriptions,public.poc_story_editions,public.poc_studio_events to authenticated;
-- Explicit demo reviewer policies: all signed-in reviewers can manipulate
-- *synthetic* subscriptions, editions and simulated events for POC testing only.
-- Future production use needs reviewer roles, customer consent evidence, row-level
-- separation, server-side workflow constraints and audit-enforced transitions.

drop policy if exists poc_sub_read on public.poc_edition_subscriptions;
create policy poc_sub_read on public.poc_edition_subscriptions for select to authenticated using (synthetic = true);
drop policy if exists poc_sub_update on public.poc_edition_subscriptions;
create policy poc_sub_update on public.poc_edition_subscriptions for update to authenticated using (synthetic = true) with check (synthetic = true);

drop policy if exists poc_editions_read on public.poc_story_editions;
create policy poc_editions_read on public.poc_story_editions for select to authenticated using (synthetic = true);
drop policy if exists poc_editions_insert on public.poc_story_editions;
create policy poc_editions_insert on public.poc_story_editions for insert to authenticated with check (synthetic = true);
drop policy if exists poc_editions_update on public.poc_story_editions;
create policy poc_editions_update on public.poc_story_editions for update to authenticated using (synthetic = true) with check (synthetic = true);

drop policy if exists poc_events_read on public.poc_studio_events;
create policy poc_events_read on public.poc_studio_events for select to authenticated using (synthetic = true);
drop policy if exists poc_events_insert on public.poc_studio_events;
create policy poc_events_insert on public.poc_studio_events for insert to authenticated with check (synthetic = true and details->>'simulation' = 'true');

-- Idempotent initial fictional subscription scenarios; preserve reviewer changes on rerun.
insert into public.poc_edition_subscriptions (client_id,edition_type,status,delivery_window)
select c.client_id,e.edition_type,
 case
   when c.client_id='C020' then 'unsubscribed'
   when e.edition_type='daily_trading' then
      case when c.client_id in ('C008','C010','C011','C012','C016') then 'subscribed' else 'unsubscribed' end
   when e.edition_type='weekly_investing' then
      case when c.client_id in ('C001','C015') then 'unsubscribed'
           when c.client_id='C018' then 'paused' else 'subscribed' end
   when e.edition_type='monthly_wealth' then
      case when c.client_id in ('C003','C006','C012','C013','C014','C016','C017') then 'subscribed'
           else 'unsubscribed' end
 end,
 case when e.edition_type='daily_trading' then 'pre_market' else 'standard' end
from public.poc_clients c
cross join (values ('daily_trading'),('weekly_investing'),('monthly_wealth')) as e(edition_type)
on conflict (client_id,edition_type) do nothing;

commit;

-- Verification after running:
-- select edition_type,status,count(*) from public.poc_edition_subscriptions group by 1,2 order by 1,2;
-- select count(*) from public.poc_edition_subscriptions; -- expected 60 rows
-- select count(*) from public.poc_clients; -- expected 20 rows

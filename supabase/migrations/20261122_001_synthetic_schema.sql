-- Geojit Wealth Story POC 2.0 — use only synthetic data
-- Run this migration first in the Supabase SQL Editor.
-- Then run the generated synthetic seed file provided with the 20-client universe.
create table if not exists public.poc_clients (
 client_id text primary key check (client_id ~ '^C[0-9]{3}$'),
 alias text not null,
 persona_scenario text not null,
 starting_mode text not null,
 profile jsonb not null,
 synthetic boolean not null default true check(synthetic = true)
);
create table if not exists public.poc_records (
 record_id text primary key,
 client_id text not null references public.poc_clients(client_id) on delete cascade,
 domain text not null,
 source_id text,
 event_at timestamptz,
 payload jsonb not null
);
create table if not exists public.poc_catalog (
 record_id text primary key,
 domain text not null,
 payload jsonb not null
);
create index if not exists poc_records_client_domain_idx on public.poc_records(client_id,domain);
create index if not exists poc_records_client_event_idx on public.poc_records(client_id,event_at desc);
create index if not exists poc_records_domain_idx on public.poc_records(domain);
alter table public.poc_clients enable row level security;
alter table public.poc_records enable row level security;
alter table public.poc_catalog enable row level security;
revoke all on public.poc_clients, public.poc_records, public.poc_catalog from anon;
grant select on public.poc_clients, public.poc_records, public.poc_catalog to authenticated;
-- Demo accounts can read ALL fictional clients. Do not reuse for real customers.
drop policy if exists poc_clients_authenticated_read on public.poc_clients;
create policy poc_clients_authenticated_read on public.poc_clients for select to authenticated using (true);
drop policy if exists poc_records_authenticated_read on public.poc_records;
create policy poc_records_authenticated_read on public.poc_records for select to authenticated using (true);
drop policy if exists poc_catalog_authenticated_read on public.poc_catalog;
create policy poc_catalog_authenticated_read on public.poc_catalog for select to authenticated using (true);
-- Only service-role/administrator SQL can insert, update, or delete rows.

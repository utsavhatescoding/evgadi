-- EV Match Nepal: initial production database
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id text primary key,
  brand text not null,
  model text not null,
  variant text not null,
  price bigint not null check (price > 0),
  battery numeric(6,2) not null check (battery > 0),
  range integer not null check (range > 0),
  range_standard text not null,
  seats integer not null check (seats between 2 and 20),
  clearance integer,
  dc numeric(7,2),
  service_cities text[] not null default '{}',
  service_count integer not null default 0,
  qa text not null default 'Incomplete' check (qa in ('Incomplete', 'Needs review')),
  evidence integer not null default 0 check (evidence between 0 and 10),
  status text not null default 'draft' check (status in ('draft', 'active', 'discontinued')),
  source_url text,
  source_label text,
  image_url text,
  body_type text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendation_sessions (
  id uuid primary key default gen_random_uuid(),
  answers jsonb not null,
  result_vehicle_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.buyer_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 7 and 20),
  city text not null,
  selected_vehicle text not null,
  purchase_timing text not null,
  answers jsonb not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('editor', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
alter table public.recommendation_sessions enable row level security;
alter table public.buyer_enquiries enable row level security;
alter table public.admin_users enable row level security;

create policy "Public can read active vehicles"
on public.vehicles for select
using (status = 'active');

create policy "Visitors can create recommendation sessions"
on public.recommendation_sessions for insert
with check (jsonb_typeof(answers) = 'object');

create policy "Visitors can create enquiries"
on public.buyer_enquiries for insert
with check (
  char_length(name) between 2 and 100
  and char_length(phone) between 7 and 20
  and jsonb_typeof(answers) = 'object'
);

create policy "Admins can manage vehicles"
on public.vehicles for all
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can read recommendation sessions"
on public.recommendation_sessions for select
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can manage enquiries"
on public.buyer_enquiries for all
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create index if not exists buyer_enquiries_created_at_idx
  on public.buyer_enquiries (created_at desc);

create index if not exists recommendation_sessions_created_at_idx
  on public.recommendation_sessions (created_at desc);

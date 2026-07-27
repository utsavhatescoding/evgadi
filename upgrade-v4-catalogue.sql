-- EV Gadi catalogue v4
-- Creates a nullable, evidence-aware public catalogue. No unknown fact is guessed.

create table if not exists public.catalogue_vehicles (
  id text primary key,
  brand text not null,
  model text not null,
  variants text,
  segment text not null,
  price bigint not null check (price > 0),
  battery_kwh numeric(7,2),
  range_km integer,
  range_standard text,
  battery_type text,
  ac_charging text,
  dc_charging text,
  clearance_mm integer,
  vehicle_warranty text,
  battery_warranty text,
  motor_warranty text,
  distributor text,
  source_url text,
  official_source_url text,
  source_label text,
  source_tier text not null default 'market-directory',
  checked_at date,
  status text not null default 'active' check (status in ('active','upcoming','discontinued')),
  updated_at timestamptz not null default now()
);

alter table public.catalogue_vehicles enable row level security;
drop policy if exists "Public can read active catalogue vehicles" on public.catalogue_vehicles;
create policy "Public can read active catalogue vehicles"
on public.catalogue_vehicles for select using (status = 'active');

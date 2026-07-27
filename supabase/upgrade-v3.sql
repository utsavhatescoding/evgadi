-- EV Match Nepal catalogue upgrade
-- Safe to run on an existing Supabase project.

alter table public.vehicles add column if not exists source_label text;
alter table public.vehicles add column if not exists image_url text;
alter table public.vehicles add column if not exists body_type text;

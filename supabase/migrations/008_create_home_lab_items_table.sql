-- Phase 13: creates the home_lab_items table, following the same
-- convention as migrations 006/007 (experience/education): new table,
-- content_status draft/published/archived, order_index, RLS enabled,
-- public read of published rows only, no write policies.
--
-- `status` is a free-text field, not a CHECK-constrained enum — unlike
-- projects.status/certifications.status, no fixed set of values was
-- specified for this field, so it's left open rather than silently
-- inventing one.
--
-- Run this in the Supabase SQL Editor.

create table home_lab_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  description text,
  status text,
  link text,
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index home_lab_items_content_status_idx on home_lab_items (content_status);
create index home_lab_items_order_idx on home_lab_items (order_index);

alter table home_lab_items enable row level security;

create policy "home_lab_items public read" on home_lab_items
  for select using (content_status = 'published');

-- No insert/update/delete policies — same pattern as every other table.
-- Writes only happen server-side via the service-role client, gated by
-- requireAdmin() in src/lib/admin-content/homelab-mutations.ts.

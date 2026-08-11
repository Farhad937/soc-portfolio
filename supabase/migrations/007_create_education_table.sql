-- Phase 12: creates the education table, following the exact same
-- convention as migration 006 (experience): new table, content_status
-- draft/published/archived, order_index, RLS enabled, public read of
-- published rows only, no write policies.
--
-- Run this in the Supabase SQL Editor.

create table education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date text,
  end_date text,
  is_current boolean not null default false,
  description text,
  achievements text[] not null default '{}',
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index education_content_status_idx on education (content_status);
create index education_order_idx on education (order_index);

alter table education enable row level security;

create policy "education public read" on education
  for select using (content_status = 'published');

-- No insert/update/delete policies — same pattern as every other table.
-- Writes only happen server-side via the service-role client, gated by
-- requireAdmin() in src/lib/admin-content/education-mutations.ts.

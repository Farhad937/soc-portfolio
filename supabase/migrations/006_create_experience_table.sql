-- Phase 10: creates the experience table. Unlike migrations 002-005
-- (which altered existing tables), this is a genuinely new table,
-- following the exact same conventions as the original Phase 1 schema:
-- content_status draft/published/archived, order_index, RLS enabled,
-- public read of published rows only, no write policies (writes only
-- via the service-role client behind requireAdmin(), same as every
-- other table).
--
-- Run this in the Supabase SQL Editor.

create table experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  location text,
  start_date text,
  end_date text,
  is_current boolean not null default false,
  description text,
  achievements text[] not null default '{}',
  technologies text[] not null default '{}',
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index experience_content_status_idx on experience (content_status);
create index experience_order_idx on experience (order_index);

alter table experience enable row level security;

create policy "experience public read" on experience
  for select using (content_status = 'published');

-- No insert/update/delete policies — same pattern as every other table.
-- Writes only happen server-side via the service-role client, gated by
-- requireAdmin() in src/lib/admin-content/experience-mutations.ts.

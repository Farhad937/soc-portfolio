-- SOC Portfolio CMS schema — Phase 1 (foundation)
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
-- Safe to run once on a fresh project. Re-running will error on existing
-- objects (by design — this is not written to be idempotent).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- site_settings — singleton row for site-wide identity/config
-- ---------------------------------------------------------------------
create table site_settings (
  id smallint primary key default 1,
  name text not null,
  role text not null,
  tagline text not null,
  location text not null,
  email text not null,
  github_url text,
  linkedin_url text,
  tryhackme_url text,
  status_text text not null default 'MONITORING',
  learning_hours integer not null default 0,
  github_repos integer not null default 0,
  blog_articles integer not null default 0,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  status text check (status in ('In Progress', 'Complete', 'Planned')),
  time_invested text,
  tech text[] not null default '{}',
  skills text[] not null default '{}',
  overview text,
  objective text,
  environment text,
  tools_used text[] not null default '{}',
  challenges text,
  investigation text,
  findings text,
  lessons_learned text,
  future_improvements text,
  github_url text,
  featured boolean not null default false,
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_content_status_idx on projects (content_status);
create index projects_order_idx on projects (order_index);

-- ---------------------------------------------------------------------
-- writeups
-- ---------------------------------------------------------------------
create table writeups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,
  reading_time text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  summary text,
  concept text,
  key_takeaways text[] not null default '{}',
  "references" jsonb not null default '[]',   -- [{ "label": "...", "url": "..." }]
  featured boolean not null default false,
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index writeups_content_status_idx on writeups (content_status);
create index writeups_order_idx on writeups (order_index);

-- ---------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------
create table certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text,
  date text,
  skills text[] not null default '{}',
  credential_url text,
  status text check (status in ('Completed', 'In Progress', 'Planned')),
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index certifications_content_status_idx on certifications (content_status);

-- ---------------------------------------------------------------------
-- seo_metadata â€” optional CMS overrides for public static page metadata
-- ---------------------------------------------------------------------
create table seo_metadata (
  route text primary key check (route in (
    '/', '/about', '/projects', '/writeups', '/skills', '/certifications',
    '/journey', '/homelab', '/resume', '/contact', '/tryhackme'
  )),
  title text,
  description text,
  og_title text,
  og_description text,
  og_image text,
  canonical_url text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- timeline_entries
-- ---------------------------------------------------------------------
create table timeline_entries (
  id uuid primary key default gen_random_uuid(),
  date text,
  title text not null,
  description text,
  order_index integer not null default 0,
  content_status text not null default 'draft' check (content_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index timeline_entries_content_status_idx on timeline_entries (content_status);

-- ---------------------------------------------------------------------
-- skill_groups + skills (normalized so individual skills can be
-- added/removed without rewriting a whole array)
-- ---------------------------------------------------------------------
create table skill_groups (
  id uuid primary key default gen_random_uuid(),
  category text not null unique,
  order_index integer not null default 0
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  skill_group_id uuid not null references skill_groups(id) on delete cascade,
  name text not null,
  order_index integer not null default 0
);
create index skills_group_idx on skills (skill_group_id);

-- ---------------------------------------------------------------------
-- tryhackme_paths + tryhackme_rooms
-- ---------------------------------------------------------------------
create table tryhackme_paths (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  progress integer not null default 0 check (progress between 0 and 100),
  order_index integer not null default 0
);

create table tryhackme_rooms (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references tryhackme_paths(id) on delete cascade,
  name text not null,
  status text check (status in ('Complete', 'In Progress', 'Not Started')),
  order_index integer not null default 0
);
create index tryhackme_rooms_path_idx on tryhackme_rooms (path_id);

-- =======================================================================
-- Row Level Security
-- Phase 1: public read of published content only. No client-side writes
-- at all — the only way to write right now is the migration script
-- running locally with the service-role key. Phase 2 (admin auth) will
-- add authenticated + is_admin() policies for INSERT/UPDATE/DELETE.
-- =======================================================================

alter table site_settings enable row level security;
alter table projects enable row level security;
alter table writeups enable row level security;
alter table certifications enable row level security;
alter table seo_metadata enable row level security;
alter table timeline_entries enable row level security;
alter table skill_groups enable row level security;
alter table skills enable row level security;
alter table tryhackme_paths enable row level security;
alter table tryhackme_rooms enable row level security;

-- site_settings: single public row, always readable
create policy "site_settings public read" on site_settings
  for select using (true);

-- content tables: published only
create policy "projects public read" on projects
  for select using (content_status = 'published');

create policy "writeups public read" on writeups
  for select using (content_status = 'published');

create policy "certifications public read" on certifications
  for select using (content_status = 'published');

create policy "seo_metadata public read" on seo_metadata
  for select using (true);

create policy "timeline_entries public read" on timeline_entries
  for select using (content_status = 'published');

-- reference tables: no draft concept yet, always readable
create policy "skill_groups public read" on skill_groups
  for select using (true);

create policy "skills public read" on skills
  for select using (true);

create policy "tryhackme_paths public read" on tryhackme_paths
  for select using (true);

create policy "tryhackme_rooms public read" on tryhackme_rooms
  for select using (true);

-- No insert/update/delete policies are created for anon or authenticated
-- roles. That is intentional for this phase — only the service_role key
-- (used exclusively by scripts/migrate.ts, run locally) can write.

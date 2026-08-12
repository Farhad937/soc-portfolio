-- Phase 14: adds Hero/homepage fields to site_settings. Purely
-- additive, same pattern as migrations 002-004 — no existing column is
-- renamed, retyped, or dropped.
--
-- Deliberately NOT reusing the existing `tagline` column for the Hero
-- description, even though it looks similar: tagline is a standalone
-- sentence used only in <meta description> (root layout), while the
-- Hero paragraph is grammatically written to follow directly after
-- "{role} " as its subject ("Aspiring SOC Analyst with a background
-- in..."). Reusing tagline would either break that sentence or force
-- the meta description to read awkwardly — two different jobs, kept as
-- two different fields.
--
-- Because every new column below has a DEFAULT, Postgres backfills the
-- existing site_settings row automatically when this migration runs —
-- no separate UPDATE needed, and the current homepage content is
-- preserved exactly (the defaults match the current hardcoded text).
--
-- Run this in the Supabase SQL Editor.

alter table site_settings add column if not exists hero_kicker text not null default '> whoami';

alter table site_settings add column if not exists hero_description text not null default
  'with a background in engineering, translation, and data analysis. I''m building hands-on defensive security skills through structured learning, home lab projects, and detection research.';

alter table site_settings add column if not exists hero_button_1_label text not null default 'View Projects';
alter table site_settings add column if not exists hero_button_1_url text not null default '/projects';
alter table site_settings add column if not exists hero_button_2_label text not null default 'Read My Write-ups';
alter table site_settings add column if not exists hero_button_2_url text not null default '/writeups';
alter table site_settings add column if not exists hero_button_3_label text not null default 'Download CV';
alter table site_settings add column if not exists hero_button_3_url text not null default '/resume';
alter table site_settings add column if not exists hero_button_4_label text not null default 'Contact Me';
alter table site_settings add column if not exists hero_button_4_url text not null default '/contact';

alter table site_settings add column if not exists currently_studying text[] not null default
  array['Security+', 'TryHackMe', 'Home Lab', 'Python', 'Windows Internals'];

-- No RLS changes needed — site_settings already has a public-read
-- policy (`using (true)`) and no write policies, unchanged since
-- Phase 1. Writes go through the service-role client, gated by
-- requireAdmin(), same as every other mutation in this project.

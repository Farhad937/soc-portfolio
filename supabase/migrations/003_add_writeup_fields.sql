-- Phase 6: adds fields from the Write-ups manager spec not present in
-- the original Phase 1 schema. Purely additive, same as migration 002.
-- Run this in the Supabase SQL Editor before using the new Write-ups
-- admin pages.

alter table writeups add column if not exists tags text[] not null default '{}';
alter table writeups add column if not exists technologies text[] not null default '{}';
alter table writeups add column if not exists platform text;
alter table writeups add column if not exists date text;
alter table writeups add column if not exists github_url text;

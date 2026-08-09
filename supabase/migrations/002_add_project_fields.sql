-- Phase 4/5: adds fields from the Projects manager spec that weren't in
-- the original Phase 1 schema. Purely additive — no existing column is
-- renamed, retyped, or dropped, and existing rows get NULL for both
-- (safe default; NULL renders as empty in the admin form).
--
-- Run this in the Supabase SQL Editor before using the new Projects
-- admin pages.

alter table projects add column if not exists category text;
alter table projects add column if not exists live_url text;

-- Phase 9: adds fields from the Certifications manager spec not present
-- in the original Phase 1 schema. Purely additive, same pattern as
-- migrations 002 and 003. Run in the Supabase SQL Editor before using
-- the new Certifications admin pages.

alter table certifications add column if not exists credential_id text;
alter table certifications add column if not exists description text;

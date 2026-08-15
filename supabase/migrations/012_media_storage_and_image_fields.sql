-- Batch 3: Supabase Storage infrastructure + the image/logo/resume
-- fields that were deferred since Phases 4/5/9/17.
--
-- IMPORTANT — verified by inspecting the actual repository before
-- writing this: projects.featured_image, projects.gallery, and
-- certifications.logo did NOT exist anywhere in prior migrations. The
-- Batch 3 brief assumed they already existed; they didn't. This
-- migration creates them now, which is exactly the "smallest safe
-- migration necessary" the brief calls for once that gap is found.
--
-- Run this in the Supabase SQL Editor.

-- ---------------------------------------------------------------------
-- Storage bucket + policies
-- ---------------------------------------------------------------------
-- One bucket for all CMS-managed media (project images, certification
-- logos, resume, general uploads) — a single properly-namespaced
-- bucket is sufficient; separate buckets per content type would just
-- duplicate the same policy three times for no benefit.
--
-- Public read (anyone can view/download), no client-side write
-- policies — same architecture as every table in this project: writes
-- only ever happen server-side via the service-role client, gated by
-- requireAdmin(), which bypasses Storage RLS entirely just like it
-- bypasses table RLS. No policy grants INSERT/UPDATE/DELETE to the
-- anon or authenticated roles, matching the "no write policies, ever"
-- convention already used on every content table.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

-- ---------------------------------------------------------------------
-- Project image fields (deferred since Phase 4/5)
-- ---------------------------------------------------------------------
alter table projects add column if not exists featured_image text;
alter table projects add column if not exists gallery text[] not null default '{}';

-- ---------------------------------------------------------------------
-- Certification logo field (deferred since Phase 9)
-- ---------------------------------------------------------------------
alter table certifications add column if not exists logo text;

-- ---------------------------------------------------------------------
-- Resume fields (deferred since Phase 17) — added to site_settings,
-- the established singleton pattern, rather than a new one-row table
-- for 3 fields (same reasoning as Hero fields in migration 010).
-- ---------------------------------------------------------------------
alter table site_settings add column if not exists resume_url text;
alter table site_settings add column if not exists resume_filename text;
alter table site_settings add column if not exists resume_uploaded_at timestamptz;

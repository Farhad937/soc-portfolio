-- Batch 5: route-level, CMS-managed metadata for public portfolio pages.
-- Public reads are safe because this table only contains publishable metadata;
-- writes remain server-side through the service-role client after requireAdmin().

create table if not exists seo_metadata (
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

alter table seo_metadata enable row level security;

create policy "seo_metadata public read" on seo_metadata
  for select using (true);

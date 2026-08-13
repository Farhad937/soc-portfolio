-- Batch 1 (About): creates about_page_content, following the exact
-- same singleton pattern as home_lab_page_content (migration 009) —
-- one row, always public, no draft workflow, since this is structural
-- page content edited in place, not discrete authored posts.
--
-- The seed INSERT uses the exact current hardcoded About text, so the
-- public page's content is unchanged immediately after this migration
-- runs — nothing goes blank until you actually edit it.
--
-- Run this in the Supabase SQL Editor.

create table about_page_content (
  id smallint primary key default 1,
  engineering_background text,
  security_transition text,
  defensive_security_reason text,
  current_focus text[] not null default '{}',
  career_goal text,
  updated_at timestamptz not null default now(),
  constraint about_page_content_singleton check (id = 1)
);

alter table about_page_content enable row level security;

create policy "about_page_content public read" on about_page_content
  for select using (true);

-- No write policies — same pattern as every other table. Writes only
-- via the service-role client, gated by requireAdmin().

insert into about_page_content (
  id,
  engineering_background,
  security_transition,
  defensive_security_reason,
  current_focus,
  career_goal
)
values (
  1,
  'Replace this paragraph with your engineering background — what you studied, what kind of problems you solved, and what that work taught you about systems thinking.',
  'Replace this paragraph with your transition story: what pulled you toward defensive security specifically, rather than security broadly. Being specific here (a moment, an article, a lab exercise that hooked you) reads far better than a generic "I''ve always been interested in technology."',
  'Replace this paragraph with why defensive security interests you over offensive — recruiters ask this in nearly every SOC interview, so having a real answer written down helps you say it clearly out loud too.',
  array[
    'CompTIA Security+ study',
    'TryHackMe SOC Level 1 pathway',
    'Home lab: Active Directory + Splunk detection',
    'Python for security automation',
    'Windows internals and event log analysis'
  ],
  'Replace with one or two sentences on the specific kind of SOC role and environment you''re targeting (e.g. MSSP vs in-house, Tier 1 entry point, industry you''d like to work in).'
);

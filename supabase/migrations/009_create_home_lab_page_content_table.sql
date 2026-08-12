-- Phase 13 correction: the /homelab page had three sections left
-- hardcoded in JSX (Hardware/Virtualization prose, the network diagram
-- note, and the Future Additions list) even after the VM list became
-- CMS-driven. This closes that gap with a singleton table, following
-- the same "one row, always public, no draft workflow" pattern already
-- used for site_settings and skill_groups/skills — this is structural
-- page content edited in place, not a list of discrete authored posts.
--
-- The seed INSERT below uses the exact current hardcoded text, so the
-- public page's content is unchanged immediately after this migration
-- runs — nothing goes blank until you actually edit it in the admin.
--
-- Run this in the Supabase SQL Editor.

create table home_lab_page_content (
  id smallint primary key default 1,
  hardware_description text,
  virtualization_description text,
  network_diagram_note text,
  future_additions text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint home_lab_page_content_singleton check (id = 1)
);

alter table home_lab_page_content enable row level security;

create policy "home_lab_page_content public read" on home_lab_page_content
  for select using (true);

-- No write policies — same pattern as every other table. Writes only
-- via the service-role client, gated by requireAdmin().

insert into home_lab_page_content (id, hardware_description, virtualization_description, network_diagram_note, future_additions)
values (
  1,
  'Replace with your actual laptop/desktop specs — CPU, RAM, storage. Hiring managers skim this to gauge how much you had to work around resource limits, which is itself a signal of resourcefulness.',
  'VirtualBox, running on an isolated internal network (host-only adapter).',
  '[ add your lab network diagram here — draw.io or Excalidraw export works well ]',
  array[
    'Splunk instance for centralized logging',
    'Security Onion for network-based detection',
    'Elastic stack as a second SIEM comparison point'
  ]
);

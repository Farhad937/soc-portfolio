-- Phase 9 fix: certifications.status was nullable, which let the admin
-- form's now-removed blank option save a NULL status. The public
-- /certifications page assumes status is always one of the three known
-- values (Completed / In Progress / Planned) and crashes on anything
-- else, including NULL. This migration closes that gap at the source.
--
-- DO NOT run step 2 blindly. NOT NULL will fail outright if any row
-- still has a NULL status — which is correct, not a bug, since this
-- forces you to look at those rows before the constraint locks them out.

-- ---------------------------------------------------------------------
-- STEP 1 — run this first, on its own, and read the result.
-- ---------------------------------------------------------------------
select id, name, content_status, status
from certifications
where status is null;

-- If this returns zero rows, skip straight to Step 2.
--
-- If it returns rows (e.g. the test certification created while
-- verifying Phase 9), resolve each one before proceeding — most likely
-- by deleting it via the admin UI's existing Delete button at
-- /admin/certifications, since test/temporary data shouldn't be forced
-- into a fake status just to satisfy a constraint. If any of the
-- returned rows is real content you want to keep, edit it in the admin
-- UI and set a real status instead — the admin form now requires one.

-- ---------------------------------------------------------------------
-- STEP 2 — only after Step 1 returns zero rows.
-- ---------------------------------------------------------------------
alter table certifications alter column status set not null;

-- The existing CHECK constraint (status in ('Completed', 'In Progress',
-- 'Planned')) is untouched — this migration only adds NOT NULL on top
-- of it, it doesn't recreate or replace it.

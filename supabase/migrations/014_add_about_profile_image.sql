-- Optional public profile image used by the About page.
-- The URL points to the existing public media bucket.
alter table about_page_content
  add column if not exists profile_image text;

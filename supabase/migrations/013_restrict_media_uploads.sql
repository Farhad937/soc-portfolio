-- Enforce the same maximum size and MIME types as the signed-upload flow.
-- This preserves the public bucket and its existing RLS policies.
update storage.buckets
set
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
where id = 'media';

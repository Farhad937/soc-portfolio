import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Browser-safe Supabase client. Uses only NEXT_PUBLIC_* env vars, which
 * are safe to ship to the client because every table is protected by
 * Row Level Security (see supabase/schema.sql) — this key can only ever
 * read published content, nothing more.
 *
 * Deliberately untyped (no Database generic): hand-authored types fought
 * this SDK version's generated-type format. Row shapes are documented in
 * src/lib/supabase/types.ts and applied manually in src/lib/content/*.ts,
 * where each row is mapped onto the app's existing types. Real generated
 * types (`supabase gen types typescript`) can replace this later without
 * touching any calling code.
 *
 * Returns null if the env vars aren't set (e.g. before migration, or in
 * environments where Supabase isn't configured yet) so callers can fall
 * back to static data instead of crashing.
 */
export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabasePublishableKey) return null;
  return createClient(supabaseUrl, supabasePublishableKey);
}

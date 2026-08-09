import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Server-side Supabase client for reading published content in Server
 * Components. Deliberately uses the same public/publishable key as the
 * browser client, NOT the service-role key — reads of published content
 * don't need elevated privileges, and RLS already scopes this key to
 * `content_status = 'published'` rows.
 *
 * The service-role key (SUPABASE_SECRET_KEY) is intentionally not used
 * anywhere in this file. It's reserved for scripts/migrate.ts and, in a
 * later phase, authenticated admin write operations — never for public
 * page reads.
 *
 * Deliberately untyped (no Database generic) — see client.ts for why.
 *
 * Returns null if env vars aren't set so data-access functions can fall
 * back to static data.
 */
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabasePublishableKey) return null;
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false },
  });
}

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
 *
 * Diagnostic logging: every public content loader's `if (!supabase)`
 * branch is silent by design (falling back is the intended behavior,
 * not an error worth warning about on every request). But if this
 * function returns null in a live environment where it shouldn't — e.g.
 * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY missing/misconfigured at build
 * time on the hosting platform — that silently degrades every public
 * page to static/fallback content with zero visibility into why.
 * Logging once here, centrally, makes that state observable in
 * production server logs without touching every loader that calls this.
 */
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    console.error(
      "[getSupabaseServerClient] Missing Supabase env var(s) — falling back to static/empty content for ALL public reads:",
      {
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "set" : "MISSING",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabasePublishableKey ? "set" : "MISSING",
      }
    );
    return null;
  }
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false },
  });
}

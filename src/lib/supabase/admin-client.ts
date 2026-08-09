import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

/**
 * Service-role client. Bypasses RLS entirely — sees draft/archived rows,
 * everything. This is the ONLY file in the codebase that reads
 * SUPABASE_SECRET_KEY outside scripts/migrate.ts.
 *
 * `import "server-only"` at the top makes it a BUILD ERROR (not just a
 * lint warning) if anything ever imports this from a Client Component
 * or a file that ends up in the browser bundle. That's deliberate —
 * this key must never leave the server under any circumstance.
 *
 * Every function that calls this MUST call requireAdmin() first — this
 * client itself does no authorization checking. It trusts the caller
 * completely, which is exactly why every caller must be gated.
 */
export function getSupabaseAdminClient() {
  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. Admin data reads require it — check .env.local."
    );
  }
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false },
  });
}

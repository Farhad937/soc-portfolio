import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Browser client for the admin login form ONLY. Distinct from
 * src/lib/supabase/client.ts (the anonymous public-content client) —
 * this one manages an auth session via cookies (createBrowserClient),
 * which the plain client.ts deliberately does not do.
 *
 * Still uses only the public/publishable key — signInWithPassword
 * validates credentials against Supabase Auth server-side; this client
 * never sees or needs the secret key.
 */
export function getSupabaseAuthBrowserClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}

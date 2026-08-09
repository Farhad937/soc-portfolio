import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Auth-aware server client for Server Components, Server Actions, and
 * Route Handlers. Reads the session from cookies via next/headers.
 *
 * Distinct from src/lib/supabase/server.ts (public-content reads, no
 * cookies, no auth) — that client is unaffected by anything in this
 * file and keeps working exactly as it did in Phase 1.
 *
 * Still only the public/publishable key. Authorization comes from the
 * validated session (Supabase Auth checks the cookie server-side), not
 * from an elevated key.
 */
export async function getSupabaseAuthServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // setAll is called from a Server Component in some cases
          // (e.g. rendering, not a Server Action/Route Handler), where
          // cookies can't be written. Safe to ignore — middleware.ts
          // refreshes the session cookie on every request instead.
        }
      },
    },
  });
}

/**
 * Returns the authenticated user, or null. Uses getUser() (not
 * getSession()) deliberately — getUser() revalidates the session
 * against Supabase Auth's server on every call rather than trusting an
 * unverified cookie value, which matters for a security check.
 */
export async function getAuthenticatedUser() {
  const supabase = await getSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Guard for Server Actions and Route Handlers that will perform a
 * write. Throws if there's no authenticated session. No CRUD mutations
 * exist yet (Phase 4), but this is the exact function they'll call
 * first, before touching the database — the authorization boundary
 * lives here, not in hidden UI or in client-side checks.
 */
export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized: no authenticated session.");
  }
  return user;
}

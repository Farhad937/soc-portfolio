import { getAuthenticatedUser } from "@/lib/supabase/auth-server";

export default async function AdminHomePage() {
  const user = await getAuthenticatedUser();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-8">
      <p className="kicker mb-3">// Authenticated</p>
      <h1 className="text-2xl font-semibold text-text">You're signed in.</h1>
      <p className="mt-3 text-text-muted">
        Signed in as <span className="font-mono text-text">{user?.email}</span>. This confirms
        Phase 2 (authentication + protected routes) is working end-to-end — login, the middleware
        redirect, and this page's independent server-side session check.
      </p>
      <p className="mt-4 text-text-muted">
        The real CMS interface — sidebar, content managers, forms — is Phase 3 and hasn't been
        built yet. Nothing on the public site can be edited from here yet.
      </p>
    </div>
  );
}

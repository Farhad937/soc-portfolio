"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldHalf, Loader2 } from "lucide-react";
import { getSupabaseAuthBrowserClient } from "@/lib/supabase/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseAuthBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      // Deliberately generic — do not reveal whether the email exists,
      // whether the password was wrong, etc. Supabase's own error
      // message is safe to show here (it's already generic by design).
      setError(signInError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <ShieldHalf className="h-8 w-8 text-accent" />
          <div>
            <p className="kicker">// Admin</p>
            <h1 className="mt-1 text-xl font-semibold text-text">Sign in</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2.5 text-text placeholder:text-text-faint focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2.5 text-text placeholder:text-text-faint focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[11px] text-text-faint">
          There is no self-service signup. Accounts are created directly in Supabase.
        </p>
      </div>
    </div>
  );
}

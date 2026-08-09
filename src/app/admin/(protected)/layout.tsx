import { redirect } from "next/navigation";
import { ShieldHalf, LogOut } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";
import AdminSidebar from "@/components/admin-sidebar";
import { logout } from "../actions";

/**
 * Second, independent auth check — middleware.ts already redirects
 * unauthenticated requests to /admin routes, but per the "do not rely
 * only on hiding UI elements for security" requirement, this layout
 * checks again server-side rather than trusting that middleware ran.
 * If this ever renders for an unauthenticated user (it shouldn't), it
 * redirects rather than rendering anything.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <header className="border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <ShieldHalf className="h-5 w-5 text-accent" />
            <span>Admin</span>
            <span className="font-mono text-xs text-text-faint">/ {user.email}</span>
          </div>
          <form action={logout}>
            <button type="submit" className="btn-secondary text-sm">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

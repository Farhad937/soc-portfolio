import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Scoped to /admin only — the public site (Phase 1's pages) is
// untouched by this middleware and pays no cost for it.
export const config = {
  matcher: ["/admin/:path*"],
};

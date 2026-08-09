"use server";

import { redirect } from "next/navigation";
import { getSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export async function logout() {
  const supabase = await getSupabaseAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

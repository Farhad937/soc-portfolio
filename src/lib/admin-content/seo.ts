import "server-only";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { SeoMetadataRecord } from "@/lib/content/seo";

export async function getSeoMetadataAdmin(): Promise<SeoMetadataRecord[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("seo_metadata")
    .select("route, title, description, og_title, og_description, og_image, canonical_url")
    .order("route", { ascending: true });
  if (error) throw new Error(`getSeoMetadataAdmin: ${error.message}`);
  return (data ?? []) as SeoMetadataRecord[];
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { isSeoRoute } from "@/lib/seo-routes";

export type SeoMetadataFormState = { error: string | null; success?: boolean };

function nullableText(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim() || null;
}

function optionalHttpUrl(value: string | null, label: string) {
  if (!value) return { value: null };
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    return { value: url.toString() };
  } catch {
    return { error: `${label} must be a valid http(s) URL.` };
  }
}

export async function saveSeoMetadata(
  _prevState: SeoMetadataFormState,
  formData: FormData
): Promise<SeoMetadataFormState> {
  await requireAdmin();
  const route = String(formData.get("route") ?? "");
  if (!isSeoRoute(route)) return { error: "Choose a valid public page." };

  const ogImage = optionalHttpUrl(nullableText(formData, "og_image"), "Open Graph image URL");
  if (ogImage.error) return { error: ogImage.error };
  const canonicalUrl = optionalHttpUrl(nullableText(formData, "canonical_url"), "Canonical URL");
  if (canonicalUrl.error) return { error: canonicalUrl.error };

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("seo_metadata").upsert(
    {
      route,
      title: nullableText(formData, "title"),
      description: nullableText(formData, "description"),
      og_title: nullableText(formData, "og_title"),
      og_description: nullableText(formData, "og_description"),
      og_image: ogImage.value,
      canonical_url: canonicalUrl.value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "route" }
  );
  if (error) return { error: error.message };

  revalidatePath("/admin/seo");
  revalidatePath(route);
  return { error: null, success: true };
}

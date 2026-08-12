"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { arrayFromCsv } from "@/lib/slug";

export type HeroContentFormState = { error: string | null; success?: boolean };

/**
 * Updates ONLY the Hero/homepage-specific fields on site_settings —
 * name, role, email, location, and social links are untouched here.
 * Editing those is Contact/Settings editors, explicitly out of scope
 * for Phase 14.
 */
export async function updateHeroContent(
  _prevState: HeroContentFormState,
  formData: FormData
): Promise<HeroContentFormState> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const fields = {
    hero_kicker: String(formData.get("hero_kicker") ?? "").trim(),
    hero_description: String(formData.get("hero_description") ?? "").trim(),
    hero_button_1_label: String(formData.get("hero_button_1_label") ?? "").trim(),
    hero_button_1_url: String(formData.get("hero_button_1_url") ?? "").trim(),
    hero_button_2_label: String(formData.get("hero_button_2_label") ?? "").trim(),
    hero_button_2_url: String(formData.get("hero_button_2_url") ?? "").trim(),
    hero_button_3_label: String(formData.get("hero_button_3_label") ?? "").trim(),
    hero_button_3_url: String(formData.get("hero_button_3_url") ?? "").trim(),
    hero_button_4_label: String(formData.get("hero_button_4_label") ?? "").trim(),
    hero_button_4_url: String(formData.get("hero_button_4_url") ?? "").trim(),
    currently_studying: arrayFromCsv(formData.get("currently_studying")),
  };

  // These columns are NOT NULL in the schema — validating here gives a
  // clear message instead of letting a raw Postgres constraint
  // violation surface in the admin UI.
  for (const [key, value] of Object.entries(fields)) {
    if (key === "currently_studying") continue;
    if (!value) {
      return { error: `${key.replace(/_/g, " ")} is required.` };
    }
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  // Every field this action writes is only ever rendered on the
  // homepage — revalidating "/" is the correct and complete scope,
  // not a repeat of the earlier reorder/revalidation gap.
  revalidatePath("/admin/hero");
  revalidatePath("/");
  return { error: null, success: true };
}

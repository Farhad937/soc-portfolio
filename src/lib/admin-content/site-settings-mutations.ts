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

export type ContactContentFormState = { error: string | null; success?: boolean };

/**
 * Updates ONLY Contact fields — email, location, and the three social
 * links. Does not touch Hero, Settings (name/role/tagline/stats), or
 * any other site_settings column. Contact fields render in Nav/Footer
 * (every public page, via (site)/layout.tsx) and on /contact and
 * /about (location only) — so this revalidates the whole (site) route
 * group's layout rather than manually enumerating every page, which
 * both correctly covers Nav/Footer everywhere and avoids the class of
 * mistake the earlier reorder-revalidation bug was.
 */
export async function updateContactContent(
  _prevState: ContactContentFormState,
  formData: FormData
): Promise<ContactContentFormState> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const fields = {
    email: String(formData.get("email") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    github_url: String(formData.get("github_url") ?? "").trim() || null,
    linkedin_url: String(formData.get("linkedin_url") ?? "").trim() || null,
    tryhackme_url: String(formData.get("tryhackme_url") ?? "").trim() || null,
  };

  if (!fields.email) return { error: "Email is required." };
  if (!fields.location) return { error: "Location is required." };

  const { error } = await supabase
    .from("site_settings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/contact");
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export type SettingsContentFormState = { error: string | null; success?: boolean };

/**
 * Updates ONLY Settings fields — name, role, tagline, status text, and
 * the three dashboard stat counters. Does not touch Hero or Contact
 * columns. name/role/status_text render in Nav/Footer/Hero (every
 * public page) and role/name also appear on /about — same reasoning
 * as Contact above, revalidating the whole (site) layout rather than
 * enumerating individual routes.
 */
export async function updateSettingsContent(
  _prevState: SettingsContentFormState,
  formData: FormData
): Promise<SettingsContentFormState> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const fields = {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    status_text: String(formData.get("status_text") ?? "").trim(),
    learning_hours: Number(formData.get("learning_hours") ?? 0) || 0,
    github_repos: Number(formData.get("github_repos") ?? 0) || 0,
    blog_articles: Number(formData.get("blog_articles") ?? 0) || 0,
  };

  if (!fields.name) return { error: "Name is required." };
  if (!fields.role) return { error: "Role is required." };
  if (!fields.tagline) return { error: "Tagline is required." };
  if (!fields.status_text) return { error: "Status text is required." };

  const { error } = await supabase
    .from("site_settings")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { error: null, success: true };
}

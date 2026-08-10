import "server-only";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

/**
 * Admin-facing reads — return EVERY row regardless of content_status
 * (draft/published/archived), unlike the public src/lib/content/*.ts
 * functions which only ever see published rows.
 *
 * Every export here calls requireAdmin() first and lets it throw if
 * there's no session. That throw is intentional: an admin page calling
 * one of these without a valid session should hard-fail, not silently
 * return empty data.
 */

export type AdminProjectRow = {
  id: string;
  slug: string;
  title: string;
  status: string | null;
  content_status: string;
  order_index: number;
  updated_at: string;
};

export async function getAllProjectsAdmin(): Promise<AdminProjectRow[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug, title, status, content_status, order_index, updated_at")
    .order("order_index", { ascending: true });
  if (error) throw new Error(`getAllProjectsAdmin: ${error.message}`);
  return data ?? [];
}

/** Full row for the edit form — every column, unlike the listing above. */
export async function getProjectByIdAdmin(id: string) {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getProjectByIdAdmin: ${error.message}`);
  return data;
}

export type AdminWriteupRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  content_status: string;
  order_index: number;
  updated_at: string;
};

export async function getAllWriteupsAdmin(): Promise<AdminWriteupRow[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("writeups")
    .select("id, slug, title, category, content_status, order_index, updated_at")
    .order("order_index", { ascending: true });
  if (error) throw new Error(`getAllWriteupsAdmin: ${error.message}`);
  return data ?? [];
}

/** Full row for the edit form. */
export async function getWriteupByIdAdmin(id: string) {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("writeups").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getWriteupByIdAdmin: ${error.message}`);
  return data;
}

export type AdminCertificationRow = {
  id: string;
  name: string;
  issuer: string | null;
  status: string | null;
  content_status: string;
  order_index: number;
};

export async function getAllCertificationsAdmin(): Promise<AdminCertificationRow[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("id, name, issuer, status, content_status, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(`getAllCertificationsAdmin: ${error.message}`);
  return data ?? [];
}

/** Full row for the edit form. */
export async function getCertificationByIdAdmin(id: string) {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("certifications").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getCertificationByIdAdmin: ${error.message}`);
  return data;
}

export type AdminTimelineRow = {
  id: string;
  title: string;
  date: string | null;
  content_status: string;
  order_index: number;
};

export async function getAllTimelineAdmin(): Promise<AdminTimelineRow[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("timeline_entries")
    .select("id, title, date, content_status, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(`getAllTimelineAdmin: ${error.message}`);
  return data ?? [];
}

export type AdminSkillGroupRow = {
  id: string;
  category: string;
  order_index: number;
  skills: { id: string; name: string; order_index: number }[];
};

export async function getAllSkillGroupsAdmin(): Promise<AdminSkillGroupRow[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const { data: groups, error: groupsError } = await supabase
    .from("skill_groups")
    .select("id, category, order_index")
    .order("order_index", { ascending: true });
  if (groupsError) throw new Error(`getAllSkillGroupsAdmin: ${groupsError.message}`);

  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("id, name, order_index, skill_group_id")
    .order("order_index", { ascending: true });
  if (skillsError) throw new Error(`getAllSkillGroupsAdmin: ${skillsError.message}`);

  return (groups ?? []).map((g) => ({
    ...g,
    skills: (skills ?? [])
      .filter((s: any) => s.skill_group_id === g.id)
      .map((s: any) => ({ id: s.id, name: s.name, order_index: s.order_index })),
  }));
}

export async function getSiteSettingsAdmin() {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(`getSiteSettingsAdmin: ${error.message}`);
  return data;
}

export type AdminExperienceRow = {
  id: string;
  company: string;
  position: string;
  is_current: boolean;
  content_status: string;
  order_index: number;
  updated_at: string;
};

export async function getAllExperienceAdmin(): Promise<AdminExperienceRow[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("experience")
    .select("id, company, position, is_current, content_status, order_index, updated_at")
    .order("order_index", { ascending: true });
  if (error) throw new Error(`getAllExperienceAdmin: ${error.message}`);
  return data ?? [];
}

/** Full row for the edit form. */
export async function getExperienceByIdAdmin(id: string) {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("experience").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getExperienceByIdAdmin: ${error.message}`);
  return data;
}

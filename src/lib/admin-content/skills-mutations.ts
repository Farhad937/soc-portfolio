"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

function revalidateSkills() {
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}

// --- Skill groups (categories) ---

export async function createSkillGroup(category: string) {
  const supabase = await getAuthorizedAdminClient();
  const trimmed = category.trim();
  if (!trimmed) throw new Error("Category name is required.");

  const { data: maxOrder } = await supabase
    .from("skill_groups")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase
    .from("skill_groups")
    .insert({ category: trimmed, order_index: (maxOrder?.order_index ?? -1) + 1 });
  if (error) throw new Error(error.message);
  revalidateSkills();
}

export async function renameSkillGroup(id: string, category: string) {
  const supabase = await getAuthorizedAdminClient();
  const trimmed = category.trim();
  if (!trimmed) throw new Error("Category name is required.");

  const { error } = await supabase.from("skill_groups").update({ category: trimmed }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSkills();
}

/** Cascades to every skill in this category via the DB's ON DELETE CASCADE — the UI must warn about this before calling it. */
export async function deleteSkillGroup(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("skill_groups").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSkills();
}

export async function reorderSkillGroup(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("skill_groups")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("skill_groups").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("skill_groups").update({ order_index: a.order_index }).eq("id", b.id);
  revalidateSkills();
}

// --- Individual skills ---

export async function createSkill(groupId: string, name: string) {
  const supabase = await getAuthorizedAdminClient();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Skill name is required.");

  const { data: maxOrder } = await supabase
    .from("skills")
    .select("order_index")
    .eq("skill_group_id", groupId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase
    .from("skills")
    .insert({ skill_group_id: groupId, name: trimmed, order_index: (maxOrder?.order_index ?? -1) + 1 });
  if (error) throw new Error(error.message);
  revalidateSkills();
}

export async function updateSkillName(id: string, name: string) {
  const supabase = await getAuthorizedAdminClient();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Skill name is required.");

  const { error } = await supabase.from("skills").update({ name: trimmed }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSkills();
}

/** Recategorize — moves a skill to a different group, appended to the end of that group's order. */
export async function moveSkillToGroup(id: string, newGroupId: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: maxOrder } = await supabase
    .from("skills")
    .select("order_index")
    .eq("skill_group_id", newGroupId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase
    .from("skills")
    .update({ skill_group_id: newGroupId, order_index: (maxOrder?.order_index ?? -1) + 1 })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSkills();
}

export async function deleteSkill(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSkills();
}

export async function reorderSkill(id: string, groupId: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("skills")
    .select("id, order_index")
    .eq("skill_group_id", groupId)
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("skills").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("skills").update({ order_index: a.order_index }).eq("id", b.id);
  revalidateSkills();
}

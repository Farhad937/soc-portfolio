"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { slugify, ensureUniqueSlug } from "@/lib/slug";

export type ProjectFormState = { error: string | null };

function arrayFromCsv(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function fieldsFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? ""),
    difficulty: String(formData.get("difficulty") ?? "") || null,
    status: String(formData.get("status") ?? "") || null,
    category: String(formData.get("category") ?? "") || null,
    time_invested: String(formData.get("time_invested") ?? ""),
    tech: arrayFromCsv(formData.get("tech")),
    skills: arrayFromCsv(formData.get("skills")),
    overview: String(formData.get("overview") ?? ""),
    objective: String(formData.get("objective") ?? ""),
    environment: String(formData.get("environment") ?? ""),
    tools_used: arrayFromCsv(formData.get("tools_used")),
    challenges: String(formData.get("challenges") ?? ""),
    investigation: String(formData.get("investigation") ?? ""),
    findings: String(formData.get("findings") ?? ""),
    lessons_learned: String(formData.get("lessons_learned") ?? ""),
    future_improvements: String(formData.get("future_improvements") ?? ""),
    github_url: String(formData.get("github_url") ?? "") || null,
    live_url: String(formData.get("live_url") ?? "") || null,
    featured: formData.get("featured") === "on",
  };
}

/** Reused by both create and update — every mutation must pass through this. */
async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createProject(_prevState: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft"); // "draft" | "publish"

  if (!fields.title) return { error: "Title is required." };

  const manualSlug = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(manualSlug || fields.title);
  if (!baseSlug) return { error: "Could not generate a slug from that title — try adding a manual slug." };
  const slug = await ensureUniqueSlug(supabase, "projects", baseSlug);

  const { data: maxOrder } = await supabase
    .from("projects")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("projects").insert({
    ...fields,
    slug,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.title) return { error: "Title is required." };

  const manualSlug = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(manualSlug || fields.title);
  if (!baseSlug) return { error: "Could not generate a slug from that title — try adding a manual slug." };
  const slug = await ensureUniqueSlug(supabase, "projects", baseSlug, id);

  const { error } = await supabase
    .from("projects")
    .update({ ...fields, slug, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function duplicateProject(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, slug: oldSlug, created_at, updated_at, ...rest } = original;
  const newSlug = await ensureUniqueSlug(supabase, "projects", `${oldSlug}-copy`);

  const { data: maxOrder } = await supabase
    .from("projects")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("projects").insert({
    ...rest,
    title: `${original.title} (Copy)`,
    slug: newSlug,
    content_status: "draft", // duplicates never go live automatically
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/projects");
}

export async function setProjectStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("projects")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function reorderProject(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return; // already at an edge

  const a = rows[index];
  const b = rows[swapWith];

  await supabase.from("projects").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("projects").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/projects");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { slugify, ensureUniqueSlug, arrayFromCsv, arrayFromLines, referencesFromLines } from "@/lib/slug";

export type WriteupFormState = { error: string | null };

function fieldsFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "") || null,
    reading_time: String(formData.get("reading_time") ?? ""),
    difficulty: String(formData.get("difficulty") ?? "") || null,
    platform: String(formData.get("platform") ?? "") || null,
    date: String(formData.get("date") ?? "") || null,
    github_url: String(formData.get("github_url") ?? "") || null,
    summary: String(formData.get("summary") ?? ""),
    concept: String(formData.get("concept") ?? ""),
    key_takeaways: arrayFromLines(formData.get("key_takeaways")),
    tags: arrayFromCsv(formData.get("tags")),
    technologies: arrayFromCsv(formData.get("technologies")),
    references: referencesFromLines(formData.get("references")),
    featured: formData.get("featured") === "on",
  };
}

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createWriteup(_prevState: WriteupFormState, formData: FormData): Promise<WriteupFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft");

  if (!fields.title) return { error: "Title is required." };

  const manualSlug = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(manualSlug || fields.title);
  if (!baseSlug) return { error: "Could not generate a slug from that title — try adding a manual slug." };
  const slug = await ensureUniqueSlug(supabase, "writeups", baseSlug);

  const { data: maxOrder } = await supabase
    .from("writeups")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("writeups").insert({
    ...fields,
    slug,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/writeups");
  revalidatePath("/writeups");
  redirect("/admin/writeups");
}

export async function updateWriteup(
  id: string,
  _prevState: WriteupFormState,
  formData: FormData
): Promise<WriteupFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.title) return { error: "Title is required." };

  const manualSlug = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(manualSlug || fields.title);
  if (!baseSlug) return { error: "Could not generate a slug from that title — try adding a manual slug." };
  const slug = await ensureUniqueSlug(supabase, "writeups", baseSlug, id);

  const { error } = await supabase
    .from("writeups")
    .update({ ...fields, slug, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/writeups");
  revalidatePath(`/admin/writeups/${id}`);
  revalidatePath("/writeups");
  revalidatePath(`/writeups/${slug}`);
  redirect("/admin/writeups");
}

export async function deleteWriteup(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("writeups").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/writeups");
  revalidatePath("/writeups");
}

export async function duplicateWriteup(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("writeups")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, slug: oldSlug, created_at, updated_at, ...rest } = original;
  const newSlug = await ensureUniqueSlug(supabase, "writeups", `${oldSlug}-copy`);

  const { data: maxOrder } = await supabase
    .from("writeups")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("writeups").insert({
    ...rest,
    title: `${original.title} (Copy)`,
    slug: newSlug,
    content_status: "draft",
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/writeups");
}

export async function setWriteupStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("writeups")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/writeups");
  revalidatePath("/writeups");
}

export async function reorderWriteup(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("writeups")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];

  await supabase.from("writeups").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("writeups").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/writeups");
}

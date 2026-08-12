"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { arrayFromLines } from "@/lib/slug";

export type HomeLabItemFormState = { error: string | null };
export type HomeLabPageContentFormState = { error: string | null; success?: boolean };

function fieldsFromFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    status: String(formData.get("status") ?? "") || null,
    link: String(formData.get("link") ?? "") || null,
  };
}

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createHomeLabItem(
  _prevState: HomeLabItemFormState,
  formData: FormData
): Promise<HomeLabItemFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft");

  if (!fields.name) return { error: "Name is required." };

  const { data: maxOrder } = await supabase
    .from("home_lab_items")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("home_lab_items").insert({
    ...fields,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/homelab");
  revalidatePath("/homelab");
  redirect("/admin/homelab");
}

export async function updateHomeLabItem(
  id: string,
  _prevState: HomeLabItemFormState,
  formData: FormData
): Promise<HomeLabItemFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.name) return { error: "Name is required." };

  const { error } = await supabase
    .from("home_lab_items")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/homelab");
  revalidatePath(`/admin/homelab/${id}`);
  revalidatePath("/homelab");
  redirect("/admin/homelab");
}

export async function deleteHomeLabItem(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("home_lab_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/homelab");
  revalidatePath("/homelab");
}

export async function duplicateHomeLabItem(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("home_lab_items")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, created_at, updated_at, ...rest } = original;

  const { data: maxOrder } = await supabase
    .from("home_lab_items")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("home_lab_items").insert({
    ...rest,
    name: `${original.name} (Copy)`,
    content_status: "draft",
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/homelab");
}

export async function setHomeLabItemStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("home_lab_items")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/homelab");
  revalidatePath("/homelab");
}

export async function reorderHomeLabItem(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("home_lab_items")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("home_lab_items").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("home_lab_items").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/homelab");
  revalidatePath("/homelab");
}

export async function updateHomeLabPageContent(
  _prevState: HomeLabPageContentFormState,
  formData: FormData
): Promise<HomeLabPageContentFormState> {
  const supabase = await getAuthorizedAdminClient();

  const { error } = await supabase
    .from("home_lab_page_content")
    .update({
      hardware_description: String(formData.get("hardware_description") ?? "") || null,
      virtualization_description: String(formData.get("virtualization_description") ?? "") || null,
      network_diagram_note: String(formData.get("network_diagram_note") ?? "") || null,
      future_additions: arrayFromLines(formData.get("future_additions")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/homelab");
  revalidatePath("/homelab");
  return { error: null, success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

export type JourneyFormState = { error: string | null };

function fieldsFromFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
  };
}

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createJourneyEntry(
  _prevState: JourneyFormState,
  formData: FormData
): Promise<JourneyFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft");

  if (!fields.title) return { error: "Title is required." };

  const { data: maxOrder } = await supabase
    .from("timeline_entries")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("timeline_entries").insert({
    ...fields,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/journey");
  revalidatePath("/journey");
  redirect("/admin/journey");
}

export async function updateJourneyEntry(
  id: string,
  _prevState: JourneyFormState,
  formData: FormData
): Promise<JourneyFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.title) return { error: "Title is required." };

  const { error } = await supabase
    .from("timeline_entries")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/journey");
  revalidatePath(`/admin/journey/${id}`);
  revalidatePath("/journey");
  redirect("/admin/journey");
}

export async function deleteJourneyEntry(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("timeline_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/journey");
  revalidatePath("/journey");
}

export async function duplicateJourneyEntry(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("timeline_entries")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, created_at, updated_at, ...rest } = original;

  const { data: maxOrder } = await supabase
    .from("timeline_entries")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("timeline_entries").insert({
    ...rest,
    title: `${original.title} (Copy)`,
    content_status: "draft",
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/journey");
}

export async function setJourneyEntryStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("timeline_entries")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/journey");
  revalidatePath("/journey");
}

export async function reorderJourneyEntry(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("timeline_entries")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("timeline_entries").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("timeline_entries").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/journey");
  revalidatePath("/journey");
}

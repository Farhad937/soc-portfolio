"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { arrayFromLines } from "@/lib/slug";

export type EducationFormState = { error: string | null };

function fieldsFromFormData(formData: FormData) {
  const isCurrent = formData.get("is_current") === "on";
  return {
    institution: String(formData.get("institution") ?? "").trim(),
    degree: String(formData.get("degree") ?? "").trim(),
    field_of_study: String(formData.get("field_of_study") ?? "") || null,
    start_date: String(formData.get("start_date") ?? "") || null,
    // A current program has no end date by definition — clearing it
    // server-side too, not just trusting the form to leave it blank.
    end_date: isCurrent ? null : String(formData.get("end_date") ?? "") || null,
    is_current: isCurrent,
    description: String(formData.get("description") ?? ""),
    achievements: arrayFromLines(formData.get("achievements")),
  };
}

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createEducation(
  _prevState: EducationFormState,
  formData: FormData
): Promise<EducationFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft");

  if (!fields.institution) return { error: "Institution is required." };
  if (!fields.degree) return { error: "Degree is required." };

  const { data: maxOrder } = await supabase
    .from("education")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("education").insert({
    ...fields,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/education");
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function updateEducation(
  id: string,
  _prevState: EducationFormState,
  formData: FormData
): Promise<EducationFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.institution) return { error: "Institution is required." };
  if (!fields.degree) return { error: "Degree is required." };

  const { error } = await supabase
    .from("education")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/education");
  revalidatePath(`/admin/education/${id}`);
  revalidatePath("/about");
  redirect("/admin/education");
}

export async function deleteEducation(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/education");
  revalidatePath("/about");
}

export async function duplicateEducation(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("education")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, created_at, updated_at, ...rest } = original;

  const { data: maxOrder } = await supabase
    .from("education")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("education").insert({
    ...rest,
    institution: `${original.institution} (Copy)`,
    content_status: "draft",
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/education");
}

export async function setEducationStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("education")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/education");
  revalidatePath("/about");
}

export async function reorderEducation(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("education")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("education").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("education").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/education");
  revalidatePath("/about");
}

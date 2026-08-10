"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { arrayFromCsv, arrayFromLines } from "@/lib/slug";

export type ExperienceFormState = { error: string | null };

function fieldsFromFormData(formData: FormData) {
  const isCurrent = formData.get("is_current") === "on";
  return {
    company: String(formData.get("company") ?? "").trim(),
    position: String(formData.get("position") ?? "").trim(),
    location: String(formData.get("location") ?? "") || null,
    start_date: String(formData.get("start_date") ?? "") || null,
    // A current position has no end date by definition — clearing it
    // server-side too, not just trusting the form to leave it blank.
    end_date: isCurrent ? null : String(formData.get("end_date") ?? "") || null,
    is_current: isCurrent,
    description: String(formData.get("description") ?? ""),
    achievements: arrayFromLines(formData.get("achievements")),
    technologies: arrayFromCsv(formData.get("technologies")),
  };
}

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createExperience(
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft");

  if (!fields.company) return { error: "Company is required." };
  if (!fields.position) return { error: "Position is required." };

  const { data: maxOrder } = await supabase
    .from("experience")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("experience").insert({
    ...fields,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/experience");
  revalidatePath("/about");
  redirect("/admin/experience");
}

export async function updateExperience(
  id: string,
  _prevState: ExperienceFormState,
  formData: FormData
): Promise<ExperienceFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.company) return { error: "Company is required." };
  if (!fields.position) return { error: "Position is required." };

  const { error } = await supabase
    .from("experience")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/experience");
  revalidatePath(`/admin/experience/${id}`);
  revalidatePath("/about");
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}

export async function duplicateExperience(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("experience")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, created_at, updated_at, ...rest } = original;

  const { data: maxOrder } = await supabase
    .from("experience")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("experience").insert({
    ...rest,
    company: `${original.company} (Copy)`,
    content_status: "draft",
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/experience");
}

export async function setExperienceStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("experience")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/experience");
  revalidatePath("/about");
}

export async function reorderExperience(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("experience")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("experience").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("experience").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/experience");
}

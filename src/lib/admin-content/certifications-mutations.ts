"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { arrayFromCsv } from "@/lib/slug";

export type CertificationFormState = { error: string | null };

function fieldsFromFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    issuer: String(formData.get("issuer") ?? "") || null,
    date: String(formData.get("date") ?? "") || null,
    status: String(formData.get("status") ?? "") || null,
    credential_id: String(formData.get("credential_id") ?? "") || null,
    credential_url: String(formData.get("credential_url") ?? "") || null,
    description: String(formData.get("description") ?? ""),
    skills: arrayFromCsv(formData.get("skills")),
    logo: String(formData.get("logo") ?? "") || null,
  };
}

async function getAuthorizedAdminClient() {
  await requireAdmin();
  return getSupabaseAdminClient();
}

export async function createCertification(
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);
  const intent = String(formData.get("intent") ?? "draft");

  if (!fields.name) return { error: "Name is required." };
  if (!fields.status) return { error: "Status is required." };

  const { data: maxOrder } = await supabase
    .from("certifications")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("certifications").insert({
    ...fields,
    order_index: (maxOrder?.order_index ?? -1) + 1,
    content_status: intent === "publish" ? "published" : "draft",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function updateCertification(
  id: string,
  _prevState: CertificationFormState,
  formData: FormData
): Promise<CertificationFormState> {
  const supabase = await getAuthorizedAdminClient();
  const fields = fieldsFromFormData(formData);

  if (!fields.name) return { error: "Name is required." };
  if (!fields.status) return { error: "Status is required." };

  const { error } = await supabase
    .from("certifications")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/certifications");
  revalidatePath(`/admin/certifications/${id}`);
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function deleteCertification(id: string) {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
}

export async function duplicateCertification(id: string) {
  const supabase = await getAuthorizedAdminClient();

  const { data: original, error: fetchError } = await supabase
    .from("certifications")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _oldId, created_at, updated_at, ...rest } = original;

  const { data: maxOrder } = await supabase
    .from("certifications")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await supabase.from("certifications").insert({
    ...rest,
    name: `${original.name} (Copy)`,
    content_status: "draft",
    order_index: (maxOrder?.order_index ?? -1) + 1,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath("/admin/certifications");
}

export async function setCertificationStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await getAuthorizedAdminClient();
  const { error } = await supabase
    .from("certifications")
    .update({ content_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
}

export async function reorderCertification(id: string, direction: "up" | "down") {
  const supabase = await getAuthorizedAdminClient();

  const { data: rows, error } = await supabase
    .from("certifications")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);

  const index = rows.findIndex((r: any) => r.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];
  await supabase.from("certifications").update({ order_index: b.order_index }).eq("id", a.id);
  await supabase.from("certifications").update({ order_index: a.order_index }).eq("id", b.id);

  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
}

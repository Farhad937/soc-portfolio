"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { arrayFromLines } from "@/lib/slug";

export type AboutContentFormState = { error: string | null; success?: boolean };

export async function updateAboutContent(
  _prevState: AboutContentFormState,
  formData: FormData
): Promise<AboutContentFormState> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("about_page_content")
    .update({
      profile_image: String(formData.get("profile_image") ?? "") || null,
      engineering_background: String(formData.get("engineering_background") ?? "") || null,
      security_transition: String(formData.get("security_transition") ?? "") || null,
      defensive_security_reason: String(formData.get("defensive_security_reason") ?? "") || null,
      current_focus: arrayFromLines(formData.get("current_focus")),
      career_goal: String(formData.get("career_goal") ?? "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { error: null, success: true };
}

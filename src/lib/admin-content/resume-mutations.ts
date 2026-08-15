"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { uploadMediaFile, deleteMediaFile } from "@/lib/supabase/storage";

export type ResumeFormState = { error: string | null; success?: boolean };

/**
 * Extracts the storage path from a public URL by finding the bucket
 * segment — needed because site_settings stores the public URL, not
 * the raw path, but deleteMediaFile needs the path.
 */
function pathFromPublicUrl(url: string): string | null {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export async function uploadResume(_prevState: ResumeFormState, formData: FormData): Promise<ResumeFormState> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF file first." };
  }

  const supabase = getSupabaseAdminClient();

  // Read the currently-configured resume so the old file can be
  // cleaned up after the new one is confirmed uploaded — never delete
  // before the replacement is known to have succeeded.
  const { data: current } = await supabase.from("site_settings").select("resume_url").eq("id", 1).maybeSingle();

  let uploaded;
  try {
    uploaded = await uploadMediaFile(file, "resume", "pdf");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      resume_url: uploaded.publicUrl,
      resume_filename: file.name,
      resume_uploaded_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  // Best-effort cleanup of the previous file — if this fails, the new
  // resume is already live and correct, so it's logged, not surfaced
  // as a user-facing error.
  const oldPath = current?.resume_url ? pathFromPublicUrl(current.resume_url) : null;
  if (oldPath) {
    try {
      await deleteMediaFile(oldPath);
    } catch (err) {
      console.warn("[uploadResume] Failed to delete previous resume file:", err);
    }
  }

  revalidatePath("/admin/resume");
  revalidatePath("/resume");
  return { error: null, success: true };
}

export async function removeResume() {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const { data: current } = await supabase.from("site_settings").select("resume_url").eq("id", 1).maybeSingle();

  const { error } = await supabase
    .from("site_settings")
    .update({ resume_url: null, resume_filename: null, resume_uploaded_at: null })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  const oldPath = current?.resume_url ? pathFromPublicUrl(current.resume_url) : null;
  if (oldPath) {
    try {
      await deleteMediaFile(oldPath);
    } catch (err) {
      console.warn("[removeResume] Failed to delete resume file from storage:", err);
    }
  }

  revalidatePath("/admin/resume");
  revalidatePath("/resume");
}

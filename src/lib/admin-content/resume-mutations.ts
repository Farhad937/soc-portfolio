"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import {
  assertCompletedMediaPath,
  createMediaUploadAuthorization,
  deleteMediaFile,
  ensureMediaFileExists,
  getMediaPublicUrl,
  type MediaUploadAuthorization,
} from "@/lib/supabase/storage";

export type ResumeFormState = { error: string | null; success?: boolean; upload?: MediaUploadAuthorization };

function pathFromPublicUrl(url: string): string | null {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

/** Authorizes the browser to upload one resume PDF directly to Storage. */
export async function beginResumeUpload({
  fileName,
  fileSize,
  fileType,
}: {
  fileName: string;
  fileSize: number;
  fileType: string;
}): Promise<ResumeFormState> {
  try {
    const upload = await createMediaUploadAuthorization({
      fileName,
      fileSize,
      fileType,
      folder: "resume",
      kind: "pdf",
    });
    return { error: null, upload };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not authorize upload." };
  }
}

/** Stores the uploaded resume URL and cleans up the prior resume only after the replacement succeeds. */
export async function completeResumeUpload(path: string, filename: string): Promise<ResumeFormState> {
  try {
    await requireAdmin();
    assertCompletedMediaPath(path, "resume");
    await ensureMediaFileExists(path, "resume");
    if (!filename) return { error: "Choose a PDF file first." };

    const supabase = getSupabaseAdminClient();
    const { data: current } = await supabase.from("site_settings").select("resume_url").eq("id", 1).maybeSingle();
    const { error } = await supabase
      .from("site_settings")
      .update({
        resume_url: getMediaPublicUrl(path),
        resume_filename: filename,
        resume_uploaded_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) return { error: error.message };

    const oldPath = current?.resume_url ? pathFromPublicUrl(current.resume_url) : null;
    if (oldPath) {
      try {
        await deleteMediaFile(oldPath);
      } catch (err) {
        console.warn("[completeResumeUpload] Failed to delete previous resume file:", err);
      }
    }

    revalidatePath("/admin/resume");
    revalidatePath("/resume");
    return { error: null, success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
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

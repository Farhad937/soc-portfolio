"use server";

import { revalidatePath } from "next/cache";
import { uploadMediaFile, deleteMediaFile } from "@/lib/supabase/storage";

export type MediaUploadState = { error: string | null; publicUrl?: string };

/**
 * Generic upload action — used by the Media Library page directly, and
 * reused inline by the Project/Certification/Resume forms so upload
 * logic exists in exactly one place rather than being duplicated per
 * content type.
 */
export async function uploadMedia(_prevState: MediaUploadState, formData: FormData): Promise<MediaUploadState> {
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "uploads");
  const kind = String(formData.get("kind") ?? "image") as "image" | "pdf";

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file first." };
  }

  try {
    const { publicUrl } = await uploadMediaFile(file, folder, kind);
    revalidatePath("/admin/media");
    return { error: null, publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}

export async function deleteMedia(path: string) {
  await deleteMediaFile(path);
  revalidatePath("/admin/media");
}

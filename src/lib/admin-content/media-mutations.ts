"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth-server";
import {
  createMediaUploadAuthorization,
  deleteMediaFile,
  ensureMediaFileExists,
  getMediaPublicUrl,
  type MediaUploadAuthorization,
} from "@/lib/supabase/storage";

export type MediaUploadState = { error: string | null; publicUrl?: string; upload?: MediaUploadAuthorization };

/** Authorizes one direct-to-Storage image upload; the file itself never enters this action. */
export async function beginMediaUpload({
  fileName,
  fileSize,
  fileType,
  folder,
}: {
  fileName: string;
  fileSize: number;
  fileType: string;
  folder: string;
}): Promise<MediaUploadState> {
  try {
    const upload = await createMediaUploadAuthorization({ fileName, fileSize, fileType, folder, kind: "image" });
    return { error: null, upload };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not authorize upload." };
  }
}

/** Revalidates the Media Library after the browser confirms a signed upload. */
export async function completeMediaUpload(path: string): Promise<MediaUploadState> {
  try {
    await requireAdmin();
    await ensureMediaFileExists(path);
    const publicUrl = getMediaPublicUrl(path);
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

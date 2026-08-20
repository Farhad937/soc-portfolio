"use client";

import { getSupabaseAuthBrowserClient } from "@/lib/supabase/auth-client";

export type SignedMediaUpload = { path: string; token: string; publicUrl: string };

/** Sends bytes directly from the browser to a path-scoped Supabase upload URL. */
export async function uploadSignedMediaFile(file: File, upload: SignedMediaUpload): Promise<void> {
  const { error } = await getSupabaseAuthBrowserClient()
    .storage
    .from("media")
    .uploadToSignedUrl(upload.path, upload.token, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
}

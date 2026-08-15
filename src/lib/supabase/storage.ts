import "server-only";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

const BUCKET = "media";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB

function sanitizeFilename(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const ext = lastDot >= 0 ? name.slice(lastDot) : "";
  const base = (lastDot >= 0 ? name.slice(0, lastDot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return `${Date.now()}-${base || "file"}${ext.toLowerCase()}`;
}

/**
 * Uploads a file to the `media` bucket under `folder` (e.g. "uploads",
 * "projects/<id>", "certifications/<id>", "resume"). `folder` is never
 * taken from raw user input beyond a fixed, code-defined set of
 * callers — this function itself doesn't validate the folder string,
 * so callers must pass a known-safe value, not something typed by an
 * admin into a text field. Filenames ARE sanitized here, since those
 * come directly from the uploaded file.
 */
export async function uploadMediaFile(
  file: File,
  folder: string,
  kind: "image" | "pdf" = "image"
): Promise<{ path: string; publicUrl: string }> {
  await requireAdmin();

  if (kind === "image") {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(`Unsupported image type: ${file.type || "unknown"}. Allowed: JPEG, PNG, WebP, GIF.`);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`Image too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB).`);
    }
  } else {
    if (file.type !== "application/pdf") {
      throw new Error(`Unsupported file type: ${file.type || "unknown"}. Only PDF is allowed here.`);
    }
    if (file.size > MAX_PDF_BYTES) {
      throw new Error(`File too large (max ${MAX_PDF_BYTES / (1024 * 1024)}MB).`);
    }
  }

  const supabase = getSupabaseAdminClient();
  const path = `${folder}/${sanitizeFilename(file.name)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function deleteMediaFile(path: string): Promise<void> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export type MediaFile = {
  name: string;
  path: string;
  publicUrl: string;
  size: number | null;
  updatedAt: string | null;
};

/** Lists files directly from Storage — no separate DB table tracking uploads, so there's nothing that can drift out of sync with what's actually in the bucket. */
export async function listMediaFiles(folder = "uploads"): Promise<MediaFile[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(`Listing media failed: ${error.message}`);

  return (data ?? [])
    .filter((f) => f.id !== null) // Storage's list() includes a placeholder "folder" entry with id: null — skip it.
    .map((f) => {
      const path = `${folder}/${f.name}`;
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return {
        name: f.name,
        path,
        publicUrl: urlData.publicUrl,
        size: f.metadata?.size ?? null,
        updatedAt: f.updated_at ?? null,
      };
    });
}

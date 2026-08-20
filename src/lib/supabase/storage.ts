import "server-only";
import { requireAdmin } from "@/lib/supabase/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";

const BUCKET = "media";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;
const ALLOWED_FOLDERS = ["uploads", "projects", "certifications", "resume"] as const;

export type MediaUploadKind = "image" | "pdf";
export type MediaFolder = (typeof ALLOWED_FOLDERS)[number];
export type MediaUploadAuthorization = {
  path: string;
  token: string;
  publicUrl: string;
};

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

function isMediaFolder(folder: string): folder is MediaFolder {
  return (ALLOWED_FOLDERS as readonly string[]).includes(folder);
}

function validateMediaUpload(fileName: string, fileSize: number, fileType: string, kind: MediaUploadKind) {
  if (!fileName || fileSize <= 0) throw new Error("Choose a file first.");

  if (kind === "image") {
    if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
      throw new Error(`Unsupported image type: ${fileType || "unknown"}. Allowed: JPEG, PNG, WebP, GIF.`);
    }
    if (fileSize > MAX_IMAGE_BYTES) throw new Error("Image too large (max 10MB).");
    return;
  }

  if (fileType !== "application/pdf") {
    throw new Error(`Unsupported file type: ${fileType || "unknown"}. Only PDF is allowed here.`);
  }
  if (fileSize > MAX_PDF_BYTES) throw new Error("File too large (max 10MB).");
}

function assertMediaPath(path: string, expectedFolder?: MediaFolder) {
  const [folder, filename, ...rest] = path.split("/");
  if (!folder || !filename || rest.length > 0 || !isMediaFolder(folder) || (expectedFolder && folder !== expectedFolder)) {
    throw new Error("Invalid media path.");
  }
}

/** Creates a path-scoped upload token after validating the admin session and file metadata. */
export async function createMediaUploadAuthorization({
  fileName,
  fileSize,
  fileType,
  folder,
  kind,
}: {
  fileName: string;
  fileSize: number;
  fileType: string;
  folder: string;
  kind: MediaUploadKind;
}): Promise<MediaUploadAuthorization> {
  await requireAdmin();
  if (!isMediaFolder(folder)) throw new Error("Invalid media folder.");
  validateMediaUpload(fileName, fileSize, fileType, kind);

  const path = `${folder}/${sanitizeFilename(fileName)}`;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: false });
  if (error || !data) throw new Error(`Could not authorize upload: ${error?.message ?? "Unknown error"}`);

  return { path: data.path, token: data.token, publicUrl: getMediaPublicUrl(path) };
}

export function getMediaPublicUrl(path: string): string {
  assertMediaPath(path);
  const { data } = getSupabaseAdminClient().storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function assertCompletedMediaPath(path: string, folder?: MediaFolder) {
  assertMediaPath(path, folder);
}

/** Confirms that a signed upload completed before exposing or persisting its URL. */
export async function ensureMediaFileExists(path: string, expectedFolder?: MediaFolder): Promise<void> {
  assertMediaPath(path, expectedFolder);
  const [folder, filename] = path.split("/") as [MediaFolder, string];
  const { data, error } = await getSupabaseAdminClient().storage.from(BUCKET).list(folder, { search: filename });
  if (error || !data?.some((file) => file.id !== null && file.name === filename)) {
    throw new Error("Upload could not be confirmed.");
  }
}

export async function deleteMediaFile(path: string): Promise<void> {
  await requireAdmin();
  assertMediaPath(path);
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

/** Lists files directly from Storage: there is no separate DB media table to drift out of sync. */
export async function listMediaFiles(folder: MediaFolder = "uploads"): Promise<MediaFile[]> {
  await requireAdmin();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) throw new Error(`Listing media failed: ${error.message}`);

  return (data ?? [])
    .filter((f) => f.id !== null)
    .map((f) => {
      const path = `${folder}/${f.name}`;
      return {
        name: f.name,
        path,
        publicUrl: getMediaPublicUrl(path),
        size: f.metadata?.size ?? null,
        updatedAt: f.updated_at ?? null,
      };
    });
}

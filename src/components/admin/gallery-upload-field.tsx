"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { beginMediaUpload, completeMediaUpload } from "@/lib/admin-content/media-mutations";
import { uploadSignedMediaFile } from "@/lib/supabase/signed-media-upload-client";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export default function GalleryUploadField({
  name,
  folder,
  initialUrls,
  label,
}: {
  name: string;
  folder: string;
  initialUrls: string[];
  label: string;
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image too large (max 10MB).");
      e.target.value = "";
      return;
    }

    startTransition(async () => {
      try {
        const authorization = await beginMediaUpload({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          folder,
        });
        if (authorization.error || !authorization.upload) throw new Error(authorization.error ?? "Could not authorize upload.");
        await uploadSignedMediaFile(file, authorization.upload);
        const result = await completeMediaUpload(authorization.upload.path);
        const publicUrl = result.publicUrl;
        if (result.error || !publicUrl) throw new Error(result.error ?? "Upload failed.");
        setUrls((prev) => [...prev, publicUrl]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">{label}</label>
      {/* One URL per line — same convention as every other array field in this project (Achievements, Tags, etc.), parsed server-side with arrayFromLines. */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <div key={u} className="relative">
              <img src={u} alt="" className="h-16 w-16 rounded-md border border-border-strong object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-danger p-0.5 text-white"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="btn-secondary w-fit cursor-pointer text-sm">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isPending ? "Uploading..." : "Add image"}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={isPending}
          className="hidden"
        />
      </label>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

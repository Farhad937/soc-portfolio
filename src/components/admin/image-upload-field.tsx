"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadMedia } from "@/lib/admin-content/media-mutations";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/**
 * Uploads directly on file selection (no separate "Upload" button) and
 * writes the resulting public URL into a hidden input with `name`, so
 * this drops into any existing form and the URL travels along with
 * the rest of that form's normal submission — no separate save step.
 */
export default function ImageUploadField({
  name,
  folder,
  initialUrl,
  label,
}: {
  name: string;
  folder: string;
  initialUrl?: string | null;
  label: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("kind", "image");

    startTransition(async () => {
      try {
        const result = await uploadMedia({ error: null }, formData);
        if (result?.error) {
          setError(result.error);
        } else if (result?.publicUrl) {
          setUrl(result.publicUrl);
        } else {
          setError("Upload failed. Please try again.");
        }
      } catch {
        setError("Upload failed. Please try again.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="mb-2 flex items-center gap-3">
          <img src={url} alt="" className="h-16 w-16 rounded-md border border-border-strong object-cover" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="flex items-center gap-1 text-xs text-text-faint hover:text-danger"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      )}

      <label className="btn-secondary w-fit cursor-pointer text-sm">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isPending ? "Uploading..." : url ? "Replace image" : "Upload image"}
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

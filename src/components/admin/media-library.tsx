"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Copy, Trash2, Upload, FileIcon } from "lucide-react";
import { beginMediaUpload, completeMediaUpload, deleteMedia, type MediaUploadState } from "@/lib/admin-content/media-mutations";
import { uploadSignedMediaFile } from "@/lib/supabase/signed-media-upload-client";
import type { MediaFile } from "@/lib/supabase/storage";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export default function MediaLibrary({ initialFiles }: { initialFiles: MediaFile[] }) {
  const router = useRouter();
  const [files, setFiles] = useState(initialFiles);
  const [uploadState, setUploadState] = useState<MediaUploadState>({ error: null });
  const [isPending, startTransition] = useTransition();
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  function handleDelete(path: string) {
    if (!confirm("Delete this file permanently? Anything on the site still referencing it will break.")) return;
    startTransition(async () => {
      await deleteMedia(path);
      setFiles((prev) => prev.filter((f) => f.path !== path));
    });
  }

  function handleCopy(url: string, path: string) {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1500);
  }

  function handleUploadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setUploadState({ error: "Choose a file first." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadState({ error: "Image too large (max 10MB)." });
      return;
    }

    setUploadState({ error: null });
    startTransition(async () => {
      try {
        const authorization = await beginMediaUpload({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          folder: "uploads",
        });
        if (authorization.error || !authorization.upload) throw new Error(authorization.error ?? "Could not authorize upload.");
        await uploadSignedMediaFile(file, authorization.upload);
        const result = await completeMediaUpload(authorization.upload.path);
        if (result.error || !result.publicUrl) throw new Error(result.error ?? "Upload failed.");
        setUploadState(result);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh();
      } catch (err) {
        setUploadState({ error: err instanceof Error ? err.message : "Upload failed. Please try again." });
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUploadSubmit} className="card p-5">
        {uploadState.error && (
          <div className="mb-3 flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {uploadState.error}
          </div>
        )}
        {uploadState.publicUrl && (
          <div className="mb-3 flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Uploaded.
            <button type="button" onClick={() => handleCopy(uploadState.publicUrl!, "just-uploaded")} className="ml-1 underline">
              copy URL
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            className="flex-1 text-sm text-text file:mr-3 file:rounded-md file:border file:border-border-strong file:bg-bg-surface file:px-3 file:py-1.5 file:text-sm file:text-text"
          />
          <button type="submit" disabled={isPending} className="btn-primary shrink-0 disabled:opacity-60">
            {isPending ? "Uploading..." : <><Upload className="h-4 w-4" /> Upload</>}
          </button>
        </div>
        <p className="mt-2 text-xs text-text-faint">JPEG, PNG, WebP, or GIF. Max 10MB.</p>
      </form>

      {files.length === 0 ? (
        <div className="card p-10 text-center text-text-faint">No files uploaded yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div key={file.path} className="card overflow-hidden">
              <div className="flex aspect-video items-center justify-center bg-bg-raised">
                {/\.(jpe?g|png|webp|gif)$/i.test(file.name) ? (
                  <img src={file.publicUrl} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                  <FileIcon className="h-8 w-8 text-text-faint" />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-text" title={file.name}>{file.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-text-faint">
                  {file.size ? `${(file.size / 1024).toFixed(0)} KB` : ""}
                  {file.updatedAt && ` · ${new Date(file.updatedAt).toLocaleDateString()}`}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => handleCopy(file.publicUrl, file.path)} className="flex items-center gap-1 rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-accent" title="Copy public URL">
                    <Copy className="h-3.5 w-3.5" />
                    {copiedPath === file.path && <span className="text-[10px] text-success">Copied</span>}
                  </button>
                  <button onClick={() => handleDelete(file.path)} disabled={isPending} className="rounded p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger disabled:opacity-40" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

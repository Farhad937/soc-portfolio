"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, FileText, Trash2, Upload } from "lucide-react";
import { beginResumeUpload, completeResumeUpload, removeResume, type ResumeFormState } from "@/lib/admin-content/resume-mutations";
import { uploadSignedMediaFile } from "@/lib/supabase/signed-media-upload-client";

const MAX_PDF_BYTES = 10 * 1024 * 1024;

export default function ResumeManager({
  currentUrl,
  currentFilename,
  currentUploadedAt,
}: {
  currentUrl: string | null;
  currentFilename: string | null;
  currentUploadedAt: string | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<ResumeFormState>({ error: null });
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleRemove() {
    if (!confirm("Remove the current resume? The public /resume page will show an empty state until a new one is uploaded.")) return;
    startTransition(async () => {
      await removeResume();
      router.refresh();
    });
  }

  function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setState({ error: "Choose a PDF file first." });
      return;
    }
    if (file.type !== "application/pdf") {
      setState({ error: "Unsupported file type. Only PDF is allowed here." });
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setState({ error: "File too large (max 10MB)." });
      return;
    }

    setState({ error: null });
    startTransition(async () => {
      try {
        const authorization = await beginResumeUpload({ fileName: file.name, fileSize: file.size, fileType: file.type });
        if (authorization.error || !authorization.upload) throw new Error(authorization.error ?? "Could not authorize upload.");
        await uploadSignedMediaFile(file, authorization.upload);
        const result = await completeResumeUpload(authorization.upload.path, file.name);
        if (result.error) throw new Error(result.error);
        setState(result);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh();
      } catch (err) {
        setState({ error: err instanceof Error ? err.message : "Upload failed. Please try again." });
      }
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Resume updated. The public /resume page has been refreshed.
        </div>
      )}

      <div className="card p-5">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-faint">Current Resume</p>
        {currentUrl ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-accent" />
              <div>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text hover:text-accent">
                  {currentFilename ?? "resume.pdf"}
                </a>
                {currentUploadedAt && <p className="font-mono text-xs text-text-faint">Uploaded {new Date(currentUploadedAt).toLocaleDateString()}</p>}
              </div>
            </div>
            <button type="button" onClick={handleRemove} disabled={isPending} className="rounded p-2 text-text-faint hover:bg-danger/10 hover:text-danger disabled:opacity-40" title="Remove">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-text-faint">No resume uploaded yet. The public /resume page shows an empty state.</p>
        )}
      </div>

      <form onSubmit={handleUpload} className="card p-5">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-faint">{currentUrl ? "Replace Resume" : "Upload Resume"}</p>
        <input ref={fileInputRef} type="file" accept="application/pdf" required className="mb-4 w-full text-sm text-text file:mr-3 file:rounded-md file:border file:border-border-strong file:bg-bg-surface file:px-3 file:py-1.5 file:text-sm file:text-text" />
        <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
          {isPending ? "Uploading..." : <><Upload className="h-4 w-4" /> Upload PDF</>}
        </button>
      </form>
    </div>
  );
}

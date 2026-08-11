"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { JourneyFormState } from "@/lib/admin-content/journey-mutations";

type JourneyRow = Record<string, any> | null;

export default function JourneyForm({
  action,
  initial,
  mode,
}: {
  action: (state: JourneyFormState, formData: FormData) => Promise<JourneyFormState>;
  initial: JourneyRow;
  mode: "create" | "edit";
}) {
  const [state, formAction] = useFormState<JourneyFormState, FormData>(action, { error: null });

  const field = (name: string) => initial?.[name] ?? "";

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" name="date" defaultValue={field("date")} placeholder="e.g. 2026" />
        <Field label="Title" name="title" required defaultValue={field("title")} />
      </div>
      <TextArea label="Description" name="description" defaultValue={field("description")} rows={3} />

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButtons mode={mode} />
        <Link href="/admin/journey" className="text-sm text-text-muted hover:text-text">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function SubmitButtons({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  if (mode === "edit") {
    return (
      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Saving..." : "Save Changes"}
      </button>
    );
  }
  return (
    <>
      <button type="submit" name="intent" value="draft" disabled={pending} className="btn-secondary disabled:opacity-60">
        {pending ? "Saving..." : "Save as Draft"}
      </button>
      <button type="submit" name="intent" value="publish" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? "Saving..." : "Publish"}
      </button>
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent"
      />
    </div>
  );
}

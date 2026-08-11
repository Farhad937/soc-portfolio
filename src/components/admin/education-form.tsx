"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { EducationFormState } from "@/lib/admin-content/education-mutations";

type EducationRow = Record<string, any> | null;

export default function EducationForm({
  action,
  initial,
  mode,
}: {
  action: (state: EducationFormState, formData: FormData) => Promise<EducationFormState>;
  initial: EducationRow;
  mode: "create" | "edit";
}) {
  const [state, formAction] = useFormState<EducationFormState, FormData>(action, { error: null });
  const [isCurrent, setIsCurrent] = useState(!!initial?.is_current);

  const field = (name: string) => initial?.[name] ?? "";
  const linesField = (name: string) => (Array.isArray(initial?.[name]) ? initial[name].join("\n") : "");

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Institution" name="institution" required defaultValue={field("institution")} />
        <Field label="Degree" name="degree" required defaultValue={field("degree")} placeholder="e.g. B.S. Computer Science" />
      </div>
      <Field label="Field of Study" name="field_of_study" defaultValue={field("field_of_study")} />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date" name="start_date" defaultValue={field("start_date")} placeholder="e.g. Sep 2022" />
        <div>
          <Field
            label="End Date"
            name="end_date"
            defaultValue={field("end_date")}
            placeholder="e.g. Jun 2026"
            disabled={isCurrent}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          name="is_current"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="rounded border-border-strong"
        />
        Currently enrolled (displays as &quot;Present&quot; instead of an end date)
      </label>

      <TextArea label="Description" name="description" defaultValue={field("description")} rows={3} />
      <TextArea
        label="Achievements"
        name="achievements"
        defaultValue={linesField("achievements")}
        rows={4}
        hint="One achievement per line."
      />

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButtons mode={mode} />
        <Link href="/admin/education" className="text-sm text-text-muted hover:text-text">
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
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
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
        disabled={disabled}
        className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent disabled:opacity-40"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 3,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
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
      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
    </div>
  );
}

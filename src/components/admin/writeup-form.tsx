"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { WriteupFormState } from "@/lib/admin-content/writeups-mutations";

type WriteupRow = Record<string, any> | null;

export default function WriteupForm({
  action,
  initial,
  mode,
}: {
  action: (state: WriteupFormState, formData: FormData) => Promise<WriteupFormState>;
  initial: WriteupRow;
  mode: "create" | "edit";
}) {
  const [state, formAction] = useFormState<WriteupFormState, FormData>(action, { error: null });

  const field = (name: string) => initial?.[name] ?? "";
  const arrayField = (name: string) => (Array.isArray(initial?.[name]) ? initial[name].join(", ") : "");
  const linesField = (name: string) => (Array.isArray(initial?.[name]) ? initial[name].join("\n") : "");
  const referencesField = () =>
    Array.isArray(initial?.references)
      ? initial.references.map((r: any) => `${r.label} | ${r.url}`).join("\n")
      : "";

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <section className="space-y-4">
        <p className="log-divider">Basics</p>
        <Field label="Title" name="title" required defaultValue={field("title")} />
        <Field
          label="Slug"
          name="slug"
          defaultValue={field("slug")}
          placeholder="Leave blank to auto-generate from title"
          hint="Only edit this if you know what you're doing — changing it breaks the existing public URL."
        />
        <TextArea label="Summary" name="summary" defaultValue={field("summary")} rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" name="category" defaultValue={field("category")} placeholder="e.g. Windows, SOC, Threat Hunting" />
          <Select
            label="Difficulty"
            name="difficulty"
            defaultValue={field("difficulty")}
            options={["", "Beginner", "Intermediate", "Advanced"]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Reading Time" name="reading_time" defaultValue={field("reading_time")} placeholder="e.g. 7 min" />
          <Field label="Platform" name="platform" defaultValue={field("platform")} placeholder="e.g. TryHackMe, Self-Study" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" name="date" defaultValue={field("date")} placeholder="e.g. 2026" />
          <Field label="GitHub URL" name="github_url" defaultValue={field("github_url")} type="url" />
        </div>
        <Field label="Tags" name="tags" defaultValue={arrayField("tags")} placeholder="Comma-separated" />
        <Field
          label="Technologies"
          name="technologies"
          defaultValue={arrayField("technologies")}
          placeholder="Comma-separated"
        />
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" name="featured" defaultChecked={!!field("featured")} className="rounded border-border-strong" />
          Featured
        </label>
      </section>

      <section className="space-y-4">
        <p className="log-divider">Content</p>
        <TextArea label="Concept (main body)" name="concept" defaultValue={field("concept")} rows={8} />
        <TextArea
          label="Key Takeaways"
          name="key_takeaways"
          defaultValue={linesField("key_takeaways")}
          rows={4}
          hint="One takeaway per line."
        />
        <TextArea
          label="References"
          name="references"
          defaultValue={referencesField()}
          rows={3}
          hint='One per line, format: Label | https://url'
        />
      </section>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButtons mode={mode} />
        <Link href="/admin/writeups" className="text-sm text-text-muted hover:text-text">
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
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent"
      />
      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
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

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text focus:border-accent"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "—"}
          </option>
        ))}
      </select>
    </div>
  );
}

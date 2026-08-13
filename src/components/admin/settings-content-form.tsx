"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { SettingsContentFormState } from "@/lib/admin-content/site-settings-mutations";

export default function SettingsContentForm({
  action,
  initial,
}: {
  action: (state: SettingsContentFormState, formData: FormData) => Promise<SettingsContentFormState>;
  initial: Record<string, any> | null;
}) {
  const [state, formAction] = useFormState<SettingsContentFormState, FormData>(action, { error: null });
  const field = (name: string) => initial?.[name] ?? "";

  return (
    <form action={formAction} className="card max-w-xl space-y-5 p-5">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Saved. The site header, footer, Hero, and About page have been updated.
        </div>
      )}

      <Field label="Name" name="name" required defaultValue={field("name")} />
      <Field label="Role" name="role" required defaultValue={field("role")} />
      <TextArea label="Tagline" name="tagline" required defaultValue={field("tagline")} rows={2} hint="Used in the page's meta description, not shown on the Hero." />
      <Field label="Status text" name="status_text" required defaultValue={field("status_text")} hint="Shown in the header's live status ticker (e.g. MONITORING)." />

      <div className="grid grid-cols-3 gap-3">
        <Field label="Learning hours" name="learning_hours" type="number" defaultValue={field("learning_hours")} />
        <Field label="GitHub repos" name="github_repos" type="number" defaultValue={field("github_repos")} />
        <Field label="Blog articles" name="blog_articles" type="number" defaultValue={field("blog_articles")} />
      </div>

      <div className="border-t border-border pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? "Saving..." : "Save Settings"}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
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
  required,
  rows = 3,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent"
      />
      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
    </div>
  );
}

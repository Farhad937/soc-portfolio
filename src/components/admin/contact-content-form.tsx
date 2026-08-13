"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ContactContentFormState } from "@/lib/admin-content/site-settings-mutations";

export default function ContactContentForm({
  action,
  initial,
}: {
  action: (state: ContactContentFormState, formData: FormData) => Promise<ContactContentFormState>;
  initial: Record<string, any> | null;
}) {
  const [state, formAction] = useFormState<ContactContentFormState, FormData>(action, { error: null });
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
          Saved. The site header, footer, and Contact page have been updated.
        </div>
      )}

      <Field label="Email" name="email" type="email" required defaultValue={field("email")} />
      <Field label="Location" name="location" required defaultValue={field("location")} />
      <Field label="GitHub URL" name="github_url" type="url" defaultValue={field("github_url")} />
      <Field label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={field("linkedin_url")} />
      <Field label="TryHackMe URL" name="tryhackme_url" type="url" defaultValue={field("tryhackme_url")} />

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
      {pending ? "Saving..." : "Save Contact Info"}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
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
    </div>
  );
}

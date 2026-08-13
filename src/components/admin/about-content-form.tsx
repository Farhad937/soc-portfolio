"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { AboutContentFormState } from "@/lib/admin-content/about-mutations";

export default function AboutContentForm({
  action,
  initial,
}: {
  action: (state: AboutContentFormState, formData: FormData) => Promise<AboutContentFormState>;
  initial: Record<string, any> | null;
}) {
  const [state, formAction] = useFormState<AboutContentFormState, FormData>(action, { error: null });

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
      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Saved. The public /about page has been updated.
        </div>
      )}

      <TextArea
        label="Engineering Background"
        name="engineering_background"
        defaultValue={field("engineering_background")}
        rows={4}
      />
      <TextArea
        label="Transition to Security"
        name="security_transition"
        defaultValue={field("security_transition")}
        rows={4}
      />
      <TextArea
        label="Why Defensive Security"
        name="defensive_security_reason"
        defaultValue={field("defensive_security_reason")}
        rows={4}
      />
      <TextArea
        label="Current Focus"
        name="current_focus"
        defaultValue={linesField("current_focus")}
        rows={5}
        hint="One item per line. Order here is the order shown on the page — reorder by moving lines, add a line to add an item, delete a line to remove one."
      />
      <TextArea label="Career Goal" name="career_goal" defaultValue={field("career_goal")} rows={3} />

      <div className="border-t border-border pt-6">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? "Saving..." : "Save About Content"}
    </button>
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

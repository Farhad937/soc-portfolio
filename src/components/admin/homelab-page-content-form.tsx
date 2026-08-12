"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { HomeLabPageContentFormState } from "@/lib/admin-content/homelab-mutations";

export default function HomeLabPageContentForm({
  action,
  initial,
}: {
  action: (state: HomeLabPageContentFormState, formData: FormData) => Promise<HomeLabPageContentFormState>;
  initial: Record<string, any> | null;
}) {
  const [state, formAction] = useFormState<HomeLabPageContentFormState, FormData>(action, { error: null });

  const field = (name: string) => initial?.[name] ?? "";
  const linesField = (name: string) => (Array.isArray(initial?.[name]) ? initial[name].join("\n") : "");

  return (
    <details className="card mb-8 p-5" open>
      <summary className="cursor-pointer font-mono text-xs uppercase tracking-wide text-accent">
        Page Content — Hardware, Virtualization, Network Diagram, Future Additions
      </summary>

      <form action={formAction} className="mt-5 space-y-5">
        {state.error && (
          <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Saved. The public /homelab page has been updated.
          </div>
        )}

        <TextArea
          label="Hardware"
          name="hardware_description"
          defaultValue={field("hardware_description")}
          rows={2}
        />
        <TextArea
          label="Virtualization"
          name="virtualization_description"
          defaultValue={field("virtualization_description")}
          rows={2}
        />
        <TextArea
          label="Network Diagram Note"
          name="network_diagram_note"
          defaultValue={field("network_diagram_note")}
          rows={2}
          hint="Text shown inside the diagram placeholder box. This phase doesn't support uploading an actual diagram image — that's Media Library, a later phase."
        />
        <TextArea
          label="Future Additions"
          name="future_additions"
          defaultValue={linesField("future_additions")}
          rows={4}
          hint="One item per line."
        />

        <SubmitButton />
      </form>
    </details>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? "Saving..." : "Save Page Content"}
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

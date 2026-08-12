"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { HeroContentFormState } from "@/lib/admin-content/site-settings-mutations";

export default function HeroContentForm({
  action,
  initial,
}: {
  action: (state: HeroContentFormState, formData: FormData) => Promise<HeroContentFormState>;
  initial: Record<string, any> | null;
}) {
  const [state, formAction] = useFormState<HeroContentFormState, FormData>(action, { error: null });

  const field = (name: string) => initial?.[name] ?? "";
  const csvField = (name: string) => (Array.isArray(initial?.[name]) ? initial[name].join(", ") : "");

  return (
    <form action={formAction} className="card space-y-5 p-5">
      {state.error && (
        <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Saved. The homepage has been updated.
        </div>
      )}

      <Field
        label="Kicker"
        name="hero_kicker"
        required
        defaultValue={field("hero_kicker")}
        hint={'The small line above the headline (e.g. "> whoami").'}
      />

      <TextArea
        label="Description"
        name="hero_description"
        required
        defaultValue={field("hero_description")}
        rows={3}
        hint={'Rendered directly after "{Role} " — write it to continue that sentence, e.g. "with a background in..."'}
      />

      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-faint">Buttons</p>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="grid grid-cols-2 gap-3 rounded-md border border-border-strong p-3">
              <Field
                label={`Button ${n} Label`}
                name={`hero_button_${n}_label`}
                required
                defaultValue={field(`hero_button_${n}_label`)}
              />
              <Field
                label={`Button ${n} URL`}
                name={`hero_button_${n}_url`}
                required
                defaultValue={field(`hero_button_${n}_url`)}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-text-faint">
          Each button keeps its existing icon and position — only the label and destination are editable.
        </p>
      </div>

      <Field
        label="Currently Studying tags"
        name="currently_studying"
        defaultValue={csvField("currently_studying")}
        placeholder="Comma-separated"
      />

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
      {pending ? "Saving..." : "Save Hero Content"}
    </button>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
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
        type="text"
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

"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { ProjectFormState } from "@/lib/admin-content/projects-mutations";
import ImageUploadField from "@/components/admin/image-upload-field";
import GalleryUploadField from "@/components/admin/gallery-upload-field";
import RichTextEditor from "@/components/admin/rich-text-editor";

type ProjectRow = Record<string, any> | null;

export default function ProjectForm({
  action,
  initial,
  mode,
}: {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initial: ProjectRow;
  mode: "create" | "edit";
}) {
  const [state, formAction] = useFormState<ProjectFormState, FormData>(action, { error: null });

  const field = (name: string) => initial?.[name] ?? "";
  const arrayField = (name: string) => (Array.isArray(initial?.[name]) ? initial[name].join(", ") : "");

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
          <Select
            label="Difficulty"
            name="difficulty"
            defaultValue={field("difficulty")}
            options={["", "Beginner", "Intermediate", "Advanced"]}
          />
          <Select
            label="Status"
            name="status"
            defaultValue={field("status")}
            options={["", "Planned", "In Progress", "Complete"]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" name="category" defaultValue={field("category")} />
          <Field label="Time Invested" name="time_invested" defaultValue={field("time_invested")} placeholder="e.g. 12 hrs" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="GitHub URL" name="github_url" defaultValue={field("github_url")} type="url" />
          <Field label="Live URL" name="live_url" defaultValue={field("live_url")} type="url" />
        </div>
        <Field
          label="Technologies"
          name="tech"
          defaultValue={arrayField("tech")}
          placeholder="Comma-separated, e.g. Splunk, Sysmon, PowerShell"
        />
        <Field
          label="Skills Demonstrated"
          name="skills"
          defaultValue={arrayField("skills")}
          placeholder="Comma-separated"
        />
        <label className="flex items-center gap-2 text-sm text-text-muted">
          <input type="checkbox" name="featured" defaultChecked={!!field("featured")} className="rounded border-border-strong" />
          Featured
        </label>
        <ImageUploadField
          name="featured_image"
          folder="projects"
          initialUrl={field("featured_image")}
          label="Featured Image"
        />
        <GalleryUploadField
          name="gallery"
          folder="projects"
          initialUrls={Array.isArray(initial?.gallery) ? initial.gallery : []}
          label="Gallery"
        />
      </section>

      <section className="space-y-4">
        <p className="log-divider">Project Page Sections</p>
        <RichTextEditor label="Overview" name="overview" defaultValue={field("overview")} rows={4} />
        <TextArea label="Objective" name="objective" defaultValue={field("objective")} rows={2} />
        <TextArea label="Environment" name="environment" defaultValue={field("environment")} rows={2} />
        <Field
          label="Tools Used"
          name="tools_used"
          defaultValue={arrayField("tools_used")}
          placeholder="Comma-separated"
        />
        <TextArea label="Challenges" name="challenges" defaultValue={field("challenges")} rows={3} />
        <RichTextEditor label="Investigation" name="investigation" defaultValue={field("investigation")} rows={4} />
        <RichTextEditor label="Findings" name="findings" defaultValue={field("findings")} rows={4} />
        <RichTextEditor label="Lessons Learned" name="lessons_learned" defaultValue={field("lessons_learned")} rows={4} />
        <TextArea label="Future Improvements" name="future_improvements" defaultValue={field("future_improvements")} rows={2} />
      </section>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButtons mode={mode} />
        <Link href="/admin/projects" className="text-sm text-text-muted hover:text-text">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function SubmitButtons({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();

  if (mode === "edit") {
    // Editing only ever saves field changes. Publish/Unpublish/Archive
    // are separate, explicit one-click actions elsewhere on this page —
    // saving an edit should never silently flip publish status.
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

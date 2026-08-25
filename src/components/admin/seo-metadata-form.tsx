"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import ImageUploadField from "@/components/admin/image-upload-field";
import { seoRoutes, type SeoRoute } from "@/lib/seo-routes";
import type { SeoMetadataRecord } from "@/lib/content/seo";
import { saveSeoMetadata, type SeoMetadataFormState } from "@/lib/admin-content/seo-mutations";

export default function SeoMetadataForm({ records }: { records: SeoMetadataRecord[] }) {
  const [route, setRoute] = useState<SeoRoute>("/");
  const record = records.find((item) => item.route === route) ?? null;

  return (
    <div className="card max-w-3xl p-6">
      <div className="mb-6">
        <label htmlFor="seo-route" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">Public page</label>
        <select id="seo-route" value={route} onChange={(event) => setRoute(event.target.value as SeoRoute)} className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text focus:border-accent sm:max-w-sm">
          {seoRoutes.map((item) => <option key={item.route} value={item.route}>{item.label} ({item.route})</option>)}
        </select>
      </div>
      <RouteForm key={route} route={route} record={record} />
    </div>
  );
}

function RouteForm({ route, record }: { route: SeoRoute; record: SeoMetadataRecord | null }) {
  const [state, formAction] = useFormState<SeoMetadataFormState, FormData>(saveSeoMetadata, { error: null });
  const field = (name: keyof SeoMetadataRecord) => record?.[name] ?? "";
  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="route" value={route} />
      {state.error && <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{state.error}</div>}
      {state.success && <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />Saved. Empty fields continue using the page and site defaults.</div>}
      <Field label="SEO title" name="title" defaultValue={field("title")} hint="Falls back to the page title when left empty." />
      <TextArea label="Meta description" name="description" defaultValue={field("description")} rows={3} hint="Falls back to the page description when left empty." />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Open Graph title" name="og_title" defaultValue={field("og_title")} />
        <Field label="Canonical URL" name="canonical_url" type="url" defaultValue={field("canonical_url")} hint="Optional absolute URL." />
      </div>
      <TextArea label="Open Graph description" name="og_description" defaultValue={field("og_description")} rows={3} />
      <ImageUploadField name="og_image" folder="uploads" initialUrl={field("og_image")} label="Open Graph image" />
      <p className="-mt-3 text-xs text-text-faint">Optional. This image is also used for Twitter/X cards. Upload through the existing Media Library flow or leave blank for the page image/default.</p>
      <div className="border-t border-border pt-5"><SubmitButton /></div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Saving..." : "Save SEO metadata"}</button>;
}

function Field({ label, name, defaultValue, type = "text", hint }: { label: string; name: string; defaultValue?: string | null; type?: string; hint?: string }) {
  return <div><label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">{label}</label><input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent" />{hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}</div>;
}

function TextArea({ label, name, defaultValue, rows, hint }: { label: string; name: string; defaultValue?: string | null; rows: number; hint?: string }) {
  return <div><label htmlFor={name} className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-text-faint">{label}</label><textarea id={name} name={name} rows={rows} defaultValue={defaultValue ?? ""} className="w-full rounded-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent" />{hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}</div>;
}

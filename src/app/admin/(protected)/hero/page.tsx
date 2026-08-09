import { AlertTriangle } from "lucide-react";
import { getSiteSettingsAdmin } from "@/lib/admin-content";

export default async function AdminHeroPage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Hero</h1>
      <p className="mb-6 text-sm text-text-muted">Partially backed by site_settings.</p>

      <dl className="card mb-4 divide-y divide-border">
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">Name</dt>
          <dd className="text-text">{settings?.name}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">Role / title</dt>
          <dd className="text-text">{settings?.role}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">Tagline / description</dt>
          <dd className="max-w-md text-right text-text">{settings?.tagline}</dd>
        </div>
      </dl>

      <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div className="text-sm text-text-muted">
          <p className="text-text">Not the full Hero model yet.</p>
          <p className="mt-1">
            Button labels/links and a distinct subtitle field (separate from tagline) aren't in
            site_settings yet — the homepage currently derives its buttons from hardcoded JSX, not
            data. Adding those fields and an editor for them is Phase 14.
          </p>
        </div>
      </div>
    </div>
  );
}

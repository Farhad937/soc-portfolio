import { getSiteSettingsAdmin } from "@/lib/admin-content";

export default async function AdminContactPage() {
  const settings = await getSiteSettingsAdmin();

  const rows = [
    { label: "Email", value: settings?.email },
    { label: "Location", value: settings?.location },
    { label: "LinkedIn", value: settings?.linkedin_url },
    { label: "GitHub", value: settings?.github_url },
    { label: "TryHackMe", value: settings?.tryhackme_url },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Contact</h1>
      <p className="mb-6 text-sm text-text-muted">Backed by site_settings — read-only for now.</p>

      <dl className="card divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3">
            <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">{r.label}</dt>
            <dd className="text-text">{r.value || <span className="text-text-faint">—</span>}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-text-faint">Editing this is Phase 16.</p>
    </div>
  );
}

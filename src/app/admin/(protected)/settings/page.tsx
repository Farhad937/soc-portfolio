import { getSiteSettingsAdmin } from "@/lib/admin-content";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdmin();

  const rows = [
    { label: "Name", value: settings?.name },
    { label: "Role", value: settings?.role },
    { label: "Tagline", value: settings?.tagline },
    { label: "Status text", value: settings?.status_text },
    { label: "Learning hours", value: settings?.learning_hours },
    { label: "GitHub repos", value: settings?.github_repos },
    { label: "Blog articles", value: settings?.blog_articles },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Settings</h1>
      <p className="mb-6 text-sm text-text-muted">site_settings — read-only for now.</p>

      <dl className="card divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3">
            <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">{r.label}</dt>
            <dd className="text-text">{r.value ?? <span className="text-text-faint">—</span>}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-text-faint">
        No dedicated "Settings" phase was specified beyond this — treating it as the general
        site_settings editor once forms exist.
      </p>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";
import { getSiteSettingsAdmin } from "@/lib/admin-content";
import { updateHeroContent } from "@/lib/admin-content/site-settings-mutations";
import HeroContentForm from "@/components/admin/hero-content-form";

export default async function AdminHeroPage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Hero</h1>
      <p className="mb-6 text-sm text-text-muted">
        The kicker, description, and buttons below are editable here and drive the public
        homepage directly.
      </p>

      <dl className="card mb-4 divide-y divide-border">
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">Name</dt>
          <dd className="text-text">{settings?.name}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="font-mono text-xs uppercase tracking-wide text-text-faint">Role / title</dt>
          <dd className="text-text">{settings?.role}</dd>
        </div>
      </dl>

      <div className="mb-6 flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="text-sm text-text-muted">
          Name and Role are edited via the Contact/Settings editors (a later phase), not here —
          they're shown above for reference since the Hero heading uses them.
        </p>
      </div>

      <HeroContentForm action={updateHeroContent} initial={settings} />
    </div>
  );
}

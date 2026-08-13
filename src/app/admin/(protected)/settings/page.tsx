import { getSiteSettingsAdmin } from "@/lib/admin-content";
import { updateSettingsContent } from "@/lib/admin-content/site-settings-mutations";
import SettingsContentForm from "@/components/admin/settings-content-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Settings</h1>
      <p className="mb-6 text-sm text-text-muted">
        Site-wide identity — drives the header, footer, Hero name/role, and About page.
      </p>

      <SettingsContentForm action={updateSettingsContent} initial={settings} />
    </div>
  );
}

import { getSiteSettingsAdmin } from "@/lib/admin-content";
import { updateContactContent } from "@/lib/admin-content/site-settings-mutations";
import ContactContentForm from "@/components/admin/contact-content-form";

export default async function AdminContactPage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Contact</h1>
      <p className="mb-6 text-sm text-text-muted">
        Drives the site header, footer, and public /contact page.
      </p>

      <ContactContentForm action={updateContactContent} initial={settings} />
    </div>
  );
}

import { getSiteSettingsAdmin } from "@/lib/admin-content";
import ResumeManager from "@/components/admin/resume-manager";

export default async function AdminResumePage() {
  const settings = await getSiteSettingsAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Resume</h1>
      <p className="mb-6 text-sm text-text-muted">
        Manage the PDF served on the public /resume page.
      </p>

      <ResumeManager
        currentUrl={settings?.resume_url ?? null}
        currentFilename={settings?.resume_filename ?? null}
        currentUploadedAt={settings?.resume_uploaded_at ?? null}
      />
    </div>
  );
}

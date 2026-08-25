import SeoMetadataForm from "@/components/admin/seo-metadata-form";
import { getSeoMetadataAdmin } from "@/lib/admin-content/seo";

export default async function AdminSeoPage() {
  const records = await getSeoMetadataAdmin();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text">SEO</h1>
        <p className="mt-1 text-sm text-text-muted">Manage metadata for the public portfolio pages. Empty fields safely use the existing page and site defaults.</p>
      </div>
      <SeoMetadataForm records={records} />
    </div>
  );
}

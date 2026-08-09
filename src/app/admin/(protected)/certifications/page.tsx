import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllCertificationsAdmin } from "@/lib/admin-content";
import CertificationsTable from "@/components/admin/certifications-table";

export default async function AdminCertificationsPage() {
  const certifications = await getAllCertificationsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Certifications</h1>
          <p className="mt-1 text-sm text-text-muted">{certifications.length} total, all statuses.</p>
        </div>
        <Link href="/admin/certifications/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Certification
        </Link>
      </div>

      <CertificationsTable certifications={certifications} />
    </div>
  );
}

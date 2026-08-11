import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllEducationAdmin } from "@/lib/admin-content";
import EducationTable from "@/components/admin/education-table";

export default async function AdminEducationPage() {
  const entries = await getAllEducationAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Education</h1>
          <p className="mt-1 text-sm text-text-muted">{entries.length} total, all statuses. Shown on the About page.</p>
        </div>
        <Link href="/admin/education/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Education
        </Link>
      </div>

      <EducationTable entries={entries} />
    </div>
  );
}

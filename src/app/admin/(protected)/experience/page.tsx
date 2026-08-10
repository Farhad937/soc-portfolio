import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllExperienceAdmin } from "@/lib/admin-content";
import ExperienceTable from "@/components/admin/experience-table";

export default async function AdminExperiencePage() {
  const entries = await getAllExperienceAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Experience</h1>
          <p className="mt-1 text-sm text-text-muted">{entries.length} total, all statuses. Shown on the About page.</p>
        </div>
        <Link href="/admin/experience/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Experience
        </Link>
      </div>

      <ExperienceTable entries={entries} />
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllProjectsAdmin } from "@/lib/admin-content";
import ProjectsTable from "@/components/admin/projects-table";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Projects</h1>
          <p className="mt-1 text-sm text-text-muted">{projects.length} total, all statuses.</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Project
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}

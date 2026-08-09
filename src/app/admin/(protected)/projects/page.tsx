import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { getAllProjectsAdmin } from "@/lib/admin-content";
import StatusBadge from "@/components/admin/status-badge";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Projects</h1>
          <p className="mt-1 text-sm text-text-muted">{projects.length} total, all statuses.</p>
        </div>
        <button disabled className="btn-primary cursor-not-allowed opacity-50" title="Create/edit forms are Phase 5">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text">{p.title}</td>
                <td className="px-4 py-3 text-text-muted">{p.status}</td>
                <td className="px-4 py-3"><StatusBadge status={p.content_status} /></td>
                <td className="px-4 py-3 font-mono text-text-muted">{p.order_index}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-faint">
                  {new Date(p.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {p.content_status === "published" && (
                    <Link href={`/projects/${p.slug}`} target="_blank" className="text-text-faint hover:text-accent">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-text-faint">
        Read-only for now. Editing, creating, deleting, reordering, and publish/unpublish controls
        are Phase 5.
      </p>
    </div>
  );
}

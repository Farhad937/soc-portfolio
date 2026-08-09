import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { getAllWriteupsAdmin } from "@/lib/admin-content";
import StatusBadge from "@/components/admin/status-badge";

export default async function AdminWriteupsPage() {
  const writeups = await getAllWriteupsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Write-ups</h1>
          <p className="mt-1 text-sm text-text-muted">{writeups.length} total, all statuses.</p>
        </div>
        <button disabled className="btn-primary cursor-not-allowed opacity-50" title="Create/edit forms are Phase 6">
          <Plus className="h-4 w-4" /> Add Write-up
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {writeups.map((w) => (
              <tr key={w.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text">{w.title}</td>
                <td className="px-4 py-3 text-text-muted">{w.category}</td>
                <td className="px-4 py-3"><StatusBadge status={w.content_status} /></td>
                <td className="px-4 py-3 font-mono text-text-muted">{w.order_index}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-faint">
                  {new Date(w.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {w.content_status === "published" && (
                    <Link href={`/writeups/${w.slug}`} target="_blank" className="text-text-faint hover:text-accent">
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
        Read-only for now. Editing, creating, deleting, and publish/unpublish controls are Phase 6.
      </p>
    </div>
  );
}

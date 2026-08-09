import { Plus } from "lucide-react";
import { getAllCertificationsAdmin } from "@/lib/admin-content";
import StatusBadge from "@/components/admin/status-badge";

export default async function AdminCertificationsPage() {
  const certifications = await getAllCertificationsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Certifications</h1>
          <p className="mt-1 text-sm text-text-muted">{certifications.length} total, all statuses.</p>
        </div>
        <button disabled className="btn-primary cursor-not-allowed opacity-50" title="Create/edit forms are Phase 9">
          <Plus className="h-4 w-4" /> Add Certification
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Issuer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Order</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text">{c.name}</td>
                <td className="px-4 py-3 text-text-muted">{c.issuer}</td>
                <td className="px-4 py-3 text-text-muted">{c.status}</td>
                <td className="px-4 py-3"><StatusBadge status={c.content_status} /></td>
                <td className="px-4 py-3 font-mono text-text-muted">{c.order_index}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-text-faint">
        Read-only for now. Full editor is Phase 9.
      </p>
    </div>
  );
}

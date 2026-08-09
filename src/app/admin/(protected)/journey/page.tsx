import { Plus } from "lucide-react";
import { getAllTimelineAdmin } from "@/lib/admin-content";
import StatusBadge from "@/components/admin/status-badge";

export default async function AdminJourneyPage() {
  const entries = await getAllTimelineAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Journey</h1>
          <p className="mt-1 text-sm text-text-muted">{entries.length} timeline entries.</p>
        </div>
        <button disabled className="btn-primary cursor-not-allowed opacity-50" title="Add/edit/reorder is Phase 12">
          <Plus className="h-4 w-4" /> Add Entry
        </button>
      </div>

      <ol className="card divide-y divide-border">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="font-mono text-xs text-accent">{e.date}</p>
              <p className="text-text">{e.title}</p>
            </div>
            <StatusBadge status={e.content_status} />
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs text-text-faint">
        Read-only for now. Add/edit/delete/reorder is Phase 12.
      </p>
    </div>
  );
}

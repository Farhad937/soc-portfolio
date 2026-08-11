import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllTimelineAdmin } from "@/lib/admin-content";
import JourneyTable from "@/components/admin/journey-table";

export default async function AdminJourneyPage() {
  const entries = await getAllTimelineAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Journey</h1>
          <p className="mt-1 text-sm text-text-muted">{entries.length} total, all statuses.</p>
        </div>
        <Link href="/admin/journey/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Entry
        </Link>
      </div>

      <JourneyTable entries={entries} />
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllWriteupsAdmin } from "@/lib/admin-content";
import WriteupsTable from "@/components/admin/writeups-table";

export default async function AdminWriteupsPage() {
  const writeups = await getAllWriteupsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Write-ups</h1>
          <p className="mt-1 text-sm text-text-muted">{writeups.length} total, all statuses.</p>
        </div>
        <Link href="/admin/writeups/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Write-up
        </Link>
      </div>

      <WriteupsTable writeups={writeups} />
    </div>
  );
}

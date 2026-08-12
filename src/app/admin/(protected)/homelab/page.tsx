import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllHomeLabItemsAdmin, getHomeLabPageContentAdmin } from "@/lib/admin-content";
import { updateHomeLabPageContent } from "@/lib/admin-content/homelab-mutations";
import HomeLabItemsTable from "@/components/admin/homelab-items-table";
import HomeLabPageContentForm from "@/components/admin/homelab-page-content-form";

export default async function AdminHomeLabPage() {
  const [items, pageContent] = await Promise.all([getAllHomeLabItemsAdmin(), getHomeLabPageContentAdmin()]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text">Home Lab</h1>
        <p className="mt-1 text-sm text-text-muted">
          Everything shown on the public /homelab page is managed here — the page content below,
          plus the VM/component list.
        </p>
      </div>

      <HomeLabPageContentForm action={updateHomeLabPageContent} initial={pageContent} />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wide text-text-faint">Virtual Machines / Components</h2>
        <Link href="/admin/homelab/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Item
        </Link>
      </div>

      <HomeLabItemsTable items={items} />
    </div>
  );
}

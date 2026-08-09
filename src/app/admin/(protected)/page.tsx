import {
  getAllProjectsAdmin,
  getAllWriteupsAdmin,
  getAllCertificationsAdmin,
} from "@/lib/admin-content";
import { FolderKanban, NotebookText, BadgeCheck } from "lucide-react";

function countByStatus(rows: { content_status: string }[]) {
  return {
    published: rows.filter((r) => r.content_status === "published").length,
    draft: rows.filter((r) => r.content_status === "draft").length,
    archived: rows.filter((r) => r.content_status === "archived").length,
    total: rows.length,
  };
}

export default async function AdminDashboardPage() {
  const [projects, writeups, certifications] = await Promise.all([
    getAllProjectsAdmin(),
    getAllWriteupsAdmin(),
    getAllCertificationsAdmin(),
  ]);

  const cards = [
    { label: "Projects", icon: FolderKanban, counts: countByStatus(projects) },
    { label: "Write-ups", icon: NotebookText, counts: countByStatus(writeups) },
    { label: "Certifications", icon: BadgeCheck, counts: countByStatus(certifications) },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Dashboard</h1>
      <p className="mb-8 text-sm text-text-muted">
        Live counts from Supabase, broken down by publish status. Recently-edited activity isn't
        shown here yet — that needs version history (Phase 24), which hasn't been built.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, icon: Icon, counts }) => (
          <div key={label} className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <Icon className="h-5 w-5 text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-faint">{label}</span>
            </div>
            <p className="font-mono text-2xl font-semibold text-text">{counts.total}</p>
            <div className="mt-3 flex gap-3 font-mono text-[11px] text-text-muted">
              <span className="text-success">{counts.published} published</span>
              <span className="text-warning">{counts.draft} draft</span>
              {counts.archived > 0 && <span className="text-text-faint">{counts.archived} archived</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-md border border-border p-4 text-sm text-text-muted">
        This is the dashboard shell (Phase 3) — sidebar navigation and live read access to your
        content are working. Actually creating, editing, or publishing anything from here is
        Phase 4 and hasn't been built yet.
      </p>
    </div>
  );
}

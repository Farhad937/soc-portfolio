import { Plus } from "lucide-react";
import { getAllSkillGroupsAdmin } from "@/lib/admin-content";

export default async function AdminSkillsPage() {
  const groups = await getAllSkillGroupsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">Skills</h1>
          <p className="mt-1 text-sm text-text-muted">{groups.length} categories.</p>
        </div>
        <button disabled className="btn-primary cursor-not-allowed opacity-50" title="Add/edit/reorder is Phase 8">
          <Plus className="h-4 w-4" /> Add Skill
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="card p-5">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wide text-accent">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((s) => (
                <span key={s.id} className="tag">{s.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-text-faint">
        Read-only for now. Add/edit/delete/reorder/recategorize is Phase 8.
      </p>
    </div>
  );
}

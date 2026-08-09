import { getAllSkillGroupsAdmin } from "@/lib/admin-content";
import SkillsManager from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const groups = await getAllSkillGroupsAdmin();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text">Skills</h1>
        <p className="mt-1 text-sm text-text-muted">
          {groups.length} categories. Changes here go live immediately — no draft/publish step.
        </p>
      </div>

      <SkillsManager groups={groups} />
    </div>
  );
}

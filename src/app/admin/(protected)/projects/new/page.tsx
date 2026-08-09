import ProjectForm from "@/components/admin/project-form";
import { createProject } from "@/lib/admin-content/projects-mutations";

export default function NewProjectPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Project</h1>
      <ProjectForm action={createProject} initial={null} mode="create" />
    </div>
  );
}

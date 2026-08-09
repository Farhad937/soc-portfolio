import { notFound } from "next/navigation";
import { getProjectByIdAdmin } from "@/lib/admin-content";
import { updateProject } from "@/lib/admin-content/projects-mutations";
import ProjectForm from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectByIdAdmin(params.id);
  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Edit Project</h1>
      <p className="mb-6 font-mono text-xs text-text-faint">{project.slug}</p>
      <ProjectForm action={boundUpdate} initial={project} mode="edit" />
    </div>
  );
}

import { notFound } from "next/navigation";
import { getExperienceByIdAdmin } from "@/lib/admin-content";
import { updateExperience } from "@/lib/admin-content/experience-mutations";
import ExperienceForm from "@/components/admin/experience-form";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const entry = await getExperienceByIdAdmin(params.id);
  if (!entry) notFound();

  const boundUpdate = updateExperience.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Edit Experience</h1>
      <ExperienceForm action={boundUpdate} initial={entry} mode="edit" />
    </div>
  );
}

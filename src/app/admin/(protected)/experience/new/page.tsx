import ExperienceForm from "@/components/admin/experience-form";
import { createExperience } from "@/lib/admin-content/experience-mutations";

export default function NewExperiencePage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Experience</h1>
      <ExperienceForm action={createExperience} initial={null} mode="create" />
    </div>
  );
}

import EducationForm from "@/components/admin/education-form";
import { createEducation } from "@/lib/admin-content/education-mutations";

export default function NewEducationPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Education</h1>
      <EducationForm action={createEducation} initial={null} mode="create" />
    </div>
  );
}

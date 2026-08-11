import { notFound } from "next/navigation";
import { getEducationByIdAdmin } from "@/lib/admin-content";
import { updateEducation } from "@/lib/admin-content/education-mutations";
import EducationForm from "@/components/admin/education-form";

export default async function EditEducationPage({ params }: { params: { id: string } }) {
  const entry = await getEducationByIdAdmin(params.id);
  if (!entry) notFound();

  const boundUpdate = updateEducation.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Edit Education</h1>
      <EducationForm action={boundUpdate} initial={entry} mode="edit" />
    </div>
  );
}

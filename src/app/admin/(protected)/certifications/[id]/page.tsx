import { notFound } from "next/navigation";
import { getCertificationByIdAdmin } from "@/lib/admin-content";
import { updateCertification } from "@/lib/admin-content/certifications-mutations";
import CertificationForm from "@/components/admin/certification-form";

export default async function EditCertificationPage({ params }: { params: { id: string } }) {
  const certification = await getCertificationByIdAdmin(params.id);
  if (!certification) notFound();

  const boundUpdate = updateCertification.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Edit Certification</h1>
      <CertificationForm action={boundUpdate} initial={certification} mode="edit" />
    </div>
  );
}

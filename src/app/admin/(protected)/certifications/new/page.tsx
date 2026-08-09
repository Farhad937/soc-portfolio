import CertificationForm from "@/components/admin/certification-form";
import { createCertification } from "@/lib/admin-content/certifications-mutations";

export default function NewCertificationPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Certification</h1>
      <CertificationForm action={createCertification} initial={null} mode="create" />
    </div>
  );
}

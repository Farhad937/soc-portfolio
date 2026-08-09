import WriteupForm from "@/components/admin/writeup-form";
import { createWriteup } from "@/lib/admin-content/writeups-mutations";

export default function NewWriteupPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Write-up</h1>
      <WriteupForm action={createWriteup} initial={null} mode="create" />
    </div>
  );
}

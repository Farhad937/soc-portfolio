import { notFound } from "next/navigation";
import { getWriteupByIdAdmin } from "@/lib/admin-content";
import { updateWriteup } from "@/lib/admin-content/writeups-mutations";
import WriteupForm from "@/components/admin/writeup-form";

export default async function EditWriteupPage({ params }: { params: { id: string } }) {
  const writeup = await getWriteupByIdAdmin(params.id);
  if (!writeup) notFound();

  const boundUpdate = updateWriteup.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Edit Write-up</h1>
      <p className="mb-6 font-mono text-xs text-text-faint">{writeup.slug}</p>
      <WriteupForm action={boundUpdate} initial={writeup} mode="edit" />
    </div>
  );
}

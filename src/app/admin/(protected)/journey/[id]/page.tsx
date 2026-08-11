import { notFound } from "next/navigation";
import { getTimelineEntryByIdAdmin } from "@/lib/admin-content";
import { updateJourneyEntry } from "@/lib/admin-content/journey-mutations";
import JourneyForm from "@/components/admin/journey-form";

export default async function EditJourneyEntryPage({ params }: { params: { id: string } }) {
  const entry = await getTimelineEntryByIdAdmin(params.id);
  if (!entry) notFound();

  const boundUpdate = updateJourneyEntry.bind(null, params.id);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Edit Journey Entry</h1>
      <JourneyForm action={boundUpdate} initial={entry} mode="edit" />
    </div>
  );
}

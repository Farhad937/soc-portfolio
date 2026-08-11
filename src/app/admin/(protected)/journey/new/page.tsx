import JourneyForm from "@/components/admin/journey-form";
import { createJourneyEntry } from "@/lib/admin-content/journey-mutations";

export default function NewJourneyEntryPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-xl font-semibold text-text">Add Journey Entry</h1>
      <JourneyForm action={createJourneyEntry} initial={null} mode="create" />
    </div>
  );
}

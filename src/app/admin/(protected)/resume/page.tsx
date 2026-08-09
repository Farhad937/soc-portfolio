import NotYetBacked from "@/components/admin/not-yet-backed";

export default function AdminResumePage() {
  return (
    <NotYetBacked
      title="Resume"
      reason="The public /resume page currently links to a static placeholder file at public/resume.pdf. No Supabase Storage bucket or upload mechanism exists yet, so there's nothing here to manage from the admin side."
      phase="Phase 17"
    />
  );
}

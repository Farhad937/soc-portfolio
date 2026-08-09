import NotYetBacked from "@/components/admin/not-yet-backed";

export default function AdminMediaPage() {
  return (
    <NotYetBacked
      title="Media Library"
      reason="No Supabase Storage bucket has been created, and no upload/list/delete code exists. This needs its own setup step before anything can appear here."
      phase="Phase 18"
    />
  );
}

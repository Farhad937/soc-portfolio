import NotYetBacked from "@/components/admin/not-yet-backed";

export default function AdminHomelabPage() {
  return (
    <NotYetBacked
      title="Home Lab"
      reason="Hardware specs, VM list, and network diagram are all hardcoded JSX on the public /homelab page. No home_lab table exists yet."
      phase="Phase 13"
    />
  );
}

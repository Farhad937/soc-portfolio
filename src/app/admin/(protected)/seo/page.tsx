import NotYetBacked from "@/components/admin/not-yet-backed";

export default function AdminSeoPage() {
  return (
    <NotYetBacked
      title="SEO"
      reason="Page metadata is currently hardcoded per-page in each page.tsx file (title/description). No seo_metadata table or per-page override mechanism exists."
      phase="Phase 25"
    />
  );
}

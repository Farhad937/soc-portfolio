import NotYetBacked from "@/components/admin/not-yet-backed";

export default function AdminAboutPage() {
  return (
    <NotYetBacked
      title="About"
      reason="The About page's prose (background, transition story, career goal) is still hardcoded JSX text — no about_content table exists. Only role/location are pulled from site_settings (visible in the Hero section here)."
      phase="Phase 15"
    />
  );
}

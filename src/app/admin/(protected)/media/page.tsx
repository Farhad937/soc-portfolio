import { listMediaFiles } from "@/lib/supabase/storage";
import MediaLibrary from "@/components/admin/media-library";

export default async function AdminMediaPage() {
  const files = await listMediaFiles("uploads");

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">Media Library</h1>
      <p className="mb-6 text-sm text-text-muted">
        Upload images here to get a public URL, then paste it into a Project gallery, a
        Certification logo, or anywhere else that accepts an image URL. Project/Certification
        forms also support uploading directly, which doesn't require this page.
      </p>

      <MediaLibrary initialFiles={files} />
    </div>
  );
}

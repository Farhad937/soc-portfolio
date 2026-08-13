import { getAboutPageContentAdmin } from "@/lib/admin-content";
import { updateAboutContent } from "@/lib/admin-content/about-mutations";
import AboutContentForm from "@/components/admin/about-content-form";

export default async function AdminAboutPage() {
  const content = await getAboutPageContentAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-xl font-semibold text-text">About</h1>
      <p className="mb-6 text-sm text-text-muted">
        These fields drive the public /about page — the three background paragraphs, Current
        Focus, and Career Goal. Name/role/location are edited under Settings/Contact, not here.
      </p>

      <AboutContentForm action={updateAboutContent} initial={content} />
    </div>
  );
}

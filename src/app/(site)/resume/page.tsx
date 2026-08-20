import SectionHeading from "@/components/section-heading";
import { FileDown, FileX } from "lucide-react";
import { site as staticSite } from "@/lib/site";
import { getSiteSettings } from "@/lib/content/site-settings";

export const metadata = { title: `Resume — ${staticSite.name}` };
export const revalidate = 3600;

export default async function ResumePage() {
  const site = await getSiteSettings();

  return (
    <section className="section">
      <SectionHeading kicker="// CV" title="Resume" />

      {site.resumeUrl ? (
        <>
          <a href={site.resumeUrl} download target="_blank" rel="noopener noreferrer" className="btn-primary mb-8 w-fit animate-fade-in">
            <FileDown className="h-4 w-4" /> Download PDF
          </a>
          <div className="card max-w-2xl animate-fade-in overflow-hidden [animation-delay:100ms]">
            <iframe src={site.resumeUrl} className="aspect-[8.5/11] w-full" title="Resume preview" />
          </div>
        </>
      ) : (
        <div className="card flex max-w-2xl animate-fade-in flex-col items-center gap-3 p-10 text-center">
          <FileX className="h-8 w-8 text-text-faint" />
          <p className="text-text-muted">No resume has been uploaded yet.</p>
        </div>
      )}
    </section>
  );
}

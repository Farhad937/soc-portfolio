import SectionHeading from "@/components/section-heading";
import { FileDown } from "lucide-react";
import { site } from "@/lib/site";

export const metadata = { title: `Resume — ${site.name}` };

export default function ResumePage() {
  return (
    <section className="section">
      <SectionHeading kicker="// CV" title="Resume" />

      <a href="/resume.pdf" download className="btn-primary mb-8 w-fit">
        <FileDown className="h-4 w-4" /> Download PDF
      </a>

      <div className="card flex aspect-[8.5/11] max-w-2xl items-center justify-center p-6">
        <p className="max-w-xs text-center font-mono text-xs text-text-faint">
          [ Drop your resume PDF at <code className="text-accent">public/resume.pdf</code> and
          it will download from the button above and can be embedded here with an
          &lt;iframe src=&quot;/resume.pdf&quot; /&gt; ]
        </p>
      </div>
    </section>
  );
}

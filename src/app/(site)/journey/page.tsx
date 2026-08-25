import SectionHeading from "@/components/section-heading";
import { getTimeline } from "@/lib/content/timeline";
import { getStaticPageMetadata } from "@/lib/content/seo";

/* Legacy static metadata is intentionally retained below for reference.

export const metadata = { title: `Learning Journey — ${site.name}` };
*/
export async function generateMetadata() {
  return getStaticPageMetadata("/journey");
}
export const revalidate = 3600;

export default async function JourneyPage() {
  const timeline = await getTimeline();

  return (
    <section className="section">
      <SectionHeading
        kicker="// Timeline"
        title="Learning Journey"
        description="A running log of progress — recruiters read this for trajectory, not just current skill level."
      />
      <ol className="relative border-l border-border pl-8">
        {timeline.map((entry, i) => (
          <li key={i} className="relative mb-10 animate-slide-in last:mb-0" style={{ animationDelay: `${i * 90}ms` }}>
            <span className="absolute -left-[39px] mt-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
            <p className="font-mono text-xs text-accent">{entry.date}</p>
            <h3 className="mt-1 text-lg font-medium text-text">{entry.title}</h3>
            {entry.description && <p className="mt-1 text-sm text-text-muted">{entry.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

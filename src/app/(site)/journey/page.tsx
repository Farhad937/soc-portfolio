import SectionHeading from "@/components/section-heading";
import { getTimeline } from "@/lib/content/timeline";
import { site } from "@/lib/site";

export const metadata = { title: `Learning Journey — ${site.name}` };
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
          <li key={i} className="mb-10 animate-fade-in last:mb-0" style={{ animationDelay: `${i * 75}ms` }}>
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
            <p className="font-mono text-xs text-accent">{entry.date}</p>
            <h3 className="mt-1 text-lg font-medium text-text">{entry.title}</h3>
            {entry.description && <p className="mt-1 text-sm text-text-muted">{entry.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

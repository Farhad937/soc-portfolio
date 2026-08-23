import SectionHeading from "@/components/section-heading";
import { getSkillGroups } from "@/lib/content/skills";
import { site } from "@/lib/site";
import ScrollRevealGrid from "@/components/scroll-reveal-grid";

export const metadata = { title: `Skills — ${site.name}` };
export const revalidate = 3600;

export default async function SkillsPage() {
  const skillGroups = await getSkillGroups();

  return (
    <section className="section">
      <SectionHeading
        kicker="// Capabilities"
        title="Skills"
        highlight
        description="Organized the way I'd want a hiring manager to scan them — by domain, not chronology."
      />
      <ScrollRevealGrid className="grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.category} className="card public-card p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wide text-highlight">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </ScrollRevealGrid>
    </section>
  );
}

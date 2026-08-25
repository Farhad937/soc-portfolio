import SectionHeading from "@/components/section-heading";
import { getThmPaths } from "@/lib/content/tryhackme";
import { getStaticPageMetadata } from "@/lib/content/seo";
import { CheckCircle2, CircleDashed, CircleDot } from "lucide-react";
import ScrollRevealGrid from "@/components/scroll-reveal-grid";
/* Legacy static metadata is intentionally retained below for reference.

export const metadata = { title: `TryHackMe Progress — ${site.name}` };
*/
export async function generateMetadata() {
  return getStaticPageMetadata("/tryhackme");
}
export const revalidate = 3600;

const roomStatusIcon = {
  Complete: <CheckCircle2 className="h-4 w-4 text-success" />,
  "In Progress": <CircleDot className="h-4 w-4 text-warning" />,
  "Not Started": <CircleDashed className="h-4 w-4 text-text-faint" />,
};

export default async function TryHackMePage() {
  const thmPaths = await getThmPaths();

  return (
    <section className="section">
      <SectionHeading
        kicker="// TryHackMe"
        title="Learning Paths"
        description="Organized by path rather than a raw room list. No flags or full walkthroughs — see Write-ups for concept notes instead."
      />
      <ScrollRevealGrid className="space-y-8">
        {thmPaths.map((path) => (
          <div key={path.name} className="card public-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">{path.name}</h3>
              <span className="font-mono text-xs text-text-muted">{path.progress}%</span>
            </div>
            <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
              <div
                className="h-full origin-left animate-progress-fill rounded-full bg-accent"
                style={{ width: `${path.progress}%` }}
              />
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {path.rooms.map((room) => (
                <li key={room.name} className="flex items-center gap-2 text-sm text-text-muted">
                  {roomStatusIcon[room.status]}
                  {room.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ScrollRevealGrid>
    </section>
  );
}

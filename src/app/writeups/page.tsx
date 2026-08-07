import SectionHeading from "@/components/section-heading";
import WriteupCard from "@/components/writeup-card";
import { writeups } from "@/lib/writeups";
import { site } from "@/lib/site";

export const metadata = { title: `Write-ups — ${site.name}` };

export default function WriteupsPage() {
  return (
    <section className="section">
      <SectionHeading
        kicker="// Notes"
        title="Write-ups"
        description="Concept explanations from my own study. Never TryHackMe flags or complete room walkthroughs — the focus is always the underlying idea."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {writeups.map((w) => (
          <WriteupCard key={w.slug} writeup={w} />
        ))}
      </div>
    </section>
  );
}

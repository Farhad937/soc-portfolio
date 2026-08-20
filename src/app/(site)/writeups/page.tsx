import SectionHeading from "@/components/section-heading";
import WriteupCard from "@/components/writeup-card";
import { getWriteups } from "@/lib/content/writeups";
import { site } from "@/lib/site";

export const metadata = { title: `Write-ups — ${site.name}` };
export const revalidate = 3600;

export default async function WriteupsPage() {
  const writeups = await getWriteups();

  return (
    <section className="section">
      <SectionHeading
        kicker="// Notes"
        title="Write-ups"
        description="Concept explanations from my own study. Never TryHackMe flags or complete room walkthroughs — the focus is always the underlying idea."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {writeups.map((w, index) => (
          <WriteupCard key={w.slug} writeup={w} index={index} />
        ))}
      </div>
    </section>
  );
}

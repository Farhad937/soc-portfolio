import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { getWriteups, getWriteupBySlug } from "@/lib/content/writeups";
import RichText from "@/components/rich-text";

export const revalidate = 3600;

export async function generateStaticParams() {
  const writeups = await getWriteups();
  return writeups.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const writeup = await getWriteupBySlug(params.slug);
  return { title: writeup ? `${writeup.title} — Write-up` : "Write-up not found" };
}

export default async function WriteupDetailPage({ params }: { params: { slug: string } }) {
  const writeup = await getWriteupBySlug(params.slug);
  if (!writeup) notFound();

  return (
    <article className="section max-w-3xl">
      <Link href="/writeups" className="group mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors hover:text-accent focus-visible:text-accent">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5" /> All write-ups
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-text-faint">
        <span>{writeup.category}</span>
        <span>·</span>
        <span>{writeup.difficulty}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{writeup.readingTime}</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">{writeup.title}</h1>
      <p className="mt-4 text-lg text-text-muted">{writeup.summary}</p>

      <div className="mt-14 space-y-12">
        <div>
          <p className="log-divider mb-4">Concept</p>
          <RichText content={writeup.concept} />
        </div>

        <div>
          <p className="log-divider mb-4">Key Takeaways</p>
          <ul className="list-inside list-disc space-y-1 text-text-muted">
            {writeup.keyTakeaways.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {writeup.references.length > 0 && (
          <div>
            <p className="log-divider mb-4">References</p>
            <ul className="space-y-1">
              {writeup.references.map((ref) => (
                <li key={ref.url}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-bright">
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

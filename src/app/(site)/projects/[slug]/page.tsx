import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { getProjects, getProjectBySlug } from "@/lib/content/projects";
import type { Project } from "@/lib/projects";
import RichText from "@/components/rich-text";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  return { title: project ? `${project.title} — Project` : "Project not found" };
}

// `rich: true` fields render through the Markdown renderer; existing
// plain content with no Markdown syntax renders identically to before
// (a paragraph is a paragraph either way) — no data conversion needed.
const sections: { key: keyof Project; label: string; rich?: boolean }[] = [
  { key: "overview", label: "Overview", rich: true },
  { key: "objective", label: "Objective" },
  { key: "environment", label: "Environment" },
  { key: "challenges", label: "Challenges" },
  { key: "investigation", label: "Investigation", rich: true },
  { key: "findings", label: "Findings", rich: true },
  { key: "lessonsLearned", label: "Lessons Learned", rich: true },
  { key: "futureImprovements", label: "Future Improvements" },
];

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="section max-w-3xl">
      <Link href="/projects" className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-accent">
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </Link>

      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-text-faint">
        <span>{project.difficulty}</span>
        <span>·</span>
        <span>{project.status}</span>
        <span>·</span>
        <span>{project.timeInvested}</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">{project.title}</h1>
      <p className="mt-4 text-lg text-text-muted">{project.summary}</p>

      {project.featuredImage && (
        <img
          src={project.featuredImage}
          alt={project.title}
          className="mt-8 w-full rounded-lg border border-border object-cover"
        />
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {project.gallery.map((url) => (
            <img key={url} src={url} alt="" className="aspect-video w-full rounded-md border border-border object-cover" />
          ))}
        </div>
      )}

      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6 w-fit">
          <Github className="h-4 w-4" /> View on GitHub
        </a>
      )}

      <div className="mt-14 space-y-12">
        {sections.map(({ key, label, rich }) => {
          const value = project[key];
          if (!value) return null;
          return (
            <div key={String(key)}>
              <p className="log-divider mb-4">{label}</p>
              {Array.isArray(value) ? (
                <ul className="list-inside list-disc space-y-1 text-text-muted">
                  {(value as string[]).map((v) => <li key={v}>{v}</li>)}
                </ul>
              ) : rich ? (
                <RichText content={value as string} />
              ) : (
                <p className="leading-relaxed text-text-muted">{value as string}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 border-t border-border pt-6">
        <p className="log-divider mb-4">Skills Demonstrated</p>
        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>
      </div>
    </article>
  );
}

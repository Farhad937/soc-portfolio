import SectionHeading from "@/components/section-heading";
import ProjectCard from "@/components/project-card";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata = { title: `Projects — ${site.name}` };

export default function ProjectsPage() {
  return (
    <section className="section">
      <SectionHeading
        kicker="// Portfolio"
        title="Projects"
        description="Home lab builds and investigations. Each one follows the same structure: objective, environment, investigation, findings, lessons learned."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}

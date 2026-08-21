import SectionHeading from "@/components/section-heading";
import ProjectCard from "@/components/project-card";
import { getProjects } from "@/lib/content/projects";
import { site } from "@/lib/site";
import ScrollRevealGrid from "@/components/scroll-reveal-grid";

export const metadata = { title: `Projects — ${site.name}` };
export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="section">
      <SectionHeading
        kicker="// Portfolio"
        title="Projects"
        description="Home lab builds and investigations. Each one follows the same structure: objective, environment, investigation, findings, lessons learned."
      />
      <ScrollRevealGrid className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, index) => (
          <ProjectCard key={p.slug} project={p} index={index} />
        ))}
      </ScrollRevealGrid>
    </section>
  );
}

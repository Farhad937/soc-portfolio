import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

const statusColor: Record<Project["status"], string> = {
  Complete: "text-success",
  "In Progress": "text-warning",
  Planned: "text-text-faint",
};

export default function ProjectCard({ project, index = 0, motion }: { project: Project; index?: number; motion?: "home" }) {
  return (
    <div className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className={`card group flex h-full flex-col justify-between p-6 ${motion === "home" ? "home-project-card" : "interactive-card animate-slide-in"}`}
        style={motion === "home" ? undefined : { animationDelay: `${index * 80}ms` }}
      >
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wide text-text-faint">
            {project.difficulty}
          </span>
          <span className={`font-mono text-[11px] uppercase tracking-wide ${statusColor[project.status]}`}>
            {project.status}
          </span>
        </div>
        <h3 className="flex items-center gap-1.5 text-lg font-semibold text-text group-hover:text-accent group-focus-visible:text-accent">
          {project.title}
          <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:opacity-100" />
        </h3>
        <p className="mt-2 text-sm text-text-muted">{project.summary}</p>
      </div>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      </Link>
    </div>
  );
}

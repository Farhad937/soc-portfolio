import SectionHeading from "@/components/section-heading";
import { projects } from "@/lib/projects";
import { writeups } from "@/lib/writeups";
import { certifications, thmPaths } from "@/lib/data";
import { site } from "@/lib/site";
import { FolderKanban, NotebookText, Clock3, BadgeCheck, Terminal, Github, FileText } from "lucide-react";

export const metadata = { title: `Dashboard — ${site.name}` };

export default function DashboardPage() {
  const projectsCompleted = projects.filter((p) => p.status === "Complete").length;
  const writeupsPublished = writeups.length;
  const certsEarned = certifications.filter((c) => c.status === "Completed").length;
  const thmRoomsCompleted = thmPaths.reduce(
    (sum, path) => sum + path.rooms.filter((r) => r.status === "Complete").length,
    0
  );
  const thmRoomsTotal = thmPaths.reduce((sum, path) => sum + path.rooms.length, 0);

  const stats = [
    { label: "Projects Completed", value: `${projectsCompleted} / ${projects.length}`, icon: FolderKanban },
    { label: "Write-ups Published", value: writeupsPublished, icon: NotebookText },
    { label: "Learning Hours", value: site.stats.learningHours, icon: Clock3 },
    { label: "Certificates Earned", value: `${certsEarned} / ${certifications.length}`, icon: BadgeCheck },
    { label: "TryHackMe Rooms", value: `${thmRoomsCompleted} / ${thmRoomsTotal}`, icon: Terminal },
    { label: "GitHub Repositories", value: site.stats.githubRepos, icon: Github },
    { label: "Blog Articles", value: site.stats.blogArticles, icon: FileText },
  ];

  return (
    <section className="section">
      <SectionHeading
        kicker="// Overview"
        title="Dashboard"
        description="Live counts pulled from this site's own content — projects, write-ups, and certifications update this automatically as you add them. Learning hours, GitHub repos, and blog articles are set manually in src/lib/site.ts."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <Icon className="h-5 w-5 text-accent" />
              <span className="font-mono text-[11px] uppercase tracking-wide text-text-faint">
                {label}
              </span>
            </div>
            <p className="font-mono text-3xl font-semibold text-text">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <p className="log-divider mb-4">By TryHackMe Path</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {thmPaths.map((path) => (
            <div key={path.name} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-text">{path.name}</span>
                <span className="font-mono text-xs text-text-muted">{path.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-raised">
                <div className="h-full rounded-full bg-accent" style={{ width: `${path.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

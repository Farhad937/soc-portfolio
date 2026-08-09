import { getProjects } from "@/lib/content/projects";
import { getWriteups } from "@/lib/content/writeups";
import { getSkillGroups } from "@/lib/content/skills";
import SearchClient, { type SearchResult } from "@/components/search-client";

export const revalidate = 3600;

export default async function SearchPage() {
  const [projects, writeups, skillGroups] = await Promise.all([
    getProjects(),
    getWriteups(),
    getSkillGroups(),
  ]);

  const allResults: SearchResult[] = [
    ...projects.map((p) => ({
      type: "Project" as const,
      title: p.title,
      description: p.summary,
      href: `/projects/${p.slug}`,
    })),
    ...writeups.map((w) => ({
      type: "Write-up" as const,
      title: w.title,
      description: w.summary,
      href: `/writeups/${w.slug}`,
    })),
    ...skillGroups.flatMap((group) =>
      group.items.map((item) => ({
        type: "Skill" as const,
        title: item,
        description: group.category,
      }))
    ),
  ];

  return <SearchClient allResults={allResults} />;
}

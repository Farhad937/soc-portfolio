import { getProjects } from "@/lib/content/projects";
import { getWriteups } from "@/lib/content/writeups";
import { getSkillGroups } from "@/lib/content/skills";
import { getCertifications } from "@/lib/content/certifications";
import { getExperience } from "@/lib/content/experience";
import { getEducation } from "@/lib/content/education";
import { getTimeline } from "@/lib/content/timeline";
import { getHomeLabItems } from "@/lib/content/homelab";
import SearchClient, { type SearchResult } from "@/components/search-client";

export const revalidate = 3600;

export default async function SearchPage() {
  const [projects, writeups, skillGroups, certifications, experience, education, timeline, homeLabItems] =
    await Promise.all([
      getProjects(),
      getWriteups(),
      getSkillGroups(),
      getCertifications(),
      getExperience(),
      getEducation(),
      getTimeline(),
      getHomeLabItems(),
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
    // No individual detail routes exist for these — each links to the
    // one public page that actually shows this content type, per the
    // instruction to use the most appropriate existing destination
    // rather than inventing a route.
    ...certifications.map((c) => ({
      type: "Certification" as const,
      title: c.name,
      description: c.issuer,
      href: "/certifications",
      searchText: c.skills.join(" "),
    })),
    ...experience.map((e) => ({
      type: "Experience" as const,
      title: `${e.position} · ${e.company}`,
      description: e.description ?? "",
      href: "/about",
      searchText: [e.company, e.technologies.join(" ")].filter(Boolean).join(" "),
    })),
    ...education.map((e) => ({
      type: "Education" as const,
      title: `${e.degree} · ${e.institution}`,
      description: e.description ?? e.field_of_study ?? "",
      href: "/about",
      searchText: [e.institution, e.field_of_study].filter(Boolean).join(" "),
    })),
    ...timeline.map((t) => ({
      type: "Journey" as const,
      title: t.title,
      description: t.description ?? t.date ?? "",
      href: "/journey",
      searchText: t.date,
    })),
    ...homeLabItems.map((h) => ({
      type: "Home Lab" as const,
      title: h.name,
      description: h.description ?? h.category ?? "",
      href: "/homelab",
      searchText: [h.category, h.status].filter(Boolean).join(" "),
    })),
  ];

  return <SearchClient allResults={allResults} />;
}

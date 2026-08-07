"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, ArrowUpRight, FolderKanban, NotebookText, Wrench } from "lucide-react";
import { projects } from "@/lib/projects";
import { writeups } from "@/lib/writeups";
import { skillGroups } from "@/lib/data";
import SectionHeading from "@/components/section-heading";

type Result = {
  type: "Project" | "Write-up" | "Skill";
  title: string;
  description: string;
  href?: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const allResults: Result[] = useMemo(() => {
    const projectResults: Result[] = projects.map((p) => ({
      type: "Project",
      title: p.title,
      description: p.summary,
      href: `/projects/${p.slug}`,
    }));

    const writeupResults: Result[] = writeups.map((w) => ({
      type: "Write-up",
      title: w.title,
      description: w.summary,
      href: `/writeups/${w.slug}`,
    }));

    const skillResults: Result[] = skillGroups.flatMap((group) =>
      group.items.map((item) => ({
        type: "Skill" as const,
        title: item,
        description: group.category,
      }))
    );

    return [...projectResults, ...writeupResults, ...skillResults];
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
    );
  }, [query, allResults]);

  const typeIcon = { Project: FolderKanban, "Write-up": NotebookText, Skill: Wrench };

  return (
    <section className="section max-w-3xl">
      <SectionHeading
        kicker="// Search"
        title="Search"
        description="Searches across projects, write-ups, and skills. Try 'Splunk', 'Python', or 'Kerberos'."
      />

      <div className="relative mb-10">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, write-ups, skills..."
          className="w-full rounded-md border border-border-strong bg-bg-surface py-3 pl-11 pr-4 text-text placeholder:text-text-faint focus:border-accent"
        />
      </div>

      {query.trim() === "" && (
        <p className="font-mono text-xs text-text-faint">{`> awaiting input`}</p>
      )}

      {query.trim() !== "" && results.length === 0 && (
        <p className="text-text-muted">No matches for &quot;{query}&quot;.</p>
      )}

      <div className="space-y-3">
        {results.map((r, i) => {
          const Icon = typeIcon[r.type];
          const content = (
            <div className="card flex items-start gap-4 p-4">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-text-faint">
                    {r.type}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 font-medium text-text">
                  {r.title}
                  {r.href && <ArrowUpRight className="h-3.5 w-3.5 text-text-faint" />}
                </p>
                <p className="mt-0.5 truncate text-sm text-text-muted">{r.description}</p>
              </div>
            </div>
          );
          return r.href ? (
            <Link key={`${r.type}-${r.title}-${i}`} href={r.href}>
              {content}
            </Link>
          ) : (
            <div key={`${r.type}-${r.title}-${i}`}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

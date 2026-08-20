"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search as SearchIcon,
  ArrowUpRight,
  FolderKanban,
  NotebookText,
  Wrench,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Milestone,
  Server,
} from "lucide-react";
import SectionHeading from "@/components/section-heading";

export type SearchResult = {
  type: "Project" | "Write-up" | "Skill" | "Certification" | "Experience" | "Education" | "Journey" | "Home Lab";
  title: string;
  description: string;
  href?: string;
  /**
   * Extra terms to match against that aren't shown in the visible
   * description — e.g. an Experience entry's technologies, or a
   * Certification's skills. Existing result types (Project/Write-up/
   * Skill) never set this, so their matching behavior is unchanged:
   * title + description + type, same as before this field existed.
   */
  searchText?: string;
};

const typeIcon = {
  Project: FolderKanban,
  "Write-up": NotebookText,
  Skill: Wrench,
  Certification: BadgeCheck,
  Experience: Briefcase,
  Education: GraduationCap,
  Journey: Milestone,
  "Home Lab": Server,
};

export default function SearchClient({ allResults }: { allResults: SearchResult[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResults.filter((r) => {
      const haystack = [r.title, r.description, r.type, r.searchText].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query, allResults]);

  return (
    <section className="section max-w-3xl">
      <SectionHeading
        kicker="// Search"
        title="Search"
        description="Searches across projects, write-ups, skills, certifications, experience, education, journey, and home lab. Try 'Splunk', 'Python', or 'Kerberos'."
      />

      <div className="relative mb-10">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, write-ups, skills, certifications, experience..."
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
            <div className={`card flex animate-fade-in items-start gap-4 p-4 ${r.href ? "interactive-card" : ""}`}>
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

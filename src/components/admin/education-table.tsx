"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";
import EducationRowActions from "@/components/admin/education-row-actions";
import type { AdminEducationRow } from "@/lib/admin-content";

export default function EducationTable({ entries }: { entries: AdminEducationRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) => e.institution.toLowerCase().includes(q) || e.degree.toLowerCase().includes(q));
  }, [query, entries]);

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search education..."
          className="w-full rounded-md border border-border-strong bg-bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-accent"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Degree</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const fullIndex = entries.findIndex((full) => full.id === e.id);
              return (
                <tr key={e.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{e.institution}</td>
                  <td className="px-4 py-3 text-text-muted">{e.degree}</td>
                  <td className="px-4 py-3 text-text-muted">{e.is_current ? "Yes" : ""}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.content_status} />
                  </td>
                  <td className="px-4 py-3">
                    <EducationRowActions
                      id={e.id}
                      contentStatus={e.content_status}
                      isFirst={query.trim() !== "" || fullIndex === 0}
                      isLast={query.trim() !== "" || fullIndex === entries.length - 1}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-faint">
                  No entries match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

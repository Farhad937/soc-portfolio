"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";
import WriteupRowActions from "@/components/admin/writeup-row-actions";
import type { AdminWriteupRow } from "@/lib/admin-content";

export default function WriteupsTable({ writeups }: { writeups: AdminWriteupRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return writeups;
    const q = query.toLowerCase();
    return writeups.filter(
      (w) => w.title.toLowerCase().includes(q) || w.slug.toLowerCase().includes(q) || (w.category ?? "").toLowerCase().includes(q)
    );
  }, [query, writeups]);

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search write-ups..."
          className="w-full rounded-md border border-border-strong bg-bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-accent"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => {
              const fullIndex = writeups.findIndex((full) => full.id === w.id);
              return (
                <tr key={w.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{w.title}</td>
                  <td className="px-4 py-3 text-text-muted">{w.category}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={w.content_status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-faint">
                    {new Date(w.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {w.content_status === "published" && (
                      <Link href={`/writeups/${w.slug}`} target="_blank" className="text-text-faint hover:text-accent">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <WriteupRowActions
                      id={w.id}
                      contentStatus={w.content_status}
                      isFirst={query.trim() !== "" || fullIndex === 0}
                      isLast={query.trim() !== "" || fullIndex === writeups.length - 1}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-faint">
                  No write-ups match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

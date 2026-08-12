"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";
import HomeLabItemRowActions from "@/components/admin/homelab-item-row-actions";
import type { AdminHomeLabItemRow } from "@/lib/admin-content";

export default function HomeLabItemsTable({ items }: { items: AdminHomeLabItemRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q) || (i.category ?? "").toLowerCase().includes(q));
  }, [query, items]);

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search home lab items..."
          className="w-full rounded-md border border-border-strong bg-bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-accent"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => {
              const fullIndex = items.findIndex((full) => full.id === i.id);
              return (
                <tr key={i.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{i.name}</td>
                  <td className="px-4 py-3 text-text-muted">{i.category}</td>
                  <td className="px-4 py-3 text-text-muted">{i.status}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={i.content_status} />
                  </td>
                  <td className="px-4 py-3">
                    <HomeLabItemRowActions
                      id={i.id}
                      contentStatus={i.content_status}
                      isFirst={query.trim() !== "" || fullIndex === 0}
                      isLast={query.trim() !== "" || fullIndex === items.length - 1}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-faint">
                  No items match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

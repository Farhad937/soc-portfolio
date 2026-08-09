"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "@/components/admin/status-badge";
import CertificationRowActions from "@/components/admin/certification-row-actions";
import type { AdminCertificationRow } from "@/lib/admin-content";

export default function CertificationsTable({ certifications }: { certifications: AdminCertificationRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return certifications;
    const q = query.toLowerCase();
    return certifications.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.issuer ?? "").toLowerCase().includes(q)
    );
  }, [query, certifications]);

  return (
    <>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search certifications..."
          className="w-full rounded-md border border-border-strong bg-bg-surface py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-faint focus:border-accent"
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-text-faint">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Issuer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Publish State</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const fullIndex = certifications.findIndex((full) => full.id === c.id);
              return (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text">{c.name}</td>
                  <td className="px-4 py-3 text-text-muted">{c.issuer}</td>
                  <td className="px-4 py-3 text-text-muted">{c.status}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.content_status} />
                  </td>
                  <td className="px-4 py-3">
                    <CertificationRowActions
                      id={c.id}
                      contentStatus={c.content_status}
                      isFirst={query.trim() !== "" || fullIndex === 0}
                      isLast={query.trim() !== "" || fullIndex === certifications.length - 1}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-faint">
                  No certifications match &quot;{query}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Copy, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Archive } from "lucide-react";
import {
  deleteEducation,
  duplicateEducation,
  setEducationStatus,
  reorderEducation,
} from "@/lib/admin-content/education-mutations";

export default function EducationRowActions({
  id,
  contentStatus,
  isFirst,
  isLast,
}: {
  id: string;
  contentStatus: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this education entry permanently? This cannot be undone.")) return;
    startTransition(() => deleteEducation(id));
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/education/${id}`} className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-accent" title="Edit">
        <Pencil className="h-3.5 w-3.5" />
      </Link>

      {contentStatus === "published" ? (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setEducationStatus(id, "draft"))}
          className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-warning disabled:opacity-40"
          title="Unpublish"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setEducationStatus(id, "published"))}
          className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-success disabled:opacity-40"
          title="Publish"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}

      {contentStatus !== "archived" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setEducationStatus(id, "archived"))}
          className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-text disabled:opacity-40"
          title="Archive"
        >
          <Archive className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        disabled={isPending}
        onClick={() => startTransition(() => duplicateEducation(id))}
        className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-accent disabled:opacity-40"
        title="Duplicate"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

      <button
        disabled={isPending || isFirst}
        onClick={() => startTransition(() => reorderEducation(id, "up"))}
        className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-text disabled:opacity-30"
        title="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button
        disabled={isPending || isLast}
        onClick={() => startTransition(() => reorderEducation(id, "down"))}
        className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-text disabled:opacity-30"
        title="Move down"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </button>

      <button
        disabled={isPending}
        onClick={handleDelete}
        className="rounded p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger disabled:opacity-40"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

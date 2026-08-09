"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Copy, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Archive } from "lucide-react";
import {
  deleteWriteup,
  duplicateWriteup,
  setWriteupStatus,
  reorderWriteup,
} from "@/lib/admin-content/writeups-mutations";

export default function WriteupRowActions({
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
    if (!confirm("Delete this write-up permanently? This cannot be undone.")) return;
    startTransition(() => deleteWriteup(id));
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/writeups/${id}`} className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-accent" title="Edit">
        <Pencil className="h-3.5 w-3.5" />
      </Link>

      {contentStatus === "published" ? (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setWriteupStatus(id, "draft"))}
          className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-warning disabled:opacity-40"
          title="Unpublish"
        >
          <EyeOff className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setWriteupStatus(id, "published"))}
          className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-success disabled:opacity-40"
          title="Publish"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      )}

      {contentStatus !== "archived" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setWriteupStatus(id, "archived"))}
          className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-text disabled:opacity-40"
          title="Archive"
        >
          <Archive className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        disabled={isPending}
        onClick={() => startTransition(() => duplicateWriteup(id))}
        className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-accent disabled:opacity-40"
        title="Duplicate"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

      <button
        disabled={isPending || isFirst}
        onClick={() => startTransition(() => reorderWriteup(id, "up"))}
        className="rounded p-1.5 text-text-faint hover:bg-bg-raised hover:text-text disabled:opacity-30"
        title="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button
        disabled={isPending || isLast}
        onClick={() => startTransition(() => reorderWriteup(id, "down"))}
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

import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import type { Writeup } from "@/lib/writeups";

export default function WriteupCard({ writeup }: { writeup: Writeup }) {
  return (
    <Link
      href={`/writeups/${writeup.slug}`}
      className="card group flex flex-col justify-between p-6"
    >
      <div>
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-text-faint">
          <span>{writeup.category}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {writeup.readingTime}
          </span>
        </div>
        <h3 className="flex items-center gap-1.5 text-lg font-semibold text-text group-hover:text-accent">
          {writeup.title}
          <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </h3>
        <p className="mt-2 text-sm text-text-muted">{writeup.summary}</p>
      </div>
      <span className="tag mt-5 w-fit">{writeup.difficulty}</span>
    </Link>
  );
}

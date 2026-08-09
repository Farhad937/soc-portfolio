"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldHalf, Search } from "lucide-react";
import { navLinks } from "@/lib/site";
import type { getSiteSettings } from "@/lib/content/site-settings";

type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;

// navLinks stays a static import deliberately — nav structure is
// application configuration, not CMS content (see the CMS architecture
// notes: navigation/layout/UI components remain static for now).
export default function Nav({ site }: { site: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur">
      {/* signature element: live status strip */}
      <div className="hidden border-b border-border/60 bg-bg-surface/60 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-1.5 font-mono text-[11px] tracking-wide text-text-faint md:px-8">
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            STATUS: {site.statusText}
          </span>
          <span>{site.location.toUpperCase()}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <ShieldHalf className="h-5 w-5 text-accent" strokeWidth={2} />
          <span>{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "text-accent" : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className={`hidden rounded-md p-2 lg:flex ${
              pathname === "/search" ? "text-accent" : "text-text-muted hover:text-text"
            }`}
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>

          <button
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-bg px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm ${
                pathname === "/search" ? "text-accent" : "text-text-muted"
              }`}
            >
              <Search className="h-4 w-4" /> Search
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm ${
                  pathname === link.href ? "text-accent" : "text-text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

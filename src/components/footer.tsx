import { Github, Linkedin, Mail, Terminal, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { getSiteSettings } from "@/lib/content/site-settings";

type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;

export default function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-mono text-xs text-text-faint">
            {`> log --tail`} {site.name.toLowerCase().replace(" ", "-")}.portfolio
          </p>
          <p className="mt-1 text-sm text-text-muted">
            © {new Date().getFullYear()} {site.name}. Built for the long game, not one interview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted transition-all hover:-translate-y-0.5 hover:text-accent focus-visible:-translate-y-0.5 focus-visible:text-accent" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
          <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted transition-all hover:-translate-y-0.5 hover:text-accent focus-visible:-translate-y-0.5 focus-visible:text-accent" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={site.tryhackmeUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted transition-all hover:-translate-y-0.5 hover:text-accent focus-visible:-translate-y-0.5 focus-visible:text-accent" aria-label="TryHackMe">
            <Terminal className="h-5 w-5" />
          </a>
          <a href={`mailto:${site.email}`} className="text-text-muted transition-all hover:-translate-y-0.5 hover:text-accent focus-visible:-translate-y-0.5 focus-visible:text-accent" aria-label="Email">
            <Mail className="h-5 w-5" />
          </a>
          <Link href="/admin/login" className="text-text-faint hover:text-accent" aria-label="Admin">
            <LockKeyhole className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

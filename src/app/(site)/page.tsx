import Link from "next/link";
import { ArrowRight, FileDown, FolderKanban, Mail, NotebookText } from "lucide-react";
import { getSiteSettings } from "@/lib/content/site-settings";
import { getProjects } from "@/lib/content/projects";
import { getWriteups } from "@/lib/content/writeups";
import ProjectCard from "@/components/project-card";
import WriteupCard from "@/components/writeup-card";
import SectionHeading from "@/components/section-heading";

export const revalidate = 3600; // ISR: re-fetch from Supabase at most once/hour

export default async function Home() {
  const [site, projects, writeups] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getWriteups(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-8 md:py-32">
          <p className="kicker mb-5 animate-fade-in">
            {`> whoami`}
          </p>
          <h1 className="max-w-3xl animate-fade-in text-4xl font-semibold leading-[1.1] tracking-tight text-text md:text-6xl">
            Hi, I&apos;m {site.name}.
          </h1>
          <p className="mt-6 max-w-xl animate-fade-in text-lg text-text-muted [animation-delay:100ms]">
            {site.role} with a background in engineering, translation, and data analysis.
            I&apos;m building hands-on defensive security skills through structured learning,
            home lab projects, and detection research.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary">
              View Projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/writeups" className="btn-secondary">
              Read My Write-ups
            </Link>
            <Link href="/resume" className="btn-secondary">
              <FileDown className="h-4 w-4" /> Download CV
            </Link>
            <Link href="/contact" className="btn-secondary">
              <Mail className="h-4 w-4" /> Contact Me
            </Link>
          </div>
        </div>
      </section>

      {/* Currently studying strip */}
      <section className="border-b border-border bg-bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="log-divider flex-1">Currently Studying</p>
            <Link href="/dashboard" className="ml-4 shrink-0 font-mono text-[11px] uppercase tracking-wide text-text-faint hover:text-accent">
              View Dashboard →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Security+", "TryHackMe", "Home Lab", "Python", "Windows Internals"].map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="section">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeading
            kicker="// Selected Work"
            title="Recent Projects"
            description="Home lab builds and investigations, documented the same way I'd document a real incident."
          />
          <Link href="/projects" className="hidden shrink-0 items-center gap-1 text-sm text-accent hover:text-accent-bright md:flex">
            <FolderKanban className="h-4 w-4" /> All projects
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.slice(0, 4).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* Featured writeups */}
      <section className="section border-t border-border">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeading
            kicker="// Notes"
            title="Latest Write-ups"
            description="Concept explanations from my own study — never TryHackMe flags or full walkthroughs."
          />
          <Link href="/writeups" className="hidden shrink-0 items-center gap-1 text-sm text-accent hover:text-accent-bright md:flex">
            <NotebookText className="h-4 w-4" /> All write-ups
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {writeups.slice(0, 4).map((w) => (
            <WriteupCard key={w.slug} writeup={w} />
          ))}
        </div>
      </section>
    </>
  );
}

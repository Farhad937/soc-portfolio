import Link from "next/link";
import { ArrowRight, FileDown, FolderKanban, Mail, NotebookText } from "lucide-react";
import { getSiteSettings } from "@/lib/content/site-settings";
import { getProjects } from "@/lib/content/projects";
import { getWriteups } from "@/lib/content/writeups";
import { getAboutPageContent } from "@/lib/content/about";
import ProjectCard from "@/components/project-card";
import WriteupCard from "@/components/writeup-card";
import SectionHeading from "@/components/section-heading";
import ProfileImageFrame from "@/components/profile-image-frame";
import ScrollRevealGrid from "@/components/scroll-reveal-grid";
import { getStaticPageMetadata } from "@/lib/content/seo";

export const revalidate = 3600; // ISR: re-fetch from Supabase at most once/hour

export async function generateMetadata() {
  return getStaticPageMetadata("/");
}

export default async function Home() {
  const [site, projects, writeups, about] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getWriteups(),
    getAboutPageContent(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className={`mx-auto max-w-5xl px-6 py-24 md:px-8 md:py-32 ${about.profileImage ? "grid items-center gap-12 md:grid-cols-[1.4fr_1fr]" : ""}`}>
          <div>
            <p className="kicker mb-5 animate-hero-kicker">
              {site.heroKicker}
            </p>
            <h1 className="max-w-3xl animate-hero-heading text-4xl font-semibold leading-[1.1] tracking-tight text-text [animation-delay:75ms] md:text-6xl">
              Hi, I&apos;m {site.name}.
            </h1>
            <p className="mt-6 max-w-xl animate-fade-in text-lg text-text-muted [animation-delay:150ms]">
              {site.role} {site.heroDescription}
            </p>

            <div className="mt-10 grid grid-cols-2 justify-center gap-3 sm:flex sm:flex-wrap sm:justify-start">
              <Link href={site.heroButtons[0].url} className="btn-primary group w-full justify-center animate-scale-in hover:-translate-y-1 hover:scale-[1.02] sm:w-auto [animation-delay:225ms]">
                {site.heroButtons[0].label} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </Link>
              <Link href={site.heroButtons[1].url} className="btn-secondary w-full justify-center animate-scale-in hover:-translate-y-1 hover:border-accent hover:bg-bg-surface sm:w-auto [animation-delay:275ms]">
                {site.heroButtons[1].label}
              </Link>
              <Link href={site.heroButtons[2].url} className="btn-secondary group w-full justify-center animate-scale-in hover:-translate-y-1 hover:border-accent sm:w-auto [animation-delay:325ms]">
                <FileDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5" /> {site.heroButtons[2].label}
              </Link>
              <Link href={site.heroButtons[3].url} className="btn-secondary group w-full justify-center animate-scale-in hover:-translate-y-1 hover:border-accent sm:w-auto [animation-delay:375ms]">
                <Mail className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:-rotate-6 group-focus-visible:-translate-y-0.5 group-focus-visible:-rotate-6" /> {site.heroButtons[3].label}
              </Link>
            </div>
          </div>
          {about.profileImage && (
            <div className="animate-slide-in justify-self-center md:justify-self-end">
              <div className="card about-profile-card w-full p-6">
                <ProfileImageFrame src={about.profileImage} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Currently studying strip */}
      <section className="border-b border-border bg-bg-surface/70">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-8">
          <div className="mb-4 flex animate-slide-in items-center justify-between">
            <p className="log-divider flex-1 text-highlight">Currently Studying</p>
            <Link href="/dashboard" className="motion-link ml-4 shrink-0 font-mono text-[11px] uppercase tracking-wide text-text-faint transition-colors hover:text-accent">
              View Dashboard →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {site.currentlyStudying.map((s, index) => (
              <span key={s} className="tag animate-scale-in transition-all hover:-translate-y-0.5 hover:border-highlight/70 hover:bg-highlight/10 hover:text-text" style={{ animationDelay: `${100 + index * 60}ms` }}>{s}</span>
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
            motion="home"
            description="Home lab builds and investigations, documented the same way I'd document a real incident."
          />
          <Link href="/projects" className="motion-link group hidden shrink-0 items-center gap-1 text-sm text-accent transition-colors hover:text-accent-bright md:flex">
            <FolderKanban className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> All projects
          </Link>
        </div>
        <ScrollRevealGrid className="grid gap-5 sm:grid-cols-2">
          {projects.slice(0, 4).map((p, index) => (
            <ProjectCard key={p.slug} project={p} index={index} motion="home" />
          ))}
        </ScrollRevealGrid>
      </section>

      {/* Featured writeups */}
      <section className="section border-t border-border">
        <div className="mb-12 flex items-end justify-between">
          <SectionHeading
            kicker="// Notes"
            title="Latest Write-ups"
            motion="home"
            highlight
            description="Concept explanations from my own study — never TryHackMe flags or full walkthroughs."
          />
          <Link href="/writeups" className="motion-link group hidden shrink-0 items-center gap-1 text-sm text-accent transition-colors hover:text-accent-bright md:flex">
            <NotebookText className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> All write-ups
          </Link>
        </div>
        <ScrollRevealGrid className="grid gap-5 sm:grid-cols-2">
          {writeups.slice(0, 4).map((w, index) => (
            <WriteupCard key={w.slug} writeup={w} index={index} motion="home" />
          ))}
        </ScrollRevealGrid>
      </section>
    </>
  );
}

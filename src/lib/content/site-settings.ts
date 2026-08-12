import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { site as staticSite } from "@/lib/site";

/**
 * site_settings is a single-row table. Falls back to the static `site`
 * object from src/lib/site.ts, reshaped to match the DB's flat columns.
 */
export const getSiteSettings = cache(async function getSiteSettings() {
  const supabase = getSupabaseServerClient();
  const fallback = {
    name: staticSite.name,
    role: staticSite.role,
    tagline: staticSite.tagline,
    location: staticSite.location,
    email: staticSite.email,
    githubUrl: staticSite.links.github,
    linkedinUrl: staticSite.links.linkedin,
    tryhackmeUrl: staticSite.links.tryhackme,
    statusText: staticSite.status,
    learningHours: staticSite.stats.learningHours,
    githubRepos: staticSite.stats.githubRepos,
    blogArticles: staticSite.stats.blogArticles,
    // Hero/homepage fields — fallback matches the original hardcoded
    // JSX exactly, same philosophy as the Home Lab page-content
    // fallback: if Supabase is unavailable, the homepage still shows
    // meaningful content instead of blank fields.
    heroKicker: "> whoami",
    heroDescription:
      "with a background in engineering, translation, and data analysis. I'm building hands-on defensive security skills through structured learning, home lab projects, and detection research.",
    heroButtons: [
      { label: "View Projects", url: "/projects" },
      { label: "Read My Write-ups", url: "/writeups" },
      { label: "Download CV", url: "/resume" },
      { label: "Contact Me", url: "/contact" },
    ],
    currentlyStudying: ["Security+", "TryHackMe", "Home Lab", "Python", "Windows Internals"],
  };

  if (!supabase) return fallback;

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  if (error) {
    console.warn("[getSiteSettings] Supabase query failed, falling back to static data:", error.message);
    return fallback;
  }
  if (!data) return fallback;
  const row = data as any;

  return {
    name: row.name,
    role: row.role,
    tagline: row.tagline,
    location: row.location,
    email: row.email,
    githubUrl: row.github_url ?? staticSite.links.github,
    linkedinUrl: row.linkedin_url ?? staticSite.links.linkedin,
    tryhackmeUrl: row.tryhackme_url ?? staticSite.links.tryhackme,
    statusText: row.status_text,
    learningHours: row.learning_hours,
    githubRepos: row.github_repos,
    blogArticles: row.blog_articles,
    heroKicker: row.hero_kicker ?? fallback.heroKicker,
    heroDescription: row.hero_description ?? fallback.heroDescription,
    heroButtons: [
      { label: row.hero_button_1_label ?? fallback.heroButtons[0].label, url: row.hero_button_1_url ?? fallback.heroButtons[0].url },
      { label: row.hero_button_2_label ?? fallback.heroButtons[1].label, url: row.hero_button_2_url ?? fallback.heroButtons[1].url },
      { label: row.hero_button_3_label ?? fallback.heroButtons[2].label, url: row.hero_button_3_url ?? fallback.heroButtons[2].url },
      { label: row.hero_button_4_label ?? fallback.heroButtons[3].label, url: row.hero_button_4_url ?? fallback.heroButtons[3].url },
    ],
    currentlyStudying: (row.currently_studying ?? fallback.currentlyStudying) as string[],
  };
});

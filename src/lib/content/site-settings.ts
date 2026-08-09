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
  };
});

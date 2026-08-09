import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { projects as staticProjects, getProject as getStaticProject, type Project } from "@/lib/projects";

/**
 * Maps a Supabase `projects` row (snake_case, DB-shaped) onto the existing
 * app-facing `Project` type (camelCase) so every page and component that
 * already consumes `Project` keeps working unchanged, regardless of which
 * source the data came from.
 */
function mapRow(row: Record<string, any>): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    difficulty: row.difficulty,
    status: row.status,
    timeInvested: row.time_invested ?? "",
    tech: row.tech ?? [],
    skills: row.skills ?? [],
    overview: row.overview ?? "",
    objective: row.objective ?? "",
    environment: row.environment ?? "",
    toolsUsed: row.tools_used ?? [],
    challenges: row.challenges ?? "",
    investigation: row.investigation ?? "",
    findings: row.findings ?? "",
    lessonsLearned: row.lessons_learned ?? "",
    futureImprovements: row.future_improvements ?? "",
    githubUrl: row.github_url ?? undefined,
  };
}

/**
 * Returns all published projects, ordered the way the CMS specifies.
 * Falls back to the static src/lib/projects.ts array if Supabase isn't
 * configured yet, the query errors, or migration hasn't run (empty
 * result) — this keeps the site fully working at every stage of the
 * CMS rollout.
 */
export const getProjects = cache(async function getProjects(): Promise<Project[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return staticProjects;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getProjects] Supabase query failed, falling back to static data:", error.message);
    return staticProjects;
  }
  if (!data || data.length === 0) return staticProjects;

  return data.map(mapRow);
});

export const getProjectBySlug = cache(async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getStaticProject(slug);

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("content_status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn("[getProjectBySlug] Supabase query failed, falling back to static data:", error.message);
    return getStaticProject(slug);
  }
  if (!data) return getStaticProject(slug);

  return mapRow(data);
});

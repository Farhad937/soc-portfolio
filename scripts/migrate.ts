/**
 * One-time (but re-runnable) migration: reads the existing static TS
 * data files and upserts them into Supabase, preserving slugs, order,
 * and marking everything `published` since it's already-live content.
 *
 * Run locally, never in CI or on a server:
 *   npm run migrate
 *
 * Requires SUPABASE_SECRET_KEY to be populated in .env.local — this
 * script is the ONLY place in the codebase that uses that key. It is
 * never imported by any app code, page, or component.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { site } from "../src/lib/site";
import { projects } from "../src/lib/projects";
import { writeups } from "../src/lib/writeups";
import { skillGroups, certifications, timeline, thmPaths } from "../src/lib/data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local.\n" +
      "Fill in SUPABASE_SECRET_KEY (Project Settings → API → service_role) before running this."
  );
  process.exit(1);
}

// Service-role client — bypasses RLS. Local script use only.
const supabase = createClient(supabaseUrl, secretKey);

async function migrateSiteSettings() {
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    name: site.name,
    role: site.role,
    tagline: site.tagline,
    location: site.location,
    email: site.email,
    github_url: site.links.github,
    linkedin_url: site.links.linkedin,
    tryhackme_url: site.links.tryhackme,
    status_text: site.status,
    learning_hours: site.stats.learningHours,
    github_repos: site.stats.githubRepos,
    blog_articles: site.stats.blogArticles,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`site_settings: ${error.message}`);
  console.log("✓ site_settings");
}

async function migrateProjects() {
  const rows = projects.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    difficulty: p.difficulty,
    status: p.status,
    time_invested: p.timeInvested,
    tech: p.tech,
    skills: p.skills,
    overview: p.overview,
    objective: p.objective,
    environment: p.environment,
    tools_used: p.toolsUsed,
    challenges: p.challenges,
    investigation: p.investigation,
    findings: p.findings,
    lessons_learned: p.lessonsLearned,
    future_improvements: p.futureImprovements,
    github_url: p.githubUrl ?? null,
    order_index: i,
    content_status: "published",
  }));
  const { error } = await supabase.from("projects").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`projects: ${error.message}`);
  console.log(`✓ projects (${rows.length})`);
}

async function migrateWriteups() {
  const rows = writeups.map((w, i) => ({
    slug: w.slug,
    title: w.title,
    category: w.category,
    reading_time: w.readingTime,
    difficulty: w.difficulty,
    summary: w.summary,
    concept: w.concept,
    key_takeaways: w.keyTakeaways,
    references: w.references,
    order_index: i,
    content_status: "published",
  }));
  const { error } = await supabase.from("writeups").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`writeups: ${error.message}`);
  console.log(`✓ writeups (${rows.length})`);
}

async function migrateCertifications() {
  // No stable natural key in the static data, so this table is
  // append-only on repeat runs. Fine for a one-time migration; the
  // Phase 2 admin UI will manage these by primary key going forward.
  const rows = certifications.map((c, i) => ({
    name: c.name,
    issuer: c.issuer,
    date: c.date,
    skills: c.skills,
    credential_url: c.credentialUrl ?? null,
    status: c.status,
    order_index: i,
    content_status: "published",
  }));
  const { error } = await supabase.from("certifications").insert(rows);
  if (error) throw new Error(`certifications: ${error.message}`);
  console.log(`✓ certifications (${rows.length})`);
}

async function migrateTimeline() {
  const rows = timeline.map((t, i) => ({
    date: t.date,
    title: t.title,
    description: t.description ?? null,
    order_index: i,
    content_status: "published",
  }));
  const { error } = await supabase.from("timeline_entries").insert(rows);
  if (error) throw new Error(`timeline_entries: ${error.message}`);
  console.log(`✓ timeline_entries (${rows.length})`);
}

async function migrateSkills() {
  for (let i = 0; i < skillGroups.length; i++) {
    const group = skillGroups[i];
    const { data: groupRow, error: groupError } = await supabase
      .from("skill_groups")
      .upsert({ category: group.category, order_index: i }, { onConflict: "category" })
      .select()
      .single();
    if (groupError) throw new Error(`skill_groups (${group.category}): ${groupError.message}`);

    const skillRows = group.items.map((name, j) => ({
      skill_group_id: groupRow.id,
      name,
      order_index: j,
    }));
    const { error: skillsError } = await supabase.from("skills").insert(skillRows);
    if (skillsError) throw new Error(`skills (${group.category}): ${skillsError.message}`);
  }
  console.log(`✓ skill_groups + skills (${skillGroups.length} groups)`);
}

async function migrateThm() {
  for (let i = 0; i < thmPaths.length; i++) {
    const path = thmPaths[i];
    const { data: pathRow, error: pathError } = await supabase
      .from("tryhackme_paths")
      .upsert({ name: path.name, progress: path.progress, order_index: i }, { onConflict: "name" })
      .select()
      .single();
    if (pathError) throw new Error(`tryhackme_paths (${path.name}): ${pathError.message}`);

    const roomRows = path.rooms.map((room, j) => ({
      path_id: pathRow.id,
      name: room.name,
      status: room.status,
      order_index: j,
    }));
    const { error: roomsError } = await supabase.from("tryhackme_rooms").insert(roomRows);
    if (roomsError) throw new Error(`tryhackme_rooms (${path.name}): ${roomsError.message}`);
  }
  console.log(`✓ tryhackme_paths + tryhackme_rooms (${thmPaths.length} paths)`);
}

async function main() {
  console.log("Migrating static content to Supabase...\n");
  await migrateSiteSettings();
  await migrateProjects();
  await migrateWriteups();
  await migrateCertifications();
  await migrateTimeline();
  await migrateSkills();
  await migrateThm();
  console.log("\nDone. Compare the public pages against the live site to confirm nothing changed.");
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  console.error(
    "\nNote: certifications, timeline_entries, skill_groups/skills, and\n" +
      "tryhackme_paths/rooms are NOT upserted on slug — re-running this\n" +
      "script after a partial failure may create duplicates in those\n" +
      "tables. If that happens, truncate the affected table(s) in the\n" +
      "Supabase SQL Editor and re-run."
  );
  process.exit(1);
});

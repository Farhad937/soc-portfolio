import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { writeups as staticWriteups, getWriteup as getStaticWriteup, type Writeup } from "@/lib/writeups";

function mapRow(row: Record<string, any>): Writeup {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    readingTime: row.reading_time ?? "",
    difficulty: row.difficulty,
    summary: row.summary ?? "",
    concept: row.concept ?? "",
    keyTakeaways: row.key_takeaways ?? [],
    references: row.references ?? [],
  };
}

export const getWriteups = cache(async function getWriteups(): Promise<Writeup[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return staticWriteups;

  const { data, error } = await supabase
    .from("writeups")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getWriteups] Supabase query failed, falling back to static data:", error.message);
    return staticWriteups;
  }
  if (!data || data.length === 0) return staticWriteups;

  return data.map(mapRow);
});

export const getWriteupBySlug = cache(async function getWriteupBySlug(slug: string): Promise<Writeup | undefined> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return getStaticWriteup(slug);

  const { data, error } = await supabase
    .from("writeups")
    .select("*")
    .eq("content_status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn("[getWriteupBySlug] Supabase query failed, falling back to static data:", error.message);
    return getStaticWriteup(slug);
  }
  if (!data) return getStaticWriteup(slug);

  return mapRow(data);
});

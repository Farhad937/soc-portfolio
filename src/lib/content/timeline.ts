import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { timeline as staticTimeline, type TimelineEntry } from "@/lib/data";

function mapRow(row: Record<string, any>): TimelineEntry {
  return {
    date: row.date ?? "",
    title: row.title,
    description: row.description ?? undefined,
  };
}

export const getTimeline = cache(async function getTimeline(): Promise<TimelineEntry[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return staticTimeline;

  const { data, error } = await supabase
    .from("timeline_entries")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getTimeline] Supabase query failed, falling back to static data:", error.message);
    return staticTimeline;
  }
  if (!data || data.length === 0) return staticTimeline;

  return data.map(mapRow);
});

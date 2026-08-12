import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type HomeLabItem = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  status: string | null;
  link: string | null;
};

/**
 * No static fallback — same as Experience/Education/Journey's new
 * entries, this never had static data. If Supabase is unavailable,
 * returns an empty array and the /homelab page's VM list section
 * simply renders nothing, rather than crashing.
 */
export const getHomeLabItems = cache(async (): Promise<HomeLabItem[]> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("home_lab_items")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getHomeLabItems] Supabase query failed:", error.message);
    return [];
  }
  return data ?? [];
});

export type HomeLabPageContent = {
  hardwareDescription: string | null;
  virtualizationDescription: string | null;
  networkDiagramNote: string | null;
  futureAdditions: string[];
};

/**
 * No static fallback. If Supabase is unavailable or the query fails,
 * return empty content rather than publishing stale hardcoded content.
 */
const EMPTY_CONTENT: HomeLabPageContent = {
  hardwareDescription: null,
  virtualizationDescription: null,
  networkDiagramNote: null,
  futureAdditions: [],
};

export const getHomeLabPageContent = cache(async (): Promise<HomeLabPageContent> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return EMPTY_CONTENT;

  const { data, error } = await supabase
    .from("home_lab_page_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.warn("[getHomeLabPageContent] Supabase query failed:", error.message);
    return EMPTY_CONTENT;
  }

  if (!data) return EMPTY_CONTENT;

  return {
    hardwareDescription: data.hardware_description,
    virtualizationDescription: data.virtualization_description,
    networkDiagramNote: data.network_diagram_note,
    futureAdditions: data.future_additions ?? [],
  };
});
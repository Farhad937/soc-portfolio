import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[];
  technologies: string[];
};

/**
 * No static fallback here — unlike Projects/Write-ups/etc., Experience
 * never had static data to fall back to (it didn't exist before Phase
 * 10). If Supabase is unavailable, this returns an empty array and the
 * About page simply doesn't render the section, rather than crashing.
 */
export const getExperience = cache(async (): Promise<ExperienceEntry[]> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getExperience] Supabase query failed:", error.message);
    return [];
  }
  return data ?? [];
});

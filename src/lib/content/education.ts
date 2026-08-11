import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[];
};

/**
 * No static fallback — same as Experience, Education never had static
 * data to fall back to. If Supabase is unavailable, this returns an
 * empty array and the About page simply doesn't render the section.
 */
export const getEducation = cache(async (): Promise<EducationEntry[]> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getEducation] Supabase query failed:", error.message);
    return [];
  }
  return data ?? [];
});

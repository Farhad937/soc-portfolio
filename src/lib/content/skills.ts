import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { skillGroups as staticSkillGroups } from "@/lib/data";

export type SkillGroup = { category: string; items: string[] };

/**
 * skill_groups + skills are normalized in the DB (one row per skill) so
 * a CMS can add/remove individual skills. This reassembles them back
 * into the { category, items[] } shape every existing page expects.
 */
export const getSkillGroups = cache(async function getSkillGroups(): Promise<SkillGroup[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return staticSkillGroups;

  const { data: groups, error: groupsError } = await supabase
    .from("skill_groups")
    .select("*")
    .order("order_index", { ascending: true });

  if (groupsError || !groups || groups.length === 0) {
    if (groupsError) {
      console.warn("[getSkillGroups] Supabase query failed, falling back to static data:", groupsError.message);
    }
    return staticSkillGroups;
  }

  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  if (skillsError) {
    console.warn("[getSkillGroups] Failed to load skills, falling back to static data:", skillsError.message);
    return staticSkillGroups;
  }

  return (groups as any[]).map((group) => ({
    category: group.category,
    items: ((skills as any[]) ?? [])
      .filter((s) => s.skill_group_id === group.id)
      .map((s) => s.name),
  }));
});

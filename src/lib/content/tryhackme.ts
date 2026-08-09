import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { thmPaths as staticThmPaths, type ThmPath } from "@/lib/data";

export const getThmPaths = cache(async function getThmPaths(): Promise<ThmPath[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return staticThmPaths;

  const { data: paths, error: pathsError } = await supabase
    .from("tryhackme_paths")
    .select("*")
    .order("order_index", { ascending: true });

  if (pathsError || !paths || paths.length === 0) {
    if (pathsError) {
      console.warn("[getThmPaths] Supabase query failed, falling back to static data:", pathsError.message);
    }
    return staticThmPaths;
  }

  const { data: rooms, error: roomsError } = await supabase
    .from("tryhackme_rooms")
    .select("*")
    .order("order_index", { ascending: true });

  if (roomsError) {
    console.warn("[getThmPaths] Failed to load rooms, falling back to static data:", roomsError.message);
    return staticThmPaths;
  }

  return (paths as any[]).map((path) => ({
    name: path.name,
    progress: path.progress,
    rooms: ((rooms as any[]) ?? [])
      .filter((r) => r.path_id === path.id)
      .map((r) => ({ name: r.name, status: r.status ?? "Not Started" })),
  }));
});

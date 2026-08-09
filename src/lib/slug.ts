import "server-only";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Returns a slug guaranteed unique in `table`, appending -2, -3, etc.
 * if the base slug collides. `excludeId` lets an update skip colliding
 * with its own current row.
 */
export async function ensureUniqueSlug(
  supabase: any,
  table: string,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let candidate = baseSlug;
  let suffix = 2;

  // Bounded loop — a real content library won't plausibly hit 50
  // duplicate titles, and an unbounded loop here would be a bug, not a
  // feature.
  for (let attempts = 0; attempts < 50; attempts++) {
    let query = supabase.from(table).select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`ensureUniqueSlug: ${error.message}`);
    if (!data) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix++;
  }
  throw new Error(`ensureUniqueSlug: could not find a unique slug for "${baseSlug}"`);
}

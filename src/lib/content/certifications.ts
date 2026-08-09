import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { certifications as staticCertifications, type Certification } from "@/lib/data";

function mapRow(row: Record<string, any>): Certification {
  return {
    name: row.name,
    issuer: row.issuer ?? "",
    date: row.date ?? "",
    skills: row.skills ?? [],
    credentialUrl: row.credential_url ?? undefined,
    status: row.status,
  };
}

export const getCertifications = cache(async function getCertifications(): Promise<Certification[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return staticCertifications;

  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("content_status", "published")
    .order("order_index", { ascending: true });

  if (error) {
    console.warn("[getCertifications] Supabase query failed, falling back to static data:", error.message);
    return staticCertifications;
  }
  if (!data || data.length === 0) return staticCertifications;

  return data.map(mapRow);
});

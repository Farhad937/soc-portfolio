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
 * Fallback matches the original hardcoded JSX text exactly, so if
 * Supabase is unavailable, the page still shows meaningful content
 * instead of going blank — same fallback philosophy as site.ts, not
 * the "return []" pattern used for the VM list above (that one never
 * had real content to fall back to; this one did, until this phase).
 */
const FALLBACK: HomeLabPageContent = {
  hardwareDescription:
    "Replace with your actual laptop/desktop specs — CPU, RAM, storage. Hiring managers skim this to gauge how much you had to work around resource limits, which is itself a signal of resourcefulness.",
  virtualizationDescription: "VirtualBox, running on an isolated internal network (host-only adapter).",
  networkDiagramNote: "[ add your lab network diagram here — draw.io or Excalidraw export works well ]",
  futureAdditions: [
    "Splunk instance for centralized logging",
    "Security Onion for network-based detection",
    "Elastic stack as a second SIEM comparison point",
  ],
};

export const getHomeLabPageContent = cache(async (): Promise<HomeLabPageContent> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return FALLBACK;

  const { data, error } = await supabase.from("home_lab_page_content").select("*").eq("id", 1).maybeSingle();

  if (error) {
    console.warn("[getHomeLabPageContent] Supabase query failed:", error.message);
    return FALLBACK;
  }
  if (!data) return FALLBACK;

  return {
    hardwareDescription: data.hardware_description,
    virtualizationDescription: data.virtualization_description,
    networkDiagramNote: data.network_diagram_note,
    futureAdditions: data.future_additions ?? [],
  };
});

import { cache } from "react";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AboutPageContent = {
  profileImage: string | null;
  engineeringBackground: string | null;
  securityTransition: string | null;
  defensiveSecurityReason: string | null;
  currentFocus: string[];
  careerGoal: string | null;
};

/**
 * Fallback matches the original hardcoded JSX text exactly — same
 * philosophy as the Home Lab page-content loader. About is important
 * public content, so a temporary Supabase failure must not blank it.
 */
const FALLBACK: AboutPageContent = {
  profileImage: null,
  engineeringBackground:
    "Replace this paragraph with your engineering background — what you studied, what kind of problems you solved, and what that work taught you about systems thinking.",
  securityTransition:
    'Replace this paragraph with your transition story: what pulled you toward defensive security specifically, rather than security broadly. Being specific here (a moment, an article, a lab exercise that hooked you) reads far better than a generic "I\'ve always been interested in technology."',
  defensiveSecurityReason:
    "Replace this paragraph with why defensive security interests you over offensive — recruiters ask this in nearly every SOC interview, so having a real answer written down helps you say it clearly out loud too.",
  currentFocus: [
    "CompTIA Security+ study",
    "TryHackMe SOC Level 1 pathway",
    "Home lab: Active Directory + Splunk detection",
    "Python for security automation",
    "Windows internals and event log analysis",
  ],
  careerGoal:
    "Replace with one or two sentences on the specific kind of SOC role and environment you're targeting (e.g. MSSP vs in-house, Tier 1 entry point, industry you'd like to work in).",
};

export const getAboutPageContent = cache(async (): Promise<AboutPageContent> => {
  const supabase = getSupabaseServerClient();
  if (!supabase) return FALLBACK;

  const { data, error } = await supabase.from("about_page_content").select("*").eq("id", 1).maybeSingle();

  if (error) {
    console.warn("[getAboutPageContent] Supabase query failed:", error.message);
    return FALLBACK;
  }
  if (!data) return FALLBACK;

  return {
    profileImage: data.profile_image,
    engineeringBackground: data.engineering_background,
    securityTransition: data.security_transition,
    defensiveSecurityReason: data.defensive_security_reason,
    currentFocus: data.current_focus ?? [],
    careerGoal: data.career_goal,
  };
});

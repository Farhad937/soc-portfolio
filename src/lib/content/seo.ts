import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import type { SeoRoute } from "@/lib/seo-routes";

export type SeoMetadataRecord = {
  route: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
};

const staticDefaults: Record<SeoRoute, { title: string; description: string }> = {
  "/": {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  "/about": {
    title: `About — ${site.name}`,
    description: `Learn about ${site.name}'s transition into defensive security and SOC analysis.`,
  },
  "/projects": {
    title: `Projects — ${site.name}`,
    description: "Home lab builds and defensive security investigations documented from objective through findings.",
  },
  "/writeups": {
    title: `Write-ups — ${site.name}`,
    description: "Cybersecurity concept explanations focused on the ideas behind defensive security work.",
  },
  "/skills": {
    title: `Skills — ${site.name}`,
    description: "Security tools, platforms, and analytical skills developed for SOC and blue-team work.",
  },
  "/certifications": {
    title: `Certifications — ${site.name}`,
    description: "Current and planned cybersecurity certifications, learning milestones, and verified credentials.",
  },
  "/journey": {
    title: `Learning Journey — ${site.name}`,
    description: "A timeline of structured cybersecurity learning, projects, and career progress.",
  },
  "/homelab": {
    title: `Home Lab — ${site.name}`,
    description: "A hands-on cybersecurity home lab for building and testing defensive security skills.",
  },
  "/resume": {
    title: `Resume — ${site.name}`,
    description: `View ${site.name}'s SOC analyst resume, background, and current cybersecurity focus.`,
  },
  "/contact": {
    title: `Contact — ${site.name}`,
    description: `Get in touch with ${site.name} about SOC analyst and defensive security opportunities.`,
  },
  "/tryhackme": {
    title: `TryHackMe Progress — ${site.name}`,
    description: "Track hands-on TryHackMe learning paths and cybersecurity practice progress.",
  },
};

function optionalText(value: string | null | undefined) {
  return value?.trim() || undefined;
}

function safeHttpUrl(value: string | null | undefined) {
  const candidate = optionalText(value);
  if (!candidate) return undefined;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function configuredSiteUrl() {
  return safeHttpUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL);
}

function routeUrl(route: string) {
  const base = configuredSiteUrl();
  return base ? new URL(route, base).toString() : undefined;
}

export const getSeoMetadata = cache(async function getSeoMetadata(route: string): Promise<SeoMetadataRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("seo_metadata")
    .select("route, title, description, og_title, og_description, og_image, canonical_url")
    .eq("route", route)
    .maybeSingle();

  if (error) {
    console.warn("[getSeoMetadata] Supabase query failed, falling back to page metadata:", error.message);
    return null;
  }
  return data as SeoMetadataRecord | null;
});

export function buildMetadata({
  route,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
  type = "website",
  seo,
}: {
  route: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string | null;
  type?: "website" | "article";
  seo?: SeoMetadataRecord | null;
}): Metadata {
  const title = optionalText(seo?.title) ?? fallbackTitle ?? `${site.name} — ${site.role}`;
  const description = optionalText(seo?.description) ?? fallbackDescription ?? site.tagline;
  const ogTitle = optionalText(seo?.og_title) ?? title;
  const ogDescription = optionalText(seo?.og_description) ?? description;
  const image = safeHttpUrl(seo?.og_image) ?? safeHttpUrl(fallbackImage);
  const canonical = safeHttpUrl(seo?.canonical_url) ?? routeUrl(route);
  const metadataBase = configuredSiteUrl();

  return {
    ...(metadataBase ? { metadataBase: new URL(metadataBase) } : {}),
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type,
      ...(canonical ? { url: canonical } : {}),
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export async function getStaticPageMetadata(route: SeoRoute): Promise<Metadata> {
  const seo = await getSeoMetadata(route);
  const fallback = staticDefaults[route];
  return buildMetadata({ route, fallbackTitle: fallback.title, fallbackDescription: fallback.description, seo });
}

export function getDefaultSiteMetadata(): Metadata {
  const fallback = staticDefaults["/"];
  return buildMetadata({ route: "/", fallbackTitle: fallback.title, fallbackDescription: fallback.description });
}

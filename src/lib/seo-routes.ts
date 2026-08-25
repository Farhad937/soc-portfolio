export const seoRoutes = [
  { route: "/", label: "Home" },
  { route: "/about", label: "About" },
  { route: "/projects", label: "Projects" },
  { route: "/writeups", label: "Write-ups" },
  { route: "/skills", label: "Skills" },
  { route: "/certifications", label: "Certifications" },
  { route: "/journey", label: "Journey" },
  { route: "/homelab", label: "Home Lab" },
  { route: "/resume", label: "Resume" },
  { route: "/contact", label: "Contact" },
  { route: "/tryhackme", label: "TryHackMe" },
] as const;

export type SeoRoute = (typeof seoRoutes)[number]["route"];

export function isSeoRoute(route: string): route is SeoRoute {
  return seoRoutes.some((item) => item.route === route);
}

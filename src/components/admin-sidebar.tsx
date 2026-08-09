"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  User,
  FolderKanban,
  NotebookText,
  Server,
  Wrench,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Milestone,
  FileText,
  Rss,
  Mail,
  Image as ImageIcon,
  SearchCode,
  Settings as SettingsIcon,
} from "lucide-react";

const sections = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/writeups", label: "Write-ups", icon: NotebookText },
  { href: "/admin/homelab", label: "Home Lab", icon: Server },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/certifications", label: "Certifications", icon: BadgeCheck },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/journey", label: "Journey", icon: Milestone },
  { href: "/admin/resume", label: "Resume", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: Rss },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/seo", label: "SEO", icon: SearchCode },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-border p-3">
      <ul className="space-y-0.5">
        {sections.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-bg-raised text-accent" : "text-text-muted hover:bg-bg-raised hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

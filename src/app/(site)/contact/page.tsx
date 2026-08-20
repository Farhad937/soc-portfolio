import SectionHeading from "@/components/section-heading";
import { Github, Linkedin, Mail, MapPin, Terminal } from "lucide-react";
import { site as staticSite } from "@/lib/site";
import { getSiteSettings } from "@/lib/content/site-settings";

export const metadata = { title: `Contact — ${staticSite.name}` };
export const revalidate = 3600;

export default async function ContactPage() {
  const site = await getSiteSettings();

  const contactLinks = [
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    { icon: Linkedin, label: "LinkedIn", href: site.linkedinUrl },
    { icon: Github, label: "GitHub", href: site.githubUrl },
    { icon: Terminal, label: "TryHackMe", href: site.tryhackmeUrl },
  ];

  return (
    <section className="section max-w-2xl">
      <SectionHeading
        kicker="// Get In Touch"
        title="Contact"
        description="Open to Junior SOC Analyst roles and conversations about defensive security."
      />

      <div className="card animate-fade-in p-6">
        <div className="mb-6 flex items-center gap-2 text-text-muted">
          <MapPin className="h-4 w-4" />
          <span>{site.location}</span>
        </div>
        <div className="space-y-1">
          {contactLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-md px-3 py-3 text-text-muted transition-all hover:translate-x-0.5 hover:bg-bg-raised hover:text-accent focus-visible:translate-x-0.5 focus-visible:bg-bg-raised focus-visible:text-accent"
            >
              <Icon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" />
              {label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-text-faint">
        Note: this is a static site, so there&apos;s no working contact form here yet — the
        mailto link above is the fastest path. If you want a real form later, Netlify Forms
        works well with a static Next.js export and needs no backend code.
      </p>
    </section>
  );
}

import SectionHeading from "@/components/section-heading";
import { getCertifications } from "@/lib/content/certifications";
import { site } from "@/lib/site";
import { BadgeCheck, Clock, CalendarClock } from "lucide-react";
import ScrollRevealGrid from "@/components/scroll-reveal-grid";

export const metadata = { title: `Certifications — ${site.name}` };
export const revalidate = 3600;

const statusMeta = {
  Completed: { icon: BadgeCheck, color: "text-success" },
  "In Progress": { icon: Clock, color: "text-warning" },
  Planned: { icon: CalendarClock, color: "text-text-faint" },
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <section className="section">
      <SectionHeading kicker="// Credentials" title="Certifications" />
      <ScrollRevealGrid className="grid gap-5 sm:grid-cols-2">
        {certifications.map((cert) => {
          const meta = statusMeta[cert.status];
          const Icon = meta.icon;
          return (
            <div key={cert.name} className="card public-card group p-6">
              <div className={`mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide ${meta.color}`}>
                <Icon className="h-3.5 w-3.5" />
                {cert.status}
              </div>
              <div className="flex items-start gap-3">
                {cert.logo && (
                  <img src={cert.logo} alt="" className="h-10 w-10 shrink-0 rounded-md border border-border bg-white p-1 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-text">{cert.name}</h3>
                  <p className="mt-1 text-sm text-text-muted">{cert.issuer} {cert.date && `· ${cert.date}`}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cert.skills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </ScrollRevealGrid>
    </section>
  );
}

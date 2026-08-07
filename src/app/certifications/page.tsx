import SectionHeading from "@/components/section-heading";
import { certifications } from "@/lib/data";
import { site } from "@/lib/site";
import { BadgeCheck, Clock, CalendarClock } from "lucide-react";

export const metadata = { title: `Certifications — ${site.name}` };

const statusMeta = {
  Completed: { icon: BadgeCheck, color: "text-success" },
  "In Progress": { icon: Clock, color: "text-warning" },
  Planned: { icon: CalendarClock, color: "text-text-faint" },
};

export default function CertificationsPage() {
  return (
    <section className="section">
      <SectionHeading kicker="// Credentials" title="Certifications" />
      <div className="grid gap-5 sm:grid-cols-2">
        {certifications.map((cert) => {
          const meta = statusMeta[cert.status];
          const Icon = meta.icon;
          return (
            <div key={cert.name} className="card p-6">
              <div className={`mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide ${meta.color}`}>
                <Icon className="h-3.5 w-3.5" />
                {cert.status}
              </div>
              <h3 className="text-lg font-semibold text-text">{cert.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{cert.issuer} {cert.date && `· ${cert.date}`}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {cert.skills.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

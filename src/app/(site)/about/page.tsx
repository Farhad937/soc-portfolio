import SectionHeading from "@/components/section-heading";
import { site as staticSite } from "@/lib/site";
import { getSiteSettings } from "@/lib/content/site-settings";
import { getExperience } from "@/lib/content/experience";
import { getEducation } from "@/lib/content/education";
import { getAboutPageContent } from "@/lib/content/about";

export const metadata = { title: `About — ${staticSite.name}` };
export const revalidate = 3600;

export default async function AboutPage() {
  const [site, experience, education, about] = await Promise.all([
    getSiteSettings(),
    getExperience(),
    getEducation(),
    getAboutPageContent(),
  ]);

  return (
    <>
    <section className="section">
      <SectionHeading kicker="// About" title="About Me" />

      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div className="card h-fit p-6">
          <div className="aspect-square w-full rounded-md border border-dashed border-border-strong bg-bg-raised flex items-center justify-center">
            {about.profileImage ? (
              <img src={about.profileImage} alt="Professional profile" className="h-full w-full rounded-md object-contain" />
            ) : (
              <p className="px-4 text-center font-mono text-xs text-text-faint">[ professional photo ]</p>
            )}
          </div>
          <dl className="mt-6 space-y-2 font-mono text-xs text-text-muted">
            <div className="flex justify-between"><dt>role</dt><dd className="text-text">{site.role}</dd></div>
            <div className="flex justify-between"><dt>location</dt><dd className="text-text">{site.location}</dd></div>
            <div className="flex justify-between"><dt>focus</dt><dd className="text-text">Blue Team / SOC</dd></div>
          </dl>
        </div>

        <div className="space-y-6 text-text-muted">
          <p>{about.engineeringBackground}</p>
          <p>{about.securityTransition}</p>
          <p>{about.defensiveSecurityReason}</p>

          <div className="log-divider">Current Focus</div>
          <ul className="list-inside list-disc space-y-1">
            {about.currentFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="log-divider">Career Goal</div>
          <p>{about.careerGoal}</p>
        </div>
      </div>
    </section>

    {experience.length > 0 && (
      <section className="section border-t border-border">
        <SectionHeading kicker="// Career" title="Experience" />
        <div className="space-y-6">
          {experience.map((entry) => (
            <div key={entry.id} className="card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-text">
                  {entry.position} <span className="text-text-muted">· {entry.company}</span>
                </h3>
                {(entry.start_date || entry.is_current) && (
                  <p className="font-mono text-xs text-text-faint">
                    {entry.start_date}
                    {entry.start_date && " – "}
                    {entry.is_current ? "Present" : entry.end_date}
                  </p>
                )}
              </div>
              {entry.location && <p className="mt-1 text-sm text-text-faint">{entry.location}</p>}
              {entry.description && <p className="mt-3 text-text-muted">{entry.description}</p>}
              {entry.achievements.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-text-muted">
                  {entry.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              )}
              {entry.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {entry.technologies.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {education.length > 0 && (
      <section className="section border-t border-border">
        <SectionHeading kicker="// Academics" title="Education" />
        <div className="space-y-6">
          {education.map((entry) => (
            <div key={entry.id} className="card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-text">
                  {entry.degree} <span className="text-text-muted">· {entry.institution}</span>
                </h3>
                {(entry.start_date || entry.is_current) && (
                  <p className="font-mono text-xs text-text-faint">
                    {entry.start_date}
                    {entry.start_date && " – "}
                    {entry.is_current ? "Present" : entry.end_date}
                  </p>
                )}
              </div>
              {entry.field_of_study && <p className="mt-1 text-sm text-text-faint">{entry.field_of_study}</p>}
              {entry.description && <p className="mt-3 text-text-muted">{entry.description}</p>}
              {entry.achievements.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-text-muted">
                  {entry.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    )}
    </>
  );
}

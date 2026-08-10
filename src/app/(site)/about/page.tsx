import SectionHeading from "@/components/section-heading";
import { site as staticSite } from "@/lib/site";
import { getSiteSettings } from "@/lib/content/site-settings";
import { getExperience } from "@/lib/content/experience";

export const metadata = { title: `About — ${staticSite.name}` };
export const revalidate = 3600;

export default async function AboutPage() {
  const [site, experience] = await Promise.all([getSiteSettings(), getExperience()]);

  return (
    <>
    <section className="section">
      <SectionHeading kicker="// About" title="About Me" />

      <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
        <div className="card h-fit p-6">
          <div className="aspect-square w-full rounded-md border border-dashed border-border-strong bg-bg-raised flex items-center justify-center">
            <p className="px-4 text-center font-mono text-xs text-text-faint">
              [ professional photo ]
            </p>
          </div>
          <dl className="mt-6 space-y-2 font-mono text-xs text-text-muted">
            <div className="flex justify-between"><dt>role</dt><dd className="text-text">{site.role}</dd></div>
            <div className="flex justify-between"><dt>location</dt><dd className="text-text">{site.location}</dd></div>
            <div className="flex justify-between"><dt>focus</dt><dd className="text-text">Blue Team / SOC</dd></div>
          </dl>
        </div>

        <div className="space-y-6 text-text-muted">
          <p>
            Replace this paragraph with your engineering background — what you studied, what kind
            of problems you solved, and what that work taught you about systems thinking.
          </p>
          <p>
            Replace this paragraph with your transition story: what pulled you toward defensive
            security specifically, rather than security broadly. Being specific here (a moment, an
            article, a lab exercise that hooked you) reads far better than a generic &quot;I&apos;ve
            always been interested in technology.&quot;
          </p>
          <p>
            Replace this paragraph with why <em>defensive</em> security interests you over offensive —
            recruiters ask this in nearly every SOC interview, so having a real answer written down
            helps you say it clearly out loud too.
          </p>

          <div className="log-divider">Current Focus</div>
          <ul className="list-inside list-disc space-y-1">
            <li>CompTIA Security+ study</li>
            <li>TryHackMe SOC Level 1 pathway</li>
            <li>Home lab: Active Directory + Splunk detection</li>
            <li>Python for security automation</li>
            <li>Windows internals and event log analysis</li>
          </ul>

          <div className="log-divider">Career Goal</div>
          <p>
            Replace with one or two sentences on the specific kind of SOC role and environment
            you&apos;re targeting (e.g. MSSP vs in-house, Tier 1 entry point, industry you&apos;d
            like to work in).
          </p>
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
    </>
  );
}

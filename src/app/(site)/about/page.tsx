import SectionHeading from "@/components/section-heading";
import { site as staticSite } from "@/lib/site";
import { getSiteSettings } from "@/lib/content/site-settings";

export const metadata = { title: `About — ${staticSite.name}` };
export const revalidate = 3600;

export default async function AboutPage() {
  const site = await getSiteSettings();

  return (
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
  );
}

import SectionHeading from "@/components/section-heading";
import { site } from "@/lib/site";
import { getHomeLabItems, getHomeLabPageContent } from "@/lib/content/homelab";

export const metadata = { title: `Home Lab — ${site.name}` };
export const revalidate = 3600;

export default async function HomeLabPage() {
  const [vms, pageContent] = await Promise.all([getHomeLabItems(), getHomeLabPageContent()]);

  return (
    <section className="section">
      <SectionHeading
        kicker="// Infrastructure"
        title="Home Lab"
        description="The environment behind every project on this site."
      />

      <div className="card mb-12 animate-slide-in p-6">
        <p className="log-divider mb-4">Hardware</p>
        <p className="text-text-muted">{pageContent.hardwareDescription}</p>
        <p className="log-divider mb-4 mt-8">Virtualization</p>
        <p className="text-text-muted">{pageContent.virtualizationDescription}</p>
      </div>

      <p className="log-divider mb-6">Virtual Machines</p>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {vms.map((vm, index) => (
          <div key={vm.id} className="card animate-scale-in p-5" style={{ animationDelay: `${index * 80}ms` }}>
            <h3 className="font-medium text-text">{vm.name}</h3>
            {vm.category && <p className="mt-1 font-mono text-xs text-text-faint">{vm.category}</p>}
            {vm.description && <p className="mt-2 text-sm text-text-muted">{vm.description}</p>}
            {vm.link && (
              <a href={vm.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-accent transition-colors hover:text-accent-bright">
                {vm.link}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="card animate-scale-in p-6">
        <p className="log-divider mb-4">Network Diagram</p>
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border-strong bg-bg-raised">
          <p className="px-4 text-center font-mono text-xs text-text-faint">{pageContent.networkDiagramNote}</p>
        </div>
      </div>

      <div className="mt-12">
        <p className="log-divider mb-4">Future Additions</p>
        <ul className="list-inside list-disc space-y-1 text-text-muted">
          {pageContent.futureAdditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

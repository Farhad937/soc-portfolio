import SectionHeading from "@/components/section-heading";
import { site } from "@/lib/site";

export const metadata = { title: `Home Lab — ${site.name}` };

const vms = [
  { name: "Domain Controller", os: "Windows Server 2022", role: "Active Directory, DNS" },
  { name: "Windows Client", os: "Windows 11", role: "Domain-joined workstation" },
  { name: "Kali", os: "Kali Linux", role: "Attacker / tooling box" },
  { name: "Ubuntu", os: "Ubuntu Server", role: "General Linux practice" },
];

export default function HomeLabPage() {
  return (
    <section className="section">
      <SectionHeading
        kicker="// Infrastructure"
        title="Home Lab"
        description="The environment behind every project on this site."
      />

      <div className="mb-12 card p-6">
        <p className="log-divider mb-4">Hardware</p>
        <p className="text-text-muted">
          Replace with your actual laptop/desktop specs — CPU, RAM, storage. Hiring managers
          skim this to gauge how much you had to work around resource limits, which is itself
          a signal of resourcefulness.
        </p>
        <p className="log-divider mb-4 mt-8">Virtualization</p>
        <p className="text-text-muted">VirtualBox, running on an isolated internal network (host-only adapter).</p>
      </div>

      <p className="log-divider mb-6">Virtual Machines</p>
      <div className="mb-12 grid gap-4 sm:grid-cols-2">
        {vms.map((vm) => (
          <div key={vm.name} className="card p-5">
            <h3 className="font-medium text-text">{vm.name}</h3>
            <p className="mt-1 font-mono text-xs text-text-faint">{vm.os}</p>
            <p className="mt-2 text-sm text-text-muted">{vm.role}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <p className="log-divider mb-4">Network Diagram</p>
        <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border-strong bg-bg-raised">
          <p className="px-4 text-center font-mono text-xs text-text-faint">
            [ add your lab network diagram here — draw.io or Excalidraw export works well ]
          </p>
        </div>
      </div>

      <div className="mt-12">
        <p className="log-divider mb-4">Future Additions</p>
        <ul className="list-inside list-disc space-y-1 text-text-muted">
          <li>Splunk instance for centralized logging</li>
          <li>Security Onion for network-based detection</li>
          <li>Elastic stack as a second SIEM comparison point</li>
        </ul>
      </div>
    </section>
  );
}

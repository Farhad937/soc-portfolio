export type Project = {
  slug: string;
  title: string;
  summary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "In Progress" | "Complete" | "Planned";
  timeInvested: string;
  tech: string[];
  skills: string[];
  overview: string;
  objective: string;
  environment: string;
  toolsUsed: string[];
  challenges: string;
  investigation: string;
  findings: string;
  lessonsLearned: string;
  futureImprovements: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "windows-active-directory-lab",
    title: "Windows Active Directory Lab",
    summary:
      "Built a small AD domain from scratch to learn how enterprise identity, group policy, and authentication actually work under the hood.",
    difficulty: "Beginner",
    status: "In Progress",
    timeInvested: "12 hrs",
    tech: ["Windows Server", "Active Directory", "VirtualBox", "PowerShell"],
    skills: ["Active Directory", "Group Policy", "Windows Administration"],
    overview:
      "A self-hosted domain controller with a joined Windows client, used as the foundation for later detection and attack-simulation projects.",
    objective:
      "Stand up a working domain — DC, DNS, at least one client — and understand the authentication flow well enough to explain it to someone else.",
    environment: "VirtualBox, Windows Server 2022 (DC), Windows 11 (client), isolated internal network.",
    toolsUsed: ["Windows Server 2022", "Active Directory Domain Services", "DNS", "PowerShell"],
    challenges:
      "Replace with the specific problem you hit — e.g. DNS resolution failing between the client and DC before the join would succeed, and how you diagnosed it.",
    investigation:
      "Replace with the diagnostic steps you actually took: what you checked first, what ruled things in or out, what finally pointed to the fix.",
    findings: "Replace with what you learned about how the pieces fit together once it worked.",
    lessonsLearned:
      "Replace with the concept that clicked for you — this is the part hiring managers actually read.",
    futureImprovements: "Add a second OU structure, GPO-based hardening, and a linked Splunk forwarder.",
  },
  {
    slug: "splunk-detection-lab",
    title: "Splunk Detection Lab",
    summary:
      "Forwarding Windows event logs into Splunk and writing detections for common attack techniques mapped to MITRE ATT&CK.",
    difficulty: "Intermediate",
    status: "Planned",
    timeInvested: "0 hrs",
    tech: ["Splunk", "Sysmon", "Windows Event Logs"],
    skills: ["SIEM", "Detection Engineering", "MITRE ATT&CK", "Log Analysis"],
    overview:
      "Connects the AD lab to a Splunk instance so raw Windows/Sysmon telemetry becomes searchable, alertable data.",
    objective: "Write and validate at least three detections against a documented ATT&CK technique.",
    environment: "Splunk Free (single instance), Sysmon on the domain client, universal forwarder.",
    toolsUsed: ["Splunk", "Sysmon", "SPL"],
    challenges: "Fill in once started.",
    investigation: "Fill in once started.",
    findings: "Fill in once started.",
    lessonsLearned: "Fill in once started.",
    futureImprovements: "Layer in Security Onion for a second detection surface to compare against Splunk.",
  },
  {
    slug: "phishing-analysis",
    title: "Phishing Analysis",
    summary:
      "Static analysis of a sample phishing email — headers, URLs, and attachments — documented as a repeatable triage process.",
    difficulty: "Beginner",
    status: "Planned",
    timeInvested: "0 hrs",
    tech: ["CyberChef", "VirusTotal"],
    skills: ["Email Header Analysis", "IOC Extraction", "Threat Hunting"],
    overview: "A documented walkthrough of how to triage a suspicious email safely, from header to verdict.",
    objective: "Produce a triage checklist reusable on future samples.",
    environment: "Isolated analysis VM, no internet execution of attachments.",
    toolsUsed: ["CyberChef", "VirusTotal", "MXToolbox"],
    challenges: "Fill in once started.",
    investigation: "Fill in once started.",
    findings: "Fill in once started.",
    lessonsLearned: "Fill in once started.",
    futureImprovements: "Automate IOC extraction with the Python IOC extractor project below.",
  },
  {
    slug: "python-ioc-extractor",
    title: "Python IOC Extractor",
    summary:
      "A small script that pulls IPs, domains, and hashes out of raw text or log files using regex, for faster triage.",
    difficulty: "Beginner",
    status: "Planned",
    timeInvested: "0 hrs",
    tech: ["Python", "Regex"],
    skills: ["Python", "Automation", "IOC Extraction"],
    overview: "Command-line tool: paste in a log or email body, get back a de-duplicated list of indicators.",
    objective: "Correctly extract IPv4, domains, and MD5/SHA256 hashes from a mixed text sample.",
    environment: "Python 3, local script, no dependencies beyond the standard library.",
    toolsUsed: ["Python", "re module"],
    challenges: "Fill in once started.",
    investigation: "Fill in once started.",
    findings: "Fill in once started.",
    lessonsLearned: "Fill in once started.",
    futureImprovements: "Add VirusTotal API lookups for automatic reputation checks.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

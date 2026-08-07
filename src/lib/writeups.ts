export type Writeup = {
  slug: string;
  title: string;
  category: "Windows" | "Linux" | "Networking" | "Detection Engineering" | "Threat Hunting" | "Python" | "SOC";
  readingTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  concept: string;
  keyTakeaways: string[];
  references: { label: string; url: string }[];
};

export const writeups: Writeup[] = [
  {
    slug: "how-kerberos-works",
    title: "How Kerberos Works",
    category: "Windows",
    readingTime: "7 min",
    difficulty: "Intermediate",
    summary:
      "A conceptual walkthrough of the Kerberos authentication flow — tickets, the KDC, and why it matters for detecting attacks like Golden Ticket and Kerberoasting.",
    concept:
      "Replace with your own explanation of the AS-REQ / TGT / TGS exchange, written in your own words, once you've worked through it in the lab.",
    keyTakeaways: [
      "Kerberos avoids sending passwords over the network by using time-limited tickets instead.",
      "The KDC issues a TGT after initial authentication, which is then used to request service tickets.",
      "Understanding the normal flow is what makes Kerberoasting and Golden Ticket attacks recognizable in logs.",
    ],
    references: [{ label: "Microsoft: Kerberos Authentication Overview", url: "https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview" }],
  },
  {
    slug: "what-is-sysmon",
    title: "What Is Sysmon?",
    category: "Windows",
    readingTime: "5 min",
    difficulty: "Beginner",
    summary:
      "Why default Windows Event Logs aren't enough for detection work, and what Sysmon adds — process creation, network connections, and file hashes.",
    concept: "Replace with your own explanation once you've deployed Sysmon in the home lab.",
    keyTakeaways: [
      "Sysmon logs process command lines, parent-child relationships, and file hashes that default logging misses.",
      "A good Sysmon config (like SwiftOnSecurity's) filters noise instead of logging everything.",
      "Event ID 1 (process creation) and Event ID 3 (network connection) are usually the first two worth mastering.",
    ],
    references: [{ label: "Microsoft Sysinternals: Sysmon", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon" }],
  },
  {
    slug: "windows-event-ids-every-soc-analyst-should-know",
    title: "Windows Event IDs Every SOC Analyst Should Know",
    category: "SOC",
    readingTime: "6 min",
    difficulty: "Beginner",
    summary:
      "A working reference of the security event IDs that show up constantly in triage — 4624, 4625, 4688, 4720, and what each actually means.",
    concept: "Replace with your own notes and examples pulled from your home lab's logs.",
    keyTakeaways: [
      "4624/4625 (successful/failed logon) are the backbone of brute-force and lateral-movement detection.",
      "4688 (process creation) is your process-execution visibility if Sysmon isn't deployed.",
      "4720 (user account created) matters for catching unauthorized privilege escalation via new accounts.",
    ],
    references: [{ label: "Ultimate Windows Security: Event ID Reference", url: "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/" }],
  },
  {
    slug: "mitre-attck-explained",
    title: "MITRE ATT&CK Explained",
    category: "Threat Hunting",
    readingTime: "8 min",
    difficulty: "Beginner",
    summary:
      "What the ATT&CK matrix actually is, how tactics differ from techniques, and how to use it to structure a detection or investigation.",
    concept: "Replace with your own explanation, ideally tied back to a technique you've detected in the lab.",
    keyTakeaways: [
      "Tactics are the 'why' (the attacker's goal); techniques are the 'how'.",
      "ATT&CK is a shared vocabulary — it's what lets a detection, a report, and a threat intel feed reference the same thing.",
      "Mapping your own lab detections to specific technique IDs is what turns a project into a portfolio piece.",
    ],
    references: [{ label: "MITRE ATT&CK", url: "https://attack.mitre.org/" }],
  },
];

export function getWriteup(slug: string) {
  return writeups.find((w) => w.slug === slug);
}

export const skillGroups = [
  {
    category: "Defensive Security",
    items: ["Windows Event Logs", "SIEM (Splunk)", "Threat Hunting", "MITRE ATT&CK", "Incident Response", "Log Analysis", "Network Analysis"],
  },
  {
    category: "Operating Systems",
    items: ["Windows", "Linux", "Kali Linux", "Ubuntu"],
  },
  {
    category: "Networking",
    items: ["TCP/IP", "DNS", "HTTP", "DHCP", "Active Directory", "VPN", "Firewalls"],
  },
  {
    category: "Tools",
    items: ["Splunk", "Wireshark", "Sysmon", "PowerShell", "Nmap", "Burp Suite", "Volatility", "Autopsy", "VirusTotal", "CyberChef", "Procmon", "Autoruns"],
  },
  {
    category: "Programming",
    items: ["Python", "JavaScript", "HTML", "CSS", "SQL"],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  skills: string[];
  credentialUrl?: string;
  logo?: string;
  status: "Completed" | "In Progress" | "Planned";
};

export const certifications: Certification[] = [
  {
    name: "Google Cybersecurity Professional Certificate",
    issuer: "Google / Coursera",
    date: "2026",
    skills: ["SIEM concepts", "Python fundamentals", "Linux basics", "SQL", "Networking fundamentals"],
    status: "Completed",
  },
  {
    name: "Google Data Analytics Professional Certificate",
    issuer: "Google / Coursera",
    date: "",
    skills: ["Data cleaning", "Spreadsheets", "SQL", "Visualization"],
    status: "Completed",
  },
  {
    name: "CompTIA Security+",
    issuer: "CompTIA",
    date: "Target 2026",
    skills: ["Security fundamentals", "Risk management", "Cryptography", "Network security"],
    status: "Planned",
  },
];

export type TimelineEntry = {
  date: string;
  title: string;
  description?: string;
};

export const timeline: TimelineEntry[] = [
  { date: "2026", title: "Completed Google Cybersecurity Professional Certificate" },
  { date: "2026", title: "Started TryHackMe — Cyber Security Foundations pathway" },
  { date: "2026", title: "Built home lab environment in VirtualBox" },
  { date: "2026", title: "Started Windows Active Directory lab build" },
  { date: "2026", title: "Started Security+ study plan" },
];

export type ThmPath = {
  name: string;
  progress: number; // 0-100
  rooms: { name: string; status: "Complete" | "In Progress" | "Not Started" }[];
};

export const thmPaths: ThmPath[] = [
  {
    name: "SOC Level 1",
    progress: 10,
    rooms: [
      { name: "Pre Security", status: "Complete" },
      { name: "Cyber Security 101", status: "In Progress" },
      { name: "Security Operations", status: "Not Started" },
      { name: "Threat Intelligence", status: "Not Started" },
    ],
  },
  {
    name: "Windows",
    progress: 5,
    rooms: [
      { name: "Windows Fundamentals 1", status: "In Progress" },
      { name: "Windows Fundamentals 2", status: "Not Started" },
    ],
  },
  {
    name: "Networking",
    progress: 15,
    rooms: [
      { name: "Intro to LAN", status: "Complete" },
      { name: "Nmap", status: "In Progress" },
    ],
  },
  {
    name: "Linux",
    progress: 0,
    rooms: [{ name: "Linux Fundamentals Part 1", status: "Not Started" }],
  },
  {
    name: "Active Directory",
    progress: 0,
    rooms: [{ name: "Active Directory Basics", status: "Not Started" }],
  },
];

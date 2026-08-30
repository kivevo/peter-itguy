import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import {
  Monitor,
  Wifi,
  Globe,
  HardDrive,
  Printer,
  Camera,
  Lock,
  Cloud,
  Cpu,
  Mail,
  Phone,
  Smartphone,
  Server,
  Zap,
  ShieldCheck,
  Cable,
  Database,
  BarChart3,
  Laptop,
  Settings,
  MessageCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface ServiceCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  services: {
    name: string;
    keywords: string[];
    whatsapp: string;
  }[];
}

const categories: ServiceCategory[] = [
  {
    id: "laptop-repair",
    icon: Laptop,
    title: "Laptop & Computer Repairs",
    color: "text-blue-400",
    services: [
      {
        name: "Laptop screen replacement",
        keywords: ["broken laptop screen", "cracked screen", "laptop display repair Nairobi"],
        whatsapp: "Hi Peter, I need a laptop screen replacement. Can you help?",
      },
      {
        name: "Keyboard replacement & repair",
        keywords: ["laptop keyboard not working", "keyboard repair Nairobi"],
        whatsapp: "Hi Peter, my laptop keyboard is broken and needs replacement.",
      },
      {
        name: "Laptop charging port repair",
        keywords: ["laptop not charging", "charging port repair", "laptop battery not charging"],
        whatsapp: "Hi Peter, my laptop is not charging. I think the charging port is broken.",
      },
      {
        name: "Laptop overheating fix & fan cleaning",
        keywords: ["laptop overheating", "laptop fan not working", "laptop cooling", "thermal paste"],
        whatsapp: "Hi Peter, my laptop is overheating and getting very slow. Can you fix it?",
      },
      {
        name: "RAM & SSD upgrade",
        keywords: ["laptop RAM upgrade", "SSD upgrade", "slow laptop upgrade", "add RAM Nairobi"],
        whatsapp: "Hi Peter, I want to upgrade my laptop RAM or SSD to make it faster.",
      },
      {
        name: "Windows OS reinstallation",
        keywords: ["reinstall Windows", "format laptop", "Windows corrupt", "OS reinstall Nairobi"],
        whatsapp: "Hi Peter, I need Windows reinstalled on my laptop or PC.",
      },
      {
        name: "Virus & malware removal",
        keywords: ["laptop virus removal", "malware removal", "slow computer virus", "computer hacked Nairobi"],
        whatsapp: "Hi Peter, I think my laptop has a virus. It's very slow and behaving strangely.",
      },
      {
        name: "Blue screen of death (BSOD) fix",
        keywords: ["blue screen error", "BSOD fix", "laptop crashing", "Windows STOP error"],
        whatsapp: "Hi Peter, my laptop keeps showing a blue screen and crashing. Please help.",
      },
      {
        name: "Data recovery from failed hard drive",
        keywords: ["hard drive data recovery", "recover deleted files", "hard disk failure", "data recovery Nairobi"],
        whatsapp: "Hi Peter, my hard drive failed and I need to recover my files. Can you help?",
      },
      {
        name: "Desktop PC assembly & repair",
        keywords: ["desktop PC repair Nairobi", "PC assembly", "custom build PC Kenya", "desktop not starting"],
        whatsapp: "Hi Peter, I need help with my desktop PC repair or assembly.",
      },
    ],
  },
  {
    id: "networking-wifi",
    icon: Wifi,
    title: "Wi-Fi, Internet & Networking",
    color: "text-teal-400",
    services: [
      {
        name: "Office Wi-Fi installation & setup",
        keywords: ["office Wi-Fi setup Nairobi", "Wi-Fi installation Kenya", "business internet setup"],
        whatsapp: "Hi Peter, I need a proper Wi-Fi setup for my office. Can we schedule a site visit?",
      },
      {
        name: "Slow internet troubleshooting",
        keywords: ["slow internet fix", "internet speed issues", "why is my internet slow Nairobi"],
        whatsapp: "Hi Peter, our office internet is very slow. I need help diagnosing and fixing it.",
      },
      {
        name: "UniFi / Mikrotik enterprise access points",
        keywords: ["UniFi access point", "Mikrotik setup", "enterprise Wi-Fi Kenya", "business Wi-Fi system"],
        whatsapp: "Hi Peter, I need UniFi or Mikrotik enterprise Wi-Fi installed for my business.",
      },
      {
        name: "Guest Wi-Fi separation (VLAN setup)",
        keywords: ["guest Wi-Fi", "VLAN setup", "separate guest internet", "isolate Wi-Fi Nairobi"],
        whatsapp: "Hi Peter, I need a separate guest Wi-Fi network that doesn't slow down my payment tills.",
      },
      {
        name: "Wi-Fi dead zones & range extension",
        keywords: ["Wi-Fi dead spots", "Wi-Fi not reaching", "extend Wi-Fi range Nairobi", "weak Wi-Fi signal"],
        whatsapp: "Hi Peter, there are Wi-Fi dead zones in my office or hotel. Can you fix the coverage?",
      },
      {
        name: "Fiber internet & router configuration",
        keywords: ["fiber internet setup", "router configuration", "fiber optic setup Nairobi"],
        whatsapp: "Hi Peter, I need help setting up and configuring my fiber internet and router.",
      },
      {
        name: "Backup internet failover setup",
        keywords: ["backup internet", "internet failover", "dual ISP setup", "no internet downtime Kenya"],
        whatsapp: "Hi Peter, I want a backup internet line that switches on automatically if my main line fails.",
      },
      {
        name: "LAN cabling & structured cabling",
        keywords: ["LAN cabling Nairobi", "network cable installation", "ethernet cabling office"],
        whatsapp: "Hi Peter, I need LAN/ethernet cabling done for my office network.",
      },
    ],
  },
  {
    id: "cctv-security",
    icon: Camera,
    title: "CCTV & Physical Security",
    color: "text-rose-400",
    services: [
      {
        name: "CCTV camera installation (HD & 4K)",
        keywords: ["CCTV installation Nairobi", "security cameras Kenya", "CCTV setup office"],
        whatsapp: "Hi Peter, I need CCTV security cameras installed at my business premises.",
      },
      {
        name: "Remote viewing on smartphone (CCTV app)",
        keywords: ["CCTV remote viewing", "watch cameras on phone", "IP camera mobile access"],
        whatsapp: "Hi Peter, I want to view my security cameras remotely on my phone.",
      },
      {
        name: "CCTV DVR / NVR setup & configuration",
        keywords: ["CCTV DVR setup", "NVR configuration", "recorder setup CCTV Nairobi"],
        whatsapp: "Hi Peter, I need help setting up or configuring my CCTV DVR/NVR recorder.",
      },
      {
        name: "Indoor & outdoor camera installation",
        keywords: ["outdoor CCTV", "weatherproof cameras", "indoor security cameras Nairobi"],
        whatsapp: "Hi Peter, I need both indoor and outdoor security cameras installed.",
      },
      {
        name: "Door access control systems",
        keywords: ["door access control Nairobi", "biometric door lock", "card reader door access Kenya"],
        whatsapp: "Hi Peter, I need a door access control system for my office.",
      },
      {
        name: "Biometric attendance & fingerprint clocking",
        keywords: ["biometric attendance Nairobi", "fingerprint clock", "staff attendance system Kenya"],
        whatsapp: "Hi Peter, I need a biometric fingerprint attendance system for my staff.",
      },
    ],
  },
  {
    id: "printers-peripherals",
    icon: Printer,
    title: "Printers, Scanners & POS Machines",
    color: "text-amber-400",
    services: [
      {
        name: "Printer setup, installation & configuration",
        keywords: ["printer setup Nairobi", "install printer office", "printer configuration Kenya"],
        whatsapp: "Hi Peter, I need a printer set up and configured at my office.",
      },
      {
        name: "Printer not printing — diagnosis & fix",
        keywords: ["printer not printing", "printer offline", "printer problem fix Nairobi"],
        whatsapp: "Hi Peter, my printer is not printing. Can you come fix it?",
      },
      {
        name: "Paper jam repair & roller replacement",
        keywords: ["printer paper jam", "jammed printer", "roller replacement printer Nairobi"],
        whatsapp: "Hi Peter, my printer keeps jamming. I need a technician to fix it.",
      },
      {
        name: "Receipt printer setup (POS / till)",
        keywords: ["receipt printer setup", "POS printer Nairobi", "thermal printer till Kenya"],
        whatsapp: "Hi Peter, I need a receipt printer set up for my POS / payment till.",
      },
      {
        name: "Scanner & photocopier setup",
        keywords: ["scanner setup Nairobi", "photocopier configuration", "scan to email setup"],
        whatsapp: "Hi Peter, I need a scanner or photocopier set up in my office.",
      },
      {
        name: "Ink & toner cartridge troubleshooting",
        keywords: ["printer ink problem", "toner not working", "printer cartridge issue"],
        whatsapp: "Hi Peter, my printer ink or toner cartridge is causing problems. Can you help?",
      },
    ],
  },
  {
    id: "cloud-email",
    icon: Cloud,
    title: "Cloud, Email & Software",
    color: "text-sky-400",
    services: [
      {
        name: "Microsoft 365 / Office 365 setup",
        keywords: ["Microsoft 365 setup Nairobi", "Office 365 business Kenya", "M365 configuration"],
        whatsapp: "Hi Peter, I need Microsoft 365 set up for my business team.",
      },
      {
        name: "Google Workspace / Gmail for business",
        keywords: ["Google Workspace setup", "Gmail business Nairobi", "professional email Kenya"],
        whatsapp: "Hi Peter, I need Google Workspace / business email set up for my company.",
      },
      {
        name: "Business email setup on domain",
        keywords: ["business email setup", "company email domain", "professional email Nairobi"],
        whatsapp: "Hi Peter, I need a professional business email like info@mycompany.co.ke set up.",
      },
      {
        name: "Cloud backup solution setup",
        keywords: ["cloud backup", "automatic backup", "data backup Nairobi", "Google Drive backup"],
        whatsapp: "Hi Peter, I need an automatic cloud backup set up to protect my company files.",
      },
      {
        name: "Windows & software licensing",
        keywords: ["Windows license", "genuine Windows Kenya", "software license Nairobi"],
        whatsapp: "Hi Peter, I need help with genuine Windows or software licensing for my PCs.",
      },
      {
        name: "Zoom / Teams / video conferencing setup",
        keywords: ["Zoom setup", "Teams setup Nairobi", "video conferencing Kenya", "online meetings"],
        whatsapp: "Hi Peter, I need Zoom or Microsoft Teams configured properly for my team meetings.",
      },
      {
        name: "QuickBooks / accounting software setup",
        keywords: ["QuickBooks setup Nairobi", "accounting software Kenya", "Sage setup"],
        whatsapp: "Hi Peter, I need QuickBooks or accounting software installed and configured.",
      },
    ],
  },
  {
    id: "websites",
    icon: Globe,
    title: "Website Design & Development",
    color: "text-emerald-400",
    services: [
      {
        name: "Business website design & development",
        keywords: ["website design Nairobi", "web development Kenya", "business website Nairobi"],
        whatsapp: "Hi Peter, I need a professional website designed and built for my business.",
      },
      {
        name: "Website revamp & redesign",
        keywords: ["website redesign Nairobi", "revamp old website", "modernize website Kenya"],
        whatsapp: "Hi Peter, I need my old website completely redesigned and modernized.",
      },
      {
        name: "WhatsApp catalog & ordering website",
        keywords: ["WhatsApp store", "product catalog website Nairobi", "WhatsApp order site Kenya"],
        whatsapp: "Hi Peter, I need a product catalog website with WhatsApp order buttons.",
      },
      {
        name: "Hotel & restaurant booking website",
        keywords: ["hotel website Nairobi", "restaurant website Kenya", "booking website design"],
        whatsapp: "Hi Peter, I need a hotel or restaurant booking website built.",
      },
      {
        name: "Domain registration (.co.ke / .com)",
        keywords: ["domain registration Kenya", ".co.ke domain", "buy domain Nairobi"],
        whatsapp: "Hi Peter, I need help registering a domain name for my business.",
      },
      {
        name: "Web hosting setup & SSL certificate",
        keywords: ["web hosting Kenya", "SSL certificate", "website hosting Nairobi"],
        whatsapp: "Hi Peter, I need fast web hosting and an SSL certificate set up for my website.",
      },
      {
        name: "Google Maps & local SEO setup",
        keywords: ["Google Maps listing Nairobi", "local SEO Kenya", "Google My Business setup"],
        whatsapp: "Hi Peter, I need my business listed on Google Maps and local search results.",
      },
      {
        name: "Website speed optimization",
        keywords: ["website speed", "slow website fix", "page speed optimization Nairobi"],
        whatsapp: "Hi Peter, my website is very slow. I need it optimized to load faster.",
      },
    ],
  },
  {
    id: "cybersecurity",
    icon: ShieldCheck,
    title: "Cybersecurity & Data Protection",
    color: "text-violet-400",
    services: [
      {
        name: "Office cybersecurity audit",
        keywords: ["cybersecurity Nairobi", "office security audit Kenya", "IT security assessment"],
        whatsapp: "Hi Peter, I need a cybersecurity audit for my office systems.",
      },
      {
        name: "Firewall setup & network protection",
        keywords: ["firewall setup", "network security Nairobi", "office firewall Kenya"],
        whatsapp: "Hi Peter, I need a firewall set up to protect my office network.",
      },
      {
        name: "Staff phishing & scam awareness training",
        keywords: ["phishing training", "cyber awareness Kenya", "staff scam training Nairobi"],
        whatsapp: "Hi Peter, I need cyber safety training for my office staff to prevent scams.",
      },
      {
        name: "Password management setup",
        keywords: ["password manager Nairobi", "company passwords", "secure password Kenya"],
        whatsapp: "Hi Peter, I need help setting up a secure password management system for my team.",
      },
      {
        name: "Remote wipe & device security",
        keywords: ["remote wipe laptop", "device security Kenya", "lost laptop data protection"],
        whatsapp: "Hi Peter, I need to secure my business devices in case they are lost or stolen.",
      },
    ],
  },
  {
    id: "server-infrastructure",
    icon: Server,
    title: "Servers & IT Infrastructure",
    color: "text-orange-400",
    services: [
      {
        name: "NAS / file server setup",
        keywords: ["NAS setup Nairobi", "file server Kenya", "shared storage office"],
        whatsapp: "Hi Peter, I need a NAS or file server set up for shared storage in my office.",
      },
      {
        name: "Windows Server setup & management",
        keywords: ["Windows Server Nairobi", "Active Directory Kenya", "domain controller setup"],
        whatsapp: "Hi Peter, I need a Windows Server set up with Active Directory for my company.",
      },
      {
        name: "MPESA integration & payment systems",
        keywords: ["MPESA integration Kenya", "M-Pesa till setup", "STK push Nairobi"],
        whatsapp: "Hi Peter, I need M-Pesa integrated into my business system or website.",
      },
      {
        name: "Server room cabling & rack organization",
        keywords: ["server room Nairobi", "rack cabling", "IT room setup Kenya"],
        whatsapp: "Hi Peter, I need my server room professionally cabled and organized.",
      },
      {
        name: "UPS & power protection setup",
        keywords: ["UPS setup Nairobi", "power protection Kenya", "backup power office computers"],
        whatsapp: "Hi Peter, I need UPS backup power installed to protect my office computers.",
      },
    ],
  },
];

export const ITServicesDirectory: React.FC = () => {
  const [openCat, setOpenCat] = useState<string | null>("laptop-repair");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery.trim().length > 1
    ? categories.map((cat) => ({
        ...cat,
        services: cat.services.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      })).filter((cat) => cat.services.length > 0)
    : categories;

  return (
    <section
      id="all-it-services"
      className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-950/70 relative border-t border-border/80"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Settings className="w-3.5 h-3.5" />
            <span>Complete IT Services Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Every IT Problem We Solve in{" "}
            <span className="text-gradient-teal">Nairobi & Kenya</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            From laptop screen replacements to enterprise Wi-Fi and full business websites — if it's tech, Peter fixes it fast.
            Search below or browse by category.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Settings className="w-4 h-4 text-teal-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search services, e.g. "laptop repair" or "CCTV Nairobi"...'
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card dark:bg-navy-900 border border-border/80 focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm text-foreground placeholder:text-muted-foreground transition-all shadow-sm"
          />
        </div>

        {/* Category Accordions */}
        <div className="space-y-3">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const isOpen = openCat === cat.id || searchQuery.trim().length > 1;
            return (
              <div
                key={cat.id}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "bg-card dark:bg-navy-900 border-teal-500/40 shadow-sm"
                    : "bg-card/60 dark:bg-navy-900/60 border-border hover:border-border"
                }`}
              >
                {/* Category Header */}
                <button
                  onClick={() => setOpenCat(isOpen && searchQuery.trim().length < 2 ? null : cat.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-muted dark:bg-navy-800 ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {cat.services.length} services available
                      </p>
                    </div>
                  </div>
                  {searchQuery.trim().length < 2 && (
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-teal-500" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Services List */}
                {isOpen && (
                  <div className="px-5 pb-5 grid sm:grid-cols-2 gap-2 border-t border-border/40 pt-4 animate-in fade-in duration-150">
                    {cat.services.map((svc) => (
                      <a
                        key={svc.name}
                        href={`https://wa.me/${254758896553}?text=${encodeURIComponent(svc.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl bg-muted/40 dark:bg-navy-800/60 hover:bg-teal-500/10 hover:border-teal-500/30 border border-transparent transition-all text-xs font-medium text-foreground"
                      >
                        <span className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {svc.name}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-teal-600/10 via-background to-navy-900/10 dark:from-teal-600/10 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-heading font-bold text-base text-foreground">
              Don't see your specific problem listed?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If it's IT-related, Peter fixes it. WhatsApp directly for a fast free assessment.
            </p>
          </div>
          <a
            href={getWhatsAppUrl(
              "Hi Peter, I have an IT issue that I didn't see listed on your website. Can you help me?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md flex-shrink-0 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Peter on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ITServicesDirectory;

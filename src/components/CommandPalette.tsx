import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getWhatsAppUrl } from "@/config/site";
import { useTheme } from "@/hooks/use-theme";
import {
  Search,
  MessageCircle,
  Phone,
  Layers,
  Wrench,
  Globe,
  Calculator,
  Server,
  FolderGit2,
  Sparkles,
  Sun,
  Moon,
  Lock,
  ArrowRight,
  X,
  FileDown,
  ExternalLink,
  ShieldCheck,
  Zap,
  Terminal
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Actions" | "Services" | "Tools" | "Case Studies" | "Navigation";
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContactCard?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenContactCard,
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Actions
    {
      id: "action-whatsapp",
      title: "Chat with Peter on WhatsApp",
      subtitle: "+254 758 896 553 • Replies in < 5 mins",
      category: "Actions",
      icon: MessageCircle,
      badge: "Fastest",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I am reaching out from your website command search."), "_blank");
        onClose();
      },
    },
    {
      id: "action-call",
      title: "Call Peter Directly (+254 758 896 553)",
      subtitle: "Direct on-call line for emergencies",
      category: "Actions",
      icon: Phone,
      action: () => {
        window.location.href = "tel:+254758896553";
        onClose();
      },
    },
    {
      id: "action-vcard",
      title: "Save Peter's Digital Contact Card (vCard / QR)",
      subtitle: "Add phone, WhatsApp, and email directly to contacts",
      category: "Actions",
      icon: FileDown,
      badge: "Scan QR",
      badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
      action: () => {
        onClose();
        if (onOpenContactCard) onOpenContactCard();
      },
    },

    // Tools
    {
      id: "tool-diagnostic",
      title: "Run Instant Issue Troubleshooter",
      subtitle: "Fix Wi-Fi drops, frozen PCs & slow network in 3 clicks",
      category: "Tools",
      icon: Wrench,
      badge: "Interactive",
      action: () => {
        navigate("/#interactive-tools");
        onClose();
      },
    },
    {
      id: "tool-speed",
      title: "Website Speed & Lost Lead Auditor",
      subtitle: "Test website load time and mobile conversion score",
      category: "Tools",
      icon: Globe,
      badge: "Speed Check",
      action: () => {
        navigate("/#interactive-tools");
        onClose();
      },
    },
    {
      id: "tool-downtime",
      title: "Business Downtime Cost Calculator",
      subtitle: "Calculate monetary loss from network outages in KES",
      category: "Tools",
      icon: Calculator,
      action: () => {
        navigate("/#interactive-tools");
        onClose();
      },
    },
    {
      id: "tool-hardware",
      title: "Office Hardware & CCTV Planner",
      subtitle: "Estimate access points, PoE switches & camera scope",
      category: "Tools",
      icon: Server,
      action: () => {
        navigate("/#interactive-tools");
        onClose();
      },
    },
    {
      id: "tool-terminal",
      title: "Live Ping & Network Terminal Console",
      subtitle: "Execute simulated gateway latency and trace diagnostics",
      category: "Tools",
      icon: Terminal,
      action: () => {
        navigate("/#interactive-tools");
        onClose();
      },
    },

    // Core Services
    {
      id: "srv-support",
      title: "Computer & Server Support",
      subtitle: "On-site visits in Nairobi & countrywide remote support",
      category: "Services",
      icon: Layers,
      action: () => {
        navigate("/services#it-support");
        onClose();
      },
    },
    {
      id: "srv-network",
      title: "Office Wi-Fi & Network Engineering",
      subtitle: "Ubiquiti/MikroTik mesh setups, VLANs & POS isolation",
      category: "Services",
      icon: Layers,
      action: () => {
        navigate("/services#network-wifi");
        onClose();
      },
    },
    {
      id: "srv-cctv",
      title: "CCTV Cameras & Smart Access Control",
      subtitle: "HD security cameras with live phone monitoring",
      category: "Services",
      icon: Layers,
      action: () => {
        navigate("/services#cctv-security");
        onClose();
      },
    },
    {
      id: "srv-web",
      title: "High-Converting Business Websites",
      subtitle: "Custom built, fast loading, direct WhatsApp lead flow",
      category: "Services",
      icon: Layers,
      action: () => {
        navigate("/services#web-development");
        onClose();
      },
    },

    // ─── LAPTOP & PC REPAIRS ───────────────────────────────────────────────
    {
      id: "it-laptop-screen",
      title: "Laptop Screen Replacement",
      subtitle: "Broken or cracked screen — all brands HP, Dell, Lenovo, MacBook",
      category: "Services",
      icon: Zap,
      badge: "24–48h",
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a laptop screen replaced. Can you help?"), "_blank");
        onClose();
      },
    },
    {
      id: "it-laptop-slow",
      title: "Slow Laptop / PC Fix & SSD Upgrade",
      subtitle: "Speed up slow computer — SSD upgrade, RAM boost, virus clean",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, my laptop is very slow. I need it fixed or upgraded."), "_blank");
        onClose();
      },
    },
    {
      id: "it-laptop-keyboard",
      title: "Laptop Keyboard Replacement",
      subtitle: "Broken, stuck or non-responsive keys on any laptop brand",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need my laptop keyboard replaced."), "_blank");
        onClose();
      },
    },
    {
      id: "it-laptop-charging",
      title: "Laptop Not Charging — Charging Port Repair",
      subtitle: "Laptop won't charge or battery drains fast",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, my laptop is not charging. The charging port may be broken."), "_blank");
        onClose();
      },
    },
    {
      id: "it-laptop-overheating",
      title: "Laptop Overheating Fix & Fan Cleaning",
      subtitle: "Laptop gets very hot, fan noisy, or shuts down randomly",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, my laptop is overheating and slowing down. Can you fix it?"), "_blank");
        onClose();
      },
    },
    {
      id: "it-virus-removal",
      title: "Virus & Malware Removal",
      subtitle: "Computer infected, slow, showing pop-ups or hacked",
      category: "Services",
      icon: ShieldCheck,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I think my computer has a virus. It's very slow and behaving strangely."), "_blank");
        onClose();
      },
    },
    {
      id: "it-data-recovery",
      title: "Hard Drive Data Recovery",
      subtitle: "Recover files from failed, corrupted, or accidentally deleted drive",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, my hard drive failed and I need to recover important files. Can you help?"), "_blank");
        onClose();
      },
    },
    {
      id: "it-windows-reinstall",
      title: "Windows Reinstallation & OS Repair",
      subtitle: "Format and reinstall Windows — removes all viruses & corruption",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need Windows reinstalled on my laptop or desktop PC."), "_blank");
        onClose();
      },
    },
    {
      id: "it-bsod",
      title: "Blue Screen of Death (BSOD) Fix",
      subtitle: "Laptop crashing, showing blue screen error codes",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, my laptop keeps showing a blue screen and crashing. Please help."), "_blank");
        onClose();
      },
    },
    {
      id: "it-pc-assembly",
      title: "Desktop PC Assembly & Repair",
      subtitle: "Build custom PC or repair desktop that won't start",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need help with desktop PC repair or assembly in Nairobi."), "_blank");
        onClose();
      },
    },

    // ─── PRINTERS & POS ───────────────────────────────────────────────────
    {
      id: "it-printer-setup",
      title: "Printer Setup & Configuration",
      subtitle: "Install and configure HP, Canon, Epson, Kyocera printers",
      category: "Services",
      icon: Wrench,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a printer set up at my office."), "_blank");
        onClose();
      },
    },
    {
      id: "it-printer-repair",
      title: "Printer Not Printing — Diagnosis & Fix",
      subtitle: "Printer offline, paper jam, faded prints, ink issues",
      category: "Services",
      icon: Wrench,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, my printer is not printing / keeps jamming. Can you fix it?"), "_blank");
        onClose();
      },
    },
    {
      id: "it-pos-printer",
      title: "POS Receipt Printer Setup",
      subtitle: "Thermal receipt printers for M-Pesa tills and retail counters",
      category: "Services",
      icon: Wrench,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a receipt printer set up for my POS till."), "_blank");
        onClose();
      },
    },

    // ─── CLOUD & EMAIL ────────────────────────────────────────────────────
    {
      id: "it-email-setup",
      title: "Business Email Setup (info@company.co.ke)",
      subtitle: "Professional email on your domain via Google Workspace or M365",
      category: "Services",
      icon: Globe,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a professional business email on my domain set up."), "_blank");
        onClose();
      },
    },
    {
      id: "it-google-workspace",
      title: "Google Workspace / Microsoft 365 Setup",
      subtitle: "Team email, Drive, Teams, and shared calendars",
      category: "Services",
      icon: Globe,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need Google Workspace or Microsoft 365 set up for my team."), "_blank");
        onClose();
      },
    },
    {
      id: "it-cloud-backup",
      title: "Cloud Backup & Data Protection",
      subtitle: "Automatic daily backup of company files to cloud",
      category: "Services",
      icon: ShieldCheck,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need automatic cloud backup set up for my company files."), "_blank");
        onClose();
      },
    },

    // ─── SECURITY & CYBERSECURITY ─────────────────────────────────────────
    {
      id: "it-firewall",
      title: "Office Firewall & Network Security",
      subtitle: "Protect business network from unauthorized access",
      category: "Services",
      icon: ShieldCheck,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a firewall set up to protect my office network."), "_blank");
        onClose();
      },
    },
    {
      id: "it-cyber-training",
      title: "Staff Cybersecurity & Phishing Awareness Training",
      subtitle: "Train your team to avoid scams, fake emails & hacking attempts",
      category: "Services",
      icon: ShieldCheck,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need cybersecurity training for my staff to prevent scams."), "_blank");
        onClose();
      },
    },

    // ─── NETWORKING ───────────────────────────────────────────────────────
    {
      id: "it-wifi-install",
      title: "Office Wi-Fi Installation",
      subtitle: "Enterprise-grade Wi-Fi coverage for offices, hotels & shops",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a proper Wi-Fi system installed in my office. Can we do a site visit?"), "_blank");
        onClose();
      },
    },
    {
      id: "it-slow-internet",
      title: "Slow Internet Fix & Diagnosis",
      subtitle: "Internet slow despite paying for fast fiber? I can fix it",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, our internet is very slow. I need help diagnosing and fixing it."), "_blank");
        onClose();
      },
    },
    {
      id: "it-lan-cabling",
      title: "LAN / Ethernet Network Cabling",
      subtitle: "Structured network cabling for offices, server rooms & floors",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need LAN/ethernet cabling done for my office."), "_blank");
        onClose();
      },
    },
    {
      id: "it-backup-internet",
      title: "Backup Internet Failover Setup",
      subtitle: "Auto-switch to backup line when main fiber goes down",
      category: "Services",
      icon: Zap,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I want a backup internet line that switches on automatically if my main line fails."), "_blank");
        onClose();
      },
    },

    // ─── WEBSITES ─────────────────────────────────────────────────────────
    {
      id: "it-website-design",
      title: "Business Website Design & Development",
      subtitle: "Fast loading, mobile-friendly website with WhatsApp CTAs",
      category: "Services",
      icon: Globe,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need a professional website designed and built for my business."), "_blank");
        onClose();
      },
    },
    {
      id: "it-google-maps",
      title: "Google Maps & Local SEO Setup",
      subtitle: "Get your business found on Google Search and Google Maps",
      category: "Services",
      icon: Globe,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need my business set up on Google Maps and local search."), "_blank");
        onClose();
      },
    },
    {
      id: "it-domain",
      title: "Domain Registration & Web Hosting",
      subtitle: ".co.ke / .com domain, SSL certificate, fast hosting",
      category: "Services",
      icon: Globe,
      action: () => {
        window.open(getWhatsAppUrl("Hi Peter, I need help registering a domain and setting up web hosting."), "_blank");
        onClose();
      },
    },

    // Case Studies
    {
      id: "cs-samchi",
      title: "Samchi Telecom (30+ Retail Branches)",
      subtitle: "Zero downtime across countrywide retail & telecom branch network",
      category: "Case Studies",
      icon: FolderGit2,
      badge: "30+ Branches",
      action: () => {
        navigate("/case-studies#samchi-telecom");
        onClose();
      },
    },
    {
      id: "cs-after40",
      title: "After40 Hotel Wi-Fi Overhaul",
      subtitle: "Eliminated guest Wi-Fi complaints across multi-floor hotel",
      category: "Case Studies",
      icon: FolderGit2,
      action: () => {
        navigate("/case-studies#after40-hotel");
        onClose();
      },
    },
    {
      id: "cs-snl",
      title: "SNL Venue Payment Tills & Security",
      subtitle: "Protected Wi-Fi channels for busy event venue POS machines",
      category: "Case Studies",
      icon: FolderGit2,
      action: () => {
        navigate("/case-studies#snl-venue");
        onClose();
      },
    },

    // Navigation & System
    {
      id: "nav-theme",
      title: `Switch Theme to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      subtitle: `Currently in ${theme} mode`,
      category: "Navigation",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: "nav-process",
      title: "How I Work (SLA & 4-Step Process)",
      subtitle: "15-minute response, clear pricing, verified handoff",
      category: "Navigation",
      icon: Sparkles,
      action: () => {
        navigate("/process");
        onClose();
      },
    },
    {
      id: "nav-about",
      title: "About Peter Kivevo John",
      subtitle: "Computer Science background & client credentials",
      category: "Navigation",
      icon: ShieldCheck,
      action: () => {
        navigate("/about");
        onClose();
      },
    },
    {
      id: "nav-track",
      title: "Track Repair / Ticket Status",
      subtitle: "Check live diagnostic & completion status of your IT job",
      category: "Navigation",
      icon: Sparkles,
      action: () => {
        navigate("/track");
        onClose();
      },
    },
    {
      id: "nav-verify",
      title: "Verify eTIMS Invoice Authenticity",
      subtitle: "KRA-compliant fiscal invoice authenticity verification",
      category: "Navigation",
      icon: ShieldCheck,
      action: () => {
        navigate("/verify");
        onClose();
      },
    },
    {
      id: "nav-admin",
      title: "Peter's Admin Command Portal",
      subtitle: "Security passcode protected console",
      category: "Navigation",
      icon: Lock,
      action: () => {
        navigate("/admin");
        onClose();
      },
    },
  ];

  // Smart search: matches title, subtitle, category, AND hidden keywords
  const serviceKeywords: Record<string, string[]> = {
    "it-laptop-screen": ["broken screen", "cracked screen", "display", "laptop screen nairobi"],
    "it-laptop-slow": ["slow pc", "slow computer", "lagging", "ssd", "ram upgrade", "speed up laptop"],
    "it-laptop-keyboard": ["keyboard broken", "keys not working", "keyboard replacement"],
    "it-laptop-charging": ["not charging", "charging port", "battery", "power issue"],
    "it-laptop-overheating": ["overheating", "fan noise", "laptop hot", "thermal"],
    "it-virus-removal": ["virus", "malware", "hacked", "pop-ups", "ransomware", "spyware"],
    "it-data-recovery": ["recover files", "deleted files", "hard drive failure", "data lost"],
    "it-windows-reinstall": ["format", "reinstall windows", "windows corrupt", "fresh install"],
    "it-bsod": ["blue screen", "bsod", "crash", "stop error"],
    "it-pc-assembly": ["desktop repair", "pc build", "custom pc"],
    "it-printer-setup": ["printer install", "setup printer", "printer driver"],
    "it-printer-repair": ["printer jam", "printer offline", "not printing", "ink problem"],
    "it-pos-printer": ["receipt printer", "pos", "till", "thermal printer", "mpesa receipt"],
    "it-email-setup": ["business email", "company email", "professional email", "info@"],
    "it-google-workspace": ["google workspace", "gmail business", "office 365", "microsoft 365"],
    "it-cloud-backup": ["backup", "cloud storage", "data protection", "google drive backup"],
    "it-firewall": ["firewall", "network security", "office security", "cybersecurity"],
    "it-cyber-training": ["phishing", "scam training", "cyber awareness", "staff training"],
    "it-wifi-install": ["wifi installation", "access point", "ubiquiti", "mikrotik", "wireless"],
    "it-slow-internet": ["slow wifi", "internet not working", "fiber slow", "bandwidth"],
    "it-lan-cabling": ["network cable", "ethernet", "cat6", "structured cabling"],
    "it-backup-internet": ["internet failover", "backup line", "dual isp", "internet down"],
    "it-website-design": ["web design", "website nairobi", "web development", "landing page"],
    "it-google-maps": ["google maps", "local seo", "google business", "search ranking"],
    "it-domain": ["domain", "hosting", "ssl", ".co.ke", "web hosting nairobi"],
  };

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const extraKeywords = serviceKeywords[item.id] || [];
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      extraKeywords.some((k) => k.includes(q))
    );
  });

  // Handle Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-card dark:bg-navy-900 border border-border/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-border/80 bg-muted/30">
          <Search className="w-5 h-5 text-teal-500 flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, tool, service, or case study... (or ↑↓ to navigate)"
            className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 sm:p-3 divide-y divide-border/40 space-y-1 max-h-[60vh]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40 text-teal-500" />
              <p className="text-sm font-semibold text-foreground">No matching command found</p>
              <p className="text-xs">Try: "laptop", "screen", "virus", "printer", "CCTV", "slow internet", "email", "website"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-150 ${
                    isSelected
                      ? "bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-teal-500 text-white shadow-sm shadow-teal-500/30"
                          : "bg-muted dark:bg-navy-950 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? "text-teal-700 dark:text-teal-300" : "text-foreground"
                        }`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                              item.badgeColor || "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono font-semibold uppercase text-muted-foreground/80 px-2 py-0.5 rounded bg-muted/60 hidden sm:inline-block">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? "text-teal-500 translate-x-0.5" : "text-muted-foreground opacity-40"
                    }`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-muted/50 border-t border-border/80 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-card border border-border">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-card border border-border">↵</kbd> Select</span>
          </div>
          <span>Peter Kivevo Command Palette</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

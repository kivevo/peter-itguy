import React from "react";
import { 
  Server, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  Globe2, 
  Terminal, 
  HardDrive,
  Network
} from "lucide-react";

export const TechMarquee: React.FC = () => {
  const technologies = [
    { name: "MikroTik RouterOS", category: "Routing & Bandwidth QoS" },
    { name: "Ubiquiti UniFi", category: "High-Density Wireless APs" },
    { name: "VLAN Network Isolation", category: "POS & Guest Security" },
    { name: "Cisco Switching", category: "Enterprise LAN Backbones" },
    { name: "Hikvision & Dahua IP CCTV", category: "Remote Phone Surveillance" },
    { name: "Windows Server & AD", category: "User & File Permissions" },
    { name: "Ubuntu / Debian Linux", category: "Web & Backup Servers" },
    { name: "React & TypeScript", category: "Custom Fast Web Apps" },
    { name: "Next.js & Vercel", category: "Sub-2s Mobile Speeds" },
    { name: "M-Pesa Daraja API", category: "Kenyan Payment Gateways" },
    { name: "Google Workspace & M365", category: "Corporate Mail & Cloud" },
    { name: "Off-site Encrypted Backup", category: "Disaster Recovery" },
  ];

  return (
    <div className="py-6 bg-muted/20 dark:bg-navy-950/80 border-b border-border/70 overflow-hidden select-none">
      <div className="container mx-auto px-4 sm:px-6 mb-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
          <span>Enterprise Stacks & Certified Ecosystem</span>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">Field Tested & Hardened</span>
        </div>
      </div>

      {/* Infinite marquee ticker */}
      <div className="relative flex overflow-x-hidden">
        <div className="flex gap-4 py-2 animate-marquee whitespace-nowrap">
          {technologies.concat(technologies).map((tech, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card dark:bg-navy-900 border border-border/80 text-xs font-medium text-foreground shadow-sm hover:border-teal-500/40 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="font-heading font-semibold text-foreground">{tech.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono">({tech.category})</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
export default TechMarquee;

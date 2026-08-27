import React from "react";
import { SITE_CONFIG, getWhatsAppUrl } from "@/config/site";
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Server, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  MapPin,
  MessageCircle,
  UserCheck
} from "lucide-react";

export const About: React.FC = () => {
  const careerMilestones = [
    {
      period: "Current Role",
      title: "Boutique IT Consultant & Multi-Branch Support Lead",
      organization: "The IT Guy / Samchi Telecom (Safaricom Dealer Network)",
      desc: "Architecting remote and field support operations across 30+ regional branches, managing vendor SLAs, POS reliability, and building high-converting websites.",
    },
    {
      period: "Infrastructure Turnaround",
      title: "Lead Systems & Network Overhaul Engineer",
      organization: "After40 Hotel & Hospitality Clients",
      desc: "Revived a 6-month defunct digital footprint, cut site load times by 40%, re-engineered guest Wi-Fi VLANs, and deployed 16-channel IP CCTV surveillance.",
    },
    {
      period: "ISP Foundations",
      title: "Network Operations & Client Support Intern",
      organization: "Fiberlink Systems Limited",
      desc: "Delivered hands-on fiber optic and wireless networking, customer CPE configurations, and WAN troubleshooting for 30+ enterprise clients with 90%+ satisfaction.",
    },
    {
      period: "Academic Foundation",
      title: "Bachelor of Science in Computer Science",
      organization: "Catholic University of Eastern Africa (CUEA)",
      desc: "Core specializations in Data Communications, Network Engineering, Systems Security, and Software Development Principles.",
    },
  ];

  const technicalCompetencies = [
    { category: "Networking & Security", skills: ["UniFi OS & Access Points", "MikroTik RouterOS", "VLAN & QoS Traffic Shaping", "Firewalls & VPN Tunnels", "IP CCTV & NVR Systems"] },
    { category: "Systems & Cloud", skills: ["Windows Server & Active Directory", "Linux (Ubuntu / Debian)", "Google Workspace & Microsoft 365", "Automated Cloud Backups", "Hardware Board-Level Repair"] },
    { category: "Web Engineering", skills: ["React / TypeScript", "Tailwind CSS", "Next.js & Vercel", "REST APIs & M-Pesa Gateways", "Technical SEO & Schema"] },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-muted/30 dark:bg-navy-900/60 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Background & Technical Range</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            About Peter Kivevo John: <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Engineer, Problem Solver & IT Partner</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A rare hybrid of hands-on physical networking experience, enterprise SLA discipline, and modern web development skills.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Personal Narrative & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-800 dark:bg-navy-950 border border-teal-500/30 flex items-center justify-center text-teal-400 font-heading font-bold text-xl">
                  P
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    Peter Kivevo John
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    BSc Computer Science • Nairobi GPO 00100
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  I built my career from the ground up: starting in the trenches of an Internet Service Provider (Fiberlink), crimping cables, aligning wireless radios, and troubleshooting customer gateways. That taught me one fundamental truth: <strong className="text-foreground">technology must produce business continuity, not excuses</strong>.
                </p>
                <p>
                  Since then, I have operated as the trusted IT backbone for organizations ranging from high-traffic hotels like <strong className="text-foreground">After40 Hotel</strong> to a nationwide <strong className="text-foreground">30+ branch Samchi Telecom network (Safaricom Dealer)</strong>. Whether I am configuring isolated POS subnets or writing clean React code for commercial websites, I take complete personal ownership of every system under my care.
                </p>
                <p>
                  I don't treat IT like a hobby shop. I treat it like what it is: the operational nervous system of your business.
                </p>

                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs sm:text-sm text-foreground space-y-1">
                  <strong className="text-teal-700 dark:text-teal-300 block font-heading">
                    ⚡ Direct Engineer Accountability:
                  </strong>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    When you partner with me, you work directly with the engineer who configures your gateways, isolates your POS VLANs, and writes your web code. No junior ticket queues, no call center intermediaries, and no excuses.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Resume & WhatsApp */}
              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="/Resume.pdf"
                  download="Peter_Kivevo_John_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted font-medium text-xs sm:text-sm transition-colors"
                >
                  <Download className="w-4 h-4 text-teal-500" />
                  <span>Download CV / Profile (PDF)</span>
                </a>
                <a
                  href={getWhatsAppUrl("Hi Peter, I'd like to discuss partnering with you as our IT consultant.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hire Me as Your IT Partner</span>
                </a>
              </div>
            </div>

            {/* Technical Competency Matrix */}
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-5">
              <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider">
                Technical Stack & Infrastructure Competencies
              </h4>

              <div className="space-y-4">
                {technicalCompetencies.map((group, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-400">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium text-foreground border border-border/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Career Milestones Timeline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-7 space-y-6">
              <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider pb-3 border-b border-border/70">
                Career Milestones & Proven Track Record
              </h4>

              <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-0.5 before:bg-teal-500/30">
                {careerMilestones.map((milestone, idx) => (
                  <div key={idx} className="relative pl-8 space-y-1">
                    {/* Timeline Node Dot */}
                    <div className="absolute left-2.5 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-500 border-2 border-card dark:border-navy-900" />

                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                      {milestone.period}
                    </span>

                    <h5 className="font-heading font-bold text-sm sm:text-base text-foreground mt-1">
                      {milestone.title}
                    </h5>

                    <p className="text-xs font-semibold text-muted-foreground">
                      {milestone.organization}
                    </p>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                      {milestone.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;

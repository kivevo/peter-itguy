import React from "react";
import { SITE_CONFIG, getWhatsAppUrl } from "@/config/site";
import { 
  Download, 
  MessageCircle, 
  UserCheck
} from "lucide-react";
import { ProfilePhoto } from "@/components/ProfilePhoto";

export const About: React.FC = () => {
  const careerMilestones = [
    {
      period: "Current Role",
      title: "Independent IT Consultant & Multi-Branch Support Lead",
      organization: "The IT Guy / Samchi Telecommunications Network",
      desc: "Providing daily remote and on-site support across 30+ regional branches, managing office Wi-Fi networks, and building modern business websites.",
    },
    {
      period: "Hotel Infrastructure",
      title: "Lead Network & Website Overhaul",
      organization: "After40 Hotel (Nairobi CBD)",
      desc: "Revived a 6-month offline website in days, sped up load times by 40%, re-organized guest Wi-Fi, and upgraded security cameras with live phone viewing.",
    },
    {
      period: "Internet Service Provider Experience",
      title: "Network Operations & Field Support",
      organization: "Fiberlink Systems Limited",
      desc: "Hands-on experience crimping fiber optic cables, aligning wireless internet antennas, and setting up office routers for over 30 business clients in Kenya.",
    },
    {
      period: "Academic Degree",
      title: "Bachelor of Science in Computer Science",
      organization: "Catholic University of Eastern Africa (CUEA)",
      desc: "Graduated with strong foundations in Computer Networks, System Security, Database Management, and Modern Web Development.",
    },
  ];

  const technicalCompetencies = [
    { category: "Wi-Fi & Office Networks", skills: ["Long-Range Wi-Fi APs", "Smart Routers & Bandwidth Control", "Protected Payment Tills", "Automatic Backup Internet", "HD Security Cameras (CCTV)"] },
    { category: "Computers & Cloud Systems", skills: ["Windows & Mac Troubleshooting", "Google Workspace & Microsoft 365", "Virus & Malware Cleaning", "Automatic Cloud File Backups", "Hardware & Printer Repairs"] },
    { category: "Fast Web Development", skills: ["Mobile-First Fast Websites", "Direct WhatsApp Ordering", "M-Pesa Integration", "Google Search Local SEO", "Fast Cloud Hosting"] },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-muted/30 dark:bg-navy-900/60 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Meet Your Engineer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            About Peter Kivevo John: <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Your Dependable IT Partner</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A reliable problem-solver who combines hands-on internet engineering, fast computer repair, and modern web development.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Personal Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pb-4 border-b border-border/70 text-center sm:text-left">
                <ProfilePhoto size="lg" />
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 uppercase tracking-wider inline-block">
                    On-Call IT Engineer · Nairobi
                  </span>
                  <h3 className="font-heading font-extrabold text-2xl text-foreground">
                    Peter Kivevo John
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    BSc Computer Science (CUEA) • Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  I started my career working in the field with an Internet Service Provider (Fiberlink), running fiber cables, aligning wireless radios, and fixing customer routers. That taught me an important lesson: <strong className="text-foreground">technology must keep your business running smoothly without excuses</strong>.
                </p>
                <p>
                  Since then, I have been the trusted IT partner for busy businesses across Kenya — from renowned hotels like <strong className="text-foreground">After40 Hotel in Nairobi CBD</strong> to a nationwide <strong className="text-foreground">30+ branch retail & telecom network for Samchi Telecommunications</strong>.
                </p>
                <p>
                  Whether I am setting up protected Wi-Fi for your payment tills, fixing a slow laptop, or designing a fast website that brings in WhatsApp orders, I take personal responsibility for making sure everything works reliably.
                </p>

                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs sm:text-sm text-foreground space-y-1">
                  <strong className="text-teal-700 dark:text-teal-300 block font-heading">
                    ⚡ Why Clients Enjoy Working With Me:
                  </strong>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    You talk directly with me — the engineer who does the work. You never have to deal with automated phone bots, support ticket queues, or inexperienced junior staff passing you around.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
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
                  href={getWhatsAppUrl("Hi Peter, I'd like to discuss partnering with you for IT support.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Practical Skills Matrix */}
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-5">
              <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider">
                What I Help Businesses With:
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

          {/* Right Column: Track Record Timeline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-7 space-y-6">
              <h4 className="font-heading font-bold text-base text-foreground uppercase tracking-wider pb-3 border-b border-border/70">
                Experience &amp; Proven Track Record
              </h4>

              <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-0.5 before:bg-teal-500/30">
                {careerMilestones.map((milestone, idx) => (
                  <div key={idx} className="relative pl-8 space-y-1">
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

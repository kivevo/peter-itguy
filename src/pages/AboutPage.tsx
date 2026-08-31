import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import TrustBadges from "@/components/TrustBadges";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import Testimonials from "@/components/Testimonials";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getWhatsAppUrl } from "@/config/site";
import { 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  MessageCircle, 
  ArrowRight,
  Terminal,
  Cpu,
  Building,
  HeartHandshake,
  Clock,
  Briefcase,
  Check
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"whoami" | "degree" | "experience" | "stack">("whoami");

  const terminalTabs = [
    { id: "whoami", label: "whoami", icon: UserCheck },
    { id: "degree", label: "degree", icon: GraduationCap },
    { id: "experience", label: "enterprise", icon: Building },
    { id: "stack", label: "hardware-stack", icon: Cpu },
  ];

  const comparison = [
    {
      feature: "Who Diagnoses & Fixes Your Problem?",
      peter: "Peter directly (BSc CS Graduate with 6+ years enterprise experience)",
      others: "Junior trainees or subcontracted interns rotated weekly",
    },
    {
      feature: "Response Time for Urgent WhatsApps",
      peter: "Under 15 minutes direct connection",
      others: "Automated ticket queue (2–24 hour response delay)",
    },
    {
      feature: "Network Security & Till Protection",
      peter: "Isolated VLAN channels ensuring payment tills never freeze during peak hours",
      others: "Basic unmanaged Wi-Fi where guest phones crash staff computers",
    },
    {
      feature: "Pricing Transparency",
      peter: "Clear written quotation before work starts with zero hidden fees",
      others: "Vague hourly rates that balloon unexpectedly",
    },
    {
      feature: "Accountability",
      peter: "One direct phone/WhatsApp number for your entire business infrastructure",
      others: "Different departments passing blame between ISP and hardware",
    },
  ];

  const scrollToContent = () => {
    document.getElementById("about-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen High-Impact 2-Column Hero */}
        <section className="relative min-h-[100dvh] pt-20 sm:pt-24 lg:pt-28 pb-8 flex flex-col justify-center bg-gradient-to-b from-muted/50 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -right-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 2-Column Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl my-auto py-2">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Left Column: Bio & Core Mission */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
                  <span>Senior Computer Systems Engineer • Nairobi, Kenya</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.15]">
                  Meet Peter Kivevo John: <br className="hidden md:inline" />
                  <span className="text-gradient-teal">The Engineer Behind Reliable Kenyan IT</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-none sm:line-clamp-none">
                  I combine formal computer science training with hands-on field experience maintaining retail dealership networks and hotel Wi-Fi infrastructure. When you work with me, you speak directly with the engineer who builds and secures your systems.
                </p>

                {/* 3 Key Pillars */}
                <div className="grid grid-cols-3 gap-2 text-left pt-0">
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🎓 BSc CompSci</span>
                    <span className="text-[11px] text-muted-foreground">CUEA Degree Graduate</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🏬 30+ Dealerships</span>
                    <span className="text-[11px] text-muted-foreground">Samchi Telecom Daily IT</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">⚡ Direct Contact</span>
                    <span className="text-[11px] text-muted-foreground">Zero Middlemen Queues</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href={getWhatsAppUrl("Hi Peter, I read your About page and would like to discuss IT support for my business.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat with Peter on WhatsApp</span>
                  </a>

                  <a
                    href="/files/Peter_Kivevo_Profile.pdf"
                    download="Peter_Kivevo_IT_Engineer_Profile.pdf"
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-500" />
                    <span>Download CV / Profile (PDF)</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Engineer Verification Terminal Widget */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-5 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="font-mono text-xs font-bold text-foreground ml-2">engineer_console.sh</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      LIVE VERIFIED
                    </span>
                  </div>

                  {/* Interactive Terminal Command Tabs */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {terminalTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as "whoami" | "degree" | "experience" | "stack")}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            isActive
                              ? "bg-teal-500/15 border-teal-500 text-foreground font-bold shadow-sm"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-500" : "text-muted-foreground"}`} />
                          <span className="text-[10px] font-mono truncate">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Terminal Tab Content */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-navy-950/70 border border-border/80 space-y-3 font-mono text-xs animate-in fade-in duration-200">
                    {activeTab === "whoami" && (
                      <div className="space-y-2 text-foreground">
                        <p className="text-teal-600 dark:text-teal-400 font-bold">$ peter --status</p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          • Name: Peter Kivevo John<br />
                          • Role: Senior Computer Systems &amp; Network Engineer<br />
                          • Location: Nairobi, Kenya (Coverage: Countrywide Remote &amp; On-Site)<br />
                          • Avg Emergency Response: &lt; 15 mins via WhatsApp
                        </p>
                      </div>
                    )}

                    {activeTab === "degree" && (
                      <div className="space-y-2 text-foreground">
                        <p className="text-teal-600 dark:text-teal-400 font-bold">$ verify --academic-credentials</p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          • Degree: Bachelor of Science in Computer Science (BSc CS)<br />
                          • University: Catholic University of Eastern Africa (CUEA)<br />
                          • Focus: Network Architecture, Distributed Systems, Database Security<br />
                          • Verification Status: Authenticated Graduate
                        </p>
                      </div>
                    )}

                    {activeTab === "experience" && (
                      <div className="space-y-2 text-foreground">
                        <p className="text-teal-600 dark:text-teal-400 font-bold">$ inspect --enterprise-footprint</p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          • Samchi Telecom: 30+ nationwide Safaricom retail branches<br />
                          • After40 Hotel: Central Nairobi CBD hotel Wi-Fi &amp; web infrastructure<br />
                          • SNL Lounge: High-density hospitality payment till isolation<br />
                          • Total Uptime Record: 99.8% across managed sites
                        </p>
                      </div>
                    )}

                    {activeTab === "stack" && (
                      <div className="space-y-2 text-foreground">
                        <p className="text-teal-600 dark:text-teal-400 font-bold">$ list --hardware-mastery</p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          • Routers: MikroTik RouterOS, UniFi Dream Machine, Cisco<br />
                          • Wi-Fi APs: Ubiquiti UniFi Long Range, TP-Link Omada<br />
                          • Systems: Windows Server, Linux (Ubuntu/Debian), macOS<br />
                          • Cloud: Automated daily NAS backup, AnyDesk Enterprise
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/70 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Direct Line: +254 751 035 034</span>
                      <a
                        href={getWhatsAppUrl("Hi Peter, I saw your engineer terminal and would like to connect.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                      >
                        <span>Message Peter</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div id="content-start" />

        {/* Content Anchor Marker */}
        <div id="about-start" />

        {/* Client Logos Strip */}
        <ClientLogoStrip />

        {/* Detailed Story & Philosophy Component */}
        <About />

        {/* Why Business Owners Choose Peter (Comparison Matrix) */}
        <section className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-950/60 border-y border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Direct Engineer Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Why Kenyan Businesses Work With Peter Directly
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                How our engineering approach delivers faster resolutions and lower costs compared to traditional outsourced IT agencies:
              </p>
            </div>

            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 dark:bg-navy-950/70">
                      <th className="p-4 sm:p-5 font-heading font-bold text-foreground">Service Criterion</th>
                      <th className="p-4 sm:p-5 font-heading font-bold text-teal-600 dark:text-teal-400">Peter Kivevo (The IT Guy)</th>
                      <th className="p-4 sm:p-5 font-heading font-bold text-muted-foreground">Generic Call-Center IT Agencies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {comparison.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 sm:p-5 font-semibold text-foreground">
                          {row.feature}
                        </td>
                        <td className="p-4 sm:p-5 text-teal-700 dark:text-teal-300 font-medium">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                            <span>{row.peter}</span>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 text-muted-foreground">
                          {row.others}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* University Degree & Technical Certifications */}
        <TrustBadges />

        {/* Client Testimonials */}
        <Testimonials />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default AboutPage;

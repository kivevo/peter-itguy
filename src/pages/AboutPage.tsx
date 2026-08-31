import React from "react";
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
  ChevronDown,
  Clock,
  Briefcase
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const engineerPillars = [
    {
      metric: "BSc Computer Science",
      label: "Degree Qualified",
      desc: "Catholic University of Eastern Africa (CUEA) graduate with deep systems theory.",
      icon: GraduationCap,
    },
    {
      metric: "30+ Retail Branches",
      label: "Enterprise Footprint",
      desc: "Daily nationwide IT support for Samchi Telecommunications dealership network.",
      icon: Building,
    },
    {
      metric: "< 15-Min SLA",
      label: "Rapid Remote Help",
      desc: "Immediate remote connection to resolve payment freezes and PC errors.",
      icon: Clock,
    },
    {
      metric: "Direct Accountability",
      label: "Zero Middlemen",
      desc: "You talk directly with the engineer who builds and fixes your systems.",
      icon: ShieldCheck,
    },
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
        {/* Full-Screen Immersive Landing Hero */}
        <section className="min-h-screen pt-28 pb-12 flex flex-col justify-between bg-gradient-to-b from-muted/40 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Landing Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl my-auto py-8 text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm animate-in fade-in">
              <GraduationCap className="w-4 h-4 text-teal-500" />
              <span>Senior Computer Engineer • BSc CS Graduate (CUEA)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-foreground tracking-tight leading-[1.1]">
              Meet Peter Kivevo John: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">The Engineer Behind Reliable Kenyan IT</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              I help Kenyan businesses eliminate downtime, secure their payment networks, and build fast websites that drive real revenue. When you work with me, you work directly with the engineer who takes personal responsibility for your uptime.
            </p>

            {/* 4 Engineer Credentials & Trust Pillars */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left pt-2">
              {engineerPillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-card/80 dark:bg-navy-900/80 backdrop-blur-sm border border-border/80 hover:border-teal-500/40 shadow-sm space-y-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-heading font-bold text-sm text-foreground">
                      {item.metric}
                    </p>
                    <p className="text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I read your About page and would like to discuss IT support for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat with Peter on WhatsApp</span>
              </a>

              <a
                href="/files/Peter_Kivevo_Profile.pdf"
                download="Peter_Kivevo_IT_Engineer_Profile.pdf"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-border bg-card/70 hover:bg-muted text-foreground font-semibold text-sm transition-colors"
              >
                <Download className="w-4 h-4 text-teal-500" />
                <span>Download CV / Profile (PDF)</span>
              </a>
            </div>
          </div>

          {/* Animated Scroll Down Indicator */}
          <div className="text-center pt-4 relative z-10">
            <button
              onClick={scrollToContent}
              className="inline-flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider">Scroll to read story, credentials &amp; comparison matrix</span>
              <div className="w-6 h-9 rounded-full border-2 border-muted-foreground/40 group-hover:border-teal-500 flex items-start justify-center p-1 transition-colors">
                <div className="w-1.5 h-2 bg-teal-500 rounded-full animate-bounce" />
              </div>
            </button>
          </div>
        </section>

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

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
  HeartHandshake
} from "lucide-react";

export const AboutPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>BSc Computer Science • Catholic University of Eastern Africa</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight">
              Meet Peter Kivevo John: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">The Engineer Behind Reliable Kenyan IT</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Combining formal computer science training with hands-on field experience supporting 30+ retail dealership branches and renowned hotels across Nairobi and Kenya.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I read your About page and would like to discuss IT support for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Peter on WhatsApp</span>
              </a>

              <a
                href="/files/Peter_Kivevo_Profile.pdf"
                download="Peter_Kivevo_IT_Engineer_Profile.pdf"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs sm:text-sm shadow-sm transition-colors"
              >
                <Download className="w-4 h-4 text-teal-500" />
                <span>Download CV / Profile (PDF)</span>
              </a>
            </div>
          </div>
        </section>

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

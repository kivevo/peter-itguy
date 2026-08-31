import React from "react";
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import ArchitectureViewer from "@/components/ArchitectureViewer";
import OfficeNetworkVisualizer from "@/components/OfficeNetworkVisualizer";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import Testimonials from "@/components/Testimonials";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getWhatsAppUrl } from "@/config/site";
import { 
  FolderGit2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  MessageCircle,
  Sparkles
} from "lucide-react";

export const CaseStudiesPage: React.FC = () => {
  const highlightMetrics = [
    {
      metric: "40% Faster",
      label: "Website Load Speed",
      subtext: "After40 Hotel revived with sub-1.5s mobile speed & WhatsApp bookings",
      icon: Zap,
    },
    {
      metric: "30+ Branches",
      label: "Retail Network Supported",
      subtext: "Samchi Telecom daily nationwide IT support with <35 min resolution",
      icon: Building2,
    },
    {
      metric: "200+ Devices",
      label: "Zero Payment Till Freezes",
      subtext: "SNL Lounge dining cabanas & garden Wi-Fi with isolated till VLANs",
      icon: ShieldCheck,
    },
    {
      metric: "99.8% Uptime",
      label: "Average System Availability",
      subtext: "Proactive remote monitoring preventing catastrophic network outages",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Proven Results • 30+ Enterprise Branches &amp; Hotels</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight">
              Real Engineering Turnarounds: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Zero Downtime &amp; Faster Systems</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore in-depth case studies showing how we fix recurring Wi-Fi drops, protect payment machines from guest traffic, revive offline websites, and keep multi-branch operations online across Kenya.
            </p>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I looked at your case studies and would like to solve a similar challenge for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Your Business Challenge with Peter</span>
              </a>
            </div>
          </div>
        </section>

        {/* Highlight Metrics Matrix Bar */}
        <section className="py-12 bg-background dark:bg-navy-950/80 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlightMetrics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-card dark:bg-navy-900 border border-border/80 shadow-sm space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-black font-heading text-foreground">
                      {item.metric}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Client Partners Bar */}
        <ClientLogoStrip />

        {/* Before vs After Interactive Architecture Diagram Viewer */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Engineering Deep Dive
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Before vs. After: Architecture Turnarounds
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                See how we re-engineer failing flat networks into secure, VLAN-isolated architectures with automatic 5G/4G backup lines.
              </p>
            </div>

            <ArchitectureViewer />
          </div>
        </section>

        {/* Interactive Office Network Visualizer */}
        <section className="py-16 lg:py-20 bg-background dark:bg-navy-950 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Interactive Simulator
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Why Payment Tills Freeze (And How We Fix It)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Toggle between an unmanaged network and a Peter-configured protected network to see the live difference:
              </p>
            </div>

            <OfficeNetworkVisualizer />
          </div>
        </section>

        {/* Full Case Studies Portfolio Grid */}
        <Portfolio />

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

export default CaseStudiesPage;

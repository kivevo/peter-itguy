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
  Sparkles,
  ChevronDown,
  Activity
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

  const scrollToContent = () => {
    document.getElementById("case-studies-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen Immersive Landing Hero */}
        <section className="min-h-screen pt-28 pb-12 flex flex-col justify-between bg-gradient-to-b from-muted/40 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Landing Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl my-auto py-8 text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm animate-in fade-in">
              <FolderGit2 className="w-4 h-4 text-teal-500" />
              <span>Proven Field Results • 30+ Enterprise Dealerships &amp; Hotels</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-foreground tracking-tight leading-[1.1]">
              Real Engineering Turnarounds: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Zero Downtime &amp; Faster Systems</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We don’t just claim reliability — we prove it. Explore documented before-and-after case studies of hotels, retail chains, and commercial stores where we fixed dropped Wi-Fi, eliminated payment freezes, and doubled website speeds.
            </p>

            {/* 4 Highlight Metrics Matrix Bar */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left pt-2">
              {highlightMetrics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-card/80 dark:bg-navy-900/80 backdrop-blur-sm border border-border/80 hover:border-teal-500/40 shadow-sm space-y-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black font-heading text-foreground">
                      {item.metric}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I looked at your case studies and would like to solve a similar challenge for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Discuss Your Business Challenge with Peter</span>
              </a>

              <button
                type="button"
                onClick={scrollToContent}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-border bg-card/70 hover:bg-muted text-foreground font-semibold text-sm transition-colors"
              >
                <span>View Architecture Breakdowns &amp; Turnarounds</span>
                <ArrowRight className="w-4 h-4 text-teal-500" />
              </button>
            </div>
          </div>

          {/* Animated Scroll Down Indicator */}
          <div className="text-center pt-4 relative z-10">
            <button
              onClick={scrollToContent}
              className="inline-flex flex-col items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider">Scroll to view turnaround stories &amp; diagrams</span>
              <div className="w-6 h-9 rounded-full border-2 border-muted-foreground/40 group-hover:border-teal-500 flex items-start justify-center p-1 transition-colors">
                <div className="w-1.5 h-2 bg-teal-500 rounded-full animate-bounce" />
              </div>
            </button>
          </div>
        </section>

        {/* Content Anchor Marker */}
        <div id="case-studies-start" />

        {/* Verified Client Partners Bar */}
        <ClientLogoStrip />

        {/* Before vs After Interactive Architecture Diagram Viewer */}
        <section className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
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

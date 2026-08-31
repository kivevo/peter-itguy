import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import BlogResources from "@/components/BlogResources";
import TechnicalFAQ from "@/components/TechnicalFAQ";
import WebsiteSpeedChecker from "@/components/WebsiteSpeedChecker";
import LeadMagnetModal from "@/components/LeadMagnetModal";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Search, 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Server,
  ArrowRight,
  ChevronDown,
  FileText
} from "lucide-react";

export const BlogPage: React.FC = () => {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const categories = [
    { title: "Office Wi-Fi & Networks", count: "8 Guides", icon: Wifi, desc: "Fixing signal deadzones, VLAN till isolation & 5G failover." },
    { title: "Payment Tills & M-Pesa", count: "4 Guides", icon: Server, desc: "Preventing card machine timeouts during busy sales hours." },
    { title: "Fast Websites & 5G SEO", count: "6 Guides", icon: Smartphone, desc: "Sub-2s mobile loading, WhatsApp ordering & Google local rank." },
    { title: "CCTV & Office Cyber Safety", count: "5 Guides", icon: ShieldCheck, desc: "Phone live streaming, secure passwords & phishing defense." },
  ];

  const scrollToContent = () => {
    document.getElementById("resources-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen Immersive Landing Hero */}
        <section className="min-h-screen pt-28 pb-12 flex flex-col justify-between bg-gradient-to-b from-muted/40 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Centered Landing Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl my-auto py-8 text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm animate-in fade-in">
              <BookOpen className="w-4 h-4 text-teal-500" />
              <span>Practical Advice • Free IT Knowledge Base for Kenya</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-foreground tracking-tight leading-[1.1]">
              Practical IT Knowledge: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Guides, Diagnostics &amp; Checklists</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Clear, non-technical advice on fixing slow office internet, preventing payment till freezes, protecting CCTV security feeds, and boosting website speeds across Kenya.
            </p>

            {/* 4 Topic Category Pills */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left pt-2">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-card/80 dark:bg-navy-900/80 backdrop-blur-sm border border-border/80 hover:border-teal-500/40 shadow-sm transition-all space-y-1.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
                        {cat.title}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 block">
                      {cat.count}
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setIsChecklistOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download Free Office Wi-Fi PDF Checklist</span>
              </button>

              <button
                type="button"
                onClick={scrollToContent}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-border bg-card/70 hover:bg-muted text-foreground font-semibold text-sm transition-colors"
              >
                <span>Read Articles &amp; Test Live Speed</span>
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
              <span className="font-mono text-[11px] uppercase tracking-wider">Scroll to read practical guides, tools &amp; technical FAQs</span>
              <div className="w-6 h-9 rounded-full border-2 border-muted-foreground/40 group-hover:border-teal-500 flex items-start justify-center p-1 transition-colors">
                <div className="w-1.5 h-2 bg-teal-500 rounded-full animate-bounce" />
              </div>
            </button>
          </div>
        </section>

        {/* Content Anchor Marker */}
        <div id="resources-start" />

        {/* Free Downloadable Checklist Callout Banner */}
        <section className="py-8 bg-teal-600/10 dark:bg-teal-500/10 border-b border-teal-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Free PDF Checklist Download
              </span>
              <p className="text-base font-heading font-bold text-foreground">
                "5 Signs Your Office Wi-Fi Needs an Upgrade" (Free 2-Page Audit Checklist)
              </p>
              <p className="text-xs text-muted-foreground">
                Download our free checklist to spot signal bottlenecks, unauthorized devices, and payment machine risks.
              </p>
            </div>
            <button
              onClick={() => setIsChecklistOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex-shrink-0 transition-transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Free PDF</span>
            </button>
          </div>
        </section>

        {/* Live Website Speed & Latency Tool Simulator */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Live Interactive Diagnostic
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Test Your Website Speed in Kenya
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter any domain to simulate 5G/4G load times on Safaricom and Airtel networks:
              </p>
            </div>

            <WebsiteSpeedChecker />
          </div>
        </section>

        {/* Full Blog & Practical Resources Grid */}
        <BlogResources />

        {/* Frequently Asked Questions */}
        <TechnicalFAQ />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />

      {/* Free Checklist Modal */}
      <LeadMagnetModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />
    </div>
  );
};

export default BlogPage;

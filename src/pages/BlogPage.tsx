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
  FileText,
  Zap,
  CheckCircle2
} from "lucide-react";

export const BlogPage: React.FC = () => {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [activeCatIdx, setActiveCatIdx] = useState(0);

  const categories = [
    {
      id: "wifi",
      title: "Office Wi-Fi & Networks",
      count: "8 Guides",
      icon: Wifi,
      badge: "High Demand",
      topic: "How to fix Wi-Fi signal deadzones and isolate guest phones from payment machines.",
      tips: [
        "Position antennas at ceiling height for 360° coverage",
        "Put payment machines on an exclusive private VLAN lane",
        "Enable 5G/4G automatic router failover for fiber cuts",
      ],
    },
    {
      id: "pos",
      title: "Payment Tills & M-Pesa",
      count: "4 Guides",
      icon: Server,
      badge: "Zero Freezes",
      topic: "Stopping card machine timeouts and POS crashes during peak customer sales hours.",
      tips: [
        "Assign fixed static IP addresses to payment PDQ machines",
        "Limit guest Wi-Fi bandwidth to prevent video buffering drag",
        "Connect main tills via shielded Cat6 Ethernet cables",
      ],
    },
    {
      id: "web",
      title: "Fast Websites & 5G SEO",
      count: "6 Guides",
      icon: Smartphone,
      badge: "Sub-2s Mobile",
      topic: "How to make business websites load in under 2 seconds on Safaricom & Airtel networks.",
      tips: [
        "Compress all product images to next-gen WebP format",
        "Add direct 1-click WhatsApp order flows on mobile",
        "Setup Google Business Profile for local Nairobi SEO",
      ],
    },
    {
      id: "cctv",
      title: "CCTV & Security",
      count: "5 Guides",
      icon: ShieldCheck,
      badge: "24/7 Monitoring",
      topic: "Best practices for phone live viewing, encrypted access control & data backup.",
      tips: [
        "Use private NVR network to prevent camera feed snooping",
        "Automate daily cloud backups for accounting databases",
        "Enforce two-factor authentication on manager emails",
      ],
    },
  ];

  const currentCategory = categories[activeCatIdx];
  const CurrentCatIcon = currentCategory.icon;

  const scrollToContent = () => {
    document.getElementById("resources-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen High-Impact 2-Column Hero */}
        <section className="relative min-h-[100dvh] pt-20 sm:pt-24 lg:pt-28 pb-4 flex flex-col justify-between bg-gradient-to-b from-muted/50 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -left-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -right-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 2-Column Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl my-auto py-2">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Left Column: Knowledge Base Mission */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm">
                  <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                  <span>Free IT Knowledge Base • Practical Advice for Kenya</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.15]">
                  Practical IT Knowledge: <br className="hidden md:inline" />
                  <span className="text-gradient-teal">Guides, Diagnostics &amp; Tools</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-none sm:line-clamp-none">
                  Clear, non-technical advice for business owners on fixing slow office internet, preventing payment till freezes, protecting CCTV security feeds, and boosting website speeds across Kenya.
                </p>

                {/* 3 Free Resources Badges */}
                <div className="grid grid-cols-3 gap-2 text-left pt-0">
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">📥 Free PDF</span>
                    <span className="text-[11px] text-muted-foreground">Audit Checklist</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">⚡ Live Speed Tool</span>
                    <span className="text-[11px] text-muted-foreground">Kenyan 5G/4G Ping</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">📚 12+ Guides</span>
                    <span className="text-[11px] text-muted-foreground">Actionable Steps</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChecklistOpen(true)}
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Free Wi-Fi PDF Checklist</span>
                  </button>

                  <button
                    type="button"
                    onClick={scrollToContent}
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <span>Read Guides &amp; Test Live Speed</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Knowledge Base Navigator Widget */}
              <div className="mt-6 lg:mt-0 lg:col-span-5">
                <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-5 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-foreground">Interactive Knowledge Topics</span>
                    </div>
                    <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">{currentCategory.badge}</span>
                  </div>

                  {/* 4 Category Tabs */}
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat, idx) => {
                      const Icon = cat.icon;
                      const isActive = activeCatIdx === idx;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCatIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            isActive
                              ? "bg-teal-500/15 border-teal-500 text-foreground font-bold shadow-sm"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-teal-500" : "text-muted-foreground"}`} />
                          <span className="text-xs truncate">{cat.title.split("&")[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Category Card */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-navy-950/70 border border-border/80 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <CurrentCatIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                            {currentCategory.title}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">{currentCategory.count} available</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentCategory.topic}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider block">Key Engineering Advice:</span>
                      {currentCategory.tips.map((tip, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsChecklistOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all hover:shadow-glow mt-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Free Audit Checklist (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          {/* Viewport Bottom Scroll Down Bar */}
          <div className="pt-2 pb-2 text-center relative z-10">
            <button
              onClick={() => document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-muted-foreground hover:text-teal-500 dark:hover:text-teal-400 transition-colors group cursor-pointer"
            >
              <span>Scroll down to explore full details</span>
              <ChevronDown className="w-3.5 h-3.5 text-teal-500 animate-bounce group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </section>
        <div id="content-start" />

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

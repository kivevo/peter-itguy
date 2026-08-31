import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Services from "@/components/Services";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import { InteractiveToolkitHub } from "@/components/InteractiveToolkitHub";
import QuickQuoteEstimator from "@/components/QuickQuoteEstimator";
import EngagementPricing from "@/components/EngagementPricing";
import TechnicalFAQ from "@/components/TechnicalFAQ";
import ITServicesDirectory from "@/components/ITServicesDirectory";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SERVICES, getWhatsAppUrl } from "@/config/site";
import { 
  Layers, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ArrowRight,
  Cpu,
  Wifi,
  Globe,
  Wrench,
  ShieldCheck,
  Calculator,
  ChevronDown,
  Activity,
  Server,
  Zap,
  Clock,
  ArrowUpRight,
  Shield
} from "lucide-react";

export const ServicesPage: React.FC = () => {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const heroServices = [
    {
      id: "wifi",
      icon: Wifi,
      badge: "Zero Till Freezes",
      title: "Office Wi-Fi & VLANs",
      turnaround: "Same-Day Setup",
      rate: "From KES 15,000",
      highlight: "Isolated guest Wi-Fi + 5G/4G automatic failover router for payment machines.",
      included: [
        "Private POS lane so M-Pesa never lags",
        "UniFi & MikroTik long-range AP mounting",
        "Automatic backup internet router failover",
      ],
    },
    {
      id: "remote",
      icon: Cpu,
      badge: "15-Min Connection",
      title: "Remote Computer & IT Support",
      turnaround: "< 15 Mins",
      rate: "From KES 2,500 / fix",
      highlight: "Fast hands-on remote triage for slow Windows/Mac PCs, virus locks, and servers.",
      included: [
        "Instant AnyDesk/TeamViewer remote triage",
        "Point of Sale & accounting software fix",
        "Automated daily cloud backup setup",
      ],
    },
    {
      id: "web",
      icon: Globe,
      badge: "Sub-2s Speed",
      title: "Fast Mobile Websites & SEO",
      turnaround: "5–10 Days",
      rate: "From KES 35,000",
      highlight: "High-converting web design optimized for Safaricom 5G/4G with direct WhatsApp CTAs.",
      included: [
        "Sub-2s mobile loading speed on Kenyan 5G",
        "Direct 1-click WhatsApp order flows",
        "Google Maps & Local Search SEO ranking",
      ],
    },
    {
      id: "cctv",
      icon: ShieldCheck,
      badge: "HD Live Phone Feed",
      title: "CCTV Security & Access Control",
      turnaround: "1–2 Days",
      rate: "From KES 25,000",
      highlight: "Night-vision HD cameras with encrypted live phone viewing app for managers.",
      included: [
        "Color night vision & remote phone app",
        "Biometric door access & attendance logs",
        "Clean structured trunking & cabling",
      ],
    },
  ];

  const quickJumps = [
    { label: "Core 4 Services", href: "#core-services" },
    { label: "Interactive IT Tools", href: "#interactive-tools" },
    { label: "Itemized Scope", href: "#scope-breakdown" },
    { label: "Quote Builder", href: "#quote-builder" },
    { label: "Retainer Pricing", href: "#pricing-plans" },
    { label: "50+ IT Directory", href: "#it-directory" },
    { label: "Technical FAQ", href: "#technical-faq" },
  ];

  const currentHeroService = heroServices[activeServiceIdx];
  const CurrentIcon = currentHeroService.icon;

  const scrollToContent = () => {
    document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen High-Impact 2-Column Hero */}
        <section className="min-h-screen pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-36 lg:pb-12 flex flex-col justify-center bg-gradient-to-b from-muted/50 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -right-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 2-Column Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Left Column: Value Proposition & CTAs */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  <span>Enterprise Catalog • Nairobi &amp; Countrywide</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.15]">
                  Enterprise IT Support, <br className="hidden md:inline" />
                  <span className="text-gradient-teal">Unbreakable Wi-Fi &amp; Fast Web</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-none sm:line-clamp-none">
                  Whether you need 15-minute emergency computer help, multi-floor Wi-Fi that never crashes your payment tills, or a high-converting business website, explore our certified turnkey services.
                </p>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-3 gap-2 text-left pt-0">
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">⚡ &lt; 15 Mins</span>
                    <span className="text-[11px] text-muted-foreground">Urgent Remote SLA</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🏢 30+ Branches</span>
                    <span className="text-[11px] text-muted-foreground">Retail &amp; Hotel Proof</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🔒 100% Fixed</span>
                    <span className="text-[11px] text-muted-foreground">Transparent Quotes</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href={getWhatsAppUrl("Hi Peter, I want to book a service consultation for my business.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Book Service on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={scrollToContent}
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <span>Browse 50+ IT Directory</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                  </button>
                </div>

                {/* Quick Navigation Anchor Bar */}
                <div className="hidden sm:flex pt-2 flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                  {quickJumps.map((jump, idx) => (
                    <a
                      key={idx}
                      href={jump.href}
                      className="px-2.5 py-1 rounded-xl bg-muted/60 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 text-muted-foreground text-[11px] font-medium border border-border/70 transition-colors"
                    >
                      {jump.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Live Service Navigator Widget */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-5 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-foreground">Interactive Service Selector</span>
                    </div>
                    <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">{currentHeroService.rate}</span>
                  </div>

                  {/* 4 Service Tabs */}
                  <div className="grid grid-cols-2 gap-2">
                    {heroServices.map((srv, idx) => {
                      const Icon = srv.icon;
                      const isActive = activeServiceIdx === idx;
                      return (
                        <button
                          key={srv.id}
                          onClick={() => setActiveServiceIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            isActive
                              ? "bg-teal-500/15 border-teal-500 text-foreground font-bold shadow-sm"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-teal-500" : "text-muted-foreground"}`} />
                          <span className="text-xs truncate">{srv.title.split("&")[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Service Showcase Card */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-navy-950/70 border border-border/80 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <CurrentIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                            {currentHeroService.title}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">Turnaround: {currentHeroService.turnaround}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                        {currentHeroService.badge}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentHeroService.highlight}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider block">Scope Highlights:</span>
                      {currentHeroService.included.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
                          <Check className="w-3 h-3 text-teal-500 flex-shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={getWhatsAppUrl(`Hi Peter, I would like to book a quotation for ${currentHeroService.title}.`, currentHeroService.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all hover:shadow-glow mt-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Book {currentHeroService.title.split("&")[0]} via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Anchor Marker */}
        <div id="content-start" />

        {/* Verified Client Partners Bar */}
        <ClientLogoStrip />

        {/* 1. Core Services Interactive Showcase */}
        <div id="core-services">
          <Services />
        </div>

        {/* 2. Unified Interactive IT Toolkit Hub (All 6 tools in clean tabs) */}
        <div id="interactive-tools">
          <InteractiveToolkitHub />
        </div>

        {/* 3. Detailed Scope & Deliverables Breakdown */}
        <section id="scope-breakdown" className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-900/40 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Itemized Deliverables
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Complete Service Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Everything that is included in each turnkey engagement with exact turnaround times:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  id={service.id}
                  className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                        {service.badge}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {service.startingPrice}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold font-heading text-foreground">
                      {service.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.fullDesc}
                    </p>

                    <div className="space-y-2 pt-2">
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
                        What's Included:
                      </h4>
                      <div className="space-y-1.5">
                        {service.whatsIncluded.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                            <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/70 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>Response: {service.typicalTurnaround}</span>
                    </div>
                    <a
                      href={getWhatsAppUrl(`Hi Peter, I need a quote for ${service.title}.`, service.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Book {service.title} via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Interactive Project Scope Estimator */}
        <div id="quote-builder">
          <QuickQuoteEstimator />
        </div>

        {/* 5. Support Plans & Transparent Pricing */}
        <div id="pricing-plans">
          <EngagementPricing />
        </div>

        {/* 6. Comprehensive 50+ IT Services Directory */}
        <div id="it-directory">
          <ITServicesDirectory />
        </div>

        {/* 7. Frequently Asked Questions */}
        <div id="technical-faq">
          <TechnicalFAQ />
        </div>

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ServicesPage;

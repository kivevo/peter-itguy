import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SITE_CONFIG, getWhatsAppUrl } from "@/config/site";
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Calendar,
  ArrowRight,
  ChevronDown,
  Building2,
  Headphones
} from "lucide-react";

export const ContactPage: React.FC = () => {
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);

  const directChannels = [
    {
      title: "Direct WhatsApp Line",
      subtitle: "Fastest response (under 5 mins)",
      value: SITE_CONFIG.phoneDisplay,
      href: getWhatsAppUrl("Hi Peter, reaching out from your website contact page for urgent IT help."),
      icon: MessageCircle,
      badge: "Fastest Response",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      ctaText: "Start WhatsApp Chat",
      details: "Direct line to Peter. Send photos, error logs, or voice notes for immediate triage.",
    },
    {
      title: "Direct Phone Call",
      subtitle: "Speak directly with Peter",
      value: SITE_CONFIG.phoneDisplay,
      href: `tel:${SITE_CONFIG.phone}`,
      icon: Phone,
      badge: "Emergency Fixes",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      ctaText: "Call Peter Directly",
      details: "Ideal for sudden network dropouts, server crashes, or POS till emergencies.",
    },
    {
      title: "Official RFP Email",
      subtitle: "For tenders & formal proposals",
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
      icon: Mail,
      badge: "Written Quotes",
      badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      ctaText: "Send RFP Email",
      details: "Detailed PDF quotations and contracts delivered within 24 business hours.",
    },
    {
      title: "Service Base & Coverage",
      subtitle: "On-site Nairobi & Countrywide Remote",
      value: "Parklands / Westlands / CBD Base",
      href: "#contact-form",
      icon: MapPin,
      badge: "Nairobi & Remote",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      ctaText: "Book Physical Visit",
      details: "Same-day on-site physical dispatch across Nairobi. Remote connection nationwide.",
    },
  ];

  const expectations = [
    {
      step: "01",
      title: "Instant Triage (Within 5 Mins)",
      desc: "Your WhatsApp message or booking is received directly by Peter — no automated call bots or junior receptionists.",
    },
    {
      step: "02",
      title: "Quick Diagnostic Connection",
      desc: "For computer or software issues, Peter connects via secure remote tools in <15 minutes to inspect the error live.",
    },
    {
      step: "03",
      title: "Same-Day On-Site Dispatch",
      desc: "For physical Wi-Fi, router failures, cabling or CCTV in Nairobi, a physical visit is scheduled with exact time slots.",
    },
    {
      step: "04",
      title: "Transparent, Fixed Invoicing",
      desc: "Clear itemized pricing before work begins. Payment upon full resolution via M-Pesa or Bank transfer.",
    },
  ];

  const currentChannel = directChannels[activeChannelIdx];
  const CurrentChannelIcon = currentChannel.icon;

  const scrollToContent = () => {
    document.getElementById("contact-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen High-Impact 2-Column Hero */}
        <section className="relative min-h-[100dvh] pt-20 sm:pt-24 lg:pt-28 pb-4 flex flex-col justify-between bg-gradient-to-b from-muted/50 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 overflow-hidden">>
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -right-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 2-Column Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl my-auto py-2">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Left Column: Direct Access Message */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-mono font-semibold border border-emerald-500/20 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Availability: Peter is On-Call in Nairobi &amp; Remote</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.15]">
                  Direct Engineering Help: <br className="hidden md:inline" />
                  <span className="text-gradient-teal">No Queues, No Call Center Bots</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-none sm:line-clamp-none">
                  Need urgent computer repairs, office Wi-Fi troubleshooting, security camera installation, or a fast business website? Connect directly with senior computer engineer Peter Kivevo John.
                </p>

                {/* 3 Direct Access Badges */}
                <div className="grid grid-cols-3 gap-2 text-left pt-0">
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">⚡ &lt; 5 Mins</span>
                    <span className="text-[11px] text-muted-foreground">WhatsApp Triage</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🚗 Same-Day</span>
                    <span className="text-[11px] text-muted-foreground">Nairobi On-Site</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🔒 Direct Line</span>
                    <span className="text-[11px] text-muted-foreground">One Single Number</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href={getWhatsAppUrl("Hi Peter, reaching out from your website contact page.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Start Direct Chat on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={scrollToContent}
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <span>Book Physical Visit &amp; Form</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Direct Channel Hub Widget */}
              <div className="mt-6 lg:mt-0 lg:col-span-5">
                <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-5 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-foreground">Direct Access Channels</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      ONLINE
                    </span>
                  </div>

                  {/* 4 Direct Channel Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {directChannels.map((ch, idx) => {
                      const Icon = ch.icon;
                      const isActive = activeChannelIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveChannelIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            isActive
                              ? "bg-teal-500/15 border-teal-500 text-foreground font-bold shadow-sm"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-teal-500" : "text-muted-foreground"}`} />
                          <span className="text-xs truncate">{ch.title.split(" ")[0]} {ch.title.split(" ")[1]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Channel Showcase Card */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-navy-950/70 border border-border/80 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <CurrentChannelIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                            {currentChannel.title}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">{currentChannel.subtitle}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${currentChannel.badgeColor}`}>
                        {currentChannel.badge}
                      </span>
                    </div>

                    <p className="text-xs font-mono font-bold text-foreground">
                      {currentChannel.value}
                    </p>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentChannel.details}
                    </p>

                    <a
                      href={currentChannel.href}
                      target={currentChannel.href.startsWith("http") ? "_blank" : undefined}
                      rel={currentChannel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all hover:shadow-glow mt-2"
                    >
                      <CurrentChannelIcon className="w-3.5 h-3.5" />
                      <span>{currentChannel.ctaText}</span>
                    </a>
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
        <div id="contact-start" />

        {/* Main Interactive Contact & Appointment Form Component */}
        <div id="contact-form">
          <Contact />
        </div>

        {/* What to Expect Timeline */}
        <section className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Transparent SLA
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                What Happens When You Reach Out?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We believe in zero downtime and zero ambiguity. Here is our exact client intake and dispatch flow:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {expectations.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-card dark:bg-navy-900 border border-border/80 space-y-3 relative overflow-hidden"
                >
                  <span className="text-3xl font-black font-heading text-teal-500/30">
                    {item.step}
                  </span>
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ContactPage;

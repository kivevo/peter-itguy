import React from "react";
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
  ChevronDown
} from "lucide-react";

export const ContactPage: React.FC = () => {
  const directChannels = [
    {
      title: "Direct WhatsApp Line",
      subtitle: "Fastest response (under 5 mins)",
      value: SITE_CONFIG.phoneDisplay,
      href: getWhatsAppUrl("Hi Peter, reaching out from your website contact page."),
      icon: MessageCircle,
      badge: "Fastest Response",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      ctaText: "Chat on WhatsApp",
      isPrimary: true,
    },
    {
      title: "Direct Phone Call",
      subtitle: "Speak directly with Peter",
      value: SITE_CONFIG.phoneDisplay,
      href: `tel:${SITE_CONFIG.phone}`,
      icon: Phone,
      badge: "Emergency Fixes",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
      ctaText: "Call Now",
      isPrimary: false,
    },
    {
      title: "Official Email",
      subtitle: "For RFP, tenders & formal quotes",
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
      icon: Mail,
      badge: "Written Quotes",
      badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      ctaText: "Send Email",
      isPrimary: false,
    },
    {
      title: "Service Base & Coverage",
      subtitle: "On-site Nairobi & Countrywide Remote",
      value: "Nairobi CBD & Westlands Base",
      href: "#contact-form",
      icon: MapPin,
      badge: "Nairobi & Remote",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      ctaText: "Book On-Site Visit",
      isPrimary: false,
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

  const scrollToContent = () => {
    document.getElementById("contact-start")?.scrollIntoView({ behavior: "smooth" });
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-mono font-semibold border border-emerald-500/20 shadow-sm animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🟢 Live Availability: Peter is On-Call in Nairobi &amp; Countrywide Remote</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-foreground tracking-tight leading-[1.1]">
              Direct Engineering Help: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">No Queues, No Call Center Bots</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Need urgent computer repairs, office Wi-Fi troubleshooting, security camera installation, or a fast business website? Connect directly with senior computer engineer Peter Kivevo John.
            </p>

            {/* 4 Direct Channel Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left pt-2">
              {directChannels.map((ch, idx) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                      ch.isPrimary
                        ? "bg-gradient-to-b from-teal-500/15 to-emerald-500/15 border-teal-500/40 shadow-glow"
                        : "bg-card/80 dark:bg-navy-900/80 backdrop-blur-sm border-border/80 hover:border-teal-500/40 shadow-sm"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${ch.badgeColor}`}>
                          {ch.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                          {ch.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          {ch.subtitle}
                        </p>
                      </div>

                      <p className="text-xs font-mono font-semibold text-foreground pt-0.5">
                        {ch.value}
                      </p>
                    </div>

                    <a
                      href={ch.href}
                      target={ch.href.startsWith("http") ? "_blank" : undefined}
                      rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        ch.isPrimary
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-glow"
                          : "bg-muted/80 hover:bg-teal-500/10 text-foreground hover:text-teal-600 dark:hover:text-teal-400 border border-border"
                      }`}
                    >
                      <span>{ch.ctaText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, reaching out from your website contact page.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Start Direct Chat on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={scrollToContent}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-border bg-card/70 hover:bg-muted text-foreground font-semibold text-sm transition-colors"
              >
                <span>Book On-Site Visit &amp; View Intake Form</span>
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
              <span className="font-mono text-[11px] uppercase tracking-wider">Scroll to book on-site appointment &amp; view intake form</span>
              <div className="w-6 h-9 rounded-full border-2 border-muted-foreground/40 group-hover:border-teal-500 flex items-start justify-center p-1 transition-colors">
                <div className="w-1.5 h-2 bg-teal-500 rounded-full animate-bounce" />
              </div>
            </button>
          </div>
        </section>

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

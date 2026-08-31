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
  ArrowRight
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>🟢 Live Status: Peter is On-Call &amp; Available Now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight">
              Get Direct IT Help From a <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Senior Computer Engineer</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              No ticket queues, no call center staff. Talk directly with Peter Kivevo for urgent computer repairs, office Wi-Fi fixes, security cameras, or high-speed websites across Kenya.
            </p>
          </div>
        </section>

        {/* 4 Direct Channel Cards */}
        <section className="py-12 bg-background dark:bg-navy-950/80 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {directChannels.map((ch, idx) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                      ch.isPrimary
                        ? "bg-gradient-to-b from-teal-500/10 to-emerald-500/10 border-teal-500/40 shadow-glow"
                        : "bg-card dark:bg-navy-900 border-border/80 hover:border-teal-500/40 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ch.badgeColor}`}>
                          {ch.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-base text-foreground">
                          {ch.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ch.subtitle}
                        </p>
                      </div>

                      <p className="text-xs font-mono font-semibold text-foreground pt-1">
                        {ch.value}
                      </p>
                    </div>

                    <a
                      href={ch.href}
                      target={ch.href.startsWith("http") ? "_blank" : undefined}
                      rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        ch.isPrimary
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-glow"
                          : "bg-muted/80 hover:bg-teal-500/10 text-foreground hover:text-teal-600 dark:hover:text-teal-400 border border-border"
                      }`}
                    >
                      <span>{ch.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Interactive Contact & Appointment Form Component */}
        <div id="contact-form">
          <Contact />
        </div>

        {/* What to Expect Timeline */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Transparent SLA
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
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

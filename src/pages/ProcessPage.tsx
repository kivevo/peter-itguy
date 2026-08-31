import React from "react";
import Navigation from "@/components/Navigation";
import Process from "@/components/Process";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getWhatsAppUrl } from "@/config/site";
import { 
  Sparkles, 
  Clock, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle,
  AlertTriangle,
  FileText,
  ChevronDown,
  Activity,
  Check
} from "lucide-react";

export const ProcessPage: React.FC = () => {
  const processPillars = [
    {
      step: "01",
      title: "15-Min Rapid Triage",
      desc: "Emergency remote connection or immediate WhatsApp response to stabilize systems.",
    },
    {
      step: "02",
      title: "Root-Cause Diagnostics",
      desc: "We diagnose the underlying network, cable, or hardware bottleneck, not just symptoms.",
    },
    {
      step: "03",
      title: "Permanent Fix & Hardening",
      desc: "Hardware replacement, VLAN isolation, and 5G failover setup so issues never repeat.",
    },
    {
      step: "04",
      title: "Proactive Monitoring",
      desc: "Continuous health checks and preventative maintenance to prevent future downtime.",
    },
  ];

  const slaTiers = [
    {
      tier: "🚨 Urgent Emergency Fix",
      sla: "Under 15 Minutes",
      coverage: "Remote Connection / Same-Day On-Site (Nairobi)",
      description: "For sudden server crashes, frozen M-Pesa payment tills, malware locks, or dropped Wi-Fi during peak sales hours.",
      cta: "Request Emergency Triage",
      badge: "Highest Priority",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    {
      tier: "⚡ Scheduled Hardware Setup",
      sla: "Same-Day / 24–48 Hours",
      coverage: "On-Site Nairobi (Westlands, CBD, Kilimani, etc.)",
      description: "For new office Wi-Fi antenna installations, structured LAN cabling, printer networking, and CCTV camera mounting.",
      cta: "Book Hardware Survey",
      badge: "Turnkey Setup",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    },
    {
      tier: "🌐 Fast Business Website Build",
      sla: "5 to 10 Working Days",
      coverage: "Countrywide & International",
      description: "Custom mobile-first website designed for Kenyan 5G/4G speeds with direct WhatsApp inquiry flows and Google Local SEO.",
      cta: "Start Web Project",
      badge: "5–10 Days Launch",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  const coverageZones = [
    {
      zone: "Nairobi Central & Westlands",
      subzones: "CBD, Westlands, Parklands, Kilimani, Lavington, Upper Hill",
      turnaround: "Under 45 Minutes On-Site",
      status: "🟢 Immediate Dispatch",
    },
    {
      zone: "Nairobi Industrial & Suburbs",
      subzones: "Industrial Area, Karen, Gigiri, Runda, Mombasa Road, Thika Road",
      turnaround: "Same-Day Physical Visit",
      status: "🟢 Same-Day Available",
    },
    {
      zone: "Countrywide Remote (Kenya)",
      subzones: "Mombasa, Kisumu, Nakuru, Eldoret, Naivasha, Nanyuki & 30+ towns",
      turnaround: "Under 15 Mins Remote Connection",
      status: "🟢 100% Online Coverage",
    },
  ];

  const scrollToContent = () => {
    document.getElementById("process-start")?.scrollIntoView({ behavior: "smooth" });
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
              <Zap className="w-4 h-4 text-teal-500" />
              <span>15-Minute Response SLA • Zero-Guesswork Protocol</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-foreground tracking-tight leading-[1.1]">
              How We Work: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">From Urgent Problem to Permanent Fix</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We eliminate technical frustration with transparent workflows, certified engineering practices, and measurable response SLAs. Learn how we handle emergency tickets, on-site surveys, and proactive maintenance across Kenya.
            </p>

            {/* 4 Process Pillars */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 text-left pt-2">
              {processPillars.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-card/80 dark:bg-navy-900/80 backdrop-blur-sm border border-border/80 hover:border-teal-500/40 shadow-sm space-y-1.5"
                >
                  <span className="text-xl font-black font-heading text-teal-500">
                    {p.step}
                  </span>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I need urgent IT assistance under your 15-minute SLA.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Get 15-Minute Urgent Triage on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={scrollToContent}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-border bg-card/70 hover:bg-muted text-foreground font-semibold text-sm transition-colors"
              >
                <span>View SLA Matrix &amp; Coverage Zones</span>
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
              <span className="font-mono text-[11px] uppercase tracking-wider">Scroll to view 4-step workflow, response SLAs &amp; Kenya coverage</span>
              <div className="w-6 h-9 rounded-full border-2 border-muted-foreground/40 group-hover:border-teal-500 flex items-start justify-center p-1 transition-colors">
                <div className="w-1.5 h-2 bg-teal-500 rounded-full animate-bounce" />
              </div>
            </button>
          </div>
        </section>

        {/* Content Anchor Marker */}
        <div id="process-start" />

        {/* 4-Step Visual Engineering Process Component */}
        <Process />

        {/* Response Time Guarantees & SLA Matrix */}
        <section className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Service Level Agreements
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Guaranteed Response Times
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We respect your business operations. Here is exactly how fast we respond depending on your issue:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {slaTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-foreground">
                      {tier.tier}
                    </h3>

                    <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                        Response Guarantee
                      </span>
                      <p className="font-heading font-extrabold text-base text-teal-700 dark:text-teal-300">
                        {tier.sla}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="pt-2 text-[11px] text-foreground font-mono flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <span>{tier.coverage}</span>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl(`Hi Peter, I need ${tier.tier} support.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kenya Geographic Coverage Breakdown */}
        <section className="py-16 lg:py-20 bg-background dark:bg-navy-950 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Coverage Map
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Nairobi On-Site &amp; Countrywide Remote Coverage
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Whether you have an office in Nairobi CBD, a hotel in Westlands, or retail branches in Mombasa and Kisumu:
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {coverageZones.map((z, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-card dark:bg-navy-900 border border-border/80 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{z.status}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {z.zone}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {z.subzones}
                  </p>
                  <div className="pt-2 border-t border-border/60 text-xs font-mono font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{z.turnaround}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ProcessPage;

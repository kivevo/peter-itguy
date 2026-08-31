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
  FileText
} from "lucide-react";

export const ProcessPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>15-Minute Response SLA • Zero Guesswork Protocol</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight">
              Our Engineering Workflow: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">From Urgent Problem to Permanent Fix</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Discover the transparent 4-step workflow and response guarantees that keep retail chains, hotels, and corporate offices running smoothly across Kenya.
            </p>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I need urgent IT assistance. Please connect.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get 15-Minute Urgent Triage on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

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

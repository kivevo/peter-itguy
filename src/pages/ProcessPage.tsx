import React, { useState } from "react";
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
  Check,
  Search,
  Wrench,
  TrendingUp
} from "lucide-react";

export const ProcessPage: React.FC = () => {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const workflowSteps = [
    {
      step: "01",
      title: "15-Min Rapid Triage",
      sla: "< 15 Mins Response",
      icon: Zap,
      summary: "Immediate remote connection or WhatsApp diagnosis during urgent outages.",
      details: [
        "Instant remote connection via AnyDesk/TeamViewer",
        "Triage payment till timeouts and computer lockups",
        "Stabilize critical sales & reception systems first",
      ],
    },
    {
      step: "02",
      title: "Root-Cause Diagnostics",
      sla: "Zero Guesswork",
      icon: Search,
      summary: "We find the exact faulty cable, ISP bottleneck, or hardware failure.",
      details: [
        "Full Wi-Fi signal heatmap & interference scan",
        "Inspect LAN switches, router logs & DHCP pools",
        "Identify bandwidth hogs crashing payment tills",
      ],
    },
    {
      step: "03",
      title: "Permanent Fix & Hardening",
      sla: "Same-Day / 24–48h",
      icon: Wrench,
      summary: "Hardware replacement, VLAN till isolation & automatic 5G failover line.",
      details: [
        "Isolate POS machines on protected private channel",
        "Install automatic 5G/4G failover backup router",
        "Mount weatherproof outdoor antennas for gardens/patio",
      ],
    },
    {
      step: "04",
      title: "Proactive Monitoring",
      sla: "24/7 Peace of Mind",
      icon: TrendingUp,
      summary: "Daily health checks so your systems stay online and never freeze.",
      details: [
        "Automated daily cloud backups for accounting data",
        "Monthly firmware updates and security hardening",
        "Direct engineer hotline for staff emergency help",
      ],
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

  const currentStep = workflowSteps[activeStepIdx];
  const CurrentStepIcon = currentStep.icon;

  const scrollToContent = () => {
    document.getElementById("process-start")?.scrollIntoView({ behavior: "smooth" });
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
              {/* Left Column: SLA Value Proposition */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-teal-500" />
                  <span>15-Minute SLA Guarantee • Nairobi &amp; Kenya</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.15]">
                  Our Engineering Workflow: <br className="hidden md:inline" />
                  <span className="text-gradient-teal">From Urgent Problem to Permanent Fix</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-none sm:line-clamp-none">
                  No guessing and no endless waiting. We follow a strict 4-step engineering protocol with guaranteed response SLAs to resolve critical outages, harden networks, and keep your staff productive.
                </p>

                {/* 3 Process SLA Badges */}
                <div className="grid grid-cols-3 gap-2 text-left pt-0">
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">⚡ &lt; 15 Mins</span>
                    <span className="text-[11px] text-muted-foreground">Emergency Triage</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🚗 &lt; 45 Mins</span>
                    <span className="text-[11px] text-muted-foreground">Nairobi On-Site</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🛡️ Root-Cause</span>
                    <span className="text-[11px] text-muted-foreground">Permanent Solution</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href={getWhatsAppUrl("Hi Peter, I need emergency IT help under your 15-minute SLA.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Get 15-Min Triage on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={scrollToContent}
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <span>View SLA Matrix &amp; Zones</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive 4-Step Protocol Navigator */}
              <div className="hidden lg:block lg:col-span-5">
                <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-5 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-foreground">Interactive Engineering Protocol</span>
                    </div>
                    <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">{currentStep.sla}</span>
                  </div>

                  {/* 4 Step Selector Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {workflowSteps.map((ws, idx) => {
                      const Icon = ws.icon;
                      const isActive = activeStepIdx === idx;
                      return (
                        <button
                          key={ws.step}
                          onClick={() => setActiveStepIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            isActive
                              ? "bg-teal-500/15 border-teal-500 text-foreground font-bold shadow-sm"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          <span className="font-mono text-xs font-bold text-teal-500">{ws.step}</span>
                          <span className="text-xs truncate">{ws.title.split(" ")[0]} {ws.title.split(" ")[1]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Step Showcase Card */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-navy-950/70 border border-border/80 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <CurrentStepIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold">STEP {currentStep.step}</span>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                            {currentStep.title}
                          </h4>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {currentStep.sla}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentStep.summary}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider block">Key Deliverables:</span>
                      {currentStep.details.map((det, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                          <span>{det}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={getWhatsAppUrl(`Hi Peter, I need urgent IT assistance. Step: ${currentStep.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all hover:shadow-glow mt-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Request Urgent Connection on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
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

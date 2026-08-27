import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { 
  Calculator, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Wifi, 
  Globe2, 
  Server, 
  Video, 
  Clock,
  Layers
} from "lucide-react";

export const QuickQuoteEstimator: React.FC = () => {
  const [serviceType, setServiceType] = useState<string>("network");
  const [scale, setScale] = useState<string>("small");
  const [urgency, setUrgency] = useState<string>("standard");

  const services = [
    {
      id: "network",
      name: "Network & Wi-Fi Setup",
      icon: Wifi,
      desc: "UniFi/MikroTik routing, VLAN isolation, guest portals",
    },
    {
      id: "web",
      name: "Fast Business Website",
      icon: Globe2,
      desc: "Sub-2s mobile-first React/Next.js website with SEO",
    },
    {
      id: "support",
      name: "Monthly IT Support Retainer",
      icon: Server,
      desc: "24/7 remote triage, PC maintenance & branch support",
    },
    {
      id: "cctv",
      name: "IP CCTV & Access Control",
      icon: Video,
      desc: "HD surveillance with encrypted remote phone viewing",
    },
  ];

  const scales = [
    { id: "small", label: "Small Office (1-5 Users)", sub: "Single router / basic till" },
    { id: "medium", label: "Medium Business (6-25 Users)", sub: "Multiple APs / POS network" },
    { id: "multi", label: "Multi-Branch / Hotel (25+ Users)", sub: "VLANs / multi-site support" },
  ];

  const urgencies = [
    { id: "emergency", label: "🚨 Emergency Same-Day", badge: "Immediate Dispatch" },
    { id: "standard", label: "⚡ Within 2-4 Days", badge: "Scheduled Setup" },
    { id: "planning", label: "📅 Flexible / Next Month", badge: "Strategic Project" },
  ];

  // Dynamic recommendations calculation
  const getRecommendation = () => {
    let title = "";
    let specs: string[] = [];
    let turnaround = "";

    if (serviceType === "network") {
      if (scale === "small") {
        title = "Compact Business Network Setup";
        specs = ["Dual-band Wi-Fi AP configuration", "Guest network isolation", "Safaricom router optimization"];
        turnaround = urgency === "emergency" ? "Same-day 3-4 hours" : "1 business day";
      } else if (scale === "medium") {
        title = "Enterprise VLAN & Multi-AP Deployment";
        specs = ["UniFi/MikroTik managed switch & router", "Strict POS payment VLAN separation", "Bandwidth QoS & failover 4G setup"];
        turnaround = urgency === "emergency" ? "Same-day on-site" : "2-3 business days";
      } else {
        title = "Multi-Branch / High-Density Infrastructure";
        specs = ["Centralized controller management", "Multi-VLAN (Staff, POS, Guests, CCTV)", "Dedicated VPN site-to-site tunnels"];
        turnaround = "Phased deployment (3-7 days)";
      }
    } else if (serviceType === "web") {
      if (scale === "small") {
        title = "High-Speed Commercial Landing Site";
        specs = ["Ultra-fast sub-2s load speed", "Direct WhatsApp click-to-chat integration", "Mobile-first responsive UX & Google SEO"];
        turnaround = "3-5 business days";
      } else if (scale === "medium") {
        title = "Multi-Page Corporate & Catalog Site";
        specs = ["Custom portfolio & services showcases", "Fast CDN edge deployment (Vercel)", "Lead generation forms & analytics"];
        turnaround = "7-10 business days";
      } else {
        title = "Custom Booking Portal / Enterprise Web",
        specs = ["Direct booking / customer portals", "M-Pesa payment integration ready", "High-concurrency cloud architecture"];
        turnaround = "2-3 weeks";
      }
    } else if (serviceType === "support") {
      title = "Proactive IT Support & Maintenance SLA";
      specs = [
        "15-minute remote AnyDesk/TeamViewer triage",
        "Scheduled preventive hardware servicing",
        "Direct engineer access (no automated queues)",
      ];
      turnaround = "Instant SLA onboarding";
    } else {
      title = "IP CCTV & Remote Surveillance Deployment";
      specs = [
        "1080p/4K night-vision security cameras",
        "Encrypted live remote viewing on iPhone & Android",
        "Dedicated UPS power backup & NVR storage",
      ];
      turnaround = urgency === "emergency" ? "24 hours" : "2-4 business days";
    }

    return { title, specs, turnaround };
  };

  const recommendation = getRecommendation();

  // Generate customized WhatsApp pre-filled text
  const selectedServiceObj = services.find((s) => s.id === serviceType);
  const selectedScaleObj = scales.find((s) => s.id === scale);
  const selectedUrgencyObj = urgencies.find((u) => u.id === urgency);

  const customWhatsAppText = `Hi Peter, I used the Scope Estimator on your website:
• Project: ${selectedServiceObj?.name}
• Scale: ${selectedScaleObj?.label}
• Urgency: ${selectedUrgencyObj?.label}
• Target Scope: ${recommendation.title}

Could you provide a detailed quote and availability?`;

  return (
    <section className="py-20 lg:py-28 bg-muted/30 dark:bg-navy-950/80 relative border-t border-border/80 overflow-hidden">
      {/* Soft Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Project Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Estimate Your Project Scope &amp; <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Get an Instant WhatsApp Quote</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Select your requirements below to calculate recommended technical architecture and dispatch a pre-filled WhatsApp brief to Peter in 1 click.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          {/* Step Controls (Left) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Service Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs">1</span>
                Select Service Practice:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {services.map((s) => {
                  const Icon = s.icon;
                  const isSelected = serviceType === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServiceType(s.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 ${
                        isSelected
                          ? "bg-teal-500/15 border-teal-500 text-foreground shadow-sm ring-1 ring-teal-500/50"
                          : "bg-card dark:bg-navy-900 border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <div className={`p-2 rounded-xl flex-shrink-0 ${isSelected ? "bg-teal-500 text-white" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-foreground">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{s.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Scale Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs">2</span>
                Scale / Organization Size:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {scales.map((sc) => {
                  const isSelected = scale === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setScale(sc.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 space-y-1 ${
                        isSelected
                          ? "bg-teal-500/15 border-teal-500 text-foreground shadow-sm ring-1 ring-teal-500/50"
                          : "bg-card dark:bg-navy-900 border-border/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <p className="text-xs font-bold text-foreground">{sc.label}</p>
                      <p className="text-[10px] text-muted-foreground">{sc.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Urgency Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs">3</span>
                Timeline / Urgency:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {urgencies.map((u) => {
                  const isSelected = urgency === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setUrgency(u.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all duration-200 ${
                        isSelected
                          ? "bg-teal-500/15 border-teal-500 text-foreground shadow-sm ring-1 ring-teal-500/50"
                          : "bg-card dark:bg-navy-900 border-border/80 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{u.label}</p>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">{u.badge}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-time Scope Summary Card (Right) */}
          <div className="lg:col-span-5 rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-6 sm:p-7 space-y-6">
            <div className="space-y-2 pb-4 border-b border-border/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  Recommended Architecture
                </span>
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-500" />
                  {recommendation.turnaround}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-foreground">
                {recommendation.title}
              </h3>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Included Deliverables:
              </h4>
              <div className="space-y-2">
                {recommendation.specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/50 dark:bg-navy-950/60 border border-border/70 space-y-1">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                Direct Engineer Guarantee:
              </span>
              <p className="text-xs text-muted-foreground">
                No middleman markup or junior subcontractors. You work directly with Peter from assessment to final deployment.
              </p>
            </div>

            {/* Launch Pre-filled WhatsApp */}
            <a
              href={getWhatsAppUrl(customWhatsAppText)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Brief to WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickQuoteEstimator;

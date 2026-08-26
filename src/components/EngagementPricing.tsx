import React from "react";
import { getWhatsAppUrl } from "@/config/site";
import { Check, MessageCircle, Zap, ShieldCheck, Layers, ArrowRight } from "lucide-react";

export const EngagementPricing: React.FC = () => {
  const models = [
    {
      name: "On-Demand Incident Triage",
      badge: "Pay-As-You-Go",
      desc: "Ideal for one-off computer breakdowns, emergency malware cleanup, router reboots, or printer setup.",
      features: [
        "15-min remote encrypted diagnostic",
        "Hardware & OS troubleshooting",
        "Same-day on-site Nairobi dispatch when needed",
        "Clear incident summary & prevention tips",
        "Zero long-term commitment",
      ],
      ctaText: "Request Emergency Fix",
      popular: false,
    },
    {
      name: "Proactive Monthly SLA",
      badge: "Most Popular for Businesses",
      desc: "Full-scale outsourced IT management for corporate offices, retail branches, and hospitality venues.",
      features: [
        "Guaranteed 15-min priority response SLA",
        "30+ branch remote helpdesk stack",
        "VLAN isolation & POS stability monitoring",
        "Automated encrypted cloud backups",
        "Scheduled monthly on-site health visits",
        "Vendor & ISP accountability management",
      ],
      ctaText: "Discuss SLA Retainer",
      popular: true,
    },
    {
      name: "Turnkey Project Deployment",
      badge: "Fixed-Scope Delivery",
      desc: "Structured LAN cabling, high-density Wi-Fi engineering, IP CCTV rollouts, or custom business websites.",
      features: [
        "Complete site survey & bill of quantities",
        "Sub-2s mobile commercial web engineering",
        "Ubiquiti / MikroTik hardware procurement",
        "16-channel HD CCTV camera installation",
        "Full documentation & handover training",
      ],
      ctaText: "Get Project Scope & Quote",
      popular: false,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30 dark:bg-navy-950 border-t border-border/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparent Engagement Models</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Flexible Support Plans <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Designed for Business Growth</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Whether you need a one-time emergency network fix or an on-call IT department for all your regional branches.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {models.map((model, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                model.popular
                  ? "bg-card dark:bg-navy-900 border-2 border-teal-500 shadow-glow md:-translate-y-2"
                  : "bg-card/70 dark:bg-navy-900/60 border border-border/90 shadow-sm hover:border-teal-500/40"
              }`}
            >
              {model.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-teal-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                  Recommended for SMEs &amp; Retail
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {model.badge}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-foreground">
                  {model.name}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {model.desc}
                </p>

                <div className="pt-4 border-t border-border/70 space-y-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground block">
                    What's Covered:
                  </span>
                  {model.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                      <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/70">
                <a
                  href={getWhatsAppUrl(`Hi Peter, I am interested in discussing your ${model.name} engagement.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all ${
                    model.popular
                      ? "bg-teal-600 hover:bg-teal-500 text-white shadow-glow"
                      : "bg-muted hover:bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-border"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{model.ctaText}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default EngagementPricing;

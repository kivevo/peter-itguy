import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { Check, MessageCircle, ShieldCheck, DollarSign, Coins } from "lucide-react";

export const EngagementPricing: React.FC = () => {
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");

  const models = [
    {
      name: "One-Time Emergency Fix",
      badge: "Pay As You Need",
      priceKES: "From KES 2,500",
      priceUSD: "From $20 USD",
      priceSubtitle: "Per incident / resolution",
      desc: "Great for quick computer breakdowns, virus removal, printer jams, or Wi-Fi troubleshooting.",
      features: [
        "15-minute quick remote help",
        "Computer, Mac & printer repair",
        "Same-day on-site visit in Nairobi when needed",
        "Clear explanation of what caused the issue",
        "Zero monthly contract or commitment",
      ],
      ctaText: "Get Emergency Help",
      popular: false,
    },
    {
      name: "Monthly Office IT Retainer",
      badge: "Most Popular for Businesses",
      priceKES: "From KES 15,000 / mo",
      priceUSD: "From $120 USD / mo",
      priceSubtitle: "Tailored to your team size",
      desc: "Full IT department for your office, retail shops, or restaurant without hiring full-time staff.",
      features: [
        "Guaranteed 15-minute fast response on WhatsApp",
        "Unlimited remote help for all staff computers",
        "Wi-Fi & payment till protection (zero freezes)",
        "Daily automatic cloud backups of company files",
        "Scheduled monthly on-site maintenance visits",
        "We handle internet providers when lines are slow",
      ],
      ctaText: "Discuss Monthly Support",
      popular: true,
    },
    {
      name: "Complete Project Setup",
      badge: "Fixed-Price Delivery",
      priceKES: "Itemized Project Quote",
      priceUSD: "Itemized Project Quote",
      priceSubtitle: "Free written site survey",
      desc: "Moving to a new office, wiring network cables, setting up Wi-Fi & CCTV, or building a new website.",
      features: [
        "Free initial site survey & written quote",
        "Super-fast website built to get WhatsApp leads",
        "Neat office cabling & long-range Wi-Fi APs",
        "HD security cameras with live phone viewing",
        "Hands-on staff training & official receipt/invoice",
      ],
      ctaText: "Get Project Quote",
      popular: false,
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30 dark:bg-navy-950 border-t border-border/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clear &amp; Transparent Plans</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Flexible Support Plans <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Tailored to Your Budget</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground">
            Whether you need a quick 30-minute fix today or a dedicated IT partner to keep your company running smoothly every month.
          </p>

          {/* Currency Switcher Pill */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center p-1 rounded-2xl bg-card dark:bg-navy-900 border border-border shadow-sm">
              <button
                type="button"
                onClick={() => setCurrency("KES")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  currency === "KES"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇰🇪 KES (Kenyan Shillings)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  currency === "USD"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                💵 USD ($)
              </button>
            </div>
          </div>
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
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-teal-500 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                  Recommended for Businesses
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {model.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-foreground">
                    {model.name}
                  </h3>
                  <div className="mt-2">
                    <div className="font-heading font-extrabold text-2xl text-teal-600 dark:text-teal-400">
                      {currency === "KES" ? model.priceKES : model.priceUSD}
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {model.priceSubtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {model.desc}
                </p>

                <div className="pt-4 border-t border-border/70 space-y-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground block">
                    What's Covered:
                  </span>
                  {model.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={getWhatsAppUrl(`Hi Peter, I would like to discuss your ${model.name} plan (${currency === "KES" ? model.priceKES : model.priceUSD}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm ${
                    model.popular
                      ? "bg-teal-500 hover:bg-teal-400 text-navy-950 shadow-teal-500/20 hover:scale-105"
                      : "border border-border hover:bg-muted text-foreground hover:border-teal-500/50"
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

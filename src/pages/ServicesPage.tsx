import React from "react";
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
  Calculator
} from "lucide-react";

export const ServicesPage: React.FC = () => {
  const quickJumps = [
    { label: "Core 4 Services", href: "#core-services" },
    { label: "Interactive IT Tools", href: "#interactive-tools" },
    { label: "Scope & Deliverables", href: "#scope-breakdown" },
    { label: "Project Scope Builder", href: "#quote-builder" },
    { label: "Pricing & Retainers", href: "#pricing-plans" },
    { label: "50+ IT Directory", href: "#it-directory" },
    { label: "Technical FAQ", href: "#technical-faq" },
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
              <Layers className="w-3.5 h-3.5" />
              <span>Full Service Catalog • Transparent Pricing • Nairobi &amp; Kenya</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight">
              Engineering Solutions: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Fast IT Support, Strong Wi-Fi &amp; Web</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore our core business services, interactive hardware planners, itemized scopes, and searchable 50+ IT directory built for Kenyan enterprises, hotels, retail shops, and offices.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl("Hi Peter, I would like to book a service consultation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Service Consultation on WhatsApp</span>
              </a>
            </div>

            {/* Quick Navigation Anchor Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
              {quickJumps.map((jump, idx) => (
                <a
                  key={idx}
                  href={jump.href}
                  className="px-3 py-1.5 rounded-xl bg-muted/80 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 text-muted-foreground text-xs font-medium border border-border transition-colors"
                >
                  {jump.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Client Partners Bar */}
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

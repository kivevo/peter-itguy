import React from "react";
import Navigation from "@/components/Navigation";
import Services from "@/components/Services";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import DowntimeCalculator from "@/components/DowntimeCalculator";
import QuickQuoteEstimator from "@/components/QuickQuoteEstimator";
import NetworkSpeedTester from "@/components/NetworkSpeedTester";
import InstantIssueWizard from "@/components/InstantIssueWizard";
import WebsiteSpeedChecker from "@/components/WebsiteSpeedChecker";
import OfficeNetworkVisualizer from "@/components/OfficeNetworkVisualizer";
import EngagementPricing from "@/components/EngagementPricing";
import TechnicalFAQ from "@/components/TechnicalFAQ";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { SERVICES, getWhatsAppUrl } from "@/config/site";
import { Layers, Check, MessageCircle } from "lucide-react";

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />
      
      <main className="flex-1 pt-24 lg:pt-32">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Service Catalog &amp; Support Options</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-foreground tracking-tight">
              Fast IT Support, Strong Wi-Fi &amp; <br className="hidden sm:inline" />
              <span className="text-gradient-teal">High-Converting Business Websites</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore our four core services designed for Kenyan businesses, hotels, retail shops, and offices that need reliable systems and fast response.
            </p>
          </div>
        </section>

        {/* Client Partners Bar */}
        <ClientLogoStrip />

        {/* Instant Troubleshooter Wizard */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <InstantIssueWizard />
          </div>
        </section>

        {/* Interactive Services Deep Dive */}
        <Services />

        {/* Website Speed & Lead Audit Checker */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-y border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <WebsiteSpeedChecker />
          </div>
        </section>

        {/* Live Internet Health Test */}
        <section className="py-12 lg:py-16 bg-background dark:bg-navy-950 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <NetworkSpeedTester />
          </div>
        </section>

        {/* Office Network Visualizer */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <OfficeNetworkVisualizer />
          </div>
        </section>

        {/* Downtime Cost Estimator */}
        <DowntimeCalculator />

        {/* All Services Breakdown Details */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-900/40 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Complete Service Breakdown
              </h2>
              <p className="text-sm text-muted-foreground">
                Detailed scope, deliverables, and fast WhatsApp booking for each service.
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

        {/* Interactive Scope Estimator */}
        <QuickQuoteEstimator />

        {/* Engagement Models */}
        <EngagementPricing />

        {/* FAQ */}
        <TechnicalFAQ />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ServicesPage;

import React from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import TechMarquee from "@/components/TechMarquee";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import Services from "@/components/Services";
import DowntimeCalculator from "@/components/DowntimeCalculator";
import Portfolio from "@/components/Portfolio";
import ArchitectureViewer from "@/components/ArchitectureViewer";
import Process from "@/components/Process";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import EngagementPricing from "@/components/EngagementPricing";
import TechnicalFAQ from "@/components/TechnicalFAQ";
import BlogResources from "@/components/BlogResources";
import Contact from "@/components/Contact";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <TechMarquee />

        {/* Live Diagnostics Terminal Section */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Live Edge Triage Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Test Network Latency &amp; Run Live Diagnostics
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Run interactive commands on our simulated edge gateway or test pings to client infrastructure.
              </p>
            </div>
            <InteractiveTerminal />
          </div>
        </section>

        {/* Core Services Section */}
        <Services />

        {/* Business Downtime Cost Calculator */}
        <DowntimeCalculator />

        {/* Case Studies & Web Showcase */}
        <Portfolio />

        {/* Architecture Transformation Lab */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <ArchitectureViewer />
          </div>
        </section>

        {/* How I Work Process */}
        <Process />

        {/* About Section */}
        <About />

        {/* Client Endorsements Carousel */}
        <Testimonials />

        {/* Engagement Models & Retainers */}
        <EngagementPricing />

        {/* Frequently Asked Technical Questions */}
        <TechnicalFAQ />

        {/* Blog & Technical Advisories */}
        <BlogResources />

        {/* Direct Contact & Lead Intake */}
        <Contact />

        {/* Pre-Footer Action Banner */}
        <CallToActionBand />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;

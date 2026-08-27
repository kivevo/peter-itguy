import React, { Suspense, lazy, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import TechMarquee from "@/components/TechMarquee";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import About from "@/components/About";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";
import EngagementPricing from "@/components/EngagementPricing";
import TechnicalFAQ from "@/components/TechnicalFAQ";
import BlogResources from "@/components/BlogResources";
import Contact from "@/components/Contact";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import LeadMagnetModal from "@/components/LeadMagnetModal";
import { Download, FileText, Sparkles } from "lucide-react";

// Performance code-splitting for heavy interactive components
const InteractiveTerminal = lazy(() => import("@/components/InteractiveTerminal"));
const DowntimeCalculator = lazy(() => import("@/components/DowntimeCalculator"));
const ArchitectureViewer = lazy(() => import("@/components/ArchitectureViewer"));

const LoadingCard = () => (
  <div className="h-64 rounded-3xl bg-muted/40 animate-pulse flex items-center justify-center text-xs font-mono text-muted-foreground">
    Loading Interactive Tool...
  </div>
);

const Index: React.FC = () => {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />
      
      <main className="flex-1">
        {/* 1. Clear, laser-focused hero */}
        <Hero />

        {/* 2. Verifiable Proof Bar with Methodology Footnotes */}
        <TrustBar />

        {/* 3. Real Work Delivered For & Trusted By Logo Strip */}
        <ClientLogoStrip />

        {/* 4. Certified Technology Ecosystem */}
        <TechMarquee />

        {/* 5. Free Checklist Lead Magnet Callout Banner */}
        <section className="py-6 bg-teal-600/10 dark:bg-teal-500/10 border-y border-teal-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Free Technical Resource
              </span>
              <p className="text-sm font-semibold text-foreground">
                Download: "5 Signs Your Nairobi Office Network Needs an Upgrade" (PDF Checklist)
              </p>
            </div>
            <button
              onClick={() => setIsChecklistOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm flex-shrink-0 transition-transform hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Free PDF Checklist</span>
            </button>
          </div>
        </section>

        {/* 6. Core Services Section */}
        <Services />

        {/* 7. Business Downtime Cost Calculator (Lazy Loaded) */}
        <Suspense fallback={<LoadingCard />}>
          <DowntimeCalculator />
        </Suspense>

        {/* 8. Live Diagnostics Terminal Section (Lazy Loaded) */}
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
            <Suspense fallback={<LoadingCard />}>
              <InteractiveTerminal />
            </Suspense>
          </div>
        </section>

        {/* 9. Case Studies & Web Showcase */}
        <Portfolio />

        {/* 10. Architecture Transformation Lab (Lazy Loaded) */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <Suspense fallback={<LoadingCard />}>
              <ArchitectureViewer />
            </Suspense>
          </div>
        </section>

        {/* 11. How I Work Process */}
        <Process />

        {/* 12. About Section & Solo Operator Advantage */}
        <About />

        {/* 13. Verifiable Credentials & Certifications Badges */}
        <TrustBadges />

        {/* 14. Client Endorsements Carousel */}
        <Testimonials />

        {/* 15. Engagement Models & Retainers */}
        <EngagementPricing />

        {/* 16. Frequently Asked Technical Questions */}
        <TechnicalFAQ />

        {/* 17. Blog & Technical Advisories */}
        <BlogResources />

        {/* 18. Direct Contact & Lead Intake */}
        <Contact />

        {/* 19. Pre-Footer Action Banner */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />

      {/* Free Checklist Lead Magnet Modal */}
      <LeadMagnetModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />
    </div>
  );
};

export default Index;

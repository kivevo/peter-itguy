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
import QuickQuoteEstimator from "@/components/QuickQuoteEstimator";
import InstantIssueWizard from "@/components/InstantIssueWizard";
import WebsiteSpeedChecker from "@/components/WebsiteSpeedChecker";
import OfficeNetworkVisualizer from "@/components/OfficeNetworkVisualizer";
import { Download, Sparkles } from "lucide-react";

// Lazy-loaded interactive components
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
        {/* 1. Hero */}
        <Hero />

        {/* 2. Proof & Operational Stats Bar */}
        <TrustBar />

        {/* 3. Client Logo Strip */}
        <ClientLogoStrip />

        {/* 4. Instant Problem Diagnostic Wizard (New Modern Feature) */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-y border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <InstantIssueWizard />
          </div>
        </section>

        {/* 5. Free Checklist Callout Banner */}
        <section className="py-6 bg-teal-600/10 dark:bg-teal-500/10 border-b border-teal-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Free Business Guide
              </span>
              <p className="text-sm font-semibold text-foreground">
                Download: "5 Signs Your Office Wi-Fi Needs an Upgrade" (Free PDF Checklist)
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

        {/* 6. Certified Hardware & Systems Tech Marquee */}
        <TechMarquee />

        {/* 7. Core Services Section */}
        <Services />

        {/* 8. Interactive Website Speed & Health Checker (New Modern Feature) */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-y border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <WebsiteSpeedChecker />
          </div>
        </section>

        {/* 9. Business Downtime & Money Loss Calculator */}
        <Suspense fallback={<LoadingCard />}>
          <DowntimeCalculator />
        </Suspense>

        {/* 10. Interactive Office Wi-Fi & POS Visualizer (New Modern Feature) */}
        <section className="py-12 lg:py-16 bg-background dark:bg-navy-950 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <OfficeNetworkVisualizer />
          </div>
        </section>

        {/* 11. Live Internet Speed & Health Test Console */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Live Test Console
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Test Network Speed &amp; System Health
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Run interactive checks to see live server speeds and diagnostic tools.
              </p>
            </div>
            <Suspense fallback={<LoadingCard />}>
              <InteractiveTerminal />
            </Suspense>
          </div>
        </section>

        {/* 12. Case Studies & Web Showcase */}
        <Portfolio />

        {/* 13. Before & After Turnarounds */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <Suspense fallback={<LoadingCard />}>
              <ArchitectureViewer />
            </Suspense>
          </div>
        </section>

        {/* 14. How I Work Process */}
        <Process />

        {/* 15. About Section */}
        <About />

        {/* 16. Credentials & Degree Badges */}
        <TrustBadges />

        {/* 17. Client Testimonials */}
        <Testimonials />

        {/* 18. Support Plans & Transparent Pricing */}
        <EngagementPricing />

        {/* 19. Instant WhatsApp Project Scope Estimator */}
        <QuickQuoteEstimator />

        {/* 20. Frequently Asked Questions */}
        <TechnicalFAQ />

        {/* 21. Blog & Practical Guides */}
        <BlogResources />

        {/* 22. Direct Contact & Lead Intake */}
        <Contact />

        {/* 23. Pre-Footer Call to Action Banner */}
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

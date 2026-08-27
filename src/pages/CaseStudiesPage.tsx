import React from "react";
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import ArchitectureViewer from "@/components/ArchitectureViewer";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { FolderGit2 } from "lucide-react";

const CaseStudiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />

      <main className="flex-1 pt-24 lg:pt-32">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Case Studies &amp; Track Record</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-foreground tracking-tight">
              Real Turnarounds for <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Hotels, Branches &amp; Commercial Web Clients</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Explore in-depth technical case studies documenting how I diagnose severe downtime, isolate network vulnerabilities, and engineer websites that load in under 2 seconds.
            </p>
          </div>
        </section>

        {/* Client Partners Bar */}
        <ClientLogoStrip />

        {/* Interactive Architecture Transformation Lab */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <ArchitectureViewer />
          </div>
        </section>

        {/* Full Case Studies & Web Showcase */}
        <Portfolio />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CaseStudiesPage;

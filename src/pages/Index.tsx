import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import TechMarquee from "@/components/TechMarquee";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import WebsiteSpeedChecker from "@/components/WebsiteSpeedChecker";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import LeadMagnetModal from "@/components/LeadMagnetModal";
import { Link } from "react-router-dom";
import { Download, Sparkles, ArrowRight, Layers, FolderGit2, ShieldCheck } from "lucide-react";

const Index: React.FC = () => {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />

      <main className="flex-1">
        {/* 1. Hero with Live Interactive Console */}
        <Hero />

        {/* 2. Key Operational Proof Bar */}
        <TrustBar />

        {/* 3. Verified Client Partner Logos */}
        <ClientLogoStrip />

        {/* 4. Core Services Overview (with link to /services) */}
        <Services />

        {/* 5. Live Website Speed & Kenyan 5G/4G Inspection Tool */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-950/60 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                ⚡ Instant Live Tool
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Test Your Website Speed in Kenya
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                See how fast your website loads for Safaricom &amp; Airtel users, check server latency, and get optimization advice.
              </p>
            </div>
            <WebsiteSpeedChecker />
            
            <div className="text-center pt-2">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 hover:underline"
              >
                <span>Need office Wi-Fi planning or hardware sizing? View All Interactive IT Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Featured Case Studies & Turnarounds */}
        <Portfolio />

        {/* 7. Client Reviews & Social Proof */}
        <Testimonials />

        {/* 8. Direct WhatsApp Booking & Inquiry */}
        <Contact />

        {/* 9. Pre-Footer Call to Action Banner */}
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

import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import BlogResources from "@/components/BlogResources";
import TechnicalFAQ from "@/components/TechnicalFAQ";
import WebsiteSpeedChecker from "@/components/WebsiteSpeedChecker";
import LeadMagnetModal from "@/components/LeadMagnetModal";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Search, 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Server,
  ArrowRight
} from "lucide-react";

export const BlogPage: React.FC = () => {
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const categories = [
    { title: "Office Wi-Fi & Networks", count: "8 Guides", icon: Wifi },
    { title: "Payment Tills & M-Pesa", count: "4 Guides", icon: Server },
    { title: "Fast Websites & 5G SEO", count: "6 Guides", icon: Smartphone },
    { title: "CCTV & Office Cyber Safety", count: "5 Guides", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practical Advice • Free IT Knowledge Base</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight">
              Practical IT Guides &amp; <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Free Tools for Kenyan Businesses</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Clear, non-technical advice on fixing slow office internet, preventing payment till freezes, protecting CCTV security feeds, and boosting website speeds across Kenya.
            </p>
          </div>
        </section>

        {/* Free Downloadable Checklist Callout Banner */}
        <section className="py-8 bg-teal-600/10 dark:bg-teal-500/10 border-b border-teal-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Free PDF Checklist Download
              </span>
              <p className="text-base font-heading font-bold text-foreground">
                "5 Signs Your Office Wi-Fi Needs an Upgrade" (Free 2-Page Audit Checklist)
              </p>
              <p className="text-xs text-muted-foreground">
                Download our free checklist to spot signal bottlenecks, unauthorized devices, and payment machine risks.
              </p>
            </div>
            <button
              onClick={() => setIsChecklistOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md flex-shrink-0 transition-transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Free PDF</span>
            </button>
          </div>
        </section>

        {/* 4 Topic Category Pills */}
        <section className="py-10 bg-background dark:bg-navy-950/80 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card dark:bg-navy-900 border border-border/80 hover:border-teal-500/40 transition-colors space-y-2 text-center sm:text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto sm:mx-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-heading font-bold text-xs sm:text-sm text-foreground">
                      {cat.title}
                    </p>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {cat.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Website Speed & Latency Tool Simulator */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Live Interactive Diagnostic
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Test Your Website Speed in Kenya
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter any domain to simulate 5G/4G load times on Safaricom and Airtel networks:
              </p>
            </div>

            <WebsiteSpeedChecker />
          </div>
        </section>

        {/* Full Blog & Practical Resources Grid */}
        <BlogResources />

        {/* Frequently Asked Questions */}
        <TechnicalFAQ />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />

      {/* Free Checklist Modal */}
      <LeadMagnetModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />
    </div>
  );
};

export default BlogPage;

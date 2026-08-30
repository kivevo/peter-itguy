import React from "react";
import Navigation from "@/components/Navigation";
import BlogResources from "@/components/BlogResources";
import NetworkSpeedTester from "@/components/NetworkSpeedTester";
import WebsiteSpeedChecker from "@/components/WebsiteSpeedChecker";
import QuickQuoteEstimator from "@/components/QuickQuoteEstimator";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { BookOpen } from "lucide-react";

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practical Advice &amp; Free Tools</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-foreground tracking-tight">
              Practical IT Guides &amp; <br className="hidden sm:inline" />
              <span className="text-gradient-teal">Free Online Tools for Kenya</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Clear advice on fixing slow office internet, preventing payment till freezes, and boosting your website speed across Kenya.
            </p>
          </div>
        </section>

        {/* Live Internet Health Test */}
        <section className="py-12 lg:py-16 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <NetworkSpeedTester />
          </div>
        </section>

        {/* Website Speed Checker */}
        <section className="py-12 lg:py-16 bg-background dark:bg-navy-950 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <WebsiteSpeedChecker />
          </div>
        </section>

        {/* Blog Resources Grid */}
        <BlogResources />

        {/* Quick Project Estimator */}
        <QuickQuoteEstimator />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default BlogPage;

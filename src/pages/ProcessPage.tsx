import React from "react";
import Navigation from "@/components/Navigation";
import Process from "@/components/Process";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Sparkles } from "lucide-react";

const ProcessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1 pt-32 sm:pt-36 lg:pt-40">
        {/* Page Hero Banner */}
        <section className="py-12 lg:py-16 bg-muted/30 dark:bg-navy-950 border-b border-border/80 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How We Work</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-foreground tracking-tight">
              Fast IT Help: <br className="hidden sm:inline" />
              <span className="text-gradient-teal">From Urgent Problem to Long-Term Peace of Mind</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Discover the straightforward 4-step workflow that keeps hotels, retail shop branches, and corporate offices running smoothly across Kenya.
            </p>
          </div>
        </section>

        {/* Core Process Steps */}
        <Process />

        {/* Response Time Guarantees */}
        <section className="py-16 lg:py-20 bg-muted/20 dark:bg-navy-900/40 border-t border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Clear Response Time Guarantees
              </h2>
              <p className="text-sm text-muted-foreground">
                How fast we help you depending on the situation:
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Urgent Emergencies
                </span>
                <h3 className="font-heading font-bold text-lg text-foreground">
                  15-Min Fast Remote Help
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For sudden computer freezes, internet drops, or payment machine timeouts during busy hours.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                  On-Site Visits
                </span>
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Same-Day Nairobi Dispatch
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For broken cables, router replacements, printer repairs, and physical hardware issues.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                  Projects &amp; Websites
                </span>
                <h3 className="font-heading font-bold text-lg text-foreground">
                  5–10 Day Turnaround
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For custom business websites, office network wiring, and security camera installations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ProcessPage;

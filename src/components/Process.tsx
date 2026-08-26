import React from "react";
import { PROCESS_STEPS, getWhatsAppUrl } from "@/config/site";
import { 
  Sparkles, 
  Scan, 
  Wrench, 
  FileCheck2, 
  Activity, 
  MessageCircle, 
  ArrowRight 
} from "lucide-react";

export const Process: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Scan,
    Wrench,
    FileCheck2,
    Activity,
  };

  return (
    <section id="process" className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Service Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            How I Work: <br className="hidden sm:inline" />
            <span className="text-gradient-teal">From Urgent Distress to Stable Uptime</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            A battle-tested 4-step workflow developed across 30+ regional branches and demanding hospitality venues.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon] || Scan;
            return (
              <div
                key={step.step}
                className="relative rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 flex flex-col justify-between hover:border-teal-500/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold font-mono text-teal-500/40">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/60 text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                  <span>Step {step.step} Outcome Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Callout Band */}
        <div className="mt-12 p-6 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading font-bold text-base text-foreground">
              Facing an active server freeze or POS network breakdown right now?
            </h4>
            <p className="text-xs text-muted-foreground">
              Skip email ticketing queues — connect directly to Peter via WhatsApp for immediate remote triage.
            </p>
          </div>
          <a
            href={getWhatsAppUrl("EMERGENCY: My system / network is down right now and I need urgent support.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm flex-shrink-0 transition-all hover:shadow-glow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Trigger Emergency Support</span>
          </a>
        </div>
      </div>
    </section>
  );
};
export default Process;

import React, { useState } from "react";
import { SERVICES, getWhatsAppUrl } from "@/config/site";
import { 
  Headphones, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Check, 
  ArrowRight, 
  MessageCircle, 
  Clock, 
  Users, 
  Briefcase,
  Layers
} from "lucide-react";

export const Services: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);

  const iconMap: Record<string, React.ElementType> = {
    Headphones,
    ShieldCheck,
    Globe,
    Cpu,
  };

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const SelectedIcon = iconMap[selectedService.iconName] || Headphones;

  return (
    <section id="services" className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Dedicated Service Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Pragmatic IT Solutions Built for <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Reliability & Business Uptime</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            No jargon. No unnecessary retainers. Just fast, dependable support, secure network engineering, and business-focused web development.
          </p>
        </div>

        {/* Desktop & Mobile Interactive Service Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.iconName] || Headphones;
            const isSelected = service.id === selectedServiceId;

            return (
              <button
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-200 border relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-card dark:bg-navy-900 border-teal-500 shadow-glow"
                    : "bg-muted/40 dark:bg-navy-950/70 border-border/70 hover:bg-card hover:border-border"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-sky-400" />
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? "bg-teal-500 text-white" : "bg-muted text-foreground"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                      {service.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>{isSelected ? "Active View" : "Explore Details"}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Service Deep-Dive Showcase Card */}
        <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border shadow-card-dark dark:shadow-glow p-6 sm:p-8 lg:p-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: What's Included & Full Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <SelectedIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Service Scope & Deliverables
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                  {selectedService.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {selectedService.fullDesc}
                </p>
              </div>

              {/* What's Included Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
                  What's Included:
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {selectedService.whatsIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                      <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Inquiry CTA for this specific service */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={getWhatsAppUrl(
                    `Hi Peter, I am interested in your ${selectedService.title} service. Can we discuss scope and availability?`,
                    selectedService.title
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-glow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire About {selectedService.title} on WhatsApp</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted text-sm font-medium"
                >
                  <span>Request Written Quote</span>
                </a>
              </div>
            </div>

            {/* Right: Who It's For, Turnaround & Mini Case Study */}
            <div className="lg:col-span-5 space-y-4">
              {/* Audience & SLA Box */}
              <div className="p-5 rounded-2xl bg-muted/40 dark:bg-navy-950/70 border border-border/80 space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Target Client
                    </h5>
                    <p className="text-xs sm:text-sm text-foreground font-medium mt-0.5">
                      {selectedService.whoItsFor}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-border/60">
                  <Clock className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Response & Turnaround
                    </h5>
                    <p className="text-xs sm:text-sm text-foreground font-medium mt-0.5">
                      {selectedService.typicalTurnaround}
                    </p>
                  </div>
                </div>
              </div>

              {/* Relevant Mini Case Study Card */}
              <div className="p-5 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    Mini Case Study
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {selectedService.miniCaseStudy.client}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Challenge:</strong> {selectedService.miniCaseStudy.challenge}
                  </p>
                  <p className="text-teal-900 dark:text-teal-200">
                    <strong className="text-teal-700 dark:text-teal-400">Outcome:</strong> {selectedService.miniCaseStudy.result}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Services;

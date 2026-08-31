import React, { useState, useCallback } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { KenyaLocationPicker, KenyaLocationValue } from "@/components/KenyaLocationPicker";
import { 
  Calculator, 
  Check, 
  MessageCircle, 
  FileText,
  Clock,
  Sparkles,
  MapPin
} from "lucide-react";

interface ScopeOption {
  id: string;
  name: string;
  category: "support" | "network" | "web" | "cctv";
  deliveryTag: string;
  description: string;
}

export const QuickQuoteEstimator: React.FC = () => {
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["wifi_setup"]);
  const [urgencyLabel, setUrgencyLabel] = useState<string>("Standard (This Week)");
  const [location, setLocation] = useState<string>("Parklands / Highridge, Westlands, Nairobi City");

  const handleLocationChange = useCallback((loc: KenyaLocationValue) => {
    setLocation(loc.formattedLocation);
  }, []);

  const scopeCatalog: ScopeOption[] = [
    {
      id: "emergency_triage",
      name: "Emergency Remote IT Help",
      category: "support",
      deliveryTag: "15-Min Remote Connection",
      description: "Immediate remote connection for slow PCs, frozen business apps, or virus removal",
    },
    {
      id: "onsite_dispatch",
      name: "Same-Day On-Site Visit (Nairobi)",
      category: "support",
      deliveryTag: "Same-Day On-Site",
      description: "Hands-on hardware troubleshooting, structured cable repairs, and router diagnostics",
    },
    {
      id: "wifi_setup",
      name: "Office Wi-Fi & Access Point Setup",
      category: "network",
      deliveryTag: "1–2 Days Installation",
      description: "High-speed UniFi/MikroTik access point setup with isolated guest Wi-Fi",
    },
    {
      id: "pos_isolation",
      name: "Protected Payment Till Setup",
      category: "network",
      deliveryTag: "Priority Lane Setup",
      description: "Separate private lane for M-Pesa & card machines so payments never freeze",
    },
    {
      id: "cctv_4ch",
      name: "4-Channel HD CCTV Camera Setup",
      category: "cctv",
      deliveryTag: "Turnkey Installation",
      description: "HD night-vision cameras with encrypted live phone viewing app for manager",
    },
    {
      id: "business_website",
      name: "Custom Fast Business Website",
      category: "web",
      deliveryTag: "5–10 Days Delivery",
      description: "Sub-2s mobile load speed, WhatsApp ordering buttons, and Google Search setup",
    },
  ];

  const toggleScope = (id: string) => {
    if (selectedScopes.includes(id)) {
      if (selectedScopes.length > 1) {
        setSelectedScopes(selectedScopes.filter((item) => item !== id));
      }
    } else {
      setSelectedScopes([...selectedScopes, id]);
    }
  };

  const generateWhatsAppMessage = () => {
    const selectedNames = selectedScopes
      .map((id) => scopeCatalog.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join("\n• ");

    return `Hi Peter,\n\nI selected my project requirements on your website:\n\nServices Needed:\n• ${selectedNames}\n\nLocation: *${location}*\nTimeline: *${urgencyLabel}*\n\nCould you review these requirements and provide a custom proposal / quote?`;
  };

  return (
    <section className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Scope Builder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Custom Project Scope: <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Tailored to Your Business</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Select the services your business needs. Peter will review your requirements and provide an exact, itemized proposal.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scope Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-7 space-y-4">
              <h3 className="font-heading font-bold text-lg text-foreground">
                Select Your Required Services:
              </h3>

              <div className="space-y-2.5">
                {scopeCatalog.map((item) => {
                  const isChecked = selectedScopes.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleScope(item.id)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked
                          ? "bg-teal-500/10 border-teal-500/60 shadow-sm"
                          : "bg-muted/40 hover:bg-muted/70 border-border"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked
                                ? "bg-teal-600 border-teal-600 text-white"
                                : "border-muted-foreground/40 bg-card"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-heading font-bold text-sm text-foreground">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-6 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full flex-shrink-0 pt-0.5 border border-teal-500/20">
                        {item.deliveryTag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Urgency Selector */}
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 p-6 space-y-3">
              <label className="font-heading font-bold text-sm text-foreground block">
                Required Project Timeline:
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {[
                  "Standard (This Week)",
                  "Urgent (Within 48h)",
                  "Emergency (Today)",
                ].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setUrgencyLabel(label)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      urgencyLabel === label
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-muted text-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Tier Kenyan Location Selector */}
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-heading font-bold text-sm text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>Office / Site Location (County &rarr; Constituency &rarr; Ward):</span>
                </label>
              </div>
              <KenyaLocationPicker
                initialCounty="Nairobi City"
                initialConstituency="Westlands"
                initialWard="Parklands / Highridge"
                onChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Right Column: Quote Summary & Direct Submit Form */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/40 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-4 border-b border-border">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Custom Proposal Summary
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                    Itemized Scope
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({selectedScopes.length} deliverables)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Timeline: <strong className="text-foreground">{urgencyLabel}</strong></span>
                </div>
              </div>

              {/* Scope Checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-mono text-muted-foreground uppercase tracking-wider text-[10px] block">
                  Included in this scope:
                </span>
                {selectedScopes.map((id) => {
                  const item = scopeCatalog.find((s) => s.id === id);
                  return (
                    <div key={id} className="flex items-center justify-between text-foreground">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                        {item?.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {item?.deliveryTag}
                      </span>
                    </div>
                  );
                })}
              </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={getWhatsAppUrl(generateWhatsAppMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Send Scope on WhatsApp (Instant Estimate)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    title="Print or Save as PDF Proposal"
                    className="w-full py-2.5 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileText className="w-4 h-4 text-teal-500" />
                    <span>Save / Print Scope as PDF</span>
                  </button>
                </div>

              <p className="text-[11px] text-center text-muted-foreground">
                🔒 Free initial consultation. Transparent, itemized pricing discussed directly with Peter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickQuoteEstimator;

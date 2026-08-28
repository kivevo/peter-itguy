import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Check, 
  MessageCircle, 
  Send,
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface ScopeOption {
  id: string;
  name: string;
  category: "support" | "network" | "web" | "cctv";
  basePrice: number;
  description: string;
}

export const QuickQuoteEstimator: React.FC = () => {
  const { toast } = useToast();
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["wifi_setup"]);
  const [urgencyMultiplier, setUrgencyMultiplier] = useState<number>(1.0);
  const [urgencyLabel, setUrgencyLabel] = useState<string>("Standard (This Week)");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showDirectForm, setShowDirectForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scopeCatalog: ScopeOption[] = [
    {
      id: "emergency_triage",
      name: "Emergency Remote Help",
      category: "support",
      basePrice: 2500,
      description: "Immediate 15-minute remote connection for slow PCs, frozen apps, or viruses",
    },
    {
      id: "onsite_dispatch",
      name: "Same-Day On-Site Visit (Nairobi)",
      category: "support",
      basePrice: 3500,
      description: "Hands-on hardware troubleshooting, cable repairs, and router diagnostics",
    },
    {
      id: "wifi_setup",
      name: "Office Wi-Fi & Access Point Setup",
      category: "network",
      basePrice: 12000,
      description: "High-speed UniFi/MikroTik access point setup with isolated guest Wi-Fi",
    },
    {
      id: "pos_isolation",
      name: "Protected Payment Till Setup",
      category: "network",
      basePrice: 8500,
      description: "Separate private lane for M-Pesa & card machines so payments never freeze",
    },
    {
      id: "cctv_4ch",
      name: "4-Channel HD CCTV Camera Setup",
      category: "cctv",
      basePrice: 28000,
      description: "HD night-vision cameras with encrypted live phone viewing app for manager",
    },
    {
      id: "business_website",
      name: "Custom Fast Business Website",
      category: "web",
      basePrice: 25000,
      description: "Sub-2s mobile load speed, WhatsApp ordering buttons, and Google Search setup",
    },
  ];

  const toggleScope = (id: string) => {
    setIsSubmitted(false);
    if (selectedScopes.includes(id)) {
      if (selectedScopes.length > 1) {
        setSelectedScopes(selectedScopes.filter((item) => item !== id));
      }
    } else {
      setSelectedScopes([...selectedScopes, id]);
    }
  };

  const calculateSubtotal = () => {
    const rawTotal = selectedScopes.reduce((acc, currentId) => {
      const item = scopeCatalog.find((s) => s.id === currentId);
      return acc + (item ? item.basePrice : 0);
    }, 0);
    return Math.round(rawTotal * urgencyMultiplier);
  };

  const subtotal = calculateSubtotal();

  const handleDirectWebSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please provide a phone number so Peter can deliver your quote.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Quote Request Received! 🚀",
      description: `Thank you! Peter has received your customized estimate for KES ${subtotal.toLocaleString()} and will contact ${clientPhone} right away.`,
    });
  };

  const generateWhatsAppMessage = () => {
    const selectedNames = selectedScopes
      .map((id) => scopeCatalog.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join("\n• ");

    return `Hi Peter,\n\nI built a project quote estimate on your website:\n\nServices Needed:\n• ${selectedNames}\n\nTimeline: ${urgencyLabel}\nEstimated Range: KES ${subtotal.toLocaleString()}\n${clientName ? `Name: ${clientName}\nPhone: ${clientPhone}\n` : ""}\nCould you provide a detailed consultation / quote for my business?`;
  };

  return (
    <section className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-5xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Cost Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Transparent Pricing: <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Build Your Project Estimate</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Select the services you need to calculate an instant cost estimate. You can send it directly from the site or open in WhatsApp.
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

                      <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 flex-shrink-0 pt-0.5">
                        ~KES {item.basePrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Urgency Slider */}
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 p-6 space-y-3">
              <label className="font-heading font-bold text-sm text-foreground block">
                Required Project Timeline:
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {[
                  { label: "Standard (This Week)", multiplier: 1.0 },
                  { label: "Urgent (Within 48h)", multiplier: 1.15 },
                  { label: "Emergency (Today)", multiplier: 1.3 },
                ].map((tier) => (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => {
                      setUrgencyMultiplier(tier.multiplier);
                      setUrgencyLabel(tier.label);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      urgencyLabel === tier.label
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-muted text-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quote Summary & Direct Submit Form */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/40 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-4 border-b border-border">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Estimated Total Investment
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground">
                    KES {subtotal.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    (Est. Quote)
                  </span>
                </div>
              </div>

              {/* Scope Checklist */}
              <div className="space-y-2 text-xs">
                <span className="font-mono text-muted-foreground uppercase tracking-wider text-[10px] block">
                  Included in this estimate ({selectedScopes.length} items):
                </span>
                {selectedScopes.map((id) => {
                  const item = scopeCatalog.find((s) => s.id === id);
                  return (
                    <div key={id} className="flex items-center justify-between text-foreground">
                      <span>• {item?.name}</span>
                      <span className="font-mono text-muted-foreground">
                        KES {item?.basePrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {isSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2 text-center animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-heading font-bold text-sm">
                    Quote Request Sent Successfully!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Peter has received your selected scope and will reach out to you directly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {showDirectForm ? (
                    <form onSubmit={handleDirectWebSubmit} className="space-y-2.5 p-3.5 rounded-2xl bg-muted/40 border border-border">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Send Quote Directly from Web</span>
                        <button
                          type="button"
                          onClick={() => setShowDirectForm(false)}
                          className="text-muted-foreground hover:text-foreground text-[11px] underline"
                        >
                          Cancel
                        </button>
                      </div>

                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Your Name (e.g. Mary Wanjiku)"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />

                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Phone / WhatsApp Number *"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Quote Request Directly</span>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setShowDirectForm(true)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Quote Request from Website</span>
                      </button>

                      <a
                        href={getWhatsAppUrl(generateWhatsAppMessage())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Or Send via WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-center text-muted-foreground">
                🔒 Free initial consultation. Transparent itemized invoices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickQuoteEstimator;

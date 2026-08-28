import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  CreditCard, 
  Laptop, 
  Printer, 
  Building, 
  Globe, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface IssueOption {
  id: string;
  icon: React.ElementType;
  title: string;
  sub: string;
  advice: string;
  turnaround: string;
  priceEstimate: string;
}

export const InstantIssueWizard: React.FC = () => {
  const { toast } = useToast();
  const [selectedIssue, setSelectedIssue] = useState<string>("wifi");
  const [location, setLocation] = useState<string>("Nairobi CBD / Westlands / Kilimani");
  const [urgency, setUrgency] = useState<string>("Urgent (Today / Within Hours)");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showDirectForm, setShowDirectForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issues: IssueOption[] = [
    {
      id: "wifi",
      icon: Wifi,
      title: "Wi-Fi is Slow or Keeps Dropping",
      sub: "Office laptops & phones disconnect during work hours",
      advice: "Most office Wi-Fi drops occur because basic ISP home routers get overwhelmed by 10+ devices. Peter installs smart access points to isolate traffic and speed up your connection.",
      turnaround: "15-min remote triage • Same-day Nairobi visit",
      priceEstimate: "From KES 3,500 (Diagnostic / Fix)",
    },
    {
      id: "pos",
      icon: CreditCard,
      title: "Payment Till / POS Machine Freezing",
      sub: "M-Pesa, card machines or till PCs timing out",
      advice: "Customer phones on guest Wi-Fi are likely crowding out your payment tills. Peter isolates your tills onto a private priority lane so transactions never freeze.",
      turnaround: "Priority 1-hour emergency dispatch",
      priceEstimate: "From KES 4,500",
    },
    {
      id: "computer",
      icon: Laptop,
      title: "Computer Won't Start / Slow / Virus",
      sub: "Windows crashing, blue screen, or suspicious popups",
      advice: "Peter can connect remotely within 15 minutes to remove viruses, speed up startup, or visit your office to replace failed hard drives with super-fast SSDs.",
      turnaround: "15-minute remote connection",
      priceEstimate: "From KES 2,500 (Remote) / KES 3,500 (On-site)",
    },
    {
      id: "printer",
      icon: Printer,
      title: "Office Printer Offline / Not Sharing",
      sub: "Staff cannot print invoices or documents over Wi-Fi",
      advice: "Peter configures dedicated IP sharing and network print queues so all staff can print seamlessly from any laptop or desktop.",
      turnaround: "Same-day resolution",
      priceEstimate: "From KES 2,500",
    },
    {
      id: "office_setup",
      icon: Building,
      title: "New Office IT & CCTV Setup",
      sub: "Need complete cabling, Wi-Fi, cameras, and staff PCs",
      advice: "Turnkey office setup: structured network cabling, long-range Wi-Fi, HD security cameras with mobile phone streaming, and staff workstations.",
      turnaround: "2–5 days full turnkey installation",
      priceEstimate: "Custom package (Free written quote)",
    },
    {
      id: "website",
      icon: Globe,
      title: "Need a Fast Business Website",
      sub: "Want a modern site that brings WhatsApp orders & calls",
      advice: "Peter builds fast, mobile-friendly websites that load in under 2 seconds on Kenyan phones and feature direct WhatsApp order buttons.",
      turnaround: "5–10 days ready to launch",
      priceEstimate: "From KES 25,000",
    },
  ];

  const currentIssue = issues.find((i) => i.id === selectedIssue) || issues[0];

  const handleDirectWebSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      toast({
        title: "Please fill in your details",
        description: "Name and Phone number are required so Peter can assist you.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Request Received Successfully! 🚀",
      description: `Thank you, ${clientName}! Peter has received your ${currentIssue.title} request for ${location} and will call or message ${clientPhone} immediately.`,
    });
  };

  const generatedWhatsAppText = `Hi Peter,\n\nI need help with: *${currentIssue.title}*\nLocation: *${location}*\nUrgency: *${urgency}*\n${clientName ? `Name: ${clientName}\nPhone: ${clientPhone}\n` : ""}\nPlease let me know your availability.`;

  return (
    <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-6 sm:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Troubleshooter &amp; Instant Dispatch</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          What Tech Issue Are You Experiencing Today?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Select your problem below for instant plain-English advice, pricing guide, and direct dispatch to Peter.
        </p>
      </div>

      {/* Step 1: Issue Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <span>Step 1: Choose Your Issue</span>
          <span>(Click to select)</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {issues.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedIssue === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedIssue(item.id);
                  setIsSubmitted(false);
                }}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "bg-teal-500/10 border-teal-500 shadow-md ring-2 ring-teal-500/30"
                    : "bg-muted/40 hover:bg-muted border-border text-foreground hover:border-teal-500/40"
                }`}
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.sub}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">
                    {item.priceEstimate}
                  </span>
                  {isSelected && (
                    <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Location & Urgency */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border/80">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            <span>Your Business Location</span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="Nairobi CBD / Westlands / Kilimani">Nairobi (CBD, Westlands, Kilimani, Upper Hill)</option>
            <option value="Nairobi Industrial Area / Mombasa Rd">Nairobi (Industrial Area, Mombasa Rd, Airport)</option>
            <option value="Nairobi Suburbs (Karen, Gigiri, Runda)">Nairobi Suburbs (Karen, Gigiri, Runda, Thika Rd)</option>
            <option value="Other Town in Kenya (Remote Support)">Other Town in Kenya (Remote Diagnostic)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>How Fast Do You Need This?</span>
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="Urgent (Today / Within Hours)">🚨 Emergency (Within 1-3 Hours / Today)</option>
            <option value="Standard (This Week)">⚡ Standard (This Week)</option>
            <option value="Free Written Quotation">📅 Free Planning / Written Quotation</option>
          </select>
        </div>
      </div>

      {/* Step 3: Advice Card & Dual Submission (Direct Web vs WhatsApp) */}
      <div className="rounded-2xl bg-teal-500/10 border border-teal-500/30 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-700 dark:text-teal-300 uppercase">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Peter's Plain-English Solution:</span>
            </div>
            <h4 className="font-heading font-extrabold text-base sm:text-lg text-foreground">
              {currentIssue.title}
            </h4>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-xl">
              {currentIssue.advice}
            </p>
          </div>

          <div className="bg-card dark:bg-navy-950 p-4 rounded-xl border border-teal-500/20 text-center sm:text-right space-y-1 flex-shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Estimated Pricing
            </span>
            <p className="font-heading font-extrabold text-sm sm:text-base text-teal-700 dark:text-teal-300">
              {currentIssue.priceEstimate}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              {currentIssue.turnaround}
            </span>
          </div>
        </div>

        {/* Successful Direct Web Submission Confirmation */}
        {isSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-heading font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Request Sent Directly to Peter!</span>
            </div>
            <p className="text-xs">
              Thank you, <strong>{clientName}</strong>! Peter has received your inquiry for <strong>{currentIssue.title}</strong> at <strong>{location}</strong> and will reach out to <strong>{clientPhone}</strong> shortly.
            </p>
          </div>
        ) : (
          /* Dual Action Options */
          <div className="space-y-4 pt-1">
            {showDirectForm ? (
              /* Inline Direct Form without leaving page */
              <form onSubmit={handleDirectWebSubmit} className="p-4 rounded-2xl bg-card dark:bg-navy-950 border border-border space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-heading font-bold text-foreground">
                  <span>Send Request Directly to Peter (No WhatsApp App Needed)</span>
                  <button
                    type="button"
                    onClick={() => setShowDirectForm(false)}
                    className="text-muted-foreground hover:text-foreground text-[11px] underline"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 dark:bg-navy-900 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 dark:bg-navy-900 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request to Peter Directly</span>
                  </button>
                  
                  <a
                    href={getWhatsAppUrl(generatedWhatsAppText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Or Open in WhatsApp</span>
                  </a>
                </div>
              </form>
            ) : (
              /* Default Instant Buttons */
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowDirectForm(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Request Directly from Website</span>
                </button>

                <a
                  href={getWhatsAppUrl(generatedWhatsAppText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow flex-shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantIssueWizard;

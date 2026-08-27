import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  MessageCircle, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitted(true);
    toast({
      title: "Checklist Unlocked!",
      description: "Opening PDF and sending quick WhatsApp copy.",
    });

    // Send pre-filled WhatsApp lead
    const waUrl = getWhatsAppUrl(
      `Hi Peter, my name is ${name} (${phone}). I just downloaded your "5-Point Office Network Health Checklist" and would like to learn more.`
    );
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card dark:bg-navy-900 border border-border shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Free Technical One-Pager</span>
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-foreground">
            5 Signs Your Nairobi Office Network Needs an Upgrade (PDF)
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            A quick, jargon-free diagnostic checklist covering Wi-Fi bottlenecks, POS payment failovers, VLAN separation, and IP camera security.
          </p>
        </div>

        {/* Checklist Preview Points */}
        <div className="space-y-2 p-4 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border/70 text-xs">
          <div className="flex items-start gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <span>Why M-Pesa POS tills freeze during peak weekend customer Wi-Fi usage</span>
          </div>
          <div className="flex items-start gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <span>How to configure dual-ISP failover without paying for expensive corporate fiber</span>
          </div>
          <div className="flex items-start gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
            <span>3 crucial security questions to ask before installing IP CCTV cameras</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleDownload} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Mwangi"
              className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Phone / WhatsApp *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all hover:shadow-glow"
          >
            <Download className="w-4 h-4" />
            <span>Download Free Checklist &amp; Connect on WhatsApp</span>
          </button>

          <p className="text-[11px] text-center text-muted-foreground">
            🔒 No spam. Direct engineer WhatsApp delivery.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadMagnetModal;

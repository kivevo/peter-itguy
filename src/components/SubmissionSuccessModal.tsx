import React, { useEffect } from "react";
import { getWhatsAppUrl } from "@/config/site";
import {
  CheckCircle2,
  MessageCircle,
  Phone,
  X,
  ExternalLink,
  Send,
  ArrowRight,
} from "lucide-react";

export interface SubmissionDetails {
  ticketId: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  location?: string;
  urgency?: string;
  waUrl: string; // pre-built WhatsApp URL to open
}

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: SubmissionDetails | null;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  // Auto-open WhatsApp as soon as the modal mounts
  useEffect(() => {
    if (isOpen && details?.waUrl) {
      const timer = setTimeout(() => {
        window.open(details.waUrl, "_blank", "noopener,noreferrer");
      }, 400); // slight delay so modal renders first
      return () => clearTimeout(timer);
    }
  }, [isOpen, details?.waUrl]);

  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-card dark:bg-navy-900 border border-emerald-500/40 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1 — Confirmed Banner */}
        <div className="bg-emerald-600 px-6 py-5 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Step 1 Complete — Request Logged</span>
          </div>
          <p className="text-xs text-emerald-100">
            Ticket <span className="font-mono font-bold">#{details.ticketId}</span> saved · Peter notified by email
          </p>
        </div>

        {/* Step 2 — WhatsApp CTA (main action) */}
        <div className="px-6 py-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
              <MessageCircle className="w-9 h-9 text-emerald-500" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-foreground">
              Step 2: Send Your Message on WhatsApp
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              WhatsApp should have opened automatically with your message pre-filled.
              <strong className="text-foreground"> Just tap the green Send button</strong> to deliver it to Peter.
            </p>
          </div>

          {/* WhatsApp step diagram */}
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <span className="text-foreground/80">WhatsApp opens with your inquiry pre-filled</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <span className="text-foreground/80">Tap the <strong className="text-emerald-600">green send ▶ button</strong> in WhatsApp</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <span className="text-foreground/80">Peter receives it instantly and calls or replies</span>
            </div>
          </div>

          {/* Manual open in case auto-open was blocked */}
          <a
            href={details.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-base shadow-lg transition-all group"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open WhatsApp &amp; Send Now</span>
            <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </a>

          <p className="text-[11px] text-center text-muted-foreground">
            If WhatsApp didn't open automatically, tap the button above.
          </p>

          {/* Secondary: direct call */}
          <div className="pt-1 border-t border-border/60">
            <a
              href="tel:+254758896553"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-teal-500" />
              <span>Or call Peter directly: +254 758 896 553</span>
            </a>
          </div>

          {/* Summary card */}
          <div className="rounded-xl bg-muted/50 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-semibold text-foreground">{details.service}</span>
            </div>
            {details.location && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground flex-shrink-0">Location:</span>
                <span className="font-semibold text-foreground text-right">{details.location}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Phone:</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{details.phone}</span>
            </div>
            {details.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email receipt:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✅ Sent</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccessModal;

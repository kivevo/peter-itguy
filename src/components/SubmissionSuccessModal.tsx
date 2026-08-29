import React from "react";
import { getWhatsAppUrl } from "@/config/site";
import { 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Clock, 
  ShieldCheck, 
  X, 
  ExternalLink,
  Sparkles,
  Ticket,
  MapPin
} from "lucide-react";

export interface SubmissionDetails {
  ticketId: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  location?: string;
  urgency?: string;
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
  if (!isOpen || !details) return null;

  const waMessage = `Hi Peter,\n\nI just submitted Ticket #${details.ticketId} on your website for *${details.service}* in *${details.location || "Nairobi"}*.\nMy Name: ${details.name}\nPhone: ${details.phone}\n\nCan we discuss next steps?`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/40 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-10 h-10 text-teal-500 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono text-xs font-bold border border-teal-500/25">
            <Ticket className="w-3.5 h-3.5" />
            <span>Ticket Dispatched: #{details.ticketId}</span>
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-foreground">
            Request Received by Peter Kivevo!
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Thank you, <strong className="text-foreground">{details.name}</strong>! Your inquiry has been logged into Peter's on-call technician queue.
          </p>
        </div>

        {/* Live Status Tracker */}
        <div className="rounded-2xl bg-teal-500/10 border border-teal-500/25 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Status: Assigned to Senior Engineer
            </span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">Response: &lt; 15 Mins</span>
          </div>

          <div className="space-y-2 text-xs border-t border-teal-500/20 pt-3 text-foreground/90">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-semibold">{details.service}</span>
            </div>
            {details.location && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-right max-w-[240px] truncate">{details.location}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Direct Callback Number:</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{details.phone}</span>
            </div>
            {details.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Receipt:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">✅ Confirmation Sent</span>
              </div>
            )}
          </div>
        </div>

        {/* Direct Action Hub */}
        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground">
            Want immediate direct assistance? Start a WhatsApp chat with Peter right now:
          </p>

          <a
            href={getWhatsAppUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all hover:shadow-glow group"
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Open WhatsApp Chat with Peter (1-Tap)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <a
            href="tel:+254758896553"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs sm:text-sm transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-500" />
            <span>Call Peter Directly (+254 758 896 553)</span>
          </a>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-center text-muted-foreground">
          🔒 Your contact info is strictly confidential. No spam, ever.
        </p>
      </div>
    </div>
  );
};

export default SubmissionSuccessModal;

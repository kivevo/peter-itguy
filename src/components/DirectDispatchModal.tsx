import React, { useState } from "react";
import { SITE_CONFIG, SERVICES, getWhatsAppUrl } from "@/config/site";
import { dataStorage } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  X, 
  CheckCircle2, 
  Phone, 
  Clock, 
  MessageSquare, 
  User, 
  Sparkles,
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface DirectDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  initialService?: string;
}

export const DirectDispatchModal: React.FC<DirectDispatchModalProps> = ({
  isOpen,
  onClose,
  initialMessage = "",
  initialService,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(initialService || SERVICES[0].title);
  const [urgency, setUrgency] = useState("Urgent (Today / Within Hours)");
  const [message, setMessage] = useState(initialMessage || "Hi Peter, I need IT help for my business.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync initialMessage when modal opens
  React.useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
    if (initialService) {
      setService(initialService);
    }
  }, [initialMessage, initialService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Please complete the required fields",
        description: "Name and Phone number are required so Peter can contact you.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Save lead to persistent storage for Peter's Admin Panel
    dataStorage.addInquiry({
      source: "direct_modal",
      name: name.trim(),
      phone: phone.trim(),
      service,
      urgency,
      details: message.trim(),
    });

    // Simulate direct message dispatch to Peter's phone
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Message Sent Successfully! 🚀",
        description: `Thank you, ${name}! Peter has received your request and will contact ${phone} shortly.`,
      });
    }, 400);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center sm:text-left pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Engineer Response</span>
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-foreground">
            Send Message to Peter Kivevo
          </h3>
          <p className="text-xs text-muted-foreground">
            Direct line: <strong className="text-foreground">{SITE_CONFIG.phoneDisplay}</strong> • Average reply within 15 minutes.
          </p>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="py-8 text-center space-y-4 bg-teal-500/10 rounded-2xl border border-teal-500/30 p-6 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-teal-500" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="font-heading font-extrabold text-xl text-foreground">
                Message Sent Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                Thank you, <strong>{name}</strong>! Your inquiry for <strong>{service}</strong> has been received by Peter Kivevo.
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-mono pt-1">
                ⚡ Peter will call or message {phone} shortly.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-500" />
                  <span>Your Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-500" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-mono"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Service / Topic *</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Emergency IT Fix">🚨 Emergency IT / Wi-Fi Fix</option>
                  <option value="Website Revamp Quote">🌐 Website Speed Revamp Quote</option>
                  <option value="CCTV Security Setup">📹 CCTV Cameras &amp; Access Control</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Urgency *</span>
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  <option value="🚨 Urgent (Within Hours / Today)">🚨 Emergency (Within Hours / Today)</option>
                  <option value="⚡ Standard (This Week)">⚡ Standard (This Week)</option>
                  <option value="📅 Free Written Quotation">📅 Free Planning / Written Quote</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-500" />
                <span>Your Message / Problem Details *</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you need help with..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-md transition-all hover:shadow-glow disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending Request to Peter..." : "Send Message to Peter"}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>🔒 Direct engineer inbox • Fast response</span>
                <a
                  href={getWhatsAppUrl(message, service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Open in WhatsApp</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DirectDispatchModal;

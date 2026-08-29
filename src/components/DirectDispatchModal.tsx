import React, { useState, useEffect, useCallback } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage, InquiryLead } from "@/services/dataStorage";
import { resendService } from "@/services/resendService";
import { useToast } from "@/hooks/use-toast";
import { KenyaLocationPicker, KenyaLocationValue } from "@/components/KenyaLocationPicker";
import SubmissionSuccessModal, { SubmissionDetails } from "@/components/SubmissionSuccessModal";
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
  ShieldCheck,
  MapPin
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
  const [siteContent, setSiteContent] = useState(dataStorage.getSiteContent());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(initialService || siteContent.services[0]?.title || "Computer & IT Support");
  const [location, setLocation] = useState<string>("Parklands / Highridge, Westlands, Nairobi City");
  const [urgency, setUrgency] = useState("Urgent (Today / Within Hours)");
  const [message, setMessage] = useState(initialMessage || "Hi Peter, I need IT help for my business.");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalDetails, setSuccessModalDetails] = useState<SubmissionDetails | null>(null);

  const handleLocationChange = useCallback((loc: KenyaLocationValue) => {
    setLocation(loc.formattedLocation);
  }, []);

  useEffect(() => {
    const load = () => setSiteContent(dataStorage.getSiteContent());
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  const siteInfo = siteContent.siteInfo;
  const services = siteContent.services;

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
    const newLead: InquiryLead = {
      id: `inq_${Date.now()}`,
      source: "direct_modal",
      name: name.trim(),
      phone: phone.trim(),
      service,
      urgency,
      details: `Location: ${location} | Urgency: ${urgency} | Details: ${message.trim()}${email.trim() ? ` (Email: ${email.trim()})` : ""}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // Build the WhatsApp message with full context
    const waText = `Hi Peter,\n\nI'm reaching out from your website.\n\n*Ticket:* #${ticketId}\n*Name:* ${name.trim()}\n*Phone:* ${phone.trim()}\n*Service:* ${service}\n*Urgency:* ${urgency}\n*Location:* ${location}\n*Message:* ${message.trim()}`;
    const waUrl = getWhatsAppUrl(waText);

    // Save lead to persistent storage for Peter's Admin Panel
    dataStorage.addInquiry(newLead);

    // Send immediate email alert to Peter via Resend (fire-and-forget)
    resendService.notifyNewInquiry(newLead);

    // Send client confirmation receipt if email was provided
    if (email.trim() && email.includes("@")) {
      resendService.sendClientInquiryConfirmation(newLead, email.trim());
    }

    setIsSubmitting(false);

    // Show success modal — it will auto-open WhatsApp
    setSuccessModalDetails({
      ticketId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      service,
      location,
      urgency,
      waUrl,
    });
    onClose();
  };


  const handleResetAndClose = () => {
    setSuccessModalDetails(null);
    onClose();
  };

  return (
    <>
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
            Direct line: <strong className="text-foreground">{siteInfo.phoneDisplay}</strong> • Average reply within 15 minutes.
          </p>
        </div>

        {/* Form */}
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

            {/* Optional email for receipt */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>Email (optional — get a confirmation receipt)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.co.ke"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Service / Topic *</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                >
                  {services.map((s) => (
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

            {/* 3-Tier Kenyan Location Selector */}
            <div className="space-y-1 pt-1">
              <KenyaLocationPicker
                initialCounty="Nairobi City"
                initialConstituency="Westlands"
                initialWard="Parklands / Highridge"
                compact={true}
                onChange={handleLocationChange}
              />
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
        </div>
    </div>

    <SubmissionSuccessModal
      isOpen={!!successModalDetails}
      onClose={() => setSuccessModalDetails(null)}
      details={successModalDetails}
    />
    </>
  );
};

export default DirectDispatchModal;

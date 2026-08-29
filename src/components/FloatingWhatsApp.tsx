import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage, InquiryLead } from "@/services/dataStorage";
import { resendService } from "@/services/resendService";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, X, Send, CheckCircle2, Phone, Sparkles } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [isSentDirectly, setIsSentDirectly] = useState(false);

  const quickPrompts = [
    "🚨 I need emergency help with a broken computer / Wi-Fi",
    "🌐 I want a quote for a new fast business website",
    "📹 I need security cameras (CCTV) for my office / home",
    "🏢 I want monthly IT support for our office / shops",
  ];

  const handleOpenWhatsApp = (textToSend?: string) => {
    const message = textToSend || customMsg || "Hi Peter, I need quick IT help for my business.";
    window.open(getWhatsAppUrl(message), "_blank");
    setIsOpen(false);
    setCustomMsg("");
  };

  const handleSendDirectlyFromWeb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number so Peter can get back to you.",
        variant: "destructive",
      });
      return;
    }

    const lead: InquiryLead = {
      id: `inq_${Date.now()}`,
      source: "floating_chat",
      name: senderName.trim() || "Chat Visitor",
      phone: senderPhone.trim(),
      service: "Quick Help Inquiry",
      details: customMsg.trim() || "General IT / website inquiry via floating chat widget",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    dataStorage.addInquiry(lead);

    // Send immediate email alert to Peter via Resend
    resendService.notifyNewInquiry(lead);

    setIsSentDirectly(true);
    toast({
      title: "Message Dispatched to Peter! 🚀",
      description: `Peter has been alerted via email and will call or WhatsApp ${senderPhone} shortly.`,
    });

    setTimeout(() => {
      setIsSentDirectly(false);
      setIsOpen(false);
      setCustomMsg("");
      setSenderName("");
      setSenderPhone("");
    }, 2500);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Bubble Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-card dark:bg-navy-900 border border-border shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                  P
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground">
                  Peter Kivevo John
                </h4>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">
                  Online • Replies in &lt; 5 mins
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSentDirectly ? (
            <div className="py-6 text-center space-y-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-4 animate-in fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-heading font-bold text-sm text-foreground">
                Message Sent Directly!
              </p>
              <p className="text-xs text-muted-foreground">
                Peter will contact you right away.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Need urgent computer help, Wi-Fi setup, or a fast website in Kenya? Send a direct message or open in WhatsApp:
              </p>

              {/* Quick Click Prompts */}
              <div className="space-y-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomMsg(prompt)}
                    className={`w-full text-left text-xs p-2 rounded-xl transition-colors border ${
                      customMsg === prompt 
                        ? "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40"
                        : "bg-muted/60 hover:bg-teal-500/10 text-foreground border-border/60"
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Direct Form */}
              <form onSubmit={handleSendDirectlyFromWeb} className="space-y-2 pt-1">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Describe your issue or question..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your Name (Optional)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="Phone/WhatsApp *"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp()}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-whatsapp transition-all duration-200 hover:scale-105 active:scale-95 group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="font-heading">Chat with Peter</span>
      </button>
    </div>
  );
};
export default FloatingWhatsApp;

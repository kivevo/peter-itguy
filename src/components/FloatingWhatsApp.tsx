import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage, InquiryLead } from "@/services/dataStorage";
import { resendService } from "@/services/resendService";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const quickPrompts = [
    { label: "🚨 Emergency Wi-Fi / Computer Fix", text: "Hi Peter, I need urgent emergency help with a broken computer / Wi-Fi issue." },
    { label: "🌐 Fast Business Website Quote", text: "Hi Peter, I'd like a quote for a new fast mobile-friendly business website." },
    { label: "📹 CCTV Cameras & Security Setup", text: "Hi Peter, I need a proposal for CCTV security cameras for my office/premises." },
    { label: "🏢 Monthly Business IT Support", text: "Hi Peter, I'd like to discuss monthly retainer IT support for our office & computers." },
  ];

  const handleOpenWhatsApp = (textToSend?: string) => {
    const message = textToSend || customMsg || "Hi Peter, I need quick IT help for my business.";
    
    // Log inquiry lead for Peter's CRM records
    const lead: InquiryLead = {
      id: `inq_${Date.now()}`,
      source: "floating_chat",
      name: "WhatsApp Visitor",
      phone: "Via WhatsApp",
      service: "Direct WhatsApp Inquiry",
      details: message,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    dataStorage.addInquiry(lead);
    resendService.notifyNewInquiry(lead);

    window.open(getWhatsAppUrl(message), "_blank");
    setIsOpen(false);
    setCustomMsg("");
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
                <BrandLogo className="w-10 h-10" />
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

          <p className="text-xs text-muted-foreground">
            Need urgent computer repair, office Wi-Fi setup, or a fast website in Kenya? Tap a topic or type your message to chat directly on WhatsApp:
          </p>

          {/* Quick Click Prompts */}
          <div className="space-y-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomMsg(prompt.text)}
                className={`w-full text-left text-xs p-2.5 rounded-xl transition-colors border ${
                  customMsg === prompt.text
                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-semibold"
                    : "bg-muted/60 hover:bg-emerald-500/10 text-foreground border-border/60"
                }`}
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="space-y-2 pt-1">
            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Or describe your issue / requirement here..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />

            <button
              type="button"
              onClick={() => handleOpenWhatsApp()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open in WhatsApp (Fastest Response)</span>
            </button>

            <p className="text-[10.5px] text-muted-foreground text-center">
              ⚡ Opens WhatsApp directly with your message pre-typed — ready to send.
            </p>
          </div>
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

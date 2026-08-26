import React, { useState } from "react";
import { getWhatsAppUrl, SITE_CONFIG } from "@/config/site";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const quickPrompts = [
    "I need emergency network troubleshooting",
    "I'd like a quote for a new business website",
    "I need CCTV / security installation in Nairobi",
    "I want to discuss IT support for our office",
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || "Hi Peter, I need IT assistance for my business.";
    window.open(getWhatsAppUrl(message), "_blank");
    setIsOpen(false);
    setCustomMsg("");
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Bubble Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-card dark:bg-navy-900 border border-border shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
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
                  Online • Quick WhatsApp Response
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chat popup"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Hi there! Need urgent IT support, network installation, or a new website in Nairobi? Select a quick topic or type below:
          </p>

          {/* Quick Click Prompts */}
          <div className="space-y-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left text-xs p-2 rounded-lg bg-muted/60 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-300 text-foreground transition-colors border border-border/60"
              >
                💬 {prompt}
              </button>
            ))}
          </div>

          {/* Input & Send */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={() => handleSend()}
              aria-label="Send WhatsApp message"
              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-sm flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
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
        <span className="font-heading">Get Help Now</span>
      </button>
    </div>
  );
};
export default FloatingWhatsApp;

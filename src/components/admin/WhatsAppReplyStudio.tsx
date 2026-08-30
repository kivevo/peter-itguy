import React, { useState } from "react";
import { MessageCircle, Copy, Check, ExternalLink, Send, Sparkles, User, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dataStorage } from "@/services/dataStorage";

interface TemplateItem {
  id: string;
  category: "General" | "Dispatch" | "Quotation & Payments" | "Support";
  title: string;
  generateText: (vars: { name: string; service: string; location: string; price: string }) => string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "on-my-way",
    category: "Dispatch",
    title: "🚗 On My Way to Client Site (Nairobi)",
    generateText: ({ name, location }) =>
      `Hi ${name || "there"}, this is Peter Kivevo (The IT Guy). I am currently en route to your office/premises at ${location || "Nairobi"}. Estimated arrival in approximately 30-45 minutes. Please ensure someone is available on-site. Thank you!`,
  },
  {
    id: "arrival-confirm",
    category: "Dispatch",
    title: "📍 Arrived on Site",
    generateText: ({ name, location }) =>
      `Hi ${name || "there"}, I have arrived at your premises (${location || "Nairobi"}). Kindly let the security or receptionist know so I can access the server/office area.`,
  },
  {
    id: "wifi-quote",
    category: "Quotation & Payments",
    title: "📶 Wi-Fi Survey & Network Upgrade Quote",
    generateText: ({ name, price }) =>
      `Hi ${name || "there"}, thank you for reaching out to Peter Kivevo | The IT Guy.\n\nFollowing our discussion regarding your office network/Wi-Fi overhaul, our turnkey proposal is estimated at KES ${price || "Custom Scope"}. This includes:\n• Enterprise Access Points & Mesh Coverage\n• Dedicated Isolated Guest Network & POS Till Protection\n• Structured Cat6 Cabling & Server Rack Cleanup\n• Full 30-day post-install warranty & live speed verification.\n\nWould you like me to schedule the installation visit this week?`,
  },
  {
    id: "laptop-pickup",
    category: "Support",
    title: "💻 Computer / Laptop Repair Ready for Delivery",
    generateText: ({ name, service, price }) =>
      `Hi ${name || "there"}, your computer has been successfully serviced and fully tested for ${service || "repairs / SSD upgrade"}. System diagnostics show optimal speed and 100% stability. Total service cost is KES ${price || "agreed amount"}. When is a good time to hand it back over to you today?`,
  },
  {
    id: "mpesa-receipt",
    category: "Quotation & Payments",
    title: "🧾 M-Pesa Payment Received & Receipt Confirmation",
    generateText: ({ name, price }) =>
      `Hi ${name || "there"}, confirming receipt of your payment of KES ${price || "agreed amount"}. Thank you for trusting Peter Kivevo | The IT Guy with your business IT infrastructure. If you need any follow-up remote support, simply reply on this chat anytime.`,
  },
  {
    id: "lead-response",
    category: "General",
    title: "⚡ First Response to Inbound Website Inquiry",
    generateText: ({ name, service, location }) =>
      `Hi ${name || "there"}, thank you for contacting Peter Kivevo | The IT Guy regarding ${service || "IT support"}. I saw your request for ${location || "Nairobi"}. Could you share a quick 1-sentence summary of the current issue so I can advise on the fastest fix?`,
  },
];

export const WhatsAppReplyStudio: React.FC = () => {
  const { toast } = useToast();
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [service, setService] = useState("Office Wi-Fi Setup");
  const [location, setLocation] = useState("Westlands, Nairobi");
  const [price, setPrice] = useState("15,000");
  const [customBody, setCustomBody] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Template Copied 📋", description: "Ready to paste into WhatsApp." });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (text: string) => {
    const cleanPhone = clientPhone.replace(/[^0-9]/g, "");
    const targetPhone = cleanPhone ? (cleanPhone.startsWith("254") ? cleanPhone : `254${cleanPhone.replace(/^0/, "")}`) : "";
    const url = targetPhone 
      ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900 to-teal-950/40 border border-teal-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                WhatsApp Quick-Reply Template Studio
              </h2>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Live Generator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              1-click pre-formatted enterprise WhatsApp replies for client dispatches, quotations, receipts &amp; speed follow-ups.
            </p>
          </div>
        </div>
      </div>

      {/* Variables Editor */}
      <div className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-border space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Client Variables (Auto-Injected)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. David Mwangi"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Client Phone (WhatsApp)</label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Service / Scope</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. Office Wi-Fi Fix"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kilimani, Nairobi"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Amount (KES)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 15,000"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-teal-300 font-mono text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl) => {
          const text = tmpl.generateText({ name: clientName, service, location, price });
          const isCopied = copiedId === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3.5 flex flex-col justify-between shadow-sm hover:border-teal-500/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                    {tmpl.category}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-white">{tmpl.title}</h4>
                <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/80 text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {text}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => handleCopy(text, tmpl.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-200 text-xs font-bold border border-border flex items-center justify-center gap-1.5 transition-all"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSend(text)}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhatsAppReplyStudio;

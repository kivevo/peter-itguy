import React from "react";
import { getWhatsAppUrl, SITE_CONFIG } from "@/config/site";
import { MessageCircle, Phone, ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";

export const CallToActionBand: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 text-white relative overflow-hidden border-t border-teal-500/20">
      {/* Background Soft Glows & Ambient Highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-navy-900/90 border border-teal-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>Direct WhatsApp Line & Rapid Response</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Stop Losing Business to Slow Networks, <br className="hidden sm:inline" />
            Crashed POS Tills, and Broken Websites.
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get an experienced, university-trained Computer Science graduate on your team. Whether you need a full network overhaul in Nairobi or emergency remote support countrywide, I'm ready to assist.
          </p>

          {/* Key Value Pillars */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2 max-w-2xl mx-auto text-left text-xs text-slate-200">
            <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>15-Minute Remote Diagnostic Triage</span>
            </div>
            <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Enterprise-Grade Network Isolation</span>
            </div>
            <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-xl border border-white/10">
              <Zap className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Sub-2s Mobile Websites That Convert</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={getWhatsAppUrl("Hi Peter, I'd like to book an IT diagnostic audit for my business.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message Peter on WhatsApp</span>
            </a>

            <a
              href={`tel:${SITE_CONFIG.phoneTel}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-colors"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Call: {SITE_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CallToActionBand;

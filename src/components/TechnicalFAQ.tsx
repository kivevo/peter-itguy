import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export const TechnicalFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "How does remote support work if our office internet is completely down?",
      a: "If your fiber internet is down, I can guide you or your staff over a quick phone call to connect your computer to a smartphone hotspot. In most cases, we can connect remotely within 10 minutes. If the router or power supply is physically damaged, I come to your Nairobi office the same day.",
      category: "Computer & Remote Help",
    },
    {
      q: "Can you fix our slow office Wi-Fi without forcing us to cancel our current internet provider?",
      a: "Yes! In fact, most slow internet issues are not caused by your provider (Zuku, Liquid, Airtel, Faiba), but by basic home routers being overloaded with too many office devices and guest phones. I configure smart office access points and separate your payment tills so you get the full speed you already pay for.",
      category: "Wi-Fi & Speed",
    },
    {
      q: "How fast can you visit our office in Nairobi for an urgent computer or POS crash?",
      a: "For emergency issues, I arrive on-site within 1 to 3 hours anywhere in Nairobi (CBD, Westlands, Kilimani, Upper Hill, Industrial Area, Karen, Mombasa Rd). Initial remote help starts within 15 minutes of your WhatsApp message.",
      category: "Emergency Visits",
    },
    {
      q: "How do you protect our company files, financial records, and passwords?",
      a: "I keep guest Wi-Fi strictly separated from your accounting computers and payment tills so customer phones cannot see your company files. All remote sessions are secure and encrypted, and we set up automatic daily backups so you never lose important documents.",
      category: "Security & Safety",
    },
    {
      q: "What is your pricing structure (One-Time Fix vs Monthly Support)?",
      a: "I offer both: 1) One-Time Pay-As-You-Go for emergency fixes, new websites, or CCTV installation, and 2) Affordable Monthly Support Retainers for businesses and multi-branch shops who want an on-call IT partner for peace of mind.",
      category: "Pricing & Retainers",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background dark:bg-navy-950 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            Straight Answers to <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Common Business Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Have questions about how we work, response times, or pricing? Here are clear answers without confusing jargon.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-card dark:bg-navy-900 border-teal-500/50 shadow-sm"
                    : "bg-card/60 dark:bg-navy-900/60 border-border hover:border-border"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {faq.category}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                      {faq.q}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-teal-500 bg-teal-500/10" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unanswered Question Prompt */}
        <div className="mt-10 p-5 rounded-2xl bg-muted/40 dark:bg-navy-900/70 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-heading font-bold text-sm text-foreground">
              Have a specific question about your office or setup?
            </p>
            <p className="text-xs text-muted-foreground">
              Ask directly on WhatsApp and get a friendly, immediate answer.
            </p>
          </div>
          <a
            href={getWhatsAppUrl("Hi Peter, I have a specific question about our office computers / Wi-Fi.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-sm flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Peter on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
export default TechnicalFAQ;

import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck } from "lucide-react";

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
      a: "When a primary fiber connection drops, I guide your branch manager through our mobile hotspot failover diagnostic protocol. In 80% of cases, we restore router access via LTE tethering within 10 minutes. For physical fiber cuts or blown router power supplies, I initiate same-day on-site dispatch across Nairobi.",
      category: "IT Support & SLAs",
    },
    {
      q: "Can you fix our network without forcing us to cancel our existing Safaricom / Zuku / Liquid ISP contract?",
      a: "Yes. In fact, that's what I specialize in. Most slow network complaints aren't caused by the ISP line itself, but by unmanaged local routers, lack of VLAN bandwidth prioritization, and interference between guest Wi-Fi and POS tills. I optimize your internal network hardware to get the maximum speed from your existing provider.",
      category: "Networking & Bandwidth",
    },
    {
      q: "How fast can you dispatch on-site in Nairobi for an urgent hardware or POS crash?",
      a: "For businesses on an active SLA, our on-site emergency dispatch window is within 2 to 4 hours anywhere across Nairobi (CBD, Westlands, Kilimani, Upper Hill, Industrial Area, Mombasa Rd). Initial encrypted remote triage begins within 15 minutes of your WhatsApp alert.",
      category: "Emergency Dispatch",
    },
    {
      q: "How do you protect our customer data, M-Pesa till transactions, and administrative credentials?",
      a: "I enforce zero-trust network segmentation. Guest Wi-Fi is physically and logically isolated onto a separate VLAN with zero access to your accounting or booking desks. All remote support sessions are encrypted, credentials are stored in secure password vaults, and off-site cloud backups are cryptographically protected.",
      category: "Security & Compliance",
    },
    {
      q: "What is your pricing structure (Monthly Retainer vs On-Demand Per Incident)?",
      a: "I offer both: 1) On-Demand Pay-As-You-Go for one-off web builds, emergency repairs, or CCTV installations, and 2) Monthly Retainer SLAs for multi-branch retailers and hospitality venues who need guaranteed uptime, priority 15-min triage, and scheduled preventive maintenance.",
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
            Clear Technical Answers for <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Business Owners & Operations Leads</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Have a specific scenario in mind? Here are straight answers to common questions about response times, ISP lines, and security.
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
              Have a custom infrastructure requirement or hardware question?
            </p>
            <p className="text-xs text-muted-foreground">
              Ask directly on WhatsApp and get an immediate engineering perspective.
            </p>
          </div>
          <a
            href={getWhatsAppUrl("Hi Peter, I have a specific question regarding our office network / IT setup.")}
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

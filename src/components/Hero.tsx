import React, { useState, useEffect } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage } from "@/services/dataStorage";
import DigitalContactCardModal from "@/components/DigitalContactCardModal";
import { 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Wifi, 
  Server, 
  Lock, 
  Globe2, 
  CheckCircle2, 
  Clock, 
  QrCode
} from "lucide-react";
import { ProfilePhoto } from "@/components/ProfilePhoto";

// Client-friendly rotating phrases (Simple, clear, and benefit-driven)
const SERVICE_PHRASES = [
  "I fix slow office Wi-Fi & internet disconnects.",
  "I build fast websites that bring you new clients.",
  "I keep 30+ Safaricom dealer branches running smoothly.",
  "I install clear HD security cameras on your phone.",
  "I solve computer, printer & email headaches in minutes."
];

export const Hero: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeNode, setActiveNode] = useState<string>("gateway");
  const [siteInfo, setSiteInfo] = useState(dataStorage.getSiteContent().siteInfo);
  const [contactCardOpen, setContactCardOpen] = useState(false);

  useEffect(() => {
    const load = () => setSiteInfo(dataStorage.getSiteContent().siteInfo);
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  useEffect(() => {
    const currentPhrase = SERVICE_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 25 : 55;

    const timer = setTimeout(() => {
      if (!isDeleting && displayedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2400);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % SERVICE_PHRASES.length);
      } else {
        setDisplayedText(
          isDeleting
            ? currentPhrase.substring(0, displayedText.length - 1)
            : currentPhrase.substring(0, displayedText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex]);

  const networkNodes = [
    { id: "gateway", name: "Samchi 30+ Branches", status: "All Running Smoothly", ping: "8ms", icon: Server },
    { id: "hotel", name: "After40 Hotel Wi-Fi", status: "100% Reliable", ping: "14ms", icon: Wifi },
    { id: "pos", name: "SNL Venue Payment Tills", status: "Fast & Protected", ping: "6ms", icon: Lock },
    { id: "web", name: "Client Websites", status: "Opens in < 1.5s", ping: "12ms", icon: Globe2 },
  ];

  return (
    <>
    <section
      id="home"
      className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-background dark:bg-navy-950 flex items-center"
    >
      {/* Background Tech Grids & Soft Ambient Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy-800/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3.5">
              <ProfilePhoto size="md" showStatusBadge={true} />
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-xs font-medium text-teal-800 dark:text-teal-300 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span>Peter Kivevo John · Nairobi, Kenya</span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground">
                  Fast Remote Help Countrywide • Same-Day Visits in Nairobi
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.12]">
                Your On-Call <br />
                <span className="text-gradient-teal">IT Partner</span> in Kenya
              </h1>
              
              {/* Cycling Subheader in Simple Words */}
              <div className="flex items-center gap-2 text-base sm:text-xl font-mono text-muted-foreground bg-muted/60 dark:bg-navy-900/80 px-3.5 py-2 rounded-xl border border-border/80 w-fit min-h-[44px]">
                <Terminal className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span className="text-foreground font-semibold font-mono">
                  {displayedText}
                </span>
                <span className="inline-block w-2 h-4 bg-teal-500 animate-pulse ml-0.5" />
              </div>
            </div>

            {/* Direct Value Description (Plain English) */}
            <div className="space-y-2 max-w-xl">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                When your office computers freeze, Wi-Fi drops, payment machines lag, or website goes down, I fix them fast — so you and your team never lose business.
              </p>
              <p className="text-xs sm:text-sm font-medium text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20 inline-block">
                ⚡ You talk directly with Peter — the engineer who does the work. No call centers, no waiting on hold.
              </p>
            </div>

            {/* Conversion CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Primary WhatsApp CTA */}
              <a
                href={getWhatsAppUrl("Hi Peter, I saw your IT profile and need help with a computer / network / website issue.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base shadow-lg shadow-teal-600/25 transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Message Peter on WhatsApp</span>
              </a>

              {/* Save Digital Contact Card (QR / vCard) */}
              <button
                type="button"
                onClick={() => setContactCardOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground font-semibold text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 group"
                title="Save Peter's contact to your phone"
              >
                <QrCode className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
                <span>Save My Contact Card</span>
              </button>
            </div>

            {/* Quick Proof Signals Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground border-t border-border/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>15-Min Remote Help</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>30+ Safaricom Dealer Branches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>BSc Computer Science (CUEA)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Hub Simulation */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-teal-500/20 to-sky-500/10 blur-xl pointer-events-none" />

            <div className="relative rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-5 sm:p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                  <span className="font-heading font-bold text-sm tracking-tight text-foreground">
                    Live Systems &amp; Client Network Hub
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded bg-muted text-teal-600 dark:text-teal-400 border border-border">
                  <Activity className="w-3.5 h-3.5" />
                  <span>100% Operational</span>
                </div>
              </div>

              {/* Network Graph Simulation Card */}
              <div className="relative h-56 sm:h-64 rounded-xl bg-muted/40 dark:bg-navy-950/90 border border-border/60 p-4 flex flex-col justify-between overflow-hidden">
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-teal-500/25" strokeDasharray="3 3">
                  <line x1="25%" y1="30%" x2="50%" y2="50%" strokeWidth="1.5" />
                  <line x1="75%" y1="30%" x2="50%" y2="50%" strokeWidth="1.5" />
                  <line x1="25%" y1="75%" x2="50%" y2="50%" strokeWidth="1.5" />
                  <line x1="75%" y1="75%" x2="50%" y2="50%" strokeWidth="1.5" />
                </svg>

                {/* Central Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 border-2 border-white dark:border-navy-900 animate-pulse-subtle">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mt-1 bg-background/90 px-1.5 py-0.5 rounded">
                    Peter • IT Lead
                  </span>
                </div>

                {/* Satellite Nodes */}
                <div className="grid grid-cols-2 gap-y-20 relative z-20">
                  {networkNodes.map((node) => {
                    const Icon = node.icon;
                    const isSelected = activeNode === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveNode(node.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-200 ${
                          isSelected
                            ? "bg-card border border-teal-500 shadow-sm scale-105"
                            : "bg-card/70 border border-border hover:bg-card"
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isSelected ? "bg-teal-500/20 text-teal-500" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-foreground truncate">{node.name}</p>
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">{node.status}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Node Inspection Details Strip */}
              <div className="mt-4 p-3 rounded-xl bg-muted/60 border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-muted-foreground">
                    Selected Setup: <span className="font-semibold text-foreground">{networkNodes.find(n => n.id === activeNode)?.name}</span>
                  </span>
                </div>
                <span className="text-teal-600 dark:text-teal-400 font-semibold">
                  Status: {networkNodes.find(n => n.id === activeNode)?.status}
                </span>
              </div>

              {/* Rapid Service Action Bar */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Need a quick checkup or website fix?
                </div>
                <a
                  href="#contact"
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Request Free Checkup</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <DigitalContactCardModal
      isOpen={contactCardOpen}
      onClose={() => setContactCardOpen(false)}
    />
  </>
  );
};
export default Hero;
import React, { useState, useEffect } from "react";
import { SITE_CONFIG, getWhatsAppUrl } from "@/config/site";
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
  Sparkles,
  Layers
} from "lucide-react";

// Defined outside component so the reference is stable across renders
const SERVICE_PHRASES = [
  "I fix broken networks & Wi-Fi bottlenecks.",
  "I build fast, lead-generating business websites.",
  "I support 30+ Samchi Telecom (Safaricom) branches remotely.",
  "I secure your business data and CCTV cameras.",
  "I turn downtime into reliable 99.9% uptime."
];

export const Hero: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeNode, setActiveNode] = useState<string>("gateway");

  useEffect(() => {
    const currentPhrase = SERVICE_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!isDeleting && displayedText === currentPhrase) {
        // Pause at end of sentence
        setTimeout(() => setIsDeleting(true), 2200);
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
    { id: "gateway", name: "Samchi Telecom 30+ Gateway", status: "Operational", ping: "8ms", icon: Server, x: 20, y: 25 },
    { id: "hotel", name: "After40 Hotel Wi-Fi", status: "100% Uptime", ping: "14ms", icon: Wifi, x: 80, y: 20 },
    { id: "pos", name: "SNL Venue POS VLAN", status: "Secure / Isolated", ping: "6ms", icon: Lock, x: 25, y: 75 },
    { id: "web", name: "Live Client Web Stack", status: "Sub-2s Speed", ping: "12ms", icon: Globe2, x: 75, y: 70 },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-background dark:bg-navy-950 flex items-center"
    >
      {/* Background Decorative Tech Grids & Soft Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-navy-800/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 lg:pr-4">
            {/* Real-time Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-xs sm:text-sm font-medium text-teal-800 dark:text-teal-300 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              <span>Available for On-site Nairobi & Countrywide Remote SLA</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.12]">
                Your On-Call <br />
                <span className="text-gradient-teal">IT Partner</span> in Kenya
              </h1>
              
              {/* Cycling Terminal Style Subheader */}
              <div className="flex items-center gap-2 text-base sm:text-xl font-mono text-muted-foreground bg-muted/60 dark:bg-navy-900/80 px-3.5 py-2 rounded-xl border border-border/80 w-fit min-h-[44px]">
                <Terminal className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span className="text-foreground font-semibold font-mono">
                  {displayedText}
                </span>
                <span className="inline-block w-2 h-4 bg-teal-500 animate-pulse ml-0.5" />
              </div>
            </div>

            {/* Direct Value Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              I am <span className="font-semibold text-foreground">Peter Kivevo John</span> — a Computer Science graduate providing proactive IT maintenance, zero-downtime networking, CCTV security, and high-performance websites for businesses that cannot afford to go offline.
            </p>

            {/* Conversion CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              {/* Primary WhatsApp CTA */}
              <a
                href={getWhatsAppUrl("Hi Peter, I need help with an IT issue / project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base shadow-lg shadow-teal-600/25 transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Get Support Now (WhatsApp)</span>
              </a>

              {/* Secondary Case Studies Link */}
              <a
                href="#case-studies"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/80 hover:bg-muted text-foreground font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>See Case Studies</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1" />
              </a>
            </div>

            {/* Quick Proof Signals Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground border-t border-border/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>15-min Remote Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>30+ Samchi Telecom Branches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                <span>BSc Computer Science (CUEA)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Tech Topology & SLA Cockpit */}
          <div className="lg:col-span-5 relative">
            {/* Backdrop glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-teal-500/20 to-sky-500/10 blur-xl pointer-events-none" />

            <div className="relative rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-5 sm:p-6 overflow-hidden">
              {/* Cockpit Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                  <span className="font-heading font-bold text-sm tracking-tight text-foreground">
                    Infrastructure & Network Hub
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded bg-muted text-teal-600 dark:text-teal-400 border border-border">
                  <Activity className="w-3.5 h-3.5" />
                  <span>99.98% SLA</span>
                </div>
              </div>

              {/* Network Graph Simulation Card */}
              <div className="relative h-56 sm:h-64 rounded-xl bg-muted/40 dark:bg-navy-950/90 border border-border/60 p-4 flex flex-col justify-between overflow-hidden">
                {/* SVG Circuit Connector Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-teal-500/25" strokeDasharray="3 3">
                  <line x1="25%" y1="30%" x2="50%" y2="50%" strokeWidth="1.5" />
                  <line x1="75%" y1="30%" x2="50%" y2="50%" strokeWidth="1.5" />
                  <line x1="25%" y1="75%" x2="50%" y2="50%" strokeWidth="1.5" />
                  <line x1="75%" y1="75%" x2="50%" y2="50%" strokeWidth="1.5" />
                </svg>

                {/* Central Dispatch Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 border-2 border-white dark:border-navy-900 animate-pulse-subtle">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mt-1 bg-background/90 px-1.5 py-0.5 rounded">
                    Peter • IT Core
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
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">{node.status} • {node.ping}</p>
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
                  <span className="text-muted-foreground font-mono">
                    Active Node: <span className="font-semibold text-foreground">{networkNodes.find(n => n.id === activeNode)?.name}</span>
                  </span>
                </div>
                <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  Latency: {networkNodes.find(n => n.id === activeNode)?.ping}
                </span>
              </div>

              {/* Rapid Service Action Bar */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Need a network audit or website fix?
                </div>
                <a
                  href="#contact"
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Request Free Audit</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
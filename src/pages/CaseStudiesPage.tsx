import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Portfolio from "@/components/Portfolio";
import ArchitectureViewer from "@/components/ArchitectureViewer";
import OfficeNetworkVisualizer from "@/components/OfficeNetworkVisualizer";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import Testimonials from "@/components/Testimonials";
import CallToActionBand from "@/components/CallToActionBand";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getWhatsAppUrl } from "@/config/site";
import { 
  FolderGit2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Activity,
  ArrowUpRight,
  Hotel,
  Store,
  Utensils
} from "lucide-react";

export const CaseStudiesPage: React.FC = () => {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const showcaseStories = [
    {
      id: "after40",
      client: "After40 Hotel (Nairobi CBD)",
      industry: "Hospitality & Dining",
      icon: Hotel,
      badge: "40% Faster Web & Wi-Fi",
      challenge: "Slow website caused guest drop-off; front desk Wi-Fi lagged during peak check-in hours.",
      turnaround: "Re-engineered with sub-1.5s mobile speed, WhatsApp direct booking, and dedicated guest Wi-Fi VLANs.",
      results: [
        "+35% Direct WhatsApp guest room inquiries",
        "0% Payment till freezes at restaurant & front desk",
        "Sub-1.5s load speed on Safaricom 5G/4G",
      ],
    },
    {
      id: "samchi",
      client: "Samchi Telecommunications",
      industry: "Nationwide Retail Dealerships",
      icon: Building2,
      badge: "30+ Branches Supported",
      challenge: "Frequent computer and printer downtime across retail branches caused customer queues.",
      turnaround: "Daily SLA monitoring, automated cloud backup, and under 35-minute remote triage connection.",
      results: [
        "Daily support across 30+ nationwide retail shops",
        "< 35-min average emergency resolution",
        "Zero catastrophic hardware data loss in 2+ years",
      ],
    },
    {
      id: "snl",
      client: "SNL Lounge & Grill",
      industry: "Entertainment & Restaurant",
      icon: Utensils,
      badge: "200+ Guest Capacity",
      challenge: "Over 200 weekend guests drained Wi-Fi bandwidth, causing M-Pesa POS machines to time out.",
      turnaround: "Installed dual outdoor long-range antennas with an isolated, prioritized lane for payment tills.",
      results: [
        "Payment machines work 100% reliably even at full venue capacity",
        "Outdoor cabanas and dining patio covered with seamless roaming",
        "Automatic 5G failover kicks in if fiber internet cuts",
      ],
    },
    {
      id: "linens",
      client: "Linens & Decor Kenya",
      industry: "E-Commerce & Retail",
      icon: Store,
      badge: "3x WhatsApp Orders",
      challenge: "Heavy images made the catalog load in 7+ seconds on mobile phones, losing customer interest.",
      turnaround: "Optimized product images, implemented WebP compression, and integrated 1-click WhatsApp checkout.",
      results: [
        "Load speed slashed from 7.2s to 1.4s on 5G/4G",
        "Instant WhatsApp order button directly on every product",
        "First page Google search ranking for target keywords",
      ],
    },
  ];

  const currentStory = showcaseStories[activeStoryIdx];
  const CurrentIcon = currentStory.icon;

  const scrollToContent = () => {
    document.getElementById("case-studies-start")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-teal-500 selection:text-white">
      <Navigation />

      <main className="flex-1">
        {/* Full-Screen High-Impact 2-Column Hero */}
        <section className="relative min-h-[100dvh] pt-20 sm:pt-24 lg:pt-28 pb-4 flex flex-col justify-between bg-gradient-to-b from-muted/50 via-background to-muted/20 dark:from-navy-950 dark:via-navy-900/60 dark:to-navy-950 border-b border-border/80 overflow-hidden">>
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -left-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -right-20 w-96 lg:w-[600px] h-96 lg:h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 2-Column Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl my-auto py-2">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Left Column: Value Proposition & Impact Metrics */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-mono font-semibold border border-teal-500/20 shadow-sm">
                  <FolderGit2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Documented Turnarounds • 30+ Retail Branches &amp; Hotels</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-[1.15]">
                  Real Engineering Results: <br className="hidden md:inline" />
                  <span className="text-gradient-teal">Zero Downtime &amp; Faster Systems</span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-none sm:line-clamp-none">
                  We don’t just offer support — we fix root-cause architectural bottlenecks. Explore documented before-and-after cases of hotels, retail chains, and commercial venues across Kenya.
                </p>

                {/* 3 Live Metric Badges */}
                <div className="grid grid-cols-3 gap-2 text-left pt-0">
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">⚡ 40% Faster</span>
                    <span className="text-[11px] text-muted-foreground">Mobile Web Speed</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">🛡️ 0% Till Freezes</span>
                    <span className="text-[11px] text-muted-foreground">Isolated POS Lanes</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card/80 dark:bg-navy-900/80 border border-border/80">
                    <span className="text-teal-600 dark:text-teal-400 font-mono font-bold text-xs sm:text-sm block">📈 99.8% Uptime</span>
                    <span className="text-[11px] text-muted-foreground">Proactive SLA Checks</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href={getWhatsAppUrl("Hi Peter, I looked at your case studies and would like to discuss solving a similar challenge for my business.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg hover:shadow-glow transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Discuss Your Business Challenge</span>
                  </a>

                  <button
                    type="button"
                    onClick={scrollToContent}
                    className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <span>View Architecture Breakdowns</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Turnaround Showcase Widget */}
              <div className="mt-6 lg:mt-0 lg:col-span-5">
                <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-5 sm:p-6 space-y-4 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-foreground">Verified Client Turnaround Hub</span>
                    </div>
                    <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">{currentStory.badge}</span>
                  </div>

                  {/* 4 Client Tabs */}
                  <div className="grid grid-cols-2 gap-2">
                    {showcaseStories.map((st, idx) => {
                      const Icon = st.icon;
                      const isActive = activeStoryIdx === idx;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setActiveStoryIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            isActive
                              ? "bg-teal-500/15 border-teal-500 text-foreground font-bold shadow-sm"
                              : "bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-teal-500" : "text-muted-foreground"}`} />
                          <span className="text-xs truncate">{st.client.split("(")[0]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Story Card */}
                  <div className="p-4 rounded-2xl bg-muted/30 dark:bg-navy-950/70 border border-border/80 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                          <CurrentIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                            {currentStory.client}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">{currentStory.industry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Challenge:</strong> {currentStory.challenge}
                      </p>
                      <p className="text-muted-foreground pt-1">
                        <strong className="text-teal-600 dark:text-teal-400">Engineering Solution:</strong> {currentStory.turnaround}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider block">Verified Results:</span>
                      {currentStory.results.map((res, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href={getWhatsAppUrl(`Hi Peter, I read your case study for ${currentStory.client} and would like similar help.`, currentStory.client)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all hover:shadow-glow mt-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Request Proposal for My Business</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          {/* Viewport Bottom Scroll Down Bar */}
          <div className="pt-2 pb-2 text-center relative z-10">
            <button
              onClick={() => document.getElementById("content-start")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-muted-foreground hover:text-teal-500 dark:hover:text-teal-400 transition-colors group cursor-pointer"
            >
              <span>Scroll down to explore full details</span>
              <ChevronDown className="w-3.5 h-3.5 text-teal-500 animate-bounce group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </section>
        <div id="content-start" />

        {/* Content Anchor Marker */}
        <div id="case-studies-start" />

        {/* Verified Client Partners Bar */}
        <ClientLogoStrip />

        {/* Before vs After Interactive Architecture Diagram Viewer */}
        <section className="py-16 lg:py-24 bg-muted/20 dark:bg-navy-950/60 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Engineering Deep Dive
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Before vs. After: Architecture Turnarounds
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                See how we re-engineer failing flat networks into secure, VLAN-isolated architectures with automatic 5G/4G backup lines.
              </p>
            </div>

            <ArchitectureViewer />
          </div>
        </section>

        {/* Interactive Office Network Visualizer */}
        <section className="py-16 lg:py-20 bg-background dark:bg-navy-950 border-b border-border/70">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Interactive Simulator
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground">
                Why Payment Tills Freeze (And How We Fix It)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Toggle between an unmanaged network and a Peter-configured protected network to see the live difference:
              </p>
            </div>

            <OfficeNetworkVisualizer />
          </div>
        </section>

        {/* Full Case Studies Portfolio Grid */}
        <Portfolio />

        {/* Client Testimonials */}
        <Testimonials />

        {/* Pre-footer Call to Action */}
        <CallToActionBand />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CaseStudiesPage;

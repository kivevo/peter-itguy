import React, { useState, Suspense, lazy } from "react";
import InstantIssueWizard from "@/components/InstantIssueWizard";
import OfficeHardwarePlanner from "@/components/OfficeHardwarePlanner";
import { 
  Wrench, 
  Globe, 
  Calculator, 
  Server, 
  Terminal, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const WebsiteSpeedChecker = lazy(() => import("@/components/WebsiteSpeedChecker"));
const DowntimeCalculator = lazy(() => import("@/components/DowntimeCalculator"));
const InteractiveTerminal = lazy(() => import("@/components/InteractiveTerminal"));
const OfficeNetworkVisualizer = lazy(() => import("@/components/OfficeNetworkVisualizer"));

const LoadingCard = () => (
  <div className="h-72 rounded-3xl bg-muted/40 animate-pulse flex flex-col items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
    <Zap className="w-5 h-5 text-teal-500 animate-spin" />
    <span>Loading Interactive Tool Engine...</span>
  </div>
);

type ToolTab = "troubleshooter" | "speed_audit" | "downtime_calc" | "hardware_planner" | "terminal_speed";

export const InteractiveToolkitHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>("troubleshooter");

  const tools = [
    {
      id: "troubleshooter" as const,
      label: "Instant Diagnostic",
      shortLabel: "Troubleshoot",
      icon: Wrench,
      badge: "Instant Fix",
      badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      description: "Identify Wi-Fi drops, frozen PCs, or email issues in 3 clicks with immediate fix steps.",
    },
    {
      id: "speed_audit" as const,
      label: "Website Speed Audit",
      shortLabel: "Web Audit",
      icon: Globe,
      badge: "Live Score",
      badgeColor: "text-teal-500 bg-teal-500/10 border-teal-500/20",
      description: "Test your business website loading speed, mobile readiness, and lost WhatsApp lead score.",
    },
    {
      id: "downtime_calc" as const,
      label: "Downtime Cost Calculator",
      shortLabel: "Downtime Cost",
      icon: Calculator,
      badge: "Financial Impact",
      badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      description: "Calculate how many thousands of KES your business loses every hour of internet or POS downtime.",
    },
    {
      id: "hardware_planner" as const,
      label: "Office Hardware Planner",
      shortLabel: "Hardware Scope",
      icon: Server,
      badge: "Smart Scope",
      badgeColor: "text-sky-500 bg-sky-500/10 border-sky-500/20",
      description: "Configure access points, PoE switches, and CCTV cameras tailored for your office size.",
    },
    {
      id: "terminal_speed" as const,
      label: "Live Network Test Console",
      shortLabel: "Ping & Speed",
      icon: Terminal,
      badge: "Live Ping",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      description: "Run real-time latency ping tests and inspect simulated cloud gateway performance.",
    },
  ];

  return (
    <section id="interactive-tools" className="py-16 lg:py-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 dark:from-navy-950/80 dark:via-navy-900/60 dark:to-navy-950/80 border-y border-border/80 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-bold border border-teal-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Diagnostic &amp; Architecture Hub</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Self-Service IT Tools &amp; <br className="hidden sm:inline" />
            <span className="text-gradient-teal">System Diagnostics</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Test your systems, diagnose internet glitches, calculate downtime costs, or plan office hardware in seconds without waiting on hold.
          </p>
        </div>

        {/* Unified Tool Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTab === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? "bg-card dark:bg-navy-900 border-teal-500 shadow-md shadow-teal-500/10 ring-2 ring-teal-500/20"
                    : "bg-card/60 dark:bg-navy-900/60 border-border/70 hover:border-teal-500/40 hover:bg-card dark:hover:bg-navy-900"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-teal-500 text-white"
                          : "bg-muted dark:bg-navy-950 text-muted-foreground group-hover:text-teal-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border hidden sm:inline-block ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className={`font-heading font-bold text-xs sm:text-sm transition-colors line-clamp-1 ${
                      isSelected ? "text-teal-600 dark:text-teal-400" : "text-foreground"
                    }`}>
                      <span className="hidden sm:inline">{tool.label}</span>
                      <span className="sm:hidden">{tool.shortLabel}</span>
                    </h4>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-full h-1 bg-teal-500 rounded-full mt-2.5 animate-in fade-in duration-200" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Tool Active Surface Container */}
        <div className="rounded-3xl bg-card dark:bg-navy-900/90 border border-border shadow-xl p-4 sm:p-7 sm:py-8 transition-all duration-300">
          {activeTab === "troubleshooter" && (
            <div className="animate-in fade-in duration-200">
              <InstantIssueWizard />
            </div>
          )}

          {activeTab === "speed_audit" && (
            <div className="animate-in fade-in duration-200">
              <Suspense fallback={<LoadingCard />}>
                <WebsiteSpeedChecker />
              </Suspense>
            </div>
          )}

          {activeTab === "downtime_calc" && (
            <div className="animate-in fade-in duration-200">
              <Suspense fallback={<LoadingCard />}>
                <DowntimeCalculator />
              </Suspense>
            </div>
          )}

          {activeTab === "hardware_planner" && (
            <div className="animate-in fade-in duration-200">
              <OfficeHardwarePlanner />
            </div>
          )}

          {activeTab === "terminal_speed" && (
            <div className="animate-in fade-in duration-200 space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-1 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Live Interactive Terminal
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                  Nairobi Gateway &amp; Speed Diagnostics
                </h3>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                  Execute live simulation pings to After40 Hotel, Samchi Telecom, and SNL Venue networks.
                </p>
              </div>
              <Suspense fallback={<LoadingCard />}>
                <InteractiveTerminal />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveToolkitHub;

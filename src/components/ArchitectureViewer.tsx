import React, { useState } from "react";
import { Layers, ShieldAlert, ShieldCheck, ArrowRight, Zap, CheckCircle2, XCircle } from "lucide-react";

export const ArchitectureViewer: React.FC = () => {
  const [activeProject, setActiveProject] = useState<"after40" | "snl">("after40");
  const [viewState, setViewState] = useState<"after" | "before">("after");

  const projects = {
    after40: {
      title: "After40 Hotel (Nairobi CBD)",
      category: "Hotel Wi-Fi & Website Turnaround",
      before: {
        headline: "Broken Website for 6+ Months & Dropped Guest Wi-Fi",
        speed: "8.4s Slow Loading Speed",
        uptime: "Frequent Outages & Offline Booking Desk",
        points: [
          "Previous developer disappeared; website was completely broken and offline for half a year",
          "Guests streaming videos in rooms made front-desk payment computers freeze and lag",
          "Security cameras were unmonitored with zero live viewing on phones",
        ],
        badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      },
      after: {
        headline: "Super-Fast 1.1s Website & Strong Separated Wi-Fi",
        speed: "1.1s Mobile Load (40% Speed Boost)",
        uptime: "100% Reliable Uptime",
        points: [
          "Rebuilt modern mobile-first website with direct WhatsApp room booking buttons",
          "Separated guest Wi-Fi from front-desk computers so guest streaming never slows down staff",
          "Upgraded 16 HD security cameras with encrypted live phone viewing for management",
        ],
        badgeColor: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
      },
    },
    snl: {
      title: "SNL Lounge & Garden",
      category: "Restaurant Wi-Fi & Payment Protection",
      before: {
        headline: "Weekend POS Payment Freezes & Choked Internet",
        speed: "Slow & Unstable Speeds",
        uptime: "Payment Timeouts During Peak Saturday Nights",
        points: [
          "200+ weekend guests connecting to standard router choked the whole internet",
          "Waiters experienced repeated M-Pesa payment till timeouts during busy dinner rushes",
          "Wi-Fi signal dropped out in outdoor garden cabanas and dining areas",
        ],
        badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      },
      after: {
        headline: "Backup Internet & Protected Payment Tills",
        speed: "Guaranteed Fast Speed for Every Till",
        uptime: "Zero Payment Machine Freezes",
        points: [
          "Payment tills placed on an exclusive private channel that guest phones cannot slow down",
          "Installed outdoor weatherproof Wi-Fi antennas covering all garden dining cabanas",
          "Automatic 4G backup line so payment tills stay online even if main fiber cuts",
        ],
        badgeColor: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
      },
    },
  };

  const current = projects[activeProject];

  return (
    <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 lg:p-10 space-y-8">
      {/* Header & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Before &amp; After Comparison</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
            Real Turnarounds: How Peter Solves Complex Tech Headaches
          </h3>
        </div>

        {/* Project Switcher */}
        <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveProject("after40")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeProject === "after40"
                ? "bg-card dark:bg-navy-900 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            After40 Hotel
          </button>
          <button
            onClick={() => setActiveProject("snl")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeProject === "snl"
                ? "bg-card dark:bg-navy-900 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SNL Lounge & Garden
          </button>
        </div>
      </div>

      {/* State Toggle Tabs (Before vs After) */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setViewState("before")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            viewState === "before"
              ? "bg-rose-500/10 border-rose-500/40 text-rose-500 shadow-sm"
              : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Before Peter Fixed It (Problem State)</span>
        </button>

        <button
          onClick={() => setViewState("after")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            viewState === "after"
              ? "bg-teal-500/10 border-teal-500/40 text-teal-600 dark:text-teal-400 shadow-sm"
              : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>After Peter's Fix (Smooth &amp; Fast)</span>
        </button>
      </div>

      {/* Comparison Detail Box */}
      <div className="grid md:grid-cols-12 gap-8 items-center bg-muted/30 dark:bg-navy-950 p-6 sm:p-8 rounded-2xl border border-border/80">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                viewState === "after" ? current.after.badgeColor : current.before.badgeColor
              }`}
            >
              {viewState === "after" ? "✓ FIXED & RELIABLE" : "⚠️ COMMON BUSINESS BOTTLENECK"}
            </span>
            <span className="text-xs text-muted-foreground font-mono font-semibold">
              {current.title}
            </span>
          </div>

          <h4 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
            {viewState === "after" ? current.after.headline : current.before.headline}
          </h4>

          <div className="space-y-2 pt-2">
            {(viewState === "after" ? current.after.points : current.before.points).map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                {viewState === "after" ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                )}
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Box */}
        <div className="md:col-span-4 rounded-xl bg-card dark:bg-navy-900 border border-border p-5 space-y-3 text-center md:text-left">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Measurable Results:
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Website / Internet Speed:</div>
            <div
              className={`text-lg font-bold font-mono ${
                viewState === "after" ? "text-teal-600 dark:text-teal-400" : "text-rose-500 line-through"
              }`}
            >
              {viewState === "after" ? current.after.speed : current.before.speed}
            </div>
          </div>
          <div className="pt-2 border-t border-border/70">
            <div className="text-xs text-muted-foreground">System Reliability:</div>
            <div
              className={`text-sm font-bold font-mono ${
                viewState === "after" ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {viewState === "after" ? current.after.uptime : current.before.uptime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArchitectureViewer;

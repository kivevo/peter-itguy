import React, { useState } from "react";
import { Layers, ShieldAlert, ShieldCheck, ArrowRight, Zap, CheckCircle2, XCircle } from "lucide-react";

export const ArchitectureViewer: React.FC = () => {
  const [activeProject, setActiveProject] = useState<"after40" | "snl">("after40");
  const [viewState, setViewState] = useState<"after" | "before">("after");

  const projects = {
    after40: {
      title: "After40 Hotel (Nairobi CBD)",
      category: "Hotel Infrastructure & Web Turnaround",
      before: {
        headline: "6+ Months Defunct Website & Unmanaged Network",
        speed: "8.4s Average Load Time",
        uptime: "Repeated Outages & Offline Booking Desk",
        points: [
          "Defunct DNS and abandoned legacy CMS with corrupted database",
          "Single flat subnet: guest video streaming choked reception POS computers",
          "Unmonitored analog CCTV with dead cameras and zero remote access",
        ],
        badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      },
      after: {
        headline: "Sub-1.2s Fast Web Engine & UniFi VLAN Isolation",
        speed: "1.1s Mobile Load (40% Speed Boost)",
        uptime: "99.98% Monitored Uptime",
        points: [
          "Rebuilt modern mobile-first web frontend with direct WhatsApp reservation funnel",
          "Configured UniFi Enterprise APs with strict VLAN isolation for guest & admin traffic",
          "Deployed 16-channel IP CCTV surveillance with encrypted mobile remote monitoring",
        ],
        badgeColor: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
      },
    },
    snl: {
      title: "SNL Lounge & Garden",
      category: "High-Density Venue Network Engineering",
      before: {
        headline: "Weekend POS Freezes & Choked Guest Wi-Fi",
        speed: "Unmanaged Bandwidth Throttle",
        uptime: "POS Timeouts During M-Pesa Peak Hours",
        points: [
          "200+ weekend smartphone connections saturated single consumer router",
          "Waiters experienced repeated M-Pesa till payment timeouts during Saturday rushes",
          "Zero wireless roaming: dead zones in outdoor cabanas and garden dining",
        ],
        badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      },
      after: {
        headline: "Dual-WAN Load Balancing & Isolated POS VLAN",
        speed: "Dedicated Guaranteed Bandwidth per Till",
        uptime: "Zero POS Outages Since Cutover",
        points: [
          "MikroTik RouterOS with dual-ISP failover and dynamic QoS traffic shaping",
          "VLAN 10 strictly reserved for POS terminals with priority packet queuing",
          "Weatherproof outdoor UniFi APs delivering seamless coverage across all garden cabanas",
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
            <span>Architecture Transformation Lab</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
            Before vs. After: Technical Infrastructure Comparison
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
          <span>Initial State (Before Turnaround)</span>
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
          <span>Engineered State (After Peter's Overhaul)</span>
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
              {viewState === "after" ? "✓ OPTIMIZED & HARDENED" : "⚠ LEGACY BOTTLENECK"}
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

        {/* Metrics Badge Box */}
        <div className="md:col-span-4 rounded-xl bg-card dark:bg-navy-900 border border-border p-5 space-y-3 text-center md:text-left">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Key Performance Metrics:
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Speed Benchmark:</div>
            <div
              className={`text-lg font-bold font-mono ${
                viewState === "after" ? "text-teal-600 dark:text-teal-400" : "text-rose-500 line-through"
              }`}
            >
              {viewState === "after" ? current.after.speed : current.before.speed}
            </div>
          </div>
          <div className="pt-2 border-t border-border/70">
            <div className="text-xs text-muted-foreground">Uptime & Reliability:</div>
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

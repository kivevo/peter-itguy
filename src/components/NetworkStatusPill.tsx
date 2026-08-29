import React, { useState, useEffect } from "react";
import { Activity, Wifi, ShieldCheck, Clock, MapPin, Zap } from "lucide-react";

export const NetworkStatusPill: React.FC = () => {
  const [ping, setPing] = useState<number>(8);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    // Subtle realistic jitter between 6ms and 12ms to simulate live network heartbeat
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 4;
      setPing((prev) => {
        const next = Math.round(Math.max(6, Math.min(14, prev + delta)));
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold transition-all shadow-sm group"
        aria-label="Network System Operational Status"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden sm:inline">Nairobi CBD</span>
        <span className="tabular-nums font-semibold opacity-90">{ping}ms</span>
      </button>

      {/* Hover/Click Popover Diagnostic Card */}
      {showPopover && (
        <div
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-72 p-4 rounded-2xl bg-card dark:bg-navy-900 border border-border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-foreground"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <h4 className="font-heading font-bold text-xs">Live System Telemetry</h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                100% OPERATIONAL
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-500" />
                  <span>Primary Node</span>
                </span>
                <span className="font-semibold font-mono">Nairobi CBD / Westlands</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-teal-500" />
                  <span>Gateway Latency</span>
                </span>
                <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">{ping}ms (Low)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Remote SLA</span>
                </span>
                <span className="font-semibold font-mono">&lt; 15 Mins Response</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-500" />
                  <span>On-Site Visit</span>
                </span>
                <span className="font-semibold font-mono text-teal-600 dark:text-teal-400">Same-Day Available</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/70 text-center">
              <span className="text-[10px] text-muted-foreground font-mono">
                Peter Kivevo • Verified Kenyan IT Dispatch
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStatusPill;

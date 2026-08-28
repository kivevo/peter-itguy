import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { 
  Wifi, 
  CreditCard, 
  Video, 
  Laptop, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  MessageCircle, 
  Zap, 
  Layers,
  Smartphone
} from "lucide-react";

export const OfficeNetworkVisualizer: React.FC = () => {
  const [setupMode, setSetupMode] = useState<"bad" | "good">("good");
  const [activeZone, setActiveZone] = useState<string>("pos");

  const zones = [
    {
      id: "pos",
      title: "Payment Tills & M-Pesa",
      icon: CreditCard,
      badDesc: "⚠️ Customers streaming videos on guest Wi-Fi choke the internet, causing M-Pesa till payment timeouts during busy hours.",
      goodDesc: "✅ Put on an exclusive protected lane with guaranteed bandwidth. Zero payment machine freezes even with 200+ guests online.",
    },
    {
      id: "guest",
      title: "Guest & Customer Wi-Fi",
      icon: Smartphone,
      badDesc: "⚠️ All guest phones connect to the same router password as accounting computers, exposing company files and slowing down staff.",
      goodDesc: "✅ Separate, isolated guest Wi-Fi. Fast browsing for guests with zero access to company financial records or payment tills.",
    },
    {
      id: "office",
      title: "Staff & Office Computers",
      icon: Laptop,
      badDesc: "⚠️ Unmanaged laptops downloading large files make Zoom meetings freeze and email attachments fail to send.",
      goodDesc: "✅ Smart bandwidth balancing ensures crystal-clear Zoom video calls and fast cloud document syncing.",
    },
    {
      id: "cctv",
      title: "Security Cameras (CCTV)",
      icon: Video,
      badDesc: "⚠️ Old analog cameras with broken phone apps; video footage is blurry and drops out when internet is busy.",
      goodDesc: "✅ Clear HD security cameras with encrypted live video streaming on your smartphone from anywhere.",
    },
    {
      id: "backup",
      title: "Internet Failover (Backup Line)",
      icon: Wifi,
      badDesc: "⚠️ When the primary fiber internet is cut, the entire office loses connection and business stops completely.",
      goodDesc: "✅ Automatic 4G backup router switches over in seconds if the main fiber cuts, keeping your business running.",
    },
  ];

  const selectedZoneObj = zones.find((z) => z.id === activeZone) || zones[0];

  return (
    <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 lg:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Visual Diagram</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
            How Peter Protects Your Business Internet
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            See the difference between a standard messy setup vs. Peter's clean, protected network.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-2xl border border-border flex-shrink-0">
          <button
            type="button"
            onClick={() => setSetupMode("bad")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              setupMode === "bad"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Common Problem Setup</span>
          </button>
          <button
            type="button"
            onClick={() => setSetupMode("good")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              setupMode === "good"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Peter's Protected Setup</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram & Zone Selector */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Zone Buttons */}
        <div className="lg:col-span-6 space-y-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1">
            Click on an office area to see how it performs:
          </label>

          {zones.map((zone) => {
            const Icon = zone.icon;
            const isSelected = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZone(zone.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? setupMode === "good"
                      ? "bg-teal-500/15 border-teal-500 shadow-sm ring-1 ring-teal-500/50"
                      : "bg-rose-500/15 border-rose-500 shadow-sm ring-1 ring-rose-500/50"
                    : "bg-muted/40 dark:bg-navy-950/60 border-border/70 hover:border-border hover:bg-muted/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected
                        ? setupMode === "good"
                          ? "bg-teal-500 text-white"
                          : "bg-rose-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                      {zone.title}
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {setupMode === "good" ? "✓ Protected & Fast" : "⚠️ Vulnerable to Freezes"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {setupMode === "good" ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Card Explanation */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-4 ${
              setupMode === "good"
                ? "bg-teal-500/10 border-teal-500/30"
                : "bg-rose-500/10 border-rose-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded border ${
                  setupMode === "good"
                    ? "bg-teal-500/20 text-teal-800 dark:text-teal-200 border-teal-500/30"
                    : "bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/30"
                }`}
              >
                {setupMode === "good" ? "✓ PETER'S RECOMMENDED ARCHITECTURE" : "⚠️ TYPICAL OFFICE VULNERABILITY"}
              </span>
              <span className="text-xs font-mono font-bold text-foreground">
                {selectedZoneObj.title}
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
              {setupMode === "good"
                ? "Smooth, Fast & Fully Protected"
                : "Common Cause of Slowdowns & Freezes"}
            </h4>

            <p className="text-sm text-foreground leading-relaxed">
              {setupMode === "good" ? selectedZoneObj.goodDesc : selectedZoneObj.badDesc}
            </p>

            <div className="pt-3 border-t border-border/60 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                Why this matters for your business:
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {setupMode === "good"
                  ? "Your customers pay quickly, your staff work without interruptions, and your cameras stay online 24/7."
                  : "Every time your till freezes or Wi-Fi drops, customers get annoyed and your staff waste valuable working hours."}
              </p>
            </div>
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="p-4 rounded-2xl bg-muted/40 dark:bg-navy-950/70 border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Want Peter to audit your office Wi-Fi and protect your payment tills?
            </div>
            <a
              href={getWhatsAppUrl(
                `Hi Peter, I saw your Office Network Visualizer on your site. I'd like a site survey to fix our office Wi-Fi and protect our payment tills.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-sm flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Book Site Survey</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeNetworkVisualizer;

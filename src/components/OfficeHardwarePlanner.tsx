import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Wifi, 
  Video, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Users, 
  CheckCircle2, 
  Send, 
  MessageCircle, 
  Sparkles,
  ArrowRight,
  HardDrive
} from "lucide-react";

export const OfficeHardwarePlanner: React.FC = () => {
  const { toast } = useToast();
  const [officeSize, setOfficeSize] = useState<"small" | "medium" | "large" | "enterprise">("medium");
  const [staffCount, setStaffCount] = useState<"starter" | "standard" | "large">("standard");
  const [floors, setFloors] = useState<number>(1);
  const [cctvOption, setCctvOption] = useState<"none" | "4cam" | "8cam" | "16cam">("4cam");
  const [need4GFailover, setNeed4GFailover] = useState<boolean>(true);

  // Form submission state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculation Engine
  const calculatePlan = () => {
    let accessPoints = 1;
    let switchType = "8-Port Gigabit PoE+ Managed Switch";
    let switchCost = 14500;
    const apType = "Ubiquiti UniFi U6+ Long-Range Wi-Fi 6 AP";
    const apUnitCost = 18500;
    let routerType = "Mikrotik hEX Gigabit Multi-WAN Router";
    let routerCost = 9500;
    let cabinetType = "6U Wall-Mount Data Cabinet with PDU";
    let cabinetCost = 12000;
    let cablingMeters = 150;
    let cablingCost = 16000;
    let laborCost = 18000;

    if (officeSize === "small") {
      accessPoints = 1 * floors;
      switchType = "8-Port Gigabit PoE+ Switch (Ubiquiti/Hikvision)";
      switchCost = 12500;
      cablingMeters = 100 * floors;
      cablingCost = 12000 * floors;
      laborCost = 15000;
    } else if (officeSize === "medium") {
      accessPoints = 2 * floors;
      switchType = "16-Port Gigabit PoE+ Managed Switch";
      switchCost = 24500;
      cablingMeters = 250 * floors;
      cablingCost = 25000 * floors;
      laborCost = 28000;
    } else if (officeSize === "large") {
      accessPoints = 4 * floors;
      switchType = "24-Port Gigabit PoE+ Managed Switch";
      switchCost = 38000;
      routerType = "UniFi Dream Machine Pro / Mikrotik Cloud Router";
      routerCost = 26000;
      cabinetType = "9U Wall-Mount Server Cabinet with Patch Panel";
      cabinetCost = 18000;
      cablingMeters = 500 * floors;
      cablingCost = 48000 * floors;
      laborCost = 45000;
    } else if (officeSize === "enterprise") {
      accessPoints = 6 * floors;
      switchType = "48-Port Enterprise PoE+ Core Switch";
      switchCost = 65000;
      routerType = "Enterprise Dual-WAN Firewall & Bandwidth Shaper";
      routerCost = 36000;
      cabinetType = "12U Enterprise Server Rack Cabinet";
      cabinetCost = 26000;
      cablingMeters = 1000 * floors;
      cablingCost = 85000 * floors;
      laborCost = 75000;
    }

    if (staffCount === "large" && accessPoints < 3) {
      accessPoints += 1;
    }

    // CCTV specs
    let cctvHardware = "No security cameras selected";
    let cctvCost = 0;
    if (cctvOption === "4cam") {
      cctvHardware = "4x Hikvision 4K HD Infrared Dome/Bullet Cameras + 4CH NVR & 2TB Surveillance Hard Drive";
      cctvCost = 38500;
    } else if (cctvOption === "8cam") {
      cctvHardware = "8x Hikvision 4K Ultra-HD Cameras + 8CH NVR + 4TB Surveillance Storage & Mobile Phone App";
      cctvCost = 68000;
    } else if (cctvOption === "16cam") {
      cctvHardware = "16x 4K IP Security Cameras + 16CH Smart NVR + 8TB Storage & Remote Phone Streaming";
      cctvCost = 125000;
    }

    // 4G Failover
    const failoverCost = need4GFailover ? 14500 : 0;
    const failoverDesc = need4GFailover 
      ? "Automatic 4G SIM Backup Router (Switches seamlessly in 1 second when fiber line drops)"
      : "Not included";

    const totalApCost = accessPoints * apUnitCost;
    const estimatedTotal = totalApCost + switchCost + routerCost + cabinetCost + cablingCost + laborCost + cctvCost + failoverCost;

    return {
      accessPoints,
      apType,
      totalApCost,
      switchType,
      switchCost,
      routerType,
      routerCost,
      cabinetType,
      cabinetCost,
      cablingMeters,
      cablingCost,
      cctvHardware,
      cctvCost,
      failoverDesc,
      failoverCost,
      laborCost,
      estimatedTotal,
    };
  };

  const plan = calculatePlan();

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      toast({
        title: "Please enter your contact details",
        description: "Name and Phone number are required so Peter can assist you.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.addInquiry({
      source: "hardware_planner",
      name: clientName.trim(),
      phone: clientPhone.trim(),
      service: `Turnkey Office Setup Plan (Est: KES ${plan.estimatedTotal.toLocaleString()})`,
      details: `Office Plan: ${officeSize.toUpperCase()} (${floors} floor/s) | APs: ${plan.accessPoints}x ${plan.apType} | Switch: ${plan.switchType} | CCTV: ${cctvOption} | 4G Failover: ${need4GFailover ? "YES" : "NO"} | Est: KES ${plan.estimatedTotal.toLocaleString()}`,
    });

    setIsSubmitted(true);
    toast({
      title: "Equipment Plan Received! 🚀",
      description: `Thank you, ${clientName}! Peter has received your architectural plan and will contact ${clientPhone} with an official quote.`,
    });
  };

  const generatePlanWhatsApp = () => {
    return `Hi Peter,\n\nI used the Office Wi-Fi & CCTV Hardware Planner on your website:\n\n🏢 Office Specs: ${officeSize.toUpperCase()} (${floors} floor/s, ${staffCount} staff capacity)\n📡 Wi-Fi: ${plan.accessPoints}x ${plan.apType}\n🔌 Switch: ${plan.switchType}\n📹 Security: ${plan.cctvHardware}\n📶 4G Backup: ${need4GFailover ? "Yes (Auto-Failover)" : "No"}\n💰 Turnkey Range: KES ${plan.estimatedTotal.toLocaleString()}\n\nCould you review this hardware configuration and provide an on-site survey / written quote?`;
  };

  return (
    <section id="hardware-planner" className="py-20 lg:py-28 bg-card/60 dark:bg-navy-900/60 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Infrastructure Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Office Wi-Fi &amp; CCTV <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Hardware Architecture Planner</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Configure your office parameters below to instantly generate an enterprise-grade equipment list and turnkey implementation estimate.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Office Floor Area */}
            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>1. Office Size &amp; Layout</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "small", label: "Shop / Small Office", sub: "< 800 sq ft" },
                  { id: "medium", label: "Standard Office", sub: "1,000 – 2,500 sq ft" },
                  { id: "large", label: "Medium Enterprise", sub: "3,000 – 6,000 sq ft" },
                  { id: "enterprise", label: "Multi-Unit / Warehouse", sub: "7,000+ sq ft" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setOfficeSize(s.id as "small" | "medium" | "large" | "enterprise")}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      officeSize === s.id
                        ? "bg-teal-500/10 border-teal-500 ring-2 ring-teal-500/30 text-foreground font-bold"
                        : "bg-muted/40 hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{s.label}</p>
                    <span className="text-[11px] text-muted-foreground block">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Floors & Staff */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  <span>Number of Floors</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFloors(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        floors === num
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-muted/40 border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {num} {num === 1 ? "Floor" : "Floors"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-2">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-500" />
                  <span>Staff &amp; Devices</span>
                </label>
                <select
                  value={staffCount}
                  onChange={(e) => setStaffCount(e.target.value as "starter" | "standard" | "large")}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="starter">5 &ndash; 15 Devices (Starter)</option>
                  <option value="standard">15 &ndash; 40 Devices (Standard)</option>
                  <option value="large">40 &ndash; 100+ Devices (High Density)</option>
                </select>
              </div>
            </div>

            {/* 3. Security Cameras (CCTV) */}
            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>2. HD Security Cameras (CCTV)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "none", label: "No Cameras", sub: "Network only" },
                  { id: "4cam", label: "4x 4K Cameras", sub: "Reception & Tills" },
                  { id: "8cam", label: "8x 4K Cameras", sub: "Full Office Coverage" },
                  { id: "16cam", label: "16x 4K Cameras", sub: "Building / Warehouse" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCctvOption(c.id as "none" | "4cam" | "8cam" | "16cam")}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      cctvOption === c.id
                        ? "bg-teal-500/10 border-teal-500 ring-2 ring-teal-500/30 text-foreground font-bold"
                        : "bg-muted/40 hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{c.label}</p>
                    <span className="text-[11px] text-muted-foreground block">{c.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Automatic 4G Backup Failover */}
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-heading font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  <span>Automatic 4G Backup Router</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Prevents payment machine freezes when primary fiber drops.
                </p>
              </div>
              <input
                type="checkbox"
                checked={need4GFailover}
                onChange={(e) => setNeed4GFailover(e.target.checked)}
                className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Output Architecture BOM Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-navy-950 border border-teal-500/40 text-white shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                    Architected Bill of Materials
                  </span>
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                    Recommended Hardware Rig
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              {/* Itemized Hardware List */}
              <div className="space-y-3.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-navy-900/90 border border-border/70 flex items-start gap-3">
                  <Wifi className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs">
                      {plan.accessPoints}x {plan.apType}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Ceiling-mounted enterprise Wi-Fi 6 roaming antennas with isolated Guest &amp; Till channels.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-900/90 border border-border/70 flex items-start gap-3">
                  <Server className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs">
                      {plan.switchType}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Dedicated PoE power for all Wi-Fi APs &amp; CCTV cameras without power bricks.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-900/90 border border-border/70 flex items-start gap-3">
                  <HardDrive className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs">
                      {plan.routerType} + {plan.cabinetType}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Gigabit bandwidth limiter, secure firewall rules, and wall-mounted lockable cabinet.
                    </span>
                  </div>
                </div>

                {cctvOption !== "none" && (
                  <div className="p-3 rounded-xl bg-navy-900/90 border border-teal-500/30 flex items-start gap-3">
                    <Video className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-emerald-300 text-xs">
                        {plan.cctvHardware}
                      </p>
                      <span className="text-[11px] text-slate-400 block">
                        Live 24/7 video monitoring accessible directly on manager's smartphone.
                      </span>
                    </div>
                  </div>
                )}

                {need4GFailover && (
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/40 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-teal-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-teal-300 text-xs">
                        Automatic 4G Backup Failover Gateway
                      </p>
                      <span className="text-[11px] text-slate-300 block">
                        Keeps card machines and staff online even when main fiber provider has an outage.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Summary */}
              <div className="pt-4 border-t border-border/80 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Estimated Turnkey Implementation:</span>
                  <span className="text-teal-400 font-bold">Hardware + Cabling + Labor</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-teal-400 font-mono">
                    KES {plan.estimatedTotal.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Turnkey Package Range
                  </span>
                </div>
              </div>

              {/* Dispatch Action */}
              {isSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-1 text-xs animate-in fade-in">
                  <p className="font-bold flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Plan Received by Peter!</span>
                  </p>
                  <p className="text-slate-300">
                    Peter will reach out to <strong>{clientPhone}</strong> with a formal itemized quotation.
                  </p>
                </div>
              ) : showDispatchForm ? (
                <form onSubmit={handlePlanSubmit} className="p-4 rounded-2xl bg-navy-900 border border-border space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Send Plan to Peter for Site Survey</span>
                    <button
                      type="button"
                      onClick={() => setShowDispatchForm(false)}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Your Name *"
                      className="px-3 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Phone / WhatsApp *"
                      className="px-3 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Configuration to Peter</span>
                  </button>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDispatchForm(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request On-Site Survey</span>
                  </button>

                  <a
                    href={getWhatsAppUrl(generatePlanWhatsApp())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all hover:shadow-glow flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeHardwarePlanner;

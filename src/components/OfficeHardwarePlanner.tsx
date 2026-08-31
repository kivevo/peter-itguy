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
  HardDrive,
  FileCheck
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
    const apType = "Ubiquiti UniFi U6+ Long-Range Wi-Fi 6 AP";
    let routerType = "Mikrotik hEX Gigabit Multi-WAN Router";
    let cabinetType = "6U Wall-Mount Data Cabinet with PDU";
    let cablingMeters = 150;

    if (officeSize === "small") {
      accessPoints = 1 * floors;
      switchType = "8-Port Gigabit PoE+ Switch (Ubiquiti/Hikvision)";
      cablingMeters = 100 * floors;
    } else if (officeSize === "medium") {
      accessPoints = 2 * floors;
      switchType = "16-Port Gigabit PoE+ Managed Switch";
      cablingMeters = 250 * floors;
    } else if (officeSize === "large") {
      accessPoints = 4 * floors;
      switchType = "24-Port Gigabit PoE+ Managed Switch";
      routerType = "UniFi Dream Machine Pro / Mikrotik Cloud Router";
      cabinetType = "9U Wall-Mount Server Cabinet with Patch Panel";
      cablingMeters = 500 * floors;
    } else if (officeSize === "enterprise") {
      accessPoints = 6 * floors;
      switchType = "48-Port Enterprise PoE+ Core Switch";
      routerType = "Enterprise Dual-WAN Firewall & Bandwidth Shaper";
      cabinetType = "12U Enterprise Server Rack Cabinet";
      cablingMeters = 1000 * floors;
    }

    if (staffCount === "large" && accessPoints < 3) {
      accessPoints += 1;
    }

    // CCTV specs
    let cctvHardware = "No security cameras selected";
    if (cctvOption === "4cam") {
      cctvHardware = "4x Hikvision 4K HD Infrared Dome/Bullet Cameras + 4CH NVR & 2TB Surveillance Storage";
    } else if (cctvOption === "8cam") {
      cctvHardware = "8x Hikvision 4K Ultra-HD Cameras + 8CH NVR + 4TB Surveillance Storage & Mobile App";
    } else if (cctvOption === "16cam") {
      cctvHardware = "16x 4K IP Security Cameras + 16CH Smart NVR + 8TB Storage & Remote Phone Streaming";
    }

    const failoverDesc = need4GFailover 
      ? "Automatic 5G/4G SIM Backup Router (Switches seamlessly in 1 second when fiber cuts)"
      : "Not included";

    return {
      accessPoints,
      apType,
      switchType,
      routerType,
      cabinetType,
      cablingMeters,
      cctvHardware,
      failoverDesc,
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
      service: `Turnkey Office Hardware Plan: ${officeSize.toUpperCase()}`,
      details: `Office Plan: ${officeSize.toUpperCase()} (${floors} floor/s) | APs: ${plan.accessPoints}x ${plan.apType} | Switch: ${plan.switchType} | CCTV: ${cctvOption} | 5G/4G Failover: ${need4GFailover ? "YES" : "NO"}`,
    });

    setIsSubmitted(true);
    toast({
      title: "Equipment Plan Received! 🚀",
      description: `Thank you, ${clientName}! Peter has received your architectural plan and will contact ${clientPhone} with an official quote.`,
    });
  };

  const generatePlanWhatsApp = () => {
    return `Hi Peter,\n\nI used the Office Wi-Fi & CCTV Hardware Planner on your website:\n\n🏢 Office Specs: ${officeSize.toUpperCase()} (${floors} floor/s, ${staffCount} staff capacity)\n📡 Wi-Fi: ${plan.accessPoints}x ${plan.apType}\n🔌 Switch: ${plan.switchType}\n📹 Security: ${plan.cctvHardware}\n📶 4G Backup: ${need4GFailover ? "Yes (Auto-Failover)" : "No"}\n\nCould you review this hardware configuration and provide an on-site survey / written proposal?`;
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
            Configure your office footprint to get a recommended enterprise Bill of Materials (BOM) including Ubiquiti Wi-Fi, PoE Switches, and CCTV cameras.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Inputs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1: Office Floor Size */}
            <div className="p-6 rounded-3xl bg-card dark:bg-navy-900 border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-foreground font-heading font-bold text-sm">
                <Building2 className="w-4 h-4 text-teal-500" />
                <span>1. Select Office Scale &amp; Footprint:</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "small", label: "Small Office", sub: "Under 1,500 sq ft (1–10 Staff)" },
                  { id: "medium", label: "Standard Office", sub: "1,500 – 4,000 sq ft (10–30 Staff)" },
                  { id: "large", label: "Large Office / Floor", sub: "4,000 – 10,000 sq ft (30–80 Staff)" },
                  { id: "enterprise", label: "Multi-Floor / Hub", sub: "10,000+ sq ft (80+ Staff)" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setOfficeSize(s.id as "small" | "medium" | "large" | "enterprise")}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      officeSize === s.id
                        ? "bg-teal-600 text-white border-teal-600 font-bold shadow-sm"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border"
                    }`}
                  >
                    <span className="font-heading block">{s.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${officeSize === s.id ? "text-teal-100" : "text-muted-foreground"}`}>
                      {s.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Floors Count & Staff Load */}
            <div className="p-6 rounded-3xl bg-card dark:bg-navy-900 border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-foreground font-heading font-bold text-sm">
                <Users className="w-4 h-4 text-teal-500" />
                <span>2. Floors &amp; Concurrency Load:</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Number of Floors:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFloors(f)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          floors === f
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-muted text-foreground border-border hover:bg-muted/80"
                        }`}
                      >
                        {f} {f === 1 ? "Floor" : "Floors"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    Staff &amp; Guest Density:
                  </label>
                  <select
                    value={staffCount}
                    onChange={(e) => setStaffCount(e.target.value as "starter" | "standard" | "large")}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="starter">Light (1–15 Connected Devices)</option>
                    <option value="standard">Moderate (15–50 Devices)</option>
                    <option value="large">Heavy / High Traffic (50+ Devices)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: CCTV & 4G Failover Options */}
            <div className="p-6 rounded-3xl bg-card dark:bg-navy-900 border border-border/80 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-foreground font-heading font-bold text-sm">
                <Video className="w-4 h-4 text-teal-500" />
                <span>3. Security Cameras &amp; Internet Failover:</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">
                    HD Security Cameras (CCTV):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "none", label: "No CCTV" },
                      { id: "4cam", label: "4x 4K Cameras" },
                      { id: "8cam", label: "8x 4K Cameras" },
                      { id: "16cam", label: "16x 4K Cameras" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCctvOption(c.id as "none" | "4cam" | "8cam" | "16cam")}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          cctvOption === c.id
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-muted text-foreground border-border hover:bg-muted/80"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      Automatic 5G/4G Backup Failover Gateway
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Switches in 1 sec if fiber cuts so payment tills stay online.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNeed4GFailover(!need4GFailover)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      need4GFailover
                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/40"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {need4GFailover ? "✓ Included" : "+ Add Backup"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architected Bill of Materials (BOM) Output */}
          <div className="lg:col-span-6 sticky top-28 space-y-6">
            <div className="rounded-3xl bg-navy-950 border border-teal-500/40 p-6 sm:p-8 space-y-5 shadow-2xl text-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block">
                    Recommended Architecture
                  </span>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Hardware Bill of Materials (BOM)
                  </h3>
                </div>
                <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Server className="w-5 h-5" />
                </div>
              </div>

              {/* Hardware List */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-navy-900/90 border border-border/70 flex items-start gap-3">
                  <Wifi className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs">
                      {plan.accessPoints}x {plan.apType}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Multi-SSID with Isolated Guest Wi-Fi &amp; Fast Roaming.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-900/90 border border-border/70 flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-xs">
                      1x {plan.switchType}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Dedicated PoE power for all Wi-Fi APs &amp; CCTV cameras without messy adapters.
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
                        Automatic 5G/4G Backup Failover Gateway
                      </p>
                      <span className="text-[11px] text-slate-300 block">
                        Keeps card machines and staff online even when main fiber provider has an outage.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Turnkey Scope Deliverables Note */}
              <div className="p-3.5 rounded-2xl bg-teal-950/60 border border-teal-500/30 space-y-1.5">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  Turnkey Installation &amp; Service Scope:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Includes ~{plan.cablingMeters}m pure copper Cat6 cabling, rack organization, bandwidth isolation for payment tills, and on-site staff training.
                </p>
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
                    <span>Request On-Site Survey &amp; Quote</span>
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

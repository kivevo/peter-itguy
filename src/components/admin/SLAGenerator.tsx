import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Printer,
  Plus,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Clock,
  Layers,
  Star,
  ChevronDown,
  ChevronUp,
  Download,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

type SLATier = "bronze" | "silver" | "platinum" | "custom";

interface SLAContract {
  id: string;
  tier: SLATier;
  clientCompany: string;
  clientContactName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientKraPin: string;
  pcCount: number;
  monthlyFee: number;
  startDate: string;
  contractDuration: 6 | 12 | 24;
  customScope: string;
  includeWifi: boolean;
  includeCctv: boolean;
  includeCloud: boolean;
  includeCyber: boolean;
  createdAt: string;
}

// ────────────────────────────────────────────────────────────────────
// Tier Presets
// ────────────────────────────────────────────────────────────────────

const TIER_PRESETS: Record<
  SLATier,
  {
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
    responseTime: string;
    onSiteFreq: string;
    pcRange: string;
    basePrice: number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    features: string[];
  }
> = {
  bronze: {
    name: "Bronze Retainer",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    responseTime: "2-Hour Remote Response",
    onSiteFreq: "Bi-Weekly Preventive Visit",
    pcRange: "1–10 PCs",
    basePrice: 25000,
    icon: Shield,
    features: [
      "2-hour remote troubleshooting SLA",
      "Bi-weekly preventive maintenance visit",
      "Basic Wi-Fi monitoring & optimization",
      "Monthly health report",
      "Email & WhatsApp helpdesk",
      "Priority scheduling for ad-hoc jobs",
    ],
  },
  silver: {
    name: "Silver Retainer",
    color: "text-slate-300",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/30",
    responseTime: "30-Minute Remote Response",
    onSiteFreq: "Weekly On-Site Visit",
    pcRange: "10–30 PCs",
    basePrice: 45000,
    icon: Layers,
    features: [
      "30-minute remote response SLA",
      "Weekly on-site preventive maintenance",
      "Advanced Wi-Fi & network health checks",
      "Cloud backup audit (monthly)",
      "CCTV & access control monitoring",
      "Patch management & software updates",
      "Detailed monthly SLA performance report",
      "Dedicated WhatsApp support line",
    ],
  },
  platinum: {
    name: "Enterprise Platinum",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    responseTime: "15-Minute Emergency SLA",
    onSiteFreq: "Daily Availability + 24/7 On-Call",
    pcRange: "30–60+ PCs",
    basePrice: 85000,
    icon: Star,
    features: [
      "15-minute emergency response SLA",
      "Daily on-site availability (Mon–Fri)",
      "24/7 on-call emergency support (Sat–Sun)",
      "Full network infrastructure management",
      "Monthly cybersecurity vulnerability scans",
      "Server & domain administration",
      "VoIP & PABX system management",
      "CCTV, access control & alarm management",
      "Cloud (Google Workspace / Microsoft 365) admin",
      "Quarterly executive IT review meeting",
      "Unlimited ad-hoc on-site service calls",
    ],
  },
  custom: {
    name: "Custom Retainer",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    responseTime: "Custom SLA",
    onSiteFreq: "Custom Schedule",
    pcRange: "Any",
    basePrice: 0,
    icon: Edit3,
    features: [],
  },
};

// ────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────

export const SLAGenerator: React.FC = () => {
  const { toast } = useToast();

  // Saved contracts (in-memory for session; could be persisted in dataStorage)
  const [contracts, setContracts] = useState<SLAContract[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewContract, setPreviewContract] = useState<SLAContract | null>(null);

  // Form state
  const [form, setForm] = useState<Omit<SLAContract, "id" | "createdAt">>({
    tier: "silver",
    clientCompany: "",
    clientContactName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    clientKraPin: "",
    pcCount: 15,
    monthlyFee: 45000,
    startDate: new Date().toISOString().slice(0, 10),
    contractDuration: 12,
    customScope: "",
    includeWifi: true,
    includeCctv: false,
    includeCloud: false,
    includeCyber: false,
  });

  // ──── Handlers ────

  const handleTierChange = (tier: SLATier) => {
    const preset = TIER_PRESETS[tier];
    setForm((f) => ({ ...f, tier, monthlyFee: preset.basePrice }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientCompany || !form.clientContactName) {
      toast({ title: "Missing Fields", description: "Please fill in at least client company and contact name.", variant: "destructive" });
      return;
    }
    const newContract: SLAContract = {
      ...form,
      id: `SLA-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
    };
    setContracts((prev) => [newContract, ...prev]);
    setShowForm(false);
    setPreviewContract(newContract);
    toast({ title: "✅ SLA Contract Generated", description: `${TIER_PRESETS[form.tier].name} contract for ${form.clientCompany} is ready to print.` });
  };

  const handleDelete = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
    if (previewContract?.id === id) setPreviewContract(null);
    toast({ title: "Contract Deleted" });
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);

  const tier = TIER_PRESETS[form.tier];

  // ──── Print ────

  const handlePrint = (contract: SLAContract) => {
    const p = TIER_PRESETS[contract.tier];
    const endDate = new Date(contract.startDate);
    endDate.setMonth(endDate.getMonth() + contract.contractDuration);

    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IT Retainer SLA – ${contract.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; font-size: 12px; line-height: 1.6; }
          .page { padding: 40px 50px; max-width: 900px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #0d9488; margin-bottom: 28px; }
          .logo-block h1 { font-size: 22px; font-weight: 900; color: #0d9488; }
          .logo-block p { font-size: 10px; color: #666; }
          .contract-meta { text-align: right; }
          .contract-meta .contract-id { font-size: 20px; font-weight: 800; font-family: monospace; color: #1a1a2e; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; margin-top: 4px; }
          h2 { font-size: 16px; font-weight: 800; margin-bottom: 12px; color: #0d9488; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
          .info-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
          .info-block .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 700; margin-bottom: 2px; }
          .info-block .value { font-weight: 600; font-size: 12px; }
          .feature-list { margin: 0; padding: 0; list-style: none; }
          .feature-list li { padding: 5px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 8px; }
          .feature-list li::before { content: "✓"; color: #0d9488; font-weight: 900; }
          .terms { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 10.5px; }
          .terms p { margin-bottom: 6px; }
          .sign-block { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; }
          .sign-area { padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; }
          .sign-area .sign-line { border-top: 1px solid #1a1a2e; margin: 30px 0 6px; }
          .sign-area .sign-label { font-size: 10px; color: #666; }
          .footer-note { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          .highlight-box { background: linear-gradient(135deg, #0d9488, #0891b2); color: white; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
          .highlight-box .fee { font-size: 28px; font-weight: 900; }
          .highlight-box .tier-name { font-size: 12px; opacity: 0.9; }
          @media print { body { -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="logo-block">
              <h1>KRENOVATE SYSTEMS</h1>
              <p>IT Infrastructure & Managed Services · Nairobi, Kenya</p>
              <p>KRA PIN: P051892401K · +254 700 000 000</p>
              <p>krenovate.com · info@krenovate.com</p>
            </div>
            <div class="contract-meta">
              <div style="font-size:10px;color:#666;">CONTRACT REFERENCE</div>
              <div class="contract-id">${contract.id}</div>
              <div class="badge">✓ IT MANAGED SERVICES AGREEMENT</div>
              <div style="margin-top:8px;font-size:10px;color:#666;">Generated: ${new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>

          <div class="highlight-box">
            <div>
              <div class="tier-name">${p.name.toUpperCase()} · ${contract.contractDuration}-MONTH AGREEMENT</div>
              <div style="font-size:12px;margin-top:4px;opacity:0.85;">${p.responseTime} · ${p.onSiteFreq}</div>
            </div>
            <div class="fee">${fmt(contract.monthlyFee)}<span style="font-size:12px;font-weight:400;">/month</span></div>
          </div>

          <div class="two-col">
            <div>
              <h2>Service Provider</h2>
              <div class="info-block">
                <div class="label">Company</div><div class="value">Peter Kivevo John / Krenovate Systems</div>
                <div class="label" style="margin-top:10px;">KRA PIN</div><div class="value" style="font-family:monospace;">P051892401K</div>
                <div class="label" style="margin-top:10px;">Address</div><div class="value">Nairobi, Kenya</div>
                <div class="label" style="margin-top:10px;">Phone</div><div class="value">+254 700 000 000</div>
              </div>
            </div>
            <div>
              <h2>Client Organization</h2>
              <div class="info-block">
                <div class="label">Company</div><div class="value">${contract.clientCompany}</div>
                <div class="label" style="margin-top:10px;">Contact Person</div><div class="value">${contract.clientContactName}</div>
                ${contract.clientKraPin ? `<div class="label" style="margin-top:10px;">KRA PIN</div><div class="value" style="font-family:monospace;">${contract.clientKraPin}</div>` : ""}
                <div class="label" style="margin-top:10px;">Address</div><div class="value">${contract.clientAddress || "—"}</div>
                <div class="label" style="margin-top:10px;">Phone</div><div class="value">${contract.clientPhone}</div>
              </div>
            </div>
          </div>

          <div class="two-col">
            <div>
              <h2>Contract Period</h2>
              <div class="info-block">
                <div class="label">Start Date</div><div class="value">${new Date(contract.startDate).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</div>
                <div class="label" style="margin-top:10px;">End Date</div><div class="value">${endDate.toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</div>
                <div class="label" style="margin-top:10px;">Duration</div><div class="value">${contract.contractDuration} Months</div>
                <div class="label" style="margin-top:10px;">Devices Covered</div><div class="value">${contract.pcCount} PC/Server Units</div>
              </div>
            </div>
            <div>
              <h2>Billing Summary</h2>
              <div class="info-block">
                <div class="label">Monthly Retainer Fee</div><div class="value" style="font-size:16px;color:#0d9488;font-weight:900;">${fmt(contract.monthlyFee)}</div>
                <div class="label" style="margin-top:10px;">Total Contract Value</div><div class="value">${fmt(contract.monthlyFee * contract.contractDuration)}</div>
                <div class="label" style="margin-top:10px;">Payment Terms</div><div class="value">Invoice issued 1st of each month. Due within 7 days. M-Pesa Paybill: 000000 or Bank Transfer.</div>
              </div>
            </div>
          </div>

          <h2>Scope of Services</h2>
          ${
            contract.tier !== "custom"
              ? `<ul class="feature-list">${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>`
              : `<div class="info-block"><p>${contract.customScope || "Custom scope as agreed between parties."}</p></div>`
          }
          ${contract.includeWifi ? "<p style='margin-top:8px;'>✓ Wi-Fi Infrastructure Monitoring & Optimization included.</p>" : ""}
          ${contract.includeCctv ? "<p>✓ CCTV & Access Control Monitoring included.</p>" : ""}
          ${contract.includeCloud ? "<p>✓ Cloud Services Administration (Google Workspace / M365) included.</p>" : ""}
          ${contract.includeCyber ? "<p>✓ Monthly Cybersecurity Vulnerability Scans included.</p>" : ""}

          <div class="terms" style="margin-top:24px;">
            <h2 style="color:#1a1a2e;">Terms & Conditions</h2>
            <p><strong>1. Payment:</strong> Monthly invoices are due within 7 days of issue. Late payments attract 1.5% interest per month. Service may be suspended after 14 days overdue.</p>
            <p><strong>2. Termination:</strong> Either party may terminate this agreement with 30 days written notice. Early termination by client requires payment of 50% of remaining contract value.</p>
            <p><strong>3. Scope:</strong> Services are limited to the agreed scope above. Additional hardware replacement parts are billable at cost + 15% handling fee.</p>
            <p><strong>4. Liability:</strong> Krenovate Systems liability is limited to the monthly retainer fee. We are not liable for data loss resulting from pre-existing conditions or natural disasters.</p>
            <p><strong>5. Confidentiality:</strong> Both parties agree to keep all business and technical information strictly confidential.</p>
            <p><strong>6. Governing Law:</strong> This agreement is governed by the laws of the Republic of Kenya. Any disputes shall be resolved through mutual negotiation or Nairobi arbitration.</p>
          </div>

          <div class="sign-block">
            <div class="sign-area">
              <div style="font-weight:700;margin-bottom:4px;">SERVICE PROVIDER</div>
              <div>Peter Kivevo John</div>
              <div style="color:#666;font-size:10px;">Krenovate Systems · Lead Engineer</div>
              <div class="sign-line"></div>
              <div class="sign-label">Signature &amp; Date</div>
              <div style="margin-top:12px;font-size:10px;color:#666;">Company Stamp (if applicable)</div>
              <div style="border:1px dashed #ccc;height:50px;margin-top:8px;border-radius:4px;"></div>
            </div>
            <div class="sign-area">
              <div style="font-weight:700;margin-bottom:4px;">CLIENT REPRESENTATIVE</div>
              <div>${contract.clientContactName}</div>
              <div style="color:#666;font-size:10px;">${contract.clientCompany}</div>
              <div class="sign-line"></div>
              <div class="sign-label">Signature &amp; Date</div>
              <div style="margin-top:12px;font-size:10px;color:#666;">Company Stamp / Official Seal</div>
              <div style="border:1px dashed #ccc;height:50px;margin-top:8px;border-radius:4px;"></div>
            </div>
          </div>

          <div class="footer-note">
            This is a legally binding IT Managed Services Agreement between the parties above. Contract ID: ${contract.id} · Krenovate Systems © ${new Date().getFullYear()} · Nairobi, Kenya · KRA PIN: P051892401K
          </div>
        </div>
        <script>window.onload=()=>window.print();</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  // ──── Render ────

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold">IT Retainer & SLA Contract Generator</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate professional monthly IT retainer contracts for corporate clients with full legal terms and printable signature blocks.
          </p>
        </div>
        <button
          id="sla-new-contract-btn"
          onClick={() => { setShowForm(true); setPreviewContract(null); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          New Contract
        </button>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {(["bronze", "silver", "platinum"] as SLATier[]).map((t) => {
          const p = TIER_PRESETS[t];
          const Icon = p.icon;
          const count = contracts.filter((c) => c.tier === t).length;
          return (
            <div
              key={t}
              className={`p-5 rounded-2xl border ${p.borderColor} ${p.bgColor} cursor-pointer hover:scale-[1.02] transition-transform`}
              onClick={() => { handleTierChange(t); setShowForm(true); setPreviewContract(null); }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${p.color}`} />
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-muted-foreground">
                    {count} active
                  </span>
                )}
              </div>
              <div className={`font-extrabold text-sm mb-1 ${p.color}`}>{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.pcRange} · {p.responseTime}</div>
              <div className={`text-lg font-black mt-2 ${p.color}`}>
                {p.basePrice > 0 ? `KES ${p.basePrice.toLocaleString()}` : "Custom"}<span className="text-xs font-normal text-muted-foreground">/mo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Contract Form */}
      {showForm && (
        <div className="rounded-3xl border border-border bg-card shadow-xl p-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-lg">New IT Retainer Contract</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground text-sm">✕ Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tier Selector */}
            <div>
              <label className="text-xs font-mono font-bold text-muted-foreground block mb-2">CONTRACT TIER</label>
              <div className="grid grid-cols-4 gap-2">
                {(["bronze", "silver", "platinum", "custom"] as SLATier[]).map((t) => {
                  const p = TIER_PRESETS[t];
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTierChange(t)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        form.tier === t ? `${p.borderColor} ${p.bgColor} ${p.color}` : "border-border text-muted-foreground hover:border-teal-500/40"
                      }`}
                    >
                      {p.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-xs font-mono font-bold text-muted-foreground block">CLIENT ORGANIZATION</label>
                <input
                  id="sla-client-company"
                  type="text"
                  required
                  placeholder="Company Name *"
                  value={form.clientCompany}
                  onChange={(e) => setForm({ ...form, clientCompany: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  id="sla-contact-name"
                  type="text"
                  required
                  placeholder="Contact Person Name *"
                  value={form.clientContactName}
                  onChange={(e) => setForm({ ...form, clientContactName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  id="sla-client-phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.clientPhone}
                  onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  id="sla-client-email"
                  type="email"
                  placeholder="Email Address"
                  value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-mono font-bold text-muted-foreground block">CONTRACT PARAMETERS</label>
                <input
                  id="sla-client-address"
                  type="text"
                  placeholder="Physical Address"
                  value={form.clientAddress}
                  onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  id="sla-client-kra-pin"
                  type="text"
                  placeholder="Client KRA PIN (optional)"
                  value={form.clientKraPin}
                  onChange={(e) => setForm({ ...form, clientKraPin: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">PCs / Devices</label>
                    <input
                      id="sla-pc-count"
                      type="number"
                      min={1}
                      value={form.pcCount}
                      onChange={(e) => setForm({ ...form, pcCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Monthly Fee (KES)</label>
                    <input
                      id="sla-monthly-fee"
                      type="number"
                      min={0}
                      value={form.monthlyFee}
                      onChange={(e) => setForm({ ...form, monthlyFee: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                    <input
                      id="sla-start-date"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Duration</label>
                    <select
                      id="sla-duration"
                      value={form.contractDuration}
                      onChange={(e) => setForm({ ...form, contractDuration: parseInt(e.target.value) as 6 | 12 | 24 })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months</option>
                      <option value={24}>24 Months</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <div>
              <label className="text-xs font-mono font-bold text-muted-foreground block mb-3">ADDITIONAL SCOPE ADD-ONS</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: "includeWifi", label: "Wi-Fi Monitoring" },
                  { key: "includeCctv", label: "CCTV Management" },
                  { key: "includeCloud", label: "Cloud Admin" },
                  { key: "includeCyber", label: "Cyber Scans" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[opt.key as keyof typeof form] as boolean}
                      onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                      className="w-4 h-4 rounded accent-teal-500"
                    />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Scope */}
            {form.tier === "custom" && (
              <div>
                <label className="text-xs font-mono font-bold text-muted-foreground block mb-2">CUSTOM SCOPE DESCRIPTION</label>
                <textarea
                  id="sla-custom-scope"
                  rows={4}
                  placeholder="Describe the agreed scope of services in detail..."
                  value={form.customScope}
                  onChange={(e) => setForm({ ...form, customScope: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                />
              </div>
            )}

            {/* Preview Summary */}
            <div className={`p-4 rounded-xl border ${tier.borderColor} ${tier.bgColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold text-sm ${tier.color}`}>{tier.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{form.clientCompany || "—"} · {form.pcCount} devices · {form.contractDuration} months</div>
                </div>
                <div className={`text-xl font-black ${tier.color}`}>
                  KES {form.monthlyFee.toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground">/mo</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Total Contract Value: <span className="font-bold text-foreground">KES {(form.monthlyFee * form.contractDuration).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                id="sla-generate-btn"
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all"
              >
                <FileText className="w-4 h-4" />
                Generate Contract
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {previewContract && (
        <div className="rounded-3xl border border-emerald-500/30 bg-card shadow-xl p-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h3 className="font-extrabold text-lg">Contract Ready: {previewContract.id}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1 ml-9">{TIER_PRESETS[previewContract.tier].name} · {previewContract.clientCompany}</p>
            </div>
            <button
              id="sla-print-preview-btn"
              onClick={() => handlePrint(previewContract)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold text-sm hover:opacity-90 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Download PDF
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Contract ID", value: previewContract.id, icon: <Hash className="w-4 h-4 text-teal-400" /> },
              { label: "Monthly Fee", value: fmt(previewContract.monthlyFee), icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
              { label: "Duration", value: `${previewContract.contractDuration} Months`, icon: <Calendar className="w-4 h-4 text-blue-400" /> },
              { label: "Total Value", value: fmt(previewContract.monthlyFee * previewContract.contractDuration), icon: <Zap className="w-4 h-4 text-amber-400" /> },
              { label: "Devices", value: `${previewContract.pcCount} PCs`, icon: <Layers className="w-4 h-4 text-purple-400" /> },
              { label: "Response SLA", value: TIER_PRESETS[previewContract.tier].responseTime, icon: <Clock className="w-4 h-4 text-red-400" /> },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  {item.icon}
                  {item.label}
                </div>
                <div className="font-bold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Contracts List */}
      {contracts.length > 0 && (
        <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-border flex items-center justify-between">
            <h3 className="font-extrabold text-base">Generated Contracts ({contracts.length})</h3>
            <span className="text-xs text-muted-foreground">Click a contract to expand details</span>
          </div>
          <div className="divide-y divide-border">
            {contracts.map((contract) => {
              const p = TIER_PRESETS[contract.tier];
              const isExpanded = expandedId === contract.id;
              return (
                <div key={contract.id}>
                  <div
                    className="px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : contract.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-lg text-xs font-bold ${p.bgColor} ${p.color} ${p.borderColor} border`}>
                        {p.name.split(" ")[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{contract.clientCompany}</div>
                        <div className="text-xs text-muted-foreground">{contract.id} · {contract.clientContactName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-black text-sm ${p.color}`}>{fmt(contract.monthlyFee)}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                        <div className="text-xs text-muted-foreground">{contract.contractDuration} months</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handlePrint(contract); }} className="p-2 rounded-lg hover:bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(contract.id); }} className="p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-8 pb-6 bg-background/50 grid md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border/50">
                      {[
                        { icon: <Building2 className="w-4 h-4" />, label: "Company", value: contract.clientCompany },
                        { icon: <User className="w-4 h-4" />, label: "Contact", value: contract.clientContactName },
                        { icon: <Phone className="w-4 h-4" />, label: "Phone", value: contract.clientPhone || "—" },
                        { icon: <Mail className="w-4 h-4" />, label: "Email", value: contract.clientEmail || "—" },
                        { icon: <MapPin className="w-4 h-4" />, label: "Address", value: contract.clientAddress || "—" },
                        { icon: <Calendar className="w-4 h-4" />, label: "Start Date", value: new Date(contract.startDate).toLocaleDateString("en-KE") },
                      ].map((row) => (
                        <div key={row.label} className="pt-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                            {row.icon}
                            {row.label}
                          </div>
                          <div className="text-sm font-semibold">{row.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {contracts.length === 0 && !showForm && (
        <div className="rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="font-bold text-base mb-2">No Contracts Yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Click "New Contract" to generate a professional IT retainer agreement ready to print and sign.</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-teal-500/30 text-teal-400 text-sm font-semibold hover:bg-teal-500/10 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            Generate Your First Contract
          </button>
        </div>
      )}
    </div>
  );
};

// Helper for detail rows in expanded view
const Hash: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/>
    <line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
  </svg>
);

export default SLAGenerator;

import React, { useState, useEffect } from "react";
import {
  dataStorage,
  ServiceReportRecord,
  SavedClient,
  CompanyProfile
} from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Search,
  Printer,
  Building2,
  Star,
  Trash2,
  Edit3,
  X,
  Check
} from "lucide-react";

export const ServiceReportManager: React.FC = () => {
  const { toast } = useToast();

  const [reports, setReports] = useState<ServiceReportRecord[]>([]);
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [companyProfile] = useState<CompanyProfile>(dataStorage.getCompanyProfile());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<ServiceReportRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Omit<ServiceReportRecord, "id" | "createdAt">>({
    reportNumber: `KRN-SR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    clientName: "",
    company: "",
    phone: "",
    email: "",
    siteLocation: "Nairobi, Kenya",
    serviceDate: new Date().toISOString().slice(0, 10),
    serviceType: "network_wifi",
    workSummary: "",
    preDiagnostics: {
      downloadMbps: 15,
      uploadMbps: 8,
      pingMs: 65,
      packetLossPct: 2.5,
      notes: "High latency on gateway; Wi-Fi drops during video calls.",
    },
    postDiagnostics: {
      downloadMbps: 95,
      uploadMbps: 90,
      pingMs: 14,
      packetLossPct: 0,
      notes: "Stable gigabit throughput achieved with low jitter and zero packet loss.",
    },
    partsDeployed: [
      {
        id: "p1",
        itemDesc: "Cat6 UTP Patch Lead (Molded Bare Copper)",
        serialNumber: "SN-C6-9921",
        macAddress: "",
        qty: 4,
        warrantyMonths: 12,
      },
    ],
    checklist: [
      { id: "c1", task: "Router & Firewall security settings hardened", completed: true },
      { id: "c2", task: "Dual-WAN failover tested and switching within 3 seconds", completed: true },
      { id: "c3", task: "All network cables labeled and dressed neatly", completed: true },
      { id: "c4", task: "Client device roaming verified across all access points", completed: true },
      { id: "c5", task: "User training provided to client IT representative", completed: true },
    ],
    clientSignOff: {
      signerName: "",
      signerRole: "Operations / IT Lead",
      signedDate: new Date().toISOString().slice(0, 10),
      satisfactionRating: 5,
      signatureText: "",
      clientComments: "Work completed satisfactorily. All tests verified on site.",
    },
    status: "completed",
  });

  // Load records
  useEffect(() => {
    const load = () => {
      setReports(dataStorage.getServiceReports());
      setClients(dataStorage.getClients());
    };
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  // Quick Client Autofill
  const handleSelectClient = (clientId: string) => {
    const c = clients.find((item) => item.id === clientId);
    if (!c) return;
    setFormData((prev) => ({
      ...prev,
      clientName: c.name,
      company: c.company,
      phone: c.phone,
      email: c.email || "",
      siteLocation: c.address || "Nairobi, Kenya",
      clientSignOff: {
        ...prev.clientSignOff,
        signerName: c.name,
        signatureText: c.name,
      },
    }));
    toast({
      title: "Client Autofilled ⚡",
      description: `Loaded ${c.company} (${c.name}) details.`,
    });
  };

  // Add Part Row
  const handleAddPart = () => {
    setFormData((prev) => ({
      ...prev,
      partsDeployed: [
        ...(prev.partsDeployed || []),
        {
          id: `p-${Date.now()}`,
          itemDesc: "",
          serialNumber: "",
          macAddress: "",
          qty: 1,
          warrantyMonths: 12,
        },
      ],
    }));
  };

  const handleRemovePart = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      partsDeployed: (prev.partsDeployed || []).filter((p) => p.id !== id),
    }));
  };

  // Save Service Report
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.clientName.trim() || !formData.workSummary.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please specify client company, contact name, and work summary.",
        variant: "destructive",
      });
      return;
    }

    const saved = dataStorage.saveServiceReport({
      ...formData,
      id: selectedReport ? selectedReport.id : `sr-${Date.now()}`,
      createdAt: selectedReport ? selectedReport.createdAt : new Date().toISOString(),
    });

    setIsCreating(false);
    setSelectedReport(saved);
    toast({
      title: "Service Report Saved! 📋",
      description: `Report ${saved.reportNumber} for ${saved.company} is ready for client sign-off.`,
    });
  };

  // Print Handover Certificate
  const handlePrintReport = (rep: ServiceReportRecord) => {
    let printFrame = document.getElementById("krenovate-report-iframe") as HTMLIFrameElement | null;
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "krenovate-report-iframe";
      printFrame.style.cssText = "position:fixed;top:-10000px;left:-10000px;width:1000px;height:1200px;border:none;";
      document.body.appendChild(printFrame);
    }

    const doc = printFrame.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Service Handover Report - ${rep.reportNumber}</title>
  <meta charset="utf-8" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet" />
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter', sans-serif; font-size:11px; line-height:1.45; color:#0f172a; background:#fff; width:100%; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { width:794px; max-width:794px; margin:0 auto; padding:32px 36px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:18px; border-bottom:2px solid #e2e8f0; margin-bottom:18px; }
    .logo-group { display:flex; align-items:center; gap:14px; }
    .logo-icon { width:46px; height:46px; border-radius:12px; background:#0f766e; color:#fff; font-size:24px; font-weight:900; display:flex; align-items:center; justify-content:center; }
    .company-title { font-size:22px; font-weight:900; color:#0f172a; line-height:1.2; }
    .company-sub { font-size:10.5px; color:#0f766e; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
    .badge { display:inline-block; padding:5px 14px; border-radius:8px; background:#0f766e; color:#fff; font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
    .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
    .box { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; }
    .box-label { font-size:9.5px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:4px; }
    .box h4 { font-size:13px; font-weight:900; color:#0f172a; margin-bottom:2px; }
    table { width:100%; border-collapse:collapse; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; margin-bottom:16px; font-size:10.5px; }
    th { background:#1e293b; color:#fff; font-family:monospace; font-size:10px; padding:8px 10px; text-align:left; text-transform:uppercase; }
    td { padding:8px 10px; border-bottom:1px solid #f1f5f9; }
    tr:nth-child(even) td { background:#f8fafc; }
    .telemetry-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
    .tele-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; }
    .metric-row { display:flex; justify-content:space-between; padding:3px 0; font-family:monospace; font-size:11px; }
    .checklist-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }
    .check-item { display:flex; align-items:center; gap:6px; font-size:10px; color:#334155; }
    .footer-sign { display:grid; grid-template-columns:1fr 1fr; gap:20px; padding-top:16px; border-top:2px solid #e2e8f0; margin-top:16px; align-items:flex-end; }
    .sign-col { text-align:center; display:flex; flex-direction:column; align-items:center; }
    .sig-text { font-family:'Caveat', cursive; font-size:24px; font-weight:700; color:#0f172a; }
    .sig-line { width:200px; border-top:1px solid #64748b; padding-top:4px; font-size:9.5px; text-transform:uppercase; color:#64748b; font-weight:700; }
    @page { size: A4 portrait; margin: 0; }
    @media print { html, body { margin:0 !important; padding:0 !important; } .page { padding:12mm 14mm !important; width:100% !important; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-group">
        ${companyProfile.logoUrl ? `<img src="${companyProfile.logoUrl}" style="height:46px;width:46px;object-fit:contain;border-radius:10px;" />` : `<div class="logo-icon">K</div>`}
        <div>
          <div class="company-title">${companyProfile.name}</div>
          <div class="company-sub">${companyProfile.tagline || "Enterprise IT Support & Network Engineering"}</div>
          <div style="font-size:10px;color:#475569;margin-top:4px;">${companyProfile.address} · Phone: ${companyProfile.phone} · KRA PIN: <strong>${companyProfile.kraPin}</strong></div>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="badge">Job Completion Handover</div>
        <div style="font-family:monospace;font-size:10.5px;color:#475569;line-height:1.5;">
          <div>Report No: <strong style="color:#0f172a;">${rep.reportNumber}</strong></div>
          <div>Service Date: <strong>${rep.serviceDate}</strong></div>
          <div>Status: <strong style="color:#0f766e;text-transform:uppercase;">${rep.status}</strong></div>
        </div>
      </div>
    </div>

    <!-- Client & Site -->
    <div class="grid-2">
      <div class="box">
        <div class="box-label">Client Organization &amp; Site</div>
        <h4>${rep.company}</h4>
        <p style="color:#334155;font-weight:600;">Contact: ${rep.clientName} (${rep.phone})</p>
        <p style="color:#64748b;">Site Location: ${rep.siteLocation}</p>
      </div>
      <div class="box">
        <div class="box-label">Service Type &amp; Lead Engineer</div>
        <h4>${rep.serviceType.replace(/_/g, " ").toUpperCase()}</h4>
        <p style="color:#334155;">Lead Engineer: <strong>${companyProfile.authorizedSignatory || "Peter Kivevo John"}</strong></p>
        <p style="color:#64748b;">Warranty Coverage: 30 Days Comprehensive Labor Warranty</p>
      </div>
    </div>

    <!-- Scope of Work Done -->
    <div class="box" style="margin-bottom:16px;">
      <div class="box-label">Technical Scope of Work Executed</div>
      <p style="font-size:11px;color:#1e293b;line-height:1.55;white-space:pre-line;">${rep.workSummary}</p>
    </div>

    <!-- Pre vs Post Telemetry -->
    ${
      rep.preDiagnostics && rep.postDiagnostics
        ? `<div class="telemetry-grid">
      <div class="tele-card" style="border-left:3px solid #f59e0b;">
        <div class="box-label" style="color:#b45309;">⚠️ Initial Pre-Service State</div>
        <div class="metric-row"><span>Download Speed:</span><strong>${rep.preDiagnostics.downloadMbps || 0} Mbps</strong></div>
        <div class="metric-row"><span>Upload Speed:</span><strong>${rep.preDiagnostics.uploadMbps || 0} Mbps</strong></div>
        <div class="metric-row"><span>Gateway Latency:</span><strong>${rep.preDiagnostics.pingMs || 0} ms</strong></div>
        <div class="metric-row"><span>Packet Loss:</span><strong>${rep.preDiagnostics.packetLossPct || 0}%</strong></div>
        ${rep.preDiagnostics.notes ? `<p style="font-size:9.5px;color:#64748b;margin-top:6px;border-top:1px dashed #cbd5e1;padding-top:4px;">${rep.preDiagnostics.notes}</p>` : ""}
      </div>
      <div class="tele-card" style="border-left:3px solid #10b981;background:#f0fdf4;">
        <div class="box-label" style="color:#047857;">✅ Final Post-Service Performance</div>
        <div class="metric-row"><span>Download Speed:</span><strong style="color:#047857;">${rep.postDiagnostics.downloadMbps || 0} Mbps</strong></div>
        <div class="metric-row"><span>Upload Speed:</span><strong style="color:#047857;">${rep.postDiagnostics.uploadMbps || 0} Mbps</strong></div>
        <div class="metric-row"><span>Gateway Latency:</span><strong style="color:#047857;">${rep.postDiagnostics.pingMs || 0} ms</strong></div>
        <div class="metric-row"><span>Packet Loss:</span><strong style="color:#047857;">${rep.postDiagnostics.packetLossPct || 0}%</strong></div>
        ${rep.postDiagnostics.notes ? `<p style="font-size:9.5px;color:#047857;margin-top:6px;border-top:1px dashed #a7f3d0;padding-top:4px;">${rep.postDiagnostics.notes}</p>` : ""}
      </div>
    </div>`
        : ""
    }

    <!-- Parts Deployed -->
    ${
      rep.partsDeployed && rep.partsDeployed.length > 0
        ? `<table>
      <thead>
        <tr>
          <th>#</th>
          <th>Hardware / Part Deployed</th>
          <th>Serial Number</th>
          <th>MAC Address</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Warranty</th>
        </tr>
      </thead>
      <tbody>
        ${rep.partsDeployed
          .map(
            (p, idx) => `<tr>
          <td>${idx + 1}</td>
          <td><strong>${p.itemDesc}</strong></td>
          <td style="font-family:monospace;">${p.serialNumber || "N/A"}</td>
          <td style="font-family:monospace;">${p.macAddress || "N/A"}</td>
          <td style="text-align:center;font-family:monospace;">${p.qty}</td>
          <td style="text-align:right;font-family:monospace;">${p.warrantyMonths} Mos</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>`
        : ""
    }

    <!-- Quality Checklist -->
    ${
      rep.checklist && rep.checklist.length > 0
        ? `<div class="box" style="margin-bottom:16px;">
      <div class="box-label">Operational Handover Checklist</div>
      <div class="checklist-grid">
        ${rep.checklist.map((c) => `<div class="check-item"><span>${c.completed ? "☑" : "☐"}</span> <span>${c.task}</span></div>`).join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Sign-Off Footer -->
    <div class="footer-sign">
      <div class="sign-col">
        <div class="sig-text">${companyProfile.authorizedSignatory || "Peter Kivevo John"}</div>
        <div class="sig-line">Lead IT Engineer / Krenovate Systems</div>
        <div style="font-size:9px;color:#94a3b8;margin-top:3px;">Date: ${rep.serviceDate}</div>
      </div>
      <div class="sign-col">
        <div class="sig-text">${rep.clientSignOff.signatureText || rep.clientSignOff.signerName || "Client Sign-Off"}</div>
        <div class="sig-line">Client Authorized Representative</div>
        <div style="font-size:9px;color:#64748b;margin-top:3px;">${rep.clientSignOff.signerName} (${rep.clientSignOff.signerRole})</div>
      </div>
    </div>

    <div style="text-align:center;font-size:9px;color:#94a3b8;margin-top:20px;border-top:1px dashed #cbd5e1;padding-top:8px;">
      This document certifies that the aforementioned IT infrastructure services have been professionally tested and handed over in full operational order.
    </div>
  </div>
</body>
</html>`;

    doc.open();
    doc.write(reportHtml);
    doc.close();

    setTimeout(() => {
      try {
        printFrame?.contentWindow?.focus();
        printFrame?.contentWindow?.print();
      } catch {
        window.print();
      }
    }, 400);
  };

  const filteredReports = reports.filter((r) => {
    if (typeFilter !== "all" && r.serviceType !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.reportNumber.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        r.workSummary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  On-Site Service Reports &amp; Job Handover Cards
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-bold">
                  {reports.length} Reports
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official technical commissioning reports, pre/post speed tests, hardware serial tracking &amp; client sign-offs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedReport(null);
            setIsCreating(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Service Report</span>
        </button>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-navy-900 border border-teal-500/30 shadow-2xl p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-teal-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  {selectedReport ? "Edit Service Handover Report" : "Generate On-Site Service Report"}
                </h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-6">
              {/* Quick Client Autofill */}
              {clients.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-navy-950 border border-teal-500/30 space-y-2">
                  <span className="text-[11px] font-mono text-teal-300 font-bold block">
                    ⚡ 1-Click Client Autofill:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {clients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectClient(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          formData.company === c.company
                            ? "bg-teal-600 text-white border-teal-400"
                            : "bg-navy-900 text-slate-300 border-border hover:border-teal-500/50 hover:text-white"
                        }`}
                      >
                        <Building2 className="w-3 h-3 text-teal-400" />
                        <span>{c.company}</span>
                        <span className="text-[10px] opacity-75">({c.name})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Client & Site Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Samchi Group of companies"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Client Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Peter John"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Site Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.siteLocation}
                    onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                    placeholder="e.g. Westlands HQ, 4th Floor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Service Type *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-teal-300 font-bold"
                  >
                    <option value="network_wifi">Wi-Fi &amp; Enterprise Networking</option>
                    <option value="cctv_security">CCTV &amp; Surveillance Systems</option>
                    <option value="server_systems">Server &amp; Windows/Linux Systems</option>
                    <option value="hardware_repair">Hardware Diagnostics &amp; Repair</option>
                    <option value="cabling_infrastructure">Structured Cat6 Cabling &amp; Rack</option>
                    <option value="other">General IT Handover</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Service Date</label>
                  <input
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>

              {/* Work Executed Summary */}
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Technical Scope of Work Executed *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.workSummary}
                  onChange={(e) => setFormData({ ...formData, workSummary: e.target.value })}
                  placeholder="Detail all repairs, configurations, firmware updates, and optimizations performed on site..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              {/* Pre vs Post Diagnostics Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-navy-950 border border-border">
                <div className="space-y-2">
                  <span className="text-amber-400 font-bold font-mono text-[11px] block">
                    ⚠️ Pre-Service Diagnostics (Before):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Download Mbps</label>
                      <input
                        type="number"
                        value={formData.preDiagnostics?.downloadMbps || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preDiagnostics: { ...formData.preDiagnostics, downloadMbps: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-border text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Latency (Ping ms)</label>
                      <input
                        type="number"
                        value={formData.preDiagnostics?.pingMs || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preDiagnostics: { ...formData.preDiagnostics, pingMs: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-border text-white font-mono"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Initial issue notes (e.g. packet loss, weak signal)"
                    value={formData.preDiagnostics?.notes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preDiagnostics: { ...formData.preDiagnostics, notes: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-border text-slate-300 text-[11px]"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-emerald-400 font-bold font-mono text-[11px] block">
                    ✅ Post-Service Performance (After):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Download Mbps</label>
                      <input
                        type="number"
                        value={formData.postDiagnostics?.downloadMbps || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postDiagnostics: { ...formData.postDiagnostics, downloadMbps: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-border text-emerald-300 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Latency (Ping ms)</label>
                      <input
                        type="number"
                        value={formData.postDiagnostics?.pingMs || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postDiagnostics: { ...formData.postDiagnostics, pingMs: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-border text-emerald-300 font-mono font-bold"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Final verification notes (e.g. Zoom call smooth, 0 packet loss)"
                    value={formData.postDiagnostics?.notes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postDiagnostics: { ...formData.postDiagnostics, notes: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-border text-slate-300 text-[11px]"
                  />
                </div>
              </div>

              {/* Hardware / Parts Deployed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 text-xs">Hardware &amp; Equipment Deployed on Site:</span>
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-2.5 py-1 rounded-lg bg-teal-600/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold hover:bg-teal-600 hover:text-white"
                  >
                    + Add Hardware Row
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.partsDeployed || []).map((p, idx) => (
                    <div key={p.id} className="grid grid-cols-12 gap-2 items-center bg-navy-950 p-2.5 rounded-xl border border-border">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Item Description (e.g. Ubiquiti U6-Pro AP)"
                          value={p.itemDesc}
                          onChange={(e) => {
                            const updated = [...(formData.partsDeployed || [])];
                            updated[idx].itemDesc = e.target.value;
                            setFormData({ ...formData, partsDeployed: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-navy-900 border border-border text-white text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Serial Number"
                          value={p.serialNumber || ""}
                          onChange={(e) => {
                            const updated = [...(formData.partsDeployed || [])];
                            updated[idx].serialNumber = e.target.value;
                            setFormData({ ...formData, partsDeployed: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-navy-900 border border-border text-white text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="MAC Address"
                          value={p.macAddress || ""}
                          onChange={(e) => {
                            const updated = [...(formData.partsDeployed || [])];
                            updated[idx].macAddress = e.target.value;
                            setFormData({ ...formData, partsDeployed: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-navy-900 border border-border text-white text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={p.qty}
                          onChange={(e) => {
                            const updated = [...(formData.partsDeployed || [])];
                            updated[idx].qty = Number(e.target.value);
                            setFormData({ ...formData, partsDeployed: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-border text-white text-xs font-mono text-center"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          placeholder="Warranty (Mos)"
                          value={p.warrantyMonths}
                          onChange={(e) => {
                            const updated = [...(formData.partsDeployed || [])];
                            updated[idx].warrantyMonths = Number(e.target.value);
                            setFormData({ ...formData, partsDeployed: updated });
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-navy-900 border border-border text-teal-300 text-xs font-mono text-center"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemovePart(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Handover Sign-Off */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-3">
                <span className="font-bold text-slate-300 text-xs block">
                  Client Representative Sign-Off &amp; Handover Authorization:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400">Signer Name</label>
                    <input
                      type="text"
                      value={formData.clientSignOff.signerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientSignOff: { ...formData.clientSignOff, signerName: e.target.value },
                        })
                      }
                      placeholder="e.g. Peter John"
                      className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-border text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Job Title / Role</label>
                    <input
                      type="text"
                      value={formData.clientSignOff.signerRole}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientSignOff: { ...formData.clientSignOff, signerRole: e.target.value },
                        })
                      }
                      placeholder="e.g. IT Lead / General Manager"
                      className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-border text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Client Satisfaction Rating (1-5)</label>
                    <div className="flex items-center gap-1.5 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              clientSignOff: { ...formData.clientSignOff, satisfactionRating: star as any },
                            })
                          }
                          className={`p-1 rounded ${
                            formData.clientSignOff.satisfactionRating >= star ? "text-amber-400" : "text-slate-600"
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400">Client Remarks / Comments</label>
                  <input
                    type="text"
                    value={formData.clientSignOff.clientComments || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clientSignOff: { ...formData.clientSignOff, clientComments: e.target.value },
                      })
                    }
                    placeholder="e.g. Work inspected and accepted. Network fully operational."
                    className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-border text-white text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2.5 rounded-xl bg-navy-950 text-slate-300 hover:text-white border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Service Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report #, client, scope..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["all", "network_wifi", "cctv_security", "server_systems", "hardware_repair"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                typeFilter === t
                  ? "bg-teal-600 text-white"
                  : "bg-navy-900 text-slate-400 hover:text-white border border-border"
              }`}
            >
              {t.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* REPORTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-3xl bg-navy-900 border border-border hover:border-teal-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  {rep.reportNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{rep.serviceDate}</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm text-white">{rep.company}</h3>
                <p className="text-xs text-slate-300">Client Rep: <strong>{rep.clientName}</strong></p>
                <p className="text-xs text-slate-400 truncate">{rep.siteLocation}</p>
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-border text-xs text-slate-300 line-clamp-2">
                {rep.workSummary}
              </div>

              {rep.postDiagnostics && (
                <div className="flex items-center justify-between text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl">
                  <span>⚡ Verified Speed:</span>
                  <strong>{rep.postDiagnostics.downloadMbps} Mbps ({rep.postDiagnostics.pingMs}ms)</strong>
                </div>
              )}

              {rep.clientSignOff && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Signed by: <strong className="text-white">{rep.clientSignOff.signerName}</strong></span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rep.clientSignOff.satisfactionRating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <button
                onClick={() => {
                  setFormData(rep);
                  setSelectedReport(rep);
                  setIsCreating(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-navy-950 border border-border flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Delete service report ${rep.reportNumber}?`)) {
                      dataStorage.deleteServiceReport(rep.id);
                      toast({ title: "Report Deleted" });
                    }
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handlePrintReport(rep)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate (A4)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

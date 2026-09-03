import React, { useState } from "react";
import { dataStorage, EquipmentIntakeRecord } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  Laptop,
  Search,
  Plus,
  Printer,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  MessageCircle,
  Phone,
  Building2,
  Check,
  X,
  FileText,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  HardDrive,
  Wrench,
  Tag
} from "lucide-react";

export const EquipmentIntakeManager: React.FC = () => {
  const { toast } = useToast();
  const [intakes, setIntakes] = useState<EquipmentIntakeRecord[]>(() => dataStorage.getEquipmentIntakes());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<EquipmentIntakeRecord, "id" | "createdAt">>({
    intakeNumber: `KRN-INTAKE-${new Date().getFullYear()}-${String(intakes.length + 1).padStart(3, "0")}`,
    clientName: "",
    company: "",
    phone: "",
    email: "",
    deviceType: "laptop",
    brandModel: "",
    serialNumber: "",
    passcodePattern: "",
    accessories: {
      powerAdapter: true,
      bag: false,
      cables: false,
      mouse: false,
      other: "",
    },
    cosmeticCondition: "minor_scratches",
    reportedFault: "",
    diagnosticFee: 1500,
    estimatedCost: 0,
    priority: "standard",
    status: "received",
    agreedTerms: true,
    intakeDate: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      intakeNumber: `KRN-INTAKE-${new Date().getFullYear()}-${String(intakes.length + 1).padStart(3, "0")}`,
      clientName: "",
      company: "",
      phone: "",
      email: "",
      deviceType: "laptop",
      brandModel: "",
      serialNumber: "",
      passcodePattern: "",
      accessories: {
        powerAdapter: true,
        bag: false,
        cables: false,
        mouse: false,
        other: "",
      },
      cosmeticCondition: "minor_scratches",
      reportedFault: "",
      diagnosticFee: 1500,
      estimatedCost: 0,
      priority: "standard",
      status: "received",
      agreedTerms: true,
      intakeDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item: EquipmentIntakeRecord) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleSaveIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.phone.trim() || !formData.brandModel.trim()) {
      toast({ title: "Missing Details", description: "Please provide client name, phone, and device model.", variant: "destructive" });
      return;
    }

    const record: EquipmentIntakeRecord = {
      ...formData,
      id: editingId || `intake-${Date.now()}`,
      createdAt: editingId ? (intakes.find((i) => i.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    const saved = dataStorage.saveEquipmentIntake(record);
    const updatedList = dataStorage.getEquipmentIntakes();
    setIntakes(updatedList);
    setShowModal(false);

    toast({
      title: editingId ? "Intake Updated! 📋" : "Equipment Intake Registered! 🔧",
      description: `Slip #${saved.intakeNumber} generated for ${saved.clientName}.`,
    });
  };

  const handleStatusChange = (item: EquipmentIntakeRecord, newStatus: EquipmentIntakeRecord["status"]) => {
    const updated = { ...item, status: newStatus };
    if (newStatus === "collected") {
      updated.collectedAt = new Date().toISOString();
      updated.collectedBy = item.clientName;
    }
    dataStorage.saveEquipmentIntake(updated);
    setIntakes(dataStorage.getEquipmentIntakes());
    toast({
      title: `Status → ${newStatus.replace("_", " ").toUpperCase()}`,
      description: `${item.brandModel} updated in workshop tracker.`,
    });
  };

  const handleDeleteIntake = (id: string, num: string) => {
    if (window.confirm(`Delete Intake record ${num}?`)) {
      dataStorage.deleteEquipmentIntake(id);
      setIntakes(dataStorage.getEquipmentIntakes());
      toast({ title: "Record Removed", description: `Slip #${num} deleted.` });
    }
  };

  const handlePrintIntakeSlip = (item: EquipmentIntakeRecord) => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    const profile = dataStorage.getCompanyProfile();
    const trackUrl = `${window.location.origin}/track?job=${item.intakeNumber}`;

    printWin.document.write(`
      <!DOCTYPE html><html><head><title>Hardware Intake Slip - ${item.intakeNumber}</title><style>
        body{font-family:'Segoe UI',Arial,sans-serif;padding:24px;color:#1e293b;line-height:1.4;max-width:700px;margin:0 auto;font-size:12px}
        .header{display:flex;justify-content:space-between;border-bottom:2px solid #0f766e;padding-bottom:12px;margin-bottom:14px}
        .badge{background:#0f766e;color:#fff;padding:4px 10px;border-radius:4px;font-weight:700;font-size:11px;display:inline-block}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
        .box{background:#f8fafc;border:1px solid #e2e8f0;padding:8px 12px;border-radius:6px}
        .label{color:#64748b;font-size:10px;text-transform:uppercase;font-weight:700}
        .val{font-weight:600;margin-top:2px}
        .terms{font-size:9px;color:#64748b;background:#fffbeb;border:1px solid #fde68a;padding:8px 12px;border-radius:6px;margin:12px 0}
        .signatures{display:flex;justify-content:space-between;margin-top:20px;padding-top:12px;border-top:1px dashed #cbd5e1;font-size:10px}
      </style></head><body>
      <div class="header">
        <div>
          <div style="font-size:18px;font-weight:900;color:#0f766e">${profile.name}</div>
          <div style="font-size:10px;color:#64748b">Hardware Repair &amp; Bench Engineering Services</div>
          <div style="font-size:10px;color:#64748b">Tel: ${profile.phone} · KRA PIN: ${profile.kraPin}</div>
        </div>
        <div style="text-align:right">
          <div class="badge">EQUIPMENT INTAKE SLIP</div>
          <div style="font-family:monospace;font-size:13px;font-weight:700;margin-top:4px">${item.intakeNumber}</div>
          <div style="font-size:10px;color:#64748b">Date: ${item.intakeDate}</div>
        </div>
      </div>

      <div class="grid">
        <div class="box">
          <div class="label">Customer / Company</div>
          <div class="val" style="font-size:13px">${item.clientName}</div>
          <div style="color:#64748b">${item.company || "Individual Client"} · ${item.phone}</div>
        </div>
        <div class="box">
          <div class="label">Device &amp; Identifiers</div>
          <div class="val">${item.brandModel} (${item.deviceType.toUpperCase()})</div>
          <div style="font-family:monospace;color:#64748b">SN: ${item.serialNumber || "No Serial Noted"}</div>
        </div>
      </div>

      <div class="box" style="margin-bottom:10px">
        <div class="label">Reported Fault / Problem Symptoms</div>
        <div class="val" style="font-weight:normal;line-height:1.5">${item.reportedFault}</div>
      </div>

      <div class="grid">
        <div class="box">
          <div class="label">Physical Condition &amp; Accessories</div>
          <div>Condition: <strong>${item.cosmeticCondition.replace("_", " ").toUpperCase()}</strong></div>
          <div style="font-size:11px;color:#475569;margin-top:3px">
            Power Adapter: ${item.accessories.powerAdapter ? "✔ Yes" : "❌ No"} · 
            Bag: ${item.accessories.bag ? "✔ Yes" : "❌ No"} · 
            Mouse/Cables: ${item.accessories.mouse || item.accessories.cables ? "✔ Yes" : "❌ No"}
            ${item.accessories.other ? `(${item.accessories.other})` : ""}
          </div>
        </div>
        <div class="box">
          <div class="label">Inspection &amp; Financials</div>
          <div>Diagnostic / Inspection Fee: <strong>KES ${Number(item.diagnosticFee).toLocaleString()}</strong></div>
          <div>Est. Repair Range: <strong>${item.estimatedCost ? `KES ${Number(item.estimatedCost).toLocaleString()}` : "Pending Diagnostic"}</strong></div>
          <div style="color:#0f766e;font-weight:700;margin-top:2px">M-Pesa Till: ${profile.mpesaNumber}</div>
        </div>
      </div>

      <div class="terms">
        <strong>TERMS OF SERVICE:</strong> 1. Diagnostic fee is payable upon hardware intake. 2. Krenovate Systems is not liable for existing internal logical data corruption; clients are advised to maintain independent backups. 3. Equipment uncollected within 60 days of repair completion may incur storage charges or be liquidated to recover labor costs.
      </div>

      <div class="signatures">
        <div>
          <div class="label">Customer Handover Signature</div>
          <div style="margin-top:24px;border-top:1px solid #94a3b8;width:160px;padding-top:2px">${item.clientName}</div>
        </div>
        <div style="text-align:right">
          <div class="label">Received By (Engineer)</div>
          <div style="margin-top:24px;border-top:1px solid #94a3b8;width:160px;padding-top:2px">Peter Kivevo John</div>
        </div>
      </div>

      <div style="text-align:center;margin-top:16px;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:8px">
        Track your live bench repair status online at: <strong>${trackUrl}</strong>
      </div>
      <script>window.onload = function() { window.print(); };</script>
      </body></html>
    `);
    printWin.document.close();
  };

  const getWhatsAppStatusMessage = (item: EquipmentIntakeRecord) => {
    return `Hello ${item.clientName}! 👋\n\nRepair status update from *Krenovate Systems* for your *${item.brandModel}* (Slip #${item.intakeNumber}):\n\n• *Status:* ${item.status.replace("_", " ").toUpperCase()}\n• *Reported Issue:* ${item.reportedFault}\n${item.estimatedCost ? `• *Estimated Repair Cost:* KES ${item.estimatedCost.toLocaleString()}\n` : ""}• *Track Online:* ${window.location.origin}/track?job=${item.intakeNumber}\n\nPlease let us know if you have any questions!\n— Peter Kivevo (0758 896 553)`;
  };

  const filteredIntakes = intakes.filter((i) => {
    const matchesSearch =
      i.intakeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.company && i.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Equipment Intake &amp; Handover Receipts
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-bold">
                {intakes.length} Intake Slips
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hardware intake forms, condition checklists, diagnostic fee receipts, and liability waivers.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Device Intake</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Slip #, client, model, serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "received", "diagnosing", "awaiting_parts", "repaired", "ready_for_pickup", "collected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-navy-950 text-slate-400 hover:text-white border border-border"
              }`}
            >
              {st === "all" ? "All Slips" : st.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Intake Table */}
      <div className="rounded-3xl bg-navy-900 border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-navy-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">Slip # / Date</th>
                <th className="py-3.5 px-4 font-bold">Client &amp; Company</th>
                <th className="py-3.5 px-4 font-bold">Device &amp; Model</th>
                <th className="py-3.5 px-4 font-bold">Condition &amp; Accessories</th>
                <th className="py-3.5 px-4 font-bold">Fee / Est</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-slate-300 font-sans">
              {filteredIntakes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No hardware intake records match your filter.
                  </td>
                </tr>
              ) : (
                filteredIntakes.map((item) => {
                  const statusColors: Record<string, string> = {
                    received: "bg-slate-500/15 text-slate-300 border-slate-500/30",
                    diagnosing: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                    awaiting_parts: "bg-orange-500/15 text-orange-300 border-orange-500/30",
                    repaired: "bg-blue-500/15 text-blue-300 border-blue-500/30",
                    ready_for_pickup: "bg-teal-500/15 text-teal-300 border-teal-500/30",
                    collected: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                  };

                  return (
                    <tr key={item.id} className="hover:bg-navy-850/60 transition-colors">
                      {/* Slip # */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-white text-xs">{item.intakeNumber}</div>
                        <div className="text-[10px] text-slate-400">{item.intakeDate}</div>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{item.clientName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{item.company || "Individual"}</span>
                          <span>•</span>
                          <span className="font-mono">{item.phone}</span>
                        </div>
                      </td>

                      {/* Device */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{item.brandModel}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          SN: {item.serialNumber || "N/A"}
                        </div>
                      </td>

                      {/* Condition & Accessories */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <div className="text-slate-300 font-medium capitalize">
                          {item.cosmeticCondition.replace("_", " ")}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          {item.accessories.powerAdapter && "Charger "}
                          {item.accessories.bag && "· Bag "}
                          {item.accessories.other && `· ${item.accessories.other}`}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-teal-400 font-bold">KES {Number(item.diagnosticFee).toLocaleString()}</div>
                        {item.estimatedCost ? (
                          <div className="text-[10px] text-slate-400">Est: KES {Number(item.estimatedCost).toLocaleString()}</div>
                        ) : null}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item, e.target.value as EquipmentIntakeRecord["status"])}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border outline-none bg-navy-950 cursor-pointer ${
                            statusColors[item.status] || "text-slate-400"
                          }`}
                        >
                          <option value="received">RECEIVED</option>
                          <option value="diagnosing">DIAGNOSING</option>
                          <option value="awaiting_parts">AWAITING PARTS</option>
                          <option value="repaired">REPAIRED</option>
                          <option value="ready_for_pickup">READY FOR PICKUP</option>
                          <option value="collected">COLLECTED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Handover Slip */}
                          <button
                            onClick={() => handlePrintIntakeSlip(item)}
                            title="Print Intake Slip / Receipt"
                            className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white border border-teal-500/20 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Status Alert */}
                          <a
                            href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              getWhatsAppStatusMessage(item)
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Send WhatsApp Status Update"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Intake"
                            className="p-1.5 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-border"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteIntake(item.id, item.intakeNumber)}
                            title="Delete Intake"
                            className="p-1.5 rounded-lg bg-navy-950 text-rose-400 hover:bg-rose-500/20 border border-border"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-navy-900 border border-teal-500/40 p-6 md:p-8 space-y-6 shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {editingId ? "Edit Equipment Intake" : "New Hardware Intake Slip"}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{formData.intakeNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIntake} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mary Wanjiku"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. After40 Hotel"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 733 987 654"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. mary@after40hotel.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Device Type</label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value as EquipmentIntakeRecord["deviceType"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop / Workstation</option>
                    <option value="server">Server</option>
                    <option value="switch">Network Switch</option>
                    <option value="router">Router / Gateway</option>
                    <option value="cctv_nvr">CCTV NVR / DVR</option>
                    <option value="printer">Printer</option>
                    <option value="other">Other Hardware</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-semibold">Brand &amp; Model Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dell Latitude 5420 (Core i7 / 16GB RAM)"
                    value={formData.brandModel}
                    onChange={(e) => setFormData({ ...formData, brandModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Serial Number / Service Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. DELL-SN-88491"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">OS Passcode / PIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 1234 or None"
                    value={formData.passcodePattern}
                    onChange={(e) => setFormData({ ...formData, passcodePattern: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Physical Condition & Accessories */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-3">
                <div className="font-semibold text-slate-200">Cosmetic Condition &amp; Included Accessories</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Cosmetic Grade</label>
                    <select
                      value={formData.cosmeticCondition}
                      onChange={(e) => setFormData({ ...formData, cosmeticCondition: e.target.value as EquipmentIntakeRecord["cosmeticCondition"] })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-border text-white focus:outline-none"
                    >
                      <option value="pristine">Pristine / Like New</option>
                      <option value="minor_scratches">Minor Scratches</option>
                      <option value="heavy_wear">Heavy Wear / Dents</option>
                      <option value="cracked_screen">Cracked Glass / Screen Defect</option>
                      <option value="liquid_damage_suspected">Suspected Liquid Spill</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.accessories.powerAdapter}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessories: { ...formData.accessories, powerAdapter: e.target.checked },
                          })
                        }
                      />
                      <span>Power Adapter</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.accessories.bag}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessories: { ...formData.accessories, bag: e.target.checked },
                          })
                        }
                      />
                      <span>Laptop Bag</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.accessories.mouse}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accessories: { ...formData.accessories, mouse: e.target.checked },
                          })
                        }
                      />
                      <span>Mouse</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Reported Fault */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Reported Fault / Problem Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Overheating and shut-down under load. Thermal paste dried up..."
                  value={formData.reportedFault}
                  onChange={(e) => setFormData({ ...formData, reportedFault: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none resize-none"
                />
              </div>

              {/* Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Diagnostic / Inspection Fee (KES)</label>
                  <input
                    type="number"
                    value={formData.diagnosticFee}
                    onChange={(e) => setFormData({ ...formData, diagnosticFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Estimated Repair Quote (KES)</label>
                  <input
                    type="number"
                    value={formData.estimatedCost || ""}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                    placeholder="e.g. 6500"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? "Save Slip Changes" : "Register Hardware Intake"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentIntakeManager;

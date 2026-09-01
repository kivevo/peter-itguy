import React, { useState } from "react";
import { dataStorage, ClientVaultRecord, SavedClient } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Search,
  Plus,
  Network,
  Wifi,
  Radio,
  Server,
  Key,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Edit3,
  Trash2,
  Lock,
  Printer,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  FileText,
  X,
  Check,
  RefreshCw,
  HardDrive
} from "lucide-react";

export const ClientVaultManager: React.FC = () => {
  const { toast } = useToast();
  const [vaults, setVaults] = useState<ClientVaultRecord[]>(() => dataStorage.getClientVaults());
  const [clients] = useState<SavedClient[]>(() => dataStorage.getClients());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVault, setSelectedVault] = useState<ClientVaultRecord | null>(vaults[0] || null);
  const [activeDossierTab, setActiveDossierTab] = useState<"network" | "isp" | "credentials" | "renewals" | "notes">("network");
  
  // Password reveal toggles
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ClientVaultRecord, "id" | "createdAt" | "updatedAt">>({
    clientName: "",
    company: "",
    location: "Nairobi",
    contactPhone: "",
    contactEmail: "",
    gatewayIp: "192.168.1.1",
    subnetMask: "255.255.255.0",
    dhcpRange: "192.168.1.50 - 192.168.1.200",
    vlans: "VLAN 10: Staff, VLAN 20: Guest",
    primaryDns: "1.1.1.1 / 8.8.8.8",
    wifiSsidStaff: "",
    wifiPassStaff: "",
    wifiSsidGuest: "",
    wifiPassGuest: "",
    ispProvider: "Safaricom Business Fiber",
    circuitId: "",
    accountNumber: "",
    bandwidthCir: "30 Mbps Dedicated CIR",
    supportContact: "business@safaricom.co.ke",
    routerAdminUrl: "https://192.168.1.1",
    routerAdminUser: "admin",
    routerAdminPass: "",
    cctvNvrIp: "192.168.1.250",
    cctvNvrUser: "admin",
    cctvNvrPass: "",
    serverRdpIp: "",
    serverRdpUser: "Administrator",
    serverRdpPass: "",
    domainName: "",
    domainExpiryDate: "",
    sslExpiryDate: "",
    m365LicenseCount: 0,
    m365RenewalDate: "",
    antivirusBrand: "Kaspersky Endpoint Security",
    antivirusExpiryDate: "",
    backupRetentionPolicy: "Daily Local NAS + Weekly Cloud Sync",
    notes: "",
  });

  const toggleReveal = (key: string) => {
    setRevealedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard! 📋",
      description: `${label} copied.`,
    });
  };

  const getDaysRemaining = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      clientName: "",
      company: "",
      location: "Nairobi",
      contactPhone: "",
      contactEmail: "",
      gatewayIp: "192.168.1.1",
      subnetMask: "255.255.255.0",
      dhcpRange: "192.168.1.50 - 192.168.1.200",
      vlans: "VLAN 10: Staff, VLAN 20: Guest",
      primaryDns: "1.1.1.1 / 8.8.8.8",
      wifiSsidStaff: "",
      wifiPassStaff: "",
      wifiSsidGuest: "",
      wifiPassGuest: "",
      ispProvider: "Safaricom Business Fiber",
      circuitId: "",
      accountNumber: "",
      bandwidthCir: "30 Mbps Dedicated CIR",
      supportContact: "business@safaricom.co.ke",
      routerAdminUrl: "https://192.168.1.1",
      routerAdminUser: "admin",
      routerAdminPass: "",
      cctvNvrIp: "192.168.1.250",
      cctvNvrUser: "admin",
      cctvNvrPass: "",
      serverRdpIp: "",
      serverRdpUser: "Administrator",
      serverRdpPass: "",
      domainName: "",
      domainExpiryDate: "",
      sslExpiryDate: "",
      m365LicenseCount: 0,
      m365RenewalDate: "",
      antivirusBrand: "Kaspersky Endpoint Security",
      antivirusExpiryDate: "",
      backupRetentionPolicy: "Daily Local NAS + Weekly Cloud Sync",
      notes: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (vault: ClientVaultRecord) => {
    setEditingId(vault.id);
    setFormData({
      clientId: vault.clientId,
      clientName: vault.clientName,
      company: vault.company,
      location: vault.location,
      contactPhone: vault.contactPhone,
      contactEmail: vault.contactEmail || "",
      gatewayIp: vault.gatewayIp,
      subnetMask: vault.subnetMask,
      dhcpRange: vault.dhcpRange,
      vlans: vault.vlans,
      primaryDns: vault.primaryDns,
      wifiSsidStaff: vault.wifiSsidStaff,
      wifiPassStaff: vault.wifiPassStaff,
      wifiSsidGuest: vault.wifiSsidGuest,
      wifiPassGuest: vault.wifiPassGuest,
      ispProvider: vault.ispProvider,
      circuitId: vault.circuitId,
      accountNumber: vault.accountNumber,
      bandwidthCir: vault.bandwidthCir,
      supportContact: vault.supportContact,
      routerAdminUrl: vault.routerAdminUrl,
      routerAdminUser: vault.routerAdminUser,
      routerAdminPass: vault.routerAdminPass,
      cctvNvrIp: vault.cctvNvrIp,
      cctvNvrUser: vault.cctvNvrUser,
      cctvNvrPass: vault.cctvNvrPass,
      serverRdpIp: vault.serverRdpIp,
      serverRdpUser: vault.serverRdpUser,
      serverRdpPass: vault.serverRdpPass,
      domainName: vault.domainName,
      domainExpiryDate: vault.domainExpiryDate || "",
      sslExpiryDate: vault.sslExpiryDate || "",
      m365LicenseCount: vault.m365LicenseCount || 0,
      m365RenewalDate: vault.m365RenewalDate || "",
      antivirusBrand: vault.antivirusBrand || "Kaspersky Endpoint Security",
      antivirusExpiryDate: vault.antivirusExpiryDate || "",
      backupRetentionPolicy: vault.backupRetentionPolicy || "",
      notes: vault.notes || "",
    });
    setShowModal(true);
  };

  const handleSaveVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim()) {
      toast({ title: "Company Required", description: "Please specify client company name.", variant: "destructive" });
      return;
    }

    const record: ClientVaultRecord = {
      ...formData,
      id: editingId || `vault-${Date.now()}`,
      createdAt: editingId ? (vaults.find((v) => v.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = dataStorage.saveClientVault(record);
    const updatedList = dataStorage.getClientVaults();
    setVaults(updatedList);
    setSelectedVault(saved);
    setShowModal(false);
    toast({
      title: editingId ? "Dossier Updated! 🛡️" : "Client Vault Created! 🔐",
      description: `Technical configuration for ${saved.company} is securely stored.`,
    });
  };

  const handleDeleteVault = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the IT Dossier for ${name}?`)) {
      dataStorage.deleteClientVault(id);
      const updated = dataStorage.getClientVaults();
      setVaults(updated);
      setSelectedVault(updated[0] || null);
      toast({ title: "Vault Deleted", description: `Dossier for ${name} removed.` });
    }
  };

  const handlePrintHandover = (vault: ClientVaultRecord) => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    printWin.document.write(`
      <!DOCTYPE html><html><head><title>IT Infrastructure Dossier - ${vault.company}</title><style>
        body{font-family:'Segoe UI',Arial,sans-serif;padding:24px;color:#1e293b;line-height:1.5;max-width:800px;margin:0 auto}
        h1{color:#0f766e;font-size:20px;border-bottom:2px solid #0f766e;padding-bottom:8px;margin-bottom:16px}
        h2{color:#0f172a;font-size:14px;background:#f1f5f9;padding:6px 10px;border-radius:4px;margin:16px 0 8px 0}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px}
        .item{background:#f8fafc;border:1px solid #e2e8f0;padding:8px 12px;border-radius:6px}
        .label{color:#64748b;font-size:10px;text-transform:uppercase;font-weight:700}
        .val{font-weight:600;margin-top:2px;font-family:monospace}
      </style></head><body>
      <h1>Krenovate Systems — Client IT Infrastructure Handover</h1>
      <p style="font-size:12px;color:#64748b">Company: <strong>${vault.company}</strong> · Contact: <strong>${vault.clientName} (${vault.contactPhone})</strong> · Location: <strong>${vault.location}</strong> · Updated: ${new Date(vault.updatedAt).toLocaleDateString()}</p>
      
      <h2>1. Network & IP Configuration</h2>
      <div class="grid">
        <div class="item"><div class="label">Gateway IP</div><div class="val">${vault.gatewayIp}</div></div>
        <div class="item"><div class="label">Subnet Mask</div><div class="val">${vault.subnetMask}</div></div>
        <div class="item"><div class="label">DHCP Pool</div><div class="val">${vault.dhcpRange}</div></div>
        <div class="item"><div class="label">Primary DNS</div><div class="val">${vault.primaryDns}</div></div>
        <div class="item" style="grid-column:span 2"><div class="label">VLAN Configuration</div><div class="val">${vault.vlans}</div></div>
        <div class="item"><div class="label">Staff Wi-Fi SSID</div><div class="val">${vault.wifiSsidStaff}</div></div>
        <div class="item"><div class="label">Staff Wi-Fi Password</div><div class="val">${vault.wifiPassStaff}</div></div>
        <div class="item"><div class="label">Guest Wi-Fi SSID</div><div class="val">${vault.wifiSsidGuest}</div></div>
        <div class="item"><div class="label">Guest Wi-Fi Password</div><div class="val">${vault.wifiPassGuest}</div></div>
      </div>

      <h2>2. ISP & Internet Circuit</h2>
      <div class="grid">
        <div class="item"><div class="label">ISP Provider</div><div class="val">${vault.ispProvider}</div></div>
        <div class="item"><div class="label">Bandwidth CIR</div><div class="val">${vault.bandwidthCir}</div></div>
        <div class="item"><div class="label">Circuit ID</div><div class="val">${vault.circuitId || "N/A"}</div></div>
        <div class="item"><div class="label">Account Number</div><div class="val">${vault.accountNumber || "N/A"}</div></div>
        <div class="item" style="grid-column:span 2"><div class="label">ISP NOC Support</div><div class="val">${vault.supportContact}</div></div>
      </div>

      <h2>3. Device Admin & Access Credentials</h2>
      <div class="grid">
        <div class="item"><div class="label">Router Console URL</div><div class="val">${vault.routerAdminUrl}</div></div>
        <div class="item"><div class="label">Router Admin</div><div class="val">${vault.routerAdminUser} / ${vault.routerAdminPass}</div></div>
        <div class="item"><div class="label">CCTV NVR IP</div><div class="val">${vault.cctvNvrIp}</div></div>
        <div class="item"><div class="label">CCTV Credentials</div><div class="val">${vault.cctvNvrUser} / ${vault.cctvNvrPass}</div></div>
        <div class="item"><div class="label">Server RDP / Host</div><div class="val">${vault.serverRdpIp || "N/A"}</div></div>
        <div class="item"><div class="label">Server Admin</div><div class="val">${vault.serverRdpUser} / ${vault.serverRdpPass}</div></div>
      </div>

      <h2>4. Domain & License Expiry Schedule</h2>
      <div class="grid">
        <div class="item"><div class="label">Primary Domain</div><div class="val">${vault.domainName || "N/A"} (Exp: ${vault.domainExpiryDate || "N/A"})</div></div>
        <div class="item"><div class="label">SSL Certificate</div><div class="val">Exp: ${vault.sslExpiryDate || "N/A"}</div></div>
        <div class="item"><div class="label">Microsoft 365</div><div class="val">${vault.m365LicenseCount} Seats (Exp: ${vault.m365RenewalDate || "N/A"})</div></div>
        <div class="item"><div class="label">Endpoint Antivirus</div><div class="val">${vault.antivirusBrand} (Exp: ${vault.antivirusExpiryDate || "N/A"})</div></div>
      </div>

      <p style="font-size:10px;color:#94a3b8;margin-top:24px;border-top:1px solid #cbd5e1;padding-top:8px">CONFIDENTIAL — For Authorized Krenovate Systems Engineers & Client IT Personnel Only.</p>
      <script>window.onload = function() { window.print(); };</script>
      </body></html>
    `);
    printWin.document.close();
  };

  const filteredVaults = vaults.filter(
    (v) =>
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.gatewayIp.includes(searchQuery) ||
      v.ispProvider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Client IT Asset &amp; Infrastructure Vault
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-bold">
                {vaults.length} Dossiers
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Centralized network topologies, ISP circuit IDs, router/NVR credentials, and renewal trackers.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Dossier</span>
        </button>
      </div>

      {/* Main Grid: Left List + Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Client Selector & Search (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by company, client, IP, ISP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredVaults.length === 0 ? (
              <div className="p-8 rounded-2xl bg-navy-900 border border-border text-center text-slate-400 text-xs">
                No client dossiers found.
              </div>
            ) : (
              filteredVaults.map((vault) => {
                const isSelected = selectedVault?.id === vault.id;
                const domainDays = getDaysRemaining(vault.domainExpiryDate);
                const hasExpiringSoon = domainDays !== null && domainDays <= 30;

                return (
                  <div
                    key={vault.id}
                    onClick={() => setSelectedVault(vault)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? "bg-teal-500/10 border-teal-500 text-white shadow-md"
                        : "bg-navy-900 border-border/80 text-slate-300 hover:border-slate-600 hover:bg-navy-850"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{vault.company}</span>
                          {hasExpiringSoon && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="License expiring soon" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{vault.clientName}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-navy-950 text-teal-400 border border-teal-500/20 text-[10px] font-mono">
                        {vault.gatewayIp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-border/40 pt-2 font-mono">
                      <span className="truncate max-w-[160px]">{vault.ispProvider}</span>
                      <span>{vault.bandwidthCir.split(" ")[0]} Mbps</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Comprehensive Technical Dossier (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedVault ? (
            <div className="p-6 rounded-3xl bg-navy-900 border border-border space-y-6">
              {/* Dossier Header & Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-400" />
                    <h3 className="font-heading font-extrabold text-lg text-white">
                      {selectedVault.company}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {selectedVault.contactPhone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {selectedVault.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintHandover(selectedVault)}
                    title="Print / Save PDF Handover Document"
                    className="p-2 rounded-xl bg-navy-950 text-slate-300 hover:text-white border border-border hover:border-teal-500 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Export Handover</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(selectedVault)}
                    className="p-2 rounded-xl bg-navy-950 text-slate-300 hover:text-teal-400 border border-border text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteVault(selectedVault.id, selectedVault.company)}
                    className="p-2 rounded-xl bg-navy-950 text-rose-400 hover:bg-rose-500/20 border border-border"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dossier Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-border/40 pb-3">
                {[
                  { id: "network", label: "Network & Wi-Fi", icon: <Network className="w-3.5 h-3.5" /> },
                  { id: "isp", label: "ISP & Circuit", icon: <Radio className="w-3.5 h-3.5" /> },
                  { id: "credentials", label: "Credentials Vault", icon: <Key className="w-3.5 h-3.5" /> },
                  { id: "renewals", label: "Licenses & Renewals", icon: <Calendar className="w-3.5 h-3.5" /> },
                  { id: "notes", label: "Site Access & Notes", icon: <FileText className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDossierTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeDossierTab === tab.id
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-navy-950 text-slate-400 hover:text-white border border-border"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* TAB 1: NETWORK TOPOLOGY */}
              {activeDossierTab === "network" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">IP Subnet &amp; Gateway</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Gateway IP:</span>
                        <strong className="text-white font-mono">{selectedVault.gatewayIp}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subnet Mask:</span>
                        <span className="text-white font-mono">{selectedVault.subnetMask}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">DHCP Pool:</span>
                        <span className="text-white font-mono">{selectedVault.dhcpRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Primary DNS:</span>
                        <span className="text-white font-mono">{selectedVault.primaryDns}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">VLAN Architecture</div>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                      {selectedVault.vlans || "No custom VLANs mapped."}
                    </p>
                  </div>

                  {/* Wi-Fi Networks */}
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-navy-950 border border-border space-y-3">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5" />
                      <span>Wireless SSIDs &amp; Passwords</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Staff Wi-Fi */}
                      <div className="p-3 rounded-xl bg-navy-900 border border-border space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300">Staff Secure Wi-Fi</div>
                        <div className="flex items-center justify-between bg-navy-950 px-2.5 py-1.5 rounded-lg font-mono">
                          <span className="text-teal-300">{selectedVault.wifiSsidStaff || "N/A"}</span>
                          <button onClick={() => copyToClipboard(selectedVault.wifiSsidStaff, "Staff SSID")} className="text-slate-400 hover:text-white">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-navy-950 px-2.5 py-1.5 rounded-lg font-mono">
                          <span className="text-slate-200">
                            {revealedKeys["wifi_staff"] ? selectedVault.wifiPassStaff || "None" : "••••••••••••"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleReveal("wifi_staff")} className="text-slate-400 hover:text-white">
                              {revealedKeys["wifi_staff"] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button onClick={() => copyToClipboard(selectedVault.wifiPassStaff, "Staff Password")} className="text-slate-400 hover:text-white">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Guest Wi-Fi */}
                      <div className="p-3 rounded-xl bg-navy-900 border border-border space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300">Guest Portal Wi-Fi</div>
                        <div className="flex items-center justify-between bg-navy-950 px-2.5 py-1.5 rounded-lg font-mono">
                          <span className="text-teal-300">{selectedVault.wifiSsidGuest || "N/A"}</span>
                          <button onClick={() => copyToClipboard(selectedVault.wifiSsidGuest, "Guest SSID")} className="text-slate-400 hover:text-white">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-navy-950 px-2.5 py-1.5 rounded-lg font-mono">
                          <span className="text-slate-200">
                            {revealedKeys["wifi_guest"] ? selectedVault.wifiPassGuest || "None" : "••••••••••••"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleReveal("wifi_guest")} className="text-slate-400 hover:text-white">
                              {revealedKeys["wifi_guest"] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button onClick={() => copyToClipboard(selectedVault.wifiPassGuest, "Guest Password")} className="text-slate-400 hover:text-white">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ISP & CIRCUIT */}
              {activeDossierTab === "isp" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-3">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">Provider &amp; Plan</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-slate-400 text-[11px]">ISP Provider</div>
                        <div className="text-base font-bold text-white">{selectedVault.ispProvider}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[11px]">Bandwidth CIR</div>
                        <div className="text-sm font-semibold text-teal-300 font-mono">{selectedVault.bandwidthCir}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-3">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">Account Identifiers</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-slate-400 text-[11px]">Circuit / Link ID</div>
                        <div className="text-sm font-mono text-white flex items-center justify-between">
                          <span>{selectedVault.circuitId || "N/A"}</span>
                          {selectedVault.circuitId && (
                            <button onClick={() => copyToClipboard(selectedVault.circuitId, "Circuit ID")} className="text-slate-400 hover:text-white">
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[11px]">Account Number</div>
                        <div className="text-sm font-mono text-white flex items-center justify-between">
                          <span>{selectedVault.accountNumber || "N/A"}</span>
                          {selectedVault.accountNumber && (
                            <button onClick={() => copyToClipboard(selectedVault.accountNumber, "Account No")} className="text-slate-400 hover:text-white">
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-2xl bg-navy-950 border border-border space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">NOC Escalation &amp; Support Contact</div>
                    <p className="text-slate-200 font-mono text-xs">{selectedVault.supportContact}</p>
                  </div>
                </div>
              )}

              {/* TAB 3: CREDENTIALS VAULT */}
              {activeDossierTab === "credentials" && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Credentials stored locally and masked. Click the eye icon to reveal passwords.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Router Console */}
                    <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-teal-400" />
                        <span>Router / Firewall</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{selectedVault.routerAdminUrl}</div>
                      <div className="space-y-1 font-mono text-[11px] pt-1">
                        <div className="text-slate-300">User: <strong>{selectedVault.routerAdminUser}</strong></div>
                        <div className="flex items-center justify-between bg-navy-900 px-2 py-1 rounded">
                          <span>{revealedKeys["router_pass"] ? selectedVault.routerAdminPass : "••••••••••"}</span>
                          <button onClick={() => toggleReveal("router_pass")}>
                            {revealedKeys["router_pass"] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CCTV NVR */}
                    <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        <span>CCTV NVR Console</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{selectedVault.cctvNvrIp}</div>
                      <div className="space-y-1 font-mono text-[11px] pt-1">
                        <div className="text-slate-300">User: <strong>{selectedVault.cctvNvrUser}</strong></div>
                        <div className="flex items-center justify-between bg-navy-900 px-2 py-1 rounded">
                          <span>{revealedKeys["cctv_pass"] ? selectedVault.cctvNvrPass : "••••••••••"}</span>
                          <button onClick={() => toggleReveal("cctv_pass")}>
                            {revealedKeys["cctv_pass"] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Windows Server / RDP */}
                    <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                        <span>Server / RDP Host</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{selectedVault.serverRdpIp || "N/A"}</div>
                      <div className="space-y-1 font-mono text-[11px] pt-1">
                        <div className="text-slate-300">User: <strong>{selectedVault.serverRdpUser}</strong></div>
                        <div className="flex items-center justify-between bg-navy-900 px-2 py-1 rounded">
                          <span>{revealedKeys["server_pass"] ? selectedVault.serverRdpPass : "••••••••••"}</span>
                          <button onClick={() => toggleReveal("server_pass")}>
                            {revealedKeys["server_pass"] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LICENSES & RENEWALS */}
              {activeDossierTab === "renewals" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Domain Renewal */}
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Primary Domain (.co.ke / .com)</span>
                      {(() => {
                        const days = getDaysRemaining(selectedVault.domainExpiryDate);
                        if (days === null) return null;
                        if (days < 0) return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">Expired</span>;
                        if (days <= 30) return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">Expires in {days}d</span>;
                        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">{days}d remaining</span>;
                      })()}
                    </div>
                    <div className="text-base font-bold text-white font-mono">{selectedVault.domainName || "Not configured"}</div>
                    <div className="text-[11px] text-slate-400">Expiry Date: <strong className="text-slate-200">{selectedVault.domainExpiryDate || "N/A"}</strong></div>
                  </div>

                  {/* SSL Expiry */}
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">SSL / TLS Certificate</span>
                      {(() => {
                        const days = getDaysRemaining(selectedVault.sslExpiryDate);
                        if (days === null) return null;
                        if (days < 0) return <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">Expired</span>;
                        if (days <= 30) return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">Expires in {days}d</span>;
                        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">{days}d remaining</span>;
                      })()}
                    </div>
                    <div className="text-base font-bold text-white">Let's Encrypt / Commercial</div>
                    <div className="text-[11px] text-slate-400">Renewal Date: <strong className="text-slate-200">{selectedVault.sslExpiryDate || "N/A"}</strong></div>
                  </div>

                  {/* Microsoft 365 */}
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="text-slate-400">Microsoft 365 Cloud Licenses</div>
                    <div className="text-base font-bold text-white">{selectedVault.m365LicenseCount} Active Seats</div>
                    <div className="text-[11px] text-slate-400">Renewal: <strong className="text-slate-200">{selectedVault.m365RenewalDate || "N/A"}</strong></div>
                  </div>

                  {/* Endpoint Antivirus */}
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="text-slate-400">Endpoint Security / Antivirus</div>
                    <div className="text-base font-bold text-white">{selectedVault.antivirusBrand}</div>
                    <div className="text-[11px] text-slate-400">Subscription End: <strong className="text-slate-200">{selectedVault.antivirusExpiryDate || "N/A"}</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 5: SITE ACCESS & NOTES */}
              {activeDossierTab === "notes" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">Backup &amp; Disaster Recovery Policy</div>
                    <p className="text-slate-200 leading-relaxed font-mono text-xs">
                      {selectedVault.backupRetentionPolicy || "No backup policy specified."}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2">
                    <div className="text-[10px] font-mono uppercase text-teal-400 font-bold">Physical Site Access &amp; Engineering Instructions</div>
                    <p className="text-slate-200 leading-relaxed text-xs whitespace-pre-wrap">
                      {selectedVault.notes || "No special access instructions noted."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-navy-900 border border-border text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="font-bold text-white text-base">Select a Client Dossier</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Choose a client from the left list to view their network topology, ISP details, router credentials, and renewal schedule.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dossier Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-navy-900 border border-teal-500/40 p-6 md:p-8 space-y-6 shadow-2xl custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {editingId ? "Edit Client IT Dossier" : "Create New Client IT Vault"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Store network architecture, credentials, and ISP details securely.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVault} className="space-y-6 text-xs">
              {/* SECTION 1: Client Overview */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 border-b border-border/40 pb-1">
                  1. Client &amp; Location Overview
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peak Logistics Hub Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. David Mwangi"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +254 722 345 678"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-slate-300 font-semibold">Physical Location / Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Westlands, Nairobi (4th Floor)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Network & Wi-Fi */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 border-b border-border/40 pb-1">
                  2. IP Subnet &amp; Wi-Fi Topology
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Gateway IP</label>
                    <input
                      type="text"
                      value={formData.gatewayIp}
                      onChange={(e) => setFormData({ ...formData, gatewayIp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Subnet Mask</label>
                    <input
                      type="text"
                      value={formData.subnetMask}
                      onChange={(e) => setFormData({ ...formData, subnetMask: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">DHCP Range</label>
                    <input
                      type="text"
                      value={formData.dhcpRange}
                      onChange={(e) => setFormData({ ...formData, dhcpRange: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">VLAN Mapping &amp; Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. VLAN 10: Staff (192.168.10.0/24), VLAN 20: Guest (192.168.20.0/24)"
                      value={formData.vlans}
                      onChange={(e) => setFormData({ ...formData, vlans: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Staff Wi-Fi SSID</label>
                    <input
                      type="text"
                      value={formData.wifiSsidStaff}
                      onChange={(e) => setFormData({ ...formData, wifiSsidStaff: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Staff Wi-Fi Password</label>
                    <input
                      type="text"
                      value={formData.wifiPassStaff}
                      onChange={(e) => setFormData({ ...formData, wifiPassStaff: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Guest Wi-Fi Password</label>
                    <input
                      type="text"
                      value={formData.wifiPassGuest}
                      onChange={(e) => setFormData({ ...formData, wifiPassGuest: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: ISP Details */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 border-b border-border/40 pb-1">
                  3. ISP &amp; Bandwidth Circuit
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">ISP Provider</label>
                    <select
                      value={formData.ispProvider}
                      onChange={(e) => setFormData({ ...formData, ispProvider: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none text-xs"
                    >
                      <option value="Safaricom Business Fiber">Safaricom Business Fiber</option>
                      <option value="Zuku Fiber">Zuku Fiber</option>
                      <option value="Liquid Intelligent Tech">Liquid Intelligent Tech</option>
                      <option value="Faiba / JTL">Faiba / JTL</option>
                      <option value="Airtel Business">Airtel Business</option>
                      <option value="Starlink Business">Starlink Business</option>
                      <option value="Other">Other ISP</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Bandwidth Plan</label>
                    <input
                      type="text"
                      placeholder="e.g. 50 Mbps Dedicated CIR"
                      value={formData.bandwidthCir}
                      onChange={(e) => setFormData({ ...formData, bandwidthCir: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Circuit / Account No</label>
                    <input
                      type="text"
                      placeholder="e.g. SAF-88192"
                      value={formData.circuitId}
                      onChange={(e) => setFormData({ ...formData, circuitId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Credentials */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 border-b border-border/40 pb-1">
                  4. Hardware Console Logins
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Router Admin User</label>
                    <input
                      type="text"
                      value={formData.routerAdminUser}
                      onChange={(e) => setFormData({ ...formData, routerAdminUser: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">Router Admin Password</label>
                    <input
                      type="text"
                      value={formData.routerAdminPass}
                      onChange={(e) => setFormData({ ...formData, routerAdminPass: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold font-sans">CCTV NVR Password</label>
                    <input
                      type="text"
                      value={formData.cctvNvrPass}
                      onChange={(e) => setFormData({ ...formData, cctvNvrPass: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Renewals */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 border-b border-border/40 pb-1">
                  5. Domain &amp; License Expiry Dates
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Primary Domain</label>
                    <input
                      type="text"
                      placeholder="e.g. peaklogistics.co.ke"
                      value={formData.domainName}
                      onChange={(e) => setFormData({ ...formData, domainName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Domain Expiry Date</label>
                    <input
                      type="date"
                      value={formData.domainExpiryDate}
                      onChange={(e) => setFormData({ ...formData, domainExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">SSL Expiry Date</label>
                    <input
                      type="date"
                      value={formData.sslExpiryDate}
                      onChange={(e) => setFormData({ ...formData, sslExpiryDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
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
                  <span>{editingId ? "Save Changes" : "Create IT Dossier"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientVaultManager;

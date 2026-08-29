import React, { useState, useEffect, useRef } from "react";
import { 
  dataStorage, 
  InvoiceDocument, 
  InvoiceItem, 
  CompanyProfile, 
  SavedClient 
} from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Copy, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Send, 
  MessageCircle, 
  Building2, 
  Users, 
  Settings, 
  DollarSign, 
  ArrowLeft, 
  Upload, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Receipt,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

interface KrenovateInvoiceManagerProps {
  initialLead?: {
    name: string;
    phone: string;
    service?: string;
    details?: string;
    location?: string;
  } | null;
}

export const KrenovateInvoiceManager: React.FC<KrenovateInvoiceManagerProps> = ({ initialLead }) => {
  const { toast } = useToast();

  // Sub-view: "list" | "editor" | "preview" | "settings" | "clients"
  const [subView, setSubView] = useState<"list" | "editor" | "preview" | "settings" | "clients">("list");
  
  // Data state
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(dataStorage.getCompanyProfile());
  const [clients, setClients] = useState<SavedClient[]>([]);

  // Active document being created / edited / previewed
  const [currentDoc, setCurrentDoc] = useState<InvoiceDocument | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "quotation" | "invoice" | "receipt">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "sent" | "paid" | "overdue" | "accepted">("all");

  // Client modal / form state
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClient, setNewClient] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    kraPin: string;
  }>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "Nairobi, Kenya",
    kraPin: "",
  });

  const printRef = useRef<HTMLDivElement>(null);

  // Subscribe to storage changes
  useEffect(() => {
    const loadAll = () => {
      setInvoices(dataStorage.getInvoices());
      setCompanyProfile(dataStorage.getCompanyProfile());
      setClients(dataStorage.getClients());
    };
    loadAll();
    const unsubscribe = dataStorage.subscribe(loadAll);
    return () => unsubscribe();
  }, []);

  // Handle passed initialLead if arriving from Leads CRM
  useEffect(() => {
    if (initialLead) {
      handleCreateNewDoc("quotation", {
        name: initialLead.name,
        company: initialLead.name + " Business",
        phone: initialLead.phone,
        address: initialLead.location || "Nairobi, Kenya",
      }, [
        {
          id: `item-${Date.now()}-1`,
          desc: initialLead.service ? `${initialLead.service}: ${initialLead.details || "Professional setup & deployment"}` : "IT Consultancy & Infrastructure Setup",
          qty: 1,
          unitPrice: 20000,
        }
      ]);
    }
  }, [initialLead]);

  // Create new blank document
  const handleCreateNewDoc = (
    docType: "quotation" | "invoice" | "receipt" = "quotation",
    clientOverride?: Partial<InvoiceDocument["client"]>,
    itemsOverride?: InvoiceItem[]
  ) => {
    const nextNumber = dataStorage.getNextDocNumber(docType);
    const profile = dataStorage.getCompanyProfile();

    const newDoc: InvoiceDocument = {
      id: "",
      docType,
      docNumber: nextNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + (profile.defaultPaymentTermsDays || 14) * 86400000).toISOString().slice(0, 10),
      status: "draft",
      client: {
        name: clientOverride?.name || "",
        company: clientOverride?.company || "",
        email: clientOverride?.email || "",
        phone: clientOverride?.phone || "",
        address: clientOverride?.address || "Nairobi, Kenya",
        kraPin: clientOverride?.kraPin || "",
      },
      items: itemsOverride || [
        {
          id: `item-${Date.now()}-1`,
          desc: "Ubiquiti UniFi Long-Range Wi-Fi 6 Access Point (Installed & Configured)",
          qty: 2,
          unitPrice: 18500,
        },
        {
          id: `item-${Date.now()}-2`,
          desc: "16-Port Gigabit Managed PoE+ Network Switch with VLAN Traffic Isolation",
          qty: 1,
          unitPrice: 24500,
        },
      ],
      discountType: "flat",
      discountValue: 0,
      vatEnabled: profile.defaultVatPercent > 0,
      vatPercent: profile.defaultVatPercent || 16,
      currency: profile.currency || "KES",
      notes: profile.notesTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentDoc(newDoc);
    setSubView("editor");
  };

  // Math calculation helper
  const calculateDocTotals = (doc: InvoiceDocument) => {
    const rawSubtotal = doc.items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
    
    let discountAmount = 0;
    if (doc.discountType === "percentage") {
      discountAmount = (rawSubtotal * (doc.discountValue || 0)) / 100;
    } else {
      discountAmount = doc.discountValue || 0;
    }

    const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);
    const vatAmount = doc.vatEnabled ? (discountedSubtotal * (doc.vatPercent || 16)) / 100 : 0;
    const grandTotal = discountedSubtotal + vatAmount;

    return {
      rawSubtotal,
      discountAmount,
      discountedSubtotal,
      vatAmount,
      grandTotal,
    };
  };

  // Line item handlers
  const handleAddItem = () => {
    if (!currentDoc) return;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      desc: "New Service / Hardware Item",
      qty: 1,
      unitPrice: 5000,
    };
    setCurrentDoc({
      ...currentDoc,
      items: [...currentDoc.items, newItem],
    });
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, val: string | number) => {
    if (!currentDoc) return;
    setCurrentDoc({
      ...currentDoc,
      items: currentDoc.items.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    });
  };

  const handleRemoveItem = (id: string) => {
    if (!currentDoc) return;
    if (currentDoc.items.length <= 1) {
      toast({
        title: "At least one item required",
        description: "A document must have at least one line item.",
        variant: "destructive",
      });
      return;
    }
    setCurrentDoc({
      ...currentDoc,
      items: currentDoc.items.filter((item) => item.id !== id),
    });
  };

  // Client Selection Handler
  const handleSelectClient = (clientId: string) => {
    if (!currentDoc) return;
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    setCurrentDoc({
      ...currentDoc,
      client: {
        id: client.id,
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        kraPin: client.kraPin || "",
      },
    });

    toast({
      title: "Client Autofilled",
      description: `Loaded details for ${client.company}.`,
    });
  };

  // Save current document
  const handleSaveDocument = (andPreview = false) => {
    if (!currentDoc) return;
    if (!currentDoc.client.name.trim() || !currentDoc.client.company.trim()) {
      toast({
        title: "Client Name & Company Required",
        description: "Please specify who this document is addressed to.",
        variant: "destructive",
      });
      return;
    }

    const saved = dataStorage.saveInvoice(currentDoc);
    setCurrentDoc(saved);

    toast({
      title: `${currentDoc.docType === "quotation" ? "Quotation" : "Invoice"} Saved! 💾`,
      description: `${saved.docNumber} has been recorded.`,
    });

    if (andPreview) {
      setSubView("preview");
    } else {
      setSubView("list");
    }
  };

  // Duplicate document
  const handleDuplicate = (id: string) => {
    const duplicated = dataStorage.duplicateInvoice(id);
    if (duplicated) {
      toast({
        title: "Document Cloned! 📄",
        description: `Created new draft ${duplicated.docNumber}.`,
      });
      setCurrentDoc(duplicated);
      setSubView("editor");
    }
  };

  // Delete document
  const handleDeleteDoc = (id: string, docNumber: string) => {
    if (window.confirm(`Are you sure you want to delete ${docNumber}?`)) {
      dataStorage.deleteInvoice(id);
      toast({
        title: "Document Deleted",
        description: `${docNumber} has been removed.`,
      });
      if (currentDoc?.id === id) {
        setCurrentDoc(null);
        setSubView("list");
      }
    }
  };

  // Save Company Profile Settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveCompanyProfile(companyProfile);
    toast({
      title: "Krenovate Profile Saved! 🏢",
      description: "Company details and payment accounts updated.",
    });
    setSubView("list");
  };

  // Handle Logo Upload (Base64 data URL)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a logo smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCompanyProfile((prev) => ({ ...prev, logoUrl: base64 }));
      toast({
        title: "Logo Uploaded Successfully",
        description: "Logo saved to company branding.",
      });
    };
    reader.readAsDataURL(file);
  };

  // Save new client from modal
  const handleSaveClientModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name.trim() || !newClient.company.trim()) {
      toast({
        title: "Name & Company Required",
        description: "Please enter client contact and company name.",
        variant: "destructive",
      });
      return;
    }

    const saved = dataStorage.saveClient(newClient);
    toast({
      title: "Client Added to Directory! 👥",
      description: `${saved.company} is ready for 1-click invoice selection.`,
    });

    if (currentDoc) {
      setCurrentDoc({
        ...currentDoc,
        client: {
          id: saved.id,
          name: saved.name,
          company: saved.company,
          email: saved.email,
          phone: saved.phone,
          address: saved.address,
          kraPin: saved.kraPin,
        },
      });
    }

    setShowClientModal(false);
    setNewClient({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "Nairobi, Kenya",
      kraPin: "",
    });
  };

  // Delete saved client
  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`Delete client record for ${name}?`)) {
      dataStorage.deleteClient(id);
      toast({
        title: "Client Removed",
        description: "Client contact removed from directory.",
      });
    }
  };

  // WhatsApp Message Generator for Invoices / Quotes
  const generateDocWhatsAppMessage = (doc: InvoiceDocument) => {
    const totals = calculateDocTotals(doc);
    const profile = companyProfile;

    if (doc.docType === "quotation") {
      return `Dear ${doc.client.name},\n\n*${profile.name}* has prepared your formal quotation:\n\n📄 *Quote No:* ${doc.docNumber}\n🏢 *Client:* ${doc.client.company}\n💰 *Total Amount:* ${doc.currency} ${totals.grandTotal.toLocaleString()}\n📅 *Valid Until:* ${doc.dueDate}\n\n*Key Deliverables:*\n${doc.items.map((i) => `• ${i.desc} (${i.qty}x)`).join("\n")}\n\nPayment via ${profile.mpesaType}: ${profile.mpesaNumber} (${profile.mpesaAccount}) or Bank: ${profile.bankName} Acc: ${profile.bankAccountNumber}.\n\nPlease let us know if you would like us to schedule on-site deployment.`;
    } else {
      return `Dear ${doc.client.name},\n\n*${profile.name}* Official Tax Invoice:\n\n📄 *Invoice No:* ${doc.docNumber}\n🏢 *Bill To:* ${doc.client.company}\n💰 *Amount Due:* ${doc.currency} ${totals.grandTotal.toLocaleString()}\n📅 *Due Date:* ${doc.dueDate}\n📌 *Status:* ${doc.status.toUpperCase()}\n\n*Payment Details:*\n• ${profile.mpesaType}: ${profile.mpesaNumber} (${profile.mpesaAccount})\n• Bank: ${profile.bankName} | Acc: ${profile.bankAccountNumber}\n\nThank you for choosing ${profile.name}!`;
    }
  };

  // Filtered document list
  const filteredInvoices = invoices.filter((doc) => {
    if (typeFilter !== "all" && doc.docType !== typeFilter) return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.docNumber.toLowerCase().includes(q) ||
        doc.client.name.toLowerCase().includes(q) ||
        doc.client.company.toLowerCase().includes(q) ||
        doc.items.some((i) => i.desc.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // KPI Calculations
  const totalRevenuePaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + calculateDocTotals(inv).grandTotal, 0);

  const totalOutstanding = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((acc, inv) => acc + calculateDocTotals(inv).grandTotal, 0);

  const totalQuotesValue = invoices
    .filter((inv) => inv.docType === "quotation")
    .reduce((acc, inv) => acc + calculateDocTotals(inv).grandTotal, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* TOP NAVIGATION TABS FOR INVOICE SUITE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-extrabold text-lg text-white flex flex-wrap items-center gap-2">
              <span>Krenovate Systems</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-bold whitespace-nowrap">
                Invoice &amp; Quote Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              Create, customize, print, and export branded client proposals and tax invoices.
            </p>
          </div>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubView("list")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              subView === "list"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-navy-900 text-slate-300 hover:text-white border border-border"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Docs</span>
              <span className="sm:hidden">Docs</span>
              <span>({invoices.length})</span>
            </span>
          </button>

          <button
            onClick={() => setSubView("clients")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              subView === "clients"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-navy-900 text-slate-300 hover:text-white border border-border"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Clients ({clients.length})</span>
            </span>
          </button>

          <button
            onClick={() => setSubView("settings")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              subView === "settings"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-navy-900 text-slate-300 hover:text-white border border-border"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Company Branding</span>
              <span className="sm:hidden">Settings</span>
            </span>
          </button>

          <button
            onClick={() => handleCreateNewDoc("quotation")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shadow-glow whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Quote / Invoice</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD LIST VIEW                                                    */}
      {/* ========================================================================= */}
      {subView === "list" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Revenue Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-navy-900 border border-border/80 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Total Invoiced (Paid)
              </span>
              <p className="text-2xl font-heading font-black text-emerald-400 font-mono">
                KES {totalRevenuePaid.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">
                {invoices.filter((i) => i.status === "paid").length} settled invoices
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-navy-900 border border-border/80 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Awaiting Payment
              </span>
              <p className="text-2xl font-heading font-black text-amber-400 font-mono">
                KES {totalOutstanding.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">
                {invoices.filter((i) => i.status === "sent" || i.status === "overdue").length} open invoices
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-navy-900 border border-border/80 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Quotes Pipeline
              </span>
              <p className="text-2xl font-heading font-black text-teal-400 font-mono">
                KES {totalQuotesValue.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">
                {invoices.filter((i) => i.docType === "quotation").length} active proposals
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-navy-900 border border-border/80 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Corporate Clients
              </span>
              <p className="text-2xl font-heading font-black text-white font-mono">
                {clients.length}
              </p>
              <span className="text-[11px] text-slate-400">
                Saved for 1-click billing
              </span>
            </div>
          </div>

          {/* Search, Filters, & Document Type Buttons */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doc #, client, company, or item..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "all" | "quotation" | "invoice" | "receipt")}
                className="px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none"
              >
                <option value="all">All Document Types</option>
                <option value="quotation">Quotations Only</option>
                <option value="invoice">Invoices Only</option>
                <option value="receipt">Receipts Only</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "draft" | "sent" | "paid" | "overdue" | "accepted")}
                className="px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
          </div>

          {/* Invoices & Quotes Table */}
          <div className="rounded-3xl bg-navy-900 border border-border/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto -mx-0">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead>
                  <tr className="bg-navy-950/80 border-b border-border/80 text-slate-400 font-mono text-[11px]">
                    <th className="py-3.5 px-4 font-bold">DOC #</th>
                    <th className="py-3.5 px-4 font-bold">TYPE</th>
                    <th className="py-3.5 px-4 font-bold">CLIENT &amp; COMPANY</th>
                    <th className="py-3.5 px-4 font-bold">DATE / DUE</th>
                    <th className="py-3.5 px-4 font-bold">STATUS</th>
                    <th className="py-3.5 px-4 font-bold text-right">TOTAL (KES)</th>
                    <th className="py-3.5 px-4 font-bold text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="font-semibold">No invoices or quotations match your filter.</p>
                        <button
                          onClick={() => handleCreateNewDoc("quotation")}
                          className="mt-3 inline-flex items-center gap-1 text-xs text-teal-400 hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create a new document</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((doc) => {
                      const totals = calculateDocTotals(doc);
                      return (
                        <tr key={doc.id} className="hover:bg-navy-800/50 transition-colors">
                          {/* Doc Number */}
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {doc.docNumber}
                          </td>

                          {/* Doc Type */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                                doc.docType === "quotation"
                                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                                  : doc.docType === "invoice"
                                  ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                  : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                              }`}
                            >
                              {doc.docType}
                            </span>
                          </td>

                          {/* Client */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{doc.client.company || doc.client.name}</div>
                            <div className="text-[11px] text-slate-400">{doc.client.name} &bull; {doc.client.phone}</div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                            <div>Issued: {doc.issueDate}</div>
                            <div className="text-slate-400">Due: {doc.dueDate}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <select
                              value={doc.status}
                              onChange={(e) => dataStorage.updateInvoiceStatus(doc.id, e.target.value as "draft" | "sent" | "paid" | "overdue" | "accepted")}
                              className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-lg border focus:outline-none ${
                                doc.status === "paid"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : doc.status === "sent"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : doc.status === "accepted"
                                  ? "bg-teal-500/10 text-teal-300 border-teal-500/30"
                                  : doc.status === "overdue"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  : "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              <option value="draft">Draft</option>
                              <option value="sent">Sent</option>
                              <option value="accepted">Accepted</option>
                              <option value="paid">Paid</option>
                              <option value="overdue">Overdue</option>
                            </select>
                          </td>

                          {/* Grand Total */}
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                            {doc.currency} {totals.grandTotal.toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              {/* Preview */}
                              <button
                                onClick={() => {
                                  setCurrentDoc(doc);
                                  setSubView("preview");
                                }}
                                title="Preview & Print PDF"
                                className="p-1.5 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-border hover:border-teal-500"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setCurrentDoc(doc);
                                  setSubView("editor");
                                }}
                                title="Edit Document"
                                className="p-1.5 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-border hover:border-teal-500"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Clone / Duplicate */}
                              <button
                                onClick={() => handleDuplicate(doc.id)}
                                title="Duplicate as new draft"
                                className="p-1.5 rounded-lg bg-navy-950 text-slate-300 hover:text-teal-400 border border-border"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* WhatsApp Share */}
                              <a
                                href={`https://wa.me/${doc.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  generateDocWhatsAppMessage(doc)
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Share via WhatsApp"
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteDoc(doc.id, doc.docNumber)}
                                title="Delete Document"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DOCUMENT CREATOR & EDITOR                                              */}
      {/* ========================================================================= */}
      {subView === "editor" && currentDoc && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900 border border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSubView("list")}
                className="p-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white border border-border"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  {currentDoc.id ? "Edit Document" : "Create New Document"}: {currentDoc.docNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in client details and line items. Calculations are automated in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveDocument(false)}
                className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-200 border border-border text-xs font-bold transition-all"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSaveDocument(true)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shadow-glow"
              >
                <Printer className="w-4 h-4" />
                <span>Save &amp; Preview PDF</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Col: Document Meta & Client Info */}
            <div className="lg:col-span-8 space-y-6">
              {/* Document Type & Number Details */}
              <div className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Document Type
                    </label>
                    <select
                      value={currentDoc.docType}
                      onChange={(e) => {
                        const newType = e.target.value as "quotation" | "invoice" | "receipt";
                        const nextNum = dataStorage.getNextDocNumber(newType);
                        setCurrentDoc({ ...currentDoc, docType: newType, docNumber: nextNum });
                      }}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-bold"
                    >
                      <option value="quotation">Formal Quotation / Proposal</option>
                      <option value="invoice">Official Tax Invoice</option>
                      <option value="receipt">Job Completion Receipt</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Document Number
                    </label>
                    <input
                      type="text"
                      value={currentDoc.docNumber}
                      onChange={(e) => setCurrentDoc({ ...currentDoc, docNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-teal-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Document Status
                    </label>
                    <select
                      value={currentDoc.status}
                      onChange={(e) => setCurrentDoc({ ...currentDoc, status: e.target.value as "draft" | "sent" | "paid" | "overdue" | "accepted" })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={currentDoc.issueDate}
                      onChange={(e) => setCurrentDoc({ ...currentDoc, issueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      {currentDoc.docType === "quotation" ? "Validity End Date" : "Payment Due Date"}
                    </label>
                    <input
                      type="date"
                      value={currentDoc.dueDate}
                      onChange={(e) => setCurrentDoc({ ...currentDoc, dueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Client Bill-To Information */}
              <div className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span>Client / Bill-To Details:</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Quick select saved client */}
                    {clients.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleSelectClient(e.target.value);
                        }}
                        defaultValue=""
                        className="px-3 py-1.5 text-xs rounded-xl bg-navy-950 border border-teal-500/40 text-teal-300 focus:outline-none"
                      >
                        <option value="" disabled>Autofill from saved clients...</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.company} ({c.name})
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowClientModal(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-navy-950 text-slate-300 hover:text-white text-xs border border-border flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Client</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={currentDoc.client.company}
                      onChange={(e) => setCurrentDoc({
                        ...currentDoc,
                        client: { ...currentDoc.client, company: e.target.value }
                      })}
                      placeholder="e.g. Peak Logistics Hub Ltd"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={currentDoc.client.name}
                      onChange={(e) => setCurrentDoc({
                        ...currentDoc,
                        client: { ...currentDoc.client, name: e.target.value }
                      })}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={currentDoc.client.phone}
                      onChange={(e) => setCurrentDoc({
                        ...currentDoc,
                        client: { ...currentDoc.client, phone: e.target.value }
                      })}
                      placeholder="e.g. +254 722 000 000"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Client Email (Optional)</label>
                    <input
                      type="email"
                      value={currentDoc.client.email || ""}
                      onChange={(e) => setCurrentDoc({
                        ...currentDoc,
                        client: { ...currentDoc.client, email: e.target.value }
                      })}
                      placeholder="e.g. accounts@peaklogistics.co.ke"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Physical Address / City</label>
                    <input
                      type="text"
                      value={currentDoc.client.address}
                      onChange={(e) => setCurrentDoc({
                        ...currentDoc,
                        client: { ...currentDoc.client, address: e.target.value }
                      })}
                      placeholder="e.g. Mombasa Rd, Nairobi"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Client KRA PIN (Optional)</label>
                    <input
                      type="text"
                      value={currentDoc.client.kraPin || ""}
                      onChange={(e) => setCurrentDoc({
                        ...currentDoc,
                        client: { ...currentDoc.client, kraPin: e.target.value }
                      })}
                      placeholder="e.g. P051122334A"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="font-heading font-bold text-sm text-white">
                    Itemized Services &amp; Hardware:
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {currentDoc.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-navy-950 border border-border/80 flex flex-col md:flex-row items-start md:items-center gap-3"
                    >
                      <span className="text-xs font-mono font-bold text-slate-500 w-6">
                        #{idx + 1}
                      </span>

                      {/* Description */}
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          required
                          value={item.desc}
                          onChange={(e) => handleUpdateItem(item.id, "desc", e.target.value)}
                          placeholder="Item or service description..."
                          className="w-full px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      {/* Qty */}
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, "qty", parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white text-center font-mono"
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white text-right font-mono"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="w-28 text-right font-mono font-bold text-teal-400 text-xs">
                        {currentDoc.currency} {(item.qty * item.unitPrice).toLocaleString()}
                      </div>

                      {/* Delete item */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Terms, Notes &amp; Payment Conditions
                </label>
                <textarea
                  rows={4}
                  value={currentDoc.notes}
                  onChange={(e) => setCurrentDoc({ ...currentDoc, notes: e.target.value })}
                  placeholder="Payment terms, warranty periods, delivery milestones..."
                  className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none font-mono"
                />
              </div>
            </div>

            {/* Right Col: Financial Math & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* Financial Calculation Summary Card */}
              {(() => {
                const totals = calculateDocTotals(currentDoc);
                return (
                  <div className="p-6 rounded-3xl bg-navy-900 border border-teal-500/40 space-y-5 shadow-glow">
                    <div className="pb-3 border-b border-border">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                        Live Auto-Calculation
                      </span>
                      <h4 className="font-heading font-bold text-lg text-white">
                        Financial Summary
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      {/* Subtotal */}
                      <div className="flex justify-between text-slate-300">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-white">
                          {currentDoc.currency} {totals.rawSubtotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Discount Setting */}
                      <div className="pt-2 border-t border-border/60 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Discount:</span>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={currentDoc.discountType}
                              onChange={(e) => setCurrentDoc({ ...currentDoc, discountType: e.target.value as "flat" | "percentage" })}
                              className="px-2 py-1 text-[11px] rounded-lg bg-navy-950 border border-border text-white"
                            >
                              <option value="flat">Flat ({currentDoc.currency})</option>
                              <option value="percentage">Percentage (%)</option>
                            </select>
                            <input
                              type="number"
                              min="0"
                              value={currentDoc.discountValue}
                              onChange={(e) => setCurrentDoc({ ...currentDoc, discountValue: parseFloat(e.target.value) || 0 })}
                              className="w-16 px-2 py-1 text-[11px] rounded-lg bg-navy-950 border border-border text-right text-white"
                            />
                          </div>
                        </div>
                        {totals.discountAmount > 0 && (
                          <div className="flex justify-between text-amber-400 text-[11px]">
                            <span>Discount Deducted:</span>
                            <span>- {currentDoc.currency} {totals.discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* VAT Setting */}
                      <div className="pt-2 border-t border-border/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={currentDoc.vatEnabled}
                              onChange={(e) => setCurrentDoc({ ...currentDoc, vatEnabled: e.target.checked })}
                              className="rounded border-border text-teal-600 focus:ring-teal-500"
                            />
                            <span>Include VAT (16%)</span>
                          </label>
                          <span className="text-slate-400">{currentDoc.vatPercent}%</span>
                        </div>
                        {currentDoc.vatEnabled && (
                          <div className="flex justify-between text-teal-300 text-[11px]">
                            <span>VAT (16% KRA):</span>
                            <span>+ {currentDoc.currency} {totals.vatAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Grand Total */}
                      <div className="pt-3 border-t border-teal-500/40 flex justify-between items-baseline">
                        <span className="font-heading font-extrabold text-sm text-white">Grand Total:</span>
                        <span className="font-heading font-black text-2xl text-teal-400">
                          {currentDoc.currency} {totals.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveDocument(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all shadow-glow"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Preview &amp; Print PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveDocument(false)}
                        className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 border border-border text-xs font-bold transition-all"
                      >
                        Save &amp; Return to List
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Company Profile Quick Card */}
              <div className="p-5 rounded-3xl bg-navy-900 border border-border/80 space-y-2 text-xs text-slate-400">
                <div className="flex items-center justify-between text-white font-bold pb-2 border-b border-border/60">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    <span>{companyProfile.name}</span>
                  </span>
                  <button
                    onClick={() => setSubView("settings")}
                    className="text-teal-400 hover:underline text-[11px]"
                  >
                    Edit Branding
                  </button>
                </div>
                <p>PIN: <strong className="text-slate-200">{companyProfile.kraPin}</strong></p>
                <p>M-Pesa: <strong className="text-slate-200">{companyProfile.mpesaType} {companyProfile.mpesaNumber}</strong></p>
                <p>Bank: <strong className="text-slate-200">{companyProfile.bankName} - {companyProfile.bankAccountNumber}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PREVIEW & PRINT READY A4 TEMPLATE                                      */}
      {/* ========================================================================= */}
      {subView === "preview" && currentDoc && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Action Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900 border border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSubView("editor")}
                className="p-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white border border-border"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Document Preview: {currentDoc.docNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Print directly to A4 or Save as PDF.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubView("editor")}
                className="px-4 py-2 rounded-xl bg-navy-950 text-slate-200 hover:text-white border border-border text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Items</span>
              </button>

              <a
                href={`https://wa.me/${currentDoc.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  generateDocWhatsAppMessage(currentDoc)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shadow-glow"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF (A4)</span>
              </button>
            </div>
          </div>

          {/* PRINT-READY A4 CANVAS (Styled for both dark UI preview & crisp white paper print) */}
          <div className="flex justify-center">
            <div
              ref={printRef}
              id="krenovate-print-document"
              className="w-full max-w-[820px] bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 print:p-0 print:shadow-none print:rounded-none font-sans"
            >
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-200">
                {/* Company Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    {companyProfile.logoUrl ? (
                      <img
                        src={companyProfile.logoUrl}
                        alt={companyProfile.name}
                        className="h-12 w-auto object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center font-black text-white text-2xl">
                        K
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {companyProfile.name}
                      </h1>
                      <p className="text-xs text-teal-700 font-semibold">
                        {companyProfile.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-0.5 pt-2">
                    <p>{companyProfile.address}</p>
                    <p>Phone: {companyProfile.phone} &bull; Email: {companyProfile.email}</p>
                    <p>Web: {companyProfile.website} &bull; KRA PIN: <strong>{companyProfile.kraPin}</strong></p>
                  </div>
                </div>

                {/* Doc Title & Meta */}
                <div className="sm:text-right space-y-1">
                  <div className="inline-block px-4 py-1.5 rounded-lg bg-teal-800 text-white font-black text-sm uppercase tracking-wider">
                    {currentDoc.docType === "quotation"
                      ? "FORMAL QUOTATION"
                      : currentDoc.docType === "invoice"
                      ? "TAX INVOICE"
                      : "OFFICIAL RECEIPT"}
                  </div>

                  <div className="text-xs text-slate-700 pt-2 space-y-0.5 font-mono">
                    <p><span className="text-slate-500">Document No:</span> <strong className="text-slate-900">{currentDoc.docNumber}</strong></p>
                    <p><span className="text-slate-500">Date Issued:</span> {currentDoc.issueDate}</p>
                    <p><span className="text-slate-500">{currentDoc.docType === "quotation" ? "Valid Until:" : "Due Date:"}</span> {currentDoc.dueDate}</p>
                    <p><span className="text-slate-500">Status:</span> <strong className="uppercase text-teal-800">{currentDoc.status}</strong></p>
                  </div>
                </div>
              </div>

              {/* Bill To Block */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Billed To / Client Details:
                  </span>
                  <h4 className="font-black text-slate-900 text-sm">{currentDoc.client.company}</h4>
                  <p className="text-slate-700">{currentDoc.client.name}</p>
                  <p className="text-slate-600">{currentDoc.client.address}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Client Contact:
                  </span>
                  <p className="text-slate-800 font-mono">{currentDoc.client.phone}</p>
                  {currentDoc.client.email && <p className="text-slate-600">{currentDoc.client.email}</p>}
                  {currentDoc.client.kraPin && (
                    <p className="text-slate-600 font-mono">PIN: {currentDoc.client.kraPin}</p>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-800 text-white font-mono text-[11px]">
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-4">ITEM / SERVICE DESCRIPTION</th>
                      <th className="py-3 px-3 text-center w-16">QTY</th>
                      <th className="py-3 px-4 text-right w-28">UNIT ({currentDoc.currency})</th>
                      <th className="py-3 px-4 text-right w-32">TOTAL ({currentDoc.currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentDoc.items.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                        <td className="py-3 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.desc}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-800">{item.qty}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-800">
                          {item.unitPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {(item.qty * item.unitPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              {(() => {
                const totals = calculateDocTotals(currentDoc);
                return (
                  <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
                    {/* Left: Notes and Conditions */}
                    <div className="flex-1 space-y-2 text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                        Terms &amp; Payment Conditions:
                      </span>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed text-[11px]">
                        {currentDoc.notes}
                      </div>
                    </div>

                    {/* Right: Math Totals Box */}
                    <div className="w-full sm:w-72 rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-bold text-slate-900">
                          {currentDoc.currency} {totals.rawSubtotal.toLocaleString()}
                        </span>
                      </div>

                      {totals.discountAmount > 0 && (
                        <div className="flex justify-between text-amber-700">
                          <span>Discount:</span>
                          <span>- {currentDoc.currency} {totals.discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      {currentDoc.vatEnabled && (
                        <div className="flex justify-between text-slate-600">
                          <span>VAT (16% KRA):</span>
                          <span>+ {currentDoc.currency} {totals.vatAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t-2 border-slate-800 flex justify-between items-baseline text-sm">
                        <span className="font-black text-slate-900">GRAND TOTAL:</span>
                        <span className="font-black text-teal-800 text-lg">
                          {currentDoc.currency} {totals.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Payment Instructions & Official Stamp Footer */}
              <div className="pt-6 border-t-2 border-slate-200 grid sm:grid-cols-2 gap-6 items-end text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Official Payment Instructions:
                  </span>
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-0.5 font-mono text-[11px]">
                    <p><strong>M-Pesa {companyProfile.mpesaType}:</strong> {companyProfile.mpesaNumber}</p>
                    <p><strong>Account Name:</strong> {companyProfile.mpesaAccount}</p>
                    <p><strong>Bank:</strong> {companyProfile.bankName} &bull; Acc: {companyProfile.bankAccountNumber}</p>
                    <p><strong>Branch:</strong> {companyProfile.bankBranch}</p>
                  </div>
                </div>

                <div className="text-right space-y-3">
                  <div className="inline-block text-center border-b border-slate-400 pb-1 w-48">
                    <span className="font-script text-lg text-slate-800 font-bold block">
                      {companyProfile.authorizedSignatory}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Authorized Signature &amp; Stamp
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Generated by {companyProfile.name} Enterprise Management System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPANY PROFILE & PAYMENT SETTINGS                                     */}
      {/* ========================================================================= */}
      {subView === "settings" && (
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
          <div className="p-8 rounded-3xl bg-navy-900 border border-border space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Krenovate Systems Company Profile
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure your business info once. It automatically populates all new quotes and invoices.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSubView("list")}
                className="px-3 py-1.5 rounded-xl bg-navy-950 text-slate-300 hover:text-white text-xs border border-border"
              >
                Back to Documents
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Logo upload */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {companyProfile.logoUrl ? (
                    <img
                      src={companyProfile.logoUrl}
                      alt="Company Logo"
                      className="h-12 w-auto max-w-[120px] object-contain rounded-lg bg-white p-1"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white text-xl">
                      K
                    </div>
                  )}
                  <div>
                    <span className="font-heading font-bold text-sm text-white block">
                      Company Brand Logo
                    </span>
                    <span className="text-xs text-slate-400">
                      Upload PNG or JPEG to appear on official PDFs and printouts.
                    </span>
                  </div>
                </div>

                <label className="cursor-pointer px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-teal-300 text-xs font-bold border border-border flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tagline / Business Subtitle</label>
                  <input
                    type="text"
                    value={companyProfile.tagline}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={companyProfile.email}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Phone</label>
                  <input
                    type="tel"
                    required
                    value={companyProfile.phone}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Website</label>
                  <input
                    type="text"
                    value={companyProfile.website}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">KRA PIN / Registration No.</label>
                  <input
                    type="text"
                    value={companyProfile.kraPin}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, kraPin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Authorized Signatory Name</label>
                  <p className="text-[10px] text-slate-500 mb-1.5">Appears on the signature line of all official documents. Use your company name to stay anonymous.</p>
                  <input
                    type="text"
                    value={companyProfile.authorizedSignatory}
                    onChange={(e) => setCompanyProfile({ ...companyProfile, authorizedSignatory: e.target.value })}
                    placeholder="e.g. Krenovate Systems, Peter J, Director"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Physical Address</label>
                <input
                  type="text"
                  value={companyProfile.address}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              {/* Payment Details */}
              <div className="pt-4 border-t border-border/80 space-y-4">
                <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-400" />
                  <span>Payment Account Instructions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">M-Pesa Type</label>
                    <select
                      value={companyProfile.mpesaType}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, mpesaType: e.target.value as "Paybill" | "Till" | "Buy Goods" })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    >
                      <option value="Paybill">Paybill</option>
                      <option value="Till">Buy Goods (Till)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Paybill / Till Number</label>
                    <input
                      type="text"
                      value={companyProfile.mpesaNumber}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, mpesaNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Account Name / Number</label>
                    <input
                      type="text"
                      value={companyProfile.mpesaAccount}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, mpesaAccount: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={companyProfile.bankName}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, bankName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Account Number</label>
                    <input
                      type="text"
                      value={companyProfile.bankAccountNumber}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, bankAccountNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Branch</label>
                    <input
                      type="text"
                      value={companyProfile.bankBranch}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, bankBranch: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Default Terms Template */}
              <div className="pt-4 border-t border-border/80 space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Default Terms &amp; Warranty Conditions
                </label>
                <textarea
                  rows={3}
                  value={companyProfile.notesTemplate}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, notesTemplate: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all shadow-glow"
              >
                Save Krenovate Company Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SAVED CLIENTS DIRECTORY                                                */}
      {/* ========================================================================= */}
      {subView === "clients" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Saved Client Directory
              </h3>
              <p className="text-xs text-slate-400">
                Save your regular corporate clients once to generate new quotes and invoices in seconds.
              </p>
            </div>

            <button
              onClick={() => setShowClientModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-navy-900 border border-border/80 space-y-3 shadow-sm hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-white">{c.company}</span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                      {c.kraPin ? `PIN: ${c.kraPin}` : "Corporate Client"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-semibold">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.address}</p>
                  <p className="text-xs font-mono text-slate-400">{c.phone} {c.email ? `• ${c.email}` : ""}</p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleCreateNewDoc("quotation", {
                        id: c.id,
                        name: c.name,
                        company: c.company,
                        phone: c.phone,
                        email: c.email,
                        address: c.address,
                        kraPin: c.kraPin,
                      });
                    }}
                    className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Quote</span>
                  </button>

                  <button
                    onClick={() => handleDeleteClient(c.id, c.company)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CLIENT MODAL                                                              */}
      {/* ========================================================================= */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-teal-500/30 p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white">
              Add New Client to Directory
            </h3>

            <form onSubmit={handleSaveClientModal} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="e.g. Peak Logistics Hub Ltd"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. David Mwangi"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+254 722..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">City / Physical Address</label>
                  <input
                    type="text"
                    value={newClient.address}
                    onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                    placeholder="Mombasa Rd, Nairobi"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">KRA PIN (Optional)</label>
                  <input
                    type="text"
                    value={newClient.kraPin}
                    onChange={(e) => setNewClient({ ...newClient, kraPin: e.target.value })}
                    placeholder="P05..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
                >
                  Save Client
                </button>
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-navy-950 text-slate-400 text-xs border border-border"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KrenovateInvoiceManager;

import React, { useState, useEffect, useRef } from "react";
import { 
  dataStorage, 
  InvoiceDocument, 
  InvoiceItem, 
  CompanyProfile, 
  SavedClient,
  InquiryLead
} from "@/services/dataStorage";
import { 
  TURNKEY_PACKAGES, 
  CATALOG_ITEMS, 
  TurnkeyPackage, 
  CatalogItem, 
  generateItemsFromPrompt 
} from "@/data/invoicePresets";
import { resendService } from "@/services/resendService";
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
  AlertCircle,
  Wifi,
  Laptop,
  Globe,
  Zap,
  Check,
  ArrowRight,
  Layers,
  Wand2,
  Mail,
  X,
  Loader2,
  RotateCcw,
  AlertTriangle
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

  // Sub-view: "list" | "editor" | "preview" | "settings" | "clients" | "bin"
  const [subView, setSubView] = useState<"list" | "editor" | "preview" | "settings" | "clients" | "bin">("list");
  
  // Data state
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [deletedInvoices, setDeletedInvoices] = useState<InvoiceDocument[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(dataStorage.getCompanyProfile());
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [inquiries, setInquiries] = useState<InquiryLead[]>([]);

  // Zero-typing & AI generators
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>("All");
  const [smartPrompt, setSmartPrompt] = useState("");
  const [isGeneratingSmart, setIsGeneratingSmart] = useState(false);

  // Active document being created / edited / previewed
  const [currentDoc, setCurrentDoc] = useState<InvoiceDocument | null>(null);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Share PDF modal state
  const [shareModalDoc, setShareModalDoc] = useState<InvoiceDocument | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Delete-confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<InvoiceDocument | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  // Client delete confirm state
  const [clientDeleteTarget, setClientDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [clientDeleteInput, setClientDeleteInput] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "quotation" | "invoice" | "receipt">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "sent" | "paid" | "overdue" | "accepted">("all");

  // Google Review Booster
  const [reviewBoosterDoc, setReviewBoosterDoc] = useState<InvoiceDocument | null>(null);
  const GOOGLE_REVIEW_URL = "https://g.page/r/YOUR_GOOGLE_REVIEW_LINK/review"; // update in settings

  // Record Invoice Payment state
  const [paymentTargetDoc, setPaymentTargetDoc] = useState<InvoiceDocument | null>(null);
  const [invoicePaymentForm, setInvoicePaymentForm] = useState<{
    amount: number;
    method: "mpesa" | "bank" | "cash" | "cheque";
    mpesaCode: string;
    mpesaPhone: string;
    bankRef: string;
    date: string;
    notes: string;
  }>({
    amount: 0,
    method: "mpesa",
    mpesaCode: "",
    mpesaPhone: "",
    bankRef: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

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
      setDeletedInvoices(dataStorage.getDeletedInvoices());
      setCompanyProfile(dataStorage.getCompanyProfile());
      setClients(dataStorage.getClients());
      setInquiries(dataStorage.getInquiries());
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

  // Apply a Turnkey Solution Package (Zero Typing)
  const handleApplyTurnkeyPackage = (pkg: TurnkeyPackage, clientOverride?: Partial<InvoiceDocument["client"]>) => {
    const nextNumber = dataStorage.getNextDocNumber(pkg.defaultDocType);
    const profile = dataStorage.getCompanyProfile();

    const items: InvoiceItem[] = pkg.items.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      desc: it.desc,
      qty: it.qty,
      unitPrice: it.unitPrice,
    }));

    const newDoc: InvoiceDocument = {
      id: currentDoc?.id || "",
      docType: pkg.defaultDocType,
      docNumber: currentDoc?.docNumber || nextNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + (profile.defaultPaymentTermsDays || 14) * 86400000).toISOString().slice(0, 10),
      status: "draft",
      client: {
        id: clientOverride?.id || currentDoc?.client?.id,
        name: clientOverride?.name || currentDoc?.client?.name || "",
        company: clientOverride?.company || currentDoc?.client?.company || "",
        email: clientOverride?.email || currentDoc?.client?.email || "",
        phone: clientOverride?.phone || currentDoc?.client?.phone || "",
        address: clientOverride?.address || currentDoc?.client?.address || "Nairobi, Kenya",
        kraPin: clientOverride?.kraPin || currentDoc?.client?.kraPin || "",
      },
      items,
      discountType: "flat",
      discountValue: 0,
      vatEnabled: profile.defaultVatPercent > 0,
      vatPercent: profile.defaultVatPercent || 16,
      currency: profile.currency || "KES",
      notes: (pkg.suggestedNotes ? `${pkg.suggestedNotes}\n\n` : "") + profile.notesTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCurrentDoc(newDoc);
    setSubView("editor");

    toast({
      title: `⚡ ${pkg.name} Auto-Generated!`,
      description: `${items.length} itemized lines with official specs & KES market pricing populated instantly.`,
    });
  };

  // Convert Incoming Website Lead to Formal Proposal / Invoice
  const handleAutoGenerateFromLead = (leadId: string) => {
    const lead = inquiries.find((l) => l.id === leadId);
    if (!lead) return;

    // Smart detect matching Turnkey Package from lead.service & lead.details
    const combined = `${lead.service || ""} ${lead.details || ""}`.toLowerCase();
    let bestPkg = TURNKEY_PACKAGES[0]; // default Wi-Fi
    if (combined.includes("cctv") || combined.includes("camera") || combined.includes("surveillance")) {
      bestPkg = combined.includes("8") ? TURNKEY_PACKAGES[2] : TURNKEY_PACKAGES[1];
    } else if (combined.includes("web") || combined.includes("site") || combined.includes("seo") || combined.includes("online")) {
      bestPkg = TURNKEY_PACKAGES[3];
    } else if (combined.includes("sla") || combined.includes("maintenance") || combined.includes("retainer")) {
      bestPkg = TURNKEY_PACKAGES[4];
    } else if (combined.includes("slow") || combined.includes("ssd") || combined.includes("upgrade") || combined.includes("laptop") || combined.includes("ram")) {
      bestPkg = TURNKEY_PACKAGES[5];
    } else if (combined.includes("pos") || combined.includes("retail") || combined.includes("checkout")) {
      bestPkg = TURNKEY_PACKAGES[6];
    } else if (combined.includes("backup") || combined.includes("nas") || combined.includes("data") || combined.includes("recovery")) {
      bestPkg = TURNKEY_PACKAGES[7];
    }

    // Extract location if present
    let loc = "Nairobi, Kenya";
    if (lead.details && lead.details.includes("Location:")) {
      const parts = lead.details.split("Location:");
      if (parts[1]) {
        loc = parts[1].split("|")[0].trim();
      }
    }

    // Extract email if present
    let clientEmail = "";
    if (lead.details && lead.details.includes("Email:")) {
      const parts = lead.details.split("Email:");
      if (parts[1]) {
        clientEmail = parts[1].replace(")", "").trim();
      }
    }

    handleApplyTurnkeyPackage(bestPkg, {
      name: lead.name || "Client",
      company: lead.name ? `${lead.name} Enterprise` : "Business Client",
      phone: lead.phone || "",
      email: clientEmail,
      address: loc,
    });

    toast({
      title: "🎯 Lead Converted to Formal Proposal!",
      description: `Auto-filled details for ${lead.name} (${lead.service}). Ready for 1-click WhatsApp/PDF sending.`,
    });
  };

  // 1-Tap Insert from Equipment & Service Catalog
  const handleInsertCatalogItem = (cat: CatalogItem) => {
    if (!currentDoc) return;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      desc: cat.desc,
      qty: cat.defaultQty || 1,
      unitPrice: cat.unitPrice,
    };
    setCurrentDoc({
      ...currentDoc,
      items: [...currentDoc.items, newItem],
    });
    toast({
      title: `+ ${cat.name} Added`,
      description: `Added ${cat.defaultQty}x @ KES ${cat.unitPrice.toLocaleString()}`,
    });
  };

  // AI / Smart Prompt Generator
  const handleSmartPromptGenerate = (promptText?: string) => {
    const textToUse = promptText || smartPrompt;
    if (!textToUse.trim() || !currentDoc) return;

    setIsGeneratingSmart(true);
    setTimeout(() => {
      const generated = generateItemsFromPrompt(textToUse);
      const items: InvoiceItem[] = generated.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        desc: it.desc,
        qty: it.qty,
        unitPrice: it.unitPrice,
      }));

      setCurrentDoc({
        ...currentDoc,
        items,
      });
      setIsGeneratingSmart(false);
      setSmartPrompt("");
      toast({
        title: "✨ Quotation Auto-Generated!",
        description: `Generated ${items.length} tailored line items based on: "${textToUse.slice(0, 30)}..."`,
      });
    }, 300);
  };

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

    // Withholding Tax (WHT 5% Management / Tech Consultancy)
    const whtPercent = doc.whtPercent !== undefined ? doc.whtPercent : 5;
    const whtAmount = doc.whtEnabled ? (discountedSubtotal * whtPercent) / 100 : 0;
    const netReceivable = Math.max(0, grandTotal - whtAmount);

    return {
      rawSubtotal,
      discountAmount,
      discountedSubtotal,
      vatAmount,
      grandTotal,
      whtPercent,
      whtAmount,
      netReceivable,
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

    // Auto-attach eTIMS fiscal signature if missing
    let docToSave = { ...currentDoc };
    if (!docToSave.etimsControlCode) {
      const totals = calculateDocTotals(docToSave);
      const etims = dataStorage.generateEtimsDetails(docToSave.docNumber, totals.grandTotal, docToSave.client.kraPin);
      docToSave = {
        ...docToSave,
        etimsControlCode: etims.controlCode,
        etimsInternalSign: etims.internalSign,
        etimsQrData: etims.qrData,
      };
    }

    const saved = dataStorage.saveInvoice(docToSave);
    setCurrentDoc(saved);

    toast({
      title: `${currentDoc.docType === "quotation" ? "Quotation" : "Invoice"} Saved! 💾`,
      description: `${saved.docNumber} has been recorded with eTIMS verification.`,
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

  // Move document to recycle bin (soft delete) — opens confirmation modal
  const handleDeleteDoc = (doc: InvoiceDocument) => {
    setDeleteTarget(doc);
    setIsPermanentDelete(false);
    setDeleteConfirmInput("");
  };

  // Permanently delete from recycle bin — opens second confirmation modal
  const handlePermanentDeleteDoc = (doc: InvoiceDocument) => {
    setDeleteTarget(doc);
    setIsPermanentDelete(true);
    setDeleteConfirmInput("");
  };

  // Execute confirmed delete action
  const executeDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteConfirmInput.trim() !== deleteTarget.docNumber) {
      toast({ title: "Document number doesn't match", description: "Type the exact document number to confirm.", variant: "destructive" });
      return;
    }
    if (isPermanentDelete) {
      dataStorage.permanentDeleteInvoice(deleteTarget.id);
      toast({ title: "🗑️ Permanently Deleted", description: `${deleteTarget.docNumber} has been erased permanently.` });
    } else {
      dataStorage.softDeleteInvoice(deleteTarget.id);
      toast({ title: "📦 Moved to Recycle Bin", description: `${deleteTarget.docNumber} moved to bin. You can restore it any time.` });
      if (currentDoc?.id === deleteTarget.id) {
        setCurrentDoc(null);
        setSubView("list");
      }
    }
    setDeletedInvoices(dataStorage.getDeletedInvoices());
    setInvoices(dataStorage.getInvoices());
    setDeleteTarget(null);
    setDeleteConfirmInput("");
  };

  // Restore document from recycle bin
  const handleRestoreDoc = (id: string, docNumber: string) => {
    dataStorage.restoreInvoice(id);
    toast({
      title: "Document Restored! ♻️",
      description: `${docNumber} has been restored to your active documents.`,
    });
    setDeletedInvoices(dataStorage.getDeletedInvoices());
    setInvoices(dataStorage.getInvoices());
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

  // Delete saved client — opens modal
  const handleDeleteClient = (id: string, name: string) => {
    setClientDeleteTarget({ id, name });
    setClientDeleteInput("");
  };

  const executeClientDelete = () => {
    if (!clientDeleteTarget) return;
    if (clientDeleteInput.trim().toLowerCase() !== clientDeleteTarget.name.toLowerCase()) {
      toast({ title: "Name doesn't match", description: "Type the exact client name to confirm deletion.", variant: "destructive" });
      return;
    }
    dataStorage.deleteClient(clientDeleteTarget.id);
    toast({ title: "Client Removed", description: "Client contact removed from directory." });
    setClientDeleteTarget(null);
    setClientDeleteInput("");
  };

  // WhatsApp Message Generator for Invoices / Quotes (Clean ASCII & Universally Supported Formatting)
  const generateDocWhatsAppMessage = (doc: InvoiceDocument) => {
    const totals = calculateDocTotals(doc);
    const profile = companyProfile;
    const hasBank =
      profile.includeBankDetails !== false &&
      Boolean(profile.bankName?.trim()) &&
      Boolean(profile.bankAccountNumber?.trim());

    const paymentLine = hasBank
      ? `Payment via M-Pesa ${profile.mpesaType}: ${profile.mpesaNumber} (${profile.mpesaAccount}) or Bank: ${profile.bankName} Acc: ${profile.bankAccountNumber}`
      : `Payment via M-Pesa ${profile.mpesaType}: ${profile.mpesaNumber} (${profile.mpesaAccount})`;

    const verifyUrl = `${window.location.origin}/verify?doc=${doc.docNumber}`;

    if (doc.docType === "quotation") {
      return `Dear ${doc.client.name},\n\n*${profile.name}* has prepared your formal quotation:\n\n*Quote No:* ${doc.docNumber}\n*Client:* ${doc.client.company}\n*Total Amount:* ${doc.currency} ${totals.grandTotal.toLocaleString()}\n*Valid Until:* ${doc.dueDate}\n\n*Key Deliverables:*\n${doc.items.map((i) => `• ${i.desc} (${i.qty}x)`).join("\n")}\n\n${paymentLine}\n\n*Verify & View Online:* ${verifyUrl}\n\nPlease let us know if you would like us to schedule on-site deployment.`;
    } else {
      return `Dear ${doc.client.name},\n\n*${profile.name}* Official Tax Invoice:\n\n*Invoice No:* ${doc.docNumber}\n*Bill To:* ${doc.client.company}\n*Amount Due:* ${doc.currency} ${totals.grandTotal.toLocaleString()}\n*Due Date:* ${doc.dueDate}\n*Status:* ${doc.status.toUpperCase()}\n\n*Payment Details:*\n• ${profile.mpesaType}: ${profile.mpesaNumber} (${profile.mpesaAccount})${hasBank ? `\n• Bank: ${profile.bankName} | Acc: ${profile.bankAccountNumber}` : ""}\n\n*eTIMS Verification:* ${verifyUrl}\n\nThank you for choosing ${profile.name}!`;
    }
  };

  // WhatsApp Payment Reminder Generator
  const generatePaymentReminderWhatsAppMessage = (doc: InvoiceDocument) => {
    const totals = calculateDocTotals(doc);
    const paidSoFar = (doc.payments || []).reduce((s, p) => s + p.amount, 0);
    const balance = Math.max(0, totals.grandTotal - paidSoFar);
    const profile = companyProfile;
    const hasBank =
      profile.includeBankDetails !== false &&
      Boolean(profile.bankName?.trim()) &&
      Boolean(profile.bankAccountNumber?.trim());

    return `Dear ${doc.client.name},\n\nFriendly payment reminder from *${profile.name}* regarding *Invoice #${doc.docNumber}*.\n\n*Client:* ${doc.client.company}\n*Total Amount:* ${doc.currency} ${totals.grandTotal.toLocaleString()}\n${paidSoFar > 0 ? `*Paid to Date:* ${doc.currency} ${paidSoFar.toLocaleString()}\n` : ""}*Outstanding Balance:* ${doc.currency} ${balance.toLocaleString()}\n*Due Date:* ${doc.dueDate}\n\n*Payment Details:*\n• ${profile.mpesaType}: ${profile.mpesaNumber} (${profile.mpesaAccount})\n${hasBank ? `• Bank: ${profile.bankName} | Acc: ${profile.bankAccountNumber}\n` : ""}• Ref: ${doc.docNumber}\n\nPlease share your M-Pesa confirmation code once sent. Thank you!`;
  };

  // Dedicated High-Resolution Clean A4 Print & PDF Generator (Complete Standalone CSS)
  const handlePrintDocument = (doc: InvoiceDocument) => {
    const totals = calculateDocTotals(doc);
    const profile = companyProfile;
    const hasBank =
      profile.includeBankDetails !== false &&
      Boolean(profile.bankName?.trim()) &&
      Boolean(profile.bankAccountNumber?.trim());

    const docTitle =
      doc.docType === "quotation"
        ? "FORMAL QUOTATION"
        : doc.docType === "invoice"
        ? "TAX INVOICE"
        : "OFFICIAL RECEIPT";

    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) {
      window.print();
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${docTitle} - ${doc.docNumber}</title>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Caveat:wght@700&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
            font-size: 11.5px;
            line-height: 1.5;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page {
            max-width: 820px;
            margin: 0 auto;
            padding: 32px 36px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 18px;
            border-bottom: 2px solid #0d9488;
            margin-bottom: 18px;
          }
          .logo-group {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background: #0d9488;
            color: #ffffff;
            font-size: 24px;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .company-name {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            line-height: 1.1;
          }
          .company-tagline {
            font-size: 10px;
            color: #0d9488;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .company-details {
            font-size: 10.5px;
            color: #475569;
            margin-top: 8px;
            line-height: 1.4;
          }
          .doc-meta {
            text-align: right;
          }
          .doc-badge {
            display: inline-block;
            background: #0d9488;
            color: #ffffff;
            font-size: 12px;
            font-weight: 900;
            padding: 5px 14px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
          }
          .doc-meta-table {
            font-size: 11px;
            color: #334155;
            font-family: ui-monospace, monospace;
            line-height: 1.6;
          }
          .doc-meta-table strong {
            color: #0f172a;
          }
          .client-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 18px;
          }
          .client-col h4 {
            font-size: 13px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 2px;
          }
          .client-col p {
            font-size: 11px;
            color: #475569;
          }
          .section-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 800;
            color: #64748b;
            margin-bottom: 4px;
            display: block;
          }
          table.items-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 16px;
          }
          table.items-table th {
            background: #1e293b;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            padding: 9px 12px;
            text-align: left;
          }
          table.items-table td {
            padding: 8px 12px;
            font-size: 11px;
            border-bottom: 1px solid #f1f5f9;
          }
          table.items-table tr:nth-child(even) td {
            background: #f8fafc;
          }
          .num-cell {
            text-align: right;
            font-family: ui-monospace, monospace;
            font-weight: 600;
          }
          .center-cell {
            text-align: center;
            font-family: ui-monospace, monospace;
          }
          .bottom-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 18px;
            margin-bottom: 16px;
          }
          .notes-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 10.5px;
            color: #334155;
            white-space: pre-line;
            line-height: 1.5;
          }
          .totals-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            font-family: ui-monospace, monospace;
            font-size: 11px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            color: #475569;
          }
          .totals-row.gross {
            border-top: 2px solid #0f172a;
            padding-top: 6px;
            margin-top: 4px;
            font-size: 13px;
            font-weight: 900;
            color: #0f172a;
          }
          .totals-row.net {
            border-top: 2px solid #0d9488;
            background: #f0fdf4;
            padding: 6px 8px;
            margin-top: 6px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 900;
            color: #166534;
          }
          .wht-notice {
            background: #fefce8;
            border: 1px solid #fef08a;
            color: #854d0e;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 10px;
            font-family: ui-monospace, monospace;
            margin-bottom: 16px;
            line-height: 1.4;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            padding-top: 14px;
            border-top: 2px solid #e2e8f0;
            margin-bottom: 14px;
          }
          .pay-box {
            background: #f0fdfa;
            border: 1px solid #ccfbf1;
            border-radius: 10px;
            padding: 10px 14px;
            font-family: ui-monospace, monospace;
            font-size: 10.5px;
            color: #115e59;
            line-height: 1.5;
          }
          .sign-box {
            text-align: right;
            display: flex;
            flex-col;
            align-items: flex-end;
            justify-content: flex-end;
          }
          .sign-line {
            width: 180px;
            border-top: 1px solid #334155;
            padding-top: 4px;
            text-align: center;
            margin-left: auto;
          }
          .signature-text {
            font-family: 'Caveat', cursive;
            font-size: 22px;
            color: #0f172a;
            display: block;
            margin-bottom: 2px;
          }
          .etims-block {
            border-top: 1px dashed #cbd5e1;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-family: ui-monospace, monospace;
            font-size: 9.5px;
            color: #64748b;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
          }
          .etims-badge {
            background: #fee2e2;
            color: #b91c1c;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 4px;
            margin-right: 6px;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          @media print {
            body { margin: 0; padding: 0; }
            .page { padding: 12px 16px; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Header -->
          <div class="header">
            <div>
              <div class="logo-group">
                ${
                  profile.logoUrl
                    ? `<img src="${profile.logoUrl}" alt="${profile.name}" style="height:44px;object-fit:contain;" />`
                    : `<div class="logo-icon">K</div>`
                }
                <div>
                  <div class="company-name">${profile.name}</div>
                  <div class="company-tagline">${profile.tagline || "Enterprise IT Support & Digital Engineering"}</div>
                </div>
              </div>
              <div class="company-details">
                ${profile.address} · Phone: ${profile.phone} · Email: ${profile.email}<br />
                Web: ${profile.website} · <strong>KRA PIN: ${profile.kraPin}</strong>
              </div>
            </div>
            <div class="doc-meta">
              <div class="doc-badge">${docTitle}</div>
              <div class="doc-meta-table">
                <div>Document No: <strong>${doc.docNumber}</strong></div>
                <div>Date Issued: <strong>${doc.issueDate}</strong></div>
                <div>${doc.docType === "quotation" ? "Valid Until:" : "Due Date:"} <strong>${doc.dueDate}</strong></div>
                <div>Status: <strong style="text-transform:uppercase;color:#0d9488;">${doc.status}</strong></div>
              </div>
            </div>
          </div>

          <!-- Client Details -->
          <div class="client-grid">
            <div class="client-col">
              <span class="section-label">Billed To / Client Organization</span>
              <h4>${doc.client.company || doc.client.name}</h4>
              <p>Attn: ${doc.client.name}</p>
              <p>${doc.client.address || "Nairobi, Kenya"}</p>
            </div>
            <div class="client-col" style="text-align:right;">
              <span class="section-label">Client Contact Details</span>
              <p style="font-family:ui-monospace, monospace;font-weight:600;">${doc.client.phone}</p>
              ${doc.client.email ? `<p>${doc.client.email}</p>` : ""}
              ${doc.client.kraPin ? `<p style="font-family:ui-monospace, monospace;color:#0f172a;"><strong>Client KRA PIN: ${doc.client.kraPin}</strong></p>` : ""}
            </div>
          </div>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width:36px;text-align:center;">#</th>
                <th>Item / Service Description</th>
                <th style="width:60px;text-align:center;">Qty</th>
                <th style="width:110px;text-align:right;">Unit (${doc.currency})</th>
                <th style="width:120px;text-align:right;">Total (${doc.currency})</th>
              </tr>
            </thead>
            <tbody>
              ${doc.items
                .map(
                  (item, idx) => `
                <tr>
                  <td class="center-cell">${idx + 1}</td>
                  <td><strong>${item.desc}</strong></td>
                  <td class="center-cell">${item.qty}</td>
                  <td class="num-cell">${item.unitPrice.toLocaleString()}</td>
                  <td class="num-cell"><strong>${(item.qty * item.unitPrice).toLocaleString()}</strong></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <!-- Bottom Grid: Notes & Totals -->
          <div class="bottom-grid">
            <div>
              <span class="section-label">Terms &amp; Payment Conditions</span>
              <div class="notes-box">
                ${doc.notes || "Payment due within stated terms. Hardware remains property of supplier until full payment."}
              </div>
            </div>
            <div>
              <span class="section-label">Financial Calculation Summary</span>
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal:</span>
                  <strong>${doc.currency} ${totals.rawSubtotal.toLocaleString()}</strong>
                </div>
                ${
                  totals.discountAmount > 0
                    ? `
                  <div class="totals-row" style="color:#b45309;">
                    <span>Discount:</span>
                    <span>- ${doc.currency} ${totals.discountAmount.toLocaleString()}</span>
                  </div>
                `
                    : ""
                }
                ${
                  doc.vatEnabled
                    ? `
                  <div class="totals-row">
                    <span>VAT (16% KRA):</span>
                    <span>+ ${doc.currency} ${totals.vatAmount.toLocaleString()}</span>
                  </div>
                `
                    : ""
                }
                <div class="totals-row gross">
                  <span>GROSS TOTAL:</span>
                  <span>${doc.currency} ${totals.grandTotal.toLocaleString()}</span>
                </div>
                ${
                  doc.whtEnabled
                    ? `
                  <div class="totals-row" style="color:#047857;border-top:1px dashed #cbd5e1;padding-top:4px;margin-top:4px;">
                    <span>Less 5% WHT (Client Deducts):</span>
                    <span>- ${doc.currency} ${totals.whtAmount.toLocaleString()}</span>
                  </div>
                  <div class="totals-row net">
                    <span>NET PAYABLE:</span>
                    <span>${doc.currency} ${totals.netReceivable.toLocaleString()}</span>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>

          ${
            doc.whtEnabled
              ? `
            <div class="wht-notice">
              <strong>⚖️ KRA Withholding Tax (WHT 5%) Compliance Notice:</strong><br />
              Corporate client will deduct 5% WHT (${doc.currency} ${totals.whtAmount.toLocaleString()}) and remit to KRA, then issue a formal KRA WHT Certificate under Supplier KRA PIN: <strong>${profile.kraPin}</strong>.
            </div>
          `
              : ""
          }

          <!-- Footer: Payment Info & Signature -->
          <div class="footer-grid">
            <div class="pay-box">
              <strong>Official Payment Instructions:</strong><br />
              • M-Pesa ${profile.mpesaType}: <strong>${profile.mpesaNumber}</strong> (${profile.mpesaAccount})<br />
              ${
                hasBank
                  ? `• Bank: <strong>${profile.bankName}</strong> · Acc: <strong>${profile.bankAccountNumber}</strong>${
                      profile.bankBranch ? ` (${profile.bankBranch})` : ""
                    }<br />`
                  : ""
              }
              • Document Reference: <strong>${doc.docNumber}</strong>
            </div>
            <div class="sign-box">
              <div class="sign-line">
                <span class="signature-text">${profile.authorizedSignatory || "Peter Kivevo"}</span>
                <span style="font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Authorized Signatory &amp; Stamp</span>
              </div>
            </div>
          </div>

          <!-- eTIMS Fiscal Compliance Footer -->
          <div class="etims-block">
            <div>
              <span class="etims-badge">KRA eTIMS</span>
              CU Serial: <strong>KRA-ETIMS-PK01-2026</strong> · Control Code: <strong>${doc.etimsControlCode || `KRA-INV-${doc.docNumber.slice(-4)}-8819`}</strong>
            </div>
            <div>
              Internal Sign: <strong>${doc.etimsInternalSign || "9A4F-BC12-88D4"}</strong>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  // ── PDF Blob Generator (reuses same HTML as handlePrintDocument) ──────────
  // ── PDF Blob Generator (reuses same HTML as handlePrintDocument) ──────────
  const buildDocumentHTML = (doc: InvoiceDocument): string => {
    const totals = calculateDocTotals(doc);
    const profile = companyProfile;
    const hasBank =
      profile.includeBankDetails !== false &&
      Boolean(profile.bankName?.trim()) &&
      Boolean(profile.bankAccountNumber?.trim());
    const docTitle = doc.docType === "quotation" ? "FORMAL QUOTATION" : doc.docType === "receipt" ? "OFFICIAL RECEIPT" : "TAX INVOICE";
    const paidSoFar = (doc.payments || []).reduce((s: number, p: { amount: number }) => s + p.amount, 0);
    const balance = Math.max(0, totals.grandTotal - paidSoFar);

    const itemsHtml = doc.items.map((item, i) => `
      <tr style="background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"}">
        <td style="padding:9px 10px;font-size:11px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;">${i + 1}</td>
        <td style="padding:9px 12px;font-size:11px;border-bottom:1px solid #e2e8f0;color:#0f172a;line-height:1.45;word-break:break-word;">
          <strong style="color:#0f172a;">${item.desc}</strong>
        </td>
        <td style="padding:9px 10px;font-size:11px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:700;color:#0f172a;font-family:monospace;">${item.qty}</td>
        <td style="padding:9px 12px;font-size:11px;border-bottom:1px solid #e2e8f0;text-align:right;color:#334155;white-space:nowrap;font-family:monospace;">${doc.currency} ${Number(item.unitPrice).toLocaleString("en-KE", { minimumFractionDigits: 2 })}</td>
        <td style="padding:9px 12px;font-size:11px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;color:#0f766e;white-space:nowrap;font-family:monospace;">${doc.currency} ${Number(item.qty * item.unitPrice).toLocaleString("en-KE", { minimumFractionDigits: 2 })}</td>
      </tr>`).join("");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: #1e293b;
      width: 794px;
      margin: 0 auto;
      padding: 32px 36px;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }
    .header-table { width: 100%; border-collapse: collapse; border-bottom: 2.5px solid #0f766e; padding-bottom: 16px; margin-bottom: 18px; }
    .logo-container { width: 48px; height: 48px; background: #0f766e; border-radius: 10px; text-align: center; line-height: 48px; font-weight: 900; font-size: 24px; color: #ffffff; display: inline-block; vertical-align: top; }
    .company-name { font-size: 20px; font-weight: 900; color: #0f766e; letter-spacing: -0.5px; line-height: 1.2; }
    .company-sub { font-size: 10.5px; color: #64748b; font-weight: 500; margin-top: 3px; }
    .company-contact { font-size: 10px; color: #64748b; margin-top: 5px; line-height: 1.5; }
    .doc-badge { background: #0f766e; color: #ffffff; font-size: 12px; font-weight: 900; padding: 6px 14px; border-radius: 6px; letter-spacing: 0.8px; display: inline-block; text-transform: uppercase; }
    .doc-meta { font-size: 11px; color: #475569; margin-top: 8px; line-height: 1.6; text-align: right; }
    
    .client-table { width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 18px; }
    .client-table td { padding: 12px 16px; vertical-align: top; font-size: 11px; }
    .label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 3px; }
    .value { font-weight: 700; color: #0f172a; font-size: 13px; }
    
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; table-layout: fixed; }
    .items-table th { background: #0f766e; color: #ffffff; padding: 9px 12px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; border: none; }
    
    .totals-container { width: 100%; margin-bottom: 16px; display: table; }
    .totals-box { width: 310px; float: right; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff; font-size: 11px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 14px; border-bottom: 1px solid #f1f5f9; font-family: monospace; }
    .totals-row span:first-child { font-family: 'Inter', sans-serif; font-weight: 500; color: #475569; }
    .totals-grand { background: #0f766e; color: #ffffff; font-size: 13px; font-weight: 900; display: flex; justify-content: space-between; padding: 10px 14px; font-family: monospace; }
    .totals-grand span:first-child { font-family: 'Inter', sans-serif; }
    
    .pay-box { clear: both; width: 100%; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 11px; line-height: 1.6; }
    .pay-title { font-weight: 800; color: #15803d; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .sign-table { clear: both; width: 100%; border-collapse: collapse; border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 10px; margin-bottom: 14px; font-size: 10px; }
    .sign-table td { width: 50%; vertical-align: top; padding: 10px 4px 0 4px; }
    .sign-line { margin-top: 28px; border-top: 1px solid #cbd5e1; padding-top: 4px; width: 180px; color: #64748b; font-size: 10px; }
    
    .etims-table { clear: both; width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 9.5px; color: #64748b; }
    .etims-table td { padding: 8px 12px; }
    .etims-badge { background: #0f766e; color: #ffffff; font-size: 8.5px; font-weight: 800; padding: 2px 7px; border-radius: 4px; margin-right: 6px; display: inline-block; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <table class="header-table">
    <tr>
      <td style="vertical-align:top; width:65%;">
        <table style="border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top; padding-right:14px; width:52px;">
              ${profile.logoUrl ? `<img src="${profile.logoUrl}" style="width:48px;height:48px;border-radius:10px;object-fit:contain;" alt="Logo" />` : `<div class="logo-container">K</div>`}
            </td>
            <td style="vertical-align:top;">
              <div class="company-name">${profile.name}</div>
              <div class="company-sub">${profile.tagline || "Enterprise IT Support, Network Engineering & Digital Systems"}</div>
              <div class="company-contact">
                ${profile.address}<br>
                Tel: <strong>${profile.phone}</strong> · ${profile.email}<br>
                KRA PIN: <strong>${profile.kraPin}</strong>
              </div>
            </td>
          </tr>
        </table>
      </td>
      <td style="vertical-align:top; text-align:right; width:35%;">
        <div class="doc-badge">${docTitle}</div>
        <div class="doc-meta">
          ${doc.docType !== "quotation" ? `<strong>Invoice No:</strong> ${doc.docNumber}<br>` : `<strong>Quote No:</strong> ${doc.docNumber}<br>`}
          <strong>Date Issued:</strong> ${doc.issueDate}<br>
          <strong>${doc.docType === "quotation" ? "Valid Until" : "Due Date"}:</strong> ${doc.dueDate}<br>
          <strong>Currency:</strong> ${doc.currency}
        </div>
      </td>
    </tr>
  </table>

  <!-- BILLED TO -->
  <table class="client-table">
    <tr>
      <td style="width:65%;">
        <div class="label">Billed To</div>
        <div class="value">${doc.client.company || doc.client.name}</div>
        <div style="font-size:11px;color:#475569;margin-top:2px;font-weight:500;">${doc.client.company ? doc.client.name : ""}</div>
        <div style="font-size:10.5px;color:#64748b;margin-top:2px;">${doc.client.phone}</div>
        ${doc.client.email ? `<div style="font-size:10px;color:#64748b;">${doc.client.email}</div>` : ""}
        ${doc.client.kraPin ? `<div style="font-size:10px;color:#0f766e;font-weight:600;margin-top:2px;">Client KRA PIN: ${doc.client.kraPin}</div>` : ""}
      </td>
      <td style="width:35%; text-align:right;">
        <div class="label">Status</div>
        <div style="display:inline-block;background:${doc.status === "paid" ? "#dcfce7" : doc.status === "overdue" ? "#fee2e2" : "#fef9c3"};color:${doc.status === "paid" ? "#15803d" : doc.status === "overdue" ? "#dc2626" : "#854d0e"};padding:4px 12px;border-radius:999px;font-weight:800;font-size:11px;letter-spacing:0.5px;">
          ${doc.status.toUpperCase()}
        </div>
        ${(doc as unknown as Record<string, unknown>).poNumber ? `<div style="margin-top:6px;"><div class="label">PO / Ref</div><div class="value" style="font-size:11px;">${(doc as unknown as Record<string, unknown>).poNumber}</div></div>` : ""}
      </td>
    </tr>
  </table>

  <!-- LINE ITEMS -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width:5%;text-align:center;">#</th>
        <th style="width:51%;text-align:left;">Description</th>
        <th style="width:10%;text-align:center;">Qty</th>
        <th style="width:17%;text-align:right;">Unit Price</th>
        <th style="width:17%;text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <!-- TOTALS -->
  <div class="totals-container">
    <div class="totals-box">
      ${totals.discountedSubtotal !== totals.grandTotal ? `<div class="totals-row"><span>Subtotal</span><span>${doc.currency} ${totals.discountedSubtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span></div>` : `<div class="totals-row"><span>Subtotal</span><span>${doc.currency} ${totals.rawSubtotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span></div>`}
      ${totals.vatAmount > 0 ? `<div class="totals-row"><span>VAT (16%)</span><span>${doc.currency} ${totals.vatAmount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span></div>` : ""}
      ${totals.whtAmount > 0 ? `<div class="totals-row"><span>WHT (-5%)</span><span style="color:#dc2626;">-${doc.currency} ${totals.whtAmount.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span></div>` : ""}
      ${paidSoFar > 0 ? `<div class="totals-row"><span>Less Paid</span><span style="color:#15803d;font-weight:bold;">-${doc.currency} ${paidSoFar.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span></div>` : ""}
      <div class="totals-grand">
        <span>TOTAL DUE</span>
        <span>${doc.currency} ${(paidSoFar > 0 ? balance : totals.grandTotal).toLocaleString("en-KE", { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  </div>

  <!-- PAYMENT INSTRUCTIONS -->
  <div class="pay-box">
    <div class="pay-title">Payment Instructions</div>
    • M-Pesa ${profile.mpesaType}: <strong>${profile.mpesaNumber}</strong> (${profile.mpesaAccount})<br>
    ${hasBank ? `• Bank: <strong>${profile.bankName}</strong> · Acc: <strong>${profile.bankAccountNumber}</strong>${profile.bankBranch ? ` (${profile.bankBranch})` : ""}<br>` : ""}
    • Reference: <strong>${doc.docNumber}</strong>
  </div>

  <!-- SIGNATURES -->
  <table class="sign-table">
    <tr>
      <td>
        <div class="label">Authorised By</div>
        <div style="font-weight:700;color:#0f172a;font-size:12px;">Peter Kivevo John</div>
        <div class="sign-line">Signature &amp; Company Stamp</div>
      </td>
      <td style="text-align:right;">
        <div class="label">Client Acceptance</div>
        <div style="height:14px;"></div>
        <div class="sign-line" style="margin-left:auto;">Signature &amp; Date</div>
      </td>
    </tr>
  </table>

  <!-- eTIMS FISCAL CODE -->
  <table class="etims-table">
    <tr>
      <td style="text-align:left;">
        <span class="etims-badge">KRA eTIMS</span>
        CU Serial: <strong>KRA-ETIMS-PK01-2026</strong> · Control: <strong>${doc.etimsControlCode || `KRA-INV-${doc.docNumber.slice(-4)}-8819`}</strong>
      </td>
      <td style="text-align:right; font-family:monospace;">
        Sign: <strong>${doc.etimsInternalSign || "9A4F-BC12-88D4"}</strong>
      </td>
    </tr>
  </table>

</body>
</html>`;
  };

  // Generate a real PDF Blob from the document HTML using an iframe + canvas
  const generatePdfBlob = async (doc: InvoiceDocument): Promise<Blob> => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    // Render the HTML in an off-screen container matching exact A4 proportions (794px width)
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;left:0;top:0;width:794px;height:1200px;border:none;opacity:0;pointer-events:none;z-index:-9999;";
    document.body.appendChild(iframe);

    return new Promise((resolve, reject) => {
      iframe.onload = async () => {
        try {
          // Wait for all fonts and layout to settle
          if (iframe.contentDocument?.fonts) {
            await iframe.contentDocument.fonts.ready;
          }
          await new Promise((res) => setTimeout(res, 200));

          const body = iframe.contentDocument!.body;
          const canvas = await html2canvas(body, {
            scale: 2.5, // Retina crisp rendering
            useCORS: true,
            backgroundColor: "#ffffff",
            width: 794,
            windowWidth: 794,
            scrollY: 0,
            scrollX: 0,
          });
          document.body.removeChild(iframe);

          const imgData = canvas.toDataURL("image/jpeg", 0.98);
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const pageW = pdf.internal.pageSize.getWidth(); // 210mm
          const pageH = pdf.internal.pageSize.getHeight(); // 297mm

          const margin = 6;
          const maxW = pageW - (margin * 2); // 198mm
          const maxH = pageH - (margin * 2); // 285mm

          const imgAspect = canvas.height / canvas.width;
          const renderW = maxW;
          const renderH = maxW * imgAspect;

          // If document height fits within a single A4 page
          if (renderH <= maxH) {
            const xOffset = margin + (maxW - renderW) / 2;
            pdf.addImage(imgData, "JPEG", xOffset, margin, renderW, renderH);
          } else {
            // Multi-page support for long itemized lists
            let yPos = 0;
            while (yPos < renderH) {
              if (yPos > 0) pdf.addPage();
              pdf.addImage(imgData, "JPEG", margin, margin - yPos, renderW, renderH);
              yPos += maxH;
            }
          }

          resolve(pdf.output("blob"));
        } catch (err) {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          reject(err);
        }
      };
      iframe.srcdoc = buildDocumentHTML(doc);
    });
  };

  // Download a .pdf file directly to device
  const handleDownloadPdf = async (doc: InvoiceDocument) => {
    setIsGeneratingPdf(true);
    try {
      const blob = await generatePdfBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.docNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "PDF Downloaded! 📄", description: `${doc.docNumber}.pdf saved to your Downloads.` });
    } catch {
      toast({ title: "PDF Error", description: "Could not generate PDF. Try Print / Save PDF instead.", variant: "destructive" });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Share via Web Share API (opens native Android/iOS share sheet with real .pdf file)
  const handleNativeSharePdf = async (doc: InvoiceDocument) => {
    setIsGeneratingPdf(true);
    try {
      const blob = await generatePdfBlob(doc);
      const file = new File([blob], `${doc.docNumber}.pdf`, { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${doc.docNumber} – ${companyProfile.name}`,
          text: generateDocWhatsAppMessage(doc),
          files: [file],
        });
        setPdfBlob(blob);
      } else {
        // Fallback: download the PDF if Web Share API not supported
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${doc.docNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Saved to Downloads 📄",
          description: "Native share not supported — PDF downloaded. Open WhatsApp → attach the file manually.",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast({ title: "Share Failed", description: "Could not share PDF. Try downloading instead.", variant: "destructive" });
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenPaymentModal = (doc: InvoiceDocument) => {
    const totals = calculateDocTotals(doc);
    const paidSoFar = (doc.payments || []).reduce((s, p) => s + p.amount, 0);
    const remainingBalance = Math.max(0, totals.grandTotal - paidSoFar);

    setPaymentTargetDoc(doc);
    setInvoicePaymentForm({
      amount: remainingBalance,
      method: "mpesa",
      mpesaCode: "",
      mpesaPhone: doc.client.phone || "",
      bankRef: "",
      date: new Date().toISOString().slice(0, 10),
      notes: `Installment payment for ${doc.docNumber}`,
    });
  };

  const handleSaveInvoicePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetDoc || invoicePaymentForm.amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid payment amount.", variant: "destructive" });
      return;
    }

    const updated = dataStorage.recordInvoicePayment(paymentTargetDoc.id, {
      amount: Number(invoicePaymentForm.amount),
      method: invoicePaymentForm.method,
      mpesaCode: invoicePaymentForm.mpesaCode,
      mpesaPhone: invoicePaymentForm.mpesaPhone,
      bankRef: invoicePaymentForm.bankRef,
      date: invoicePaymentForm.date,
      notes: invoicePaymentForm.notes,
    });

    if (updated) {
      setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
      if (currentDoc && currentDoc.id === updated.id) {
        setCurrentDoc(updated);
      }
    }

    setPaymentTargetDoc(null);
    toast({
      title: "Payment Recorded & Synchronized! 💰",
      description: `KES ${Number(invoicePaymentForm.amount).toLocaleString()} credited to ${paymentTargetDoc.docNumber}.`,
    });
  };

  // Email document handler
  const handleOpenEmailModal = (doc: InvoiceDocument) => {
    setEmailRecipient(doc.client.email || "");
    setShowEmailModal(true);
  };

  const handleSendDocumentEmail = async () => {
    if (!currentDoc) return;
    if (!emailRecipient.trim() || !emailRecipient.includes("@")) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setIsSendingEmail(true);
    const result = await resendService.sendDocumentEmail(currentDoc, emailRecipient.trim());
    setIsSendingEmail(false);
    if (result.success) {
      setShowEmailModal(false);
      toast({
        title: `📧 ${currentDoc.docType === "quotation" ? "Quotation" : "Invoice"} Sent!`,
        description: `${currentDoc.docNumber} successfully delivered to ${emailRecipient}`,
      });
      // Mark as "sent" if it was a draft
      if (currentDoc.status === "draft") {
        const updated = { ...currentDoc, status: "sent" as const, updatedAt: new Date().toISOString() };
        setCurrentDoc(updated);
        dataStorage.saveInvoice(updated);
        setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
      }
    } else {
      toast({ title: "Send Failed ❌", description: result.error || "Unknown error", variant: "destructive" });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0 mt-0.5 sm:mt-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Krenovate Systems
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-bold whitespace-nowrap shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                Invoice &amp; Quote Engine
              </span>
            </div>
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
            onClick={() => setSubView("bin")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              subView === "bin"
                ? "bg-rose-600/80 text-white shadow-md"
                : "bg-navy-900 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recycle Bin</span>
              {deletedInvoices.length > 0 && (
                <span className={`text-[10px] font-mono px-1.5 rounded-full font-bold ${subView === "bin" ? "bg-white/20 text-white" : "bg-rose-500/20 text-rose-300"}`}>
                  {deletedInvoices.length}
                </span>
              )}
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

          {/* ========================================================================= */}
          {/* ZERO-TYPING SYSTEM GENERATOR: TURNKEY PACKAGES & LEAD CONVERTER           */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 border border-teal-500/30 shadow-glow space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
                  <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                  <span>Zero-Typing System Generator (Kenyan Market Rates)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                  1-Click Turnkey Proposals &amp; Instant Lead Conversion
                </h3>
                <p className="text-xs text-slate-400">
                  Pick any turnkey package below to auto-generate itemized equipment, pricing, terms, and WhatsApp message instantly.
                </p>
              </div>

              {/* 1-Click Convert Incoming Website Lead */}
              {inquiries.length > 0 && (
                <div className="w-full md:w-auto flex-shrink-0">
                  <label className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block mb-1">
                    🎯 Convert Website Inquiry:
                  </label>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) handleAutoGenerateFromLead(e.target.value);
                    }}
                    className="w-full md:w-72 px-3 py-2 text-xs rounded-xl bg-navy-900 border border-teal-500/50 text-teal-300 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  >
                    <option value="" disabled>⚡ Pick inquiry to auto-quote...</option>
                    {inquiries.map((inq) => (
                      <option key={inq.id} value={inq.id}>
                        {inq.name} — {inq.service} ({inq.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Turnkey Package Visual Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {TURNKEY_PACKAGES.map((pkg) => {
                const pkgTotal = pkg.items.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);
                return (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-2xl bg-navy-900/90 border border-border/80 hover:border-teal-500/60 transition-all duration-200 flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          {pkg.badge}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-white">
                          KES {pkgTotal.toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                        {pkg.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono">{pkg.items.length} auto-items</span>
                      <button
                        type="button"
                        onClick={() => handleApplyTurnkeyPackage(pkg)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1 shadow-glow"
                      >
                        <span>Generate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
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
                              onChange={(e) => {
                                const newStatus = e.target.value as "draft" | "sent" | "paid" | "overdue" | "accepted";
                                dataStorage.updateInvoiceStatus(doc.id, newStatus);
                                // Trigger Google Review Booster when marked as PAID
                                if (newStatus === "paid" && doc.docType === "invoice") {
                                  setReviewBoosterDoc(doc);
                                }
                              }}
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

                          {/* Grand Total & Paid Balance */}
                          <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap">
                            <div className="font-bold text-white text-sm">
                              {doc.currency} {totals.grandTotal.toLocaleString()}
                            </div>
                            {(() => {
                              const paid = (doc.payments || []).reduce((s, p) => s + p.amount, 0);
                              const balance = Math.max(0, totals.grandTotal - paid);
                              if (doc.status === "paid" || paid >= totals.grandTotal) {
                                return <span className="text-[10px] text-emerald-400 font-semibold block">Fully Paid</span>;
                              }
                              if (paid > 0) {
                                return (
                                  <span className="text-[10px] text-amber-300 font-semibold block">
                                    Bal: KES {balance.toLocaleString()}
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              {/* Record Payment Action */}
                              {doc.docType === "invoice" && doc.status !== "paid" && (
                                <button
                                  onClick={() => handleOpenPaymentModal(doc)}
                                  title="Record Payment (M-Pesa / Bank)"
                                  className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/40 transition-colors"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* WhatsApp Reminder (for sent/overdue invoices) */}
                              {doc.docType === "invoice" && doc.status !== "paid" && (
                                <a
                                  href={`https://wa.me/${doc.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    generatePaymentReminderWhatsAppMessage(doc)
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Send Payment Reminder on WhatsApp"
                                  className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500 hover:text-navy-950 border border-amber-500/20 transition-colors"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Direct Instant Print PDF */}
                              <button
                                onClick={() => handlePrintDocument(doc)}
                                title="Instant Print / Save PDF"
                                className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white border border-teal-500/20 transition-colors"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Preview */}
                              <button
                                onClick={() => {
                                  setCurrentDoc(doc);
                                  setSubView("preview");
                                }}
                                title="Preview on Screen"
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

                              {/* Share / Send PDF */}
                              <button
                                onClick={() => setShareModalDoc(doc)}
                                title="Share / Download PDF"
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>

                              {/* Move to Bin */}
                              <button
                                onClick={() => handleDeleteDoc(doc)}
                                title="Move to Recycle Bin"
                                className="p-1.5 rounded-lg bg-navy-950 text-rose-400 hover:bg-rose-500/20 border border-border transition-colors"
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

              {/* ========================================================================= */}
              {/* ZERO-TYPING GENERATOR: AI PROMPT & TURNKEY PACKAGE AUTO-LOADER             */}
              {/* ========================================================================= */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 border border-teal-500/40 shadow-glow space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                        <span>Zero-Typing System Generator</span>
                        <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                          AI &amp; Templates
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Auto-populate complete turnkey hardware specs, pricing, and scopes in 1 click.
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Load Turnkey Package */}
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const pkg = TURNKEY_PACKAGES.find((p) => p.id === e.target.value);
                      if (pkg) handleApplyTurnkeyPackage(pkg);
                    }}
                    className="px-3 py-2 text-xs rounded-xl bg-navy-900 border border-teal-500/50 text-teal-300 font-bold focus:outline-none"
                  >
                    <option value="" disabled>⚡ Load Turnkey Package...</option>
                    {TURNKEY_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.items.length} items)
                      </option>
                    ))}
                  </select>
                </div>

                {/* AI / Smart Custom Prompt Generator */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={smartPrompt}
                      onChange={(e) => setSmartPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSmartPromptGenerate();
                        }
                      }}
                      placeholder="e.g. 8 CCTV cameras for warehouse with 4TB storage and night vision..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      disabled={isGeneratingSmart || !smartPrompt.trim()}
                      onClick={() => handleSmartPromptGenerate()}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shadow-glow"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{isGeneratingSmart ? "Generating..." : "✨ Auto-Generate"}</span>
                    </button>
                  </div>

                  {/* Quick AI Tag Suggestions */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Quick Prompts:</span>
                    {[
                      { label: "📶 Office Wi-Fi 6", prompt: "Complete office Wi-Fi 6 network with 16-port PoE switch and MikroTik router" },
                      { label: "📹 4-Cam CCTV", prompt: "4-camera 5MP night-vision CCTV system with 2TB storage and mobile app" },
                      { label: "📹 8-Cam CCTV", prompt: "8-camera enterprise CCTV system with 4TB storage and 9U server rack" },
                      { label: "🌐 Business Website", prompt: "High-speed business website with domain, hosting, and corporate email" },
                      { label: "💻 5-PC SSD Upgrade", prompt: "5-computer hardware speedup with 500GB SSDs, RAM, and OS optimization" },
                      { label: "💳 Retail POS", prompt: "All-in-one touchscreen POS system with receipt printer and cash drawer" },
                      { label: "🔒 Cloud & NAS Backup", prompt: "Automated daily NAS backup system with 4TB RAID 1 storage and cloud sync" },
                    ].map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setSmartPrompt(tag.prompt);
                          handleSmartPromptGenerate(tag.prompt);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-navy-950 hover:bg-teal-500/20 text-slate-300 hover:text-teal-300 border border-border/80 transition-colors"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
              <div className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-5">
                
                {/* 1-Tap Equipment & Service Catalog Drawer */}
                <div className="p-4 rounded-2xl bg-navy-950/90 border border-teal-500/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-heading font-extrabold text-white">
                        1-Tap Equipment &amp; Service Catalog (Zero Typing):
                      </span>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1">
                      {["All", "Networking", "CCTV", "Hardware", "Labor", "Web"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCatalogCategoryFilter(cat)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            catalogCategoryFilter === cat
                              ? "bg-teal-600 text-white"
                              : "bg-navy-900 text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clickable Catalog Item Chips */}
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                    {CATALOG_ITEMS
                      .filter((item) => catalogCategoryFilter === "All" || item.category === catalogCategoryFilter)
                      .map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleInsertCatalogItem(item)}
                          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-teal-600/30 border border-border hover:border-teal-500/50 text-slate-200 text-xs transition-all hover:scale-[1.02] shadow-sm"
                        >
                          <Plus className="w-3 h-3 text-teal-400 group-hover:rotate-90 transition-transform" />
                          <span className="font-semibold">{item.name}</span>
                          <span className="font-mono text-[11px] text-teal-300 font-bold bg-navy-950 px-1.5 py-0.5 rounded-md">
                            KES {item.unitPrice.toLocaleString()}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>

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
                    <span>Add Custom Item</span>
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

                      {/* VAT & Tax Scheme */}
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
                            <span>VAT (16% KRA Output):</span>
                            <span>+ {currentDoc.currency} {totals.vatAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Withholding Tax (WHT 5%) Deduction */}
                      <div className="pt-2 border-t border-border/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={Boolean(currentDoc.whtEnabled)}
                              onChange={(e) => setCurrentDoc({ ...currentDoc, whtEnabled: e.target.checked, whtPercent: 5 })}
                              className="rounded border-border text-teal-600 focus:ring-teal-500"
                            />
                            <span>Corporate WHT (5%)</span>
                          </label>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300">5% Mgmt</span>
                        </div>
                        {currentDoc.whtEnabled && (
                          <div className="flex justify-between text-amber-300 text-[11px]">
                            <span>Less 5% WHT Deducted:</span>
                            <span>- {currentDoc.currency} {totals.whtAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Grand Total */}
                      <div className="pt-3 border-t border-teal-500/40 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-heading font-bold text-xs text-slate-300">Gross Total:</span>
                          <span className="font-heading font-bold text-lg text-white">
                            {currentDoc.currency} {totals.grandTotal.toLocaleString()}
                          </span>
                        </div>
                        {currentDoc.whtEnabled && (
                          <div className="flex justify-between items-baseline pt-1 border-t border-border/40">
                            <span className="font-heading font-extrabold text-xs text-teal-300">Net Receivable:</span>
                            <span className="font-heading font-black text-xl text-teal-400">
                              {currentDoc.currency} {totals.netReceivable.toLocaleString()}
                            </span>
                          </div>
                        )}
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
                <p>PIN: <strong className="text-slate-200">{companyProfile.kraPin || "N/A"}</strong></p>
                <p>M-Pesa: <strong className="text-slate-200">{companyProfile.mpesaType} {companyProfile.mpesaNumber} ({companyProfile.mpesaAccount})</strong></p>
                {companyProfile.includeBankDetails !== false && companyProfile.bankName?.trim() && (
                  <p>Bank: <strong className="text-slate-200">{companyProfile.bankName} - {companyProfile.bankAccountNumber}</strong></p>
                )}
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

              <button
                onClick={() => setShareModalDoc(currentDoc)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Share / PDF</span>
              </button>

              <button
                onClick={() => handleOpenEmailModal(currentDoc)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>

              <button
                onClick={() => handlePrintDocument(currentDoc)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shadow-glow"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF (A4)</span>
              </button>
            </div>
          </div>

          {/* Email Send Modal */}
          {showEmailModal && currentDoc && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEmailModal(false)}>
              <div
                className="w-full max-w-md rounded-3xl bg-navy-900 border border-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {currentDoc.docType === "quotation" ? "📄 Email Quotation" : "🧾 Email Invoice"}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">{currentDoc.docNumber}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowEmailModal(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Summary card */}
                <div className="p-3 rounded-2xl bg-navy-950 border border-border space-y-1 text-xs">
                  <p className="text-slate-400">Sending to: <strong className="text-white">{currentDoc.client.name}</strong> — {currentDoc.client.company}</p>
                  <p className="text-slate-400">Document: <strong className="text-teal-400 font-mono">{currentDoc.docNumber}</strong></p>
                </div>

                {/* Email input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recipient Email Address</label>
                  <input
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="client@company.co.ke"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSendDocumentEmail()}
                    className="w-full px-4 py-3 text-sm rounded-xl bg-navy-950 border border-border text-white placeholder-slate-500 font-mono focus:ring-2 focus:ring-blue-500/50 outline-none"
                  />
                  {!currentDoc.client.email && (
                    <p className="text-[11px] text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      No email saved for this client — type recipient email above.
                    </p>
                  )}
                </div>

                {/* Direct Mail App Option */}
                <div className="pt-1 space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isSendingEmail || !emailRecipient.trim()}
                      onClick={handleSendDocumentEmail}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      {isSendingEmail ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending via Server...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send via Resend</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${emailRecipient}?subject=${encodeURIComponent(
                        `${currentDoc.docType === "quotation" ? "Quotation" : "Tax Invoice"} ${currentDoc.docNumber} - ${companyProfile.name}`
                      )}&body=${encodeURIComponent(generateDocWhatsAppMessage(currentDoc))}`}
                      className="flex-1 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-border text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-center"
                      onClick={() => setShowEmailModal(false)}
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>Open in Mail App</span>
                    </a>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    💡 Tip: To attach the PDF file directly, click <strong>Print / Save PDF</strong> to save the file, then attach it in your email or WhatsApp chat.
                  </p>
                </div>
              </div>
            </div>
          )}

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
                        <span className="font-black text-slate-900">GROSS TOTAL:</span>
                        <span className="font-black text-slate-900 text-lg">
                          {currentDoc.currency} {totals.grandTotal.toLocaleString()}
                        </span>
                      </div>

                      {currentDoc.whtEnabled && (
                        <>
                          <div className="flex justify-between text-emerald-800 font-semibold pt-1 border-t border-slate-200">
                            <span>Less 5% WHT (Client Deducts):</span>
                            <span>- {currentDoc.currency} {totals.whtAmount.toLocaleString()}</span>
                          </div>
                          <div className="pt-2 border-t-2 border-emerald-600 flex justify-between items-baseline text-sm bg-emerald-50/70 p-2 rounded-lg">
                            <span className="font-black text-emerald-950">NET PAYABLE:</span>
                            <span className="font-black text-emerald-800 text-lg">
                              {currentDoc.currency} {totals.netReceivable.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Withholding Tax Client Instruction Notice if WHT Active */}
              {currentDoc.whtEnabled && (
                <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] font-mono space-y-0.5">
                  <span className="font-bold block">⚖️ KRA Withholding Tax (WHT) Compliance Notice:</span>
                  <p>
                    Corporate client will deduct 5% WHT ({currentDoc.currency} {calculateDocTotals(currentDoc).whtAmount.toLocaleString()}) and remit to KRA, then issue a formal KRA WHT Credit Certificate under Supplier KRA PIN: <strong>{companyProfile.kraPin}</strong>.
                  </p>
                </div>
              )}

              {/* Payment Instructions & Official Stamp Footer */}
              <div className="pt-6 border-t-2 border-slate-200 grid sm:grid-cols-2 gap-6 items-end text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Official Payment Instructions:
                  </span>
                  <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950 space-y-0.5 font-mono text-[11px]">
                    <p><strong>M-Pesa {companyProfile.mpesaType}:</strong> {companyProfile.mpesaNumber}</p>
                    <p><strong>Account Name:</strong> {companyProfile.mpesaAccount}</p>
                    {companyProfile.includeBankDetails !== false && Boolean(companyProfile.bankName?.trim()) && Boolean(companyProfile.bankAccountNumber?.trim()) && (
                      <>
                        <p><strong>Bank:</strong> {companyProfile.bankName} &bull; Acc: {companyProfile.bankAccountNumber}</p>
                        {companyProfile.bankBranch?.trim() && <p><strong>Branch:</strong> {companyProfile.bankBranch}</p>}
                      </>
                    )}
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

              {/* eTIMS Fiscal Compliance Block */}
              <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-500 bg-slate-50/80 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">KRA eTIMS</span>
                  <span>CU Serial: <strong>KRA-ETIMS-PK01-2026</strong></span>
                  <span>&bull;</span>
                  <span>Control Code: <strong>{currentDoc.etimsControlCode || `KRA-INV-${currentDoc.docNumber.slice(-4)}-8819`}</strong></span>
                </div>
                <div>
                  <span>Internal Sign: <strong>{currentDoc.etimsInternalSign || "9A4F-BC12-88D4"}</strong></span>
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

                {/* Include Bank Details Toggle */}
                <div className="pt-2 pb-1">
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-navy-950 border border-border cursor-pointer hover:border-teal-500/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={companyProfile.includeBankDetails !== false}
                      onChange={(e) => setCompanyProfile({ ...companyProfile, includeBankDetails: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Include Bank Transfer Details on Quotations &amp; Invoices
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Uncheck this if you only accept M-Pesa Till / Paybill payments so no blank bank details appear on your documents.
                      </span>
                    </div>
                  </label>
                </div>

                {companyProfile.includeBankDetails !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 animate-in fade-in duration-200">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={companyProfile.bankName}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankName: e.target.value })}
                        placeholder="e.g. NCBA Bank Kenya"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        value={companyProfile.bankAccountNumber}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankAccountNumber: e.target.value })}
                        placeholder="e.g. 10023456789"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Branch</label>
                      <input
                        type="text"
                        value={companyProfile.bankBranch}
                        onChange={(e) => setCompanyProfile({ ...companyProfile, bankBranch: e.target.value })}
                        placeholder="e.g. Westlands Branch"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                      />
                    </div>
                  </div>
                )}
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
      {/* 5. RECYCLE BIN VIEW                                                       */}
      {/* ========================================================================= */}
      {subView === "bin" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900 border border-rose-500/30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSubView("list")}
                className="p-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white border border-border"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Recycle Bin</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {deletedInvoices.length} {deletedInvoices.length === 1 ? "document" : "documents"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Documents remain safely here until restored or permanently erased.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubView("list")}
              className="px-4 py-2 rounded-xl bg-navy-950 text-slate-300 hover:text-white border border-border text-xs font-bold transition-all"
            >
              Back to Active Documents
            </button>
          </div>

          {deletedInvoices.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-navy-900 border border-border/80 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-navy-950 border border-border/80 flex items-center justify-center mx-auto text-slate-500">
                <Trash2 className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-white">Recycle Bin is Empty</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you delete a quotation or invoice, it will be moved here for safe recovery before any permanent removal.
                </p>
              </div>
              <button
                onClick={() => setSubView("list")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>View Active Documents</span>
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-navy-900 border border-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-navy-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3.5 px-4">Document</th>
                      <th className="py-3.5 px-4">Client / Company</th>
                      <th className="py-3.5 px-4">Deleted On</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {deletedInvoices.map((doc) => {
                      const totals = calculateDocTotals(doc);
                      return (
                        <tr key={doc.id} className="hover:bg-navy-800/40 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span>{doc.docNumber}</span>
                              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-mono bg-navy-950 text-slate-400 border border-border">
                                {doc.docType}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-white block">{doc.client.company || doc.client.name}</span>
                            <span className="text-[11px] text-slate-400 block">{doc.client.name}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-400">
                            {doc.deletedAt ? new Date(doc.deletedAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-slate-300">
                            {doc.currency} {totals.grandTotal.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Restore Button */}
                              <button
                                onClick={() => handleRestoreDoc(doc.id, doc.docNumber)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                                title="Restore to active documents"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restore</span>
                              </button>

                              {/* Permanent Delete Button */}
                              <button
                                onClick={() => handlePermanentDeleteDoc(doc)}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                                title="Erase permanently (irreversible)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Erase</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CLIENT MODAL                                                              */}
      {/* ========================================================================= */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-teal-500/30 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
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

      {/* ========================================================================= */}
      {/* NAME-CONFIRM DELETE DOCUMENT MODAL (Recycle Bin / Permanent)              */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-rose-500/40 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  {isPermanentDelete ? "Permanently Erase Document?" : "Move Document to Recycle Bin?"}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {deleteTarget.docNumber}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950 border border-border/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="font-bold text-white">{deleteTarget.client.company || deleteTarget.client.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Value:</span>
                <span className="font-mono font-bold text-teal-400">
                  {deleteTarget.currency} {calculateDocTotals(deleteTarget).grandTotal.toLocaleString()}
                </span>
              </div>
              <p className="pt-2 border-t border-border text-slate-400 leading-relaxed">
                {isPermanentDelete ? (
                  <span className="text-rose-300 font-semibold">
                    ⚠️ Irreversible Action: This document will be completely deleted from system storage and cannot be recovered.
                  </span>
                ) : (
                  <span>
                    📦 Safe Action: This document will be moved to the <strong>Recycle Bin</strong> where you can restore it anytime.
                  </span>
                )}
              </p>
            </div>

            {/* Confirmation input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">
                To confirm, type the exact document number:{" "}
                <strong className="text-rose-400 font-mono select-all bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  {deleteTarget.docNumber}
                </strong>
              </label>
              <input
                type="text"
                autoFocus
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && deleteConfirmInput.trim() === deleteTarget.docNumber && executeDeleteConfirm()}
                placeholder={`Type "${deleteTarget.docNumber}"`}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-rose-500/40 text-white font-mono placeholder-slate-600 focus:ring-2 focus:ring-rose-500/50 outline-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteConfirmInput("");
                }}
                className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmInput.trim() !== deleteTarget.docNumber}
                onClick={executeDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isPermanentDelete ? "Permanently Erase" : "Move to Recycle Bin"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NAME-CONFIRM DELETE CLIENT MODAL                                          */}
      {/* ========================================================================= */}
      {clientDeleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-rose-500/40 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Remove Client from Directory?
                </h3>
                <p className="text-xs text-slate-400">
                  {clientDeleteTarget.name}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">
                To confirm deletion, type the client's name:{" "}
                <strong className="text-rose-400 select-all bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  {clientDeleteTarget.name}
                </strong>
              </label>
              <input
                type="text"
                autoFocus
                value={clientDeleteInput}
                onChange={(e) => setClientDeleteInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && clientDeleteInput.trim().toLowerCase() === clientDeleteTarget.name.toLowerCase() && executeClientDelete()}
                placeholder={`Type "${clientDeleteTarget.name}"`}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-rose-500/40 text-white placeholder-slate-600 focus:ring-2 focus:ring-rose-500/50 outline-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setClientDeleteTarget(null);
                  setClientDeleteInput("");
                }}
                className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={clientDeleteInput.trim().toLowerCase() !== clientDeleteTarget.name.toLowerCase()}
                onClick={executeClientDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Client Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RECORD INVOICE PAYMENT MODAL                                              */}
      {/* ========================================================================= */}
      {paymentTargetDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-emerald-500/40 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Record Payment: {paymentTargetDoc.docNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {paymentTargetDoc.client.company || paymentTargetDoc.client.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentTargetDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoicePayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Payment Amount (KES) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={invoicePaymentForm.amount || ""}
                  onChange={(e) => setInvoicePaymentForm({ ...invoicePaymentForm, amount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-emerald-500/40 text-white font-mono text-base font-bold focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Payment Method</label>
                  <select
                    value={invoicePaymentForm.method}
                    onChange={(e) => setInvoicePaymentForm({ ...invoicePaymentForm, method: e.target.value as "mpesa" | "bank" | "cash" | "cheque" })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="mpesa">M-Pesa</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date Received</label>
                  <input
                    type="date"
                    required
                    value={invoicePaymentForm.date}
                    onChange={(e) => setInvoicePaymentForm({ ...invoicePaymentForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>

                {invoicePaymentForm.method === "mpesa" && (
                  <div className="space-y-1 col-span-2">
                    <label className="text-slate-300 font-semibold">M-Pesa Confirmation Code</label>
                    <input
                      type="text"
                      placeholder="e.g. QHB72991LK"
                      value={invoicePaymentForm.mpesaCode}
                      onChange={(e) => setInvoicePaymentForm({ ...invoicePaymentForm, mpesaCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono uppercase focus:outline-none"
                    />
                  </div>
                )}

                {invoicePaymentForm.method === "bank" && (
                  <div className="space-y-1 col-span-2">
                    <label className="text-slate-300 font-semibold">Bank Ref / Cheque No</label>
                    <input
                      type="text"
                      placeholder="e.g. NCBA-TRX-98214"
                      value={invoicePaymentForm.bankRef}
                      onChange={(e) => setInvoicePaymentForm({ ...invoicePaymentForm, bankRef: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Payment Notes / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 50% upfront deposit received"
                    value={invoicePaymentForm.notes}
                    onChange={(e) => setInvoicePaymentForm({ ...invoicePaymentForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setPaymentTargetDoc(null)}
                  className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SHARE PDF MODAL
          Opens when user clicks the Share PDF button
      ══════════════════════════════════════════════════ */}
      {shareModalDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShareModalDoc(null)}>
          <div className="bg-card border border-teal-500/40 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-5 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Share Document</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{shareModalDoc.docNumber}</p>
                </div>
              </div>
              <button onClick={() => setShareModalDoc(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client info */}
            <div className="px-4 py-3 rounded-2xl bg-navy-950 border border-border text-xs space-y-0.5">
              <p className="text-slate-400">Client: <strong className="text-white">{shareModalDoc.client.name}</strong> — {shareModalDoc.client.company}</p>
              <p className="text-slate-400">Phone: <strong className="text-white font-mono">{shareModalDoc.client.phone}</strong></p>
            </div>

            {/* Action options */}
            <div className="space-y-3">
              {/* Option 1: Download PDF file */}
              <button
                onClick={() => { handleDownloadPdf(shareModalDoc); }}
                disabled={isGeneratingPdf}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold text-sm transition-all"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                ) : (
                  <Download className="w-5 h-5 shrink-0" />
                )}
                <div className="text-left">
                  <div>{isGeneratingPdf ? "Generating PDF…" : "Download PDF File"}</div>
                  <div className="text-[11px] font-normal opacity-80">Saves {shareModalDoc.docNumber}.pdf to Downloads</div>
                </div>
              </button>

              {/* Option 2: Native Share (opens WhatsApp/Gmail/Drive with file) */}
              <button
                onClick={() => { handleNativeSharePdf(shareModalDoc); }}
                disabled={isGeneratingPdf}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm transition-all"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                )}
                <div className="text-left">
                  <div>Share PDF via WhatsApp / Drive</div>
                  <div className="text-[11px] font-normal opacity-80">Generates PDF → opens native share sheet</div>
                </div>
              </button>

              {/* Option 3: WhatsApp text message fallback */}
              <a
                href={`https://wa.me/${shareModalDoc.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(generateDocWhatsAppMessage(shareModalDoc))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareModalDoc(null)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 border border-border text-slate-200 hover:text-white font-bold text-sm transition-all"
              >
                <MessageCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <div className="text-left">
                  <div>Send Summary via WhatsApp</div>
                  <div className="text-[11px] font-normal text-slate-400">Text message with totals + verify link</div>
                </div>
              </a>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              💡 On Android/iPhone: tap "Share PDF via WhatsApp" — it opens your native share sheet so you can send the actual PDF file.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          Google Review & Referral Booster Modal
          Fires automatically when an invoice is marked PAID
      ══════════════════════════════════════════════════ */}
      {reviewBoosterDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-card border border-emerald-500/40 rounded-3xl shadow-2xl shadow-emerald-500/10 max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-extrabold text-emerald-400">Invoice Paid! Great Work!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-semibold text-foreground">{reviewBoosterDoc.docNumber ?? reviewBoosterDoc.id.toUpperCase()}</span> for{" "}
                <span className="font-semibold text-foreground">{reviewBoosterDoc.client.name}</span> is now marked as settled.
              </p>
            </div>

            {/* Action Prompt */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-5">
              <div className="font-bold text-sm mb-2 text-emerald-300">⭐ Send a Google Review Request</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Happy clients are the best marketing. Send{" "}
                <span className="font-semibold text-foreground">{reviewBoosterDoc.client.name}</span> a WhatsApp
                message asking for a 5-star Google review or referral.
              </p>
            </div>

            {/* WhatsApp Message Preview */}
            <div className="bg-[#075e54]/10 border border-[#25d366]/20 rounded-xl p-4 mb-5">
              <div className="text-[10px] font-mono text-emerald-400 mb-2 font-bold">📱 WHATSAPP MESSAGE PREVIEW</div>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                {`Hello ${reviewBoosterDoc.client.name}! 👋

Thank you for settling invoice ${reviewBoosterDoc.docNumber ?? reviewBoosterDoc.id.toUpperCase()} with Krenovate Systems. We hope our IT services delivered real value for your business! 🙏

If you're happy with our work, we'd really appreciate a quick 5-star Google Review — it takes just 30 seconds and helps us serve more businesses in Nairobi:

⭐ Leave a Review → ${GOOGLE_REVIEW_URL}

Or refer a colleague who needs IT support in Nairobi — we'll prioritize their job! 🚀

Thank you for choosing Krenovate Systems!
— Peter Kivevo`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${reviewBoosterDoc.client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${reviewBoosterDoc.client.name}! 👋\n\nThank you for settling invoice ${reviewBoosterDoc.docNumber ?? reviewBoosterDoc.id.toUpperCase()} with Krenovate Systems. We hope our IT services delivered real value for your business! 🙏\n\nIf you're happy with our work, we'd really appreciate a quick 5-star Google Review — it takes just 30 seconds and helps us serve more businesses in Nairobi:\n\n⭐ Leave a Review → ${GOOGLE_REVIEW_URL}\n\nOr refer a colleague who needs IT support in Nairobi — we'll prioritize their job! 🚀\n\nThank you for choosing Krenovate Systems!\n— Peter Kivevo`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setReviewBoosterDoc(null)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#25d366] text-white font-bold text-sm hover:opacity-90 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send WhatsApp Review Request
              </a>
              <button
                onClick={() => setReviewBoosterDoc(null)}
                className="w-full py-3 rounded-2xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default KrenovateInvoiceManager;

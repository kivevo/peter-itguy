import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { dataStorage, InvoiceDocument, JobScheduleItem } from "@/services/dataStorage";
import { BrandLogo } from "@/components/BrandLogo";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  QrCode,
  ArrowLeft,
  Calendar,
  Building2,
  Hash,
  DollarSign,
  Zap,
  ExternalLink,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  MapPin,
  Check,
  X,
  ChevronRight,
  Phone
} from "lucide-react";

const VerifyInvoicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("doc") ?? "");
  const [verifiedInvoice, setVerifiedInvoice] = useState<InvoiceDocument | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if ?doc= param provided
  useEffect(() => {
    const docParam = searchParams.get("doc");
    if (docParam) {
      performSearch(docParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = (q: string) => {
    const all = dataStorage.getInvoices().filter((i) => !i.deletedAt);
    const match = all.find(
      (inv) =>
        inv.id.toLowerCase() === q.toLowerCase() ||
        inv.docNumber?.toLowerCase() === q.toLowerCase() ||
        inv.etimsControlCode?.toLowerCase().includes(q.toLowerCase())
    );
    setHasSearched(true);
    if (match) {
      setVerifiedInvoice(match);
      setNotFound(false);
    } else {
      setVerifiedInvoice(null);
      setNotFound(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    performSearch(q);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 2 }).format(n);

  const computeGrossTotal = (inv: InvoiceDocument): number => {
    const subtotal = (inv.items || []).reduce((acc, it) => acc + (it.qty || 1) * (it.unitPrice || 0), 0);
    const discount = inv.discountType === "percentage" ? (subtotal * (inv.discountValue || 0)) / 100 : (inv.discountValue || 0);
    const discounted = Math.max(0, subtotal - discount);
    const vat = inv.vatEnabled ? (discounted * (inv.vatPercent || 16)) / 100 : 0;
    return discounted + vat;
  };

  // Quote Acceptance State
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptedJob, setAcceptedJob] = useState<JobScheduleItem | null>(null);
  const [acceptForm, setAcceptForm] = useState({
    visitDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: "Morning (09:00 AM - 12:00 PM)",
    contactPerson: "",
    contactPhone: "",
    location: "",
    notes: "",
    agreedTerms: true,
  });

  // Pre-fill accept form when invoice loads
  useEffect(() => {
    if (verifiedInvoice) {
      setAcceptForm((prev) => ({
        ...prev,
        contactPerson: verifiedInvoice.client.name || "",
        contactPhone: verifiedInvoice.client.phone || "",
        location: verifiedInvoice.client.company
          ? `${verifiedInvoice.client.company}, ${verifiedInvoice.client.address || "Nairobi"}`
          : verifiedInvoice.client.address || "Nairobi",
      }));
    }
  }, [verifiedInvoice]);

  const handleConfirmAcceptance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedInvoice) return;

    setIsAccepting(true);

    // 1. Determine service type from items
    const descText = (verifiedInvoice.items || []).map((i) => i.desc).join(" ").toLowerCase();
    let serviceType: JobScheduleItem["serviceType"] = "Turnkey Office Setup";
    if (descText.includes("cctv") || descText.includes("camera") || descText.includes("nvr")) {
      serviceType = "CCTV & Cameras Setup";
    } else if (descText.includes("wi-fi") || descText.includes("wifi") || descText.includes("access point") || descText.includes("switch")) {
      serviceType = "Wi-Fi & Network Fix";
    } else if (descText.includes("repair") || descText.includes("laptop") || descText.includes("ssd") || descText.includes("ram") || descText.includes("server")) {
      serviceType = "Computer & Server Repair";
    }

    // 2. Create Job in DataStorage
    const newJob = dataStorage.addJob({
      clientName: acceptForm.contactPerson || verifiedInvoice.client.name,
      company: verifiedInvoice.client.company || verifiedInvoice.client.name,
      phone: acceptForm.contactPhone || verifiedInvoice.client.phone,
      location: acceptForm.location || verifiedInvoice.client.address || "Nairobi",
      visitDate: acceptForm.visitDate,
      timeSlot: acceptForm.timeSlot,
      serviceType,
      status: "scheduled",
      notes: `Auto-scheduled via Quote Acceptance #${verifiedInvoice.docNumber}. ${acceptForm.notes ? `Client Notes: ${acceptForm.notes}` : ""}`,
      hardwareSerialNumbers: (verifiedInvoice.items || []).map((i) => `${i.qty}x ${i.desc}`).join("; "),
    });

    // 3. Mark Invoice as Accepted
    const updatedInvoice: InvoiceDocument = {
      ...verifiedInvoice,
      status: "accepted",
      updatedAt: new Date().toISOString(),
    };
    dataStorage.saveInvoice(updatedInvoice);
    setVerifiedInvoice(updatedInvoice);
    setAcceptedJob(newJob);
    setIsAccepting(false);
    setShowAcceptModal(false);
  };

  const getWhatsAppAcceptanceMessage = (doc: InvoiceDocument, job: JobScheduleItem | null) => {
    const total = computeGrossTotal(doc);
    const dateStr = job ? job.visitDate : acceptForm.visitDate;
    const timeStr = job ? job.timeSlot : acceptForm.timeSlot;
    return `Hello Peter / Krenovate Systems! 👋\n\nI have reviewed and *ACCEPTED* formal quotation *${doc.docNumber}*.\n\n• *Client:* ${doc.client.company || doc.client.name}\n• *Total Value:* KES ${total.toLocaleString()}\n• *Preferred Deployment Date:* ${dateStr} (${timeStr})\n• *Location:* ${doc.client.company ? `${doc.client.company} - ` : ""}${doc.client.address || "Nairobi"}\n\nPlease confirm our on-site schedule. Thank you!`;
  };

  const getTaxSchemeLabel = (scheme?: InvoiceDocument["taxScheme"]) => {
    switch (scheme) {
      case "vat_16":
        return "VAT 16% (KRA Standard Rate)";
      case "tot_3":
        return "Turnover Tax 3% (KRA TOT)";
      case "zero_rated":
        return "Zero-Rated (0% VAT)";
      case "exempt":
        return "Tax Exempt";
      default:
        return "Standard Business Rate";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <BrandLogo />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/5 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            KRA eTIMS Fiscal Verification Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground to-emerald-400 bg-clip-text text-transparent">
            Verify Invoice Authenticity
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Scan the QR code from any Krenovate invoice or enter an Invoice Number / eTIMS Control Code to verify its fiscal authenticity and claim tax deductions.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="verify-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Invoice number or eTIMS control code..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium shadow-lg font-mono"
              />
            </div>
            <button
              id="verify-search-btn"
              type="submit"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
            >
              Verify Now
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-24 space-y-6">
        {/* Not Found */}
        {hasSearched && notFound && (
          <div className="rounded-3xl border border-border bg-card p-10 text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-400">Invoice Not Verified</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              No invoice matching <span className="font-mono font-bold text-foreground">"{searchQuery}"</span> was found in the Krenovate Systems fiscal ledger. This document may be fraudulent or the number may be incorrect.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              Please contact KRA or the issuing company to confirm validity.
            </div>
          </div>
        )}

        {/* Verified */}
        {verifiedInvoice && (
          <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
            {/* ══════════════════════════════════════════════════════
                1-CLICK QUOTE ACCEPTANCE & SCHEDULING ACTION CARD
            ══════════════════════════════════════════════════════ */}
            {verifiedInvoice.docType === "quotation" && (
              <div className="rounded-3xl border-2 border-teal-500/40 bg-gradient-to-br from-teal-500/15 via-card to-emerald-500/10 p-6 md:p-8 shadow-xl shadow-teal-500/10 space-y-5">
                {verifiedInvoice.status === "accepted" ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                        <Check className="w-4 h-4 text-emerald-400" />
                        PROPOSAL ACCEPTED &amp; SCHEDULED
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Status: <strong className="text-emerald-400 uppercase font-mono">Accepted</strong>
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-extrabold text-foreground">
                      🎉 Deployment is Booked with Krenovate Systems!
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Thank you for confirming your quotation. Our lead engineer <strong>Peter Kivevo John</strong> has been notified and your job is queued in our active dispatch ledger.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        to={`/track?job=${verifiedInvoice.docNumber}`}
                        className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Track Live Job Status</span>
                      </Link>

                      <a
                        href={`https://wa.me/254722000000?text=${encodeURIComponent(
                          getWhatsAppAcceptanceMessage(verifiedInvoice, acceptedJob)
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat with Peter on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                        Client Action Required
                      </div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                        Ready to Proceed with This Quotation?
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
                        Accept this quotation online to lock in your hardware allocation and pick your preferred on-site deployment date. No paperwork required.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAcceptModal(true)}
                      className="px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-navy-950 font-black text-sm shadow-xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Accept &amp; Book Deployment</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Verification Badge */}
            <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/5 shadow-2xl shadow-emerald-500/10 overflow-hidden">
              {/* Verified Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-white font-extrabold text-xl">✅ Fiscally Verified</div>
                  <div className="text-white/80 text-sm">This is an authentic KRA-compliant document issued by Krenovate Systems</div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="p-8 grid md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-5">
                  <DetailRow icon={<Hash className="w-4 h-4 text-emerald-400" />} label="Invoice Number" value={verifiedInvoice.docNumber ?? verifiedInvoice.id.toUpperCase()} mono />
                  <DetailRow icon={<Calendar className="w-4 h-4 text-blue-400" />} label="Issue Date" value={new Date(verifiedInvoice.issueDate ?? verifiedInvoice.createdAt).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
                  <DetailRow
                    icon={<FileText className="w-4 h-4 text-purple-400" />}
                    label="Document Type"
                    value={
                      verifiedInvoice.docType === "quotation"
                        ? "Tax Quotation"
                        : verifiedInvoice.docType === "receipt"
                        ? "Payment Receipt"
                        : "Tax Invoice"
                    }
                  />
                  <DetailRow icon={<DollarSign className="w-4 h-4 text-amber-400" />} label="Gross Invoice Amount" value={fmt(computeGrossTotal(verifiedInvoice))} mono />
                  {verifiedInvoice.taxScheme && (
                    <DetailRow icon={<ShieldCheck className="w-4 h-4 text-teal-400" />} label="Tax Regime" value={getTaxSchemeLabel(verifiedInvoice.taxScheme)} />
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <DetailRow icon={<Building2 className="w-4 h-4 text-cyan-400" />} label="Issuer (Supplier)" value="Peter Kivevo John / Krenovate Systems" />
                  <DetailRow icon={<ShieldCheck className="w-4 h-4 text-red-400" />} label="Supplier KRA PIN" value="P051892401K" mono />
                  {(verifiedInvoice.client?.company || verifiedInvoice.client?.name) && (
                    <DetailRow
                      icon={<Building2 className="w-4 h-4 text-indigo-400" />}
                      label="Client / Buyer"
                      value={verifiedInvoice.client.company || verifiedInvoice.client.name}
                    />
                  )}
                  {verifiedInvoice.client?.kraPin && (
                    <DetailRow
                      icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
                      label="Client KRA PIN"
                      value={verifiedInvoice.client.kraPin}
                      mono
                    />
                  )}
                  {verifiedInvoice.etimsControlCode && (
                    <DetailRow icon={<QrCode className="w-4 h-4 text-emerald-400" />} label="eTIMS Control Code" value={verifiedInvoice.etimsControlCode} mono />
                  )}
                  {verifiedInvoice.etimsInternalSign && (
                    <DetailRow icon={<Zap className="w-4 h-4 text-yellow-400" />} label="Internal Data Signature" value={verifiedInvoice.etimsInternalSign} mono truncate />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 px-8 py-5 bg-card/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified against Krenovate Systems Fiscal Ledger · KRA eTIMS Compliant
                </div>
                <a
                  href="https://itax.kra.go.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-teal-400 hover:underline"
                >
                  Cross-verify on KRA iTax
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Tax Deduction Notice */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-sm text-blue-300 mb-1">Finance & Procurement Teams</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This invoice is eligible for input VAT claims or business expense deductions under Kenya Revenue Authority regulations. The supplier (Peter Kivevo John, KRA PIN: P051892401K) is a registered taxpayer under the Turnover Tax / VAT regime. Retain this record as supporting documentation for your annual returns.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Default state */}
        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              { icon: "📱", title: "Scan Invoice QR", desc: "Every Krenovate invoice has a QR code that opens this verification page directly." },
              { icon: "🔐", title: "Instant Verification", desc: "Cross-references our fiscal ledger and KRA eTIMS control codes in real time." },
              { icon: "🏦", title: "Claim Tax Deductions", desc: "Finance teams can safely claim input VAT or business expenses using verified invoices." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-border bg-card text-center space-y-3">
                <div className="text-3xl">{item.icon}</div>
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          QUOTE ACCEPTANCE & DEPLOYMENT SCHEDULING MODAL
      ══════════════════════════════════════════════════ */}
      {showAcceptModal && verifiedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAcceptModal(false)}>
          <div
            className="w-full max-w-lg rounded-3xl bg-card border-2 border-teal-500/50 p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-foreground">
                    Accept Proposal &amp; Book Deployment
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {verifiedInvoice.docNumber} · {verifiedInvoice.client.company || verifiedInvoice.client.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total value callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Agreed Proposal Value</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {fmt(computeGrossTotal(verifiedInvoice))}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{verifiedInvoice.items.length} Item(s)</div>
                <div className="text-teal-300 font-semibold">Priority Engineering</div>
              </div>
            </div>

            <form onSubmit={handleConfirmAcceptance} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    Preferred Deployment Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={acceptForm.visitDate}
                    onChange={(e) => setAcceptForm({ ...acceptForm, visitDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    Preferred Time Window *
                  </label>
                  <select
                    value={acceptForm.timeSlot}
                    onChange={(e) => setAcceptForm({ ...acceptForm, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none text-xs"
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                    <option value="Weekend / After-Hours">Weekend / After-Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">On-Site Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={acceptForm.contactPerson}
                    onChange={(e) => setAcceptForm({ ...acceptForm, contactPerson: e.target.value })}
                    placeholder="e.g. David Mwangi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground font-semibold">Direct Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={acceptForm.contactPhone}
                    onChange={(e) => setAcceptForm({ ...acceptForm, contactPhone: e.target.value })}
                    placeholder="e.g. +254 722 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  Site Location / Physical Address *
                </label>
                <input
                  type="text"
                  required
                  value={acceptForm.location}
                  onChange={(e) => setAcceptForm({ ...acceptForm, location: e.target.value })}
                  placeholder="e.g. Peak Logistics Hub, 4th Floor, Westlands, Nairobi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground font-semibold">Special Site Access or Deployment Instructions</label>
                <textarea
                  rows={2}
                  value={acceptForm.notes}
                  onChange={(e) => setAcceptForm({ ...acceptForm, notes: e.target.value })}
                  placeholder="e.g. Server room is on 4th floor, ask for receptionist to issue visitor pass..."
                  className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none text-xs resize-none"
                />
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-secondary/30 border border-border cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={acceptForm.agreedTerms}
                  onChange={(e) => setAcceptForm({ ...acceptForm, agreedTerms: e.target.checked })}
                  className="mt-0.5 rounded border-border text-teal-600 focus:ring-teal-500"
                />
                <span className="text-[11px] text-muted-foreground leading-relaxed">
                  I confirm acceptance of Quotation <strong>{verifiedInvoice.docNumber}</strong> and authorize Krenovate Systems to dispatch hardware and engineering staff on the scheduled date.
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAcceptModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-foreground hover:bg-accent font-semibold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAccepting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-navy-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Krenovate Systems · KRA eTIMS Verification Portal ·{" "}
        <Link to="/track" className="hover:text-teal-400 transition-colors">
          Track Repair
        </Link>{" "}
        ·{" "}
        <Link to="/contact" className="hover:text-teal-400 transition-colors">
          Contact
        </Link>
      </footer>
    </div>
  );
};

// Reusable detail row component
const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}> = ({ icon, label, value, mono, truncate }) => (
  <div>
    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-1">
      {icon}
      {label}
    </div>
    <div
      className={`text-sm font-semibold ${mono ? "font-mono tracking-wide" : ""} ${
        truncate ? "truncate max-w-xs" : ""
      }`}
      title={truncate ? value : undefined}
    >
      {value}
    </div>
  </div>
);

export default VerifyInvoicePage;

import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { dataStorage, InvoiceDocument } from "@/services/dataStorage";
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
            {/* Verification Badge */}
            <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/5 shadow-2xl shadow-emerald-500/10 overflow-hidden">
              {/* Verified Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-white font-extrabold text-xl">✅ Fiscally Verified</div>
                  <div className="text-white/80 text-sm">This is an authentic KRA-compliant tax invoice issued by Krenovate Systems</div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="p-8 grid md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-5">
                  <DetailRow icon={<Hash className="w-4 h-4 text-emerald-400" />} label="Invoice Number" value={verifiedInvoice.docNumber ?? verifiedInvoice.id.toUpperCase()} mono />
                  <DetailRow icon={<Calendar className="w-4 h-4 text-blue-400" />} label="Issue Date" value={new Date(verifiedInvoice.issueDate ?? verifiedInvoice.createdAt).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
                  <DetailRow icon={<FileText className="w-4 h-4 text-purple-400" />} label="Document Type" value={verifiedInvoice.docType === "quote" ? "Tax Quotation" : "Tax Invoice"} />
                  <DetailRow icon={<DollarSign className="w-4 h-4 text-amber-400" />} label="Gross Invoice Amount" value={fmt(verifiedInvoice.totalAmount ?? 0)} mono />
                  {verifiedInvoice.taxScheme && (
                    <DetailRow icon={<ShieldCheck className="w-4 h-4 text-teal-400" />} label="Tax Regime" value={verifiedInvoice.taxScheme === "vat" ? "VAT 16% (KRA)" : "Turnover Tax 3% (KRA)"} />
                  )}
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <DetailRow icon={<Building2 className="w-4 h-4 text-cyan-400" />} label="Issuer (Supplier)" value="Peter Kivevo John / Krenovate Systems" />
                  <DetailRow icon={<ShieldCheck className="w-4 h-4 text-red-400" />} label="Supplier KRA PIN" value="P051892401K" mono />
                  {verifiedInvoice.clientName && (
                    <DetailRow icon={<Building2 className="w-4 h-4 text-indigo-400" />} label="Client / Buyer" value={verifiedInvoice.clientName} />
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

import React, { useState, useEffect } from "react";
import { 
  dataStorage, 
  KRAProfileSettings, 
  WhtCertificateRecord, 
  KRATaxReturnSummary, 
  InvoiceDocument, 
  ExpenseRecord 
} from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Calendar, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  CreditCard, 
  Sparkles, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  Check, 
  Info, 
  TrendingUp, 
  DollarSign, 
  HelpCircle,
  QrCode,
  Sliders,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from "lucide-react";

export const KRATaxAssistant: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"monthly" | "annual" | "wht" | "etims" | "settings">("monthly");
  
  // Settings & Profiles
  const [kraProfile, setKraProfile] = useState<KRAProfileSettings>(() => dataStorage.getKRAProfile());
  const [whtCertificates, setWhtCertificates] = useState<WhtCertificateRecord[]>(() => dataStorage.getWhtCertificates());
  
  // Date selections for monthly / annual calculations
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);

  // Computed Return Summaries
  const [monthlySummary, setMonthlySummary] = useState<KRATaxReturnSummary>(() => 
    dataStorage.calculateTaxReturn("monthly", currentDate.getFullYear(), currentDate.getMonth() + 1)
  );
  const [annualSummary, setAnnualSummary] = useState<KRATaxReturnSummary>(() => 
    dataStorage.calculateTaxReturn("annual", currentDate.getFullYear())
  );

  // Invoices & Expenses for drilldown
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  // Modals
  const [showAddWhtModal, setShowAddWhtModal] = useState(false);
  const [showPrintTaxStatement, setShowPrintTaxStatement] = useState(false);
  const [showFilingGuideModal, setShowFilingGuideModal] = useState(false);

  // Form State for Add WHT Certificate
  const [whtForm, setWhtForm] = useState({
    certificateNumber: "",
    withholdingAgentName: "",
    withholdingAgentPin: "",
    invoiceDocNumber: "",
    grossAmount: "",
    whtAmount: "",
    whtType: "management_professional_5" as WhtCertificateRecord["whtType"],
    dateWithheld: new Date().toISOString().split("T")[0],
    taxPeriod: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`,
    status: "verified" as WhtCertificateRecord["status"],
    notes: "",
  });

  // Search in WHT certificates
  const [whtSearchQuery, setWhtSearchQuery] = useState("");

  // Refresh data on mount and subscription
  const refreshData = () => {
    setKraProfile(dataStorage.getKRAProfile());
    setWhtCertificates(dataStorage.getWhtCertificates());
    setInvoices(dataStorage.getInvoices().filter((inv) => !inv.deletedAt));
    setExpenses(dataStorage.getExpenses());
    setMonthlySummary(dataStorage.calculateTaxReturn("monthly", selectedYear, selectedMonth));
    setAnnualSummary(dataStorage.calculateTaxReturn("annual", selectedYear));
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = dataStorage.subscribe(refreshData);
    return () => unsubscribe();
  }, [selectedYear, selectedMonth]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveKRAProfile(kraProfile);
    toast({
      title: "KRA Tax Profile Saved",
      description: "Your KRA PIN, obligation types, and eTIMS parameters have been updated.",
    });
    refreshData();
  };

  const handleAddWhtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whtForm.certificateNumber || !whtForm.withholdingAgentName || !whtForm.grossAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide Certificate Number, Agent Name, and Gross Amount.",
        variant: "destructive",
      });
      return;
    }

    const gross = parseFloat(whtForm.grossAmount) || 0;
    const wht = parseFloat(whtForm.whtAmount) || gross * (kraProfile.whtRate / 100);

    dataStorage.addWhtCertificate({
      certificateNumber: whtForm.certificateNumber.trim().toUpperCase(),
      withholdingAgentName: whtForm.withholdingAgentName.trim(),
      withholdingAgentPin: whtForm.withholdingAgentPin.trim().toUpperCase(),
      invoiceDocNumber: whtForm.invoiceDocNumber.trim(),
      grossAmount: gross,
      whtAmount: wht,
      whtType: whtForm.whtType,
      dateWithheld: whtForm.dateWithheld,
      taxPeriod: whtForm.taxPeriod,
      status: whtForm.status,
      notes: whtForm.notes,
    });

    toast({
      title: "WHT Certificate Logged",
      description: `KES ${wht.toLocaleString()} credit logged from ${whtForm.withholdingAgentName}.`,
    });

    setShowAddWhtModal(false);
    setWhtForm({
      certificateNumber: "",
      withholdingAgentName: "",
      withholdingAgentPin: "",
      invoiceDocNumber: "",
      grossAmount: "",
      whtAmount: "",
      whtType: "management_professional_5",
      dateWithheld: new Date().toISOString().split("T")[0],
      taxPeriod: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`,
      status: "verified",
      notes: "",
    });
    refreshData();
  };

  const handleDeleteWht = (id: string, certNo: string) => {
    if (confirm(`Remove WHT certificate ${certNo}?`)) {
      dataStorage.deleteWhtCertificate(id);
      toast({
        title: "Certificate Removed",
        description: "The credit has been removed from your tax schedule.",
      });
      refreshData();
    }
  };

  // --- Export Helpers ---
  const exportSalesCSV = () => {
    const periodInvoices = invoices.filter((inv) => {
      const d = new Date(inv.issueDate);
      return !isNaN(d.getTime()) && d.getFullYear() === selectedYear && (activeTab === "monthly" ? d.getMonth() + 1 === selectedMonth : true);
    });

    const headers = [
      "Invoice Number",
      "Issue Date",
      "Customer Name",
      "Customer KRA PIN",
      "Taxable Value (KES)",
      "VAT Amount (KES)",
      "Gross Total (KES)",
      "eTIMS Control Code",
      "Payment Status"
    ];

    const rows = periodInvoices.map((inv) => {
      const subtotal = inv.items.reduce((s, i) => s + (i.qty || 1) * (i.unitPrice || 0), 0);
      const discount = inv.discountType === "percentage" ? (subtotal * (inv.discountValue || 0)) / 100 : (inv.discountValue || 0);
      const taxable = Math.max(0, subtotal - discount);
      const vat = inv.vatEnabled ? taxable * ((inv.vatPercent || 16) / 100) : 0;
      const total = taxable + vat;

      return [
        `"${inv.docNumber}"`,
        `"${inv.issueDate}"`,
        `"${(inv.client.company || inv.client.name).replace(/"/g, '""')}"`,
        `"${inv.client.kraPin || "N/A"}"`,
        taxable.toFixed(2),
        vat.toFixed(2),
        total.toFixed(2),
        `"${inv.etimsControlCode || "N/A"}"`,
        `"${inv.status.toUpperCase()}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRA_Sales_Ledger_${selectedYear}_${activeTab === "monthly" ? `M${selectedMonth}` : "Annual"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sales Ledger Exported",
      description: "CSV formatted for KRA iTax Sales Schedule upload ready.",
    });
  };

  const exportPurchasesCSV = () => {
    const periodExpenses = expenses.filter((exp) => {
      const d = new Date(exp.date);
      return !isNaN(d.getTime()) && d.getFullYear() === selectedYear && (activeTab === "monthly" ? d.getMonth() + 1 === selectedMonth : true);
    });

    const headers = [
      "Expense Date",
      "Expense Category",
      "Description",
      "Receipt Reference",
      "Total Amount (KES)",
      "Claimable Input Tax (KES)"
    ];

    const rows = periodExpenses.map((exp) => {
      const amount = exp.amount || 0;
      const isInputTaxEligible = exp.category === "hardware_parts" || exp.category === "software_tools";
      const inputTax = isInputTaxEligible ? (amount * 0.16) / 1.16 : 0;

      return [
        `"${exp.date}"`,
        `"${exp.category.toUpperCase()}"`,
        `"${(exp.description || "").replace(/"/g, '""')}"`,
        `"${exp.receiptNote || "N/A"}"`,
        amount.toFixed(2),
        inputTax.toFixed(2)
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRA_Purchases_Expenses_${selectedYear}_${activeTab === "monthly" ? `M${selectedMonth}` : "Annual"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Purchases Ledger Exported",
      description: "CSV formatted for KRA iTax Purchase & Expense Schedule ready.",
    });
  };

  const exportWhtScheduleCSV = () => {
    const headers = [
      "Certificate Number",
      "Date Withheld",
      "Withholding Agent Name",
      "Withholding Agent PIN",
      "Invoice Number",
      "Gross Value (KES)",
      "5% WHT Withheld (KES)",
      "Status"
    ];

    const rows = whtCertificates.map((cert) => [
      `"${cert.certificateNumber}"`,
      `"${cert.dateWithheld}"`,
      `"${cert.withholdingAgentName.replace(/"/g, '""')}"`,
      `"${cert.withholdingAgentPin}"`,
      `"${cert.invoiceDocNumber || "N/A"}"`,
      cert.grossAmount.toFixed(2),
      cert.whtAmount.toFixed(2),
      `"${cert.status.toUpperCase()}"`
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KRA_WHT_Schedule_Credits_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "WHT Credits Exported",
      description: "CSV formatted for Section F of KRA iTax return ready.",
    });
  };

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const filteredWhtCertificates = whtCertificates.filter((cert) => {
    const q = whtSearchQuery.toLowerCase();
    return (
      cert.certificateNumber.toLowerCase().includes(q) ||
      cert.withholdingAgentName.toLowerCase().includes(q) ||
      cert.withholdingAgentPin.toLowerCase().includes(q) ||
      (cert.invoiceDocNumber && cert.invoiceDocNumber.toLowerCase().includes(q))
    );
  });

  const totalWhtCredits = whtCertificates.reduce((s, c) => s + (c.whtAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / KRA Compliance Status Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-card to-card dark:from-red-950/30 dark:via-navy-900 dark:to-navy-900 border border-red-500/20 p-6 sm:p-7 shadow-card-dark flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold border border-red-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              KRA eTIMS &amp; iTax Compliance Engine
            </span>
            <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-mono font-semibold">
              PIN: {kraProfile.kraPin || "Not Configured"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-mono">
              Obligation: {kraProfile.taxObligation === "turnover_tax" ? "Turnover Tax (TOT 3%)" : kraProfile.taxObligation === "standard_vat" ? "Standard VAT (16%)" : "Individual Income Tax"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
            Tax Ledger, eTIMS Invoicing &amp; Return Filing Assistant
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Automate monthly Turnover Tax (TOT), track 5% Withholding Tax (WHT) certificates, compute annual income tax deductions, and generate 1-click KRA iTax offline upload spreadsheets.
          </p>
        </div>

        {/* Due Date Indicator Box */}
        <div className="flex items-center gap-3 bg-background/80 dark:bg-navy-950/80 p-4 rounded-2xl border border-border/80 shadow-sm flex-shrink-0 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">Next KRA Filing Due:</span>
            <span className="text-sm sm:text-base font-bold text-foreground font-mono">
              {monthlySummary.dueDate}
            </span>
            <span className={`text-[11px] font-mono block ${monthlySummary.daysRemaining <= 5 ? "text-red-500 font-bold" : "text-teal-600 dark:text-teal-400"}`}>
              {monthlySummary.daysRemaining < 0 
                ? `⚠️ ${Math.abs(monthlySummary.daysRemaining)} Days Overdue` 
                : `${monthlySummary.daysRemaining} Days Remaining`}
            </span>
          </div>
          <button
            onClick={() => setShowFilingGuideModal(true)}
            className="ml-auto px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <span>iTax Guide</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("monthly")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "monthly"
              ? "bg-red-600 text-white shadow-sm shadow-red-500/20"
              : "bg-card hover:bg-muted text-muted-foreground border border-border"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Monthly Return (TOT 3% / VAT)</span>
        </button>

        <button
          onClick={() => setActiveTab("annual")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "annual"
              ? "bg-red-600 text-white shadow-sm shadow-red-500/20"
              : "bg-card hover:bg-muted text-muted-foreground border border-border"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Annual Income Tax Return (ITR)</span>
        </button>

        <button
          onClick={() => setActiveTab("wht")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "wht"
              ? "bg-red-600 text-white shadow-sm shadow-red-500/20"
              : "bg-card hover:bg-muted text-muted-foreground border border-border"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Withholding Tax (WHT 5%) Credits ({whtCertificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("etims")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "etims"
              ? "bg-red-600 text-white shadow-sm shadow-red-500/20"
              : "bg-card hover:bg-muted text-muted-foreground border border-border"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>eTIMS Device &amp; Fiscal Controls</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "settings"
              ? "bg-red-600 text-white shadow-sm shadow-red-500/20"
              : "bg-card hover:bg-muted text-muted-foreground border border-border"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tax Profile &amp; Obligation Config</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPrintTaxStatement(true)}
            className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-red-500" />
            <span>Print Tax Summary</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          TAB 1: MONTHLY RETURN ASSISTANT (TOT 3% / VAT3)
          ========================================== */}
      {activeTab === "monthly" && (
        <div className="space-y-6">
          {/* Period Selector & Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card dark:bg-navy-900 p-4 rounded-2xl border border-border">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-foreground font-mono">Tax Period:</span>
              
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={exportSalesCSV}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border/80 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />
                <span>Sales Schedule CSV</span>
              </button>

              <button
                onClick={exportPurchasesCSV}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-teal-500" />
                <span>Purchases Schedule CSV</span>
              </button>

              <a
                href="https://itax.kra.go.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>File on iTax</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 4 Monthly KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Monthly Gross Invoiced</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                KES {monthlySummary.grossSales.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                From completed client invoices
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Allowable Expenses</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                KES {monthlySummary.allowableDeductions.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                Hardware, travel &amp; operational costs
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">
                {kraProfile.taxObligation === "turnover_tax" ? "Turnover Tax (3% TOT)" : "Output VAT (16%)"}
              </span>
              <span className="text-2xl font-extrabold font-heading text-red-600 dark:text-red-400 block">
                KES {monthlySummary.grossTaxLiability.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">
                {kraProfile.taxObligation === "turnover_tax" ? "3% on gross turnover" : "16% Standard VAT"}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-red-500/30 space-y-1.5 bg-red-500/5">
              <span className="text-xs font-mono text-red-600 dark:text-red-400 font-bold uppercase tracking-wider block">Net Tax Payable</span>
              <span className="text-2xl font-extrabold font-heading text-red-600 dark:text-red-400 block">
                KES {monthlySummary.netTaxPayable.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block font-mono">
                Due on {monthlySummary.dueDate} (KRA e-Slip)
              </span>
            </div>
          </div>

          {/* Detailed Monthly Computation Table */}
          <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold font-heading text-foreground">
                  Monthly Tax Return Computation Breakdown ({monthlySummary.periodLabel})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Detailed ledger reconciliation for your KRA iTax monthly filing.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20">
                {kraProfile.taxObligation === "turnover_tax" ? "TOT Section" : "VAT3 Schedule"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground">
                    <th className="pb-3 font-semibold">Line Item / KRA Section</th>
                    <th className="pb-3 font-semibold">Calculation Rule</th>
                    <th className="pb-3 font-semibold text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 font-bold text-foreground">1. Total Invoiced Value (Gross Turnover)</td>
                    <td className="py-3 text-muted-foreground">Sum of tech support, Wi-Fi, &amp; web invoices</td>
                    <td className="py-3 font-bold text-right text-foreground">{monthlySummary.grossSales.toLocaleString()}</td>
                  </tr>

                  {kraProfile.taxObligation === "standard_vat" && (
                    <>
                      <tr>
                        <td className="py-3 font-bold text-foreground">2. Output VAT (16% Charged to Clients)</td>
                        <td className="py-3 text-muted-foreground">16% of Standard Rated Sales</td>
                        <td className="py-3 font-bold text-right text-foreground">{monthlySummary.totalVatInvoiced.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-foreground">3. Less: Input VAT on Business Purchases</td>
                        <td className="py-3 text-muted-foreground">Hardware parts, Mikrotik/UniFi stock receipts</td>
                        <td className="py-3 font-bold text-right text-teal-600 dark:text-teal-400">-{monthlySummary.inputTaxCredit.toLocaleString()}</td>
                      </tr>
                    </>
                  )}

                  {kraProfile.taxObligation === "turnover_tax" && (
                    <tr>
                      <td className="py-3 font-bold text-foreground">2. Turnover Tax Liability (3%)</td>
                      <td className="py-3 text-muted-foreground">3% × Gross Turnover (Small Business Regime)</td>
                      <td className="py-3 font-bold text-right text-red-600 dark:text-red-400">{monthlySummary.grossTaxLiability.toLocaleString()}</td>
                    </tr>
                  )}

                  <tr>
                    <td className="py-3 font-bold text-foreground">4. Less: Withholding Tax Credits (WHT 5%)</td>
                    <td className="py-3 text-muted-foreground">Deducted by corporate clients with certificates</td>
                    <td className="py-3 font-bold text-right text-teal-600 dark:text-teal-400">-{monthlySummary.whtDeductedCredits.toLocaleString()}</td>
                  </tr>

                  <tr className="bg-muted/30 dark:bg-navy-950/50 font-bold text-sm">
                    <td className="py-4 text-foreground">NET TAX PAYABLE TO KRA</td>
                    <td className="py-4 text-muted-foreground font-normal text-xs">Generate Payment Registration Number (PRN) on iTax</td>
                    <td className="py-4 text-right text-red-600 dark:text-red-400">KES {monthlySummary.netTaxPayable.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Tips Box */}
            <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold">
                <Info className="w-4 h-4" />
                <span>How to Pay via M-Pesa on KRA iTax</span>
              </div>
              <p>
                1. Log into <strong>itax.kra.go.ke</strong> &rarr; Click <strong>Payments</strong> &rarr; <strong>Payment Registration</strong>.
                <br />
                2. Select Obligation: <strong>{kraProfile.taxObligation === "turnover_tax" ? "Turnover Tax" : "VAT"}</strong> &rarr; Enter Tax Period: <strong>{monthlySummary.periodLabel}</strong>.
                <br />
                3. Enter Net Amount: <strong>KES {monthlySummary.netTaxPayable.toLocaleString()}</strong> &rarr; Click Submit to generate the <strong>PRN (e-Slip)</strong>.
                <br />
                4. Pay via M-Pesa Paybill <strong>572572</strong>, Account Number = <strong>PRN Number</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: ANNUAL INCOME TAX RETURN (ITR)
          ========================================== */}
      {activeTab === "annual" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card dark:bg-navy-900 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-foreground font-mono">Tax Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value={2025}>2025 Tax Year (Due June 30, 2026)</option>
                <option value={2026}>2026 Tax Year (Due June 30, 2027)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportWhtScheduleCSV}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border/80 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />
                <span>Export WHT Schedule CSV</span>
              </button>

              <button
                onClick={() => setShowPrintTaxStatement(true)}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Printer className="w-3 h-3" />
                <span>Annual Tax Statement</span>
              </button>
            </div>
          </div>

          {/* Annual P&L Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Total Annual Revenue</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                KES {annualSummary.grossSales.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">Gross Business Incomes</span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Allowable Expenses</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                KES {annualSummary.allowableDeductions.toLocaleString()}
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 block font-mono">100% Tax Deductible</span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1.5">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Net Taxable Profit</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                KES {annualSummary.netTaxableIncome.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">Revenue minus business expenses</span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-red-500/30 space-y-1.5 bg-red-500/5">
              <span className="text-xs font-mono text-red-600 dark:text-red-400 font-bold uppercase tracking-wider block">Annual Net Tax</span>
              <span className="text-2xl font-extrabold font-heading text-red-600 dark:text-red-400 block">
                KES {annualSummary.netTaxPayable.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block font-mono">
                After Personal Relief &amp; WHT Credits
              </span>
            </div>
          </div>

          {/* Graduated Tax Bands Calculator Card */}
          <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold font-heading text-foreground">
                Kenya Individual Income Tax Graduated Bands Calculation (Finance Act)
              </h3>
              <p className="text-xs text-muted-foreground">
                Progressive tiered tax rates computed on net taxable business income.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground">
                    <th className="pb-3 font-semibold">Taxable Income Band</th>
                    <th className="pb-3 font-semibold">Tax Rate</th>
                    <th className="pb-3 font-semibold">Max Band Tax (KES)</th>
                    <th className="pb-3 font-semibold text-right">Tax Charged (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-2.5 text-foreground">First KES 288,000 (KES 1 – 288,000)</td>
                    <td className="py-2.5 text-muted-foreground">10%</td>
                    <td className="py-2.5 text-muted-foreground">28,800</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      {(Math.min(annualSummary.netTaxableIncome, 288000) * 0.10).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-foreground">Next KES 100,000 (KES 288,001 – 388,000)</td>
                    <td className="py-2.5 text-muted-foreground">25%</td>
                    <td className="py-2.5 text-muted-foreground">25,000</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      {(Math.max(0, Math.min(annualSummary.netTaxableIncome - 288000, 100000)) * 0.25).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-foreground">Next KES 5,612,000 (KES 388,001 – 6,000,000)</td>
                    <td className="py-2.5 text-muted-foreground">30%</td>
                    <td className="py-2.5 text-muted-foreground">1,683,600</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      {(Math.max(0, Math.min(annualSummary.netTaxableIncome - 388000, 5612000)) * 0.30).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-foreground">Next KES 3,600,000 (KES 6,000,001 – 9,600,000)</td>
                    <td className="py-2.5 text-muted-foreground">32.5%</td>
                    <td className="py-2.5 text-muted-foreground">1,170,000</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      {(Math.max(0, Math.min(annualSummary.netTaxableIncome - 6000000, 3600000)) * 0.325).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-foreground">Above KES 9,600,000</td>
                    <td className="py-2.5 text-muted-foreground">35%</td>
                    <td className="py-2.5 text-muted-foreground">Progressive</td>
                    <td className="py-2.5 text-right font-bold text-foreground">
                      {(Math.max(0, annualSummary.netTaxableIncome - 9600000) * 0.35).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="font-bold border-t border-border">
                    <td className="py-3 text-foreground" colSpan={3}>Gross Income Tax Liability</td>
                    <td className="py-3 text-right text-foreground">{annualSummary.grossTaxLiability.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-foreground" colSpan={3}>Less: Annual Personal Relief (Statutory KES 2,400/month)</td>
                    <td className="py-2.5 text-right text-teal-600 dark:text-teal-400">-{annualSummary.personalRelief.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-foreground" colSpan={3}>Less: Withholding Tax Credits (5% deducted by Corporate Clients)</td>
                    <td className="py-2.5 text-right text-teal-600 dark:text-teal-400">-{annualSummary.whtDeductedCredits.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-muted/40 dark:bg-navy-950/60 font-bold text-sm">
                    <td className="py-4 text-foreground" colSpan={3}>FINAL NET TAX PAYABLE (DUE JUNE 30)</td>
                    <td className="py-4 text-right text-red-600 dark:text-red-400">KES {annualSummary.netTaxPayable.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: WITHHOLDING TAX (WHT 5%) CERTIFICATES
          ========================================== */}
      {activeTab === "wht" && (
        <div className="space-y-6">
          {/* Header and Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card dark:bg-navy-900 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search agent, PIN, cert #..."
                  value={whtSearchQuery}
                  onChange={(e) => setWhtSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500 w-56 sm:w-72"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportWhtScheduleCSV}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setShowAddWhtModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log WHT Certificate</span>
              </button>
            </div>
          </div>

          {/* WHT Credit KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Total WHT Credits Logged</span>
              <span className="text-2xl font-extrabold font-heading text-teal-600 dark:text-teal-400 block">
                KES {totalWhtCredits.toLocaleString()}
              </span>
              <span className="text-[11px] text-muted-foreground block">Reduces your final KRA tax bill directly</span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Verified Certificates</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                {whtCertificates.filter((c) => c.status === "verified").length} of {whtCertificates.length}
              </span>
              <span className="text-[11px] text-muted-foreground block">Matches corporate client deductions</span>
            </div>

            <div className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">Standard WHT Rate</span>
              <span className="text-2xl font-extrabold font-heading text-foreground block">
                5.0%
              </span>
              <span className="text-[11px] text-muted-foreground block">Management &amp; Tech Consultancy</span>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground">
                    <th className="pb-3 font-semibold">Certificate Number</th>
                    <th className="pb-3 font-semibold">Withholding Agent &amp; PIN</th>
                    <th className="pb-3 font-semibold">Invoice Ref</th>
                    <th className="pb-3 font-semibold text-right">Gross Value</th>
                    <th className="pb-3 font-semibold text-right">5% WHT Credit</th>
                    <th className="pb-3 font-semibold">Date Withheld</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredWhtCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-bold text-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span>{cert.certificateNumber}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-foreground block">{cert.withholdingAgentName}</span>
                        <span className="text-[10px] text-muted-foreground block">{cert.withholdingAgentPin}</span>
                      </td>
                      <td className="py-3 text-muted-foreground">{cert.invoiceDocNumber || "N/A"}</td>
                      <td className="py-3 text-right font-bold text-foreground">
                        KES {cert.grossAmount.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-bold text-teal-600 dark:text-teal-400">
                        KES {cert.whtAmount.toLocaleString()}
                      </td>
                      <td className="py-3 text-muted-foreground">{cert.dateWithheld}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cert.status === "verified"
                            ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}>
                          {cert.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteWht(cert.id, cert.certificateNumber)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredWhtCertificates.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No Withholding Tax certificates matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: eTIMS DEVICE & FISCAL CONTROLS
          ========================================== */}
      {activeTab === "etims" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold font-heading text-foreground">
                  KRA eTIMS Fiscal Signature &amp; Control Code Settings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ensure all invoices generated for corporate clients include valid eTIMS control codes, QR verification, and CU serial signatures.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                eTIMS Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">eTIMS Device / CU Serial Number</label>
                <input
                  type="text"
                  value={kraProfile.etimsSerialNumber}
                  onChange={(e) => setKraProfile({ ...kraProfile, etimsSerialNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="e.g. KRA-ETIMS-PK01-2026"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">eTIMS Branch ID</label>
                <input
                  type="text"
                  value={kraProfile.etimsBranchId}
                  onChange={(e) => setKraProfile({ ...kraProfile, etimsBranchId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">Invoice Control Prefix</label>
                <input
                  type="text"
                  value={kraProfile.etimsControlPrefix}
                  onChange={(e) => setKraProfile({ ...kraProfile, etimsControlPrefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="KRA-INV"
                />
              </div>
            </div>

            {/* Live Fiscal Signature Preview Box */}
            <div className="p-5 rounded-2xl bg-muted/40 dark:bg-navy-950/70 border border-border/80 space-y-3 font-mono text-xs">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                Live eTIMS Invoice Signature Mock Preview
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-muted-foreground">
                <div>
                  <span className="block text-[10px] text-muted-foreground">CU Serial Number:</span>
                  <span className="font-bold text-foreground">{kraProfile.etimsSerialNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground">Fiscal Control Code:</span>
                  <span className="font-bold text-foreground">{kraProfile.etimsControlPrefix}-0042-8819</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground">Internal Data Signature:</span>
                  <span className="font-bold text-foreground">9A4F-BC12-88D4</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground">Taxpayer PIN:</span>
                  <span className="font-bold text-foreground">{kraProfile.kraPin}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                Save eTIMS Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: TAX PROFILE & SETTINGS
          ========================================== */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 sm:p-7 space-y-6">
            <div className="pb-3 border-b border-border">
              <h3 className="text-base font-bold font-heading text-foreground">
                KRA Business Tax Profile &amp; Obligation Rates
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure your official KRA PIN, active tax regime (Turnover Tax vs VAT), and relief thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">Taxpayer Legal / Trade Name</label>
                <input
                  type="text"
                  value={kraProfile.taxpayerName}
                  onChange={(e) => setKraProfile({ ...kraProfile, taxpayerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">KRA Taxpayer PIN</label>
                <input
                  type="text"
                  value={kraProfile.kraPin}
                  onChange={(e) => setKraProfile({ ...kraProfile, kraPin: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500 uppercase"
                  placeholder="e.g. P051892401K"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">Primary Tax Obligation</label>
                <select
                  value={kraProfile.taxObligation}
                  onChange={(e) => setKraProfile({ ...kraProfile, taxObligation: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="turnover_tax">Turnover Tax (TOT 3% - Under KES 25M Sales)</option>
                  <option value="standard_vat">Standard VAT (16% VAT Registered)</option>
                  <option value="income_tax_only">Individual Income Tax (Annual Returns Only)</option>
                  <option value="exempt">Exempt / Zero-Rated</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">Business Entity Type</label>
                <select
                  value={kraProfile.businessType}
                  onChange={(e) => setKraProfile({ ...kraProfile, businessType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="sole_proprietor">Sole Proprietorship / Freelance Engineer</option>
                  <option value="limited_company">Private Limited Company (Ltd)</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">Annual Personal Relief (KES)</label>
                <input
                  type="number"
                  value={kraProfile.annualPersonalRelief}
                  onChange={(e) => setKraProfile({ ...kraProfile, annualPersonalRelief: parseFloat(e.target.value) || 28800 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-[10px] text-muted-foreground font-mono">Standard KRA Statutory: KES 28,800/year (KES 2,400/month)</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground font-semibold">Standard Professional WHT Rate (%)</label>
                <input
                  type="number"
                  value={kraProfile.whtRate}
                  onChange={(e) => setKraProfile({ ...kraProfile, whtRate: parseFloat(e.target.value) || 5 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <span className="text-[10px] text-muted-foreground font-mono">5% for Resident Technical / Management Services</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                Save Tax Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ==========================================
          MODAL: ADD WHT CERTIFICATE
          ========================================== */}
      {showAddWhtModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card dark:bg-navy-900 border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Receipt className="w-4 h-4 text-red-500" />
                <span>Log Client Withholding Tax (WHT) Certificate</span>
              </h3>
              <button
                onClick={() => setShowAddWhtModal(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddWhtSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-muted-foreground">KRA WHT Certificate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KRA-WHT-2026-0994"
                  value={whtForm.certificateNumber}
                  onChange={(e) => setWhtForm({ ...whtForm, certificateNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Withholding Agent Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Peak Logistics Ltd"
                    value={whtForm.withholdingAgentName}
                    onChange={(e) => setWhtForm({ ...whtForm, withholdingAgentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Agent KRA PIN</label>
                  <input
                    type="text"
                    placeholder="e.g. P051122334A"
                    value={whtForm.withholdingAgentPin}
                    onChange={(e) => setWhtForm({ ...whtForm, withholdingAgentPin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Gross Invoiced (KES) *</label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={whtForm.grossAmount}
                    onChange={(e) => {
                      const g = parseFloat(e.target.value) || 0;
                      setWhtForm({ 
                        ...whtForm, 
                        grossAmount: e.target.value,
                        whtAmount: (g * 0.05).toFixed(2)
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">5% WHT Credit (KES)</label>
                  <input
                    type="number"
                    value={whtForm.whtAmount}
                    onChange={(e) => setWhtForm({ ...whtForm, whtAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-teal-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Date Withheld</label>
                  <input
                    type="date"
                    value={whtForm.dateWithheld}
                    onChange={(e) => setWhtForm({ ...whtForm, dateWithheld: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Linked Invoice #</label>
                  <input
                    type="text"
                    placeholder="INV-2026-003"
                    value={whtForm.invoiceDocNumber}
                    onChange={(e) => setWhtForm({ ...whtForm, invoiceDocNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddWhtModal(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: STEP-BY-STEP iTAX FILING GUIDE
          ========================================== */}
      {showFilingGuideModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-card dark:bg-navy-900 border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                <span>KRA iTax Return Filing Guide for Peter</span>
              </h3>
              <button
                onClick={() => setShowFilingGuideModal(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono leading-relaxed text-muted-foreground">
              <div className="p-4 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border space-y-2">
                <span className="font-bold text-foreground text-sm block">1. Monthly Turnover Tax (TOT) Filing</span>
                <p>
                  • Log in at <a href="https://itax.kra.go.ke" target="_blank" rel="noopener noreferrer" className="text-red-500 underline">itax.kra.go.ke</a> with your PIN <strong>{kraProfile.kraPin}</strong>.
                  <br />
                  • Click <strong>Returns</strong> &rarr; <strong>File Return</strong> &rarr; Select <strong>Turnover Tax</strong>.
                  <br />
                  • Enter Gross Turnover: <strong>KES {monthlySummary.grossSales.toLocaleString()}</strong>.
                  <br />
                  • System auto-computes 3% TOT = <strong>KES {monthlySummary.grossTaxLiability.toLocaleString()}</strong>.
                  <br />
                  • Deduct WHT credits if applicable &rarr; Submit &rarr; Download Acknowledgement.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border space-y-2">
                <span className="font-bold text-foreground text-sm block">2. Annual Income Tax Return (ITR) Filing (Due June 30)</span>
                <p>
                  • Select <strong>Income Tax - Resident Individual</strong> on iTax.
                  <br />
                  • Download the offline Excel utility.
                  <br />
                  • Section B (Gross Profit): Enter Gross Sales = <strong>KES {annualSummary.grossSales.toLocaleString()}</strong>.
                  <br />
                  • Section B (Expenses): Enter Allowable Expenses = <strong>KES {annualSummary.allowableDeductions.toLocaleString()}</strong>.
                  <br />
                  • Section F (WHT Credits): Paste the exported WHT Schedule CSV (Total credit = <strong>KES {annualSummary.whtDeductedCredits.toLocaleString()}</strong>).
                  <br />
                  • Section T (Tax Computation): Ensure Personal Relief = <strong>KES {annualSummary.personalRelief.toLocaleString()}</strong> is included.
                  <br />
                  • Validate &amp; Upload the zipped file on iTax.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-300 space-y-1">
                <span className="font-bold block">💡 Nil Return Option</span>
                <p>
                  If you had KES 0 revenue during a specific quiet month, file a <strong>Nil Return</strong> on iTax in 30 seconds by going to <strong>Returns &rarr; File Nil Return</strong> to avoid the KES 1,000 late filing penalty!
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFilingGuideModal(false)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PRINTABLE TAX STATEMENT MODAL
          ========================================== */}
      {showPrintTaxStatement && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 max-w-3xl w-full shadow-2xl space-y-6 my-auto">
            {/* Formal Statement Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest block">REPUBLIC OF KENYA</span>
                <h1 className="text-xl font-extrabold font-heading text-slate-900">
                  KRA TAXPAYER COMPUTATION &amp; AUDIT STATEMENT
                </h1>
                <span className="text-xs font-mono text-slate-500">
                  Prepared by {kraProfile.taxpayerName} | eTIMS Verified Ledger
                </span>
              </div>

              <div className="text-right font-mono text-xs space-y-1">
                <span className="block font-bold text-slate-900">KRA PIN: {kraProfile.kraPin}</span>
                <span className="block text-slate-500">Date: {new Date().toLocaleDateString("en-GB")}</span>
                <span className="block text-slate-500">Tax Year: {selectedYear}</span>
              </div>
            </div>

            {/* Financial Reconciliation Summary Table */}
            <div className="space-y-3 font-mono text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                Annual Financial Reconciliation (Tax Year {selectedYear})
              </h4>

              <div className="grid grid-cols-2 gap-2 py-1">
                <span className="text-slate-600">Total Invoiced Business Sales (Gross Turnover):</span>
                <span className="text-right font-bold text-slate-900">KES {annualSummary.grossSales.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1">
                <span className="text-slate-600">Less: Legitimate Allowable Operational Expenses:</span>
                <span className="text-right font-bold text-slate-900">-KES {annualSummary.allowableDeductions.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-2 border-t border-slate-200 font-bold">
                <span className="text-slate-900">Net Taxable Business Profit:</span>
                <span className="text-right text-slate-900">KES {annualSummary.netTaxableIncome.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1">
                <span className="text-slate-600">Gross Income Tax Liability (Finance Act Graduated Bands):</span>
                <span className="text-right font-bold text-red-600">KES {annualSummary.grossTaxLiability.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1">
                <span className="text-slate-600">Less: Statutory Annual Personal Relief:</span>
                <span className="text-right font-bold text-emerald-600">-KES {annualSummary.personalRelief.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-1">
                <span className="text-slate-600">Less: Certified Withholding Tax (WHT 5%) Deducted by Clients:</span>
                <span className="text-right font-bold text-emerald-600">-KES {annualSummary.whtDeductedCredits.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-3 border-t-2 border-slate-900 text-sm font-bold bg-slate-50 px-3 rounded-xl">
                <span className="text-slate-900">FINAL NET TAX LIABILITY PAYABLE:</span>
                <span className="text-right text-red-600">KES {annualSummary.netTaxPayable.toLocaleString()}</span>
              </div>
            </div>

            {/* WHT Schedule Detail */}
            <div className="space-y-2 font-mono text-[11px]">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                Withholding Tax Credits Schedule (Section F)
              </h4>
              {whtCertificates.map((c) => (
                <div key={c.id} className="flex justify-between text-slate-600">
                  <span>{c.certificateNumber} — {c.withholdingAgentName} ({c.withholdingAgentPin})</span>
                  <span className="font-bold text-slate-900">KES {c.whtAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Signatory Footer */}
            <div className="pt-8 border-t border-slate-200 flex justify-between items-end font-mono text-xs text-slate-500">
              <div>
                <span className="block font-bold text-slate-900">Taxpayer Declaration:</span>
                <p className="text-[10px] text-slate-400 max-w-sm">
                  I hereby declare that this statement provides a true and correct record of business earnings, deductible costs, and WHT credits for KRA tax filing.
                </p>
              </div>
              <div className="text-right space-y-1">
                <span className="block border-b border-slate-400 w-40 ml-auto pb-1" />
                <span className="block font-bold text-slate-900">Peter Kivevo John</span>
                <span className="block text-[10px] text-slate-400">Lead Consultant / Taxpayer</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => setShowPrintTaxStatement(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

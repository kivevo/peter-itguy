import React, { useState, useEffect } from "react";
import { 
  dataStorage, 
  PaymentRecord, 
  ExpenseRecord, 
  InvoiceDocument 
} from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Building2, 
  Receipt, 
  Smartphone, 
  Landmark, 
  Wallet, 
  FileSpreadsheet, 
  Tag, 
  PieChart, 
  BarChart3, 
  Check, 
  X,
  AlertCircle
} from "lucide-react";

export const EarningsTracker: React.FC = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);

  // Sub-view: "overview" | "payments" | "expenses" | "pl_report"
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "expenses" | "pl_report">("overview");

  // Filter & search states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "this_week" | "this_month">("all");

  // Modal states
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // New payment state
  const [newPayment, setNewPayment] = useState<{
    clientName: string;
    description: string;
    amount: number;
    paymentMethod: PaymentRecord["paymentMethod"];
    mpesaCode: string;
    mpesaPhone: string;
    bankRef: string;
    category: PaymentRecord["category"];
    date: string;
    notes: string;
  }>({
    clientName: "",
    description: "",
    amount: 0,
    paymentMethod: "mpesa",
    mpesaCode: "",
    mpesaPhone: "",
    bankRef: "",
    category: "wifi_network",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  // New expense state
  const [newExpense, setNewExpense] = useState<{
    description: string;
    amount: number;
    category: ExpenseRecord["category"];
    date: string;
    receiptNote: string;
    notes: string;
  }>({
    description: "",
    amount: 0,
    category: "hardware_parts",
    date: new Date().toISOString().slice(0, 10),
    receiptNote: "",
    notes: "",
  });

  // Load and subscribe to storage
  useEffect(() => {
    const load = () => {
      setPayments(dataStorage.getPayments());
      setExpenses(dataStorage.getExpenses());
      setInvoices(dataStorage.getInvoices());
    };
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  // Time-based calculations
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfWeekStr = startOfWeek.toISOString().slice(0, 10);

  const startOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // Calculate Revenue
  const totalRevenue = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const todayRevenue = payments
    .filter((p) => p.date === todayStr)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const thisWeekRevenue = payments
    .filter((p) => p.date >= startOfWeekStr)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const thisMonthRevenue = payments
    .filter((p) => p.date >= startOfMonthStr)
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  // Calculate Expenses
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const thisMonthExpenses = expenses
    .filter((e) => e.date >= startOfMonthStr)
    .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  // Net Profit
  const netProfit = totalRevenue - totalExpenses;
  const thisMonthNetProfit = thisMonthRevenue - thisMonthExpenses;

  // Unpaid Invoices Outstanding Total
  const unpaidInvoices = invoices.filter((inv) => inv.status !== "paid" && inv.status !== "draft");
  const unpaidTotal = unpaidInvoices.reduce((acc, inv) => {
    const subtotal = inv.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    const discount =
      inv.discountType === "percentage"
        ? subtotal * (inv.discountValue / 100)
        : Math.min(subtotal, inv.discountValue);
    const afterDisc = Math.max(0, subtotal - discount);
    const vat = inv.vatEnabled ? afterDisc * ((inv.vatPercent || 16) / 100) : 0;
    const invTotal = afterDisc + vat;

    const paidSoFar = (inv.payments || []).reduce((s, p) => s + p.amount, 0);
    return acc + Math.max(0, invTotal - paidSoFar);
  }, 0);

  // Revenue by Category Breakdown
  const categoryTotals: Record<string, number> = {
    wifi_network: 0,
    computer_support: 0,
    website: 0,
    cctv: 0,
    hardware_sale: 0,
    retainer: 0,
    consultation: 0,
    other: 0,
  };

  payments.forEach((p) => {
    const cat = p.category || "other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(p.amount || 0);
  });

  const categoryLabels: Record<string, string> = {
    wifi_network: "Wi-Fi & Networks",
    computer_support: "PC & Server Support",
    website: "Websites & 5G SEO",
    cctv: "CCTV & Security",
    hardware_sale: "Hardware Sales",
    retainer: "Monthly Retainers",
    consultation: "Consultation & Survey",
    other: "Other Revenue",
  };

  // Payment Method Breakdown
  const methodTotals: Record<string, number> = {
    mpesa: 0,
    bank: 0,
    cash: 0,
    cheque: 0,
  };

  payments.forEach((p) => {
    const m = p.paymentMethod || "mpesa";
    methodTotals[m] = (methodTotals[m] || 0) + Number(p.amount || 0);
  });

  // Handlers
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.clientName || !newPayment.amount || newPayment.amount <= 0) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter client name and a valid amount.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.addPayment({
      ...newPayment,
      amount: Number(newPayment.amount),
    });

    setShowAddPaymentModal(false);
    setNewPayment({
      clientName: "",
      description: "",
      amount: 0,
      paymentMethod: "mpesa",
      mpesaCode: "",
      mpesaPhone: "",
      bankRef: "",
      category: "wifi_network",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });

    toast({
      title: "Payment Recorded! 💰",
      description: `KES ${Number(newPayment.amount).toLocaleString()} added to revenue ledger.`,
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || newExpense.amount <= 0) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter description and a valid expense amount.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.addExpense({
      ...newExpense,
      amount: Number(newExpense.amount),
    });

    setShowAddExpenseModal(false);
    setNewExpense({
      description: "",
      amount: 0,
      category: "hardware_parts",
      date: new Date().toISOString().slice(0, 10),
      receiptNote: "",
      notes: "",
    });

    toast({
      title: "Expense Logged! 📉",
      description: `KES ${Number(newExpense.amount).toLocaleString()} recorded.`,
    });
  };

  const handleDeletePayment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      dataStorage.deletePayment(id);
      toast({ title: "Payment Record Deleted", description: "Ledger updated." });
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      dataStorage.deleteExpense(id);
      toast({ title: "Expense Record Deleted", description: "Ledger updated." });
    }
  };

  // Export to CSV
  const exportLedgerCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Type,ID,Date,Client/Vendor,Description,Category,Method,Ref/Code,Amount (KES),Notes\n";
    
    payments.forEach((p) => {
      csv += `"Income","${p.id}","${p.date}","${p.clientName}","${p.description}","${p.category}","${p.paymentMethod}","${p.mpesaCode || p.bankRef || ""}","${p.amount}","${p.notes || ""}"\n`;
    });

    expenses.forEach((e) => {
      csv += `"Expense","${e.id}","${e.date}","Vendor/Store","${e.description}","${e.category}","Cash/Mpesa","${e.receiptNote || ""}","-${e.amount}","${e.notes || ""}"\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `peter_itguy_financial_ledger_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Financial Ledger Exported! 📊",
      description: "Saved income and expenses to CSV.",
    });
  };

  // Clear all demo financial data
  const handleClearFinancialData = () => {
    if (
      window.confirm(
        "⚠️ Clear all demo financial records?\n\nThis will reset your Revenue, Income Payments, Expenses, and M-Pesa Transactions to KES 0 so you can enter your real business numbers."
      )
    ) {
      dataStorage.clearFinancialData();
      setPayments([]);
      setExpenses([]);
      toast({
        title: "Financial Ledger Cleared (0 KES) 🧹",
        description: "All demo money entries have been reset to 0. Ready for your real data!",
      });
    }
  };

  // Filtered lists
  const filteredPayments = payments.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (methodFilter !== "all" && p.paymentMethod !== methodFilter) return false;
    if (timeFilter === "today" && p.date !== todayStr) return false;
    if (timeFilter === "this_week" && p.date < startOfWeekStr) return false;
    if (timeFilter === "this_month" && p.date < startOfMonthStr) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.clientName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.mpesaCode && p.mpesaCode.toLowerCase().includes(q)) ||
        (p.bankRef && p.bankRef.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredExpenses = expenses.filter((e) => {
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (timeFilter === "today" && e.date !== todayStr) return false;
    if (timeFilter === "this_week" && e.date < startOfWeekStr) return false;
    if (timeFilter === "this_month" && e.date < startOfMonthStr) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.description.toLowerCase().includes(q) || (e.notes && e.notes.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold font-heading text-white">
                Earnings &amp; Financial Operations
              </h2>
              <p className="text-xs text-slate-400">
                Track M-Pesa receipts, bank transfers, equipment expenses, and profit margins.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment (M-Pesa / Bank)</span>
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-border/80 font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Expense</span>
          </button>

          <button
            onClick={exportLedgerCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 border border-border/80 text-xs font-semibold"
            title="Download full ledger CSV"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleClearFinancialData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
            title="Clear demo financial data and start from 0 KES"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear Demo Data (0 KES)</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Collected Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black font-heading text-emerald-400">
              KES {totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
              <span>This Month: <strong className="text-white">KES {thisMonthRevenue.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Today's Inflow */}
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Today's Revenue</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black font-heading text-white">
              KES {todayRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
              <span>This Week: <strong className="text-teal-400">KES {thisWeekRevenue.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Outstanding Unpaid Invoices */}
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-amber-500/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider">Unpaid Invoices</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black font-heading text-amber-300">
              KES {unpaidTotal.toLocaleString()}
            </p>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              {unpaidInvoices.length} pending client invoice(s)
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Net Profit</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Wallet className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <p className={`text-xl sm:text-2xl font-black font-heading ${netProfit >= 0 ? "text-purple-300" : "text-rose-400"}`}>
              KES {netProfit.toLocaleString()}
            </p>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              Expenses: <strong className="text-rose-400">KES {totalExpenses.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-navy-900 rounded-xl border border-border/80 w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "overview" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Revenue Breakdown &amp; Charts
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "payments" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Payment Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "expenses" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab("pl_report")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "pl_report" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}
        >
          Monthly P&amp;L Statement
        </button>
      </div>

      {/* 1. OVERVIEW & BREAKDOWN CHARTS */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Revenue by Service Category */}
          <div className="lg:col-span-7 rounded-3xl bg-navy-900 border border-border/80 p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="font-heading font-bold text-base text-white">Revenue by Service Category</h3>
                <p className="text-xs text-slate-400">Where your income comes from:</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-400">KES {totalRevenue.toLocaleString()}</span>
            </div>

            <div className="space-y-3.5">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([catKey, catAmt]) => {
                  const percent = totalRevenue > 0 ? Math.round((catAmt / totalRevenue) * 100) : 0;
                  return (
                    <div key={catKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 font-semibold">{categoryLabels[catKey] || catKey}</span>
                        <span className="text-white font-bold">
                          KES {catAmt.toLocaleString()} <span className="text-slate-500 font-normal">({percent}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-navy-950 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Payment Method Split & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Method Breakdown */}
            <div className="rounded-3xl bg-navy-900 border border-border/80 p-5 sm:p-6 space-y-4">
              <h3 className="font-heading font-bold text-base text-white">Payment Methods Split</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>M-Pesa</span>
                  </div>
                  <p className="text-lg font-black font-heading text-white">
                    KES {methodTotals.mpesa.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {totalRevenue > 0 ? Math.round((methodTotals.mpesa / totalRevenue) * 100) : 0}% of all revenue
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono font-bold">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Bank Transfer</span>
                  </div>
                  <p className="text-lg font-black font-heading text-white">
                    KES {methodTotals.bank.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {totalRevenue > 0 ? Math.round((methodTotals.bank / totalRevenue) * 100) : 0}% of all revenue
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Cash</span>
                  </div>
                  <p className="text-lg font-black font-heading text-white">
                    KES {methodTotals.cash.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {totalRevenue > 0 ? Math.round((methodTotals.cash / totalRevenue) * 100) : 0}% of all revenue
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono font-bold">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Cheque</span>
                  </div>
                  <p className="text-lg font-black font-heading text-white">
                    KES {methodTotals.cheque.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {totalRevenue > 0 ? Math.round((methodTotals.cheque / totalRevenue) * 100) : 0}% of all revenue
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Record Callout */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-900/40 to-emerald-900/30 border border-teal-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="font-heading font-bold text-sm text-white">Client Payment Confirmation</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Received an M-Pesa or Bank confirmation code on your phone? Click below to record it immediately into the ledger.
              </p>
              <button
                onClick={() => setShowAddPaymentModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                + Record Client Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENTS LEDGER TABLE */}
      {activeTab === "payments" && (
        <div className="rounded-3xl bg-navy-900 border border-border/80 p-5 sm:p-6 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client, description, M-Pesa code, bank ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="wifi_network">Wi-Fi &amp; Networks</option>
                <option value="computer_support">Computer Repair</option>
                <option value="website">Websites &amp; SEO</option>
                <option value="cctv">CCTV &amp; Security</option>
                <option value="retainer">Retainers</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs focus:outline-none"
              >
                <option value="all">All Methods</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as "all" | "today" | "this_week" | "this_month")}
                className="px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-navy-950/60 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-3">Date</th>
                  <th className="p-3">Client / Business</th>
                  <th className="p-3">Description &amp; Category</th>
                  <th className="p-3">Payment Method &amp; Code</th>
                  <th className="p-3 text-right">Amount (KES)</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No payments found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                        {pay.date}
                      </td>
                      <td className="p-3 font-bold text-white whitespace-nowrap">
                        {pay.clientName}
                      </td>
                      <td className="p-3 max-w-xs">
                        <p className="text-slate-300 truncate">{pay.description}</p>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 inline-block mt-0.5">
                          {categoryLabels[pay.category] || pay.category}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {pay.paymentMethod === "mpesa" && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/30">
                              M-PESA: {pay.mpesaCode || "Confirmed"}
                            </span>
                          )}
                          {pay.paymentMethod === "bank" && (
                            <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 font-mono font-bold text-[10px] border border-sky-500/30">
                              BANK: {pay.bankRef || "Transfer"}
                            </span>
                          )}
                          {pay.paymentMethod === "cash" && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono font-bold text-[10px]">
                              CASH
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                        KES {pay.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeletePayment(pay.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EXPENSES LEDGER TABLE */}
      {activeTab === "expenses" && (
        <div className="rounded-3xl bg-navy-900 border border-border/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Business Expenses</h3>
              <p className="text-xs text-slate-400">Log hardware purchases, transport, cables, tools, and airtime.</p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">Total: KES {totalExpenses.toLocaleString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-navy-950/60 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Receipt / Vendor Reference</th>
                  <th className="p-3 text-right">Cost (KES)</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No expenses logged yet.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{exp.date}</td>
                      <td className="p-3 font-semibold text-white">{exp.description}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {exp.category.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{exp.receiptNote || "—"}</td>
                      <td className="p-3 text-right font-mono font-bold text-rose-400 text-sm whitespace-nowrap">
                        - KES {exp.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MONTHLY P&L STATEMENT */}
      {activeTab === "pl_report" && (
        <div className="rounded-3xl bg-navy-900 border border-border/80 p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Monthly Profit &amp; Loss Overview</h3>
              <p className="text-xs text-slate-400">Clear financial summary of revenue vs operational costs</p>
            </div>
            <button
              onClick={exportLedgerCSV}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
            >
              Export Statement
            </button>
          </div>

          <div className="space-y-4 max-w-2xl">
            {/* Total Inflow */}
            <div className="p-4 rounded-2xl bg-navy-950 border border-border/60 space-y-2">
              <div className="flex items-center justify-between font-heading font-bold text-sm">
                <span className="text-emerald-400">Total Inflow (Collected Revenue)</span>
                <span className="text-emerald-400 font-mono text-base">+ KES {totalRevenue.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sum of all verified M-Pesa, bank transfers, and cash payments.
              </p>
            </div>

            {/* Total Outflow */}
            <div className="p-4 rounded-2xl bg-navy-950 border border-border/60 space-y-2">
              <div className="flex items-center justify-between font-heading font-bold text-sm">
                <span className="text-rose-400">Total Outflow (Hardware &amp; Operational Costs)</span>
                <span className="text-rose-400 font-mono text-base">- KES {totalExpenses.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cost of goods sold (UniFi/MikroTik devices, Cat6 cables, transport, data).
              </p>
            </div>

            {/* Net Operating Income */}
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between font-heading font-extrabold text-base">
                <span className="text-purple-300">Net Business Profit</span>
                <span className="text-purple-300 font-mono text-xl">KES {netProfit.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-300">
                Profit margin: {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Payment Record */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-teal-500/30 p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-heading font-bold text-base text-white">Record Client Payment</h3>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Client / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samchi Telecom / After40 Hotel / Peak Logistics"
                    value={newPayment.clientName}
                    onChange={(e) => setNewPayment({ ...newPayment, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Amount Paid (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 35000"
                    value={newPayment.amount || ""}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date of Payment</label>
                  <input
                    type="date"
                    required
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Payment Method</label>
                  <select
                    value={newPayment.paymentMethod}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value as PaymentRecord["paymentMethod"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="mpesa">M-Pesa (Paybill/Till)</option>
                    <option value="bank">Bank Transfer (NCBA/Equity)</option>
                    <option value="cash">Cash on Delivery</option>
                    <option value="cheque">Corporate Cheque</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Service Category</label>
                  <select
                    value={newPayment.category}
                    onChange={(e) => setNewPayment({ ...newPayment, category: e.target.value as PaymentRecord["category"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="wifi_network">Wi-Fi &amp; Networks</option>
                    <option value="computer_support">Computer &amp; Server Support</option>
                    <option value="website">Websites &amp; 5G SEO</option>
                    <option value="cctv">CCTV &amp; Security</option>
                    <option value="hardware_sale">Hardware Sale</option>
                    <option value="retainer">Monthly Retainer</option>
                    <option value="consultation">Consultation / Survey</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {newPayment.paymentMethod === "mpesa" && (
                  <div className="space-y-1 col-span-2">
                    <label className="text-slate-300 font-semibold">M-Pesa Confirmation Code</label>
                    <input
                      type="text"
                      placeholder="e.g. QHB72991LK"
                      value={newPayment.mpesaCode}
                      onChange={(e) => setNewPayment({ ...newPayment, mpesaCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono uppercase focus:outline-none"
                    />
                  </div>
                )}

                {newPayment.paymentMethod === "bank" && (
                  <div className="space-y-1 col-span-2">
                    <label className="text-slate-300 font-semibold">Bank Reference / Cheque Number</label>
                    <input
                      type="text"
                      placeholder="e.g. NCBA-TX-88912"
                      value={newPayment.bankRef}
                      onChange={(e) => setNewPayment({ ...newPayment, bankRef: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Description / Work Completed *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50% deposit for 2x UniFi U6+ Access Points & Cat6 cabling"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Save Payment Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Log Expense */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-rose-500/30 p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-heading font-bold text-base text-white">Log Business Expense</h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2x UniFi U6+ Access Points from Nairobi Distributor"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 29000"
                    value={newExpense.amount || ""}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Expense Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseRecord["category"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="hardware_parts">Hardware &amp; Equipment Procurement</option>
                    <option value="transport">Transport / Fuel / Uber</option>
                    <option value="software_tools">Software, Hosting &amp; Licenses</option>
                    <option value="airtime_data">Safaricom 5G/4G Data &amp; Airtime</option>
                    <option value="marketing">Marketing &amp; Advertising</option>
                    <option value="office_supplies">Tools &amp; Office Supplies</option>
                    <option value="other">Other Cost</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Receipt / Vendor Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Invoice #NTS-9912 or M-Pesa Code"
                    value={newExpense.receiptNote}
                    onChange={(e) => setNewExpense({ ...newExpense, receiptNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsTracker;

import React, { useState, useEffect } from "react";
import {
  dataStorage,
  PaymentRecord,
  ExpenseRecord,
  InvoiceDocument,
  BudgetLimit,
  SavingsGoal,
  DebtRecord,
  RecurringBill
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
  AlertCircle,
  Target,
  PiggyBank,
  HandCoins,
  ReceiptText,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRightLeft
} from "lucide-react";

export const EarningsTracker: React.FC = () => {
  const { toast } = useToast();

  // Primary Collections
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([]);
  const [inventory, setInventory] = useState(dataStorage.getInventory());

  // Sub-view: "overview" | "ledger" | "debtors" | "budgets" | "savings" | "debts" | "bills" | "pl_report"
  const [activeTab, setActiveTab] = useState<
    "overview" | "ledger" | "debtors" | "budgets" | "savings" | "debts" | "bills" | "pl_report"
  >("overview");

  // Wallet filter: "all" | "business" | "personal"
  const [walletFilter, setWalletFilter] = useState<"all" | "business" | "personal">("all");

  // Ledger Filter & search states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "this_week" | "this_month">("all");
  const [ledgerType, setLedgerType] = useState<"all" | "incomes" | "expenses">("all");

  // Modals
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(0);

  // Forms
  const [newPayment, setNewPayment] = useState<{
    clientName: string;
    description: string;
    amount: number;
    paymentMethod: PaymentRecord["paymentMethod"];
    mpesaCode: string;
    mpesaPhone: string;
    bankRef: string;
    category: PaymentRecord["category"];
    wallet: "business" | "personal";
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
    wallet: "business",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [newExpense, setNewExpense] = useState<{
    description: string;
    amount: number;
    category: ExpenseRecord["category"];
    wallet: "business" | "personal";
    date: string;
    receiptNote: string;
    notes: string;
  }>({
    description: "",
    amount: 0,
    category: "hardware_parts",
    wallet: "business",
    date: new Date().toISOString().slice(0, 10),
    receiptNote: "",
    notes: "",
  });

  const [newBudget, setNewBudget] = useState<{
    category: string;
    limitAmount: number;
    wallet: "business" | "personal";
    period: "monthly" | "weekly";
  }>({
    category: "hardware_parts",
    limitAmount: 20000,
    wallet: "business",
    period: "monthly",
  });

  const [newGoal, setNewGoal] = useState<{
    title: string;
    targetAmount: number;
    currentAmount: number;
    category: SavingsGoal["category"];
    targetDate: string;
    notes: string;
  }>({
    title: "",
    targetAmount: 50000,
    currentAmount: 0,
    category: "tech_gear",
    targetDate: "",
    notes: "",
  });

  const [newDebt, setNewDebt] = useState<{
    type: DebtRecord["type"];
    partyName: string;
    phone: string;
    amount: number;
    dueDate: string;
    description: string;
  }>({
    type: "owed_to_me",
    partyName: "",
    phone: "",
    amount: 0,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    description: "",
  });

  const [newBill, setNewBill] = useState<{
    title: string;
    amount: number;
    dueDayOfMonth: number;
    category: RecurringBill["category"];
    wallet: "business" | "personal";
  }>({
    title: "",
    amount: 0,
    dueDayOfMonth: 1,
    category: "internet",
    wallet: "business",
  });

  // Load and subscribe to storage
  useEffect(() => {
    const loadAll = () => {
      setPayments(dataStorage.getPayments());
      setExpenses(dataStorage.getExpenses());
      setInvoices(dataStorage.getInvoices().filter((i) => !i.deletedAt));
      setBudgets(dataStorage.getBudgets());
      setSavingsGoals(dataStorage.getSavingsGoals());
      setDebts(dataStorage.getDebts());
      setRecurringBills(dataStorage.getRecurringBills());
      setInventory(dataStorage.getInventory());
    };

    loadAll();
    const unsubscribe = dataStorage.subscribe(loadAll);
    return () => unsubscribe();
  }, []);

  // Filtered by wallet
  const walletPayments = payments.filter((p) => walletFilter === "all" || (p.wallet || "business") === walletFilter);
  const walletExpenses = expenses.filter((e) => walletFilter === "all" || (e.wallet || "business") === walletFilter);

  // Financial Calculations
  const totalRevenue = walletPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalExpenses = walletExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Month to date calculations
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const todayStr = now.toISOString().slice(0, 10);

  const thisMonthPayments = walletPayments.filter((p) => p.date?.startsWith(currentMonthPrefix));
  const thisMonthExpenses = walletExpenses.filter((e) => e.date?.startsWith(currentMonthPrefix));
  const thisMonthRevenue = thisMonthPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const thisMonthSpent = thisMonthExpenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const thisMonthNet = thisMonthRevenue - thisMonthSpent;

  const todayRevenue = walletPayments
    .filter((p) => p.date === todayStr)
    .reduce((acc, p) => acc + Number(p.amount), 0);

  // Total Savings across all goals
  const totalSavings = savingsGoals.reduce((acc, g) => acc + Number(g.currentAmount), 0);
  const totalReceivables = debts.filter((d) => d.type === "owed_to_me" && d.status !== "settled").reduce((acc, d) => acc + (d.amount - d.paidAmount), 0);
  const totalPayables = debts.filter((d) => d.type === "owed_by_me" && d.status !== "settled").reduce((acc, d) => acc + (d.amount - d.paidAmount), 0);
  const totalRecurringMonthly = recurringBills.reduce((acc, b) => acc + Number(b.amount), 0);

  // Universal Balance Sheet & Asset Valuation
  const hardwareStockValuation = inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitCost || 0),
    0
  );

  // Unpaid Invoices & Accounts Receivable
  const unpaidInvoicesList = invoices.filter((inv) => {
    if (inv.status === "paid" || inv.docType !== "invoice") return false;
    const gross = inv.items.reduce((sum, it) => sum + Number(it.qty * it.unitPrice), 0) * (inv.vatEnabled ? 1.16 : 1);
    const paid = (inv.payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
    return gross - paid > 1;
  });

  const totalInvoiceReceivables = unpaidInvoicesList.reduce((sum, inv) => {
    const gross = inv.items.reduce((s, it) => s + Number(it.qty * it.unitPrice), 0) * (inv.vatEnabled ? 1.16 : 1);
    const paid = (inv.payments || []).reduce((s, p) => s + Number(p.amount), 0);
    return sum + Math.max(0, gross - paid);
  }, 0);

  const universalNetWorth = netProfit + totalInvoiceReceivables + hardwareStockValuation - totalPayables;

  // Category maps for UI
  const categoryLabels: Record<string, string> = {
    wifi_network: "Wi-Fi & Networking",
    computer_support: "Computer Support",
    website: "Web Development",
    cctv: "CCTV & Security",
    hardware_sale: "Hardware Sale",
    retainer: "SLA Retainer",
    consultation: "IT Consultation",
    personal_transfer: "Personal / Drawing",
    transport: "Transport & Fuel",
    hardware_parts: "Hardware Parts",
    software_tools: "Software & Cloud",
    airtime_data: "Airtime & Internet",
    marketing: "Marketing & Ads",
    office_supplies: "Office & Tools",
    rent_housing: "Rent & Housing",
    food_groceries: "Food & Groceries",
    personal_living: "Personal Living",
    utilities: "Utilities & Power",
    other: "Other",
  };

  // Handlers
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.clientName.trim() || !newPayment.amount || Number(newPayment.amount) <= 0) {
      toast({ title: "Required Fields Missing", description: "Please enter client name and amount.", variant: "destructive" });
      return;
    }

    dataStorage.addPayment({ ...newPayment, amount: Number(newPayment.amount) });
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
      wallet: "business",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });

    toast({ title: "Payment Recorded! 💰", description: `KES ${Number(newPayment.amount).toLocaleString()} logged.` });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description.trim() || !newExpense.amount || Number(newExpense.amount) <= 0) {
      toast({ title: "Required Fields Missing", description: "Please enter description and amount.", variant: "destructive" });
      return;
    }

    dataStorage.addExpense({ ...newExpense, amount: Number(newExpense.amount) });
    setShowAddExpenseModal(false);
    setNewExpense({
      description: "",
      amount: 0,
      category: "hardware_parts",
      wallet: "business",
      date: new Date().toISOString().slice(0, 10),
      receiptNote: "",
      notes: "",
    });

    toast({ title: "Expense Logged! 📉", description: `KES ${Number(newExpense.amount).toLocaleString()} recorded.` });
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveBudget({
      id: `b-${Date.now()}`,
      category: newBudget.category,
      limitAmount: Number(newBudget.limitAmount),
      wallet: newBudget.wallet,
      period: newBudget.period,
      createdAt: new Date().toISOString(),
    });
    setShowAddBudgetModal(false);
    toast({ title: "Budget Limit Set! 🎯", description: `KES ${Number(newBudget.limitAmount).toLocaleString()} limit for ${categoryLabels[newBudget.category] || newBudget.category}.` });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim() || !newGoal.targetAmount) {
      toast({ title: "Goal Title & Target Required", variant: "destructive" });
      return;
    }
    dataStorage.saveSavingsGoal({
      id: `g-${Date.now()}`,
      title: newGoal.title,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount),
      category: newGoal.category,
      targetDate: newGoal.targetDate || undefined,
      notes: newGoal.notes || undefined,
      createdAt: new Date().toISOString(),
    });
    setShowAddGoalModal(false);
    toast({ title: "Savings Goal Created! 🏦", description: `Target: KES ${Number(newGoal.targetAmount).toLocaleString()} for ${newGoal.title}.` });
  };

  const handleDepositToGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal || !depositAmount) return;
    const updated = {
      ...depositModalGoal,
      currentAmount: Math.max(0, depositModalGoal.currentAmount + Number(depositAmount)),
    };
    dataStorage.saveSavingsGoal(updated);
    setDepositModalGoal(null);
    setDepositAmount(0);
    toast({ title: "Goal Updated! 🚀", description: `Added KES ${depositAmount.toLocaleString()} to ${updated.title}.` });
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.partyName.trim() || !newDebt.amount) {
      toast({ title: "Party Name & Amount Required", variant: "destructive" });
      return;
    }
    dataStorage.saveDebt({
      id: `d-${Date.now()}`,
      type: newDebt.type,
      partyName: newDebt.partyName,
      phone: newDebt.phone || undefined,
      amount: Number(newDebt.amount),
      paidAmount: 0,
      dueDate: newDebt.dueDate,
      description: newDebt.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setShowAddDebtModal(false);
    toast({ title: "Debt Record Created! ⏳", description: `${newDebt.partyName} - KES ${Number(newDebt.amount).toLocaleString()}` });
  };

  const handleMarkDebtSettled = (debt: DebtRecord) => {
    const updated: DebtRecord = { ...debt, status: "settled", paidAmount: debt.amount };
    dataStorage.saveDebt(updated);
    toast({ title: "Debt Marked as Settled! ✅", description: `${debt.partyName} paid in full.` });
  };

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.title.trim() || !newBill.amount) return;
    dataStorage.saveRecurringBill({
      id: `rb-${Date.now()}`,
      title: newBill.title,
      amount: Number(newBill.amount),
      dueDayOfMonth: Number(newBill.dueDayOfMonth),
      category: newBill.category,
      wallet: newBill.wallet,
      createdAt: new Date().toISOString(),
    });
    setShowAddBillModal(false);
    toast({ title: "Recurring Bill Added! 📅", description: `${newBill.title} - KES ${Number(newBill.amount).toLocaleString()}/mo` });
  };

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

  // Export to CSV
  const exportLedgerCSV = () => {
    let csv = "data:text/csv;charset=utf-8,Type,Wallet,ID,Date,Client/Vendor,Description,Category,Method,Ref/Code,Amount (KES),Notes\n";
    payments.forEach((p) => {
      csv += `"Income","${p.wallet || "business"}","${p.id}","${p.date}","${p.clientName}","${p.description}","${p.category}","${p.paymentMethod}","${p.mpesaCode || p.bankRef || ""}","${p.amount}","${p.notes || ""}"\n`;
    });
    expenses.forEach((e) => {
      csv += `"Expense","${e.wallet || "business"}","${e.id}","${e.date}","Vendor/Store","${e.description}","${e.category}","Cash/Mpesa","${e.receiptNote || ""}","-${e.amount}","${e.notes || ""}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `peter_finance_ledger_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Financial Ledger Exported! 📊" });
  };

  // Filtered Ledger
  const filteredLedgerItems = [
    ...walletPayments.map((p) => ({ ...p, itemType: "income" as const })),
    ...walletExpenses.map((e) => ({ ...e, itemType: "expense" as const, clientName: e.description })),
  ]
    .filter((item) => {
      if (ledgerType === "incomes" && item.itemType !== "income") return false;
      if (ledgerType === "expenses" && item.itemType !== "expense") return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchClient = (item.clientName || "").toLowerCase().includes(q);
        const matchDesc = (item.description || "").toLowerCase().includes(q);
        const matchNotes = (item.notes || "").toLowerCase().includes(q);
        if (!matchClient && !matchDesc && !matchNotes) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Multi-Wallet Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  Peter's Financial Command Center
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                  KES Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personal &amp; Business Cashflow, Monthly Budgets, Tech Sinking Funds, Debts &amp; Subscriptions.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Wallet Scope Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1 rounded-2xl bg-navy-950 border border-border flex items-center gap-1">
            <button
              onClick={() => setWalletFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                walletFilter === "all" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              All Funds
            </button>
            <button
              onClick={() => setWalletFilter("business")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                walletFilter === "business" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Business</span>
            </button>
            <button
              onClick={() => setWalletFilter("personal")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                walletFilter === "personal" ? "bg-purple-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Personal</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Income</span>
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-border font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* PREMIUM SECTION NAVIGATOR — Card Grid */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          {
            id: "overview" as const,
            label: "Overview",
            sub: "Net Cashflow",
            icon: <BarChart3 className="w-5 h-5" />,
            count: null,
            color: "teal",
            countBg: "",
          },
          {
            id: "debtors" as const,
            label: "Aged Debtors",
            sub: "Debt Recovery",
            icon: <HandCoins className="w-5 h-5" />,
            count: unpaidInvoicesList.length,
            color: "amber",
            countBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          },
          {
            id: "ledger" as const,
            label: "Ledger",
            sub: "All Transactions",
            icon: <Receipt className="w-5 h-5" />,
            count: filteredLedgerItems.length,
            color: "cyan",
            countBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
          },
          {
            id: "budgets" as const,
            label: "Budgets",
            sub: "Monthly Limits",
            icon: <Target className="w-5 h-5" />,
            count: budgets.length,
            color: "violet",
            countBg: "bg-violet-500/20 text-violet-300 border-violet-500/30",
          },
          {
            id: "savings" as const,
            label: "Savings",
            sub: "Sinking Goals",
            icon: <PiggyBank className="w-5 h-5" />,
            count: savingsGoals.length,
            color: "emerald",
            countBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          },
          {
            id: "debts" as const,
            label: "Debts",
            sub: "Receivables",
            icon: <HandCoins className="w-5 h-5" />,
            count: debts.length,
            color: "rose",
            countBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          },
          {
            id: "bills" as const,
            label: "Subscriptions",
            sub: "Recurring Bills",
            icon: <ReceiptText className="w-5 h-5" />,
            count: recurringBills.length,
            color: "blue",
            countBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          },
          {
            id: "pl_report" as const,
            label: "P&L Report",
            sub: "Profit & Loss",
            icon: <PieChart className="w-5 h-5" />,
            count: null,
            color: "slate",
            countBg: "",
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const colorMap: Record<string, string> = {
            teal:    "border-teal-500/50 bg-teal-500/10 text-teal-400 shadow-[0_0_18px_rgba(20,184,166,0.18)]",
            amber:   "border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.18)]",
            cyan:    "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.18)]",
            violet:  "border-violet-500/50 bg-violet-500/10 text-violet-400 shadow-[0_0_18px_rgba(139,92,246,0.18)]",
            emerald: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.18)]",
            rose:    "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.18)]",
            blue:    "border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.18)]",
            slate:   "border-slate-500/50 bg-slate-500/10 text-slate-300 shadow-[0_0_18px_rgba(100,116,139,0.10)]",
          };
          const iconColorMap: Record<string, string> = {
            teal:    "text-teal-400",
            amber:   "text-amber-400",
            cyan:    "text-cyan-400",
            violet:  "text-violet-400",
            emerald: "text-emerald-400",
            rose:    "text-rose-400",
            blue:    "text-blue-400",
            slate:   "text-slate-400",
          };

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative group flex flex-col items-center justify-center gap-2
                py-4 px-3 rounded-2xl border text-center
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? colorMap[tab.color]
                  : "border-border bg-navy-900 text-slate-400 hover:border-slate-600 hover:bg-navy-800 hover:text-slate-200"
                }
              `}
            >
              {/* Icon */}
              <span className={`transition-colors duration-200 ${isActive ? iconColorMap[tab.color] : "text-slate-500 group-hover:text-slate-300"}`}>
                {tab.icon}
              </span>

              {/* Label + Sub */}
              <div className="space-y-0.5">
                <div className={`text-[11px] font-bold leading-tight whitespace-nowrap ${isActive ? "text-white" : ""}`}>
                  {tab.label}
                </div>
                <div className={`text-[9.5px] font-mono leading-tight whitespace-nowrap ${isActive ? "opacity-80" : "text-slate-500 group-hover:text-slate-400"}`}>
                  {tab.sub}
                </div>
              </div>

              {/* Count Badge */}
              {tab.count !== null && tab.count > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black font-mono flex items-center justify-center border ${isActive ? tab.countBg : "bg-navy-950 text-slate-400 border-border"}`}>
                  {tab.count}
                </span>
              )}

              {/* Active bottom glow line */}
              {isActive && (
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full opacity-80 ${
                  tab.color === "teal" ? "bg-teal-400" :
                  tab.color === "amber" ? "bg-amber-400" :
                  tab.color === "cyan" ? "bg-cyan-400" :
                  tab.color === "violet" ? "bg-violet-400" :
                  tab.color === "emerald" ? "bg-emerald-400" :
                  tab.color === "rose" ? "bg-rose-400" :
                  tab.color === "blue" ? "bg-blue-400" :
                  "bg-slate-400"
                }`} />
              )}
            </button>
          );
        })}
      </div>


      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & CASHFLOW DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* UNIVERSAL NET ASSET & WEALTH PORTFOLIO (Consolidated Balance Sheet) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900 to-teal-950/40 border border-teal-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-teal-300 font-bold uppercase tracking-wider block">
                    Universal Business Equity &amp; Asset Valuation
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white font-mono">
                    KES {universalNetWorth.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Consolidated Liquidity + Stock + Receivables</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {totalRevenue > 0 ? `${profitMargin}% Gross Margin` : "Active Portfolio"}
                </span>
              </div>
            </div>

            {/* 4 Asset Components Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-border/70 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">1. Liquid Cash Flow:</span>
                <div className="text-base font-black text-emerald-400">
                  KES {netProfit.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">Cash, Bank &amp; M-Pesa Till</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-border/70 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">2. Invoices Receivable:</span>
                <div className="text-base font-black text-amber-400">
                  KES {totalInvoiceReceivables.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">{unpaidInvoicesList.length} uncollected client invoices</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-border/70 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">3. Hardware Stock Asset:</span>
                <div className="text-base font-black text-cyan-400">
                  KES {hardwareStockValuation.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">{inventory.length} physical stock SKUs in shop</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-border/70 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">4. Total Liabilities:</span>
                <div className="text-base font-black text-rose-400">
                  KES {totalPayables.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-sans">Debts owed &amp; bills</div>
              </div>
            </div>
          </div>

          {/* Primary KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Total Revenue */}
            <div className="p-4 sm:p-5 rounded-3xl bg-navy-900 border border-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Inflow</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-heading text-emerald-400 font-mono">
                  KES {totalRevenue.toLocaleString()}
                </p>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  This Month: <strong className="text-white">KES {thisMonthRevenue.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="p-4 sm:p-5 rounded-3xl bg-navy-900 border border-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Outflow</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-heading text-rose-400 font-mono">
                  KES {totalExpenses.toLocaleString()}
                </p>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  This Month: <strong className="text-white">KES {thisMonthSpent.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Net Profit / Retained */}
            <div className="p-4 sm:p-5 rounded-3xl bg-navy-900 border border-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Net Cash Retained</span>
                <span className={`p-1.5 rounded-lg ${netProfit >= 0 ? "bg-teal-500/10 text-teal-400" : "bg-rose-500/10 text-rose-400"}`}>
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className={`text-xl sm:text-2xl font-black font-heading font-mono ${netProfit >= 0 ? "text-white" : "text-rose-400"}`}>
                  KES {netProfit.toLocaleString()}
                </p>
                <div className="text-[10px] font-mono text-teal-400 mt-1">
                  {profitMargin}% Profit Retention Margin
                </div>
              </div>
            </div>

            {/* Savings & Sinking Assets */}
            <div className="p-4 sm:p-5 rounded-3xl bg-navy-900 border border-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Saved / Goals</span>
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <PiggyBank className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-heading text-purple-300 font-mono">
                  KES {totalSavings.toLocaleString()}
                </p>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  {savingsGoals.length} Active Sinking Funds
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards: Receivables + Recurring + Budgets Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Uncollected Receivables */}
            <div className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <HandCoins className="w-4 h-4 text-amber-400" />
                  <span>Pending Client Debts (Owed to You)</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-400">
                  KES {totalReceivables.toLocaleString()}
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Clients with pending invoice balances or credit arrangements.
              </p>
              <button
                onClick={() => setActiveTab("debts")}
                className="w-full py-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-teal-400 font-bold text-xs border border-border flex items-center justify-center gap-1"
              >
                <span>Manage Debts &amp; WhatsApp Reminders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Monthly Fixed Bills */}
            <div className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ReceiptText className="w-4 h-4 text-cyan-400" />
                  <span>Monthly Fixed Commitments</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-cyan-400">
                  KES {totalRecurringMonthly.toLocaleString()}/mo
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Fiber Internet, Workshop Rent, Cloud tools &amp; Utilities.
              </p>
              <button
                onClick={() => setActiveTab("bills")}
                className="w-full py-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-teal-400 font-bold text-xs border border-border flex items-center justify-center gap-1"
              >
                <span>View Monthly Subscriptions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Spending Limits */}
            <div className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span>Active Spending Budgets</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-rose-400">
                  {budgets.length} Limits
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Hardware parts, Transport, Airtime and Living limits.
              </p>
              <button
                onClick={() => setActiveTab("budgets")}
                className="w-full py-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-teal-400 font-bold text-xs border border-border flex items-center justify-center gap-1"
              >
                <span>Check Budget Progress</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: ⏳ AGED DEBTORS & DEBT COLLECTION RECOVERY */}
      {/* ========================================================================= */}
      {activeTab === "debtors" && (
        <div className="space-y-6">
          {/* Debtors Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-navy-900 border border-amber-500/30 space-y-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                Total Uncollected Invoices
              </span>
              <div className="text-2xl sm:text-3xl font-black font-heading text-white font-mono">
                KES {totalInvoiceReceivables.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                {unpaidInvoicesList.length} outstanding client invoices awaiting payment.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-navy-900 border border-rose-500/30 space-y-1">
              <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider block">
                Critically Overdue (&gt;7 Days)
              </span>
              <div className="text-2xl sm:text-3xl font-black font-heading text-rose-400 font-mono">
                {
                  unpaidInvoicesList.filter((inv) => {
                    const due = new Date(inv.dueDate || inv.issueDate).getTime();
                    return (Date.now() - due) / (1000 * 60 * 60 * 24) > 7;
                  }).length
                } Invoices
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Requires escalation or WhatsApp reminder.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-navy-900 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                Total Settled Invoices
              </span>
              <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-400 font-mono">
                {invoices.filter((i) => i.status === "paid").length} Paid
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Fully reconciled and stamped as cleared.
              </p>
            </div>
          </div>

          {/* Debtors List Table */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-sm text-white">
                  Aged Debtors &amp; Automated Escalation Recovery
                </h3>
                <p className="text-xs text-slate-400">
                  Send polite, firm, or final legal WhatsApp demand notices with 1-click.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                {unpaidInvoicesList.length} Invoices Requiring Follow-Up
              </span>
            </div>

            {unpaidInvoicesList.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-heading font-bold text-sm text-white">Zero Overdue Debtors!</h4>
                <p className="text-xs text-slate-400">All client invoices are currently up to date or marked paid.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unpaidInvoicesList.map((inv) => {
                  const gross =
                    inv.items.reduce((sum, it) => sum + Number(it.qty * it.unitPrice), 0) * (inv.vatEnabled ? 1.16 : 1);
                  const paid = (inv.payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
                  const balance = Math.max(0, gross - paid);

                  const dueTime = new Date(inv.dueDate || inv.issueDate).getTime();
                  const diffDays = Math.floor((Date.now() - dueTime) / (1000 * 60 * 60 * 24));

                  // Urgency badge
                  const isDelinquent = diffDays >= 15;
                  const isFirm = diffDays >= 8 && diffDays < 15;
                  const isMild = diffDays >= 1 && diffDays < 8;
                  const isDueTodayOrSoon = diffDays <= 0;

                  // Escalation templates
                  const friendlyMsg = `Habari ${inv.client.name}, this is Peter from Krenovate Systems. Friendly reminder regarding Invoice ${inv.docNumber} of KES ${balance.toLocaleString()} due on ${inv.dueDate}. You can remit via M-Pesa Till: 3053097 (Krenovate Systems) or Bank. Thank you!`;
                  const firmMsg = `Dear ${inv.client.name}, formal follow-up regarding overdue Invoice ${inv.docNumber} for KES ${balance.toLocaleString()} issued to ${inv.client.company}. Kindly remit payment today via M-Pesa Till: 3053097 and share payment confirmation.`;
                  const finalDemandMsg = `URGENT PAYMENT DEMAND: Invoice ${inv.docNumber} (KES ${balance.toLocaleString()}) for ${inv.client.company} is critically overdue by ${diffDays} days. Continued non-payment will lead to suspension of SLA and remote support services. Please clear via Till 3053097 today.`;

                  const chosenMsg = isDelinquent ? finalDemandMsg : isFirm ? firmMsg : friendlyMsg;
                  const phoneClean = (inv.client.phone || "").replace(/[^0-9]/g, "");

                  return (
                    <div
                      key={inv.id}
                      className="p-4 sm:p-5 rounded-2xl bg-navy-950 border border-border/80 hover:border-amber-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white bg-navy-900 px-2 py-0.5 rounded border border-border">
                            {inv.docNumber}
                          </span>
                          <span className="font-heading font-bold text-sm text-white">{inv.client.company}</span>
                          <span className="text-xs text-slate-400">({inv.client.name})</span>

                          {/* Urgency Badge */}
                          {isDelinquent && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                              🚨 {diffDays} Days Overdue (Final Demand)
                            </span>
                          )}
                          {isFirm && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                              🔴 {diffDays} Days Overdue (Firm Notice)
                            </span>
                          )}
                          {isMild && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 text-[10px] font-mono font-bold">
                              🟠 {diffDays} Days Overdue (Gentle Reminder)
                            </span>
                          )}
                          {isDueTodayOrSoon && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold">
                              🟡 Due {diffDays === 0 ? "Today" : `in ${Math.abs(diffDays)} days`}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                          <div>Issued: <strong className="text-slate-300">{inv.issueDate}</strong></div>
                          <div>Due: <strong className="text-amber-300">{inv.dueDate}</strong></div>
                          <div>Phone: <strong className="text-slate-300">{inv.client.phone}</strong></div>
                        </div>
                      </div>

                      {/* Financial Balance & 1-Click WhatsApp Action */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right font-mono">
                          <div className="text-xs text-slate-400">Balance Due:</div>
                          <div className="text-base font-black text-amber-400">
                            KES {balance.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(chosenMsg)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`px-3.5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                              isDelinquent
                                ? "bg-rose-600 hover:bg-rose-500"
                                : isFirm
                                ? "bg-amber-600 hover:bg-amber-500"
                                : "bg-emerald-600 hover:bg-emerald-500"
                            }`}
                            title="Send WhatsApp Escalation Notice"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp Notice</span>
                          </a>

                          <button
                            onClick={() => {
                              if (confirm(`Mark Invoice ${inv.docNumber} as fully paid (KES ${balance.toLocaleString()})?`)) {
                                dataStorage.addPayment({
                                  clientName: inv.client.company || inv.client.name,
                                  description: `Full payment settlement for ${inv.docNumber}`,
                                  amount: balance,
                                  paymentMethod: "mpesa",
                                  category: "wifi_network",
                                  wallet: "business",
                                  date: new Date().toISOString().slice(0, 10),
                                  notes: `Reconciled via Debt Collection Hub.`,
                                });
                                dataStorage.saveInvoice({
                                  ...inv,
                                  status: "paid",
                                  payments: [
                                    ...(inv.payments || []),
                                    {
                                      id: `p-${Date.now()}`,
                                      amount: balance,
                                      method: "mpesa",
                                      date: new Date().toISOString().slice(0, 10),
                                    },
                                  ],
                                });
                                toast({
                                  title: "Invoice Settled! 🎉",
                                  description: `Invoice ${inv.docNumber} marked as paid and logged into Ledger.`,
                                });
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-teal-600 text-slate-300 hover:text-white border border-border text-xs font-bold transition-colors flex items-center gap-1"
                            title="Mark as Paid"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark Paid</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRANSACTIONS LEDGER (INCOMES & EXPENSES) */}
      {/* ========================================================================= */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search transactions, clients, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="p-1 rounded-xl bg-navy-950 border border-border flex items-center gap-1">
                <button
                  onClick={() => setLedgerType("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${ledgerType === "all" ? "bg-teal-600 text-white" : "text-slate-400"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setLedgerType("incomes")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${ledgerType === "incomes" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
                >
                  Income
                </button>
                <button
                  onClick={() => setLedgerType("expenses")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${ledgerType === "expenses" ? "bg-rose-600 text-white" : "text-slate-400"}`}
                >
                  Expenses
                </button>
              </div>

              <button
                onClick={exportLedgerCSV}
                className="p-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 border border-border text-xs flex items-center gap-1.5"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={handleClearFinancialData}
                className="p-2 rounded-xl bg-navy-900 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs flex items-center gap-1.5"
                title="Reset ledger to 0 KES"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear (0 KES)</span>
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-3xl bg-navy-900 border border-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-navy-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Date / Wallet</th>
                    <th className="py-3.5 px-4 font-bold">Description / Client</th>
                    <th className="py-3.5 px-4 font-bold">Category</th>
                    <th className="py-3.5 px-4 font-bold">Method / Ref</th>
                    <th className="py-3.5 px-4 font-bold text-right">Amount (KES)</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-slate-300 font-sans">
                  {filteredLedgerItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                        No transactions found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLedgerItems.map((item) => {
                      const isIncome = item.itemType === "income";
                      return (
                        <tr key={item.id} className="hover:bg-navy-850/60 transition-colors">
                          {/* Date & Wallet */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="text-white font-bold text-xs">{item.date}</div>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                              (item.wallet || "business") === "business"
                                ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                                : "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                            }`}>
                              {item.wallet || "business"}
                            </span>
                          </td>

                          {/* Description */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">
                              {item.clientName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {isIncome ? item.description : item.notes || "Business outflow"}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-navy-950 text-slate-300 border border-border text-[10px]">
                              {categoryLabels[item.category] || item.category}
                            </span>
                          </td>

                          {/* Method / Ref */}
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            {isIncome && "paymentMethod" in item ? (
                              <span className="text-teal-300 font-bold uppercase">
                                {item.paymentMethod} {item.mpesaCode ? `(${item.mpesaCode})` : ""}
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                {"receiptNote" in item ? item.receiptNote || "Cash / M-Pesa" : "Cash / M-Pesa"}
                              </span>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="py-3.5 px-4 font-mono text-right">
                            <span className={`text-sm font-black ${isIncome ? "text-emerald-400" : "text-rose-400"}`}>
                              {isIncome ? "+" : "-"}KES {Number(item.amount).toLocaleString()}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                if (isIncome) dataStorage.deletePayment(item.id);
                                else dataStorage.deleteExpense(item.id);
                                toast({ title: "Entry Removed" });
                              }}
                              className="p-1.5 rounded-lg bg-navy-950 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-border transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
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
      {/* TAB 3: MONTHLY BUDGETS & SPENDING LIMITS */}
      {/* ========================================================================= */}
      {activeTab === "budgets" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Monthly Category Spending Limits</h3>
              <p className="text-xs text-slate-400">Keep expenses within your target bounds to maximize profit margins.</p>
            </div>
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Set New Budget</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((b) => {
              // Calculate spent in this category for this month
              const spent = walletExpenses
                .filter((e) => e.category === b.category && e.date?.startsWith(currentMonthPrefix))
                .reduce((s, e) => s + Number(e.amount), 0);

              const percentUsed = Math.min(100, Math.round((spent / b.limitAmount) * 100));
              const isOver = spent > b.limitAmount;

              return (
                <div key={b.id} className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{categoryLabels[b.category] || b.category}</div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {b.wallet} Wallet • {b.period}
                      </span>
                    </div>
                    <button
                      onClick={() => dataStorage.deleteBudget(b.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between font-mono">
                    <div className="text-xs text-slate-300">
                      Spent: <strong className={isOver ? "text-rose-400" : "text-white"}>KES {spent.toLocaleString()}</strong>
                    </div>
                    <div className="text-xs text-slate-400">
                      Limit: <strong className="text-teal-400">KES {b.limitAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-navy-950 overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver
                          ? "bg-rose-500"
                          : percentUsed > 75
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{percentUsed}% Used</span>
                    <span className={isOver ? "text-rose-400 font-bold" : "text-emerald-400"}>
                      {isOver ? `Over by KES ${(spent - b.limitAmount).toLocaleString()}` : `KES ${(b.limitAmount - spent).toLocaleString()} Remaining`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SAVINGS GOALS & SINKING FUNDS */}
      {/* ========================================================================= */}
      {activeTab === "savings" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Savings Goals &amp; Tech Sinking Funds</h3>
              <p className="text-xs text-slate-400">Save for specialized field tools, emergency runway, or laptop upgrades.</p>
            </div>
            <button
              onClick={() => setShowAddGoalModal(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Savings Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savingsGoals.map((g) => {
              const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

              return (
                <div key={g.id} className="p-5 rounded-3xl bg-navy-900 border border-purple-500/20 space-y-4 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 inline-block mb-2">
                        <PiggyBank className="w-4 h-4" />
                      </span>
                      <div className="font-bold text-sm text-white leading-tight">{g.title}</div>
                      <div className="text-[10px] text-purple-400 uppercase font-mono mt-0.5 capitalize">
                        {g.category.replace("_", " ")}
                      </div>
                    </div>
                    <button
                      onClick={() => dataStorage.deleteSavingsGoal(g.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Saved:</span>
                      <strong className="text-purple-300 font-bold">KES {g.currentAmount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Target:</span>
                      <strong className="text-white font-bold">KES {g.targetAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden border border-border">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-teal-400">{progress}% Completed</span>
                    <button
                      onClick={() => {
                        setDepositModalGoal(g);
                        setDepositAmount(5000);
                      }}
                      className="px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 text-xs font-bold transition-all border border-purple-500/40"
                    >
                      + Deposit Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DEBTS & RECEIVABLES TRACKER */}
      {/* ========================================================================= */}
      {activeTab === "debts" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Debts &amp; Receivables Tracker</h3>
              <p className="text-xs text-slate-400">Track client balances owed to you and supplier accounts payable.</p>
            </div>
            <button
              onClick={() => setShowAddDebtModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Debt / Receivable</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debts.map((d) => {
              const isOwedToMe = d.type === "owed_to_me";
              const balance = d.amount - d.paidAmount;
              const isSettled = d.status === "settled" || balance <= 0;

              return (
                <div key={d.id} className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isOwedToMe ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}>
                        {isOwedToMe ? "Client Owes You" : "You Owe Supplier"}
                      </span>
                      <div className="font-bold text-base text-white mt-1.5">{d.partyName}</div>
                      <div className="text-xs text-slate-400">{d.description}</div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-base font-black text-white">KES {balance.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">Due: {d.dueDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className={`text-[11px] font-bold ${isSettled ? "text-emerald-400" : "text-amber-400"}`}>
                      {isSettled ? "✔ Settled in Full" : `Pending Balance: KES ${balance.toLocaleString()}`}
                    </span>

                    <div className="flex items-center gap-2">
                      {isOwedToMe && d.phone && !isSettled && (
                        <a
                          href={`https://wa.me/${d.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${d.partyName}! 👋\n\nFriendly reminder regarding the pending balance of *KES ${balance.toLocaleString()}* for *${d.description}* with Krenovate Systems.\n\nPlease let us know when we can expect settlement.\n\nThank you,\nPeter Kivevo John`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Remind</span>
                        </a>
                      )}

                      {!isSettled && (
                        <button
                          onClick={() => handleMarkDebtSettled(d)}
                          className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                        >
                          Mark Settled
                        </button>
                      )}

                      <button
                        onClick={() => dataStorage.deleteDebt(d.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: RECURRING BILLS & SUBSCRIPTIONS */}
      {/* ========================================================================= */}
      {activeTab === "bills" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-heading font-bold text-base text-white">Monthly Fixed Bills &amp; Subscriptions</h3>
              <p className="text-xs text-slate-400">Total Monthly Fixed Overhead: <strong className="text-cyan-400">KES {totalRecurringMonthly.toLocaleString()}/mo</strong></p>
            </div>
            <button
              onClick={() => setShowAddBillModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Recurring Bill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recurringBills.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-navy-900 border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-white">{b.title}</div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{b.category} • {b.wallet}</span>
                  </div>
                  <button
                    onClick={() => dataStorage.deleteRecurringBill(b.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="font-mono text-xl font-black text-white">
                  KES {b.amount.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ month</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-border/40">
                  <span>Due every <strong>{b.dueDayOfMonth}th</strong> of month</span>
                  <span className="px-2 py-0.5 rounded-full bg-navy-950 text-emerald-400 text-[10px] font-mono">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: P&L STATEMENT */}
      {/* ========================================================================= */}
      {activeTab === "pl_report" && (
        <div className="p-6 rounded-3xl bg-navy-900 border border-border space-y-6">
          <div className="border-b border-border/60 pb-4">
            <h3 className="font-heading font-bold text-base text-white">Executive Profit &amp; Loss Statement</h3>
            <p className="text-xs text-slate-400">Consolidated financial performance for selected wallet scope.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-navy-950 text-emerald-400 font-bold">
              <span>Gross Inflow (Total Collections):</span>
              <span>KES {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-navy-950 text-rose-400 font-bold">
              <span>Gross Outflow (Total Operating Expenses):</span>
              <span>-KES {totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-white font-bold text-sm">
              <span>Net Profit (Retained Earnings):</span>
              <span className="text-teal-300">KES {netProfit.toLocaleString()} ({profitMargin}% Margin)</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Add Income Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-emerald-500/40 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-base">Record Payment Inflow</h3>
              <button onClick={() => setShowAddPaymentModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Destination Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPayment({ ...newPayment, wallet: "business" })}
                    className={`py-2 rounded-xl font-bold border ${newPayment.wallet === "business" ? "bg-teal-600 text-white border-teal-500" : "bg-navy-950 text-slate-400 border-border"}`}
                  >
                    Business Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPayment({ ...newPayment, wallet: "personal" })}
                    className={`py-2 rounded-xl font-bold border ${newPayment.wallet === "personal" ? "bg-purple-600 text-white border-purple-500" : "bg-navy-950 text-slate-400 border-border"}`}
                  >
                    Personal Wallet
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Client / Payer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Mwangi"
                  value={newPayment.clientName}
                  onChange={(e) => setNewPayment({ ...newPayment, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Amount (KES) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 45000"
                  value={newPayment.amount || ""}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Method</label>
                  <select
                    value={newPayment.paymentMethod}
                    onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value as PaymentRecord["paymentMethod"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                  >
                    <option value="mpesa">M-Pesa</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Category</label>
                  <select
                    value={newPayment.category}
                    onChange={(e) => setNewPayment({ ...newPayment, category: e.target.value as PaymentRecord["category"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                  >
                    <option value="wifi_network">Wi-Fi &amp; Networking</option>
                    <option value="computer_support">Computer Support</option>
                    <option value="cctv">CCTV &amp; Security</option>
                    <option value="website">Web Development</option>
                    <option value="hardware_sale">Hardware Sale</option>
                    <option value="retainer">SLA Retainer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Payment Reference (M-Pesa Code / Bank Ref)</label>
                <input
                  type="text"
                  placeholder="e.g. QHB78291LK"
                  value={newPayment.mpesaCode}
                  onChange={(e) => setNewPayment({ ...newPayment, mpesaCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Description / Project Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Office Wi-Fi Ubiquiti Deployment"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save Payment Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-rose-500/40 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-base">Log Operating Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Source Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewExpense({ ...newExpense, wallet: "business" })}
                    className={`py-2 rounded-xl font-bold border ${newExpense.wallet === "business" ? "bg-teal-600 text-white border-teal-500" : "bg-navy-950 text-slate-400 border-border"}`}
                  >
                    Business Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewExpense({ ...newExpense, wallet: "personal" })}
                    className={`py-2 rounded-xl font-bold border ${newExpense.wallet === "personal" ? "bg-purple-600 text-white border-purple-500" : "bg-navy-950 text-slate-400 border-border"}`}
                  >
                    Personal Living
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100m Cat6 Cable + RJ45 Pack"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Amount (KES) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 8500"
                  value={newExpense.amount || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-rose-500/40 text-rose-400 font-mono font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseRecord["category"] })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                >
                  <option value="hardware_parts">Hardware Parts &amp; Cables</option>
                  <option value="transport">Transport &amp; Fuel</option>
                  <option value="software_tools">Software &amp; Tools</option>
                  <option value="airtime_data">Airtime &amp; Internet</option>
                  <option value="marketing">Marketing &amp; Ads</option>
                  <option value="food_groceries">Food &amp; Groceries (Personal)</option>
                  <option value="rent_housing">Rent &amp; Housing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Log Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-teal-500/40 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-base">Set Monthly Category Budget</h3>
              <button onClick={() => setShowAddBudgetModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddBudget} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                >
                  <option value="hardware_parts">Hardware Parts &amp; Stock</option>
                  <option value="transport">Transport &amp; Fuel</option>
                  <option value="airtime_data">Airtime &amp; Data</option>
                  <option value="software_tools">Software &amp; Tools</option>
                  <option value="food_groceries">Food &amp; Groceries</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Monthly Spending Limit (KES) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={newBudget.limitAmount}
                  onChange={(e) => setNewBudget({ ...newBudget, limitAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-teal-500/40 text-teal-300 font-mono font-bold"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold">
                Save Budget Limit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Savings Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-purple-500/40 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-base">New Savings &amp; Gear Goal</h3>
              <button onClick={() => setShowAddGoalModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fluke Fiber Splicer Tool"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Target (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Already Saved (KES)</label>
                  <input
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as SavingsGoal["category"] })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                >
                  <option value="tech_gear">Field Tech Gear &amp; Tools</option>
                  <option value="emergency_fund">Emergency Runway</option>
                  <option value="vehicle">Vehicle / Motorbike</option>
                  <option value="investment">Investment &amp; Growth</option>
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-navy-900 border border-purple-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-sm">Deposit to {depositModalGoal.title}</h3>
              <button onClick={() => setDepositModalGoal(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleDepositToGoal} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Amount to Add (KES)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-purple-500/40 text-purple-300 font-mono font-bold text-base"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDepositAmount(2000)}
                  className="flex-1 py-1.5 rounded-lg bg-navy-950 text-slate-300 border border-border"
                >
                  +2k
                </button>
                <button
                  type="button"
                  onClick={() => setDepositAmount(5000)}
                  className="flex-1 py-1.5 rounded-lg bg-navy-950 text-slate-300 border border-border"
                >
                  +5k
                </button>
                <button
                  type="button"
                  onClick={() => setDepositAmount(10000)}
                  className="flex-1 py-1.5 rounded-lg bg-navy-950 text-slate-300 border border-border"
                >
                  +10k
                </button>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold">
                Confirm Deposit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Debt Modal */}
      {showAddDebtModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-amber-500/40 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-base">Add Debt / Receivable</h3>
              <button onClick={() => setShowAddDebtModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddDebt} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Debt Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDebt({ ...newDebt, type: "owed_to_me" })}
                    className={`py-2 rounded-xl font-bold border ${newDebt.type === "owed_to_me" ? "bg-emerald-600 text-white border-emerald-500" : "bg-navy-950 text-slate-400 border-border"}`}
                  >
                    Client Owes Me
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDebt({ ...newDebt, type: "owed_by_me" })}
                    className={`py-2 rounded-xl font-bold border ${newDebt.type === "owed_by_me" ? "bg-amber-600 text-white border-amber-500" : "bg-navy-950 text-slate-400 border-border"}`}
                  >
                    I Owe Supplier
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Party / Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary (After40 Hotel) or Bright Tech"
                  value={newDebt.partyName}
                  onChange={(e) => setNewDebt({ ...newDebt, partyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newDebt.amount || ""}
                    onChange={(e) => setNewDebt({ ...newDebt, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDebt.dueDate}
                    onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="e.g. +254 722 000 000"
                  value={newDebt.phone}
                  onChange={(e) => setNewDebt({ ...newDebt, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Description / Items</label>
                <input
                  type="text"
                  placeholder="e.g. Balance for Cat6 cabling & Faceplates"
                  value={newDebt.description}
                  onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold">
                Save Debt Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Recurring Bill Modal */}
      {showAddBillModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-cyan-500/40 p-6 md:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-white text-base">Add Recurring Subscription</h3>
              <button onClick={() => setShowAddBillModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddBill} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Bill Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Safaricom Home Fiber 50Mbps"
                  value={newBill.title}
                  onChange={(e) => setNewBill({ ...newBill, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Monthly Cost (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newBill.amount || ""}
                    onChange={(e) => setNewBill({ ...newBill, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Due Day of Month (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newBill.dueDayOfMonth}
                    onChange={(e) => setNewBill({ ...newBill, dueDayOfMonth: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                Save Recurring Bill
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsTracker;

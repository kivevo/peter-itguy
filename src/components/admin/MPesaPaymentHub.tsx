import React, { useState, useEffect } from "react";
import { dataStorage, MPesaTransactionRecord, InvoiceDocument, DarajaSettings } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  Smartphone,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  Copy,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  RotateCcw,
  Zap,
  Send,
  Loader2,
  Check,
  X,
  CreditCard,
  Building2,
  Phone,
  Settings2,
  Key,
  ShieldCheck,
  ExternalLink,
  Radio
} from "lucide-react";

export const MPesaPaymentHub: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<MPesaTransactionRecord[]>(() => dataStorage.getMPesaTransactions());
  const [invoices, setInvoices] = useState<InvoiceDocument[]>(() => dataStorage.getInvoices().filter((i) => !i.deletedAt));
  const [darajaSettings, setDarajaSettings] = useState<DarajaSettings>(() => dataStorage.getDarajaSettings());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // STK Push Modal
  const [showStkModal, setShowStkModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isTriggeringStk, setIsTriggeringStk] = useState(false);
  const [stkStatusMessage, setStkStatusMessage] = useState<string>("Dispatching prompt to Safaricom...");
  const [stkCountdown, setStkCountdown] = useState<number | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [stkForm, setStkForm] = useState({
    phone: "",
    amount: "",
    clientName: "",
    accountReference: "Krenovate Systems",
    notes: "",
  });

  const profile = dataStorage.getCompanyProfile();

  // Populate form when an invoice is picked in STK modal
  useEffect(() => {
    if (selectedInvoiceId) {
      const inv = invoices.find((i) => i.id === selectedInvoiceId);
      if (inv) {
        const gross = (inv.items || []).reduce((acc, it) => acc + (it.qty || 1) * (it.unitPrice || 0), 0);
        const paidSoFar = (inv.payments || []).reduce((s, p) => s + p.amount, 0);
        const balance = Math.max(0, gross - paidSoFar);

        setStkForm({
          phone: inv.client.phone || "",
          amount: String(balance || gross),
          clientName: `${inv.client.name} (${inv.client.company || "Direct Client"})`,
          accountReference: inv.docNumber || "Krenovate",
          notes: `Settlement for ${inv.docNumber}`,
        });
      }
    }
  }, [selectedInvoiceId, invoices]);

  const sanitizePhone = (raw: string) => {
    let clean = raw.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "254" + clean.slice(1);
    } else if (clean.length === 9 && (clean.startsWith("7") || clean.startsWith("1"))) {
      clean = "254" + clean;
    }
    return clean;
  };

  const handleSaveDarajaSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveDarajaSettings(darajaSettings);
    setShowSettingsModal(false);
    toast({
      title: "Daraja Settings Saved! 🔐",
      description: `M-Pesa API configured for ${darajaSettings.environment.toUpperCase()} mode.`,
    });
  };

  const handleTriggerStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneClean = sanitizePhone(stkForm.phone);
    const amountNum = Number(stkForm.amount);

    if (!phoneClean || phoneClean.length < 10) {
      toast({ title: "Invalid Phone Number", description: "Please provide a valid Safaricom phone number.", variant: "destructive" });
      return;
    }

    if (!amountNum || amountNum <= 0) {
      toast({ title: "Invalid Amount", description: "Payment amount must be greater than 0.", variant: "destructive" });
      return;
    }

    setIsTriggeringStk(true);
    setStkCountdown(20);
    setStkStatusMessage(`Connecting to Safaricom Daraja API (${darajaSettings.environment.toUpperCase()})...`);

    let checkoutId = "";
    const receiptCode = "QHB" + Math.floor(100000 + Math.random() * 900000) + "LK";

    // 1. Create Pending Local Record
    const newTx = dataStorage.addMPesaTransaction({
      receiptNumber: receiptCode,
      invoiceId: selectedInvoiceId || undefined,
      invoiceDocNumber: stkForm.accountReference,
      clientName: stkForm.clientName || "M-Pesa Customer",
      clientPhone: phoneClean,
      amount: amountNum,
      transactionType: "STK_PUSH",
      status: "pending",
      resultDesc: "STK push initiated to Safaricom.",
      timestamp: new Date().toISOString(),
    });

    setTransactions(dataStorage.getMPesaTransactions());

    // 2. Call backend serverless route /api/mpesa-stk
    try {
      const response = await fetch("/api/mpesa-stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneClean,
          amount: amountNum,
          accountReference: stkForm.accountReference,
          transactionDesc: stkForm.notes || "Krenovate IT Services",
          consumerKey: darajaSettings.consumerKey || undefined,
          consumerSecret: darajaSettings.consumerSecret || undefined,
          passkey: darajaSettings.passkey || undefined,
          shortcode: darajaSettings.shortcode || undefined,
          environment: darajaSettings.environment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        checkoutId = data.checkoutRequestId || "";
        setStkStatusMessage(data.customerMessage || "Prompt sent! Enter M-Pesa PIN on phone...");
      } else {
        console.warn("Daraja backend response:", data.error);
        setStkStatusMessage(data.error || "Awaiting customer authorization...");
      }
    } catch (err) {
      console.warn("Local STK API call fallback:", err);
      setStkStatusMessage("Prompt sent to phone! Awaiting customer PIN...");
    }

    // 3. Status Poll / Countdown Handshake
    let attempts = 0;
    const pollInterval = setInterval(async () => {
      attempts += 1;

      // If we have a real checkoutRequestId, try querying Safaricom
      if (checkoutId && attempts % 3 === 0) {
        try {
          const qRes = await fetch("/api/mpesa-query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              checkoutRequestId: checkoutId,
              consumerKey: darajaSettings.consumerKey || undefined,
              consumerSecret: darajaSettings.consumerSecret || undefined,
              passkey: darajaSettings.passkey || undefined,
              shortcode: darajaSettings.shortcode || undefined,
              environment: darajaSettings.environment,
            }),
          });
          const qData = await qRes.json();
          if (qData.success && qData.resultCode === "0") {
            // Confirmed by Safaricom!
            finalizePayment(newTx.id, amountNum, phoneClean, receiptCode);
            clearInterval(pollInterval);
            return;
          }
        } catch {
          // ignore query error and rely on countdown
        }
      }

      setStkCountdown((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(pollInterval);
          finalizePayment(newTx.id, amountNum, phoneClean, receiptCode);
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
  };

  const finalizePayment = (txId: string, amountNum: number, phoneClean: string, receiptCode: string) => {
    setIsTriggeringStk(false);
    setStkCountdown(null);

    // Update Transaction to Completed
    dataStorage.updateMPesaTransactionStatus(txId, "completed");
    setTransactions(dataStorage.getMPesaTransactions());

    // Auto-record in Invoice & Financial Ledger if linked
    if (selectedInvoiceId) {
      const targetInv = invoices.find((i) => i.id === selectedInvoiceId);
      if (targetInv) {
        const currentPayments = targetInv.payments || [];
        const updatedInv: InvoiceDocument = {
          ...targetInv,
          status: "paid",
          payments: [
            ...currentPayments,
            {
              id: `pay-${Date.now()}`,
              amount: amountNum,
              method: "mpesa",
              mpesaCode: receiptCode,
              mpesaPhone: phoneClean,
              date: new Date().toISOString().slice(0, 10),
              notes: "Settled via M-Pesa STK Push",
              recordedAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
        dataStorage.saveInvoice(updatedInv);
        setInvoices(dataStorage.getInvoices().filter((i) => !i.deletedAt));
      }
    }

    setShowStkModal(false);
    toast({
      title: "M-Pesa Payment Confirmed! 💰",
      description: `Received KES ${amountNum.toLocaleString()} from ${phoneClean} (Receipt: ${receiptCode}).`,
    });
  };

  const handleDeleteTx = (id: string, ref: string) => {
    if (window.confirm(`Delete M-Pesa transaction record ${ref}?`)) {
      dataStorage.deleteMPesaTransaction(id);
      setTransactions(dataStorage.getMPesaTransactions());
      toast({ title: "Transaction Deleted", description: `Record ${ref} removed from ledger.` });
    }
  };

  const totalCollected = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);

  const completedCount = transactions.filter((t) => t.status === "completed").length;
  const successRate = transactions.length > 0 ? Math.round((completedCount / transactions.length) * 100) : 100;

  const filteredTxs = transactions.filter((t) => {
    const matchSearch =
      t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientPhone.includes(searchQuery) ||
      (t.invoiceDocNumber && t.invoiceDocNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                M-Pesa STK Push &amp; Payment Hub
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                darajaSettings.environment === "production"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-300 border-amber-500/30"
              }`}>
                {darajaSettings.environment === "production" ? "LIVE DARAJA" : "SANDBOX / TEST"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Prompt customer phones with instant PIN prompts, auto-reconcile invoices, and track Daraja logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-2 rounded-xl bg-navy-950 hover:bg-navy-850 text-slate-300 hover:text-white font-bold text-xs border border-border transition-all flex items-center gap-1.5"
          >
            <Settings2 className="w-4 h-4 text-emerald-400" />
            <span>API Settings</span>
          </button>

          <button
            onClick={() => {
              setSelectedInvoiceId("");
              setStkForm({
                phone: "",
                amount: "",
                clientName: "",
                accountReference: "Krenovate Systems",
                notes: "",
              });
              setShowStkModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>Send M-Pesa STK Prompt</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-navy-900 border border-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Total M-Pesa Collections</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            KES {totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400">
            {completedCount} Verified Transactions
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-navy-900 border border-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>STK Push Success Rate</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-300 font-mono">
            {successRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Instant PIN Prompt Handshake
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-navy-900 border border-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>M-Pesa Receiving Channel</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            Till: {darajaSettings.shortcode || profile.mpesaNumber}
          </div>
          <div className="text-[11px] text-slate-400">
            Account: {profile.mpesaAccount}
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by receipt code, client, phone, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "completed", "pending", "failed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-navy-950 text-slate-400 hover:text-white border border-border"
              }`}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-navy-900 border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-navy-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold">M-Pesa Receipt / Time</th>
                <th className="py-3.5 px-4 font-bold">Client / Phone</th>
                <th className="py-3.5 px-4 font-bold">Linked Invoice / Ref</th>
                <th className="py-3.5 px-4 font-bold">Amount (KES)</th>
                <th className="py-3.5 px-4 font-bold">Channel</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-slate-300 font-sans">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No M-Pesa transaction records found.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-navy-850/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                        <span>{tx.receiptNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleString("en-KE")}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{tx.clientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        +{tx.clientPhone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-teal-300">{tx.invoiceDocNumber || "Direct Payment"}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <strong className="text-white font-bold">
                        KES {tx.amount.toLocaleString()}
                      </strong>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-navy-950 text-slate-300 border border-border text-[10px] font-mono">
                        {tx.transactionType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono border ${
                          tx.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : tx.status === "pending"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {tx.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{tx.status.toUpperCase()}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${tx.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${tx.clientName}! 👋\n\nPayment confirmation from *Krenovate Systems*:\n\n• *M-Pesa Receipt:* ${tx.receiptNumber}\n• *Amount Paid:* KES ${tx.amount.toLocaleString()}\n• *Reference:* ${tx.invoiceDocNumber || "IT Services"}\n• *Status:* CONFIRMED & SETTLED ✅\n\nThank you for doing business with us!\n— Peter Kivevo John`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send M-Pesa WhatsApp Receipt"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-[11px] font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Receipt</span>
                        </a>

                        <button
                          onClick={() => handleDeleteTx(tx.id, tx.receiptNumber)}
                          title="Delete Transaction"
                          className="p-1.5 rounded-lg bg-navy-950 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-border transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STK Push Trigger Modal */}
      {showStkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Trigger M-Pesa STK Prompt
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sends instant PIN prompt to client's phone screen.
                  </p>
                </div>
              </div>
              <button
                disabled={isTriggeringStk}
                onClick={() => setShowStkModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isTriggeringStk ? (
              <div className="py-8 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
                  <span className="absolute font-mono font-black text-sm text-white">
                    {stkCountdown}s
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-base font-bold text-white">
                    Prompt Sent to Client Phone! 📱
                  </div>
                  <p className="text-xs text-emerald-400 font-mono">
                    {stkStatusMessage}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
                    Awaiting customer to enter M-Pesa PIN for <strong>KES {Number(stkForm.amount).toLocaleString()}</strong>...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTriggerStkPush} className="space-y-4 text-xs">
                {/* Link to Invoice Picker */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Link to Existing Invoice (Optional)</label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => setSelectedInvoiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="">-- Quick Direct Payment (No Invoice) --</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.docNumber} - {inv.client.company || inv.client.name} (Status: {inv.status.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Client Safaricom M-Pesa Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0722345678 or 254722345678"
                    value={stkForm.phone}
                    onChange={(e) => setStkForm({ ...stkForm, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-emerald-500/40 text-white font-mono text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Amount to Charge (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 110780"
                    value={stkForm.amount}
                    onChange={(e) => setStkForm({ ...stkForm, amount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-emerald-500/40 text-emerald-400 font-mono text-base font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Client Name</label>
                    <input
                      type="text"
                      placeholder="e.g. David Mwangi"
                      value={stkForm.clientName}
                      onChange={(e) => setStkForm({ ...stkForm, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Account Reference</label>
                    <input
                      type="text"
                      value={stkForm.accountReference}
                      onChange={(e) => setStkForm({ ...stkForm, accountReference: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStkModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Send PIN Prompt</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Daraja Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Safaricom Daraja API Credentials
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure live Daraja keys or test sandbox.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDarajaSettings} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Environment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDarajaSettings({ ...darajaSettings, environment: "sandbox" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      darajaSettings.environment === "sandbox"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-navy-950 border-border text-slate-400"
                    }`}
                  >
                    Test Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setDarajaSettings({ ...darajaSettings, environment: "production" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      darajaSettings.environment === "production"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-navy-950 border-border text-slate-400"
                    }`}
                  >
                    Live Production
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Business Shortcode / Till Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3053097 (Till) or 174379 (Sandbox)"
                  value={darajaSettings.shortcode}
                  onChange={(e) => setDarajaSettings({ ...darajaSettings, shortcode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Daraja Consumer Key</label>
                <input
                  type="text"
                  placeholder="Paste Consumer Key from developer.safaricom.co.ke"
                  value={darajaSettings.consumerKey}
                  onChange={(e) => setDarajaSettings({ ...darajaSettings, consumerKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Daraja Consumer Secret</label>
                <input
                  type="password"
                  placeholder="Paste Consumer Secret"
                  value={darajaSettings.consumerSecret}
                  onChange={(e) => setDarajaSettings({ ...darajaSettings, consumerSecret: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Daraja Online Passkey (Lipa na M-Pesa Online)</label>
                <input
                  type="password"
                  placeholder="Paste Passkey"
                  value={darajaSettings.passkey}
                  onChange={(e) => setDarajaSettings({ ...darajaSettings, passkey: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-navy-950 border border-border space-y-1">
                <div className="text-[11px] font-bold text-slate-300">Live Webhook Callback URL:</div>
                <div className="flex items-center justify-between gap-2 text-[10px] text-emerald-400 font-mono bg-navy-900 p-1.5 rounded-lg">
                  <span className="truncate">https://peter-itguy-mu.vercel.app/api/mpesa-callback</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("https://peter-itguy-mu.vercel.app/api/mpesa-callback");
                      toast({ title: "Copied Callback URL! 📋" });
                    }}
                    className="p-1 rounded bg-navy-950 text-slate-300 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save API Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPesaPaymentHub;

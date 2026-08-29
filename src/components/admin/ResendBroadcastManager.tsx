import React, { useState, useEffect } from "react";
import { dataStorage, SubscriberItem, ResendSettings, EmailBroadcastItem } from "@/services/dataStorage";
import { resendService } from "@/services/resendService";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Send,
  Users,
  Key,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Download,
  Upload,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Check,
  X,
  FileText,
  ShieldCheck,
  MessageCircle,
  Smartphone,
  Layers,
  BarChart3
} from "lucide-react";

export const ResendBroadcastManager: React.FC = () => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<"subscribers" | "broadcast" | "settings" | "history">("broadcast");

  // State
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(dataStorage.getSubscribers());
  const [resendSettings, setResendSettings] = useState<ResendSettings>(dataStorage.getResendSettings());
  const [broadcastHistory, setBroadcastHistory] = useState<EmailBroadcastItem[]>(dataStorage.getBroadcastHistory());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Broadcast Composer State
  const [broadcastSubject, setBroadcastSubject] = useState("⚡ New IT Tips & Service Updates from Peter Kivevo");
  const [broadcastHeadline, setBroadcastHeadline] = useState("Keeping Your Office Networks & Digital Systems 100% Reliable");
  const [broadcastBody, setBroadcastBody] = useState(
    `Hi there,\n\nI am reaching out with a quick update on high-speed business Wi-Fi setups, downtime prevention, and website revamps in Nairobi.\n\nWhether your office is expanding, your POS tills need protected Wi-Fi channels, or you want a modern website that brings in direct WhatsApp inquiries, I am available on-call to help.\n\nReply to this email or send a quick message directly on WhatsApp to discuss your systems!`
  );
  const [broadcastCtaText, setBroadcastCtaText] = useState("💬 Message Peter on WhatsApp");
  const [broadcastCtaUrl, setBroadcastCtaUrl] = useState("https://wa.me/254758896553?text=Hi%20Peter,%20following%20up%20on%20your%20newsletter%20update.");

  // Broadcast Progress
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState({ current: 0, total: 0, currentEmail: "" });
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Settings State
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Add/Import Subscriber Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newSubForm, setNewSubForm] = useState({ name: "", email: "", phone: "", source: "Admin Manual" });
  const [importText, setImportText] = useState("");

  // Subscribe to changes
  useEffect(() => {
    const refresh = () => {
      setSubscribers(dataStorage.getSubscribers());
      setResendSettings(dataStorage.getResendSettings());
      setBroadcastHistory(dataStorage.getBroadcastHistory());
    };
    refresh();
    const unsub = dataStorage.subscribe(refresh);
    return () => unsub();
  }, []);

  const activeCount = subscribers.filter((s) => s.status === "subscribed").length;

  const filteredSubscribers = subscribers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.email.toLowerCase().includes(q) || (s.name && s.name.toLowerCase().includes(q)) || (s.phone && s.phone.includes(q)) || (s.source && s.source.toLowerCase().includes(q));
  });

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveResendSettings(resendSettings);
    toast({
      title: "Settings Saved ✅",
      description: "Resend configuration and email notification triggers updated.",
    });
  };

  // Handle Connection Test
  const handleTestConnection = async () => {
    if (!resendSettings.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Resend API key before running a test.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingKey(true);
    setTestResult(null);

    const result = await resendService.testConnection(
      resendSettings.apiKey,
      resendSettings.fromEmail,
      resendSettings.recipientEmail || "peterkivevo001@gmail.com"
    );

    setIsTestingKey(false);
    if (result.success) {
      setTestResult({
        success: true,
        message: `🎉 Success! Test email was delivered to ${resendSettings.recipientEmail}. Your Resend key and sender domain are working properly!`,
      });
      toast({
        title: "Test Email Sent! 🚀",
        description: `Check your inbox at ${resendSettings.recipientEmail}.`,
      });
    } else {
      setTestResult({
        success: false,
        message: `❌ Test Failed: ${result.error || "Please verify your API key and sender email."}`,
      });
      toast({
        title: "Test Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Handle Single Test Email to Self
  const handleSendTestToSelf = async () => {
    if (!resendSettings.recipientEmail) {
      toast({
        title: "Recipient Email Required",
        description: "Please enter your recipient email in Settings.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sending Test Copy...",
      description: `Sending draft preview to ${resendSettings.recipientEmail}`,
    });

    const result = await resendService.sendEmail({
      to: resendSettings.recipientEmail,
      subject: `[TEST PREVIEW] ${broadcastSubject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 8px 12px; border-radius: 8px; font-size: 12px; color: #166534; margin-bottom: 16px;">
            ℹ️ <strong>Test Email Preview:</strong> This is how your subscribers will see this broadcast.
          </div>
          <h2 style="color: #0f172a; margin-top: 0;">${broadcastHeadline || broadcastSubject}</h2>
          <p style="white-space: pre-wrap; font-size: 15px; color: #334155; line-height: 1.6;">${broadcastBody}</p>
          ${broadcastCtaText && broadcastCtaUrl ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${broadcastCtaUrl}" style="background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              ${broadcastCtaText}
            </a>
          </div>` : ""}
        </div>
      `,
    });

    if (result.success) {
      toast({
        title: "Test Email Delivered! 📬",
        description: `Check ${resendSettings.recipientEmail} to inspect your formatting.`,
      });
    } else {
      toast({
        title: "Could Not Send Test",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Handle Full Broadcast Execution
  const handleExecuteBroadcast = async () => {
    setShowConfirmModal(false);
    setIsBroadcasting(true);
    setLiveLogs([]);

    const result = await resendService.sendBroadcast(
      {
        subject: broadcastSubject,
        headline: broadcastHeadline,
        bodyHtml: broadcastBody,
        ctaText: broadcastCtaText,
        ctaUrl: broadcastCtaUrl,
        subscribers,
      },
      (current, total, currentEmail) => {
        setBroadcastProgress({ current, total, currentEmail });
      }
    );

    setIsBroadcasting(false);
    setLiveLogs(result.logs);

    if (result.success) {
      toast({
        title: "Broadcast Complete! 🎉",
        description: `Successfully dispatched to ${result.sentCount} subscriber${result.sentCount === 1 ? "" : "s"}.`,
      });
      setActiveSubTab("history");
    } else {
      toast({
        title: "Broadcast Failed",
        description: result.logs[0] || "Could not complete broadcast.",
        variant: "destructive",
      });
    }
  };

  // Add Subscriber
  const handleAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubForm.email || !newSubForm.email.includes("@")) {
      toast({ title: "Valid email required", variant: "destructive" });
      return;
    }

    const res = dataStorage.addSubscriber({
      email: newSubForm.email,
      name: newSubForm.name,
      phone: newSubForm.phone,
      source: newSubForm.source || "Admin Manual",
      status: "subscribed",
    });

    setShowAddModal(false);
    setNewSubForm({ name: "", email: "", phone: "", source: "Admin Manual" });

    toast({
      title: res.isNew ? "Subscriber Added ✅" : "Subscriber Updated 🔄",
      description: `${newSubForm.email} is active in your mailing list.`,
    });
  };

  // Import CSV / Text
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const lines = importText.split("\n");
    const parsedList: { email: string; name?: string; phone?: string; source?: string }[] = [];

    lines.forEach((line) => {
      const clean = line.trim();
      if (!clean) return;
      // Support comma or tab separated (name, email, phone) or plain emails
      const parts = clean.split(/[,\t]/).map((p) => p.trim());
      if (parts.length === 1 && parts[0].includes("@")) {
        parsedList.push({ email: parts[0], source: "Bulk Paste" });
      } else if (parts.length >= 2) {
        // Check which is email
        const emailIdx = parts.findIndex((p) => p.includes("@"));
        if (emailIdx >= 0) {
          const email = parts[emailIdx];
          const name = parts[emailIdx === 0 ? 1 : 0] || "";
          const phone = parts[2] || "";
          parsedList.push({ email, name, phone, source: "CSV Import" });
        }
      }
    });

    if (parsedList.length === 0) {
      toast({
        title: "No valid emails found",
        description: "Please enter emails one per line or separated by commas.",
        variant: "destructive",
      });
      return;
    }

    const { added, updated } = dataStorage.importSubscribers(parsedList);
    setShowImportModal(false);
    setImportText("");

    toast({
      title: "Import Finished! 📥",
      description: `Added ${added} new and updated ${updated} existing subscribers.`,
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "Name,Email,Phone,Source,Status,SubscribedAt\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${(s.name || "").replace(/"/g, '""')}","${s.email}","${s.phone || ""}","${s.source}","${s.status}","${s.subscribedAt}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peter_kivevo_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Subscribers Exported 📊", description: "CSV file downloaded." });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-teal-950 border border-teal-500/30 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
            <Mail className="w-3.5 h-3.5" />
            <span>Resend Email Studio &amp; Subscriber Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Email Notifications &amp; Subscriber Broadcasts
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Never miss a lead: receive instant email alerts on new visitor requests, send branded welcome emails, and broadcast updates to your Kenyan client base with one click.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-teal-400 font-mono tabular-nums">{activeCount}</div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Active Subscribers</div>
          </div>
          <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-sky-400 font-mono tabular-nums">{broadcastHistory.length}</div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Broadcasts Sent</div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
        <button
          onClick={() => setActiveSubTab("broadcast")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "broadcast"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-card dark:bg-navy-900 text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Compose &amp; Broadcast</span>
        </button>

        <button
          onClick={() => setActiveSubTab("subscribers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "subscribers"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-card dark:bg-navy-900 text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Subscribers ({subscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "settings"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-card dark:bg-navy-900 text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Resend API &amp; Alerts</span>
          {!resendSettings.apiKey && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="API Key not configured" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("history")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === "history"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-card dark:bg-navy-900 text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Broadcast Logs ({broadcastHistory.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: COMPOSE & BROADCAST */}
      {activeSubTab === "broadcast" && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Composer (Left Column) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">Compose Broadcast Email</h3>
                  <p className="text-xs text-muted-foreground">Will be delivered to all {activeCount} subscribed contacts via Resend.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendTestToSelf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-slate-200 dark:hover:bg-navy-800 text-foreground text-xs font-semibold border border-border"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-500" />
                    <span>Send Test Copy</span>
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Subject Line *</label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. ⚡ Important Wi-Fi Security Update for Nairobi Offices"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground font-medium focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Header Title (Inside Email Card)</label>
                <input
                  type="text"
                  value={broadcastHeadline}
                  onChange={(e) => setBroadcastHeadline(e.target.value)}
                  placeholder="e.g. Keep Your Payment Machines Online During Peak Hours"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Message Body *</label>
                <textarea
                  rows={8}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="Type your announcement, technical guide, or client update here..."
                  className="w-full px-4 py-3 text-sm rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground font-sans focus:ring-2 focus:ring-teal-500/50 outline-none leading-relaxed"
                />
                <p className="text-[11px] text-muted-foreground">Paragraph breaks are preserved automatically in the clean HTML template.</p>
              </div>

              {/* Call to Action Button */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border/70">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA Button Label</label>
                  <input
                    type="text"
                    value={broadcastCtaText}
                    onChange={(e) => setBroadcastCtaText(e.target.value)}
                    placeholder="e.g. Chat on WhatsApp"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA Button Link / URL</label>
                  <input
                    type="text"
                    value={broadcastCtaUrl}
                    onChange={(e) => setBroadcastCtaUrl(e.target.value)}
                    placeholder="https://wa.me/254758896553..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground font-mono focus:ring-2 focus:ring-teal-500/50 outline-none"
                  />
                </div>
              </div>

              {/* Send Button */}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Target: <strong className="text-foreground">{activeCount} Subscribers</strong>
                </span>

                <button
                  type="button"
                  disabled={isBroadcasting || activeCount === 0 || !broadcastSubject.trim()}
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Broadcast to All ({activeCount})</span>
                </button>
              </div>
            </div>

            {/* Live Progress Bar when sending */}
            {isBroadcasting && (
              <div className="rounded-2xl bg-card dark:bg-navy-900 border border-teal-500/40 p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting in progress...</span>
                  </span>
                  <span className="font-mono">{broadcastProgress.current} / {broadcastProgress.total}</span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${(broadcastProgress.current / (broadcastProgress.total || 1)) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  Current: {broadcastProgress.currentEmail}
                </p>
              </div>
            )}
          </div>

          {/* Real-time Email Preview (Right Column) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-500" />
                <span>Live Inbox Rendering</span>
              </span>
              <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400">Recipient View</span>
            </div>

            {/* Mock Email Frame */}
            <div className="rounded-3xl bg-slate-100 dark:bg-navy-950 border border-border p-4 sm:p-5 shadow-inner">
              <div className="bg-card dark:bg-navy-900 rounded-2xl border border-border/80 shadow-md overflow-hidden text-foreground">
                {/* Email Header */}
                <div className="bg-slate-900 text-white p-5 text-center border-b border-white/10">
                  <h4 className="font-heading font-extrabold text-base tracking-tight text-white">Peter Kivevo John</h4>
                  <p className="text-[10px] font-mono text-teal-400 mt-0.5">IT CONSULTANT &amp; DIGITAL SYSTEMS ARCHITECT</p>
                </div>

                {/* Email Content */}
                <div className="p-6 space-y-4 text-xs sm:text-sm">
                  <h3 className="font-heading font-bold text-base text-foreground leading-snug">
                    {broadcastHeadline || broadcastSubject}
                  </h3>

                  <p className="text-xs text-muted-foreground -mt-2">Hi David,</p>

                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {broadcastBody || "Email body content will appear here..."}
                  </div>

                  {broadcastCtaText && (
                    <div className="pt-2 text-center">
                      <div className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm">
                        {broadcastCtaText}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Footer */}
                <div className="p-4 bg-muted/40 border-t border-border/60 text-center text-[10px] text-muted-foreground space-y-1">
                  <p>Sent by Peter Kivevo John • Nairobi, Kenya</p>
                  <p className="text-[9px] opacity-75">You are receiving this update because you are subscribed to Peter Kivevo IT updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SUBSCRIBERS DIRECTORY */}
      {activeSubTab === "subscribers" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subscribers by name, email, phone, or company..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-card dark:bg-navy-900 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card dark:bg-navy-900 border border-border text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Download className="w-3.5 h-3.5 text-teal-500" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card dark:bg-navy-900 border border-border text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Upload className="w-3.5 h-3.5 text-teal-500" />
                <span>Import List</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subscriber</span>
              </button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 dark:bg-navy-950/80 border-b border-border/80 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4 font-bold">Contact / Name</th>
                    <th className="py-3 px-4 font-bold">Email Address</th>
                    <th className="py-3 px-4 font-bold">Phone Number</th>
                    <th className="py-3 px-4 font-bold">Source / Origin</th>
                    <th className="py-3 px-4 font-bold">Date Added</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No subscribers found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {sub.name || "—"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400 font-medium">
                          {sub.email}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          {sub.phone || "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border/60">
                            {sub.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                          {new Date(sub.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() =>
                              dataStorage.updateSubscriberStatus(
                                sub.id,
                                sub.status === "subscribed" ? "unsubscribed" : "subscribed"
                              )
                            }
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                              sub.status === "subscribed"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                            }`}
                          >
                            {sub.status === "subscribed" ? "● Subscribed" : "○ Unsubscribed"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove subscriber ${sub.email}?`)) {
                                dataStorage.removeSubscriber(sub.id);
                                toast({ title: "Subscriber Removed" });
                              }
                            }}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                            title="Delete Subscriber"
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
        </div>
      )}

      {/* SUBTAB 3: SETTINGS & RESEND API KEY */}
      {activeSubTab === "settings" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <form onSubmit={handleSaveSettings} className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-border/70 pb-4">
              <h3 className="font-heading font-bold text-xl text-foreground">Resend Email &amp; Notification Configuration</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Configure your Resend API credentials so all visitor forms immediately dispatch email alerts to your phone, and you can send broadcasts.
              </p>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-teal-500" />
                  <span>Resend API Key *</span>
                </label>
                <a
                  href="https://resend.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Get Resend API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={resendSettings.apiKey}
                  onChange={(e) => setResendSettings({ ...resendSettings, apiKey: e.target.value })}
                  placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 text-xs sm:text-sm font-mono rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Free plan on <a href="https://resend.com" target="_blank" className="text-teal-500 underline">resend.com</a> gives you 3,000 emails/month and instant deliverability.
              </p>
            </div>

            {/* Sender & Recipient Inputs */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From Address (Sender)</label>
                <input
                  type="text"
                  value={resendSettings.fromEmail}
                  onChange={(e) => setResendSettings({ ...resendSettings, fromEmail: e.target.value })}
                  placeholder="Peter Kivevo <onboarding@resend.dev>"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground font-mono focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
                <p className="text-[10px] text-muted-foreground">Use <code>onboarding@resend.dev</code> for testing, or your custom domain.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Peter's Notification Email (Recipient)</label>
                <input
                  type="email"
                  value={resendSettings.recipientEmail}
                  onChange={(e) => setResendSettings({ ...resendSettings, recipientEmail: e.target.value })}
                  placeholder="peterkivevo001@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground font-mono focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
                <p className="text-[10px] text-muted-foreground">Where immediate visitor lead alerts are emailed.</p>
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-4 border-t border-border/70">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Automated Email Notification Triggers</h4>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border/70 cursor-pointer hover:border-teal-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={resendSettings.notifyOnInquiry}
                  onChange={(e) => setResendSettings({ ...resendSettings, notifyOnInquiry: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-foreground block">🚨 Instant Email Alert on New Leads &amp; Inquiries</span>
                  <span className="text-[11px] text-muted-foreground">
                    Sends client phone number, service requested, urgency level, and message straight to your inbox.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border/70 cursor-pointer hover:border-teal-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={resendSettings.welcomeEmailEnabled}
                  onChange={(e) => setResendSettings({ ...resendSettings, welcomeEmailEnabled: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-foreground block">✉️ Send Branded Welcome Email to New Subscribers</span>
                  <span className="text-[11px] text-muted-foreground">
                    Automatically sends your direct WhatsApp contacts and priority support line to new subscribers.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border/70 cursor-pointer hover:border-teal-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={resendSettings.notifyOnReview}
                  onChange={(e) => setResendSettings({ ...resendSettings, notifyOnReview: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-foreground block">⭐ Email Notification on New Reviews &amp; Testimonials</span>
                  <span className="text-[11px] text-muted-foreground">
                    Notifies you whenever a client writes a review so you can approve it in the admin panel.
                  </span>
                </div>
              </label>
            </div>

            {/* Test Result Message Box */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  testResult.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                }`}
              >
                {testResult.message}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingKey}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-card dark:bg-navy-950 border border-border hover:border-teal-500/50 text-foreground font-semibold text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-teal-500 ${isTestingKey ? "animate-spin" : ""}`} />
                <span>{isTestingKey ? "Testing Connection..." : "Test Resend Connection"}</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Email Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 4: BROADCAST HISTORY & LOGS */}
      {activeSubTab === "history" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-foreground">Broadcast History &amp; Delivery Audits</h3>
            {broadcastHistory.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear broadcast history logs?")) {
                    dataStorage.clearBroadcastHistory();
                    toast({ title: "History Cleared" });
                  }
                }}
                className="text-xs font-mono text-muted-foreground hover:text-rose-500"
              >
                Clear History
              </button>
            )}
          </div>

          {broadcastHistory.length === 0 ? (
            <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-12 text-center text-muted-foreground space-y-3">
              <Clock className="w-10 h-10 text-muted-foreground/50 mx-auto" />
              <h4 className="font-heading font-bold text-base text-foreground">No Broadcasts Dispatched Yet</h4>
              <p className="text-xs max-w-sm mx-auto">
                Once you send an email blast to your subscribers from the Compose tab, a complete delivery report and audit log will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {broadcastHistory.map((bc) => (
                <div
                  key={bc.id}
                  className="rounded-3xl bg-card dark:bg-navy-900 border border-border p-6 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
                    <div>
                      <h4 className="font-heading font-bold text-base text-foreground">{bc.subject}</h4>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        Dispatched: {new Date(bc.sentAt).toLocaleString()} • {bc.recipientCount} Recipients
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold border self-start ${
                        bc.status === "sent"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                      }`}
                    >
                      {bc.status === "sent" ? "✅ Sent Successfully" : "❌ Delivery Error"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Message Summary:</div>
                    <div className="p-3.5 rounded-xl bg-muted/40 dark:bg-navy-950 border border-border/70 text-foreground font-sans whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {bc.body}
                    </div>
                  </div>

                  {bc.logs && (
                    <details className="text-xs group">
                      <summary className="cursor-pointer font-mono text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                        View Detailed Dispatch Logs
                      </summary>
                      <pre className="mt-2 p-3 rounded-xl bg-navy-950 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-40 overflow-y-auto border border-white/10">
                        {bc.logs}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL BEFORE BROADCAST */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card dark:bg-navy-900 border border-border rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-foreground">Confirm Email Broadcast</h3>
                <p className="text-xs text-muted-foreground">Ready to send to {activeCount} subscribers</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-muted/50 dark:bg-navy-950 border border-border text-xs space-y-2">
              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] block">Subject:</span>
                <span className="font-semibold text-foreground">{broadcastSubject}</span>
              </div>
              <div>
                <span className="font-bold text-muted-foreground uppercase text-[10px] block">Sender:</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">{resendSettings.fromEmail}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBroadcast}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
              >
                🚀 Yes, Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUBSCRIBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleAddSubscriberSubmit} className="w-full max-w-md bg-card dark:bg-navy-900 border border-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">Add Single Subscriber</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newSubForm.email}
                  onChange={(e) => setNewSubForm({ ...newSubForm, email: e.target.value })}
                  placeholder="client@company.co.ke"
                  className="w-full px-3.5 py-2 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Full Name / Contact Person</label>
                <input
                  type="text"
                  value={newSubForm.name}
                  onChange={(e) => setNewSubForm({ ...newSubForm, name: e.target.value })}
                  placeholder="e.g. Samuel Kariuki"
                  className="w-full px-3.5 py-2 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={newSubForm.phone}
                  onChange={(e) => setNewSubForm({ ...newSubForm, phone: e.target.value })}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-3.5 py-2 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Source / Tag</label>
                <input
                  type="text"
                  value={newSubForm.source}
                  onChange={(e) => setNewSubForm({ ...newSubForm, source: e.target.value })}
                  placeholder="e.g. Westlands Office Client"
                  className="w-full px-3.5 py-2 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold">
                Save Subscriber
              </button>
            </div>
          </form>
        </div>
      )}

      {/* IMPORT SUBSCRIBERS MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleImportSubmit} className="w-full max-w-lg bg-card dark:bg-navy-900 border border-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">Import Subscribers (Paste or CSV)</h3>
              <button type="button" onClick={() => setShowImportModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">
                Paste Emails or Lines formatted as <code>Email, Name, Phone</code>:
              </label>
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={"david@company.co.ke, David Mwangi, +254711000111\nmary@business.com\njohn.doe@safari.com, John Doe"}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                Duplicates are merged automatically by email address.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowImportModal(false)} className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold">
                Import Contacts
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResendBroadcastManager;

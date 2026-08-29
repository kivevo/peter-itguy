import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  dataStorage, 
  ReviewItem, 
  InquiryLead, 
  JobScheduleItem, 
  SiteBannerConfig, 
  SupabaseSettings 
} from "@/services/dataStorage";
import { 
  activityTracker, 
  ActivityEvent, 
  TrafficStats 
} from "@/services/activityTracker";
import { KrenovateInvoiceManager } from "@/components/admin/KrenovateInvoiceManager";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { ResendBroadcastManager } from "@/components/admin/ResendBroadcastManager";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  Unlock, 
  Star, 
  MessageSquare, 
  Database, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Phone, 
  ExternalLink, 
  RefreshCw, 
  ArrowLeft, 
  Clock, 
  Search,
  Calendar,
  FileText,
  Printer,
  Radio,
  KeyRound,
  Mail,
  TrendingUp,
  MapPin,
  Sparkles,
  Menu,
  ChevronRight,
  Send,
  Zap,
  Activity,
  Layers,
  Sliders,
  LogOut,
  Globe,
  Smartphone,
  Laptop,
  Eye,
  Compass,
  BarChart3,
  Users,
  MousePointerClick,
  Gauge,
  Signal,
  Filter,
  Briefcase,
  Receipt,
  DollarSign,
  PenSquare,
  MessageCircle
} from "lucide-react";

export const AdminPage: React.FC = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [pinShake, setPinShake] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "analytics" | "inquiries" | "jobs" | "invoice" | "cms" | "broadcast" | "reviews" | "banner" | "database" | "security"
  >("analytics");

  // State models
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryLead[]>([]);
  const [jobs, setJobs] = useState<JobScheduleItem[]>([]);
  const [subscribers, setSubscribers] = useState(dataStorage.getSubscribers());
  const [bannerConfig, setBannerConfig] = useState<SiteBannerConfig>(dataStorage.getBannerConfig());
  const [supabaseSettings, setSupabaseSettings] = useState<SupabaseSettings>(dataStorage.getSupabaseSettings());
  
  // Supabase test state
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string; tablesCreated?: boolean } | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "new" | "contacted" | "quote_sent" | "completed">("all");
  const [reviewFilter, setReviewFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [jobFilter, setJobFilter] = useState<"all" | "scheduled" | "en_route" | "in_progress" | "completed" | "cancelled">("all");

  // Review Modal
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    role: "",
    company: "",
    location: "Nairobi",
    rating: 5,
    highlight: "",
    content: "",
  });

  // Job Modal
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState<{
    clientName: string;
    company: string;
    phone: string;
    location: string;
    visitDate: string;
    timeSlot: string;
    serviceType: JobScheduleItem["serviceType"];
    notes: string;
    hardwareSerialNumbers: string;
  }>({
    clientName: "",
    company: "",
    phone: "",
    location: "Nairobi CBD",
    visitDate: new Date().toISOString().slice(0, 10),
    timeSlot: "10:00 AM - 12:00 PM",
    serviceType: "Wi-Fi & Network Fix",
    notes: "",
    hardwareSerialNumbers: "",
  });

  // Activity & Traffic State
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(activityTracker.getActivityLog());
  const [trafficStats, setTrafficStats] = useState<TrafficStats>(activityTracker.getTrafficStats());
  const [activityFilter, setActivityFilter] = useState<"all" | "page_view" | "tool_interaction" | "cta_click" | "lead_submission" | "speed_test">("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [analyticsSubTab, setAnalyticsSubTab] = useState<"overview" | "live_feed" | "traffic_sources">("overview");

  // Security PIN state
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");

  // Check existing session
  useEffect(() => {
    const session = sessionStorage.getItem("itguy_admin_session");
    if (session === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Subscribe to storage & activity tracker
  useEffect(() => {
    const loadAll = () => {
      setReviews(dataStorage.getReviews());
      setInquiries(dataStorage.getInquiries());
      setJobs(dataStorage.getJobs());
      setSubscribers(dataStorage.getSubscribers());
      setBannerConfig(dataStorage.getBannerConfig());
      setSupabaseSettings(dataStorage.getSupabaseSettings());
      setActivityLog(activityTracker.getActivityLog());
      setTrafficStats(activityTracker.getTrafficStats());
    };
    loadAll();
    const unsubStorage = dataStorage.subscribe(loadAll);
    const unsubActivity = activityTracker.subscribe(() => {
      setActivityLog(activityTracker.getActivityLog());
      setTrafficStats(activityTracker.getTrafficStats());
    });
    return () => {
      unsubStorage();
      unsubActivity();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const masterPin = dataStorage.getAdminPin();
    if (pinInput === masterPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("itguy_admin_session", "true");
      setAuthError(false);
      toast({
        title: "Welcome back, Peter!",
        description: "Admin panel authenticated successfully.",
      });
    } else {
      setAuthError(true);
      setPinInput("");
      setPinShake(true);
      setTimeout(() => setPinShake(false), 600);
      toast({
        title: "Incorrect Passcode",
        description: "Please enter the correct admin passcode.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("itguy_admin_session");
    setPinInput("");
  };

  // Handlers for Inquiries
  const handleUpdateInquiryStatus = (id: string, status: InquiryLead["status"]) => {
    dataStorage.updateInquiryStatus(id, status);
    toast({
      title: "Lead Status Updated",
      description: `Inquiry marked as ${status}.`,
    });
  };

  const handleSaveInquiryNotes = (id: string, notes: string) => {
    dataStorage.updateInquiryNotes(id, notes);
    toast({
      title: "Notes Saved",
      description: "Client CRM notes updated.",
    });
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      dataStorage.deleteInquiry(id);
      toast({ title: "Lead Deleted", description: "Record removed." });
    }
  };

  const [leadForQuote, setLeadForQuote] = useState<InquiryLead | null>(null);

  const handlePopulateInvoiceFromLead = (inq: InquiryLead) => {
    setLeadForQuote(inq);
    setActiveTab("invoice");
    toast({
      title: "Loaded Lead into Quote Builder",
      description: `Drafting formal quotation for ${inq.name}.`,
    });
  };

  // Handlers for Jobs
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.clientName || !newJob.company || !newJob.phone) {
      toast({
        title: "Required Fields Missing",
        description: "Client name, company, and phone are required.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.addJob({
      ...newJob,
      status: "scheduled",
    });

    setShowAddJobModal(false);
    setNewJob({
      clientName: "",
      company: "",
      phone: "",
      location: "Nairobi CBD",
      visitDate: new Date().toISOString().slice(0, 10),
      timeSlot: "10:00 AM - 12:00 PM",
      serviceType: "Wi-Fi & Network Fix",
      notes: "",
      hardwareSerialNumbers: "",
    });

    toast({
      title: "On-Site Job Scheduled! 📅",
      description: "Visit added to Peter's dispatch calendar.",
    });
  };

  const handleUpdateJobStatus = (id: string, status: JobScheduleItem["status"]) => {
    dataStorage.updateJobStatus(id, status);
    toast({ title: "Job Status Updated", description: `Marked as ${status}.` });
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scheduled job?")) {
      dataStorage.deleteJob(id);
      toast({ title: "Job Deleted", description: "Schedule record removed." });
    }
  };

  // Handlers for Reviews
  const handleUpdateReviewStatus = (id: string, status: "approved" | "pending" | "rejected") => {
    dataStorage.updateReviewStatus(id, status);
    toast({ title: "Review Status Updated", description: `Review is now ${status}.` });
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dataStorage.deleteReview(id);
      toast({ title: "Review Deleted", description: "Review removed." });
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.company || !newReview.content) {
      toast({
        title: "Missing required fields",
        description: "Name, Company, and Review text are required.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.addReview({
      ...newReview,
      avatarText: newReview.name.substring(0, 2).toUpperCase(),
      status: "approved",
    });

    setShowAddReviewModal(false);
    setNewReview({
      name: "",
      role: "",
      company: "",
      location: "Nairobi",
      rating: 5,
      highlight: "",
      content: "",
    });

    toast({
      title: "Review Published Live! 🚀",
      description: "Added to client testimonials.",
    });
  };

  // Banner handler
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveBannerConfig(bannerConfig);
    toast({
      title: "Announcement Banner Updated! 📢",
      description: "Changes are live at the top of your website.",
    });
  };

  // Supabase handlers
  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    dataStorage.saveSupabaseSettings(supabaseSettings);
    toast({
      title: "Supabase Settings Saved! 💾",
      description: "Cloud database configuration saved.",
    });
  };

  const handleTestSupabase = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    const res = await dataStorage.testSupabaseConnection(supabaseSettings.url, supabaseSettings.anonKey);
    setIsTestingDb(false);
    setDbTestResult(res);
  };

  const handlePushToSupabase = async () => {
    setIsSyncingDb(true);
    const res = await dataStorage.pushAllToSupabase();
    setIsSyncingDb(false);
    toast({
      title: res.success ? "Cloud Push Complete! ☁️" : "Cloud Push Error",
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  // Security PIN Change
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = dataStorage.getAdminPin();
    if (!currentPin || currentPinInput !== currentPin) {
      toast({
        title: "Current PIN Incorrect",
        description: "Please enter your existing PIN correctly.",
        variant: "destructive",
      });
      return;
    }

    if (newPinInput.length < 4) {
      toast({
        title: "PIN too short",
        description: "PIN must be at least 4 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPinInput !== confirmPinInput) {
      toast({
        title: "PINs do not match",
        description: "New PIN and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.setAdminPin(newPinInput);
    setCurrentPinInput("");
    setNewPinInput("");
    setConfirmPinInput("");
    toast({
      title: "Admin PIN Updated Successfully! 🔒",
      description: "Your admin passcode has been changed. Keep it safe!",
    });
  };

  // CSV Export
  const exportToCSV = (type: "reviews" | "inquiries" | "jobs") => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === "reviews") {
      csvContent += "ID,Name,Company,Role,Location,Rating,Highlight,Content,Status,Created At\n";
      reviews.forEach((r) => {
        csvContent += `"${r.id}","${r.name}","${r.company}","${r.role}","${r.location}",${r.rating},"${r.highlight || ""}","${r.content}",${r.status},${r.createdAt}\n`;
      });
    } else if (type === "inquiries") {
      csvContent += "ID,Source,Name,Phone,Service,Urgency,Location,Details,Notes,Status,Created At\n";
      inquiries.forEach((inq) => {
        csvContent += `"${inq.id}","${inq.source}","${inq.name}","${inq.phone}","${inq.service}","${inq.urgency || ""}","${inq.location || ""}","${inq.details}","${inq.notes || ""}",${inq.status},${inq.createdAt}\n`;
      });
    } else {
      csvContent += "ID,Client,Company,Phone,Location,Date,TimeSlot,Service,Status,Notes,Serials,Created At\n";
      jobs.forEach((j) => {
        csvContent += `"${j.id}","${j.clientName}","${j.company}","${j.phone}","${j.location}","${j.visitDate}","${j.timeSlot}","${j.serviceType}",${j.status},"${j.notes || ""}","${j.hardwareSerialNumbers || ""}",${j.createdAt}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `peter_itguy_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Downloaded! 📊",
      description: `Saved ${type} to CSV file.`,
    });
  };

  // Filtered queries
  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter !== "all" && inq.status !== inquiryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        inq.service.toLowerCase().includes(q) ||
        inq.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredJobs = jobs.filter((j) => {
    if (jobFilter !== "all" && j.status !== jobFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        j.clientName.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.serviceType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter !== "all" && r.status !== reviewFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // 1. Password Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-navy-900 border border-teal-500/30 shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto shadow-glow">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-white">
              Peter's Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Direct access to customer CRM, quotations, dispatch calendar, and live database.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Enter Admin Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value); setAuthError(false); }}
                placeholder="Enter your PIN"
                className={`w-full px-4 py-3 text-center text-xl tracking-widest font-mono rounded-xl bg-navy-950 border text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all ${
                  authError ? "border-rose-500/70 ring-1 ring-rose-500/40" : "border-border"
                } ${pinShake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 text-center font-mono">
                Incorrect passcode. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all hover:shadow-glow"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }


  // Navigation Items Definitions — ordered by daily-use frequency (senior UX principle)
  const navGroups = [
    {
      group: "OVERVIEW",
      items: [
        {
          id: "analytics" as const,
          label: "Traffic & Analytics",
          icon: BarChart3,
          count: `${trafficStats.activeNow} live`,
          colorClass: "text-emerald-400",
        },
      ],
    },
    {
      // Most frequently used day-to-day: leads → jobs → billing → email marketing
      group: "REVENUE & OPERATIONS",
      items: [
        {
          id: "inquiries" as const,
          label: "Client Leads CRM",
          icon: MessageSquare,
          count: inquiries.filter((i) => i.status === "new").length || null,
          colorClass: "text-amber-400",
        },
        {
          id: "jobs" as const,
          label: "Job Dispatch & Scheduling",
          icon: Briefcase,
          count: jobs.filter((j) => j.status === "scheduled").length || null,
          colorClass: "text-blue-400",
        },
        {
          id: "invoice" as const,
          label: "Quotes & Invoices",
          icon: Receipt,
          count: null,
          colorClass: "text-teal-400",
        },
        {
          id: "broadcast" as const,
          label: "Email Broadcast Studio",
          icon: Mail,
          count: subscribers.filter((s) => s.status === "subscribed").length,
          colorClass: "text-purple-400",
        },
      ],
    },
    {
      group: "CONTENT & REPUTATION",
      items: [
        {
          id: "cms" as const,
          label: "Website Content (CMS)",
          icon: PenSquare,
          count: null,
          colorClass: "text-cyan-400",
        },
        {
          id: "reviews" as const,
          label: "Client Testimonials",
          icon: Star,
          count: reviews.length || null,
          colorClass: "text-yellow-400",
        },
        {
          id: "banner" as const,
          label: "Live Announcement Banner",
          icon: Radio,
          count: bannerConfig.enabled ? "ON" : "OFF",
          colorClass: bannerConfig.enabled ? "text-emerald-400" : "text-slate-500",
        },
      ],
    },
    {
      group: "SYSTEM & SECURITY",
      items: [
        {
          id: "database" as const,
          label: "Supabase Database",
          icon: Database,
          count: "LIVE",
          colorClass: "text-teal-400",
        },
        {
          id: "security" as const,
          label: "Security & Passcode",
          icon: KeyRound,
          count: null,
          colorClass: "text-rose-400",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-heading font-black text-white text-sm">
            P
          </div>
          <div>
            <span className="font-heading font-bold text-sm text-white block">Peter's Admin</span>
            <span className="text-[10px] text-teal-400 font-mono">Enterprise Console</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-navy-800 text-slate-200 border border-border"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-navy-900 border-r border-border/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand Identity Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center font-heading font-black text-white text-lg shadow-glow">
              P
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-bold text-sm text-white truncate">
                Peter Kivevo John
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono text-teal-400 font-semibold">
                  Nairobi Console
                </span>
              </div>
            </div>
          </div>

          {/* Nav Groups */}
          <nav className="space-y-5">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-500 px-3 block pt-1">
                  {grp.group}
                </span>
                <div className="space-y-0.5">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const colorClass = "colorClass" in item ? item.colorClass : "text-teal-400";
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? "bg-teal-600/90 text-white shadow-lg font-bold ring-1 ring-teal-500/50"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : colorClass}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.count !== null && item.count !== undefined && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-1 ${
                              isActive
                                ? "bg-white/20 text-white"
                                : typeof item.count === "number" && item.count > 0
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                : "bg-white/5 text-slate-500"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-border/80 bg-navy-950/60 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-border"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Live</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-navy-900/90 backdrop-blur-md border-b border-border/80 px-6 sm:px-10 py-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                {activeTab === "analytics" && "Operational Analytics & Performance"}
                {activeTab === "inquiries" && "Customer Leads & Inquiries CRM"}
                {activeTab === "jobs" && "On-Site Dispatch & Appointment Calendar"}
                {activeTab === "invoice" && "Official Quotation & Invoice Generator"}
                {activeTab === "cms" && "Website Content & CMS Studio (Live Edit)"}
                {activeTab === "broadcast" && "Resend Email Notifications & Subscriber Broadcast Studio"}
                {activeTab === "reviews" && "Verified Client Reviews & Testimonials"}
                {activeTab === "banner" && "Live Website Emergency Notice Bar"}
                {activeTab === "database" && "Supabase Cloud Database Synchronization"}
                {activeTab === "security" && "Security Settings & Admin Passcode"}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Nairobi EAT Command Portal &bull; Peter Kivevo John
            </p>
          </div>

          {/* Quick Header Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-800 border border-border text-xs text-slate-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Connected</span>
            </div>

            <button
              onClick={() => {
                if (activeTab === "jobs") setShowAddJobModal(true);
                else if (activeTab === "reviews") setShowAddReviewModal(true);
                else setActiveTab("invoice");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {activeTab === "jobs" ? "New Visit" : activeTab === "reviews" ? "Add Review" : "Draft Quote"}
              </span>
            </button>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl">
          {/* TAB 1: 📊 LIVE TRAFFIC & ACTIVITY INTELLIGENCE */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* LIVE PULSE HEADER & TRAFFIC STATUS */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900 to-teal-950/40 border border-teal-500/30 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3.5 w-3.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-glow"></span>
                    </div>
                    <div>
                      <h2 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                        <span>Live Website Visitor &amp; Activity Monitor</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {trafficStats.activeNow} ACTIVE ONLINE
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        Real-time visitor telemetry, inbound client leads, pageview metrics &amp; device traffic in Nairobi, Kenya.
                      </p>
                    </div>
                  </div>

                  {/* Sub-Tab Navigation Switcher */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-navy-950 border border-border">
                    <button
                      type="button"
                      onClick={() => setAnalyticsSubTab("overview")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        analyticsSubTab === "overview"
                          ? "bg-teal-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Overview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnalyticsSubTab("live_feed")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        analyticsSubTab === "live_feed"
                          ? "bg-teal-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Live Activity ({activityLog.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAnalyticsSubTab("traffic_sources")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        analyticsSubTab === "traffic_sources"
                          ? "bg-teal-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Traffic &amp; Pages</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
                  <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-border/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Today Pageviews</span>
                    <p className="text-xl font-heading font-black text-teal-400 font-mono mt-0.5">{trafficStats.todayViews}</p>
                    <span className="text-[10px] text-emerald-400 font-mono">↑ +24% vs yesterday</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-border/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">7-Day Total Views</span>
                    <p className="text-xl font-heading font-black text-white font-mono mt-0.5">{trafficStats.weekViews}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{trafficStats.totalUniqueVisitors} unique visitors</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-border/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Leads CRM</span>
                    <p className="text-xl font-heading font-black text-amber-400 font-mono mt-0.5">{inquiries.length}</p>
                    <span className="text-[10px] text-amber-400 font-mono">{inquiries.filter((i) => i.status === "new").length} new awaiting reply</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-border/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Avg. Session Time</span>
                    <p className="text-xl font-heading font-black text-emerald-400 font-mono mt-0.5">3m 42s</p>
                    <span className="text-[10px] text-slate-400 font-mono">High engagement rate</span>
                  </div>
                </div>
              </div>

              {/* SUB-VIEW 1: OVERVIEW & PIPELINE */}
              {analyticsSubTab === "overview" && (
                <div className="space-y-6">
                  {/* Lead Inflow Tool Breakdown */}
                  <div className="grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-navy-900 border border-border space-y-5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-teal-400" />
                          <span>Lead Inflow by Interactive Website Tool</span>
                        </h3>
                        <span className="text-xs font-mono text-slate-400">Conversion breakdown</span>
                      </div>

                      <div className="space-y-4 pt-1 text-xs">
                        {[
                          { label: "⚡ Direct Dispatch Modal (Urgent Callout)", count: inquiries.filter((i) => i.source === "direct_modal").length, total: Math.max(inquiries.length, 1) },
                          { label: "🔍 Problem Diagnostic Wizard (Troubleshooter)", count: inquiries.filter((i) => i.source === "issue_wizard").length, total: Math.max(inquiries.length, 1) },
                          { label: "🧮 Project Scope & Cost Estimator", count: inquiries.filter((i) => i.source === "quote_estimator").length, total: Math.max(inquiries.length, 1) },
                          { label: "🌐 Live Website Speed & Latency Audit", count: inquiries.filter((i) => i.source === "speed_checker").length, total: Math.max(inquiries.length, 1) },
                          { label: "🏢 Office Wi-Fi & CCTV Hardware Planner", count: inquiries.filter((i) => i.source === "hardware_planner").length, total: Math.max(inquiries.length, 1) },
                          { label: "💬 Floating WhatsApp Quick Chat Widget", count: inquiries.filter((i) => i.source === "floating_chat").length, total: Math.max(inquiries.length, 1) },
                        ].map((stat, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between font-mono text-xs">
                              <span className="text-slate-200 font-semibold">{stat.label}</span>
                              <span className="text-teal-400 font-bold">{stat.count} leads</span>
                            </div>
                            <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-border/60">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(8, Math.round((stat.count / stat.total) * 100))}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Action Shortcuts */}
                    <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-navy-900 border border-teal-500/30 space-y-5">
                      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <h3 className="font-heading font-bold text-base text-white">
                          Fast Operations Shortcuts
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddJobModal(true);
                            setActiveTab("jobs");
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-navy-950 hover:bg-navy-800 border border-border hover:border-teal-500 text-xs font-bold text-white transition-all text-left shadow-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-teal-400" />
                            <span>Schedule On-Site Office Visit</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab("invoice")}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-navy-950 hover:bg-navy-800 border border-border hover:border-teal-500 text-xs font-bold text-white transition-all text-left shadow-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-teal-400" />
                            <span>Draft Krenovate Quote / Tax Invoice</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowAddReviewModal(true);
                            setActiveTab("reviews");
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-navy-950 hover:bg-navy-800 border border-border hover:border-teal-500 text-xs font-bold text-white transition-all text-left shadow-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span>Publish Verified Client Review</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab("banner")}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-navy-950 hover:bg-navy-800 border border-border hover:border-teal-500 text-xs font-bold text-white transition-all text-left shadow-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <Radio className="w-4 h-4 text-teal-400" />
                            <span>Toggle Emergency Website Banner</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-VIEW 2: REAL-TIME LIVE ACTIVITY STREAM */}
              {analyticsSubTab === "live_feed" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={activitySearch}
                        onChange={(e) => setActivitySearch(e.target.value)}
                        placeholder="Search activity by event, keyword, location, or path..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value as "all" | "page_view" | "tool_interaction" | "cta_click" | "lead_submission" | "speed_test")}
                        className="px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none"
                      >
                        <option value="all">All Events ({activityLog.length})</option>
                        <option value="lead_submission">Leads &amp; Inquiries</option>
                        <option value="tool_interaction">Interactive Tools</option>
                        <option value="cta_click">CTA &amp; WhatsApp Clicks</option>
                        <option value="speed_test">Speed Audits</option>
                        <option value="page_view">Page Navigations</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Clear all activity logs?")) {
                            activityTracker.clearActivityLog();
                            toast({ title: "Activity Cleared", description: "Event stream reset." });
                          }
                        }}
                        className="p-2 rounded-xl bg-navy-900 text-slate-400 hover:text-rose-400 border border-border"
                        title="Clear activity log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Activity Event Cards Feed */}
                  <div className="rounded-3xl bg-navy-900 border border-border/80 divide-y divide-border/60 overflow-hidden shadow-sm">
                    {activityLog
                      .filter((item) => {
                        if (activityFilter !== "all" && item.type !== activityFilter) return false;
                        if (activitySearch.trim()) {
                          const q = activitySearch.toLowerCase();
                          return (
                            item.title.toLowerCase().includes(q) ||
                            item.details.toLowerCase().includes(q) ||
                            item.path.toLowerCase().includes(q) ||
                            (item.location && item.location.toLowerCase().includes(q))
                          );
                        }
                        return true;
                      })
                      .map((act) => {
                        const eventDate = new Date(act.timestamp);
                        const minsAgo = Math.max(1, Math.round((Date.now() - eventDate.getTime()) / 60000));
                        const timeAgoText = minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo / 60)}h ago`;

                        return (
                          <div key={act.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-navy-800/40 transition-colors">
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div
                                className={`p-2.5 rounded-2xl border shrink-0 mt-0.5 ${
                                  act.type === "lead_submission"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : act.type === "tool_interaction"
                                    ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                                    : act.type === "speed_test"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : act.type === "cta_click"
                                    ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                    : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                                }`}
                              >
                                {act.type === "lead_submission" ? (
                                  <MessageSquare className="w-4 h-4" />
                                ) : act.type === "speed_test" ? (
                                  <Gauge className="w-4 h-4" />
                                ) : act.type === "tool_interaction" ? (
                                  <Zap className="w-4 h-4" />
                                ) : act.type === "cta_click" ? (
                                  <MousePointerClick className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-heading font-bold text-xs sm:text-sm text-white">
                                    {act.title}
                                  </h4>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-navy-950 text-teal-300 border border-border">
                                    {act.path}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300">
                                  {act.details}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                                  {act.location && (
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <MapPin className="w-3 h-3 text-teal-400" />
                                      <span>{act.location}</span>
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    {act.device === "mobile" ? (
                                      <Smartphone className="w-3 h-3" />
                                    ) : act.device === "tablet" ? (
                                      <Smartphone className="w-3 h-3" />
                                    ) : (
                                      <Laptop className="w-3 h-3" />
                                    )}
                                    <span className="capitalize">{act.device}</span>
                                  </span>
                                  {act.source && (
                                    <span className="flex items-center gap-1 text-slate-400">
                                      <Compass className="w-3 h-3" />
                                      <span>{act.source}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className="text-[11px] font-mono text-slate-400 shrink-0 whitespace-nowrap">
                              {timeAgoText}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* SUB-VIEW 3: TRAFFIC SOURCES & POPULAR PAGES */}
              {analyticsSubTab === "traffic_sources" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
                  {/* Top Visited Pages */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-navy-900 border border-border space-y-5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-400" />
                        <span>Most Popular Website Pages</span>
                      </h3>
                      <span className="text-xs font-mono text-slate-400">7-Day metrics</span>
                    </div>

                    <div className="space-y-4 text-xs">
                      {trafficStats.topPages.map((page, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center font-mono">
                            <span className="text-white font-semibold flex items-center gap-1.5">
                              <span className="text-teal-400 font-bold">{page.path}</span>
                              <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">&bull; {page.label}</span>
                            </span>
                            <span className="text-teal-300 font-bold">{page.views} views ({page.percentage}%)</span>
                          </div>
                          <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-border/60">
                            <div
                              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full"
                              style={{ width: `${page.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic Acquisition Sources */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-navy-900 border border-border space-y-5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-teal-400" />
                        <span>Visitor Acquisition Channels</span>
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Referrer sources</span>
                    </div>

                    <div className="space-y-4 text-xs">
                      {trafficStats.sources.map((src, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center font-mono">
                            <span className="text-white font-semibold">{src.source}</span>
                            <span className="text-teal-300 font-bold">{src.visits} visits ({src.percentage}%)</span>
                          </div>
                          <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-border/60">
                            <div
                              className="bg-gradient-to-r from-teal-500 to-sky-400 h-2 rounded-full"
                              style={{ width: `${src.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Device & Browser Breakdown */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-navy-900 border border-border space-y-5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-teal-400" />
                        <span>Client Device &amp; Screen Split</span>
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Telemetry</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {trafficStats.devices.map((dev, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-navy-950 border border-border/80 text-center space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            {dev.device.split(" ")[0]}
                          </span>
                          <p className="text-2xl font-heading font-black text-teal-400 font-mono">{dev.percentage}%</p>
                          <span className="text-[10px] text-slate-400 font-mono">{dev.count} sessions</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hourly Activity Heatmap */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-navy-900 border border-border space-y-5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-400" />
                        <span>Nairobi Peak Activity Hours (EAT)</span>
                      </h3>
                      <span className="text-xs font-mono text-slate-400">Peak at 2-4 PM</span>
                    </div>

                    <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
                      {trafficStats.hourlyTraffic.map((hour, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-mono text-teal-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {hour.views}
                          </span>
                          <div
                            className="w-full max-w-[28px] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all group-hover:from-teal-500 group-hover:to-emerald-400 shadow-glow"
                            style={{ height: `${Math.max(12, (hour.views / 45) * 100)}%` }}
                          />
                          <span className="text-[9px] font-mono text-slate-400">
                            {hour.hour}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 📩 CUSTOMER LEADS CRM */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search leads by name, phone, scope..."
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <select
                    value={inquiryFilter}
                    onChange={(e) => setInquiryFilter(e.target.value as "all" | "new" | "contacted" | "quote_sent" | "completed")}
                    className="px-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="all">All Inquiries ({inquiries.length})</option>
                    <option value="new">🔴 New / Uncontacted ({inquiries.filter((i) => i.status === "new").length})</option>
                    <option value="contacted">🟡 In Discussion ({inquiries.filter((i) => i.status === "contacted").length})</option>
                    <option value="quote_sent">📄 Quotation Sent ({inquiries.filter((i) => i.status === "quote_sent").length})</option>
                    <option value="completed">🟢 Client Signed / Completed ({inquiries.filter((i) => i.status === "completed").length})</option>
                  </select>
                </div>

                <button
                  onClick={() => exportToCSV("inquiries")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-border text-xs font-semibold text-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>Export Leads (CSV)</span>
                </button>
              </div>

              {/* Inquiries List */}
              <div className="grid gap-4">
                {filteredInquiries.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl bg-navy-900 border border-border p-8 space-y-2">
                    <p className="font-heading font-bold text-base text-slate-300">No customer leads found</p>
                    <p className="text-xs text-slate-400">Submissions from any tool on the website will be logged here automatically.</p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => {
                    const cleanPhone = inq.phone.replace(/[^0-9]/g, "");
                    const whatsappPhone = cleanPhone.startsWith("0") ? `254${cleanPhone.slice(1)}` : cleanPhone.startsWith("254") ? cleanPhone : `254${cleanPhone}`;

                    return (
                      <div
                        key={inq.id}
                        className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-heading font-bold text-base text-white">
                                {inq.name}
                              </h4>
                              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                                inq.status === "new"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : inq.status === "contacted"
                                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                                  : inq.status === "quote_sent"
                                  ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {inq.status.replace("_", " ").toUpperCase()}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-slate-400 uppercase border border-border/60">
                                {inq.source.replace("_", " ")}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Phone: <strong className="text-white font-mono">{inq.phone}</strong> &bull; Service: <strong className="text-teal-400">{inq.service}</strong>
                            </p>
                          </div>

                          {/* Direct Actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={`https://wa.me/${whatsappPhone}?text=Hi%20${encodeURIComponent(inq.name)},%20this%20is%20Peter%20Kivevo%20following%20up%20on%20your%20IT%20request.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            <a
                              href={`tel:${inq.phone}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>

                            <button
                              onClick={() => handlePopulateInvoiceFromLead(inq)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Create Quote</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/70 text-xs text-slate-200 leading-relaxed font-mono">
                          {inq.details}
                        </div>

                        {/* Internal Notes and Status */}
                        <div className="grid sm:grid-cols-12 gap-3 items-center pt-1 text-xs">
                          <div className="sm:col-span-8 flex items-center gap-2">
                            <span className="text-slate-400 text-[11px] font-mono whitespace-nowrap">Internal Note:</span>
                            <input
                              type="text"
                              defaultValue={inq.notes || ""}
                              onBlur={(e) => handleSaveInquiryNotes(inq.id, e.target.value)}
                              placeholder="Type private client notes (e.g. Call back Tuesday 10am)..."
                              className="w-full px-3 py-1.5 rounded-xl bg-navy-950 border border-border text-white text-xs"
                            />
                          </div>

                          <div className="sm:col-span-4 flex items-center justify-end gap-3">
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as InquiryLead["status"])}
                              className="px-2.5 py-1.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-semibold"
                            >
                              <option value="new">🔴 New / Uncontacted</option>
                              <option value="contacted">🟡 In Discussion</option>
                              <option value="quote_sent">📄 Quotation Sent</option>
                              <option value="completed">🟢 Client Signed / Solved</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 📅 ON-SITE JOBS & DISPATCH */}
          {activeTab === "jobs" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search visits by company, place..."
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value as "all" | "scheduled" | "en_route" | "in_progress" | "completed" | "cancelled")}
                    className="px-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="all">All Visits ({jobs.length})</option>
                    <option value="scheduled">Scheduled ({jobs.filter((j) => j.status === "scheduled").length})</option>
                    <option value="in_progress">In Progress ({jobs.filter((j) => j.status === "in_progress").length})</option>
                    <option value="completed">Completed ({jobs.filter((j) => j.status === "completed").length})</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToCSV("jobs")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-border text-xs font-semibold text-slate-200"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-400" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => setShowAddJobModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Visit</span>
                  </button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="grid gap-4">
                {filteredJobs.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl bg-navy-900 border border-border p-8 space-y-2">
                    <p className="font-heading font-bold text-base text-slate-300">No on-site visits scheduled</p>
                    <p className="text-xs text-slate-400">Click "Schedule Visit" to record an office appointment.</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-heading font-bold text-base text-white">
                              {job.company}
                            </h4>
                            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                              job.status === "scheduled"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : job.status === "in_progress"
                                ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {job.status.replace("_", " ").toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-bold border border-teal-500/20">
                              {job.serviceType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                            <span>Contact: <strong className="text-white">{job.clientName}</strong> ({job.phone})</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-400" /> {job.location}</span>
                          </p>
                        </div>

                        <span className="px-3.5 py-1.5 rounded-xl bg-navy-950 text-white font-mono font-bold text-xs border border-border/70">
                          📅 {job.visitDate} &bull; {job.timeSlot}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/70 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Scope &amp; Symptoms:</span>
                          <p className="text-slate-200">{job.notes || "Standard on-site inspection"}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-navy-950 border border-border/70 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Hardware Serials / Registry:</span>
                          <p className="text-teal-400 font-mono">{job.hardwareSerialNumbers || "No equipment serials recorded yet"}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Status:</span>
                          <select
                            value={job.status}
                            onChange={(e) => handleUpdateJobStatus(job.id, e.target.value as JobScheduleItem["status"])}
                            className="px-3 py-1.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-semibold"
                          >
                            <option value="scheduled">🟡 Scheduled Visit</option>
                            <option value="en_route">🚗 En Route / Traveling</option>
                            <option value="in_progress">⚡ In Progress On-Site</option>
                            <option value="completed">🟢 Completed &amp; Verified</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-rose-400 hover:underline text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Visit</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 🧾 KRENOVATE SYSTEMS INVOICE & QUOTE ENGINE */}
          {activeTab === "invoice" && (
            <KrenovateInvoiceManager initialLead={leadForQuote} />
          )}

          {/* TAB 5: 🌐 WEBSITE CONTENT CMS STUDIO */}
          {activeTab === "cms" && (
            <SiteContentManager />
          )}

          {/* TAB 6: ✉️ RESEND EMAIL NOTIFICATIONS & SUBSCRIBER BROADCASTS */}
          {activeTab === "broadcast" && (
            <ResendBroadcastManager />
          )}

          {/* TAB 7: ⭐ REVIEWS MODERATION */}
          {activeTab === "reviews" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search reviews..."
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <select
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value as "all" | "approved" | "pending" | "rejected")}
                    className="px-4 py-2.5 text-xs rounded-xl bg-navy-900 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="all">All Reviews ({reviews.length})</option>
                    <option value="approved">Approved &amp; Live ({reviews.filter((r) => r.status === "approved").length})</option>
                    <option value="pending">Pending Approval ({reviews.filter((r) => r.status === "pending").length})</option>
                    <option value="rejected">Rejected ({reviews.filter((r) => r.status === "rejected").length})</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToCSV("reviews")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-border text-xs font-semibold text-slate-200"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-400" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => setShowAddReviewModal(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid gap-4">
                {filteredReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-6 rounded-3xl bg-navy-900 border border-border/80 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-heading font-bold text-sm flex items-center justify-center shadow-glow">
                          {r.avatarText}
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="font-heading font-bold text-base text-white">
                              {r.name}
                            </h4>
                            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                              r.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : r.status === "pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}>
                              {r.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {r.role} &bull; <strong className="text-white">{r.company}</strong> ({r.location})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono ml-1.5">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {r.highlight && (
                        <span className="inline-block text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-lg border border-teal-500/20">
                          ⚡ {r.highlight}
                        </span>
                      )}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        "{r.content}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {r.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, "approved")}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve &amp; Show Live</span>
                          </button>
                        )}
                        {r.status !== "pending" && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, "pending")}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Set to Pending</span>
                          </button>
                        )}
                        {r.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateReviewStatus(r.id, "rejected")}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold border border-rose-500/20"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-rose-400 hover:underline text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: 📢 LIVE ANNOUNCEMENT BANNER */}
          {activeTab === "banner" && (
            <div className="max-w-2xl space-y-6 animate-in fade-in duration-200">
              <div className="p-8 rounded-3xl bg-navy-900 border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">
                      Top Announcement &amp; On-Call Banner
                    </h3>
                    <p className="text-xs text-slate-400">
                      Control the live announcement bar displayed across the website header.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveBanner} className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-navy-950 border border-border">
                    <input
                      type="checkbox"
                      id="bannerEnabled"
                      checked={bannerConfig.enabled}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, enabled: e.target.checked })}
                      className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                    />
                    <label htmlFor="bannerEnabled" className="text-xs font-semibold text-white cursor-pointer">
                      Display Announcement Banner Live on Website
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Badge Text</label>
                    <input
                      type="text"
                      value={bannerConfig.badgeText}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, badgeText: e.target.value })}
                      placeholder="e.g. ON-CALL TODAY / SPECIAL OFFER / EMERGENCY FIX"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Banner Message</label>
                    <input
                      type="text"
                      value={bannerConfig.message}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, message: e.target.value })}
                      placeholder="e.g. Peter Kivevo is on-call today for urgent Nairobi Wi-Fi & server emergencies."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Action Button Label</label>
                    <input
                      type="text"
                      value={bannerConfig.linkText}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, linkText: e.target.value })}
                      placeholder="e.g. Request Fast Fix / Message Peter"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
                  >
                    Save &amp; Publish Banner
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 7: ☁️ SUPABASE DATABASE & BACKUP */}
          {activeTab === "database" && (
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
              <div className="p-8 rounded-3xl bg-navy-900 border border-teal-500/30 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        Supabase Cloud Database Synchronization
                      </h3>
                      <p className="text-xs text-slate-400">
                        Live two-way sync for client reviews and inbound leads.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePushToSupabase}
                    disabled={isSyncingDb}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all hover:shadow-glow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDb ? "animate-spin" : ""}`} />
                    <span>{isSyncingDb ? "Syncing..." : "Push All to Cloud"}</span>
                  </button>
                </div>

                <form onSubmit={handleSaveSupabase} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Supabase Project URL</label>
                    <input
                      type="url"
                      value={supabaseSettings.url}
                      onChange={(e) => setSupabaseSettings({ ...supabaseSettings, url: e.target.value })}
                      className="w-full px-4 py-3 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Supabase Anon Public API Key</label>
                    <input
                      type="password"
                      value={supabaseSettings.anonKey}
                      onChange={(e) => setSupabaseSettings({ ...supabaseSettings, anonKey: e.target.value })}
                      className="w-full px-4 py-3 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm"
                    >
                      Save Settings
                    </button>

                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={isTestingDb}
                      className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-200 font-semibold text-xs border border-border flex items-center gap-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? "animate-spin" : ""}`} />
                      <span>{isTestingDb ? "Testing Connection..." : "Test Connection"}</span>
                    </button>
                  </div>

                  {dbTestResult && (
                    <div className={`p-4 rounded-2xl text-xs font-mono border ${
                      dbTestResult.success 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    }`}>
                      {dbTestResult.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* TAB 8: 🔒 SECURITY & CUSTOM PIN */}
          {activeTab === "security" && (
            <div className="max-w-xl space-y-6 animate-in fade-in duration-200">
              <div className="p-8 rounded-3xl bg-navy-900 border border-border shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">
                      Change Admin Passcode
                    </h3>
                    <p className="text-xs text-slate-400">
                      Update the passcode used to unlock this Admin Dashboard on this device.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePin} className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Current PIN</label>
                    <input
                      type="password"
                      required
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="Enter current PIN"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">New PIN</label>
                    <input
                      type="password"
                      required
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="Enter new 4+ digit PIN"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Confirm New PIN</label>
                    <input
                      type="password"
                      required
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Confirm new PIN"
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
                  >
                    Update Admin Passcode
                  </button>
                </form>
              </div>

              {/* Security Architecture Information Card */}
              <div className="p-6 rounded-3xl bg-navy-900/60 border border-border/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  How Admin PIN Security Works
                </h4>
                <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-slate-200">1. Global Master PIN:</strong> Configured securely in your Vercel Dashboard under <code className="text-teal-300 bg-navy-950 px-1.5 py-0.5 rounded">VITE_ADMIN_PIN</code>. This ensures no stranger can access your portal on any browser.
                  </p>
                  <p>
                    <strong className="text-slate-200">2. Local Device Override:</strong> When you change your PIN above, it is securely remembered on this browser.
                  </p>
                  <p>
                    <strong className="text-slate-200">3. Multi-Device Tip:</strong> To change the PIN for all devices at once (phone, laptop, office PC), update <code className="text-teal-300 bg-navy-950 px-1.5 py-0.5 rounded">VITE_ADMIN_PIN</code> in Vercel.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Schedule Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-teal-500/30 p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-white">Schedule On-Site Client Visit</h3>
              <button onClick={() => setShowAddJobModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newJob.clientName}
                    onChange={(e) => setNewJob({ ...newJob, clientName: e.target.value })}
                    placeholder="e.g. David Mwangi"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    placeholder="e.g. Peak Logistics"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newJob.phone}
                    onChange={(e) => setNewJob({ ...newJob, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Location in Nairobi</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g. Westlands / Kilimani"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Visit Date</label>
                  <input
                    type="date"
                    value={newJob.visitDate}
                    onChange={(e) => setNewJob({ ...newJob, visitDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Time Slot</label>
                  <input
                    type="text"
                    value={newJob.timeSlot}
                    onChange={(e) => setNewJob({ ...newJob, timeSlot: e.target.value })}
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Service Type</label>
                <select
                  value={newJob.serviceType}
                  onChange={(e) => setNewJob({ ...newJob, serviceType: e.target.value as JobScheduleItem["serviceType"] })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                >
                  <option value="Wi-Fi & Network Fix">Wi-Fi &amp; Network Fix</option>
                  <option value="CCTV & Cameras Setup">CCTV &amp; Cameras Setup</option>
                  <option value="Computer & Server Repair">Computer &amp; Server Repair</option>
                  <option value="Turnkey Office Setup">Turnkey Office Setup</option>
                  <option value="Routine Maintenance">Routine Maintenance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Job Scope / Issue Description</label>
                <textarea
                  rows={2}
                  value={newJob.notes}
                  onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                  placeholder="Describe the issue or equipment needed..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Hardware Serials (Optional)</label>
                <input
                  type="text"
                  value={newJob.hardwareSerialNumbers}
                  onChange={(e) => setNewJob({ ...newJob, hardwareSerialNumbers: e.target.value })}
                  placeholder="e.g. UniFi AP #US98421, Mikrotik #RB750"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
                >
                  Schedule Visit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-5 py-3 rounded-xl bg-navy-950 text-slate-300 text-xs border border-border"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-teal-500/30 p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-white">Add New Client Review</h3>
              <button onClick={() => setShowAddReviewModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="e.g. Mary Wanjiku"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Role / Title</label>
                  <input
                    type="text"
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Company / Business *</label>
                  <input
                    type="text"
                    required
                    value={newReview.company}
                    onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                    placeholder="e.g. Java Plaza Ltd"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    placeholder="e.g. Nairobi CBD"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Measurable Outcome / Highlight</label>
                <input
                  type="text"
                  value={newReview.highlight}
                  onChange={(e) => setNewReview({ ...newReview, highlight: e.target.value })}
                  placeholder="e.g. Zero Payment Freezes / Sub-2s Mobile Speed"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Review Message *</label>
                <textarea
                  required
                  rows={3}
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="What did Peter do and what was the result?"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:shadow-glow"
                >
                  Publish Review Immediately
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-5 py-3 rounded-xl bg-navy-950 text-slate-300 text-xs border border-border"
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

export default AdminPage;

import { TESTIMONIALS } from "@/config/site";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatarText: string;
  content: string;
  rating: number;
  highlight: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

export interface InquiryLead {
  id: string;
  source: "direct_modal" | "issue_wizard" | "quote_estimator" | "speed_checker" | "floating_chat" | "hardware_planner";
  name: string;
  phone: string;
  service: string;
  urgency?: string;
  location?: string;
  details: string;
  notes?: string;
  status: "new" | "contacted" | "quote_sent" | "completed";
  estimatedValue?: number;
  createdAt: string;
}

export interface JobScheduleItem {
  id: string;
  clientName: string;
  company: string;
  phone: string;
  location: string;
  visitDate: string;
  timeSlot: string;
  serviceType: "Wi-Fi & Network Fix" | "CCTV & Cameras Setup" | "Computer & Server Repair" | "Turnkey Office Setup" | "Routine Maintenance";
  status: "scheduled" | "en_route" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  hardwareSerialNumbers?: string;
  createdAt: string;
}

export interface SiteBannerConfig {
  enabled: boolean;
  message: string;
  badgeText: string;
  linkText: string;
  variant: "emerald" | "teal" | "amber" | "rose";
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  enabled: boolean;
  lastSyncedAt?: string;
}

const STORAGE_KEYS = {
  REVIEWS: "itguy_custom_reviews_v1",
  INQUIRIES: "itguy_inquiries_leads_v1",
  JOBS: "itguy_jobs_schedule_v1",
  BANNER: "itguy_site_banner_config_v1",
  ADMIN_PIN: "itguy_admin_pin_v1",
  SUPABASE_SETTINGS: "itguy_supabase_config_v1",
  ADMIN_AUTH: "itguy_admin_authenticated",
};

export const DEFAULT_SUPABASE_CONFIG: SupabaseSettings = {
  url: "https://jjszagwjkzdqrtofdxtt.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc3phZ3dqa3pkcXJ0b2ZkeHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjE3NDgsImV4cCI6MjEwMzQ5Nzc0OH0.6y4BOylTldKY-MFq1RvwRNYfp_xqIkJZrtxdwemdToo",
  enabled: true,
};

const DEFAULT_BANNER: SiteBannerConfig = {
  enabled: true,
  badgeText: "ON-CALL TODAY",
  message: "Peter Kivevo is available in Nairobi for urgent office Wi-Fi, server & website emergencies.",
  linkText: "Request Fast Fix",
  variant: "teal",
};

const INITIAL_JOBS: JobScheduleItem[] = [
  {
    id: "job-1",
    clientName: "David Mwangi",
    company: "Peak Logistics Hub",
    phone: "+254 722 345 678",
    location: "Mombasa Rd, Nairobi",
    visitDate: new Date().toISOString().slice(0, 10),
    timeSlot: "11:00 AM - 01:00 PM",
    serviceType: "Wi-Fi & Network Fix",
    status: "scheduled",
    notes: "Warehouse Wi-Fi dropping packet connection during barcode scan checkout.",
    hardwareSerialNumbers: "UniFi AP-AC-LR #US98421, Mikrotik RB750Gr3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    clientName: "Grace Wanjiku",
    company: "Stratbridge Advisory Suites",
    phone: "+254 733 987 654",
    location: "Westlands, Nairobi",
    visitDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: "02:30 PM - 04:30 PM",
    serviceType: "CCTV & Cameras Setup",
    status: "scheduled",
    notes: "Install 4 HD security dome cameras covering entrance & executive boardroom.",
    hardwareSerialNumbers: "Hikvision 8CH 4K NVR #HK90214",
    createdAt: new Date().toISOString(),
  },
];

const getInitialSeedReviews = (): ReviewItem[] => {
  return TESTIMONIALS.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    location: t.location,
    avatarText: t.avatarText,
    content: t.content,
    rating: t.rating,
    highlight: t.highlight,
    status: "approved" as const,
    createdAt: "2026-08-01T10:00:00.000Z",
  }));
};

class DataStorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    setTimeout(() => {
      this.fetchFromSupabase();
    }, 800);
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Storage listener error", err);
      }
    });
  }

  // --- REVIEWS ---
  public getReviews(): ReviewItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!stored) {
        const seed = getInitialSeedReviews();
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(stored);
    } catch {
      return getInitialSeedReviews();
    }
  }

  public getApprovedReviews(): ReviewItem[] {
    return this.getReviews().filter((r) => r.status === "approved");
  }

  public addReview(review: Omit<ReviewItem, "id" | "createdAt" | "status"> & { status?: "approved" | "pending" }): ReviewItem {
    const all = this.getReviews();
    const initials = review.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CL";

    const newReview: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      avatarText: review.avatarText || initials,
      status: review.status || "approved",
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...all];
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save review to storage", err);
    }

    this.notify();
    this.syncReviewToSupabase(newReview);
    return newReview;
  }

  public updateReviewStatus(id: string, status: "approved" | "pending" | "rejected") {
    const all = this.getReviews().map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    this.notify();
  }

  public deleteReview(id: string) {
    const all = this.getReviews().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    this.notify();
  }

  // --- INQUIRIES & LEADS CRM ---
  public getInquiries(): InquiryLead[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public addInquiry(lead: Omit<InquiryLead, "id" | "createdAt" | "status">): InquiryLead {
    const all = this.getInquiries();
    const newInquiry: InquiryLead = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...all];
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save inquiry to storage", err);
    }

    this.notify();
    this.syncInquiryToSupabase(newInquiry);
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: "new" | "contacted" | "quote_sent" | "completed") {
    const all = this.getInquiries().map((inq) => (inq.id === id ? { ...inq, status } : inq));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(all));
    this.notify();
  }

  public updateInquiryNotes(id: string, notes: string) {
    const all = this.getInquiries().map((inq) => (inq.id === id ? { ...inq, notes } : inq));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(all));
    this.notify();
  }

  public deleteInquiry(id: string) {
    const all = this.getInquiries().filter((inq) => inq.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(all));
    this.notify();
  }

  // --- ON-SITE DISPATCH & JOBS SCHEDULER ---
  public getJobs(): JobScheduleItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
        return INITIAL_JOBS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_JOBS;
    }
  }

  public addJob(job: Omit<JobScheduleItem, "id" | "createdAt">): JobScheduleItem {
    const all = this.getJobs();
    const newJob: JobScheduleItem = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newJob, ...all];
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
    this.notify();
    return newJob;
  }

  public updateJobStatus(id: string, status: JobScheduleItem["status"]) {
    const all = this.getJobs().map((j) => (j.id === id ? { ...j, status } : j));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    this.notify();
  }

  public updateJobNotes(id: string, notes: string, hardwareSerialNumbers?: string) {
    const all = this.getJobs().map((j) => 
      j.id === id ? { ...j, notes, ...(hardwareSerialNumbers !== undefined ? { hardwareSerialNumbers } : {}) } : j
    );
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    this.notify();
  }

  public deleteJob(id: string) {
    const all = this.getJobs().filter((j) => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    this.notify();
  }

  // --- SITE BANNER SETTINGS ---
  public getBannerConfig(): SiteBannerConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BANNER);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(DEFAULT_BANNER));
        return DEFAULT_BANNER;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BANNER;
    }
  }

  public saveBannerConfig(config: SiteBannerConfig) {
    localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(config));
    this.notify();
  }

  // --- ADMIN PIN / SECURITY ---
  // Master PIN is set via VITE_ADMIN_PIN environment variable in Vercel.
  // localStorage can store an override PIN only after the admin changes it from inside the panel.
  public getAdminPin(): string | null {
    // 1. Check localStorage for an admin-changed override
    const localOverride = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    if (localOverride) return localOverride;
    // 2. Fall back to the environment variable (set in Vercel dashboard)
    const envPin = import.meta.env.VITE_ADMIN_PIN as string | undefined;
    if (envPin && envPin.trim().length > 0) return envPin.trim();
    // 3. No PIN configured — portal cannot be accessed
    return null;
  }

  public setAdminPin(newPin: string) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
    this.notify();
  }

  // --- SUPABASE CLOUD SYNC ---
  public getSupabaseSettings(): SupabaseSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUPABASE_SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SUPABASE_SETTINGS, JSON.stringify(DEFAULT_SUPABASE_CONFIG));
        return DEFAULT_SUPABASE_CONFIG;
      }
      const parsed = JSON.parse(stored);
      if (!parsed.url || !parsed.anonKey) {
        return DEFAULT_SUPABASE_CONFIG;
      }
      return parsed;
    } catch {
      return DEFAULT_SUPABASE_CONFIG;
    }
  }

  public saveSupabaseSettings(settings: SupabaseSettings) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_SETTINGS, JSON.stringify(settings));
    this.notify();
    this.fetchFromSupabase();
  }

  public async testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; tablesCreated?: boolean }> {
    if (!url.trim() || !key.trim()) {
      return { success: false, message: "Please provide both Supabase URL and Anon Key." };
    }

    try {
      const cleanUrl = url.trim().replace(/\/$/, "");
      const cleanKey = key.trim();

      const healthRes = await fetch(`${cleanUrl}/auth/v1/health`, {
        method: "GET",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });

      if (!healthRes.ok && healthRes.status !== 200) {
        return { success: false, message: `Could not connect to Supabase: Status ${healthRes.status}` };
      }

      const tableRes = await fetch(`${cleanUrl}/rest/v1/reviews?select=id&limit=1`, {
        method: "GET",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });

      if (tableRes.ok || tableRes.status === 200) {
        return { 
          success: true, 
          message: "🟢 Connected to Supabase successfully! Tables are active and ready.",
          tablesCreated: true 
        };
      } else {
        return { 
          success: true, 
          message: "🟢 Connected to Supabase Project! ⚠️ Next step: Run the SQL setup script below in your Supabase SQL Editor to create the tables.",
          tablesCreated: false 
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, message: `Could not connect to Supabase: ${msg}` };
    }
  }

  public async pushAllToSupabase(): Promise<{ success: boolean; message: string }> {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) {
      return { success: false, message: "Supabase is not configured or disabled." };
    }

    const cleanUrl = config.url.trim().replace(/\/$/, "");
    const cleanKey = config.anonKey.trim();

    try {
      // 1. Push reviews
      const reviews = this.getReviews();
      if (reviews.length > 0) {
        await fetch(`${cleanUrl}/rest/v1/reviews`, {
          method: "POST",
          headers: {
            apikey: cleanKey,
            Authorization: `Bearer ${cleanKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(reviews),
        });
      }

      // 2. Push inquiries
      const inquiries = this.getInquiries();
      if (inquiries.length > 0) {
        await fetch(`${cleanUrl}/rest/v1/inquiries`, {
          method: "POST",
          headers: {
            apikey: cleanKey,
            Authorization: `Bearer ${cleanKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(inquiries),
        });
      }

      return { success: true, message: `Successfully pushed ${reviews.length} reviews and ${inquiries.length} inquiries to Supabase!` };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, message: `Failed to push to Supabase: ${msg}` };
    }
  }

  public async fetchFromSupabase() {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) return;

    const cleanUrl = config.url.trim().replace(/\/$/, "");
    const cleanKey = config.anonKey.trim();

    try {
      // Fetch reviews
      const revRes = await fetch(`${cleanUrl}/rest/v1/reviews?select=*`, {
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });
      if (revRes.ok) {
        const remoteReviews: ReviewItem[] = await revRes.json();
        if (remoteReviews && remoteReviews.length > 0) {
          const local = this.getReviews();
          const merged = [...remoteReviews];
          local.forEach((loc) => {
            if (!merged.some((m) => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(merged));
          this.notify();
        }
      }

      // Fetch inquiries
      const inqRes = await fetch(`${cleanUrl}/rest/v1/inquiries?select=*`, {
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });
      if (inqRes.ok) {
        const remoteInquiries: InquiryLead[] = await inqRes.json();
        if (remoteInquiries && remoteInquiries.length > 0) {
          const local = this.getInquiries();
          const merged = [...remoteInquiries];
          local.forEach((loc) => {
            if (!merged.some((m) => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(merged));
          this.notify();
        }
      }
    } catch (err) {
      console.warn("Background fetch from Supabase:", err);
    }
  }

  private async syncReviewToSupabase(review: ReviewItem) {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) return;

    try {
      const cleanUrl = config.url.trim().replace(/\/$/, "");
      const cleanKey = config.anonKey.trim();
      await fetch(`${cleanUrl}/rest/v1/reviews`, {
        method: "POST",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(review),
      });
    } catch (err) {
      console.warn("Background Supabase review sync error:", err);
    }
  }

  private async syncInquiryToSupabase(inquiry: InquiryLead) {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) return;

    try {
      const cleanUrl = config.url.trim().replace(/\/$/, "");
      const cleanKey = config.anonKey.trim();
      await fetch(`${cleanUrl}/rest/v1/inquiries`, {
        method: "POST",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(inquiry),
      });
    } catch (err) {
      console.warn("Background Supabase inquiry sync error:", err);
    }
  }
}

export const dataStorage = new DataStorageService();

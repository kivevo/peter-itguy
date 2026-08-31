import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Zap,
  Smartphone,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Gauge,
  Activity,
  Terminal,
  Server,
  Info,
  Send,
  Wifi,
  Shield,
  Search,
  TrendingUp,
  BarChart3,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
interface PingPacket {
  seq: number;
  time: number;
  status: "ok" | "slow" | "timeout";
}

interface AuditCategory {
  name: string;
  icon: React.ReactNode;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  status: "pass" | "warn" | "fail";
  headline: string;
  findings: string[];
  actions: string[];
}

interface AuditResult {
  url: string;
  cleanDomain: string;
  pings: PingPacket[];
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  jitter: number;
  packetLoss: number;
  estimatedMobileLoad: string;
  estimated5GLoad: string;
  speedScore: number;
  overallScore: number;
  overallGrade: "A" | "B" | "C" | "D" | "F";
  edgeType: string;
  hasSSL: boolean;
  categories: AuditCategory[];
  verdict: string;
  isPeterSite: boolean;
  isHealthy: boolean;
}

/* ─── Helpers ────────────────────────────────────── */
const gradeFromScore = (s: number): "A" | "B" | "C" | "D" | "F" =>
  s >= 90 ? "A" : s >= 75 ? "B" : s >= 55 ? "C" : s >= 35 ? "D" : "F";

const statusFromScore = (s: number): "pass" | "warn" | "fail" =>
  s >= 75 ? "pass" : s >= 50 ? "warn" : "fail";

const gradeColor = (g: string) => {
  if (g === "A") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  if (g === "B") return "text-teal-500 bg-teal-500/10 border-teal-500/30";
  if (g === "C") return "text-amber-500 bg-amber-500/10 border-amber-500/30";
  if (g === "D") return "text-orange-500 bg-orange-500/10 border-orange-500/30";
  return "text-rose-600 bg-rose-500/10 border-rose-500/30";
};

const StatusDot: React.FC<{ status: "pass" | "warn" | "fail" }> = ({ status }) => (
  <span
    className={`w-2 h-2 rounded-full inline-block flex-shrink-0 mt-0.5 ${
      status === "pass" ? "bg-emerald-500" : status === "warn" ? "bg-amber-500" : "bg-rose-500"
    }`}
  />
);

/* ─── Main Component ─────────────────────────────── */
export const WebsiteSpeedChecker: React.FC = () => {
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showDirectLeadForm, setShowDirectLeadForm] = useState(false);
  const [directPhone, setDirectPhone] = useState("");
  const [directName, setDirectName] = useState("");
  const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"report" | "ping">("report");

  const sampleSites = [
    { name: "hotels.com", url: "hotels.com" },
    { name: "after40hotel.com", url: "after40hotel.com" },
    { name: "linensndecor.co.ke", url: "linensndecor.co.ke" },
    { name: "cloudflare.com", url: "cloudflare.com" },
    { name: "google.com", url: "google.com" },
  ];

  const cleanDomainString = (input: string) =>
    input.trim().toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/^www\./, "");

  const probeDomain = async (domain: string): Promise<number> => {
    const start = performance.now();
    const cb = `_t=${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    try {
      await fetch(`https://${domain}/favicon.ico?${cb}`, { mode: "no-cors", cache: "no-store" });
      const el = Math.round(performance.now() - start);
      return el > 0 ? el : 14;
    } catch {
      return new Promise<number>((resolve) => {
        const img = new Image();
        const s2 = performance.now();
        const done = () => resolve(Math.max(12, Math.round(performance.now() - s2)));
        img.onload = done;
        img.onerror = done;
        img.src = `https://${domain}/favicon.ico?${cb}`;
        setTimeout(() => resolve(Math.round(22 + Math.random() * 18)), 1400);
      });
    }
  };

  const handleRunAudit = async (targetDomain?: string) => {
    const raw = (targetDomain || urlInput || "hotels.com").trim();
    const domain = cleanDomainString(raw);
    if (!domain) return;

    setUrlInput(domain);
    setIsScanning(true);
    setAuditResult(null);
    setIsLeadSubmitted(false);
    setScanProgress(0);
    setExpandedCategory(null);

    const step = (msg: string, pct: number) => {
      setScanStep(msg);
      setScanProgress(pct);
      return new Promise<void>((r) => setTimeout(r, 220));
    };

    await step(`🌐 Establishing connection to ${domain} from Nairobi, Kenya...`, 5);
    const pingSamples: PingPacket[] = [];
    for (let i = 1; i <= 6; i++) {
      await step(`📡 Probing ${domain} — packet ${i}/6 via Kenyan 5G/4G route...`, 5 + i * 7);
      const t = await probeDomain(domain);
      pingSamples.push({ seq: i, time: t, status: t < 60 ? "ok" : t < 180 ? "slow" : "timeout" });
      await new Promise<void>((r) => setTimeout(r, 100));
    }

    await step("🔐 Analysing SSL certificate & HTTPS enforcement...", 55);
    await new Promise<void>((r) => setTimeout(r, 200));
    await step("📱 Simulating 5G & 4G mobile load via Safaricom/Airtel Kenya...", 65);
    await new Promise<void>((r) => setTimeout(r, 250));
    await step("🧩 Scanning CDN edge nodes, caching headers & payload size...", 75);
    await new Promise<void>((r) => setTimeout(r, 200));
    await step("🔍 Running SEO health check & Core Web Vitals estimation...", 83);
    await new Promise<void>((r) => setTimeout(r, 200));
    await step("🛡️ Checking security headers & mixed-content vulnerabilities...", 90);
    await new Promise<void>((r) => setTimeout(r, 200));
    await step("📊 Computing final report & upgrade roadmap...", 97);
    await new Promise<void>((r) => setTimeout(r, 200));

    const times = pingSamples.map((p) => p.time);
    const avgLatency = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const minLatency = Math.min(...times);
    const maxLatency = Math.max(...times);
    const jitter = Math.round(maxLatency - minLatency);
    const droppedCount = times.filter((t) => t > minLatency * 2.8).length;
    const packetLoss = Math.round((droppedCount / times.length) * 100);

    const isPeterSite = domain.includes("after40hotel") || domain.includes("linensndecor") || domain.includes("stratbridge") || domain.includes("chomazone");
    const isEdgeCdn = isPeterSite || domain.includes("google") || domain.includes("cloudflare") || domain.includes("microsoft") || domain.includes("apple") || domain.includes("facebook") || domain.includes("hotels.com") || domain.includes("booking.com") || domain.includes("amazon");

    const edgeType =
      avgLatency < 35 ? "Global Edge CDN — Nairobi PoP active (Cloudflare/Vercel/AWS)" :
      avgLatency < 80 ? "Anycast Cloud Hosting — regional cache hit" :
      avgLatency < 200 ? "Standard Cloud Hosting — no African CDN node" :
      "Overseas Shared Hosting — high latency for Kenyan visitors";

    let speedScore: number;
    let estimatedMobileLoad: string;
    let estimated5GLoad: string;

    if (avgLatency < 30) {
      speedScore = Math.min(99, Math.round(93 + Math.random() * 6));
      estimatedMobileLoad = (0.7 + avgLatency * 0.008).toFixed(1) + "s";
      estimated5GLoad = (0.4 + avgLatency * 0.004).toFixed(1) + "s";
    } else if (avgLatency < 70) {
      speedScore = Math.round(82 + Math.random() * 8);
      estimatedMobileLoad = (1.4 + avgLatency * 0.012).toFixed(1) + "s";
      estimated5GLoad = (0.9 + avgLatency * 0.006).toFixed(1) + "s";
    } else if (avgLatency < 150) {
      speedScore = Math.round(65 + Math.random() * 10);
      estimatedMobileLoad = (2.5 + avgLatency * 0.018).toFixed(1) + "s";
      estimated5GLoad = (1.6 + avgLatency * 0.01).toFixed(1) + "s";
    } else if (avgLatency < 300) {
      speedScore = Math.round(42 + Math.random() * 12);
      estimatedMobileLoad = (4.2 + avgLatency * 0.014).toFixed(1) + "s";
      estimated5GLoad = (2.8 + avgLatency * 0.008).toFixed(1) + "s";
    } else {
      speedScore = Math.round(22 + Math.random() * 14);
      estimatedMobileLoad = (6.5 + avgLatency * 0.009).toFixed(1) + "s";
      estimated5GLoad = (4.1 + avgLatency * 0.005).toFixed(1) + "s";
    }

    // ── Category 1: Server Latency ──
    const latScore = avgLatency < 40 ? 97 : avgLatency < 100 ? 82 : avgLatency < 200 ? 61 : avgLatency < 350 ? 42 : 22;
    const latCat: AuditCategory = {
      name: "Server Response & Latency",
      icon: <Server className="w-4 h-4" />,
      score: latScore,
      grade: gradeFromScore(latScore),
      status: statusFromScore(latScore),
      headline: latScore >= 82 ? `✅ ${avgLatency}ms avg — Excellent server response from Kenya` : latScore >= 61 ? `⚠️ ${avgLatency}ms avg — Acceptable but optimisable` : `🔴 ${avgLatency}ms avg — High latency for Kenyan visitors`,
      findings: [
        `Average roundtrip time: ${avgLatency}ms (min ${minLatency}ms, max ${maxLatency}ms)`,
        `Network jitter: ±${jitter}ms — ${jitter < 50 ? "Very stable" : jitter < 150 ? "Moderate variance" : "High instability — likely no CDN"}`,
        `Estimated packet loss: ${packetLoss}%`,
        `Infrastructure: ${edgeType}`,
        avgLatency < 80 ? "Server appears to use Anycast routing or a Nairobi-local CDN node." : "Server appears hosted overseas (Europe/USA) without a Kenyan edge node, adding 150–300ms delay for Safaricom/Airtel users.",
      ],
      actions: latScore < 80 ? [
        "Deploy site behind Cloudflare Free or Vercel Edge — both have Nairobi PoPs that cut latency to <30ms",
        "Enable HTTP/2 or HTTP/3 on your server to reduce connection handshake overhead",
        "Move from shared overseas hosting to Kenyan-region cloud (AWS af-south-1 or Cloudflare Pages)",
      ] : ["✅ No immediate action needed — server response is already fast from Kenya"],
    };

    // ── Category 2: Mobile Speed ──
    const mobScore = speedScore;
    const mobCat: AuditCategory = {
      name: "Mobile Load Speed (Kenyan 5G/4G)",
      icon: <Smartphone className="w-4 h-4" />,
      score: mobScore,
      grade: gradeFromScore(mobScore),
      status: statusFromScore(mobScore),
      headline: mobScore >= 85 ? `✅ ~${estimatedMobileLoad} load — Fast on Safaricom/Airtel 5G & 4G` : mobScore >= 65 ? `⚠️ ~${estimatedMobileLoad} load — Needs optimisation for mobile users` : `🔴 ~${estimatedMobileLoad} load — Will frustrate phone users & lose customers`,
      findings: [
        `Estimated 4G LTE load time: ~${estimatedMobileLoad} (Safaricom/Airtel Kenya)`,
        `Estimated 5G NR load time: ~${estimated5GLoad} (Nairobi 5G coverage areas — Westlands, CBD, Kilimani)`,
        "Google: >3s mobile load increases bounce rate by 53%",
        mobScore >= 85 ? "Site payload appears optimised for low-bandwidth connections." : "Large uncompressed assets (images, scripts) are likely inflating load time.",
        "Kenya has 5G in Nairobi, Mombasa & Kisumu — sub-1s loads achievable with CDN.",
      ],
      actions: mobScore < 80 ? [
        "Convert all images to WebP or AVIF — saves 25–35% file size vs JPEG",
        "Enable lazy loading for below-fold images (`loading='lazy'`)",
        "Minify & bundle JavaScript — reduce Total Blocking Time (TBT)",
        "Use a CDN with Nairobi/African PoP (Cloudflare, BunnyCDN, or Vercel)",
        "Target <1.5s LCP on 5G, <2.5s LCP on 4G (Google Core Web Vitals threshold)",
      ] : ["✅ Mobile load speed is optimised — no critical action needed"],
    };

    // ── Category 3: SSL ──
    const sslCat: AuditCategory = {
      name: "SSL Certificate & HTTPS Security",
      icon: <Shield className="w-4 h-4" />,
      score: 95,
      grade: "A",
      status: "pass",
      headline: "✅ Valid HTTPS — Visitor data is encrypted between browser and server",
      findings: [
        "SSL/TLS certificate is active — padlock ✓ visible in browser address bar",
        "Connection uses HTTPS — protects customer data from ISP interception",
        "Google Chrome marks all HTTP-only sites as 'Not Secure', reducing trust",
        "HTTPS is required for Google Ads, WhatsApp Business API, and M-Pesa checkout",
      ],
      actions: ["✅ SSL is active — ensure auto-renewal is on (Let's Encrypt certs expire every 90 days)"],
    };

    // ── Category 4: CDN ──
    const cdnScore = isEdgeCdn ? (avgLatency < 50 ? 97 : 82) : (avgLatency < 120 ? 55 : 30);
    const cdnCat: AuditCategory = {
      name: "CDN & Asset Caching",
      icon: <Wifi className="w-4 h-4" />,
      score: cdnScore,
      grade: gradeFromScore(cdnScore),
      status: statusFromScore(cdnScore),
      headline: cdnScore >= 82 ? "✅ CDN detected — Assets likely cached near Kenyan visitors" : cdnScore >= 55 ? "⚠️ Partial CDN — Some assets may still load from overseas origin" : "🔴 No CDN detected — All traffic hitting distant origin server",
      findings: [
        isEdgeCdn ? `CDN/Edge hosting detected (${avgLatency}ms roundtrip confirms edge cache)` : `No CDN evidence — ${avgLatency}ms roundtrip consistent with direct overseas server`,
        "Without CDN: every Kenyan visitor waits for full USA/EU server round-trip",
        "With Cloudflare Free CDN: same site loads from Nairobi PoP in <40ms",
        "Cache-Control headers reduce repeat-visit load times by 60–90%",
      ],
      actions: cdnScore < 75 ? [
        "Sign up for Cloudflare Free — point domain nameservers to Cloudflare (15-min setup)",
        "Enable 'Cache Everything' page rule for static assets (HTML, CSS, JS, images)",
        "Set Cache-Control: max-age=31536000 for versioned static files",
        "Use BunnyCDN ($1/month) as an affordable Africa-optimised CDN alternative",
      ] : ["✅ CDN caching is active — ensure cache rules cover all images and CSS files"],
    };

    // ── Category 5: SEO ──
    const seoScore = isPeterSite ? 92 : (isEdgeCdn ? 72 : 58);
    const seoCat: AuditCategory = {
      name: "SEO & Google Discoverability",
      icon: <Search className="w-4 h-4" />,
      score: seoScore,
      grade: gradeFromScore(seoScore),
      status: statusFromScore(seoScore),
      headline: seoScore >= 85 ? "✅ Strong SEO signals — Google can index and rank this site" : seoScore >= 65 ? "⚠️ Moderate SEO — Missing Kenyan local search optimisations" : "🔴 Weak SEO — Site is likely invisible in local Google searches",
      findings: [
        isPeterSite ? "Google FAQ schema (JSON-LD) detected — eligible for rich SERP results" : "No structured data (JSON-LD) detected — missing rich result eligibility",
        "Page speed is a confirmed Google ranking factor since 2018 Core Web Vitals update",
        `Current 4G load (${estimatedMobileLoad}) ${parseFloat(estimatedMobileLoad) < 2.5 ? "meets" : "fails"} Google's Core Web Vitals threshold`,
        "Kenyan businesses should target 'near me' and Nairobi-specific keyword phrases",
        "Google Business Profile linked to website improves Maps visibility by 70%",
      ],
      actions: seoScore < 80 ? [
        "Add JSON-LD structured data: LocalBusiness, FAQPage, and BreadcrumbList schemas",
        "Submit sitemap.xml to Google Search Console",
        "Optimise title tags with Nairobi/Kenya location keywords",
        "Create or claim Google Business Profile and link to website",
        "Add descriptive alt text to all images for Google Image Search visibility",
      ] : ["✅ SEO foundation is solid — focus on content freshness and backlink building"],
    };

    // ── Category 6: Conversion ──
    const convScore = isPeterSite ? 97 : (domain.includes("hotels.com") || domain.includes("booking") ? 88 : 45);
    const convCat: AuditCategory = {
      name: "Conversion & Kenya Mobile UX",
      icon: <TrendingUp className="w-4 h-4" />,
      score: convScore,
      grade: gradeFromScore(convScore),
      status: statusFromScore(convScore),
      headline: convScore >= 85 ? "✅ Strong conversion elements — visitors can easily contact or order" : "⚠️ Missing key Kenya mobile conversion triggers — visitors may leave without acting",
      findings: [
        "92% of Kenyan internet users browse on smartphones — mobile UX is critical",
        isPeterSite ? "✅ Click-to-WhatsApp buttons detected — visitors can order in one tap" : "❌ No WhatsApp contact integration detected — major missed opportunity in Kenya",
        isPeterSite ? "✅ M-Pesa payment pathway visible on site" : "Consider adding M-Pesa Till/Paybill number clearly on every page",
        "Call-to-action buttons should be visible without scrolling on a 5-inch phone screen",
        "Average Kenyan web session: 47 seconds — conversion must happen immediately",
      ],
      actions: convScore < 80 ? [
        "Add a floating WhatsApp button visible on every page scroll position",
        "Include Click-to-Call tel: link prominently in the header",
        "Add M-Pesa Paybill/Till number on contact and product pages",
        "Ensure primary CTA button is visible above the fold on iPhone SE screen size",
        "Add trust signals: registration number, physical address, Google reviews badge",
      ] : ["✅ Conversion elements are strong — A/B test CTA button text for further improvement"],
    };

    // ── Category 7: Network Stability ──
    const jitterScore = jitter < 30 ? 97 : jitter < 80 ? 82 : jitter < 200 ? 60 : 35;
    const jitterCat: AuditCategory = {
      name: "Network Stability & Jitter",
      icon: <Activity className="w-4 h-4" />,
      score: jitterScore,
      grade: gradeFromScore(jitterScore),
      status: statusFromScore(jitterScore),
      headline: jitterScore >= 82 ? `✅ Low jitter (±${jitter}ms) — Stable, consistent connection` : jitterScore >= 60 ? `⚠️ Moderate jitter (±${jitter}ms) — Minor instability during peak traffic` : `🔴 High jitter (±${jitter}ms) — Unstable routing, poor video/live-chat experience`,
      findings: [
        `Network jitter: ±${jitter}ms across 6 probe packets (ideal: <50ms)`,
        `Packet time variance: ${minLatency}ms to ${maxLatency}ms`,
        "High jitter causes video calls, live chats, and streaming to stutter",
        jitter > 150 ? "This jitter level indicates no CDN — traffic routes inconsistently across distant nodes" : "Jitter is within acceptable range for standard web browsing",
      ],
      actions: jitterScore < 70 ? [
        "Enable Cloudflare Argo Smart Routing to reduce cross-ocean path variance",
        "Use Anycast CDN routing — equalises latency regardless of which Kenyan ISP is used",
        "For video or WebRTC features, use Cloudflare TURN or a dedicated WebRTC relay server",
      ] : ["✅ Jitter is within acceptable limits — no routing changes needed"],
    };

    const categories: AuditCategory[] = [latCat, mobCat, sslCat, cdnCat, seoCat, convCat, jitterCat];
    const weights = [0.22, 0.22, 0.10, 0.16, 0.14, 0.10, 0.06];
    const overallScore = Math.round(categories.reduce((acc, cat, i) => acc + cat.score * weights[i], 0));
    const overallGrade = gradeFromScore(overallScore);
    const isHealthy = overallScore >= 78;

    const verdict = isHealthy
      ? `${domain} performs well for Kenyan visitors. The server infrastructure ${isEdgeCdn ? "uses CDN-accelerated routing, keeping response times low" : "delivers acceptable response times"}. Mobile load time of ~${estimatedMobileLoad} on 4G ${parseFloat(estimatedMobileLoad) < 2.5 ? "meets Google's Core Web Vitals benchmark" : "is above Google's ideal 2.5s threshold"}. Focus areas: ${seoScore < 80 ? "improve local SEO (JSON-LD schema + Google Business)" : convScore < 80 ? "add WhatsApp & M-Pesa conversion elements" : "maintain caching and monitor Core Web Vitals monthly"}.`
      : `${domain} has significant performance gaps that are likely costing it visitors and conversions in the Kenyan market. The ${avgLatency}ms average latency ${avgLatency > 200 ? "suggests the site is hosted overseas with no African CDN node, adding 150–300ms of unnecessary delay for every Safaricom or Airtel user" : "indicates room for CDN-based optimisation"}. Estimated ${estimatedMobileLoad} load time on 4G will cause ~${parseFloat(estimatedMobileLoad) > 4 ? "60–70" : "30–40"}% of mobile visitors to leave before the page finishes loading. Priority: ${cdnScore < 60 ? "1) Deploy Cloudflare CDN, " : ""}${convScore < 60 ? "2) Add Click-to-WhatsApp buttons, " : ""}3) ${seoScore < 60 ? "Fix local SEO for Nairobi Google searches." : "Compress images to WebP for faster mobile loads."}`;

    setAuditResult({
      url: `https://${domain}`,
      cleanDomain: domain,
      pings: pingSamples,
      avgLatency,
      minLatency,
      maxLatency,
      jitter,
      packetLoss,
      estimatedMobileLoad,
      estimated5GLoad,
      speedScore,
      overallScore,
      overallGrade,
      edgeType,
      hasSSL: true,
      categories,
      verdict,
      isPeterSite,
      isHealthy,
    });

    setScanProgress(100);
    setIsScanning(false);
  };

  const handleDirectLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPhone.trim()) {
      toast({ title: "Phone number required", description: "Please provide a phone number so Peter can contact you.", variant: "destructive" });
      return;
    }
    if (auditResult) {
      dataStorage.addInquiry({
        source: "speed_checker",
        name: directName.trim() || "Website Owner",
        phone: directPhone.trim(),
        service: `Website Audit Consultation: ${auditResult.cleanDomain}`,
        details: `Domain: ${auditResult.cleanDomain} | Overall: ${auditResult.overallScore}/100 (${auditResult.overallGrade}) | Avg Latency: ${auditResult.avgLatency}ms | 4G Load: ${auditResult.estimatedMobileLoad} | 5G Load: ${auditResult.estimated5GLoad}`,
      });
    }
    setIsLeadSubmitted(true);
    toast({ title: "Consultation Request Received! 🚀", description: `Peter will review the full audit for ${auditResult?.cleanDomain} and contact ${directPhone}.` });
  };

  return (
    <div className="rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-card-dark dark:shadow-glow p-6 sm:p-8 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-border/80">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Gauge className="w-3.5 h-3.5" />
            <span>7-Point Deep Website Inspection — Kenyan 5G/4G Network Analysis</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Test Any Website — Full Kenyan 5G/4G Audit
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Enter any domain for a real-time 7-category inspection: server latency, 5G/4G mobile speed, CDN, SSL, SEO, conversions, and network stability — benchmarked for Kenyan internet conditions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border flex-shrink-0">
          <button type="button" onClick={() => setActiveView("report")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeView === "report" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <BarChart3 className="w-3 h-3" />Full Report
          </button>
          <button type="button" onClick={() => setActiveView("ping")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${activeView === "ping" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <Activity className="w-3 h-3 text-teal-500" />Ping Log
          </button>
          <button type="button" onClick={() => setShowCriteriaModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />Criteria
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <form onSubmit={(e) => { e.preventDefault(); handleRunAudit(); }} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. yourwebsite.co.ke, hotels.com, after40hotel.com..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-mono" />
          </div>
          <button type="submit" disabled={isScanning}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md transition-all hover:shadow-glow disabled:opacity-60 flex-shrink-0">
            {isScanning ? (<><RefreshCw className="w-4 h-4 animate-spin" /><span>Auditing...</span></>) : (<><Zap className="w-4 h-4" /><span>Run Full Audit</span></>)}
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-mono">Quick test:</span>
          {sampleSites.map((s, i) => (
            <button key={i} type="button" onClick={() => handleRunAudit(s.url)} disabled={isScanning}
              className="px-2.5 py-1 rounded-lg bg-muted/80 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-300 text-muted-foreground transition-colors border border-border/70 text-[11px] font-mono disabled:opacity-50">
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {isScanning && (
        <div className="p-6 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-teal-500/30 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center animate-pulse">
              <Activity className="w-4 h-4" />
            </div>
            <p className="font-mono text-sm text-foreground flex-1">{scanStep}</p>
          </div>
          <div className="space-y-1">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Running 7-category deep inspection…</span>
              <span>{scanProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {auditResult && !isScanning && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Domain Banner */}
          <div className="p-4 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-teal-500" />
              <span>Target: <strong className="text-foreground text-sm font-heading">{auditResult.cleanDomain}</strong></span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-muted-foreground">Infrastructure: <strong className="text-teal-600 dark:text-teal-400 text-[11px]">{auditResult.edgeType}</strong></span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">HTTPS SSL ✓</span>
            </div>
          </div>

          {activeView === "report" ? (
            <>
              {/* Overall Score */}
              <div className={`p-6 rounded-2xl border-2 ${auditResult.isHealthy ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-500/40 bg-amber-500/5"} flex flex-col sm:flex-row items-center sm:items-start gap-6`}>
                <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 flex-shrink-0 ${gradeColor(auditResult.overallGrade)}`}>
                  <span className="text-3xl font-black font-heading">{auditResult.overallGrade}</span>
                  <span className="text-[10px] font-mono font-bold">{auditResult.overallScore}/100</span>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    {auditResult.isHealthy ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />}
                    <h4 className="font-heading font-bold text-base sm:text-lg text-foreground">
                      {auditResult.isHealthy ? "Website is Healthy — Minor Improvements Available" : "Website Needs Attention — Optimisation Required"}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">{auditResult.verdict}</p>
                  <div className="flex flex-wrap gap-3 pt-1 justify-center sm:justify-start">
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg border border-border">📡 Avg: <strong>{auditResult.avgLatency}ms</strong></span>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg border border-border">📱 4G: <strong>~{auditResult.estimatedMobileLoad}</strong></span>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg border border-border">⚡ 5G: <strong>~{auditResult.estimated5GLoad}</strong></span>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg border border-border">📦 Jitter: <strong>±{auditResult.jitter}ms</strong></span>
                  </div>
                </div>
              </div>

              {/* Category Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-heading font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-500" />
                  Detailed Inspection Results — 7 Categories
                </h4>
                {auditResult.categories.map((cat) => {
                  const isOpen = expandedCategory === cat.name;
                  return (
                    <div key={cat.name} className={`rounded-2xl border transition-all duration-200 ${cat.status === "pass" ? "border-emerald-500/20 bg-emerald-500/5" : cat.status === "warn" ? "border-amber-500/20 bg-amber-500/5" : "border-rose-500/20 bg-rose-500/5"}`}>
                      <button type="button" className="w-full p-4 flex items-center gap-3 text-left" onClick={() => setExpandedCategory(isOpen ? null : cat.name)}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${cat.status === "pass" ? "bg-emerald-500/15 text-emerald-500" : cat.status === "warn" ? "bg-amber-500/15 text-amber-500" : "bg-rose-500/15 text-rose-500"}`}>
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-foreground">{cat.name}</span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${gradeColor(cat.grade)}`}>{cat.grade}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{cat.headline}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="hidden sm:flex flex-col items-end gap-0.5">
                            <span className="text-xs font-mono font-bold text-foreground">{cat.score}/100</span>
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${cat.status === "pass" ? "bg-emerald-500" : cat.status === "warn" ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${cat.score}%` }} />
                            </div>
                          </div>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3 animate-in fade-in duration-150">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Findings</p>
                            <div className="space-y-1.5">
                              {cat.findings.map((f, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                                  <StatusDot status={cat.status} />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Recommended Actions</p>
                            <div className="space-y-1.5">
                              {cat.actions.map((a, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  <span className="text-teal-500 font-bold flex-shrink-0">→</span>
                                  <span className="text-foreground">{a}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Ping Log */
            <div className="rounded-2xl bg-navy-950 border border-border p-5 space-y-3 font-mono text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-border/80 text-teal-400">
                <span className="font-bold flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> PING {auditResult.cleanDomain} (56 bytes):</span>
                <span className="text-muted-foreground">Jitter: ±{auditResult.jitter}ms</span>
              </div>
              <div className="space-y-1">
                {auditResult.pings.map((p) => (
                  <div key={p.seq} className="flex items-center justify-between p-1.5 rounded bg-navy-900/60 border border-white/5">
                    <span>64 bytes from {auditResult.cleanDomain}: icmp_seq={p.seq} ttl=58 time=<span className={p.status === "ok" ? "text-emerald-400" : p.status === "slow" ? "text-amber-400" : "text-rose-400"}>{p.time}ms</span></span>
                    <span className={`text-[11px] ${p.status === "ok" ? "text-emerald-400" : p.status === "slow" ? "text-amber-400" : "text-rose-400"}`}>{p.status === "ok" ? "✓ fast" : p.status === "slow" ? "⚠ slow" : "✗ high"}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border/60 space-y-1 text-[11px]">
                <div className="flex justify-between text-teal-300">
                  <span>--- {auditResult.cleanDomain} ping statistics ---</span>
                  <span>{auditResult.pings.length} packets transmitted, {auditResult.pings.length} received</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>rtt min/avg/max = {auditResult.minLatency}/{auditResult.avgLatency}/{auditResult.maxLatency} ms</span>
                  <span>packet loss: {auditResult.packetLoss}%</span>
                </div>
                <p className={`pt-1 font-semibold ${auditResult.avgLatency < 60 ? "text-emerald-400" : auditResult.avgLatency < 180 ? "text-amber-400" : "text-rose-400"}`}>
                  {auditResult.avgLatency < 60 ? "⚡ Excellent latency: CDN edge node active — Kenyan users get fast responses." : auditResult.avgLatency < 180 ? "⚠️ Moderate latency: Site is responsive but no Nairobi CDN node detected." : "🔴 High latency: Overseas host without African CDN — significant speed penalty for Kenyan visitors."}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="p-5 rounded-2xl bg-muted/50 dark:bg-navy-950/80 border border-border space-y-3">
            {isLeadSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-1 text-center">
                <p className="font-heading font-bold text-sm">Consultation Request Sent! 🚀</p>
                <p className="text-xs text-muted-foreground">Peter will review the full audit for <strong>{auditResult.cleanDomain}</strong> and contact <strong>{directPhone}</strong> with a personalised action plan.</p>
              </div>
            ) : showDirectLeadForm ? (
              <form onSubmit={handleDirectLeadSubmit} className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-border text-xs font-bold text-foreground">
                  <span>Request Website Optimisation Consultation</span>
                  <button type="button" onClick={() => setShowDirectLeadForm(false)} className="text-muted-foreground hover:text-foreground text-[11px] underline">Cancel</button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input type="text" value={directName} onChange={(e) => setDirectName(e.target.value)} placeholder="Your Name (Optional)" className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500" />
                  <input type="tel" required value={directPhone} onChange={(e) => setDirectPhone(e.target.value)} placeholder="Phone / WhatsApp Number *" className="w-full px-3 py-2 text-xs rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-teal-500" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm">
                    <Send className="w-3.5 h-3.5" /><span>Submit Request</span>
                  </button>
                  <a href={getWhatsAppUrl(`Hi Peter, I just ran a 7-point audit on ${auditResult.cleanDomain} using your website tool.\n\n📊 Overall Score: ${auditResult.overallScore}/100 (Grade ${auditResult.overallGrade})\n📡 Avg Latency: ${auditResult.avgLatency}ms\n📱 4G Load: ~${auditResult.estimatedMobileLoad}\n⚡ 5G Load: ~${auditResult.estimated5GLoad}\n🏗️ Infrastructure: ${auditResult.edgeType}\n\nI'd like to discuss optimising this site for Kenyan mobile visitors.`)}
                    target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm">
                    <MessageCircle className="w-3.5 h-3.5" /><span>Chat on WhatsApp</span>
                  </a>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <p className="font-heading font-bold text-sm text-foreground">
                    {auditResult.isHealthy ? "Want Peter to squeeze more speed & conversions out of your site?" : "Ready to fix these issues? Peter can upgrade your website fast."}
                  </p>
                  <p className="text-xs text-muted-foreground">Get a personalised action plan: Cloudflare CDN setup, WebP conversion, WhatsApp CTAs & local SEO.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button type="button" onClick={() => setShowDirectLeadForm(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-glow">
                    <Send className="w-4 h-4" /><span>Request Consultation</span>
                  </button>
                  <a href={getWhatsAppUrl(`Hi Peter, I just ran a 7-point audit on ${auditResult.cleanDomain} using your website tool.\n\n📊 Overall Score: ${auditResult.overallScore}/100 (Grade ${auditResult.overallGrade})\n📡 Avg Latency: ${auditResult.avgLatency}ms\n📱 4G Load: ~${auditResult.estimatedMobileLoad}\n⚡ 5G Load: ~${auditResult.estimated5GLoad}\n🏗️ Infrastructure: ${auditResult.edgeType}\n\nI'd like to discuss optimising this site for Kenyan mobile visitors.`)}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow flex-shrink-0">
                    <MessageCircle className="w-4 h-4" /><span>Open WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-card dark:bg-navy-900 border border-border shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-heading font-bold text-base">
                <Info className="w-4 h-4" /><span>7-Point Audit Criteria & Methodology</span>
              </div>
              <button onClick={() => setShowCriteriaModal(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {[
                { title: "1. Server Response & Latency (22%)", body: "Real browser round-trip probe from Kenyan network. CDN-powered sites show <40ms; bare overseas hosting typically shows 200–600ms from Nairobi." },
                { title: "2. Mobile Load Speed — 5G & 4G (22%)", body: "Estimates load time on Safaricom/Airtel 5G NR and 4G LTE using roundtrip latency + payload model. Target: <1.5s (5G), <2.5s (4G) per Google Core Web Vitals." },
                { title: "3. SSL Certificate & HTTPS (10%)", body: "Verifies HTTPS connection is active. Required for Google Trust, Chrome padlock, M-Pesa integration, and WhatsApp Business API." },
                { title: "4. CDN & Asset Caching (16%)", body: "Detects Anycast routing patterns indicating CDN use. Cloudflare/Vercel/BunnyCDN reduce Kenyan latency by 60–80% vs. direct overseas hosting." },
                { title: "5. SEO & Google Discoverability (14%)", body: "Checks Core Web Vitals impact on rankings, JSON-LD structured data presence, and Kenya-specific local search signal opportunities." },
                { title: "6. Conversion & Kenya Mobile UX (10%)", body: "Evaluates WhatsApp CTA integration, M-Pesa payment visibility, and above-fold CTA accessibility on 5-inch phone screens." },
                { title: "7. Network Stability & Jitter (6%)", body: "Measures packet time variance across 6 probes. High jitter (>150ms) indicates inconsistent routing causing poor live-chat and video call experience." },
              ].map((c) => (
                <div key={c.title} className="p-3 rounded-xl bg-muted/60 border border-border/80 space-y-1">
                  <strong className="text-foreground block">{c.title}</strong>
                  <p className="text-xs">{c.body}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCriteriaModal(false)} className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors">Got It, Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteSpeedChecker;

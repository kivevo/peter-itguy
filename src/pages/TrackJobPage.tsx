import React, { useState } from "react";
import { Link } from "react-router-dom";
import { dataStorage, JobScheduleItem } from "@/services/dataStorage";
import { BrandLogo } from "@/components/BrandLogo";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  PackageCheck,
  Phone,
  MessageCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Cpu,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type TrackStatus = "scheduled" | "en_route" | "in_progress" | "completed" | "cancelled";

const STATUS_STEPS: { key: TrackStatus; label: string; description: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: "scheduled", label: "Diagnostic & Assessment", description: "Your service request is confirmed. Engineer has reviewed your issue.", icon: Clock },
  { key: "en_route", label: "Engineer En Route", description: "Your engineer is on the way to your location right now.", icon: Truck },
  { key: "in_progress", label: "Bench Testing & Repair", description: "Active engineering work is being performed on your hardware/network.", icon: Wrench },
  { key: "completed", label: "Completed & Handed Over", description: "All work is completed. Equipment has been tested and handed over.", icon: PackageCheck },
];

const STATUS_ORDER: TrackStatus[] = ["scheduled", "en_route", "in_progress", "completed"];

function getStepIndex(status: TrackStatus): number {
  return STATUS_ORDER.indexOf(status);
}

const serviceIcons: Record<string, string> = {
  "Wi-Fi & Network Fix": "📡",
  "CCTV & Cameras Setup": "📷",
  "Computer & Server Repair": "💻",
  "Turnkey Office Setup": "🏢",
  "Routine Maintenance": "🔧",
};

const TrackJobPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<JobScheduleItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const allJobs = dataStorage.getJobs();
    const match = allJobs.find(
      (job) =>
        job.id.toLowerCase() === q ||
        job.id.toLowerCase().includes(q) ||
        job.clientName.toLowerCase().includes(q) ||
        job.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        job.company.toLowerCase().includes(q)
    );

    setHasSearched(true);
    if (match) {
      setSearchResult(match);
      setNotFound(false);
    } else {
      setSearchResult(null);
      setNotFound(true);
    }
  };

  const getWhatsAppLink = (job: JobScheduleItem) => {
    const msg = encodeURIComponent(
      `Hello Peter, I'm following up on Job #${job.id} for ${job.clientName} (${job.company}). Current status: ${job.status}. Could you kindly provide an update? Thank you.`
    );
    return `https://wa.me/254700000000?text=${msg}`;
  };

  const currentStepIndex = searchResult ? getStepIndex(searchResult.status as TrackStatus) : -1;

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
      {/* Top Nav */}
      <nav className="border-b border-border/50 bg-background/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background to-blue-500/5 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Live Repair & Job Status
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground to-teal-400 bg-clip-text text-transparent">
            Track Your Repair
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Enter your Job ID, name, company, or phone number to see a real-time update on your IT service request.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="track-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job ID, name, phone, or company..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium shadow-lg"
              />
            </div>
            <button
              id="track-search-btn"
              type="submit"
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
            >
              Track Now
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        {/* Not Found */}
        {hasSearched && notFound && (
          <div className="rounded-3xl border border-border bg-card p-10 text-center space-y-4 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold">No Job Found</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              We couldn't find a job matching <span className="font-mono font-bold text-foreground">"{searchQuery}"</span>. Double-check your Job ID or try your phone number.
            </p>
            <a
              href="https://wa.me/254700000000?text=Hello%20Peter%2C%20I%20need%20help%20tracking%20my%20repair%20job."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>
        )}

        {/* Job Found */}
        {searchResult && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Job Card */}
            <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
              {/* Status Banner */}
              <div
                className={`px-8 py-5 flex items-center justify-between ${
                  searchResult.status === "completed"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                    : searchResult.status === "cancelled"
                    ? "bg-gradient-to-r from-red-700 to-rose-700"
                    : searchResult.status === "in_progress"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                    : searchResult.status === "en_route"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-slate-600 to-slate-700"
                }`}
              >
                <div>
                  <div className="text-white/70 text-xs font-mono mb-0.5">JOB REFERENCE</div>
                  <div className="text-white text-xl font-extrabold font-mono">{searchResult.id.toUpperCase()}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/70 text-xs mb-0.5">CURRENT STATUS</div>
                  <div className="text-white font-bold capitalize text-sm">
                    {searchResult.status === "en_route"
                      ? "🚗 Engineer En Route"
                      : searchResult.status === "in_progress"
                      ? "🔧 In Progress"
                      : searchResult.status === "completed"
                      ? "✅ Completed"
                      : searchResult.status === "cancelled"
                      ? "❌ Cancelled"
                      : "📋 Scheduled"}
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-1">CLIENT</div>
                    <div className="font-bold text-lg">{searchResult.clientName}</div>
                    <div className="text-sm text-muted-foreground">{searchResult.company}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {searchResult.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {new Date(searchResult.visitDate).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} — {searchResult.timeSlot}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {searchResult.phone}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-1">SERVICE TYPE</div>
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="text-xl">{serviceIcons[searchResult.serviceType] ?? "🔧"}</span>
                      {searchResult.serviceType}
                    </div>
                  </div>
                  {searchResult.hardwareSerialNumbers && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">HARDWARE / SERIALS</div>
                      <div className="flex items-start gap-2 text-sm text-foreground">
                        <Cpu className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="font-mono text-xs">{searchResult.hardwareSerialNumbers}</span>
                      </div>
                    </div>
                  )}
                  {searchResult.notes && (
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">ENGINEER NOTES</div>
                      <div className="text-sm text-muted-foreground italic">"{searchResult.notes}"</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-1">ASSIGNED ENGINEER</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">PK</div>
                      <div>
                        <div className="text-sm font-semibold">Peter Kivevo</div>
                        <div className="text-xs text-teal-400">Lead Engineer — Krenovate Systems</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            {searchResult.status !== "cancelled" && (
              <div className="rounded-3xl border border-border bg-card shadow-xl p-8">
                <h2 className="font-extrabold text-lg mb-8">Service Progress Timeline</h2>
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />

                  <div className="space-y-8">
                    {STATUS_STEPS.map((step, i) => {
                      const isDone = i < currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      const isPending = i > currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="relative flex items-start gap-5">
                          {/* Circle */}
                          <div
                            className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                              isDone
                                ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30"
                                : isCurrent
                                ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/30 animate-pulse"
                                : "bg-card border-border"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <Icon className={`w-5 h-5 ${isCurrent ? "text-white" : "text-muted-foreground"}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-2">
                            <div className={`font-bold text-sm mb-1 ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                              {step.label}
                              {isCurrent && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                                  CURRENT
                                </span>
                              )}
                              {isDone && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                                  DONE ✓
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${isPending ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                              {step.description}
                            </p>
                          </div>

                          <ChevronRight className={`w-4 h-4 mt-3 flex-shrink-0 ${isPending ? "text-border" : "text-muted-foreground"}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <a
                id="track-whatsapp-btn"
                href={getWhatsAppLink(searchResult)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-sm">WhatsApp Engineer</div>
                  <div className="text-xs text-muted-foreground">Send a message with your Job ID pre-filled</div>
                </div>
              </a>
              <a
                id="track-call-btn"
                href="tel:+254700000000"
                className="flex items-center gap-4 p-6 rounded-2xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <div className="font-bold text-sm">Call Support Line</div>
                  <div className="text-xs text-muted-foreground">Monday–Saturday, 8 AM – 7 PM EAT</div>
                </div>
              </a>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-3 py-4 text-muted-foreground text-xs">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Secured by Krenovate Systems · Powered by eTIMS Fiscal Compliance
              <Link to="/verify" className="text-teal-400 hover:underline">
                Verify Invoice →
              </Link>
            </div>
          </div>
        )}

        {/* Default State — How It Works */}
        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              { icon: "🔍", title: "Search Your Job", desc: "Enter any Job ID, your name, company, or registered phone number." },
              { icon: "📊", title: "Live Status Update", desc: "See a real-time progress timeline from booking to completion." },
              { icon: "💬", title: "Direct WhatsApp", desc: "One click sends a pre-filled message to your engineer with your Job ID." },
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
        © {new Date().getFullYear()} Krenovate Systems · Peter Kivevo John ·{" "}
        <Link to="/contact" className="hover:text-teal-400 transition-colors">
          Contact
        </Link>{" "}
        ·{" "}
        <Link to="/verify" className="hover:text-teal-400 transition-colors">
          Verify Invoice
        </Link>
      </footer>
    </div>
  );
};

export default TrackJobPage;

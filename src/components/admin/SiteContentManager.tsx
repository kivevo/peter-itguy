import React, { useState, useEffect } from "react";
import { 
  dataStorage, 
  SiteContent 
} from "@/services/dataStorage";
import { 
  ServiceItem, 
  CaseStudyItem, 
  ClientPartnerItem 
} from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Layers, 
  Phone, 
  Briefcase, 
  Award, 
  Check, 
  Building2, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Clock,
  MapPin,
  FolderKanban
} from "lucide-react";

export const SiteContentManager: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<SiteContent>(dataStorage.getSiteContent());
  const [activeSubTab, setActiveSubTab] = useState<"hero" | "contact" | "services" | "casestudies" | "stats" | "partners">("hero");

  // Editing state for Service modal
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<ServiceItem>({
    id: "",
    title: "",
    shortDesc: "",
    fullDesc: "",
    iconName: "ShieldCheck",
    badge: "Fast & Reliable",
    whatsIncluded: ["Quick Remote Helpdesk", "On-site emergency repairs"],
    whoItsFor: "Businesses and offices in Nairobi",
    typicalTurnaround: "15-minute response",
    miniCaseStudy: {
      client: "Corporate Client",
      challenge: "Network and computer downtime",
      result: "Restored 100% uptime with proactive maintenance",
    },
    startingPrice: "Custom Scope & Monthly SLA",
  });

  // Editing state for Case Study modal
  const [editingCaseIndex, setEditingCaseIndex] = useState<number | null>(null);
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [caseFormData, setCaseFormData] = useState<CaseStudyItem>({
    id: "",
    title: "",
    client: "",
    category: "Network Engineering",
    heroMetric: "99.9% Uptime",
    summary: "",
    problem: "",
    solution: ["Isolated network traffic", "Deployed enterprise Wi-Fi 6"],
    results: ["Zero payment transaction drops", "Faster internet across rooms"],
    technologies: ["Ubiquiti UniFi", "MikroTik", "Cat6 Cabling"],
    link: "",
    liveUrlText: "Visit Client Website",
  });

  // Editing state for Client Partner modal
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState<ClientPartnerItem>({
    name: "",
    industry: "",
    projectType: "",
    badgeText: "",
    website: "",
  });

  useEffect(() => {
    const loadContent = () => setContent(dataStorage.getSiteContent());
    loadContent();
    const unsub = dataStorage.subscribe(loadContent);
    return () => unsub();
  }, []);

  const handleSaveAll = () => {
    dataStorage.saveSiteContent(content);
    toast({
      title: "Website Content Saved! 🚀",
      description: "Changes are updated live across all public website pages.",
    });
  };

  const handleRestoreDefaults = () => {
    if (window.confirm("Are you sure you want to reset all website text back to default?")) {
      const restored = dataStorage.restoreDefaultSiteContent();
      setContent(restored);
      toast({
        title: "Default Content Restored",
        description: "Website copy reset to original configuration.",
      });
    }
  };

  // Service Handlers
  const handleOpenNewService = () => {
    setEditingServiceIndex(null);
    setServiceFormData({
      id: `service-${Date.now()}`,
      title: "",
      shortDesc: "",
      fullDesc: "",
      iconName: "ShieldCheck",
      badge: "Popular Service",
      whatsIncluded: ["Feature 1", "Feature 2", "Feature 3"],
      whoItsFor: "Businesses and offices in Nairobi",
      typicalTurnaround: "Same-day deployment",
      miniCaseStudy: {
        client: "Client Name",
        challenge: "Core problem description",
        result: "Clear business outcome",
      },
      startingPrice: "Custom Scope & Monthly SLA",
    });
    setServiceModalOpen(true);
  };

  const handleEditService = (idx: number) => {
    setEditingServiceIndex(idx);
    setServiceFormData({ ...content.services[idx] });
    setServiceModalOpen(true);
  };

  const handleDeleteService = (idx: number) => {
    if (window.confirm(`Delete service "${content.services[idx].title}"?`)) {
      const updated = content.services.filter((_, i) => i !== idx);
      const newContent = { ...content, services: updated };
      setContent(newContent);
      dataStorage.saveSiteContent(newContent);
      toast({ title: "Service Removed", description: "Service deleted from catalog." });
    }
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title.trim()) {
      toast({ title: "Title Required", description: "Please provide a service title.", variant: "destructive" });
      return;
    }

    const updatedServices = [...content.services];
    if (editingServiceIndex !== null) {
      updatedServices[editingServiceIndex] = serviceFormData;
    } else {
      updatedServices.push({
        ...serviceFormData,
        id: serviceFormData.id || `service-${Date.now()}`,
      });
    }

    const newContent = { ...content, services: updatedServices };
    setContent(newContent);
    dataStorage.saveSiteContent(newContent);
    setServiceModalOpen(false);
    toast({
      title: editingServiceIndex !== null ? "Service Updated" : "Service Added",
      description: `"${serviceFormData.title}" is live on your services catalog.`,
    });
  };

  // Case Study Handlers
  const handleOpenNewCase = () => {
    setEditingCaseIndex(null);
    setCaseFormData({
      id: `case-${Date.now()}`,
      title: "",
      client: "",
      category: "Network Engineering",
      heroMetric: "40% Speed Increase",
      summary: "",
      problem: "",
      solution: ["Step 1", "Step 2"],
      results: ["Outcome 1", "Outcome 2"],
      technologies: ["MikroTik", "UniFi", "Cat6"],
      link: "",
      liveUrlText: "View Live Site",
    });
    setCaseModalOpen(true);
  };

  const handleEditCase = (idx: number) => {
    setEditingCaseIndex(idx);
    setCaseFormData({ ...content.caseStudies[idx] });
    setCaseModalOpen(true);
  };

  const handleDeleteCase = (idx: number) => {
    if (window.confirm(`Delete case study "${content.caseStudies[idx].title}"?`)) {
      const updated = content.caseStudies.filter((_, i) => i !== idx);
      const newContent = { ...content, caseStudies: updated };
      setContent(newContent);
      dataStorage.saveSiteContent(newContent);
      toast({ title: "Case Study Removed", description: "Project removed from blueprints." });
    }
  };

  const handleSaveCaseForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseFormData.title.trim() || !caseFormData.client.trim()) {
      toast({ title: "Title & Client Required", description: "Please enter title and client name.", variant: "destructive" });
      return;
    }

    const updatedCases = [...content.caseStudies];
    if (editingCaseIndex !== null) {
      updatedCases[editingCaseIndex] = caseFormData;
    } else {
      updatedCases.push({
        ...caseFormData,
        id: caseFormData.id || `case-${Date.now()}`,
      });
    }

    const newContent = { ...content, caseStudies: updatedCases };
    setContent(newContent);
    dataStorage.saveSiteContent(newContent);
    setCaseModalOpen(false);
    toast({
      title: editingCaseIndex !== null ? "Case Study Updated" : "Case Study Added",
      description: `"${caseFormData.title}" is published on your case studies page.`,
    });
  };

  // Partner Handlers
  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormData.name.trim()) return;
    const updated = [...content.partners, partnerFormData];
    const newContent = { ...content, partners: updated };
    setContent(newContent);
    dataStorage.saveSiteContent(newContent);
    setPartnerModalOpen(false);
    setPartnerFormData({ name: "", industry: "", projectType: "", badgeText: "", website: "" });
    toast({ title: "Client Partner Added", description: `${partnerFormData.name} added to logo strip.` });
  };

  const handleDeletePartner = (idx: number) => {
    const updated = content.partners.filter((_, i) => i !== idx);
    const newContent = { ...content, partners: updated };
    setContent(newContent);
    dataStorage.saveSiteContent(newContent);
    toast({ title: "Client Partner Removed" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-900 to-teal-950/40 border border-teal-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0 mt-0.5 sm:mt-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                Website Content &amp; CMS Studio
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-bold whitespace-nowrap shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Live Reactivity
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Edit headlines, services catalog, client case studies, contact info &amp; credibility stats without touching code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-white text-xs font-bold border border-border flex items-center gap-1.5 transition-all shadow-sm"
            title="Reset site copy back to default configuration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restore Defaults</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 sm:px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 shadow-glow"
          >
            <Save className="w-4 h-4" />
            <span>Save All Content</span>
          </button>
        </div>
      </div>

      {/* CMS Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-navy-900 border border-border">
        {[
          { id: "hero" as const, label: "Hero & Headlines", icon: Sparkles },
          { id: "contact" as const, label: "Contact & Coordinates", icon: Phone },
          { id: "services" as const, label: `Services Catalog (${content.services.length})`, icon: Briefcase },
          { id: "casestudies" as const, label: `Case Studies (${content.caseStudies.length})`, icon: FolderKanban },
          { id: "stats" as const, label: "Credibility Stats", icon: Award },
          { id: "partners" as const, label: `Client Logos (${content.partners.length})`, icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. HERO & BRANDING */}
      {activeSubTab === "hero" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-border space-y-6 animate-in fade-in duration-200">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2 border-b border-border/60 pb-3">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Homepage Hero, Taglines &amp; Value Proposition</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name / Main Title</label>
              <input
                type="text"
                value={content.siteInfo.brandName}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, brandName: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Engineer / Personal Name</label>
              <input
                type="text"
                value={content.siteInfo.name}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, name: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Value Tagline (Headline)</label>
              <input
                type="text"
                value={content.siteInfo.tagline}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, tagline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-teal-300 font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Sub-Headline (Hook Paragraph)</label>
              <textarea
                rows={3}
                value={content.siteInfo.subtagline}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, subtagline: e.target.value }
                })}
                className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Save Hero Settings
            </button>
          </div>
        </div>
      )}

      {/* 2. CONTACT COORDINATES & SOCIALS */}
      {activeSubTab === "contact" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-border space-y-6 animate-in fade-in duration-200">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2 border-b border-border/60 pb-3">
            <Phone className="w-4 h-4 text-teal-400" />
            <span>Direct Dispatch Coordinates &amp; Social Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (Display)</label>
              <input
                type="text"
                value={content.siteInfo.phoneDisplay}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, phoneDisplay: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp International Format (e.g. 254758896553)</label>
              <input
                type="text"
                value={content.siteInfo.whatsappNumber}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, whatsappNumber: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email Address</label>
              <input
                type="email"
                value={content.siteInfo.email}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, email: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Physical Location / Service Coverage</label>
              <input
                type="text"
                value={content.siteInfo.location}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, location: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Office Hours &amp; Response Times</label>
              <input
                type="text"
                value={content.siteInfo.officeHours}
                onChange={(e) => setContent({
                  ...content,
                  siteInfo: { ...content.siteInfo, officeHours: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-navy-950 border border-border text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Save Contact Coordinates
            </button>
          </div>
        </div>
      )}

      {/* 3. SERVICES CATALOG */}
      {activeSubTab === "services" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span>Core IT Services Catalog</span>
            </h3>

            <button
              type="button"
              onClick={handleOpenNewService}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.services.map((srv, idx) => (
              <div key={srv.id} className="p-6 rounded-3xl bg-navy-900 border border-border space-y-3 hover:border-teal-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    {srv.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditService(idx)}
                      className="p-1.5 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-border"
                      title="Edit Service"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(idx)}
                      className="p-1.5 rounded-lg bg-navy-950 text-rose-400 hover:bg-rose-500/10 border border-border"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-heading font-bold text-base text-white">
                  {srv.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {srv.shortDesc}
                </p>

                <div className="pt-2 border-t border-border/60 space-y-1 text-[11px] font-mono text-slate-400">
                  <div><strong>Turnaround:</strong> {srv.typicalTurnaround}</div>
                  <div><strong>Included:</strong> {srv.whatsIncluded.length} deliverables</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CASE STUDIES & BLUEPRINTS */}
      {activeSubTab === "casestudies" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-teal-400" />
              <span>Client Case Studies &amp; Blueprints</span>
            </h3>

            <button
              type="button"
              onClick={handleOpenNewCase}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Case Study</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.caseStudies.map((cs, idx) => (
              <div key={cs.id} className="p-6 rounded-3xl bg-navy-900 border border-border space-y-3 hover:border-teal-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cs.heroMetric}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditCase(idx)}
                      className="p-1.5 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-border"
                      title="Edit Case Study"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCase(idx)}
                      className="p-1.5 rounded-lg bg-navy-950 text-rose-400 hover:bg-rose-500/10 border border-border"
                      title="Delete Case Study"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-base text-white">
                    {cs.title}
                  </h4>
                  <p className="text-xs text-teal-400 font-semibold mt-0.5">
                    {cs.client} &bull; {cs.category}
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {cs.summary || cs.problem}
                </p>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-border/60">
                  {cs.technologies.slice(0, 3).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-slate-300 border border-border">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CREDIBILITY STATS */}
      {activeSubTab === "stats" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-border space-y-6 animate-in fade-in duration-200">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2 border-b border-border/60 pb-3">
            <Award className="w-4 h-4 text-teal-400" />
            <span>Credibility Metrics &amp; Trust Numbers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.siteInfo.stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-navy-950 border border-border space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Number / Metric</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...content.siteInfo.stats];
                        updated[idx].value = e.target.value;
                        setContent({
                          ...content,
                          siteInfo: { ...content.siteInfo, stats: updated }
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-teal-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...content.siteInfo.stats];
                        updated[idx].label = e.target.value;
                        setContent({
                          ...content,
                          siteInfo: { ...content.siteInfo, stats: updated }
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => {
                      const updated = [...content.siteInfo.stats];
                      updated[idx].description = e.target.value;
                      setContent({
                        ...content,
                        siteInfo: { ...content.siteInfo, stats: updated }
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/60 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Save Credibility Stats
            </button>
          </div>
        </div>
      )}

      {/* 6. CLIENT PARTNERS & LOGOS */}
      {activeSubTab === "partners" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-border space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Corporate Client Logo Strip ({content.partners.length})</span>
            </h3>

            <button
              type="button"
              onClick={() => setPartnerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {content.partners.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-navy-950 border border-border space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(idx)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                    title="Remove Partner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-teal-400 font-semibold">{p.industry}</div>
                <div className="text-xs text-slate-300">{p.projectType}</div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 text-slate-300 border border-border">
                  {p.badgeText}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICE EDIT/CREATE MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-navy-900 border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <h3 className="font-heading font-bold text-lg text-white">
              {editingServiceIndex !== null ? "Edit Service" : "Create New Service"}
            </h3>

            <form onSubmit={handleSaveServiceForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.title}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    value={serviceFormData.badge}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Short Summary</label>
                  <input
                    type="text"
                    value={serviceFormData.shortDesc}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, shortDesc: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Detailed Description</label>
                  <textarea
                    rows={3}
                    value={serviceFormData.fullDesc}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, fullDesc: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    What's Included (1 item per line)
                  </label>
                  <textarea
                    rows={4}
                    value={serviceFormData.whatsIncluded.join("\n")}
                    onChange={(e) => setServiceFormData({
                      ...serviceFormData,
                      whatsIncluded: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                    })}
                    placeholder="Same-day on-site repairs&#10;Office Wi-Fi setup&#10;24/7 Remote helpdesk"
                    className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={serviceFormData.typicalTurnaround}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, typicalTurnaround: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Client Audience</label>
                  <input
                    type="text"
                    value={serviceFormData.whoItsFor}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, whoItsFor: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white text-xs font-bold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CASE STUDY EDIT/CREATE MODAL */}
      {caseModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-navy-900 border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <h3 className="font-heading font-bold text-lg text-white">
              {editingCaseIndex !== null ? "Edit Case Study" : "Create Case Study"}
            </h3>

            <form onSubmit={handleSaveCaseForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={caseFormData.title}
                    onChange={(e) => setCaseFormData({ ...caseFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Client Name &amp; Location *</label>
                  <input
                    type="text"
                    required
                    value={caseFormData.client}
                    onChange={(e) => setCaseFormData({ ...caseFormData, client: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={caseFormData.category}
                    onChange={(e) => setCaseFormData({ ...caseFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Metric</label>
                  <input
                    type="text"
                    value={caseFormData.heroMetric}
                    onChange={(e) => setCaseFormData({ ...caseFormData, heroMetric: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Challenge / Problem</label>
                  <textarea
                    rows={2}
                    value={caseFormData.problem}
                    onChange={(e) => setCaseFormData({ ...caseFormData, problem: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Solution Implemented (1 step per line)
                  </label>
                  <textarea
                    rows={3}
                    value={caseFormData.solution.join("\n")}
                    onChange={(e) => setCaseFormData({
                      ...caseFormData,
                      solution: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                    })}
                    className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Key Results Achieved (1 result per line)
                  </label>
                  <textarea
                    rows={3}
                    value={caseFormData.results.join("\n")}
                    onChange={(e) => setCaseFormData({
                      ...caseFormData,
                      results: e.target.value.split("\n").filter((l) => l.trim().length > 0),
                    })}
                    className="w-full p-3 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Technologies Used (comma separated)
                  </label>
                  <input
                    type="text"
                    value={caseFormData.technologies.join(", ")}
                    onChange={(e) => setCaseFormData({
                      ...caseFormData,
                      technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })}
                    placeholder="Ubiquiti UniFi, MikroTik, React, Cat6"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setCaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white text-xs font-bold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md"
                >
                  Save Case Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-900 border border-border rounded-3xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-heading font-bold text-base text-white">Add Corporate Client Partner</h3>
            <form onSubmit={handleSavePartner} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Hotel Name *</label>
                <input
                  type="text"
                  required
                  value={partnerFormData.name}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                  placeholder="e.g. After40 Hotel"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Industry</label>
                <input
                  type="text"
                  value={partnerFormData.industry}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, industry: e.target.value })}
                  placeholder="e.g. Hotel (Nairobi CBD)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Project Scope</label>
                <input
                  type="text"
                  value={partnerFormData.projectType}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, projectType: e.target.value })}
                  placeholder="e.g. Fast Website & Wi-Fi Setup"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={partnerFormData.badgeText}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, badgeText: e.target.value })}
                  placeholder="e.g. Fast Web & Wi-Fi"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-navy-950 border border-border text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-slate-400 hover:text-white text-xs font-bold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

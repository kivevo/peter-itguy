import React, { useState } from "react";
import { dataStorage, WhatsAppCampaignRecord, InquiryLead, SavedClient } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Search,
  Plus,
  Send,
  Users,
  Copy,
  CheckCircle2,
  Sparkles,
  Edit3,
  Trash2,
  Filter,
  Check,
  X,
  ExternalLink,
  Zap,
  TrendingUp,
  Tag,
  Radio,
  Wifi,
  Shield,
  Briefcase
} from "lucide-react";

export const WhatsAppCampaignStudio: React.FC = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<WhatsAppCampaignRecord[]>(() => dataStorage.getWhatsAppCampaigns());
  const [inquiries] = useState<InquiryLead[]>(() => dataStorage.getInquiries());
  const [clients] = useState<SavedClient[]>(() => dataStorage.getClients());
  
  // Selected Campaign & Dispatch Modal
  const [selectedCampaign, setSelectedCampaign] = useState<WhatsAppCampaignRecord | null>(campaigns[0] || null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // Form
  const [formData, setFormData] = useState<Omit<WhatsAppCampaignRecord, "id" | "createdAt">>({
    campaignTitle: "",
    targetAudience: "all",
    templateCategory: "wifi_upgrade",
    messageTemplate: "",
    recipientCount: 0,
    dispatchedCount: 0,
  });

  const CAMPAIGN_PRESETS = [
    {
      category: "wifi_upgrade",
      title: "Q3 Business Wi-Fi Speed & Security Tune-up",
      audience: "wifi_clients",
      icon: <Wifi className="w-4 h-4 text-teal-400" />,
      template: `Hello {{name}}! 👋\n\nHope {{company}} is having a productive week! 🚀\n\nIs your office Wi-Fi keeping up with your team's video calls and file transfers? Krenovate Systems is running our *Quarterly Wi-Fi Optimization Special* for offices in Nairobi:\n\n• UniFi & MikroTik Firmware Optimization\n• Isolated Guest Wi-Fi & Bandwidth Fair-Share Shaping\n• Signal Coverage & Dead-Zone Heatmap Survey\n\nReply to this message if you'd like us to schedule a priority on-site tune-up!\n\nBest regards,\nPeter Kivevo — Krenovate Systems\n📞 0722 000 000`,
    },
    {
      category: "cctv_maintenance",
      title: "CCTV Lens Cleaning & Hard Drive Health Audit",
      audience: "cctv_clients",
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      template: `Hello {{name}}! 📹\n\nRoutine security reminder from *Krenovate Systems* for {{company}}.\n\nWhen was the last time your CCTV hard drives were checked for recording bad sectors? Dust buildup on outdoor lenses and power supply drops can cause critical blind spots.\n\nOur *Preventive CCTV Audit Package* includes:\n✔ 4K Camera Lens Cleaning & Angle Realignment\n✔ NVR Hard Drive Bad-Sector & Continuity Check\n✔ Mobile App Remote Access & Cloud Backup Re-sync\n\nWould you like us to pass by this week for your scheduled preventive audit?\n\n— Peter Kivevo John (Krenovate Systems)`,
    },
    {
      category: "sla_offer",
      title: "Proactive Monthly IT Support Retainer Package",
      audience: "retainer_sla",
      icon: <Briefcase className="w-4 h-4 text-purple-400" />,
      template: `Hello {{name}}! 👋\n\nAre unexpected computer breakdowns and printer downtime slowing your team down at {{company}}?\n\n*Krenovate Systems* is offering a dedicated *Monthly IT Retainer SLA* starting from KES 25,000/mo:\n\n• Guaranteed 2-Hour Emergency Response Time in Nairobi\n• Unlimited Remote Helpdesk for all staff members\n• Bi-weekly On-Site Preventive Maintenance Visits\n• Free Managed Cloud & Local Automated Backups\n\nLet's keep your IT infrastructure running at 99.9% uptime. Reply to book a free 30-minute infrastructure assessment!\n\n— Peter Kivevo (Lead IT Engineer)`,
    },
  ];

  const getTargetRecipients = (audience: WhatsAppCampaignRecord["targetAudience"]) => {
    // Combine CRM leads + saved clients
    const uniqueMap = new Map<string, { name: string; company: string; phone: string }>();

    clients.forEach((c) => {
      if (c.phone) {
        uniqueMap.set(c.phone.replace(/[^0-9]/g, ""), {
          name: c.name || "Valued Client",
          company: c.company || "Your Business",
          phone: c.phone,
        });
      }
    });

    inquiries.forEach((inq) => {
      if (inq.phone) {
        const clean = inq.phone.replace(/[^0-9]/g, "");
        if (!uniqueMap.has(clean)) {
          uniqueMap.set(clean, {
            name: inq.name || "Client",
            company: inq.company || "Your Business",
            phone: inq.phone,
          });
        }
      }
    });

    return Array.from(uniqueMap.values());
  };

  const handleApplyPreset = (preset: typeof CAMPAIGN_PRESETS[0]) => {
    const recipients = getTargetRecipients(preset.audience as any);
    setFormData({
      campaignTitle: preset.title,
      targetAudience: preset.audience as any,
      templateCategory: preset.category as any,
      messageTemplate: preset.template,
      recipientCount: recipients.length,
      dispatchedCount: 0,
    });
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    handleApplyPreset(CAMPAIGN_PRESETS[0]);
    setShowModal(true);
  };

  const handleOpenEditModal = (camp: WhatsAppCampaignRecord) => {
    setEditingId(camp.id);
    setFormData({ ...camp });
    setShowModal(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaignTitle.trim() || !formData.messageTemplate.trim()) {
      toast({ title: "Missing Details", description: "Title and message template are required.", variant: "destructive" });
      return;
    }

    const recipients = getTargetRecipients(formData.targetAudience);
    const record: WhatsAppCampaignRecord = {
      ...formData,
      recipientCount: recipients.length,
      id: editingId || `camp-${Date.now()}`,
      createdAt: editingId ? (campaigns.find((c) => c.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    const saved = dataStorage.saveWhatsAppCampaign(record);
    const updated = dataStorage.getWhatsAppCampaigns();
    setCampaigns(updated);
    setSelectedCampaign(saved);
    setShowModal(false);

    toast({
      title: editingId ? "Campaign Updated! 📢" : "Campaign Created! 🚀",
      description: `Targeting ${recipients.length} qualified contacts.`,
    });
  };

  const handleDeleteCampaign = (id: string, title: string) => {
    if (window.confirm(`Delete campaign "${title}"?`)) {
      dataStorage.deleteWhatsAppCampaign(id);
      const updated = dataStorage.getWhatsAppCampaigns();
      setCampaigns(updated);
      setSelectedCampaign(updated[0] || null);
      toast({ title: "Campaign Deleted", description: `"${title}" removed.` });
    }
  };

  const generatePersonalizedMessage = (template: string, name: string, company: string) => {
    return template
      .replace(/{{name}}/g, name)
      .replace(/{{company}}/g, company);
  };

  const recipients = selectedCampaign ? getTargetRecipients(selectedCampaign.targetAudience) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                WhatsApp Promo &amp; Campaign Studio
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                {campaigns.length} Campaigns
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Drive repeat revenue with seasonal IT maintenance offers, Wi-Fi audits, and personalized promos.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Main Grid: Left Campaigns List + Right Preview & Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Campaign List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold px-1">
            Active Campaign Templates
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
            {campaigns.map((camp) => {
              const isSelected = selectedCampaign?.id === camp.id;
              const recCount = getTargetRecipients(camp.targetAudience).length;

              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaign(camp)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-md"
                      : "bg-navy-900 border-border/80 text-slate-300 hover:border-slate-600 hover:bg-navy-850"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm text-white leading-tight">
                      {camp.campaignTitle}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-navy-950 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono shrink-0">
                      {recCount} Contacts
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {camp.messageTemplate}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-border/40 pt-2">
                    <span className="capitalize">{camp.targetAudience.replace("_", " ")}</span>
                    <span>Last run: {camp.lastDispatchedAt ? new Date(camp.lastDispatchedAt).toLocaleDateString() : "Draft"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Template Preview & Interactive Dispatcher (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedCampaign ? (
            <div className="p-6 rounded-3xl bg-navy-900 border border-border space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {selectedCampaign.campaignTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Audience: <strong>{recipients.length} qualified leads/clients</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(selectedCampaign)}
                    className="p-2 rounded-xl bg-navy-950 text-slate-300 hover:text-white border border-border text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCampaign(selectedCampaign.id, selectedCampaign.campaignTitle)}
                    className="p-2 rounded-xl bg-navy-950 text-rose-400 hover:bg-rose-500/20 border border-border"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Preview (WhatsApp Bubble Format) */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  📱 WhatsApp Client Message Preview
                </div>
                <div className="p-4 rounded-2xl bg-[#075e54]/15 border border-[#25d366]/30 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap shadow-inner">
                  {generatePersonalizedMessage(
                    selectedCampaign.messageTemplate,
                    "David Mwangi",
                    "Peak Logistics Hub Ltd"
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  Variables <code className="text-emerald-400">{"{{name}}"}</code> and <code className="text-emerald-400">{"{{company}}"}</code> are dynamically replaced for every contact.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowDispatchModal(true)}
                className="w-full py-3.5 rounded-2xl bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Launch WhatsApp 1-Click Dispatch Studio ({recipients.length} Contacts)</span>
              </button>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-navy-900 border border-border text-center text-slate-400 text-xs">
              Select or create a campaign to preview.
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Modal: Sequential Send List */}
      {showDispatchModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-navy-900 border border-emerald-500/40 p-6 md:p-8 space-y-5 shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Sequential WhatsApp Dispatch
                  </h3>
                  <p className="text-xs text-slate-400">{selectedCampaign.campaignTitle}</p>
                </div>
              </div>
              <button onClick={() => setShowDispatchModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Click <strong>"Send via WhatsApp"</strong> on each contact below. WhatsApp Web / App will open with their name &amp; company already personalized.
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {recipients.length === 0 ? (
                <div className="p-6 rounded-2xl bg-navy-950 border border-border text-center text-slate-400 text-xs">
                  No contacts found in CRM matching this segment.
                </div>
              ) : (
                recipients.map((c, idx) => {
                  const personalized = generatePersonalizedMessage(selectedCampaign.messageTemplate, c.name, c.company);
                  const cleanPhone = c.phone.replace(/[^0-9]/g, "");

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-navy-950 border border-border flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-400">{c.company} · {c.phone}</div>
                      </div>

                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalized)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-navy-900 border border-emerald-500/40 p-6 md:p-8 space-y-6 shadow-2xl custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {editingId ? "Edit Campaign Template" : "Create New WhatsApp Promo Campaign"}
                  </h3>
                  <p className="text-xs text-slate-400">Craft personalized marketing broadcasts.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                1-Click Preset Templates
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CAMPAIGN_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-3 rounded-2xl bg-navy-950 hover:bg-navy-850 border border-border text-left space-y-1 transition-all"
                  >
                    <div className="flex items-center gap-1.5">{p.icon}<span className="font-bold text-xs text-white">{p.category.replace("_", " ").toUpperCase()}</span></div>
                    <div className="text-[11px] text-slate-400 truncate">{p.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End of Year IT Infrastructure Audit Special"
                  value={formData.campaignTitle}
                  onChange={(e) => setFormData({ ...formData, campaignTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Target Audience Segment</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="all">All Contacts &amp; Leads ({getTargetRecipients("all").length})</option>
                    <option value="wifi_clients">Wi-Fi &amp; Networking Clients</option>
                    <option value="cctv_clients">CCTV &amp; Surveillance Clients</option>
                    <option value="retainer_sla">SLA IT Retainer Prospects</option>
                    <option value="repair_clients">Hardware Repair Clients</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category Tag</label>
                  <select
                    value={formData.templateCategory}
                    onChange={(e) => setFormData({ ...formData, templateCategory: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="wifi_upgrade">Wi-Fi &amp; Bandwidth</option>
                    <option value="cctv_maintenance">CCTV Maintenance</option>
                    <option value="sla_offer">SLA IT Retainer</option>
                    <option value="seasonal_audit">Seasonal Audit</option>
                    <option value="custom">Custom Promo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Message Copy (Supports WhatsApp *bold*, • bullets, and {"{{name}}"} / {"{{company}}"} tags) *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.messageTemplate}
                  onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono text-xs focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? "Save Changes" : "Save Campaign"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppCampaignStudio;

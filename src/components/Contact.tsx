import React, { useState, useEffect, useCallback } from "react";
import { SocialLinks } from "@/components/SocialLinks";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage, InquiryLead } from "@/services/dataStorage";
import { resendService } from "@/services/resendService";
import { useToast } from "@/hooks/use-toast";
import { KenyaLocationPicker, KenyaLocationValue } from "@/components/KenyaLocationPicker";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageCircle, 
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";
import { ProfilePhoto } from "@/components/ProfilePhoto";

import SubmissionSuccessModal, { SubmissionDetails } from "@/components/SubmissionSuccessModal";

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const [siteContent, setSiteContent] = useState(dataStorage.getSiteContent());
  const [location, setLocation] = useState<string>("Parklands / Highridge, Westlands, Nairobi City");
  const [successModalDetails, setSuccessModalDetails] = useState<SubmissionDetails | null>(null);

  const handleLocationChange = useCallback((loc: KenyaLocationValue) => {
    setLocation(loc.formattedLocation);
  }, []);

  useEffect(() => {
    const load = () => setSiteContent(dataStorage.getSiteContent());
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  const siteInfo = siteContent.siteInfo;
  const services = siteContent.services;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: services[0]?.title || "Computer & IT Support",
    urgency: "Standard (This Week)",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urgencyOptions = [
    { label: "🚨 Emergency (Need Help Right Away)", value: "Emergency / Today" },
    { label: "⚡ Standard (This Week)", value: "Standard (This Week)" },
    { label: "📅 Planning / Free Written Quote", value: "Planning / Quote" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateWhatsAppMessage = () => {
    return `Hi Peter,\n\nMy name is ${formData.name || "[Client]"}.\nService Needed: ${formData.service}\nLocation: ${location}\nUrgency: ${formData.urgency}\nPhone: ${formData.phone || "N/A"}\n\nDetails: ${formData.message || "I would like to get help or a quote for my business."}`;
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Name & Phone Required",
        description: "Please fill in your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    // Save lead to local storage
    const newInquiry: InquiryLead = {
      id: `inq_${Date.now()}`,
      source: "direct_modal",
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      urgency: formData.urgency,
      details: `Location: ${location} | Urgency: ${formData.urgency} | Details: ${formData.message.trim()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    dataStorage.addInquiry(newInquiry);

    // If email provided, save subscriber
    if (formData.email.trim() && formData.email.includes("@")) {
      dataStorage.addSubscriber({
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        source: "Contact Form WhatsApp",
      });
      resendService.sendWelcomeEmail({ email: formData.email.trim(), name: formData.name.trim() });
    }

    // Fire email notification to Peter
    resendService.notifyNewInquiry(newInquiry);

    // Open WhatsApp
    const url = getWhatsAppUrl(generateWhatsAppMessage());
    window.open(url, "_blank");
    toast({
      title: "Opening WhatsApp... 🚀",
      description: "Peter has also received an email alert with your details.",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Name & Phone Required",
        description: "Please enter your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
    const newInquiry: InquiryLead = {
      id: `inq_${Date.now()}`,
      source: "contact_form",
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      urgency: formData.urgency,
      details: `Location: ${location} | Urgency: ${formData.urgency} | Details: ${formData.message.trim()}${formData.email ? ` (Email: ${formData.email.trim()})` : ""}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    dataStorage.addInquiry(newInquiry);

    // If email provided, subscribe and send welcome email + inquiry confirmation
    if (formData.email.trim() && formData.email.includes("@")) {
      dataStorage.addSubscriber({
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        source: "Website Contact Form",
      });
      // Send client confirmation receipt email
      resendService.sendClientInquiryConfirmation(newInquiry, formData.email.trim());
    }

    // Send instant email alert to Peter via Resend
    await resendService.notifyNewInquiry(newInquiry);

    setIsSubmitting(false);

    // Show rich success modal to the client
    setSuccessModalDetails({
      ticketId,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      service: formData.service,
      location,
      urgency: formData.urgency,
    });

    setFormData({
      name: "",
      phone: "",
      email: "",
      service: services[0]?.title || "Computer & IT Support",
      urgency: "Standard (This Week)",
      message: "",
    });
  };


  return (
    <>
    <section id="contact" className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Line &amp; Fast Help</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Let's Fix Your Tech Headaches or <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Build Your Next Website</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            WhatsApp is the fastest way to get my attention in Kenya. You can also call directly or fill out the quick form below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Kenyan WhatsApp Box */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3.5">
                <ProfilePhoto size="sm" showStatusBadge={true} />
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    Direct Line with Peter Kivevo
                  </h3>
                  <p className="text-xs text-teal-100">
                    Fastest response in Kenya via WhatsApp
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
                Whether you need same-day on-site help in Nairobi or quick 15-minute remote assistance anywhere in Kenya, send a quick message to my active WhatsApp.
              </p>

              <a
                href={getWhatsAppUrl("Hi Peter, I need IT help for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-teal-900 font-bold text-sm shadow-md transition-transform duration-200 hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Message {siteInfo.phoneDisplay}</span>
              </a>
            </div>

            {/* Direct Contact Cards */}
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Phone &amp; WhatsApp Call
                  </h4>
                  <a
                    href={`tel:${siteInfo.phoneTel}`}
                    className="font-mono text-sm sm:text-base font-bold text-foreground hover:text-teal-500 transition-colors"
                  >
                    {siteInfo.phoneDisplay}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">Calls answered promptly</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-border/70">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </h4>
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="font-mono text-sm sm:text-base font-bold text-foreground hover:text-teal-500 transition-colors break-all"
                  >
                    {siteInfo.email}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">For formal quotes and contracts</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-border/70">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Location &amp; Availability
                  </h4>
                  <p className="font-semibold text-sm sm:text-base text-foreground">
                    {siteInfo.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {siteInfo.officeHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Follow &amp; Connect Online:
              </h4>
              <SocialLinks size="md" />
            </div>
          </div>

          {/* Right Column: Quick Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-heading font-bold text-2xl text-foreground">
                  Send a Quick Message
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Fill in your details to send a direct WhatsApp message or email inquiry.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. David Mwangi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Service You Need *</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">How Urgent Is This? *</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    >
                      {urgencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3-Tier Kenyan Location Selector (County -> Constituency -> Ward) */}
                <div className="space-y-1.5 pt-1">
                  <KenyaLocationPicker
                    initialCounty="Nairobi City"
                    initialConstituency="Westlands"
                    initialWard="Parklands / Highridge"
                    onChange={handleLocationChange}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.co.ke"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Describe what you need help with *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. Our office Wi-Fi keeps disconnecting during peak hours, and we need 4 new security cameras installed at our Westlands branch..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                  />
                </div>

                {/* Dual Submit Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-md transition-all hover:shadow-glow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message on WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-sm transition-colors"
                  >
                    <Send className="w-4 h-4 text-teal-500" />
                    <span>{isSubmitting ? "Sending..." : "Submit Form"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Client Submission Confirmation Modal */}
    <SubmissionSuccessModal
      isOpen={!!successModalDetails}
      onClose={() => setSuccessModalDetails(null)}
      details={successModalDetails}
    />
    </>
  );
};
export default Contact;


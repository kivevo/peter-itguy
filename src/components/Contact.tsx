import React, { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE_CONFIG, SERVICES, getWhatsAppUrl } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Calendar,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: SERVICES[0].title,
    urgency: "Standard (This Week)",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urgencyOptions = [
    { label: "Emergency / Immediate Triage (Today)", value: "Emergency / Today" },
    { label: "Standard Business Request (This Week)", value: "Standard (This Week)" },
    { label: "Planning / Future Project Quote", value: "Planning / Future Quote" },
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
    return `Hi Peter,\n\nMy name is ${formData.name || "[Your Name]"}.\nService Needed: ${formData.service}\nUrgency: ${formData.urgency}\nPhone: ${formData.phone || "N/A"}\n\nDetails: ${formData.message || "I'd like to get support or a quote for my business."}`;
  };

  const handleSendViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getWhatsAppUrl(generateWhatsAppMessage());
    window.open(url, "_blank");
    toast({
      title: "Opening WhatsApp...",
      description: "Your structured inquiry message has been prepared for Peter.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Inquiry Received!",
        description: "Thank you Peter will review your details and respond within 2-4 hours.",
      });
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: SERVICES[0].title,
        urgency: "Standard (This Week)",
        message: "",
      });
    }, 800);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Line & Lead Intake</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Let's Fix Your IT Issues or <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Build Your Next Website</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            WhatsApp is the quickest way to get my attention in Kenya. You can also submit the intake form below or call directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Details & WhatsApp Channel */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Kenyan WhatsApp Box */}
            <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    Instant WhatsApp Support
                  </h3>
                  <p className="text-xs text-teal-100">
                    Highest conversion & fastest response time in Kenya
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
                Whether you need same-day emergency on-site dispatch in Nairobi or a 15-minute remote diagnostic, send a message directly to my active WhatsApp line.
              </p>

              <a
                href={getWhatsAppUrl("Hi Peter, I need urgent IT assistance.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-teal-900 font-bold text-sm shadow-md transition-transform duration-200 hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Message +254 751 035 034</span>
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
                    Direct Phone Line
                  </h4>
                  <a
                    href={`tel:${SITE_CONFIG.phoneTel}`}
                    className="font-mono text-sm sm:text-base font-bold text-foreground hover:text-teal-500 transition-colors"
                  >
                    {SITE_CONFIG.phoneDisplay}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">Emergency calls answered 24/7</p>
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
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="font-mono text-sm sm:text-base font-bold text-foreground hover:text-teal-500 transition-colors break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                  <p className="text-xs text-muted-foreground mt-0.5">For formal RFPs & detailed scopes</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-border/70">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Base Location & Coverage
                  </h4>
                  <p className="font-semibold text-sm sm:text-base text-foreground">
                    {SITE_CONFIG.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {SITE_CONFIG.officeHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Channels Card */}
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Follow & Connect Across Platforms:
              </h4>
              <SocialLinks size="md" />
            </div>
          </div>

          {/* Right Column: Interactive Lead Qualification & Booking Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-heading font-bold text-2xl text-foreground">
                  Send a Structured Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Select your service requirements to generate a pre-qualified WhatsApp message or email dispatch.
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
                    <label className="text-xs font-semibold text-foreground">Service Required *</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Urgency Level *</label>
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
                    Describe your problem or requirements *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="e.g. Our office Wi-Fi keeps disconnecting during peak hours, and we need 4 new IP CCTV cameras installed at our Westlands branch..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                  />
                </div>

                {/* Dual Submit Options: WhatsApp vs Web Form */}
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
  );
};
export default Contact;

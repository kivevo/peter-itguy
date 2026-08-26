import React from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE_CONFIG, SERVICES, getWhatsAppUrl } from "@/config/site";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp, 
  MessageCircle, 
  ShieldCheck 
} from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "How I Work", href: "#process" },
    { label: "About Peter", href: "#about" },
    { label: "Contact & Quotations", href: "#contact" },
  ];

  return (
    <footer className="bg-muted/50 dark:bg-navy-950 border-t border-border text-foreground relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Overview */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo size="md" />
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Your on-call IT partner in Nairobi. Providing enterprise-grade remote IT support countrywide, on-site network & CCTV installations, and high-speed commercial websites.
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.phoneTel}`} className="hover:text-foreground">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-foreground">
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                <span>{SITE_CONFIG.location}</span>
              </div>
            </div>

            {/* Complete Social Media Suite */}
            <div className="pt-2">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                Connect & Follow:
              </p>
              <SocialLinks size="md" />
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Dedicated Services */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors block"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <a
                href={getWhatsAppUrl("Hi Peter, I'd like to book an IT network audit.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-sm transition-all hover:shadow-glow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Request IT Audit</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Peter Kivevo John (The IT Guy). All rights reserved. • Nairobi, Kenya
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-foreground font-medium"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-teal-500" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

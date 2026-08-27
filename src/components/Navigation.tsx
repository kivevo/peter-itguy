import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { SocialLinks } from "@/components/SocialLinks";
import { useTheme } from "@/hooks/use-theme";
import { SITE_CONFIG, getWhatsAppUrl } from "@/config/site";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  MessageCircle, 
  Phone, 
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  FolderGit2,
  UserCheck,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: Shield },
    { label: "Services", href: "/services", icon: Layers },
    { label: "Case Studies", href: "/case-studies", icon: FolderGit2 },
    { label: "How I Work", href: "/process", icon: Sparkles },
    { label: "About", href: "/about", icon: UserCheck },
    { label: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/85 dark:bg-navy-900/85 backdrop-blur-md border-b border-border/80 shadow-sm"
          : "bg-background/60 dark:bg-navy-950/60 backdrop-blur-sm border-b border-border/30"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 bg-teal-500/10 font-bold border border-teal-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Availability Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-700 dark:text-teal-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>Available in Nairobi</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-navy-800" />
              )}
            </button>

            {/* Download Profile PDF */}
            <a
              href="/Peter_Kivevo_IT_Profile.pdf"
              download="Peter_Kivevo_IT_Consultant_Profile.pdf"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Download Executive Profile / CV (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-teal-500" />
              <span>Profile (PDF)</span>
            </a>

            {/* WhatsApp Direct CTA */}
            <a
              href={getWhatsAppUrl("Hi Peter, I need IT support / consultation for my business.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm shadow-sm transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Peter</span>
            </a>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-border text-muted-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-navy-800" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg border border-border text-foreground hover:bg-muted focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/10 text-xs font-medium text-teal-700 dark:text-teal-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>On-site Nairobi & Countrywide Remote</span>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 bg-teal-500/10 font-bold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={getWhatsAppUrl("Hi Peter, I need urgent IT assistance.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm shadow-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:${SITE_CONFIG.phoneTel}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-muted"
            >
              <Phone className="w-4 h-4 text-teal-500" />
              <span>Call: {SITE_CONFIG.phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Social Links */}
          <div className="pt-2 border-t border-border/70 flex justify-center">
            <SocialLinks size="sm" />
          </div>
        </div>
      )}
    </header>
  );
};
export default Navigation;
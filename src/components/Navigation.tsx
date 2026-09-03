import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useTheme } from "@/hooks/use-theme";
import { getWhatsAppUrl } from "@/config/site";
import { dataStorage } from "@/services/dataStorage";
import { NetworkStatusPill } from "@/components/NetworkStatusPill";
import CommandPalette from "@/components/CommandPalette";
import DigitalContactCardModal from "@/components/DigitalContactCardModal";
import EmergencyBanner from "@/components/EmergencyBanner";
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
  Search,
  QrCode,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteInfo, setSiteInfo] = useState(dataStorage.getSiteContent().siteInfo);
  const [commandOpen, setCommandOpen] = useState(false);
  const [contactCardOpen, setContactCardOpen] = useState(false);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCommandOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [handleGlobalKey]);

  useEffect(() => {
    const load = () => setSiteInfo(dataStorage.getSiteContent().siteInfo);
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/", icon: Shield },
    { label: "Services", href: "/services", icon: Layers },
    { label: "Case Studies", href: "/case-studies", icon: FolderGit2 },
    { label: "How I Work", href: "/process", icon: Sparkles },
    { label: "About", href: "/about", icon: UserCheck },
    { label: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
      {/* 1. Live On-Call Emergency Banner (Unified at top of fixed header — zero stacking overlap) */}
      <EmergencyBanner />

      {/* 2. Main Navigation Bar */}
      <div 
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/97 dark:bg-navy-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-lg shadow-black/5"
            : "bg-white/90 dark:bg-navy-950/85 backdrop-blur-lg border-b border-slate-200/70 dark:border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
            {/* Left: Brand Identity */}
            <Link 
              to="/" 
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center gap-2 group focus:outline-none flex-shrink-0"
            >
              <BrandLogo size="md" />
            </Link>

            {/* Center: Desktop Navigation Capsule (Large Screens >= 1024px) */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-100/80 dark:bg-navy-900/60 p-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-inner flex-shrink-0">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={(e) => {
                      if (link.href === "/" && location.pathname === "/") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`px-3 xl:px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 border border-teal-400/40 font-extrabold"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions, Utilities & CTA */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              {/* Live Latency Status Pill (Extra Large screens only to keep tablet spacious) */}
              <div className="hidden xl:block">
                <NetworkStatusPill />
              </div>

              {/* Command Palette Search Trigger */}
              {/* Desktop Full Search Pill (>= 1024px) */}
          <button
                type="button"
                onClick={() => setCommandOpen(true)}
                aria-label="Open command palette (Ctrl+K)"
                title="Search commands, tools & services (Ctrl+K)"
                className="hidden lg:inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-border/80 hover:border-teal-500/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all shadow-sm group"
              >
                <Search className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
                <span>Search...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-muted/80 border border-slate-200 dark:border-border text-[10px] font-mono">⌘K</kbd>
              </button>

              {/* Tablet & Mobile Search Icon Button (< 1024px) */}
              <button
                onClick={() => setCommandOpen(true)}
                aria-label="Open search"
                title="Search services & tools"
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-border/80 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-500/40 transition-all shadow-sm flex items-center justify-center focus:outline-none"
              >
                <Search className="w-4 h-4 text-teal-500" />
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-border/80 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-sm flex items-center justify-center"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* High-Converting WhatsApp Direct CTA Button */}
              <a
                href={getWhatsAppUrl("Hi Peter, I need IT support / consultation for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Peter</span>
              </a>

              {/* Mobile Menu Hamburger Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-border/80 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 focus:outline-none shadow-sm transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE SLIDE-DOWN DRAWER (Screens < 1024px)                            */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full border-b border-border/90 bg-background/98 dark:bg-navy-950/98 backdrop-blur-2xl px-4 sm:px-6 pt-4 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {/* Status Alert Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-800 dark:text-teal-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available in Nairobi & Remote Kenya</span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20">
              15m Response
            </span>
          </div>

          {/* Navigation Links List */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e) => {
                    if (link.href === "/" && location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                    isActive
                      ? "text-white bg-teal-600 shadow-md"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-teal-500"}`} />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-white/80" : "text-slate-400 dark:text-slate-500"}`} />
                </Link>
              );
            })}
          </div>

          {/* Search Trigger for Mobile */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setCommandOpen(true);
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-border/80 text-slate-600 dark:text-slate-400 text-xs font-mono"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-500" />
              <span>Search Tools & Diagnostics...</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-muted/80 border border-slate-200 dark:border-border text-[10px]">⌘K</kbd>
          </button>

          {/* Primary Mobile Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={getWhatsAppUrl("Hi Peter, I need urgent IT assistance.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 text-white font-bold text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Peter on WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${siteInfo.phoneTel}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-navy-900 text-slate-800 dark:text-white font-semibold text-xs hover:bg-slate-50 dark:hover:bg-navy-800"
              >
                <Phone className="w-3.5 h-3.5 text-teal-500" />
                <span>Call Peter</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setContactCardOpen(true);
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-navy-900 text-slate-800 dark:text-white font-semibold text-xs hover:bg-slate-50 dark:hover:bg-navy-800"
              >
                <QrCode className="w-3.5 h-3.5 text-teal-500" />
                <span>Save Contact</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette & Digital Contact Card Modals */}
      <CommandPalette
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onOpenContactCard={() => setContactCardOpen(true)}
      />
      <DigitalContactCardModal
        isOpen={contactCardOpen}
        onClose={() => setContactCardOpen(false)}
      />
    </header>
  );
};

export default Navigation;
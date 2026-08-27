import React from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getWhatsAppUrl } from "@/config/site";
import { ArrowLeft, Home, MessageCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg w-full text-center space-y-6 relative z-10 p-8 sm:p-10 rounded-3xl bg-card dark:bg-navy-900 border border-border shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Error 404 • Route Not Found
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground">
              Page Not Found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page or resource you are looking for might have been moved or doesn't exist.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-sm transition-all hover:shadow-glow"
            >
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>

            <a
              href={getWhatsAppUrl("Hi Peter, I was browsing your website and hit a missing link.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contact Peter</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default NotFound;

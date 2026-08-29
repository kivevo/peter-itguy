import React, { useState, useEffect } from "react";
import { dataStorage, SiteBannerConfig } from "@/services/dataStorage";
import { getWhatsAppUrl } from "@/config/site";
import { Zap, X, MessageCircle, ChevronRight } from "lucide-react";

export const EmergencyBanner: React.FC = () => {
  const [config, setConfig] = useState<SiteBannerConfig>(dataStorage.getBannerConfig());
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const update = () => {
      setConfig(dataStorage.getBannerConfig());
    };
    update();
    const unsubscribe = dataStorage.subscribe(update);
    return () => unsubscribe();
  }, []);

  if (!config.enabled || isDismissed) return null;

  return (
    <aside aria-label="Announcement" className="relative z-50 bg-gradient-to-r from-teal-900 via-navy-900 to-teal-950 text-white border-b border-teal-500/30 text-xs shadow-sm">
      <div className="container mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono text-[10px] font-bold border border-teal-500/30 uppercase tracking-wider flex-shrink-0">
            {config.badgeText}
          </span>

          <p className="truncate font-medium text-slate-200 text-xs">
            {config.message}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={getWhatsAppUrl(`Hi Peter, I saw your live on-call banner on the website and need fast IT assistance.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] shadow-sm transition-all hover:scale-105"
          >
            <MessageCircle className="w-3 h-3" />
            <span>{config.linkText}</span>
            <ChevronRight className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EmergencyBanner;

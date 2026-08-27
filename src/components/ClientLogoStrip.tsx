import React from "react";
import { CLIENT_PARTNERS } from "@/config/site";
import { Building2, ExternalLink, ShieldCheck } from "lucide-react";

export const ClientLogoStrip: React.FC = () => {
  return (
    <section className="py-10 bg-muted/40 dark:bg-navy-950/70 border-y border-border/70 select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Technical Work Delivered For &amp; Trusted By
            </p>
          </div>
          <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400">
            Nairobi CBD, Westlands &amp; Countrywide Branches
          </span>
        </div>

        {/* Responsive Client Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CLIENT_PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="p-3.5 rounded-2xl bg-card dark:bg-navy-900 border border-border/80 flex flex-col justify-between hover:border-teal-500/50 transition-all duration-200 shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-teal-500 transition-colors"
                      title={`Visit ${partner.name}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </div>

                <h4 className="font-heading font-bold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {partner.name}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {partner.industry}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50">
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground block truncate">
                  {partner.badgeText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogoStrip;

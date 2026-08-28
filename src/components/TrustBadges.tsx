import React from "react";
import { CREDENTIALS_LIST } from "@/config/site";
import { Award, CheckCircle2 } from "lucide-react";

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-14 bg-background dark:bg-navy-950 border-t border-border/70 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Credentials &amp; Proven Experience</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Academic Degree, ISP Background &amp; Certified Hardware Experience
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Verifiable qualifications you can trust for your business technology.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CREDENTIALS_LIST.map((cred, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-card dark:bg-navy-900 border border-border shadow-sm flex flex-col justify-between space-y-3 hover:border-teal-500/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">
                    {cred.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      cred.status === "Verified"
                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-teal-500" />
                    {cred.status}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-sm sm:text-base text-foreground leading-snug">
                  {cred.title}
                </h4>
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 font-mono">
                  {cred.issuer}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cred.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

import React from "react";
import { CASE_STUDIES, WEB_PORTFOLIO_LINKS, getWhatsAppUrl } from "@/config/site";
import { 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpRight, 
  FolderGit2, 
  Globe, 
  MessageCircle 
} from "lucide-react";

export const Portfolio: React.FC = () => {
  return (
    <section id="case-studies" className="py-20 lg:py-28 bg-muted/30 dark:bg-navy-900/60 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Proven Client Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Featured Case Studies &amp; <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Real-World Turnarounds</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            See how I fix severe downtime, speed up slow websites, and keep multi-branch businesses running smoothly.
          </p>
        </div>

        {/* Deep Dive Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {CASE_STUDIES.filter((c) => c.id !== "web-showcase").map((study) => (
            <div
              key={study.id}
              className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-7 flex flex-col justify-between hover:border-teal-500/50 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Category & Hero Metric */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {study.category}
                    </span>
                    {study.liveUrlText && (
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        {study.liveUrlText}
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-800 dark:text-teal-300">
                    ⚡ {study.heroMetric}
                  </div>
                </div>

                {/* Title & Client */}
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                    {study.title}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">
                    Client: {study.client}
                  </p>
                </div>

                {/* Problem vs Solution Summary */}
                <div className="space-y-2.5 text-xs text-muted-foreground">
                  <p className="leading-relaxed">
                    <strong className="text-foreground">Challenge:</strong> {study.problem}
                  </p>
                  
                  <div className="space-y-1.5 pt-1">
                    <strong className="text-foreground block">What Peter Did:</strong>
                    {study.solution.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-foreground/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technologies Strip & Footer */}
              <div className="mt-6 pt-4 border-t border-border/70 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {study.technologies.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={getWhatsAppUrl(`Hi Peter, I was reading your case study on ${study.title} and want to discuss similar help.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted hover:bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Discuss Similar Project</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Web Development Portfolio Strip Showcase */}
        <div className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Live Website Portfolio</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                Fast Business Websites Built for Kenyan Companies
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Opens in under 2 seconds on mobile data and designed to get direct phone calls and WhatsApp orders.
              </p>
            </div>
            <a
              href={getWhatsAppUrl("Hi Peter, I need a modern business website built for my company.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm flex-shrink-0 transition-all hover:shadow-glow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get a Website Quote</span>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEB_PORTFOLIO_LINKS.map((site) => (
              <a
                key={site.domain}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl bg-muted/40 dark:bg-navy-950/70 border border-border/80 hover:border-teal-500 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                      {site.badge}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-teal-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {site.title}
                  </h4>
                  <p className="text-xs font-mono text-teal-600 dark:text-teal-400 mt-0.5 mb-2">
                    {site.domain}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {site.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Opens in &lt; 2s on 4G</span>
                  <span className="font-semibold text-foreground group-hover:text-teal-500 flex items-center gap-1">
                    Visit Live Site <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Portfolio;

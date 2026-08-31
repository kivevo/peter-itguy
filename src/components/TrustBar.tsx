import React, { useEffect, useRef, useState } from "react";
import { dataStorage } from "@/services/dataStorage";
import { 
  Building2, 
  Zap, 
  ShieldAlert, 
  GraduationCap, 
  SmilePlus,
} from "lucide-react";

// Parse numeric + suffix from stat value strings
const parseStatValue = (raw: string): { numeric: number; suffix: string } => {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (match) return { numeric: parseFloat(match[1]), suffix: match[2] };
  return { numeric: 0, suffix: raw }; // non-numeric fallback (e.g. "BSc CS")
};

const ICONS = [Building2, Zap, ShieldAlert, GraduationCap, SmilePlus];

export const TrustBar: React.FC = () => {
  const ref = useRef<HTMLElement>(null!);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [stats, setStats] = useState(dataStorage.getSiteContent().siteInfo?.stats || []);
  const [counts, setCounts] = useState((dataStorage.getSiteContent().siteInfo?.stats || []).map(() => 0));

  useEffect(() => {
    const load = () => {
      const newStats = dataStorage.getSiteContent().siteInfo?.stats || [];
      setStats(newStats);
      setCounts(newStats.map(() => 0));
      setHasAnimated(false);
    };
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          // Stagger the count-up per stat
          stats.forEach((stat, i) => {
            const { numeric } = parseStatValue(stat.value);
            if (numeric === 0) {
              setCounts((prev) => {
                const next = [...prev];
                next[i] = 1; // trigger non-numeric to appear
                return next;
              });
              return;
            }

            const duration = 1400;
            const steps = 50;
            const delay = i * 120;
            const stepTime = duration / steps;

            setTimeout(() => {
              let step = 0;
              const timer = setInterval(() => {
                step++;
                const progress = step / steps;
                // Ease-out cubic
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(easedProgress * numeric);
                setCounts((prev) => {
                  const next = [...prev];
                  next[i] = current;
                  return next;
                });
                if (step >= steps) clearInterval(timer);
              }, stepTime);
            }, delay);
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated, stats]);

  return (
    <section
      id="trust-bar"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative z-20 py-10 bg-muted/40 dark:bg-navy-900/90 border-y border-border/80"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 mb-8">
          Real Proof &amp; Operational Impact
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6 items-start">
          {stats.map((stat, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const { numeric, suffix } = parseStatValue(stat.value);
            const isNonNumeric = numeric === 0;
            const displayValue = isNonNumeric
              ? hasAnimated ? stat.value : "..."
              : `${counts[idx]}${suffix}`;

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-card/70 dark:bg-navy-950/70 border border-border/60 hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <div
                  className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {displayValue}
                </div>
                <div className="text-xs sm:text-sm font-bold text-foreground mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {stat.description}
                </div>
                {stat.methodology && (
                  <div className="mt-2.5 pt-2 border-t border-border/50 text-[10px] text-muted-foreground/80 font-mono italic">
                    ℹ️ {stat.methodology}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;

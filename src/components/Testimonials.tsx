import React, { useState, useEffect, useRef } from "react";
import { TESTIMONIALS } from "@/config/site";
import { Star, Quote } from "lucide-react";

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = TESTIMONIALS.length;

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % total);
      setIsAnimating(false);
    }, 400);
  };

  // Autoplay every 6 seconds — pauses when hovered
  const startAutoplay = () => {
    intervalRef.current = setInterval(() => next(), 6000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeIdx]);

  const item = TESTIMONIALS[activeIdx];

  return (
    <section className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative border-t border-border/80 overflow-hidden">
      {/* Decorative soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Quote className="w-3.5 h-3.5" />
            <span>Client Feedback & Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Trusted Across Nairobi & <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Regional Branch Networks</span>
          </h2>
        </div>

        {/* Clean Testimonial Card */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          {/* Subtle background quote watermark */}
          <div className="absolute -top-8 -left-4 text-[130px] leading-none font-serif text-teal-500/10 dark:text-teal-500/15 select-none pointer-events-none">
            "
          </div>

          <div
            key={activeIdx}
            style={{
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
            className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-8 sm:p-10 lg:p-12 space-y-6"
          >
            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Quote Body */}
            <blockquote className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground leading-relaxed">
              "{item.content}"
            </blockquote>

            {/* Verified Outcome Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
              ⚡ {item.highlight}
            </div>

            {/* Author Information */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/70">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-navy-800 text-white font-heading font-extrabold text-base flex items-center justify-center shadow-md flex-shrink-0">
                {item.avatarText}
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-base">
                  {item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.role} &mdash; <span className="font-semibold text-foreground">{item.company}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

import React, { useState, useEffect, useRef } from "react";
import { dataStorage, ReviewItem } from "@/services/dataStorage";
import { LeaveReviewModal } from "@/components/LeaveReviewModal";
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  PlusCircle, 
  MessageSquareHeart 
} from "lucide-react";

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load reviews from storage & subscribe to live updates
  useEffect(() => {
    const load = () => {
      const all = dataStorage.getApprovedReviews();
      setReviews(all);
    };
    load();
    const unsubscribe = dataStorage.subscribe(load);
    return () => unsubscribe();
  }, []);

  const total = reviews.length;

  const next = () => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % total);
      setIsAnimating(false);
    }, 300);
  };

  const startAutoplay = () => {
    if (total <= 1) return;
    intervalRef.current = setInterval(() => next(), 7500);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeIdx, total]);

  const item = reviews[activeIdx] || reviews[0];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-background dark:bg-navy-950 relative border-t border-border/80 overflow-hidden">
      {/* Decorative soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Quote className="w-3.5 h-3.5" />
            <span>Verified Client Engagements &amp; Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            Client Results Across Nairobi &amp; <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Regional Branch Networks</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Structured case summaries and direct client reviews with attributable business outcomes.
          </p>

          {/* Leave Review Action CTA in Header */}
          <div className="pt-2">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold font-mono transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 text-teal-500" />
              <span>Have you worked with Peter? Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Clean Testimonial Card (without dots) */}
        {item ? (
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
              key={item.id}
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
              className="rounded-3xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-8 sm:p-10 lg:p-12 space-y-6"
            >
              {/* Rating Stars & Verification Tag */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-500" />
                  Attributable Engagement
                </span>
              </div>

              {/* Quote Body */}
              <blockquote className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                "{item.content}"
              </blockquote>

              {/* Verified Outcome Badge */}
              {item.highlight && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                  ⚡ Measurable Result: {item.highlight}
                </div>
              )}

              {/* Author Information */}
              <div className="pt-4 border-t border-border/70">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-600 to-navy-800 text-white font-heading font-extrabold text-sm flex items-center justify-center shadow-md flex-shrink-0">
                    {item.avatarText}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {item.role} &mdash; <span className="font-semibold text-foreground">{item.company}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card dark:bg-navy-900 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold text-xs hover:bg-teal-500/10 transition-colors shadow-sm"
              >
                <MessageSquareHeart className="w-4 h-4 text-teal-500" />
                <span>Submit Your Review</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Leave Review Modal */}
      <LeaveReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={() => {
          // Set to newest review
          setActiveIdx(0);
        }}
      />
    </section>
  );
};

export default Testimonials;

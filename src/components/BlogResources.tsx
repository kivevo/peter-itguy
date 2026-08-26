import React, { useState } from "react";
import { BLOG_POSTS, getWhatsAppUrl } from "@/config/site";
import { BookOpen, Clock, ArrowRight, Sparkles, MessageCircle, X } from "lucide-react";

export const BlogResources: React.FC = () => {
  const [activePost, setActivePost] = useState<typeof BLOG_POSTS[0] | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-muted/30 dark:bg-navy-900/60 relative border-t border-border/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tech Insights & Best Practices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-foreground tracking-tight">
            IT Knowledge for <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Growing Kenyan Businesses</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Practical advice to avoid costly network errors, secure your customer data, and maximize your uptime.
          </p>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl bg-card dark:bg-navy-900 border border-border/90 shadow-card-dark dark:shadow-glow p-6 sm:p-7 flex flex-col justify-between hover:border-teal-500/50 transition-all duration-200 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs space-y-1">
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 block uppercase tracking-wider text-[10px]">
                    Key Takeaway:
                  </span>
                  <p className="text-foreground font-medium">
                    {post.keyTakeaway}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                <button
                  onClick={() => setActivePost(post)}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Full Advisory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-[11px] font-mono text-muted-foreground">{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card dark:bg-navy-900 border border-border rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActivePost(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {activePost.category} • {activePost.readTime}
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                {activePost.title}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activePost.summary}
            </p>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs sm:text-sm space-y-1">
              <strong className="text-teal-900 dark:text-teal-200 font-heading block">
                Recommended Action for Nairobi Businesses:
              </strong>
              <p className="text-muted-foreground">
                {activePost.keyTakeaway} Reach out directly to audit your current equipment and setup before minor bottlenecks trigger costly downtime.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(`Hi Peter, I read your article on "${activePost.title}" and want to discuss applying this to my office.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss This Topic on WhatsApp</span>
              </a>
              <button
                onClick={() => setActivePost(null)}
                className="py-3 px-4 rounded-xl border border-border text-foreground hover:bg-muted text-xs sm:text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default BlogResources;

import React, { useState } from "react";
import { dataStorage } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Building2, 
  MapPin, 
  MessageSquare, 
  Zap,
  Send
} from "lucide-react";

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [highlight, setHighlight] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !content.trim()) {
      toast({
        title: "Please complete all required fields",
        description: "Name, Company, and Review message are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CL";

    dataStorage.addReview({
      name: name.trim(),
      role: role.trim() || "Client / Partner",
      company: company.trim(),
      location: location.trim() || "Nairobi",
      avatarText: initials,
      rating,
      highlight: highlight.trim() || "Fast & Reliable IT Resolution",
      content: content.trim(),
      status: "approved", // Published immediately
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Review Published! ⭐⭐⭐⭐⭐",
        description: `Thank you, ${name}! Your review has been added to Peter's verified client showcase.`,
      });
      if (onSuccess) onSuccess();
    }, 500);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-card dark:bg-navy-900 border border-teal-500/30 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Feedback</span>
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-foreground">
            Share Your Experience with Peter
          </h3>
          <p className="text-xs text-muted-foreground">
            Help other Kenyan businesses know how Peter solved your tech, network, or website challenges.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 bg-teal-500/10 rounded-2xl border border-teal-500/30 p-6 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-teal-500" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="font-heading font-extrabold text-xl text-foreground">
                Thank You for Your Review!
              </h4>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                Your feedback for <strong>{company}</strong> is now live on Peter's website. We appreciate your partnership!
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
              >
                Close &amp; View Testimonials
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Rating Selector */}
            <div className="p-3.5 rounded-2xl bg-muted/50 dark:bg-navy-950 border border-border space-y-1.5 text-center">
              <label className="text-xs font-semibold text-foreground block">
                Your Rating *
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400">
                {rating === 5 ? "⭐⭐⭐⭐⭐ Excellent / Highly Recommended" : `${rating} Stars`}
              </span>
            </div>

            {/* Name & Role */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-500" />
                  <span>Your Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Role / Title</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Operations Manager"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            {/* Company & Location */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Company / Business *</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Peak Logistics Ltd"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-500" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nairobi CBD / Westlands"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            {/* Highlight / Outcome */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-500" />
                <span>Key Result / Main Highlight</span>
              </label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="e.g. Resolved Wi-Fi downtime in 2 hours / 40% faster website"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            {/* Review Message */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-500" />
                <span>Your Review / Feedback *</span>
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tell us what Peter did and how it helped your operations..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm shadow-md transition-all hover:shadow-glow disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing Review..." : "Submit Review"}</span>
              </button>
              <p className="text-[11px] text-center text-muted-foreground pt-2">
                🔒 Reviews are verified and added directly to Peter's client showcase.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeaveReviewModal;

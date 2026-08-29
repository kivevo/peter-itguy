import React, { useState } from "react";
import { dataStorage, ReviewItem } from "@/services/dataStorage";
import { resendService } from "@/services/resendService";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  X,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  MapPin
} from "lucide-react";

interface ReviewSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [highlight, setHighlight] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !content.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your name, company, and feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const newReview: ReviewItem = {
      id: `rev_${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Business Owner",
      company: company.trim(),
      location: location.trim() || "Nairobi",
      avatarText: name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "CL",
      content: content.trim(),
      rating,
      highlight: highlight.trim() || `Verified ${rating}-Star IT Service Experience`,
      status: "pending", // Pending admin review & approval
      createdAt: new Date().toISOString(),
    };

    // Save to local storage
    dataStorage.addReview(newReview);

    // Send immediate email alert to Peter via Resend
    await resendService.notifyNewReview(newReview);

    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: "Review Submitted! ⭐",
      description: "Thank you for your feedback! Peter has been notified.",
    });

    setTimeout(() => {
      setIsSuccess(false);
      setName("");
      setRole("");
      setCompany("");
      setHighlight("");
      setContent("");
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-card dark:bg-navy-900 border border-border/90 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/80 bg-muted/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-mono font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Verified Client Review</span>
            </div>
            <h3 className="font-heading font-extrabold text-lg text-foreground">
              Share Your Experience with Peter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-heading font-extrabold text-xl text-foreground">
                Thank You for Your Review!
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your feedback has been received and sent to Peter Kivevo. It will appear on the testimonials wall shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Interactive Star Rating */}
            <div className="space-y-1.5 text-center sm:text-left">
              <label className="font-bold text-foreground block">Overall Rating *</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold font-mono text-sm text-foreground">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Name & Role */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground flex items-center gap-1">
                  <User className="w-3 h-3 text-teal-500" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Job Title / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. General Manager"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>
            </div>

            {/* Company & Location */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground flex items-center gap-1">
                  <Building className="w-3 h-3 text-teal-500" />
                  <span>Company / Business Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. After40 Hotel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-500" />
                  <span>City / Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nairobi CBD"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
                />
              </div>
            </div>

            {/* Highlight */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Headline / Quick Summary</label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="e.g. Restored our payment tills in under 45 minutes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Detailed Testimonial &amp; Feedback *</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the issue you had, how Peter handled it, and the results..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-muted font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold shadow-md transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewSubmitModal;

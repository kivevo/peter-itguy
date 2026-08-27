import React, { useState } from "react";
import { User, ShieldCheck } from "lucide-react";

interface ProfilePhotoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showStatusBadge?: boolean;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  size = "lg",
  className = "",
  showStatusBadge = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Preferred image paths in public folder
  const photoSrc = "/peter-photo.jpg";

  const sizeClasses = {
    sm: "w-10 h-10 rounded-xl",
    md: "w-14 h-14 rounded-2xl",
    lg: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl",
    xl: "w-36 h-36 sm:w-44 sm:h-44 rounded-3xl",
  };

  const iconSizes = {
    sm: "w-5 h-5 text-teal-400",
    md: "w-7 h-7 text-teal-400",
    lg: "w-12 h-12 text-teal-400",
    xl: "w-16 h-16 text-teal-400",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Outer Glow Ring */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-teal-500/40 to-sky-500/30 blur-sm pointer-events-none" />

      {/* Photo Container */}
      <div
        className={`relative overflow-hidden border-2 border-teal-500/40 bg-navy-900 flex items-center justify-center shadow-lg ${sizeClasses[size]}`}
      >
        {!imageError ? (
          <img
            src={photoSrc}
            alt="Peter Kivevo John — The IT Guy Nairobi"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
          />
        ) : (
          /* Fallback elegant portrait avatar */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 text-teal-300 font-heading font-black">
            <span className={size === "xl" ? "text-5xl" : size === "lg" ? "text-3xl" : "text-xl"}>
              P
            </span>
            {size === "xl" && (
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">
                Engineer
              </span>
            )}
          </div>
        )}
      </div>

      {/* Online Status Pulse Indicator */}
      {showStatusBadge && (
        <span
          className="absolute -bottom-1 -right-1 flex h-4 w-4 rounded-full bg-navy-950 p-0.5 border-2 border-card"
          title="Online & Available in Nairobi"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
        </span>
      )}
    </div>
  );
};

export default ProfilePhoto;

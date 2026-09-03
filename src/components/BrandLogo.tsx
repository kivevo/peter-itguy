import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-11 h-11 sm:w-12 sm:h-12",
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Mark: Navy & Teal Hexagon with "P" and Circuit Node Accent */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brandHexBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a1926" />
              <stop offset="100%" stopColor="#132a3d" />
            </linearGradient>
            <linearGradient id="brandTealStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <filter id="brandGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#14b8a6" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Outer Hexagon with Background and Vibrant Teal Border */}
          <polygon
            points="50,5 92,27 92,73 50,95 8,73 8,27"
            fill="url(#brandHexBg)"
            stroke="url(#brandTealStroke)"
            strokeWidth="5.5"
            strokeLinejoin="round"
            filter="url(#brandGlow)"
          />

          {/* Inner Accent Trace */}
          <polygon
            points="50,13 85,31 85,69 50,87 15,69 15,31"
            stroke="#14b8a6"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Circuit Trace & Top Node */}
          <circle cx="50" cy="22" r="3.5" fill="#2dd4bf" />
          <path
            d="M 50 25.5 L 50 36"
            stroke="#2dd4bf"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="76" cy="50" r="2.5" fill="#2dd4bf" fillOpacity="0.8" />
          <path
            d="M 73.5 50 L 67 50"
            stroke="#2dd4bf"
            strokeOpacity="0.8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Central Letter P */}
          <text
            x="48"
            y="70"
            fontFamily="'Space Grotesk', system-ui, -apple-system, sans-serif"
            fontSize="44"
            fontWeight="900"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="-1"
          >
            P
          </text>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Peter Kivevo
            </span>
            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-400 font-mono font-bold border border-teal-500/25">
              KE
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5 font-medium">
            The IT Guy
          </span>
        </div>
      )}
    </div>
  );
};


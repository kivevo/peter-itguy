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
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Mark: Navy & Teal Hexagon with "P" and Circuit Node Accent */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Hexagon */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            className="fill-navy-900 stroke-teal-500"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Subtle Inner Glow Border */}
          <polygon
            points="50,11 85,30 85,70 50,89 15,70 15,30"
            className="stroke-teal-500/30"
            strokeWidth="1.5"
          />
          {/* Circuit Trace & Top Node */}
          <circle cx="50" cy="22" r="3.5" className="fill-teal-400" />
          <path
            d="M 50 25.5 L 50 37"
            className="stroke-teal-400"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="75" cy="50" r="2.5" className="fill-teal-400/60" />
          <path
            d="M 72.5 50 L 66 50"
            className="stroke-teal-400/60"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Central Letter P */}
          <text
            x="48"
            y="70"
            fontFamily="'Space Grotesk', system-ui, sans-serif"
            fontSize="44"
            fontWeight="800"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            P
          </text>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              Peter Kivevo
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-semibold border border-teal-500/20">
              KE
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase mt-0.5">
            The IT Guy
          </span>
        </div>
      )}
    </div>
  );
};

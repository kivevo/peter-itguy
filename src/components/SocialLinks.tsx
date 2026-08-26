import React from "react";
import { SITE_CONFIG } from "@/config/site";
import { 
  MessageCircle, 
  Linkedin, 
  Github, 
  Mail,
  ExternalLink
} from "lucide-react";

interface SocialLinksProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabels?: boolean;
}

// Custom SVGs for Instagram, TikTok, X (Twitter), YouTube
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.05.92.14V9.45a6.37 6.37 0 0 0-.92-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76c-1-.02-1.9-.38-2.67-.97z" />
  </svg>
);

const TwitterXIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const SocialLinks: React.FC<SocialLinksProps> = ({
  size = "md",
  className = "",
  showLabels = false,
}) => {
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const buttonSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const socialItems = [
    {
      name: "WhatsApp",
      url: SITE_CONFIG.social.whatsapp,
      icon: MessageCircle,
      color: "hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
      handle: "+254 751 035 034",
    },
    {
      name: "Instagram",
      url: SITE_CONFIG.social.instagram,
      customIcon: InstagramIcon,
      color: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-pink-500",
      handle: "@peter_kivevo",
    },
    {
      name: "TikTok",
      url: SITE_CONFIG.social.tiktok,
      customIcon: TikTokIcon,
      color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-slate-400",
      handle: "@peter_kivevo",
    },
    {
      name: "X (Twitter)",
      url: SITE_CONFIG.social.twitter,
      customIcon: TwitterXIcon,
      color: "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-500",
      handle: "@peter_kivevo",
    },
    {
      name: "LinkedIn",
      url: SITE_CONFIG.social.linkedin,
      icon: Linkedin,
      color: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
      handle: "Peter Kivevo",
    },
    {
      name: "GitHub",
      url: SITE_CONFIG.social.github,
      icon: Github,
      color: "hover:bg-slate-800 hover:text-white hover:border-slate-800",
      handle: "peterkivevo",
    },
    {
      name: "YouTube",
      url: SITE_CONFIG.social.youtube,
      customIcon: YouTubeIcon,
      color: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      handle: "@peterkivevo",
    },
  ];

  if (showLabels) {
    return (
      <div className={`grid sm:grid-cols-2 gap-2.5 ${className}`}>
        {socialItems.map((item) => {
          const Icon = item.icon;
          const CustomIcon = item.customIcon;
          return (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-card dark:bg-navy-900 border border-border hover:border-teal-500/50 hover:bg-muted transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center transition-colors ${item.color}`}>
                  {CustomIcon ? <CustomIcon className={iconSizes[size]} /> : Icon ? <Icon className={iconSizes[size]} /> : null}
                </div>
                <div>
                  <h5 className="font-heading font-bold text-xs text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {item.name}
                  </h5>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {item.handle}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {socialItems.map((item) => {
        const Icon = item.icon;
        const CustomIcon = item.customIcon;
        return (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${item.name} — ${item.handle}`}
            aria-label={item.name}
            className={`${buttonSizes[size]} rounded-xl bg-card dark:bg-navy-900 border border-border flex items-center justify-center text-muted-foreground transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 ${item.color}`}
          >
            {CustomIcon ? <CustomIcon className={iconSizes[size]} /> : Icon ? <Icon className={iconSizes[size]} /> : null}
          </a>
        );
      })}
    </div>
  );
};
export default SocialLinks;

import React, { useState, useEffect, ReactNode } from "react";
import { DirectDispatchContext } from "@/hooks/useDirectDispatch";
import { DirectDispatchModal } from "@/components/DirectDispatchModal";

interface WhatsAppProviderProps {
  children: ReactNode;
}

export const WhatsAppProvider: React.FC<WhatsAppProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [service, setService] = useState<string | undefined>(undefined);

  const openDirectMessage = (customMessage?: string, serviceParam?: string) => {
    setMessage(customMessage || "Hi Peter, I need IT help for my business.");
    setService(serviceParam);
    setIsOpen(true);
  };

  const closeDirectMessage = () => {
    setIsOpen(false);
  };

  // Intercept all WhatsApp / external chat link clicks to show on-site direct form
  useEffect(() => {
    const handleGlobalLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      if (
        href.includes("wa.me") || 
        href.includes("web.whatsapp.com") || 
        href.includes("api.whatsapp.com")
      ) {
        // Prevent navigating outside the website
        e.preventDefault();
        e.stopPropagation();

        let extractedMessage = "";
        try {
          const urlObj = new URL(href, window.location.origin);
          extractedMessage = urlObj.searchParams.get("text") || "";
        } catch {
          const textMatch = href.match(/text=([^&]+)/);
          if (textMatch) {
            extractedMessage = decodeURIComponent(textMatch[1]);
          }
        }

        openDirectMessage(extractedMessage || undefined);
      }
    };

    document.addEventListener("click", handleGlobalLinkClick, true);
    return () => {
      document.removeEventListener("click", handleGlobalLinkClick, true);
    };
  }, []);

  return (
    <DirectDispatchContext.Provider value={{ openDirectMessage, closeDirectMessage }}>
      {children}

      {/* On-Page Direct Message Modal */}
      <DirectDispatchModal
        isOpen={isOpen}
        onClose={closeDirectMessage}
        initialMessage={message}
        initialService={service}
      />
    </DirectDispatchContext.Provider>
  );
};

export default WhatsAppProvider;

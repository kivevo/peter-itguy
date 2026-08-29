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

  // Direct Message triggers via explicit custom handlers rather than intercepting external links
  useEffect(() => {
    const handleExplicitDispatchTrigger = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-open-dispatch='true']");
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      const customMsg = target.getAttribute("data-dispatch-message");
      const serviceParam = target.getAttribute("data-dispatch-service");
      openDirectMessage(customMsg || undefined, serviceParam || undefined);
    };

    document.addEventListener("click", handleExplicitDispatchTrigger, true);
    return () => {
      document.removeEventListener("click", handleExplicitDispatchTrigger, true);
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

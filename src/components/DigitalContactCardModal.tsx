import React, { useState, useEffect } from "react";
import { dataStorage } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import {
  X,
  QrCode,
  Download,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Check,
  ExternalLink,
  Copy,
  Share2,
  Sparkles
} from "lucide-react";

interface DigitalContactCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalContactCardModal: React.FC<DigitalContactCardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [siteInfo, setSiteInfo] = useState(dataStorage.getSiteContent().siteInfo);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = () => setSiteInfo(dataStorage.getSiteContent().siteInfo);
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  // Generate standard vCard (.vcf) format
  const handleDownloadVCard = () => {
    const vcardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${siteInfo.name};;;;`,
      `FN:${siteInfo.name}`,
      `ORG:Krenovate Systems / ${siteInfo.brandName}`,
      `TITLE:${siteInfo.shortTitle}`,
      `TEL;TYPE=CELL,VOICE:${siteInfo.phoneTel}`,
      `TEL;TYPE=WORK,VOICE:${siteInfo.phoneTel}`,
      `EMAIL;TYPE=INTERNET,PREF:${siteInfo.email}`,
      `URL:https://peterkivevo.com`,
      `ADR;TYPE=WORK:;;P.O. Box 79240-00200;Nairobi;;00100;Kenya`,
      `NOTE:Enterprise IT Support, Office Wi-Fi, CCTV Installations, and High-Speed Websites in Kenya.`,
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${siteInfo.name.replace(/\s+/g, "_")}_IT_Consultant.vcf`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Contact Card Saved! 📱",
      description: "Tap the downloaded file on your phone to add Peter directly to your address book.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    toast({ title: "Website Link Copied! 📋", description: "Share with colleagues or business partners." });
    setTimeout(() => setCopied(false), 2000);
  };

  // QR Code URL (Points to Peter's official WhatsApp with introductory greeting)
  const qrTargetUrl = `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent("Hi Peter, I scanned your digital contact card on the website.")}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrTargetUrl)}&margin=8`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card dark:bg-navy-900 border border-border/90 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header gradient banner */}
        <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-navy-900 text-white p-6 pt-7 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center mb-3">
            <ProfilePhoto size="lg" showStatusBadge={true} />
          </div>

          <h3 className="font-heading font-extrabold text-xl text-white">{siteInfo.name}</h3>
          <p className="text-xs text-teal-100 font-mono mt-0.5">{siteInfo.shortTitle}</p>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          {/* Interactive QR Code Card */}
          <div className="flex flex-col items-center p-4 rounded-2xl bg-muted/40 dark:bg-navy-950 border border-border/80 text-center space-y-2">
            <div className="w-36 h-36 rounded-xl bg-white p-2 border shadow-sm flex items-center justify-center">
              <img
                src={qrApiUrl}
                alt="Peter Kivevo WhatsApp QR Code"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-teal-500" />
              <span>Scan with phone camera to open WhatsApp</span>
            </p>
          </div>

          {/* Quick Direct Actions */}
          <div className="space-y-2">
            <button
              onClick={handleDownloadVCard}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Save Peter to Phone Contacts (.vcf)</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={`https://wa.me/${siteInfo.whatsappNumber}?text=Hi%20Peter,%20saved%20your%20digital%20contact%20card.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/20 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${siteInfo.phoneTel}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-muted hover:bg-slate-200 dark:hover:bg-navy-800 text-foreground font-bold text-xs border border-border transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-teal-500" />
                <span>Call Directly</span>
              </a>
            </div>
          </div>

          {/* Contact Details Breakdown */}
          <div className="pt-2 border-t border-border/70 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-500" />
                <span>Phone / WhatsApp:</span>
              </span>
              <span className="font-mono font-bold text-foreground">{siteInfo.phoneDisplay}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-500" />
                <span>Email:</span>
              </span>
              <span className="font-mono text-foreground truncate max-w-[200px]">{siteInfo.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-500" />
                <span>Location:</span>
              </span>
              <span className="font-medium text-foreground">{siteInfo.location}</span>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied to Clipboard!" : "Share Profile Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalContactCardModal;

import { InvoiceItem } from "@/services/dataStorage";

export interface TurnkeyPackage {
  id: string;
  name: string;
  category: "networking" | "cctv" | "web" | "hardware" | "sla" | "pos" | "backup";
  icon: string;
  badge: string;
  tagline: string;
  description: string;
  defaultDocType: "quotation" | "invoice";
  items: Array<{
    desc: string;
    qty: number;
    unitPrice: number;
  }>;
  suggestedNotes?: string;
}

export interface CatalogItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  unitPrice: number;
  defaultQty: number;
}

export const TURNKEY_PACKAGES: TurnkeyPackage[] = [
  {
    id: "wifi_corporate",
    name: "🏢 Corporate Wi-Fi 6 & Gigabit VLAN Network",
    category: "networking",
    icon: "Wifi",
    badge: "Most Popular",
    tagline: "High-density enterprise wireless coverage for offices, restaurants & hotels",
    description: "Complete seamless roaming Wi-Fi with isolated Guest & Staff VLANs, gigabit PoE power, and cloud controller.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "Ubiquiti UniFi U6-Pro Dual-Band Wi-Fi 6 Enterprise Access Point (Installed & Ceiling-Mounted)",
        qty: 2,
        unitPrice: 19500,
      },
      {
        desc: "16-Port Gigabit PoE+ Managed Switch (802.3at, 120W Power Budget, VLAN Traffic Isolation)",
        qty: 1,
        unitPrice: 24000,
      },
      {
        desc: "Cat6 Pure Copper Solid UTP Cable (Roll - 305m) with High-Speed Shielded RJ45 Connectors",
        qty: 1,
        unitPrice: 16500,
      },
      {
        desc: "MikroTik hEX S Gigabit Router / Dual-WAN Failover & Bandwidth Shaper Setup",
        qty: 1,
        unitPrice: 13500,
      },
      {
        desc: "Professional On-Site Trunking, Structured Cable Termination, VLAN Tagging & Heatmap Testing",
        qty: 1,
        unitPrice: 15000,
      },
    ],
    suggestedNotes: "• 1-Year hardware warranty on Ubiquiti & MikroTik equipment.\n• Includes complimentary 30-day post-installation remote tuning.\n• 70% deposit upon milestone sign-off, 30% upon final speed validation.",
  },
  {
    id: "cctv_4cam",
    name: "📹 4-Camera HD Night-Vision CCTV Security Package",
    category: "cctv",
    icon: "ShieldCheck",
    badge: "Turnkey CCTV",
    tagline: "Crystal clear 5MP surveillance with instant live mobile phone streaming",
    description: "4 weather-proof night-vision cameras, 4K NVR with 2TB surveillance storage and mobile app setup for directors.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "Hikvision / Dahua 5MP Smart Hybrid Light Audio IP Bullet / Dome Cameras (ColorVu Night-Vision)",
        qty: 4,
        unitPrice: 5800,
      },
      {
        desc: "4-Channel 4K PoE Network Video Recorder (NVR) with AI Human & Vehicle Motion Detection",
        qty: 1,
        unitPrice: 16500,
      },
      {
        desc: "Seagate SkyHawk / WD Purple 2TB 24/7 Surveillance Hard Drive (Stores 30+ Days Video)",
        qty: 1,
        unitPrice: 12500,
      },
      {
        desc: "Heavy Duty 12V Centralized Power Supply & Surge Protector Power Distribution Box",
        qty: 1,
        unitPrice: 6500,
      },
      {
        desc: "Cat6 Solid Core Surveillance Cabling & Waterproof Junction Boxes (per point)",
        qty: 4,
        unitPrice: 2500,
      },
      {
        desc: "Installation, Channel Alignment, NVR Configuration & Encrypted Remote Phone App Access",
        qty: 1,
        unitPrice: 12000,
      },
    ],
    suggestedNotes: "• 2-Year replacement warranty on CCTV cameras and NVR.\n• Mobile app allows live viewing, playback, and push alerts from anywhere.\n• Payment: 60% on hardware delivery, 40% on testing and handover.",
  },
  {
    id: "cctv_8cam",
    name: "📹 8-Camera Enterprise CCTV Security System",
    category: "cctv",
    icon: "ShieldCheck",
    badge: "Enterprise Security",
    tagline: "Comprehensive perimeter and interior coverage for warehouses, yards & premises",
    description: "8 high-resolution 5MP ColorVu cameras, 8-Channel 4K NVR with 4TB storage, 9U server rack, and UPS battery backup.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "Hikvision / Dahua 5MP ColorVu Audio IP Cameras (Waterproof IP67 Metal Housing)",
        qty: 8,
        unitPrice: 5800,
      },
      {
        desc: "8-Channel 4K Ultra HD PoE NVR with Smart Motion Grid Analytics",
        qty: 1,
        unitPrice: 24500,
      },
      {
        desc: "WD Purple 4TB 24/7 Heavy-Duty Surveillance Hard Drive (60+ Days Continuous Recording)",
        qty: 1,
        unitPrice: 18500,
      },
      {
        desc: "9U Wall-Mounted Glass Front Data Cabinet with PDU Power Bar & Cooling Fans",
        qty: 1,
        unitPrice: 14000,
      },
      {
        desc: "APC / Mercury 1000VA Line-Interactive UPS Battery Backup (Protects from Power Surges & Blackouts)",
        qty: 1,
        unitPrice: 16500,
      },
      {
        desc: "Cat6 Pure Copper Structured Cabling Runs with Conduit PVC Piping & Weatherproof Enclosures",
        qty: 8,
        unitPrice: 2500,
      },
      {
        desc: "Turnkey Installation, Camera Tuning, Network Security Hardening & Multi-Device Viewing Setup",
        qty: 1,
        unitPrice: 20000,
      },
    ],
    suggestedNotes: "• All cables securely piped in high-grade PVC conduit.\n• 2-Year warranty on cameras and NVR.\n• Delivery and deployment within 3 business days.",
  },
  {
    id: "website_corporate",
    name: "🌐 High-Speed Corporate Business Website & Email",
    category: "web",
    icon: "Globe",
    badge: "Sub-2s Speed",
    tagline: "Fast, Google-optimized business website that converts Kenyan visitors into paying clients",
    description: "Modern responsive web development, .co.ke/.com domain, Google Workspace business email, and WhatsApp CTA integration.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "Modern Responsive Business Website Design & Development (Up to 6 Custom High-Converting Pages)",
        qty: 1,
        unitPrice: 38000,
      },
      {
        desc: "Ultra-Fast Edge CDN Cloud Hosting & SSL Certificate Setup (1-Year Pre-Configured)",
        qty: 1,
        unitPrice: 12000,
      },
      {
        desc: "Corporate Domain Registration (.co.ke / .com) + DNS & Cloudflare DDoS Shielding",
        qty: 1,
        unitPrice: 4500,
      },
      {
        desc: "Google Workspace / Professional Email Setup with DKIM, SPF & DMARC Deliverability",
        qty: 1,
        unitPrice: 8500,
      },
      {
        desc: "WhatsApp CRM Direct-Chat Automation, Lead Intake Forms & Google My Business SEO Ranking",
        qty: 1,
        unitPrice: 9000,
      },
    ],
    suggestedNotes: "• Delivery turnaround: 7 to 10 working days.\n• Includes 6 months free technical support, bug fixing, and content updates.\n• 50% deposit on project kickoff, 50% upon live launch.",
  },
  {
    id: "sla_monthly",
    name: "🛠️ Monthly SLA IT Retainer (Up to 10 Workstations)",
    category: "sla",
    icon: "Clock",
    badge: "Retainer SLA",
    tagline: "Peace-of-mind monthly managed IT support with guaranteed < 45 min response time",
    description: "Scheduled preventive maintenance, cybersecurity updates, network monitoring, and on-call technician dispatches.",
    defaultDocType: "invoice",
    items: [
      {
        desc: "Comprehensive Monthly IT Support & Preventive Maintenance Retainer (Up to 10 PCs/Laptops)",
        qty: 1,
        unitPrice: 25000,
      },
      {
        desc: "Enterprise Endpoint Antivirus & Ransomware Shield Licensing with Automated Cloud Definition Updates",
        qty: 10,
        unitPrice: 600,
      },
      {
        desc: "Office Wi-Fi, Router, Firewall & Internet Link Health Monitoring & Speed Optimization",
        qty: 1,
        unitPrice: 6000,
      },
      {
        desc: "Unlimited Remote Helpdesk (Mon-Sat 8AM-6PM) + 2 Emergency Same-Day On-Site Visits Included",
        qty: 1,
        unitPrice: 8000,
      },
    ],
    suggestedNotes: "• Invoice for monthly IT management services.\n• Payable monthly in advance on the 1st of each calendar month.\n• Covers both hardware triage and all software/operating system maintenance.",
  },
  {
    id: "hardware_speedup",
    name: "💻 5-Workstation Office Speed Booster & SSD Upgrade",
    category: "hardware",
    icon: "Laptop",
    badge: "10x Speedup",
    tagline: "Revitalize slow office computers to run like brand new without buying new PCs",
    description: "High-speed NVMe/SATA SSD upgrades, RAM expansion, OS reinstallation, and dust removal.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "Kingston / Crucial 500GB High-Speed SSD with 550MB/s Read Speed (3-Year Warranty)",
        qty: 5,
        unitPrice: 4800,
      },
      {
        desc: "8GB / 16GB DDR4 High-Performance RAM Upgrade Module",
        qty: 5,
        unitPrice: 3800,
      },
      {
        desc: "Data Migration, OS Clean Reinstallation (Windows 11 Pro 64-bit), Driver Optimization & Office Setup",
        qty: 5,
        unitPrice: 2500,
      },
      {
        desc: "Internal Deep Hardware Dust Cleaning, CPU Thermal Paste Replacement & Fan Servicing",
        qty: 5,
        unitPrice: 1200,
      },
      {
        desc: "650VA Line-Interactive UPS Battery Surge Protector (per machine protection)",
        qty: 2,
        unitPrice: 6500,
      },
    ],
    suggestedNotes: "• Boosts PC boot time from 3 minutes to under 12 seconds.\n• 100% zero data loss guarantee during SSD migration.\n• Turnaround: Same-day service for all 5 machines.",
  },
  {
    id: "pos_retail",
    name: "💳 Point of Sale (POS) Hardware & Network Package",
    category: "pos",
    icon: "CreditCard",
    badge: "Retail & Dining",
    tagline: "Turnkey checkout station setup for retail shops, supermarkets, restaurants and bars",
    description: "Touchscreen POS terminal, 80mm thermal receipt printer, heavy duty cash drawer, and isolated POS network.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "All-In-One Touchscreen POS Terminal (Intel Core i5, 8GB RAM, 128GB SSD, Capacitive Touch)",
        qty: 1,
        unitPrice: 48000,
      },
      {
        desc: "80mm High-Speed Thermal Receipt Printer with Auto-Cutter (USB + LAN + Bluetooth)",
        qty: 1,
        unitPrice: 14500,
      },
      {
        desc: "Heavy Duty 5-Bill / 8-Coin Steel Cash Drawer with RJ11 Printer Trigger Mechanism",
        qty: 1,
        unitPrice: 9500,
      },
      {
        desc: "Omnidirectional 1D/2D QR Code & Barcode Laser Scanner with Stand",
        qty: 1,
        unitPrice: 7500,
      },
      {
        desc: "APC / Mercury 650VA UPS Battery Backup (Keeps POS running during power trips)",
        qty: 1,
        unitPrice: 6500,
      },
      {
        desc: "Dedicated POS Ethernet LAN Isolation, Printer Driver Setup & Hardware Integration",
        qty: 1,
        unitPrice: 8000,
      },
    ],
    suggestedNotes: "• 1-Year hardware warranty on POS equipment.\n• Compatible with QuickPOS, QuickBooks, SimbaPOS, ERPNext, and custom billing apps.",
  },
  {
    id: "backup_nas",
    name: "🔒 Automated NAS Cloud & Local Backup System",
    category: "backup",
    icon: "FileSpreadsheet",
    badge: "Disaster Recovery",
    tagline: "Ransomware-proof automatic daily backup for financial records, accounting & documents",
    description: "Synology 2-Bay NAS, 2x 4TB Western Digital Red Hard Drives in RAID 1 mirror, and automated cloud sync.",
    defaultDocType: "quotation",
    items: [
      {
        desc: "Synology DiskStation DS224+ 2-Bay Network Attached Storage (NAS) Server",
        qty: 1,
        unitPrice: 48000,
      },
      {
        desc: "Western Digital Red Plus 4TB 24/7 NAS Hard Drive (CMR Technology) in RAID 1 Mirroring",
        qty: 2,
        unitPrice: 19500,
      },
      {
        desc: "Automated Daily Multi-PC Backup Client Setup with Version History & Ransomware Protection",
        qty: 1,
        unitPrice: 14000,
      },
      {
        desc: "Off-Site Encrypted Cloud Backup Integration (Google Drive / Wasabi Cloud Storage)",
        qty: 1,
        unitPrice: 9500,
      },
    ],
    suggestedNotes: "• Automatic zero-effort backups every evening at 6:00 PM.\n• RAID 1 ensures that even if one hard drive dies completely, zero files are lost.\n• Includes full disaster recovery test and staff handover.",
  },
];

export const CATALOG_ITEMS: CatalogItem[] = [
  // Networking
  { id: "ap_u6_pro", category: "Networking", name: "UniFi U6-Pro Access Point", desc: "Ubiquiti UniFi U6-Pro Dual-Band Wi-Fi 6 Enterprise AP (Installed & Configured)", unitPrice: 19500, defaultQty: 1 },
  { id: "ap_u6_lite", category: "Networking", name: "UniFi U6-Lite Access Point", desc: "Ubiquiti UniFi U6-Lite Wi-Fi 6 Access Point (Installed & Ceiling-Mounted)", unitPrice: 14500, defaultQty: 1 },
  { id: "switch_16_poe", category: "Networking", name: "16-Port Gigabit PoE+ Switch", desc: "16-Port Gigabit Managed PoE+ Network Switch (802.3at, 120W Budget, VLAN Support)", unitPrice: 24000, defaultQty: 1 },
  { id: "switch_24_poe", category: "Networking", name: "24-Port Gigabit PoE+ Switch", desc: "24-Port Gigabit PoE+ Managed Switch with 2x SFP Gigabit Fiber Uplink Ports", unitPrice: 38000, defaultQty: 1 },
  { id: "switch_8_poe", category: "Networking", name: "8-Port Gigabit PoE Switch", desc: "8-Port Gigabit Desktop PoE Switch with 4x PoE Ports (60W Power Budget)", unitPrice: 8500, defaultQty: 1 },
  { id: "router_mikrotik", category: "Networking", name: "MikroTik Gigabit Router", desc: "MikroTik hEX S 5-Port Gigabit Router with Dual-WAN Failover & Bandwidth Management", unitPrice: 13500, defaultQty: 1 },
  { id: "cable_cat6_roll", category: "Networking", name: "Cat6 Cable Roll (305m)", desc: "Cat6 Pure Copper Solid UTP Cable Roll (305m) High-Grade Network Cabling", unitPrice: 16500, defaultQty: 1 },
  { id: "rack_9u", category: "Networking", name: "9U Wall-Mount Data Cabinet", desc: "9U Wall-Mounted Glass-Door Server Cabinet with 6-Way PDU & Cooling Fans", unitPrice: 14000, defaultQty: 1 },
  { id: "rack_12u", category: "Networking", name: "12U Server Cabinet", desc: "12U Wall-Mounted Enterprise Network Cabinet with Lockable Glass Door & Cable Trays", unitPrice: 18500, defaultQty: 1 },
  { id: "patch_panel_24", category: "Networking", name: "24-Port Cat6 Patch Panel", desc: "24-Port 1U Cat6 Rackmount Patch Panel with Cable Management Bar", unitPrice: 6500, defaultQty: 1 },

  // CCTV
  { id: "cctv_5mp_cam", category: "CCTV", name: "5MP ColorVu IP Camera", desc: "Hikvision / Dahua 5MP Smart ColorVu Night-Vision IP Camera (Weatherproof IP67)", unitPrice: 5800, defaultQty: 4 },
  { id: "cctv_nvr_4ch", category: "CCTV", name: "4-Channel 4K PoE NVR", desc: "4-Channel 4K PoE Network Video Recorder with AI Smart Motion Detection", unitPrice: 16500, defaultQty: 1 },
  { id: "cctv_nvr_8ch", category: "CCTV", name: "8-Channel 4K PoE NVR", desc: "8-Channel 4K Ultra HD PoE NVR with HDMI/VGA Multi-Screen Output", unitPrice: 24500, defaultQty: 1 },
  { id: "hdd_2tb_purple", category: "CCTV", name: "2TB Surveillance Hard Drive", desc: "WD Purple / Seagate SkyHawk 2TB 24/7 Surveillance Storage (30+ Days Video)", unitPrice: 12500, defaultQty: 1 },
  { id: "hdd_4tb_purple", category: "CCTV", name: "4TB Surveillance Hard Drive", desc: "WD Purple 4TB 24/7 Heavy-Duty Surveillance Hard Drive (60+ Days Video)", unitPrice: 18500, defaultQty: 1 },

  // Hardware & Power
  { id: "ssd_500gb", category: "Hardware", name: "500GB NVMe / SATA SSD", desc: "Kingston / Crucial 500GB Solid State Drive (550MB/s Read, 3-Year Warranty)", unitPrice: 4800, defaultQty: 1 },
  { id: "ssd_1tb", category: "Hardware", name: "1TB High-Speed SSD", desc: "Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD (3500MB/s Ultra-Fast)", unitPrice: 9500, defaultQty: 1 },
  { id: "ram_8gb_ddr4", category: "Hardware", name: "8GB DDR4 RAM Module", desc: "Kingston 8GB DDR4 3200MHz Desktop / Laptop Memory Upgrade", unitPrice: 3500, defaultQty: 1 },
  { id: "ram_16gb_ddr4", category: "Hardware", name: "16GB DDR4 RAM Module", desc: "Crucial 16GB DDR4 3200MHz High-Performance RAM Module", unitPrice: 5800, defaultQty: 1 },
  { id: "ups_650va", category: "Hardware", name: "650VA UPS Battery Backup", desc: "Mercury / APC 650VA Line-Interactive UPS with Surge Protection", unitPrice: 6500, defaultQty: 1 },
  { id: "ups_1000va", category: "Hardware", name: "1000VA UPS Battery Backup", desc: "APC 1000VA Line-Interactive UPS Battery Backup with AVR & Surge Filter", unitPrice: 16500, defaultQty: 1 },

  // Labor & Engineering
  { id: "labor_site_survey", category: "Labor", name: "On-Site Diagnostic / Survey", desc: "Comprehensive On-Site IT Assessment, Wi-Fi Heatmapping & Scope Specification", unitPrice: 4500, defaultQty: 1 },
  { id: "labor_cabling_drop", category: "Labor", name: "Structured Cabling (per point)", desc: "Structured Cat6 Cable Pulling, PVC Conduit Piping, RJ45 Punchdown & Fluke Testing (per point)", unitPrice: 2000, defaultQty: 5 },
  { id: "labor_server_config", category: "Labor", name: "Server / Router Configuration", desc: "Enterprise Gateway Setup, Firewall Rules, Port Forwarding, VPN & Security Hardening", unitPrice: 12000, defaultQty: 1 },
  { id: "labor_pc_clean_os", category: "Labor", name: "OS Installation & Migration", desc: "Windows 11 Pro Clean Install, Drivers, Anti-Virus, Data Migration & Speed Optimization", unitPrice: 2500, defaultQty: 1 },

  // Web & Software
  { id: "web_business", category: "Web", name: "Custom Business Website", desc: "Modern High-Converting Business Website Design with Mobile Speed Optimization", unitPrice: 38000, defaultQty: 1 },
  { id: "web_ecommerce", category: "Web", name: "E-Commerce / Online Store", desc: "Full E-Commerce Website with M-Pesa Automatic Checkout, Inventory & Admin Dashboard", unitPrice: 65000, defaultQty: 1 },
  { id: "web_domain_hosting", category: "Web", name: "Domain & 1-Year Cloud Hosting", desc: "Corporate .co.ke / .com Domain Registration, SSL Security & High-Speed Cloud Server", unitPrice: 14500, defaultQty: 1 },
  { id: "web_email_gsuite", category: "Web", name: "Google Workspace / M365 Setup", desc: "Professional Business Email Domain Configuration with Anti-Spam Security Records", unitPrice: 8500, defaultQty: 1 },
];

/**
 * Smart Auto-Generator helper based on text prompt or intent
 */
export function generateItemsFromPrompt(prompt: string): Array<{ desc: string; qty: number; unitPrice: number }> {
  const p = prompt.toLowerCase();
  const items: Array<{ desc: string; qty: number; unitPrice: number }> = [];

  if (p.includes("cctv") || p.includes("camera") || p.includes("surveillance")) {
    const camCount = p.includes("8") ? 8 : p.includes("6") ? 6 : p.includes("2") ? 2 : 4;
    items.push({
      desc: `Hikvision / Dahua 5MP ColorVu Audio IP Cameras (Installed & Adjusted)`,
      qty: camCount,
      unitPrice: 5800,
    });
    items.push({
      desc: `${camCount <= 4 ? "4" : "8"}-Channel 4K PoE Network Video Recorder (NVR) with Remote Phone App`,
      qty: 1,
      unitPrice: camCount <= 4 ? 16500 : 24500,
    });
    items.push({
      desc: `Seagate SkyHawk / WD Purple ${camCount <= 4 ? "2TB" : "4TB"} 24/7 Surveillance Storage`,
      qty: 1,
      unitPrice: camCount <= 4 ? 12500 : 18500,
    });
    items.push({
      desc: `Structured Cabling, Waterproof Junction Boxes & Power Distribution`,
      qty: camCount,
      unitPrice: 2500,
    });
    items.push({
      desc: `Professional Installation, NVR Setup & Live Viewing on Director Phones`,
      qty: 1,
      unitPrice: camCount <= 4 ? 12000 : 18000,
    });
  }

  if (p.includes("wifi") || p.includes("wi-fi") || p.includes("network") || p.includes("internet") || p.includes("router")) {
    const apCount = p.includes("3") ? 3 : p.includes("4") ? 4 : 2;
    items.push({
      desc: `Ubiquiti UniFi U6-Pro Dual-Band Wi-Fi 6 Enterprise Access Point (Ceiling-Mounted)`,
      qty: apCount,
      unitPrice: 19500,
    });
    items.push({
      desc: `16-Port Gigabit PoE+ Managed Switch with VLAN Traffic Isolation`,
      qty: 1,
      unitPrice: 24000,
    });
    items.push({
      desc: `Cat6 Pure Copper Solid UTP Cable Roll (305m) & RJ45 Modules`,
      qty: 1,
      unitPrice: 16500,
    });
    items.push({
      desc: `MikroTik Gigabit Router with Dual-WAN Failover & Bandwidth Shaper`,
      qty: 1,
      unitPrice: 13500,
    });
    items.push({
      desc: `On-Site Structured Cabling, Trunking, VLAN Configuration & Heatmap Coverage Test`,
      qty: 1,
      unitPrice: 15000,
    });
  }

  if (p.includes("website") || p.includes("web") || p.includes("online") || p.includes("domain")) {
    items.push({
      desc: `Custom High-Converting Business Website (Fast Mobile Loading, WhatsApp Direct CTA)`,
      qty: 1,
      unitPrice: 38000,
    });
    items.push({
      desc: `1-Year High-Speed Edge Cloud Hosting & SSL Certificate`,
      qty: 1,
      unitPrice: 12000,
    });
    items.push({
      desc: `Corporate Domain Registration (.co.ke / .com) + Google Search SEO Setup`,
      qty: 1,
      unitPrice: 4500,
    });
    items.push({
      desc: `Corporate Email Setup with Anti-Spam Security Records`,
      qty: 1,
      unitPrice: 8500,
    });
  }

  if (p.includes("pos") || p.includes("retail") || p.includes("cash") || p.includes("checkout")) {
    items.push({
      desc: `All-In-One Touchscreen POS Terminal (Core i5, 8GB RAM, 128GB SSD)`,
      qty: 1,
      unitPrice: 48000,
    });
    items.push({
      desc: `80mm High-Speed Thermal Receipt Printer (USB + LAN + Bluetooth)`,
      qty: 1,
      unitPrice: 14500,
    });
    items.push({
      desc: `Heavy Duty 5-Bill / 8-Coin Steel Cash Drawer`,
      qty: 1,
      unitPrice: 9500,
    });
    items.push({
      desc: `650VA UPS Battery Surge Protector`,
      qty: 1,
      unitPrice: 6500,
    });
    items.push({
      desc: `POS LAN Isolation & Receipt Printer Driver Configuration`,
      qty: 1,
      unitPrice: 8000,
    });
  }

  if (p.includes("slow") || p.includes("ssd") || p.includes("computer") || p.includes("pc") || p.includes("laptop") || p.includes("upgrade")) {
    const pcCount = p.includes("5") ? 5 : p.includes("3") ? 3 : p.includes("2") ? 2 : 1;
    items.push({
      desc: `Kingston 500GB High-Speed SSD (550MB/s Read, 3-Year Warranty)`,
      qty: pcCount,
      unitPrice: 4800,
    });
    items.push({
      desc: `8GB / 16GB DDR4 High-Performance RAM Module Upgrade`,
      qty: pcCount,
      unitPrice: 3800,
    });
    items.push({
      desc: `Zero Data Loss OS Migration, Windows 11 Optimization & Driver Tuning`,
      qty: pcCount,
      unitPrice: 2500,
    });
  }

  // Fallback if generic
  if (items.length === 0) {
    items.push({
      desc: `Senior IT Consultant On-Site Service & Infrastructure Deployment: ${prompt || "Comprehensive IT Solution"}`,
      qty: 1,
      unitPrice: 25000,
    });
    items.push({
      desc: `Essential Hardware Components & Structured Accessories`,
      qty: 1,
      unitPrice: 18000,
    });
    items.push({
      desc: `Testing, Handover, SLA Documentation & 30-Day Support Warranty`,
      qty: 1,
      unitPrice: 8000,
    });
  }

  return items;
}

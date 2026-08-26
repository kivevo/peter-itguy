export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  badge: string;
  whatsIncluded: string[];
  whoItsFor: string;
  typicalTurnaround: string;
  miniCaseStudy: {
    client: string;
    challenge: string;
    result: string;
  };
  startingPrice?: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  category: string;
  heroMetric: string;
  summary: string;
  problem: string;
  solution: string[];
  results: string[];
  technologies: string[];
  link?: string;
  liveUrlText?: string;
  isWebDev?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatarText: string;
  content: string;
  rating: number;
  highlight: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  readTime: string;
  category: string;
  summary: string;
  keyTakeaway: string;
  date: string;
}

export const SITE_CONFIG = {
  name: "Peter Kivevo John",
  brandName: "Peter Kivevo | The IT Guy",
  shortTitle: "The IT Guy",
  tagline: "Your on-call IT partner — support, networks, and websites that just work",
  subtagline: "BSc Computer Science graduate providing enterprise-grade remote support countrywide and on-site troubleshooting across Nairobi.",
  
  // Contact Constants
  whatsappNumber: "254751035034",
  phoneDisplay: "+254 751 035 034",
  phoneTel: "+254751035034",
  email: "peterkivevo001@gmail.com",
  location: "Nairobi GPO 00100, Kenya",
  officeHours: "Remote Support: 24/7 Response • On-site Visits: Mon - Sat by Appointment",
  
  // Social Links
  social: {
    whatsapp: "https://wa.me/254751035034",
    instagram: "https://instagram.com/kivevo_",
    tiktok: "https://tiktok.com/@kivevo1",
    twitter: "https://x.com/kivevo_",
    linkedin: "https://linkedin.com/in/kivevo",
    github: "https://github.com/kivevo",
    youtube: "https://youtube.com/@kivevo",
    email: "mailto:peterkivevo001@gmail.com",
  },
  
  // Credibility Stats
  stats: [
    {
      value: "30+",
      label: "Branches Supported",
      description: "Remote & on-site SLA for Safaricom dealership network",
    },
    {
      value: "40%",
      label: "Faster Load Speed",
      description: "Delivered for After40Hotel web turnaround",
    },
    {
      value: "50%",
      label: "Less Downtime",
      description: "Achieved via proactive maintenance for hospitality clients",
    },
    {
      value: "BSc CS",
      label: "Computer Science",
      description: "Catholic University of Eastern Africa (CUEA)",
    },
    {
      value: "90%+",
      label: "Client Satisfaction",
      description: "Proven track record from ISP operations to boutique consulting",
    },
  ],
};

// WhatsApp URL generator with customizable contextual messages
export const getWhatsAppUrl = (customMessage?: string, service?: string): string => {
  const defaultText = service
    ? `Hi Peter, I saw your IT services website and I'd like to get support with ${service}. Can we discuss?`
    : `Hi Peter, I need urgent IT assistance with my systems / network / website. Are you available?`;
  
  const text = customMessage || defaultText;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
};

export const SERVICES: ServiceItem[] = [
  {
    id: "it-support",
    title: "IT Support & Maintenance",
    shortDesc: "Rapid remote and on-site troubleshooting for hardware, OS, printers, and business software.",
    fullDesc: "Enterprise-grade IT helpdesk without the enterprise price tag. I resolve tickets remotely within minutes and dispatch on-site across Nairobi when hands-on hardware diagnosis or board-level repairs are required.",
    iconName: "Headphones",
    badge: "30+ Branches Supported",
    whatsIncluded: [
      "24/7 Remote Desktop Assistance & Helpdesk",
      "On-site hardware troubleshooting & component replacement",
      "Operating System installs, updates, and malware cleanup",
      "Office 365, Google Workspace & business email management",
      "Network printer, scanner & peripheral setup",
      "Preventive scheduled maintenance & backup audits",
    ],
    whoItsFor: "SMEs, retail branch networks, corporate offices, and individuals who cannot afford lost revenue due to computer downtime.",
    typicalTurnaround: "15-minute remote triage • Same-day on-site response in Nairobi",
    miniCaseStudy: {
      client: "Safaricom Dealership Network (Samchi Telecom)",
      challenge: "Managing frequent POS and desktop failures across 30+ regional branches without full-time IT staff at each location.",
      result: "Standardized remote management tools, cut unresolved ticket time by 65%, and established a 4-hour on-site dispatch protocol for Nairobi hubs.",
    },
    startingPrice: "Custom SLA / Per Incident",
  },
  {
    id: "networking-security",
    title: "Networking & Security",
    shortDesc: "Reliable LAN/WAN architectures, high-density Wi-Fi, firewalls, and CCTV & access control installation.",
    fullDesc: "Design, cabling, configuration, and security lockdown for modern workplaces. I build networks that don't bottleneck during peak traffic and secure your business against unauthorized intruders and data leaks.",
    iconName: "ShieldCheck",
    badge: "Zero-Downtime Infrastructure",
    whatsIncluded: [
      "Structured LAN cabling, patch panel punch-downs & rack cable management",
      "UniFi / MikroTik / Cisco router & managed switch configuration",
      "Multi-VLAN segmentation (Guest Wi-Fi, POS Systems, Admin Network)",
      "High-definition IP CCTV camera installation with remote phone streaming",
      "Biometric access control & time-attendance system integration",
      "Firewall configuration, VPN tunnels & automated off-site cloud backups",
    ],
    whoItsFor: "Hotels, lounges, multi-floor corporate offices, retail stores, and private residences needing rock-solid connectivity and surveillance.",
    typicalTurnaround: "1–3 days for full site survey, cabling & configuration",
    miniCaseStudy: {
      client: "SNL Lounge & Garden",
      challenge: "Frequent Wi-Fi drops for 200+ weekend guests and POS payment terminals failing during peak hours.",
      result: "Deployed dual-WAN load balancing, separate high-density guest VLANs, and isolated POS subnet—zero payment outages since deployment.",
    },
    startingPrice: "From Site Survey",
  },
  {
    id: "web-development",
    title: "Business Web Development",
    shortDesc: "High-speed, conversion-focused websites and web apps built to convert local traffic into paying clients.",
    fullDesc: "I don't just fix computers; I build and maintain your digital presence. Modern, mobile-first websites optimized for Kenyan mobile data speeds with click-to-WhatsApp conversion funnels.",
    iconName: "Globe",
    badge: "Speed & Conversion Focused",
    whatsIncluded: [
      "Custom responsive design (mobile-first, sub-2s load on 3G/4G)",
      "Direct Click-to-WhatsApp and Call lead generation triggers",
      "Local SEO optimization (Google Business Profile + local search schema)",
      "M-Pesa integration & payment gateway setups",
      "Domain registration, DNS setup, SSL certificates & fast hosting",
      "Ongoing website maintenance, security updates & monthly backups",
    ],
    whoItsFor: "Kenyan businesses, service providers, e-commerce stores, and hospitality venues that want their website to generate qualified phone and WhatsApp leads.",
    typicalTurnaround: "7–14 business days from kickoff to live launch",
    miniCaseStudy: {
      client: "After40Hotel & Linens & Decor",
      challenge: "After40Hotel suffered 6+ months of site downtime; Linens & Decor needed an online catalog driving direct WhatsApp sales.",
      result: "Restored After40Hotel with a 40% speed increase; delivered Linens & Decor with responsive product catalogs driving daily inquiries.",
    },
    startingPrice: "Turnkey Packages",
  },
  {
    id: "it-consulting",
    title: "IT Consulting & Infrastructure Planning",
    shortDesc: "Strategic technology planning, vendor procurement, network rebuilds, and disaster recovery audits.",
    fullDesc: "Avoid costly tech mistakes. I evaluate your existing hardware, review your vendor contracts, and architect cost-effective IT roadmaps that scale with your business growth without bloated licensing fees.",
    iconName: "Cpu",
    badge: "Strategic ROI Guidance",
    whatsIncluded: [
      "Comprehensive IT infrastructure health audits & vulnerability scans",
      "Hardware procurement advisory & vendor price negotiation",
      "Disaster recovery & data backup failover architecture",
      "Cloud migration (Google Workspace, Microsoft 365, AWS/VPS)",
      "Staff cybersecurity hygiene training & password policy implementation",
      "SLA management and third-party ISP accountability enforcement",
    ],
    whoItsFor: "Business owners, hospitality directors, and general managers planning renovations, new branch rollouts, or recovering from legacy system debt.",
    typicalTurnaround: "24–48 hours for preliminary audit report",
    miniCaseStudy: {
      client: "Hospitality & Venue Operators",
      challenge: "Paying for multiple unmanaged ISP lines with repeated billing disputes and zero failover reliability.",
      result: "Consolidated ISP feeds, deployed automated failover router, reduced monthly bandwidth overhead by 30% while achieving 99.9% uptime.",
    },
    startingPrice: "Consultation Audit",
  },
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "after40hotel",
    title: "After40Hotel Turnaround: 6 Months Downtime to 40% Faster Web & Infrastructure Overhaul",
    client: "After40 Hotel (Nairobi CBD)",
    category: "Web Turnaround & Network Security",
    heroMetric: "40% Faster Load Speed & 100% Uptime",
    summary: "After40 Hotel in Nairobi CBD had been stranded with a completely broken, offline website for over 6 months alongside unstable guest Wi-Fi and unmanaged CCTV.",
    problem: "The previous developer had abandoned the codebase, DNS records were broken, the database was corrupted, and hotel guests were frequently complaining about dropped Wi-Fi in rooms and reception.",
    solution: [
      "Recovered domain ownership, rebuilt the website from scratch with lightweight mobile-first code, and optimized image assets.",
      "Re-architected the hotel's local network, isolated guest Wi-Fi from administrative booking desks using VLANs.",
      "Overhauled the CCTV surveillance server and set up encrypted remote monitoring for management.",
    ],
    results: [
      "Website brought back online in days with a 40% improvement in load times over their historical benchmark.",
      "Direct room booking and conference room WhatsApp inquiries increased significantly.",
      "Zero network security incidents or guest-admin bandwidth conflicts reported.",
    ],
    technologies: ["React", "Vercel", "UniFi OS", "MikroTik Routing", "IP CCTV Surveillance", "VLAN Segmentation"],
    link: "https://after40hotel.com",
    liveUrlText: "after40hotel.com",
    isWebDev: true,
  },
  {
    id: "samchi-telecom",
    title: "Samchi Telecom (Safaricom Dealership): Multi-Site Remote & Field IT Support Model",
    client: "Samchi Telecom (30+ Safaricom Dealer Branches)",
    category: "Enterprise Remote IT Support",
    heroMetric: "30+ Branches Supported with 65% Faster Resolution",
    summary: "Managing distributed IT operations across 30+ dealership branches countrywide with rapid ticket resolution and minimal downtime for Safaricom SIM swap and M-Pesa till systems.",
    problem: "Branch managers faced frustrating delays when POS machines, receipt printers, and Safaricom dealer portal terminals froze during busy trading hours.",
    solution: [
      "Implemented a standardized remote support stack allowing instant remote desktop diagnostics within 15 minutes of an alert.",
      "Created structured diagnostic playbooks for local branch supervisors to solve minor power/LAN faults.",
      "Established scheduled Nairobi on-site escalation rounds for board replacements, router swaps, and hardware servicing.",
    ],
    results: [
      "Maintained 99.8% dealer system operational uptime across all 30+ retail locations.",
      "Reduced average ticket resolution time from 4+ hours to under 35 minutes.",
      "Eliminated redundant branch IT travel expenses through centralized triage.",
    ],
    technologies: ["Remote Management & Monitoring", "Windows Server", "VPN Tunnels", "Safaricom Dealer Portals", "Hardware Diagnostics"],
  },
  {
    id: "snl-lounge",
    title: "SNL Lounge & Garden: High-Density Guest Wi-Fi & POS Network Rebuild",
    client: "SNL Lounge & Garden",
    category: "Network Engineering & POS Security",
    heroMetric: "200+ Concurrent Guests With Zero POS Outages",
    summary: "Rebuilt the entire network infrastructure from the ground up for a high-traffic Nairobi dining and entertainment venue with outdoor gardens.",
    problem: "During weekend peaks, hundreds of customer smartphones connecting to unmanaged Wi-Fi choked the POS payment terminals, leading to delayed M-Pesa bill settlements and customer frustration.",
    solution: [
      "Surveyed the indoor dining and outdoor garden zones, strategically installing weatherized Ubiquiti Access Points for seamless roaming.",
      "Configured bandwidth rate limiting and strict VLAN isolation prioritizing POS terminals and staff orders over guest media streaming.",
      "Integrated 16-channel HD security cameras covering bar registers, main entryways, and parking areas.",
    ],
    results: [
      "Eliminated POS payment timeout failures completely during peak weekend rushes.",
      "Smooth guest Wi-Fi coverage across all outdoor cabanas and indoor seating areas.",
      "Management gained full visibility via cloud controller and mobile CCTV streaming.",
    ],
    technologies: ["Ubiquiti UniFi", "Dual-WAN Load Balancing", "QoS Traffic Shaping", "IP Surveillance", "Captive Portal"],
  },
  {
    id: "web-showcase",
    title: "High-Converting Kenyan Business Web Builds",
    client: "Linens & Decor, Stratbridge Group, Chomazoze Mtwapa",
    category: "Commercial Web Development",
    heroMetric: "Sub-2s Load Speeds on Kenyan 4G Mobile Data",
    summary: "A curated collection of bespoke commercial websites engineered for speed, clean UX, and high conversion into direct WhatsApp orders.",
    problem: "Local businesses losing customers due to bloated WordPress templates that took 8+ seconds to load on mobile connections in Kenya.",
    solution: [
      "Custom engineered mobile-first frontends with pre-rendered assets and modern caching.",
      "Integrated prominent Kenyan WhatsApp triggers with pre-filled product/quote details.",
      "Implemented comprehensive local SEO tags targeting Nairobi and coastal regional search queries.",
    ],
    results: [
      "Linens & Decor (linensndecor.co.ke): Direct WhatsApp sales catalog with effortless product browsing.",
      "Stratbridge Group (stratbridgegroup.co.ke): Modern corporate consultancy profile with trust signals.",
      "Chomazoze Mtwapa (chomazozemtwapa.co.ke): High-energy hospitality & menu portal with rapid reservations.",
    ],
    technologies: ["Next.js / React", "Tailwind CSS", "Vercel Hosting", "WhatsApp API Funnels", "Structured SEO"],
    isWebDev: true,
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "15-Minute Remote Diagnostic",
    description: "You reach out via WhatsApp or phone. I connect remotely or assess your network topology to pinpoint the root cause immediately without wasting time on guesswork.",
    icon: "Scan",
  },
  {
    step: "02",
    title: "Rapid Fix or On-site Dispatch",
    description: "Software, security, and configuration faults are solved instantly over encrypted remote sessions. Hardware issues trigger same-day on-site dispatch in Nairobi.",
    icon: "Wrench",
  },
  {
    step: "03",
    title: "Hardening & Documentation",
    description: "I don't just apply a temporary patch. I fix the underlying vulnerability, document credentials, configure automatic backups, and adjust firewall policies.",
    icon: "FileCheck2",
  },
  {
    step: "04",
    title: "Proactive Health Monitoring",
    description: "Continuous preventive maintenance to ensure your network, website, and hardware remain 100% operational before failures can impact your bottom line.",
    icon: "Activity",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Operations Director",
    role: "Regional Operations Manager",
    company: "Safaricom Dealership Network",
    location: "Nairobi & Central Kenya",
    avatarText: "SD",
    content: "Peter has been instrumental in keeping our 30+ branch network running without disruptions. When a branch POS or dealer terminal freezes, he resolves it within minutes remotely. Truly dependable.",
    rating: 5,
    highlight: "30+ Branches Supported Seamlessly",
  },
  {
    id: "2",
    name: "General Manager",
    role: "Hospitality & Operations Lead",
    company: "After40 Hotel",
    location: "Nairobi CBD",
    avatarText: "AH",
    content: "Our website was offline for half a year under our previous agency. Peter came in, revived our web presence in record time, made it 40% faster, and fixed our internal Wi-Fi bottlenecks. An exceptional IT partner.",
    rating: 5,
    highlight: "Turned Around 6-Month Downtime",
  },
  {
    id: "3",
    name: "Managing Partner",
    role: "Director of Operations",
    company: "SNL Lounge & Garden",
    location: "Nairobi",
    avatarText: "SL",
    content: "Before Peter rebuilt our network, our POS terminals would crash every Saturday night as soon as guests hopped onto the Wi-Fi. He isolated the networks, boosted our Wi-Fi coverage, and we haven't had an outage since.",
    rating: 5,
    highlight: "Zero Weekend POS Outages",
  },
  {
    id: "4",
    name: "Business Owner",
    role: "Founder",
    company: "Linens & Decor Kenya",
    location: "Nairobi",
    avatarText: "LD",
    content: "Peter built our website with WhatsApp ordering front and center. Our customers love how fast the site loads on their phones, and our daily sales inquiries have surged. Highly recommended!",
    rating: 5,
    highlight: "Fast Web Design & More WhatsApp Sales",
  },
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: "office-network-upgrade",
    title: "5 Tell-Tale Signs Your Nairobi Office Network Needs a Professional Upgrade",
    readTime: "4 min read",
    category: "Networking & Security",
    summary: "From recurring POS timeouts during M-Pesa paybill transactions to unpredictable Zoom freezes: here is how unmanaged routers drain Kenyan business productivity.",
    keyTakeaway: "VLAN segmentation and dual-ISP load balancing pay for themselves in one busy weekend.",
    date: "Aug 2026",
  },
  {
    id: "whatsapp-first-support",
    title: "Why WhatsApp-First IT Support Beats Traditional Ticket Portals for Kenyan SMEs",
    readTime: "3 min read",
    category: "IT Support Best Practices",
    summary: "When your checkout tills or internet gateway are down, submitting a web form is the last thing you want. Discover how real-time WhatsApp response keeps businesses online.",
    keyTakeaway: "Direct technician communication cuts downtime by up to 70% compared to generic ticketing queues.",
    date: "Jul 2026",
  },
  {
    id: "hotel-wifi-guest-experience",
    title: "Preventing Wi-Fi Drops in Hospitality: How to Handle 200+ Devices Without Choking Your Front Desk",
    readTime: "5 min read",
    category: "Hospitality IT Infrastructure",
    summary: "A practical guide to access point positioning, bandwidth throttling, and captive portals for restaurants, lounges, and hotels across Kenya.",
    keyTakeaway: "Separate guest traffic completely from POS & reservation backends to protect your revenue.",
    date: "Jun 2026",
  },
];

export const WEB_PORTFOLIO_LINKS = [
  {
    title: "Linens & Decor Kenya",
    domain: "linensndecor.co.ke",
    url: "https://linensndecor.co.ke",
    desc: "E-commerce & WhatsApp sales catalog for home decor and luxury linens in Nairobi.",
    badge: "E-Commerce / Catalog",
  },
  {
    title: "Stratbridge Group",
    domain: "stratbridgegroup.co.ke",
    url: "https://stratbridgegroup.co.ke",
    desc: "Corporate consulting and advisory firm web portal with modern typography and trust elements.",
    badge: "Corporate Consulting",
  },
  {
    title: "Chomazoze Mtwapa",
    domain: "chomazozemtwapa.co.ke",
    url: "https://chomazozemtwapa.co.ke",
    desc: "Hospitality, lounge & dining website with online menu browsing and reservation triggers.",
    badge: "Hospitality & Venue",
  },
];

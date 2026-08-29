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
  tagline: "Fast IT Support, Rock-Solid Wi-Fi & Modern Websites in Kenya",
  subtagline: "When your office computers, Wi-Fi, or website stop working, I fix them fast — so you can get back to making money.",
  
  // Contact Constants
  whatsappNumber: "254758896553",
  phoneDisplay: "+254 758 896 553",
  phoneTel: "+254758896553",
  email: "peterkivevo001@gmail.com",
  location: "Nairobi, Kenya",
  officeHours: "Remote Help: 24/7 Response • On-site Visits in Nairobi: Mon - Sat",
  
  // Social Links
  social: {
    whatsapp: "https://wa.me/254758896553",
    instagram: "https://instagram.com/kivevo_",
    tiktok: "https://tiktok.com/@kivevo1",
    twitter: "https://x.com/kivevo_",
    linkedin: "https://linkedin.com/in/kivevo",
    github: "https://github.com/kivevo",
    youtube: "https://youtube.com/@kivevo",
    email: "mailto:peterkivevo001@gmail.com",
  },
  
  // Credibility Stats (Simple & easy for any client to understand)
  stats: [
    {
      value: "30+",
      label: "Branches Supported",
      description: "Fast remote & on-site IT support for Samchi Telecom (Safaricom Dealer)",
      methodology: "Active dealer shop branches supported countrywide.",
    },
    {
      value: "40%",
      label: "Faster Websites",
      description: "Speed increase delivered for After40 Hotel in Nairobi CBD",
      methodology: "Tested with Google PageSpeed before and after website upgrade.",
    },
    {
      value: "15-Min",
      label: "Fast Response",
      description: "Quick WhatsApp reply for urgent office and computer problems",
      methodology: "You talk directly to Peter — no waiting on hold with automated bots.",
    },
    {
      value: "BSc CS",
      label: "Computer Science",
      description: "Catholic University of Eastern Africa (CUEA)",
      methodology: "Degree specializing in Computer Networks, Systems & Web Development.",
    },
    {
      value: "100%",
      label: "Direct Communication",
      description: "You work directly with Peter — the engineer who does the work",
      methodology: "No middlemen or junior assistants passing you around.",
    },
  ],
};

export interface ClientPartnerItem {
  name: string;
  industry: string;
  projectType: string;
  website?: string;
  badgeText: string;
}

export const CLIENT_PARTNERS: ClientPartnerItem[] = [
  {
    name: "Samchi Telecom",
    industry: "Telecom & Retail",
    projectType: "30+ Safaricom Dealer Branches IT Support",
    badgeText: "30+ Branches",
  },
  {
    name: "After40 Hotel",
    industry: "Hotel (Nairobi CBD)",
    projectType: "Fast Website & Guest Wi-Fi Setup",
    website: "https://after40hotel.com",
    badgeText: "Fast Web & Wi-Fi",
  },
  {
    name: "SNL Lounge & Garden",
    industry: "Restaurant & Lounge",
    projectType: "Smooth Guest Wi-Fi & Reliable POS Payment Network",
    badgeText: "POS Payment Protection",
  },
  {
    name: "Linens & Decor",
    industry: "Home Decor & Retail",
    projectType: "Online Catalog with Direct WhatsApp Orders",
    website: "https://linensndecor.co.ke",
    badgeText: "WhatsApp Store Web",
  },
  {
    name: "Stratbridge Group",
    industry: "Corporate Consulting",
    projectType: "Modern Company Website & Business Email",
    website: "https://stratbridgegroup.co.ke",
    badgeText: "Corporate Web",
  },
  {
    name: "Chomazone Mtwapa",
    industry: "Hospitality & Venue",
    projectType: "Digital Menu & Table Reservation Website",
    website: "https://chomazonemtwapa.co.ke",
    badgeText: "Restaurant Web",
  },
];

export interface CredentialBadgeItem {
  title: string;
  issuer: string;
  category: "Academic" | "Field Experience" | "Hardware & Networks" | "Registration";
  status: "Verified" | "Practiced / Applied" | "Available on Request";
  note: string;
}

export const CREDENTIALS_LIST: CredentialBadgeItem[] = [
  {
    title: "Bachelor of Science in Computer Science",
    issuer: "Catholic University of Eastern Africa (CUEA)",
    category: "Academic",
    status: "Verified",
    note: "4-year degree focusing on computer systems, networks, and software engineering.",
  },
  {
    title: "Internet Service Provider (ISP) Field Experience",
    issuer: "Fiberlink Systems Limited",
    category: "Field Experience",
    status: "Verified",
    note: "Hands-on experience with fiber optic internet, wireless antennas, and office routers.",
  },
  {
    title: "High-Speed Wi-Fi & Office Network Setup",
    issuer: "Ubiquiti UniFi Systems",
    category: "Hardware & Networks",
    status: "Practiced / Applied",
    note: "Installed strong Wi-Fi across busy hotels, restaurants, and corporate offices in Nairobi.",
  },
  {
    title: "Smart Router & Internet Speed Balancing",
    issuer: "MikroTik Routing Systems",
    category: "Hardware & Networks",
    status: "Practiced / Applied",
    note: "Sets up backup internet connections so your office never loses connection when one ISP fails.",
  },
  {
    title: "Modern Business Website Engineering",
    issuer: "React, Next.js & TypeScript",
    category: "Hardware & Networks",
    status: "Practiced / Applied",
    note: "Builds ultra-fast websites designed to open quickly on smartphones in Kenya.",
  },
  {
    title: "Official Invoices & Tax Compliance",
    issuer: "KRA / Business Registration",
    category: "Registration",
    status: "Available on Request",
    note: "Official KRA PIN, company receipts, and invoices provided for business clients.",
  },
];

// WhatsApp URL generators with customizable contextual messages
export const getWhatsAppUrl = (customMessage?: string, service?: string): string => {
  const defaultText = service
    ? `Hi Peter, I saw your website and I need help with ${service}. Can we discuss?`
    : `Hi Peter, I need quick IT help with my computers / Wi-Fi / website. Are you available?`;
  
  const text = customMessage || defaultText;
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
};

export const getWhatsAppWebUrl = (customMessage?: string, service?: string): string => {
  const defaultText = service
    ? `Hi Peter, I saw your website and I need help with ${service}. Can we discuss?`
    : `Hi Peter, I need quick IT help with my computers / Wi-Fi / website. Are you available?`;
  
  const text = customMessage || defaultText;
  return `https://web.whatsapp.com/send?phone=${SITE_CONFIG.whatsappNumber}&text=${encodeURIComponent(text)}`;
};

export const getWhatsAppAppUrl = (customMessage?: string, service?: string): string => {
  return getWhatsAppUrl(customMessage, service);
};

export const SERVICES: ServiceItem[] = [
  {
    id: "it-support",
    title: "Computer & IT Support",
    shortDesc: "Fast remote help and on-site visits for slow PCs, frozen laptops, printer problems, and email setups.",
    fullDesc: "Friendly, expert computer help without the high agency prices. I fix software issues remotely in minutes, and visit your office in Nairobi when physical repairs or computer replacements are needed.",
    iconName: "Headphones",
    badge: "30+ Branches Supported",
    whatsIncluded: [
      "Quick Remote Helpdesk (fix computer problems while you watch)",
      "Same-day on-site repairs across Nairobi",
      "Windows / Mac troubleshooting, updates, and virus cleaning",
      "Microsoft 365, Google Workspace & business email setup",
      "Office printer, scanner & Wi-Fi device configuration",
      "Regular computer cleanups and automatic cloud backups",
    ],
    whoItsFor: "Shops, retail branches, busy offices, and business owners who cannot afford to lose hours when a computer acts up.",
    typicalTurnaround: "15-minute remote reply • Same-day visit in Nairobi",
    miniCaseStudy: {
      client: "Samchi Telecom (Safaricom Dealer)",
      challenge: "Frequent POS till and computer freezes across 30+ branches without full-time IT staff at each location.",
      result: "Set up fast remote support tools, solved issues 65% faster, and established same-day physical backup for Nairobi shops.",
    },
    startingPrice: "Custom Scope & Monthly SLA",
  },
  {
    id: "networking-security",
    title: "Strong Wi-Fi & Office Networks",
    shortDesc: "Strong Wi-Fi that never drops, isolated guest internet, and clear security cameras you can watch on your phone.",
    fullDesc: "We wire, configure, and secure your office internet. Stop Wi-Fi drops during important meetings, prevent guest devices from slowing down your payment tills, and protect your office with HD CCTV cameras.",
    iconName: "ShieldCheck",
    badge: "Zero-Downtime Wi-Fi",
    whatsIncluded: [
      "Clean office network cabling & neat server rack organization",
      "Long-range Wi-Fi access points that cover every room and garden area",
      "Separate Guest Wi-Fi so customer phones never slow down your payment tills",
      "HD Security Cameras (CCTV) with live viewing on your smartphone",
      "Biometric fingerprint / card door access & staff attendance clocks",
      "Backup Internet connection setup (automatically switches if main fiber cuts)",
    ],
    whoItsFor: "Hotels, restaurants, multi-room offices, retail stores, and homes that need rock-solid internet and clear security.",
    typicalTurnaround: "1 to 3 days for complete installation & testing",
    miniCaseStudy: {
      client: "SNL Lounge & Garden",
      challenge: "200+ weekend guests connecting to Wi-Fi caused payment machines to freeze and drop M-Pesa transactions.",
      result: "Separated guest internet from payment tills and added outdoor Wi-Fi. Zero payment machine failures since then.",
    },
    startingPrice: "Free Site Survey & Quote",
  },
  {
    id: "web-development",
    title: "Fast Business Websites",
    shortDesc: "Beautiful, super-fast websites designed to open quickly on smartphones and turn visitors into calls & WhatsApp orders.",
    fullDesc: "I build modern websites that actually grow your business. Designed to open in under 2 seconds even on slow mobile connections in Kenya, with easy click-to-WhatsApp and Call buttons so clients contact you instantly.",
    iconName: "Globe",
    badge: "Fast & Mobile Friendly",
    whatsIncluded: [
      "Custom mobile-friendly design (opens in under 2s on 3G/4G)",
      "Direct Click-to-WhatsApp and Click-to-Call inquiry buttons",
      "Google Search & Google Maps local business setup (Local SEO)",
      "M-Pesa payment integration & easy product showcase catalogs",
      "Domain name registration (.co.ke / .com), SSL security & fast hosting",
      "Ongoing website maintenance, regular updates, and monthly backups",
    ],
    whoItsFor: "Kenyan businesses, service providers, hotels, consultants, and shops that want their website to generate real phone calls and WhatsApp orders.",
    typicalTurnaround: "5 to 10 working days from start to live launch",
    miniCaseStudy: {
      client: "After40 Hotel & Linens & Decor",
      challenge: "After40 Hotel had an offline website for 6 months; Linens & Decor needed an easy way to sell products via WhatsApp.",
      result: "Revived After40 Hotel with 40% faster load speed; built Linens & Decor online catalog driving daily WhatsApp sales.",
    },
    startingPrice: "Turnkey Packages Available",
  },
  {
    id: "it-consulting",
    title: "Office Tech Setup & Advice",
    shortDesc: "Setting up a new office? We help you buy the right equipment, choose the best internet, and avoid wasting money.",
    fullDesc: "Avoid expensive tech mistakes. I review what you currently have, help you negotiate the best prices on computers and internet subscriptions, and make sure your office technology runs smoothly as your business grows.",
    iconName: "Cpu",
    badge: "Save Money & Stress",
    whatsIncluded: [
      "Office tech checkup: finding what is slowing down your team",
      "Equipment buying advice (get the best computers & printers for your budget)",
      "Data backup plan so you never lose company files or financial records",
      "Moving to Google Workspace / Microsoft 365 cloud email",
      "Simple cyber safety training for your staff (avoid phishing & scams)",
      "Holding internet service providers accountable for slow speeds",
    ],
    whoItsFor: "Business owners, managers, and directors moving into new offices, opening new branches, or tired of recurring tech headaches.",
    typicalTurnaround: "24–48 hours for clear written report & plan",
    miniCaseStudy: {
      client: "Hospitality & Business Operators",
      challenge: "Paying for two expensive internet lines that kept failing at the same time with zero backup.",
      result: "Fixed router setup to switch automatically to backup internet, cut monthly internet bills by 30%, and achieved 99.9% uptime.",
    },
    startingPrice: "Custom Consultation Plan",
  },
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "after40hotel",
    title: "After40 Hotel: Reviving an Offline Website & Fixing Hotel Wi-Fi",
    client: "After40 Hotel (Nairobi CBD)",
    category: "Website Turnaround & Wi-Fi Setup",
    heroMetric: "40% Faster Load Speed & 100% Uptime",
    summary: "After40 Hotel in Nairobi CBD had an offline, broken website for over 6 months alongside unstable guest Wi-Fi and unmanaged security cameras.",
    problem: "The previous web developer had disappeared, the website was completely down, and hotel guests in rooms frequently complained about dropped Wi-Fi.",
    solution: [
      "Recovered the website domain, rebuilt a clean mobile-friendly website that loads in 1.1 seconds, and added direct WhatsApp booking buttons.",
      "Re-organized the hotel network: separated guest internet from front-desk payment computers so guests never slow down hotel operations.",
      "Repaired the security camera system and enabled live viewing on the manager's smartphone.",
    ],
    results: [
      "Website brought back online in days with a 40% speed boost over old records.",
      "Direct room booking and conference inquiries via WhatsApp increased immediately.",
      "Front-desk payment computers and guest Wi-Fi now run smoothly without conflicts.",
    ],
    technologies: ["Fast Mobile Web", "UniFi Wi-Fi APs", "Smart Routers", "HD Security Cameras", "Isolated Guest Internet"],
    link: "https://after40hotel.com",
    liveUrlText: "after40hotel.com",
    isWebDev: true,
  },
  {
    id: "samchi-telecom",
    title: "Samchi Telecom (Safaricom Dealer): 30+ Branches Kept Running Smoothly",
    client: "Samchi Telecom (30+ Safaricom Dealer Branches)",
    category: "Business Remote IT Support",
    heroMetric: "30+ Branches Supported with 65% Faster Fixes",
    summary: "Managing daily IT support across 30+ dealership branches countrywide with fast ticket resolution and minimal downtime for Safaricom SIM swaps and M-Pesa till systems.",
    problem: "Shop managers faced long delays whenever receipt printers jammed, payment computers froze, or dealer portals went offline during busy trading hours.",
    solution: [
      "Installed instant remote help tools: Peter connects and fixes computer errors within 15 minutes of a WhatsApp message.",
      "Trained shop managers on quick 2-minute checks for simple power and cable issues.",
      "Scheduled physical maintenance visits in Nairobi for printer servicing, computer repairs, and hardware upgrades.",
    ],
    results: [
      "99.8% computer uptime across all 30+ retail locations.",
      "Average problem resolution time dropped from over 4 hours to under 35 minutes.",
      "Saved significant travel costs by solving most issues remotely in minutes.",
    ],
    technologies: ["Remote Desktop Helpdesk", "Windows Systems", "Safaricom Portals", "Printer Diagnostics", "Hardware Servicing"],
  },
  {
    id: "snl-lounge",
    title: "SNL Lounge & Garden: Smooth Guest Wi-Fi & Reliable M-Pesa Tills",
    client: "SNL Lounge & Garden",
    category: "Wi-Fi & Payment Network Setup",
    heroMetric: "200+ Weekend Guests With Zero Payment Freezes",
    summary: "Rebuilt the entire Wi-Fi and network setup from scratch for a popular Nairobi dining venue with both indoor seating and outdoor garden cabanas.",
    problem: "On busy Saturday nights, hundreds of customer phones connecting to Wi-Fi completely overwhelmed the internet, causing M-Pesa payment tills to freeze and delay customer bills.",
    solution: [
      "Installed powerful weatherproof outdoor Wi-Fi antennas covering all dining cabanas and gardens.",
      "Put payment tills on a private protected channel with guaranteed bandwidth — customer phones can never slow down till payments.",
      "Installed 16 HD security cameras covering registers, entrances, and parking lots with live phone streaming for managers.",
    ],
    results: [
      "Completely eliminated payment till timeouts during peak weekend rushes.",
      "Strong, reliable Wi-Fi across both indoor and outdoor garden seating.",
      "Management can monitor restaurant operations and cameras from anywhere on their phones.",
    ],
    technologies: ["UniFi Outdoor Wi-Fi", "Smart Bandwidth Control", "HD Security Cameras", "Isolated Till Network", "Guest Wi-Fi"],
  },
  {
    id: "web-showcase",
    title: "Modern Business Websites Built for Kenyan Companies",
    client: "Linens & Decor, Stratbridge Group, Chomazone Mtwapa",
    category: "Commercial Web Development",
    heroMetric: "Sub-2s Mobile Load Speeds on Kenyan 4G Data",
    summary: "A collection of clean, modern websites engineered to load fast on phones and generate real phone calls and WhatsApp orders.",
    problem: "Businesses losing clients because old, heavy website templates took 8+ seconds to load on mobile phones in Kenya.",
    solution: [
      "Built clean, lightweight websites that load in under 2 seconds on mobile data.",
      "Added prominent WhatsApp chat buttons with pre-filled inquiry details.",
      "Configured Google Search and local Google Maps profiles so local clients find them easily.",
    ],
    results: [
      "Linens & Decor (linensndecor.co.ke): Easy online catalog driving daily WhatsApp sales inquiries.",
      "Stratbridge Group (stratbridgegroup.co.ke): Professional corporate profile building trust with institutional clients.",
      "Chomazone Mtwapa (chomazonemtwapa.co.ke): High-energy restaurant & menu portal with quick table bookings.",
    ],
    technologies: ["React / Next.js", "Tailwind CSS", "WhatsApp Orders", "Fast Cloud Hosting", "Google SEO"],
    isWebDev: true,
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Quick 15-Minute Check",
    description: "You message or call me on WhatsApp. I connect remotely or check your setup to find the exact problem right away — no wasted time.",
    icon: "Scan",
  },
  {
    step: "02",
    title: "Fast Fix or On-site Visit",
    description: "Software, email, and network settings are fixed remotely in minutes. If physical hardware or cabling is broken, I visit your Nairobi office the same day.",
    icon: "Wrench",
  },
  {
    step: "03",
    title: "Secure & Prevent",
    description: "I don't just apply a quick temporary fix. I secure your passwords, set up automatic backups, and adjust your settings so the issue doesn't happen again.",
    icon: "FileCheck2",
  },
  {
    step: "04",
    title: "Ongoing Peace of Mind",
    description: "Continuous care to make sure your office computers, Wi-Fi, and website keep running smoothly without surprise breakdowns.",
    icon: "Activity",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Operations Lead",
    role: "Regional Operations Manager",
    company: "Samchi Telecom (Safaricom Dealer)",
    location: "Nairobi & Central Kenya",
    avatarText: "ST",
    content: "Peter has been amazing in keeping our 30+ Samchi Telecom branch network running without issues. When a branch payment till or computer freezes, he fixes it within minutes remotely. Extremely reliable.",
    rating: 5,
    highlight: "30+ Samchi Branches Supported Smoothly",
  },
  {
    id: "2",
    name: "General Manager",
    role: "Hotel Operations Lead",
    company: "After40 Hotel",
    location: "Nairobi CBD",
    avatarText: "AH",
    content: "Our website was completely offline for 6 months before we found Peter. He revived our site in record time, made it 40% faster, and fixed our hotel Wi-Fi so guests are happy. A fantastic IT partner.",
    rating: 5,
    highlight: "Fixed 6-Month Website Downtime in Days",
  },
  {
    id: "3",
    name: "Managing Director",
    role: "Director of Operations",
    company: "SNL Lounge & Garden",
    location: "Nairobi",
    avatarText: "SL",
    content: "Before Peter fixed our network, our payment machines would freeze every Saturday night as soon as guests hopped onto the Wi-Fi. He separated the internet channels, boosted our Wi-Fi coverage, and we haven't had a payment outage since.",
    rating: 5,
    highlight: "Zero Weekend Payment Machine Freezes",
  },
  {
    id: "4",
    name: "Business Owner",
    role: "Founder",
    company: "Linens & Decor Kenya",
    location: "Nairobi",
    avatarText: "LD",
    content: "Peter built our website with WhatsApp ordering front and center. Our clients love how fast the site opens on their phones, and our daily sales inquiries have jumped. Highly recommended!",
    rating: 5,
    highlight: "Fast Website & More WhatsApp Sales",
  },
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: "office-network-upgrade",
    title: "5 Simple Signs Your Office Wi-Fi Needs a Professional Upgrade",
    readTime: "3 min read",
    category: "Office Wi-Fi & Internet",
    summary: "From recurring M-Pesa till timeouts to frustrating Zoom call freezes: here is why standard home routers struggle in busy offices and restaurants.",
    keyTakeaway: "Separating guest Wi-Fi from office payment tills pays for itself in one busy weekend.",
    date: "Aug 2026",
  },
  {
    id: "whatsapp-first-support",
    title: "Why Quick WhatsApp Support Beats Traditional IT Support Tickets in Kenya",
    readTime: "3 min read",
    category: "Fast IT Support",
    summary: "When your checkout tills or internet gateway are down, submitting a slow web form is the last thing you want. Discover how real-time WhatsApp response keeps businesses online.",
    keyTakeaway: "Direct communication with the engineer cuts downtime by up to 70% compared to automated call queues.",
    date: "Jul 2026",
  },
  {
    id: "hotel-wifi-guest-experience",
    title: "How to Give 200+ Guests Fast Wi-Fi Without Freezing Your Front Desk",
    readTime: "4 min read",
    category: "Hotels & Restaurants",
    summary: "A practical guide to placing Wi-Fi antennas and managing bandwidth so hotel guests stream smoothly while reception operations stay 100% fast.",
    keyTakeaway: "Protect your revenue by keeping guest streaming traffic completely separate from billing and booking computers.",
    date: "Jun 2026",
  },
];

export const WEB_PORTFOLIO_LINKS = [
  {
    title: "After40 Hotel",
    domain: "after40hotel.com",
    url: "https://after40hotel.com",
    desc: "Hospitality website & room booking funnel with 40% faster mobile load speed.",
    badge: "Hotel & Bookings",
  },
  {
    title: "Linens & Decor Kenya",
    domain: "linensndecor.co.ke",
    url: "https://linensndecor.co.ke",
    desc: "E-commerce product catalog with direct WhatsApp ordering in Nairobi.",
    badge: "Online Shop / Catalog",
  },
  {
    title: "Stratbridge Group",
    domain: "stratbridgegroup.co.ke",
    url: "https://stratbridgegroup.co.ke",
    desc: "Corporate consulting & advisory firm website with clean modern design.",
    badge: "Corporate Website",
  },
  {
    title: "Chomazone Mtwapa",
    domain: "chomazonemtwapa.co.ke",
    url: "https://chomazonemtwapa.co.ke",
    desc: "Restaurant & lounge website with digital menu browsing and fast table booking.",
    badge: "Restaurant & Menu",
  },
];

import { 
  TESTIMONIALS, 
  SITE_CONFIG, 
  SERVICES, 
  CASE_STUDIES, 
  CLIENT_PARTNERS, 
  CREDENTIALS_LIST,
  ServiceItem, 
  CaseStudyItem, 
  ClientPartnerItem, 
  CredentialBadgeItem 
} from "@/config/site";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatarText: string;
  content: string;
  rating: number;
  highlight: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

export interface InquiryLead {
  id: string;
  source: "direct_modal" | "contact_form" | "issue_wizard" | "quote_estimator" | "speed_checker" | "floating_chat" | "hardware_planner";
  name: string;
  phone: string;
  service: string;
  urgency?: string;
  location?: string;
  details: string;
  notes?: string;
  status: "new" | "contacted" | "quote_sent" | "completed";
  estimatedValue?: number;
  createdAt: string;
}

export interface JobScheduleItem {
  id: string;
  clientName: string;
  company: string;
  phone: string;
  location: string;
  visitDate: string;
  timeSlot: string;
  serviceType: "Wi-Fi & Network Fix" | "CCTV & Cameras Setup" | "Computer & Server Repair" | "Turnkey Office Setup" | "Routine Maintenance";
  status: "scheduled" | "en_route" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  hardwareSerialNumbers?: string;
  createdAt: string;
}

export interface SiteBannerConfig {
  enabled: boolean;
  message: string;
  badgeText: string;
  linkText: string;
  variant: "emerald" | "teal" | "amber" | "rose";
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  enabled: boolean;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  kraPin: string;
  authorizedSignatory: string;
  mpesaType: "Paybill" | "Till" | "Buy Goods";
  mpesaNumber: string;
  mpesaAccount: string;
  includeBankDetails?: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranch: string;
  currency: string;
  defaultVatPercent: number;
  defaultPaymentTermsDays: number;
  notesTemplate: string;
}

export interface SavedClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  kraPin?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  desc: string;
  qty: number;
  unitPrice: number;
}

export interface InvoiceDocument {
  id: string;
  docType: "quotation" | "invoice" | "receipt";
  docNumber: string;
  issueDate: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "accepted";
  client: {
    id?: string;
    name: string;
    company: string;
    email?: string;
    phone: string;
    address: string;
    kraPin?: string;
  };
  items: InvoiceItem[];
  discountType: "percentage" | "flat";
  discountValue: number;
  vatEnabled: boolean;
  vatPercent: number;
  currency: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // ISO string when soft-deleted; undefined = active
  // Partial payments tracking
  payments?: InvoicePayment[];
  recurringTemplate?: boolean;
  recurringFrequency?: "monthly" | "quarterly" | "annually";
  proForma?: boolean;
  workCompletion?: boolean;
  // KRA Tax & eTIMS Compliance
  taxScheme?: "none" | "vat_16" | "tot_3" | "zero_rated" | "exempt";
  whtEnabled?: boolean;
  whtPercent?: number;
  whtAmount?: number;
  whtCertificateNo?: string;
  etimsControlCode?: string;
  etimsInternalSign?: string;
  etimsQrData?: string;
}

export interface InvoicePayment {
  id: string;
  amount: number;
  method: "mpesa" | "bank" | "cash" | "cheque";
  mpesaCode?: string;
  mpesaPhone?: string;
  bankRef?: string;
  date: string;
  notes?: string;
  recordedAt: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId?: string;
  clientName: string;
  description: string;
  amount: number;
  paymentMethod: "mpesa" | "bank" | "cash" | "cheque";
  mpesaCode?: string;
  mpesaPhone?: string;
  bankRef?: string;
  category: "wifi_network" | "computer_support" | "website" | "cctv" | "hardware_sale" | "retainer" | "consultation" | "other";
  date: string;
  notes?: string;
  createdAt: string;
}

export interface ExpenseRecord {
  id: string;
  description: string;
  amount: number;
  category: "transport" | "hardware_parts" | "software_tools" | "airtime_data" | "marketing" | "office_supplies" | "other";
  date: string;
  receiptNote?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: "router" | "switch" | "access_point" | "cable" | "cctv_camera" | "nvr" | "ups" | "laptop" | "printer" | "accessories" | "other";
  quantity: number;
  unitCost: number;
  sellingPrice: number;
  serialNumbers: string;
  deployedAt?: string;
  condition: "new" | "good" | "refurbished" | "faulty";
  supplier?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  createdAt: string;
}

export interface KRAProfileSettings {
  taxpayerName: string;
  kraPin: string;
  taxObligation: "turnover_tax" | "standard_vat" | "income_tax_only" | "exempt";
  turnoverTaxRate: number; // default 3%
  vatRate: number; // default 16%
  whtRate: number; // default 5%
  whtVatRate: number; // default 2%
  annualPersonalRelief: number; // default 28800 KES (2,400/mo)
  insuranceRelief: number; // default 0 KES
  housingRelief: number; // default 0 KES
  etimsSerialNumber: string;
  etimsBranchId: string;
  etimsControlPrefix: string;
  autoGenerateEtimsSignature: boolean;
  businessType: "sole_proprietor" | "limited_company" | "partnership";
}

export interface WhtCertificateRecord {
  id: string;
  certificateNumber: string;
  withholdingAgentName: string;
  withholdingAgentPin: string;
  invoiceId?: string;
  invoiceDocNumber?: string;
  grossAmount: number;
  whtAmount: number;
  whtType: "management_professional_5" | "consultancy_5" | "contractual_3" | "rent_10" | "whvat_2";
  dateWithheld: string;
  taxPeriod: string; // e.g. "2026-08" or "2026"
  status: "verified" | "claimed" | "pending";
  notes?: string;
  createdAt: string;
}

export interface KRATaxReturnSummary {
  periodType: "monthly" | "annual";
  periodLabel: string;
  grossSales: number;
  totalVatInvoiced: number;
  totalExpenses: number;
  allowableDeductions: number;
  netTaxableIncome: number;
  outputTax: number;
  inputTaxCredit: number;
  whtDeductedCredits: number;
  grossTaxLiability: number;
  personalRelief: number;
  netTaxPayable: number;
  isRefund: boolean;
  dueDate: string;
  daysRemaining: number;
  filingStatus: "due_soon" | "overdue" | "ready" | "filed";
}

export interface SubscriberItem {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  subscribedAt: string;
  lastEmailedAt?: string;
}

export interface ResendSettings {
  apiKey: string;
  fromEmail: string; // e.g. "Peter Kivevo <onboarding@resend.dev>" or "Peter Kivevo <hello@kivevo.co.ke>"
  recipientEmail: string; // e.g. "peterkivevo001@gmail.com"
  notifyOnInquiry: boolean;
  notifyOnReview: boolean;
  welcomeEmailEnabled: boolean;
}

export interface EmailBroadcastItem {
  id: string;
  subject: string;
  previewText?: string;
  headline: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  recipientCount: number;
  sentAt: string;
  status: "sent" | "failed" | "draft";
  logs?: string;
}

export interface SiteContent {
  siteInfo: {
    name: string;
    brandName: string;
    shortTitle: string;
    tagline: string;
    subtagline: string;
    phoneDisplay: string;
    phoneTel: string;
    whatsappNumber: string;
    email: string;
    location: string;
    officeHours: string;
    social: Record<string, string>;
    stats: { value: string; label: string; description: string; methodology?: string }[];
  };
  services: ServiceItem[];
  caseStudies: CaseStudyItem[];
  partners: ClientPartnerItem[];
  credentials: CredentialBadgeItem[];
}

export interface ClientVaultRecord {
  id: string;
  clientId?: string;
  clientName: string;
  company: string;
  location: string;
  contactPhone: string;
  contactEmail?: string;
  // Network Topology
  gatewayIp: string;
  subnetMask: string;
  dhcpRange: string;
  vlans: string;
  primaryDns: string;
  wifiSsidStaff: string;
  wifiPassStaff: string;
  wifiSsidGuest: string;
  wifiPassGuest: string;
  // ISP Circuit Details
  ispProvider: string;
  circuitId: string;
  accountNumber: string;
  bandwidthCir: string;
  supportContact: string;
  // Access Credentials
  routerAdminUrl: string;
  routerAdminUser: string;
  routerAdminPass: string;
  cctvNvrIp: string;
  cctvNvrUser: string;
  cctvNvrPass: string;
  serverRdpIp: string;
  serverRdpUser: string;
  serverRdpPass: string;
  // Expiry Trackers
  domainName: string;
  domainExpiryDate?: string;
  sslExpiryDate?: string;
  m365LicenseCount?: number;
  m365RenewalDate?: string;
  antivirusBrand?: string;
  antivirusExpiryDate?: string;
  backupRetentionPolicy?: string;
  notes?: string;
  updatedAt: string;
  createdAt: string;
}

export interface EquipmentIntakeRecord {
  id: string;
  intakeNumber: string; // e.g. KRN-INTAKE-2026-001
  clientName: string;
  company?: string;
  phone: string;
  email?: string;
  deviceType: "laptop" | "desktop" | "server" | "switch" | "router" | "printer" | "cctv_nvr" | "other";
  brandModel: string;
  serialNumber: string;
  passcodePattern?: string;
  accessories: {
    powerAdapter: boolean;
    bag: boolean;
    cables: boolean;
    mouse: boolean;
    other?: string;
  };
  cosmeticCondition: "pristine" | "minor_scratches" | "heavy_wear" | "cracked_screen" | "liquid_damage_suspected";
  reportedFault: string;
  diagnosticFee: number; // default 1500 KES
  estimatedCost?: number;
  priority: "standard" | "urgent" | "critical_emergency";
  status: "received" | "diagnosing" | "awaiting_parts" | "repaired" | "ready_for_pickup" | "collected";
  collectedAt?: string;
  collectedBy?: string;
  agreedTerms: boolean;
  intakeDate: string;
  notes?: string;
  createdAt: string;
}

export interface MPesaTransactionRecord {
  id: string;
  receiptNumber: string; // e.g. QHB72991LK
  invoiceId?: string;
  invoiceDocNumber?: string;
  clientName: string;
  clientPhone: string;
  amount: number;
  transactionType: "STK_PUSH" | "PAYBILL_C2B" | "TILL_BUY_GOODS" | "MANUAL_ENTRY";
  status: "completed" | "pending" | "failed" | "cancelled";
  checkoutRequestId?: string;
  merchantRequestId?: string;
  resultDesc?: string;
  timestamp: string;
  createdAt: string;
}

export interface WhatsAppCampaignRecord {
  id: string;
  campaignTitle: string;
  targetAudience: "all" | "cctv_clients" | "wifi_clients" | "retainer_sla" | "repair_clients";
  templateCategory: "seasonal_audit" | "wifi_upgrade" | "cctv_maintenance" | "sla_offer" | "custom";
  messageTemplate: string;
  recipientCount: number;
  dispatchedCount: number;
  lastDispatchedAt?: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  REVIEWS: "itguy_custom_reviews_v1",
  INQUIRIES: "itguy_inquiries_leads_v1",
  JOBS: "itguy_jobs_schedule_v1",
  BANNER: "itguy_site_banner_config_v1",
  ADMIN_PIN: "itguy_admin_pin_v1",
  SUPABASE_SETTINGS: "itguy_supabase_config_v1",
  ADMIN_AUTH: "itguy_admin_authenticated",
  COMPANY_PROFILE: "krenovate_company_profile_v1",
  CLIENTS: "krenovate_clients_v1",
  INVOICES: "krenovate_invoices_v1",
  SITE_CONTENT: "itguy_site_content_v1",
  SUBSCRIBERS: "itguy_subscribers_v1",
  RESEND_SETTINGS: "itguy_resend_config_v1",
  BROADCAST_HISTORY: "itguy_email_broadcasts_v1",
  PAYMENTS: "itguy_payment_records_v1",
  EXPENSES: "itguy_expense_records_v1",
  INVENTORY: "itguy_inventory_items_v1",
  KRA_SETTINGS: "itguy_kra_profile_settings_v1",
  WHT_CERTIFICATES: "itguy_wht_certificates_v1",
  CLIENT_VAULTS: "itguy_client_vaults_v1",
  EQUIPMENT_INTAKES: "itguy_equipment_intakes_v1",
  MPESA_TRANSACTIONS: "itguy_mpesa_transactions_v1",
  WHATSAPP_CAMPAIGNS: "itguy_whatsapp_campaigns_v1",
};

export const DEFAULT_KRA_PROFILE: KRAProfileSettings = {
  taxpayerName: "Peter Kivevo John / Krenovate Systems",
  kraPin: "P051892401K",
  taxObligation: "turnover_tax",
  turnoverTaxRate: 3,
  vatRate: 16,
  whtRate: 5,
  whtVatRate: 2,
  annualPersonalRelief: 28800,
  insuranceRelief: 0,
  housingRelief: 0,
  etimsSerialNumber: "KRA-ETIMS-PK01-2026",
  etimsBranchId: "00",
  etimsControlPrefix: "KRA-INV",
  autoGenerateEtimsSignature: true,
  businessType: "sole_proprietor",
};

export const INITIAL_WHT_CERTIFICATES: WhtCertificateRecord[] = [
  {
    id: "wht-1",
    certificateNumber: "KRA-WHT-2026-0881",
    withholdingAgentName: "Samchi Telecom Kenya Ltd",
    withholdingAgentPin: "P051122334A",
    invoiceDocNumber: "INV-2026-001",
    grossAmount: 48000,
    whtAmount: 2400,
    whtType: "management_professional_5",
    dateWithheld: "2026-08-16",
    taxPeriod: "2026-08",
    status: "verified",
    notes: "5% WHT deducted for Multi-Floor Wi-Fi Deployment at Westlands HQ.",
    createdAt: "2026-08-16T12:00:00.000Z",
  },
  {
    id: "wht-2",
    certificateNumber: "KRA-WHT-2026-0942",
    withholdingAgentName: "After 40 Hotel Nairobi",
    withholdingAgentPin: "P051998877B",
    invoiceDocNumber: "INV-2026-002",
    grossAmount: 35000,
    whtAmount: 1750,
    whtType: "management_professional_5",
    dateWithheld: "2026-08-25",
    taxPeriod: "2026-08",
    status: "verified",
    notes: "5% WHT deducted for POS Till Isolation & Access Point Upgrades.",
    createdAt: "2026-08-25T15:30:00.000Z",
  },
];

export const DEFAULT_RESEND_SETTINGS: ResendSettings = {
  apiKey: typeof import.meta !== "undefined" && import.meta.env?.VITE_RESEND_API_KEY ? import.meta.env.VITE_RESEND_API_KEY : "",
  fromEmail: "Peter Kivevo <onboarding@resend.dev>",
  recipientEmail: "xkivevo@gmail.com",
  notifyOnInquiry: true,
  notifyOnReview: true,
  welcomeEmailEnabled: true,
};

export const INITIAL_SUBSCRIBERS: SubscriberItem[] = [
  {
    id: "sub-1",
    email: "samuel.k@samchitelecom.co.ke",
    name: "Samuel Kariuki",
    phone: "+254 722 100 200",
    source: "Client - Samchi Telecom",
    status: "subscribed",
    subscribedAt: "2026-06-15T09:00:00.000Z",
  },
  {
    id: "sub-2",
    email: "gm@after40hotel.com",
    name: "General Manager",
    phone: "+254 733 456 789",
    source: "Client - After 40 Hotel",
    status: "subscribed",
    subscribedAt: "2026-07-02T11:30:00.000Z",
  },
  {
    id: "sub-3",
    email: "director@snlvenue.co.ke",
    name: "Operations Director",
    phone: "+254 720 998 877",
    source: "Client - SNL Venue",
    status: "subscribed",
    subscribedAt: "2026-07-20T14:15:00.000Z",
  },
  {
    id: "sub-4",
    email: "info@solarkenyagroup.com",
    name: "Evans Omondi",
    phone: "+254 711 345 678",
    source: "Website Lead",
    status: "subscribed",
    subscribedAt: "2026-08-10T16:40:00.000Z",
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  siteInfo: {
    name: SITE_CONFIG.name,
    brandName: SITE_CONFIG.brandName,
    shortTitle: SITE_CONFIG.shortTitle,
    tagline: SITE_CONFIG.tagline,
    subtagline: SITE_CONFIG.subtagline,
    phoneDisplay: SITE_CONFIG.phoneDisplay,
    phoneTel: SITE_CONFIG.phoneTel,
    whatsappNumber: SITE_CONFIG.whatsappNumber,
    email: SITE_CONFIG.email,
    location: SITE_CONFIG.location,
    officeHours: SITE_CONFIG.officeHours,
    social: { ...SITE_CONFIG.social },
    stats: [...SITE_CONFIG.stats],
  },
  services: [...SERVICES],
  caseStudies: [...CASE_STUDIES],
  partners: [...CLIENT_PARTNERS],
  credentials: [...CREDENTIALS_LIST],
};

export const DEFAULT_SUPABASE_CONFIG: SupabaseSettings = {
  url: "https://jjszagwjkzdqrtofdxtt.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc3phZ3dqa3pkcXJ0b2ZkeHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MjE3NDgsImV4cCI6MjEwMzQ5Nzc0OH0.6y4BOylTldKY-MFq1RvwRNYfp_xqIkJZrtxdwemdToo",
  enabled: true,
};

const DEFAULT_BANNER: SiteBannerConfig = {
  enabled: true,
  badgeText: "ON-CALL TODAY",
  message: "Peter Kivevo is available in Nairobi for urgent office Wi-Fi, server & website emergencies.",
  linkText: "Request Fast Fix",
  variant: "teal",
};

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  name: "Krenovate Systems",
  tagline: "Enterprise IT Support, Network Engineering & Digital Systems",
  logoUrl: "",
  email: "info@krenovatesystems.com",
  phone: "+254 722 000 000",
  website: "www.krenovatesystems.com",
  address: "P.O. Box 79240-00200, Nairobi, Kenya",
  kraPin: "P051892401K",
  authorizedSignatory: "Krenovate Systems",
  mpesaType: "Paybill",
  mpesaNumber: "247247",
  mpesaAccount: "Krenovate Systems",
  includeBankDetails: true,
  bankName: "NCBA Bank Kenya",
  bankAccountName: "Krenovate Systems Limited",
  bankAccountNumber: "10023456789",
  bankBranch: "Nairobi Westlands Branch",
  currency: "KES",
  defaultVatPercent: 16,
  defaultPaymentTermsDays: 14,
  notesTemplate: "1. Payment is due within 14 days of invoice date.\n2. All hardware installations carry a 30-day comprehensive support warranty.\n3. Make all payments directly via official M-Pesa Paybill or Bank details above.",
};

const INITIAL_CLIENTS: SavedClient[] = [
  {
    id: "client-1",
    name: "David Mwangi",
    company: "Peak Logistics Hub Ltd",
    email: "david@peaklogistics.co.ke",
    phone: "+254 722 345 678",
    address: "Mombasa Rd, Nairobi",
    kraPin: "P051122334A",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "client-2",
    name: "Mary Wanjiku",
    company: "After40 Hotel",
    email: "gm@after40hotel.com",
    phone: "+254 733 987 654",
    address: "Biashara Street, Nairobi CBD",
    kraPin: "P058899112B",
    createdAt: "2026-08-05T11:00:00.000Z",
  },
  {
    id: "client-3",
    name: "Kennedy Omondi",
    company: "SNL Lounge & Garden",
    email: "management@snllounge.co.ke",
    phone: "+254 711 456 789",
    address: "Mtwapa, Mombasa / Kilimani",
    kraPin: "P054455667C",
    createdAt: "2026-08-10T12:00:00.000Z",
  },
];

const INITIAL_INVOICES: InvoiceDocument[] = [
  {
    id: "inv-1",
    docType: "quotation",
    docNumber: "KRN-QT-2026-001",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    status: "sent",
    client: {
      id: "client-1",
      name: "David Mwangi",
      company: "Peak Logistics Hub Ltd",
      email: "david@peaklogistics.co.ke",
      phone: "+254 722 345 678",
      address: "Mombasa Rd, Nairobi",
      kraPin: "P051122334A",
    },
    items: [
      { id: "item-1", desc: "Ubiquiti UniFi U6+ Long-Range Wi-Fi 6 Access Points (Installed & Configured)", qty: 2, unitPrice: 18500 },
      { id: "item-2", desc: "16-Port Gigabit Managed PoE+ Network Switch with VLAN Separation", qty: 1, unitPrice: 24500 },
      { id: "item-3", desc: "Pure Copper Solid Cat6 Structured Network Cabling & Patch Panel Runs", qty: 1, unitPrice: 16000 },
      { id: "item-4", desc: "On-Site Network Deployment, Isolated Guest Wi-Fi & Bandwidth Shaping Labor", qty: 1, unitPrice: 20000 },
    ],
    discountType: "flat",
    discountValue: 2000,
    vatEnabled: true,
    vatPercent: 16,
    currency: "KES",
    notes: "Turnkey Wi-Fi rollout. Includes guest network isolation so payment machines never freeze.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "inv-2",
    docType: "invoice",
    docNumber: "KRN-INV-2026-001",
    issueDate: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 11 * 86400000).toISOString().slice(0, 10),
    status: "paid",
    client: {
      id: "client-2",
      name: "Mary Wanjiku",
      company: "After40 Hotel",
      email: "gm@after40hotel.com",
      phone: "+254 733 987 654",
      address: "Biashara Street, Nairobi CBD",
      kraPin: "P058899112B",
    },
    items: [
      { id: "item-1", desc: "High-Performance Business Website Revamp & Cloud Hosting Deployment", qty: 1, unitPrice: 45000 },
      { id: "item-2", desc: "Monthly Enterprise IT & Network Retainer SLA (Unlimited Remote & Maintenance)", qty: 1, unitPrice: 25000 },
    ],
    discountType: "percentage",
    discountValue: 0,
    vatEnabled: false,
    vatPercent: 16,
    currency: "KES",
    notes: "Payment received in full via M-Pesa Paybill. Thank you for your partnership!",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-1",
    invoiceId: "inv-2",
    clientName: "After40 Hotel",
    description: "Full settlement for website revamp & monthly IT retainer",
    amount: 70000,
    paymentMethod: "mpesa",
    mpesaCode: "QHB72991LK",
    mpesaPhone: "+254 733 987 654",
    category: "website",
    date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
    notes: "Direct M-Pesa Paybill confirmation. Zero balance remaining.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "pay-2",
    clientName: "Peak Logistics Hub",
    description: "50% Upfront Deposit for UniFi Wi-Fi 6 Network Overhaul",
    amount: 37500,
    paymentMethod: "bank",
    bankRef: "NCBA-TX-88219",
    category: "wifi_network",
    date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10),
    notes: "Initial deposit before hardware procurement and cabling deployment.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "pay-3",
    clientName: "SNL Lounge & Garden",
    description: "Emergency Payment Till Isolation & Dual Outdoor Antenna Configuration",
    amount: 28000,
    paymentMethod: "mpesa",
    mpesaCode: "QFD11894MM",
    mpesaPhone: "+254 711 456 789",
    category: "wifi_network",
    date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
    notes: "Fixed on-site same-day. Payment confirmed.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: "exp-1",
    description: "MikroTik hEX S Router & 2x UniFi U6+ Access Points Procurement",
    amount: 42000,
    category: "hardware_parts",
    date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    receiptNote: "Official invoice from Nairobi distributor",
    notes: "Sourced for Peak Logistics deployment",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "exp-2",
    description: "Uber / Fuel Transport for On-Site Triage (Mombasa Rd & Westlands)",
    amount: 3500,
    category: "transport",
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10),
    receiptNote: "Uber trip receipts",
    notes: "Same-day emergency client dispatches",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "exp-3",
    description: "Safaricom 5G/4G Data Bundle for Remote IT Diagnostic Hotspot",
    amount: 2000,
    category: "airtime_data",
    date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
    receiptNote: "M-Pesa Safaricom statement",
    notes: "Monthly field diagnostics connectivity",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv-item-1",
    name: "UniFi U6+ Wi-Fi 6 Long-Range Access Point",
    brand: "Ubiquiti",
    model: "U6-Plus",
    category: "access_point",
    quantity: 4,
    unitCost: 14500,
    sellingPrice: 18500,
    serialNumbers: "U6P-984210, U6P-984211, U6P-984212, U6P-984213",
    condition: "new",
    supplier: "Nairobi Tech Supplies",
    purchaseDate: "2026-08-15",
    warrantyExpiry: "2027-08-15",
    notes: "High demand item for restaurant & office deployments.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-item-2",
    name: "MikroTik hEX S 5-Port Gigabit Router with SFP",
    brand: "MikroTik",
    model: "RB760iGS",
    category: "router",
    quantity: 2,
    unitCost: 8500,
    sellingPrice: 12000,
    serialNumbers: "MT-RB760-4491, MT-RB760-4492",
    condition: "new",
    supplier: "Kenya Networking Hub",
    purchaseDate: "2026-08-18",
    warrantyExpiry: "2027-08-18",
    notes: "Standard router for guest/POS VLAN isolation & dual WAN 5G failover.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-item-3",
    name: "16-Port Gigabit PoE+ Managed Switch",
    brand: "TP-Link Omada",
    model: "TL-SG1218MPE",
    category: "switch",
    quantity: 1,
    unitCost: 19000,
    sellingPrice: 24500,
    serialNumbers: "TPL-POE-88390",
    condition: "new",
    supplier: "Nairobi Tech Supplies",
    purchaseDate: "2026-08-10",
    warrantyExpiry: "2027-08-10",
    notes: "Powers CCTV cameras and UniFi APs over Cat6 Ethernet.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-item-4",
    name: "Hikvision 4K 8MP ColorVu Dome Camera (PoE)",
    brand: "Hikvision",
    model: "DS-2CD2187G2-L",
    category: "cctv_camera",
    quantity: 6,
    unitCost: 6500,
    sellingPrice: 9000,
    serialNumbers: "HK-CV8-101, HK-CV8-102, HK-CV8-103, HK-CV8-104, HK-CV8-105, HK-CV8-106",
    condition: "new",
    supplier: "Security Solutions Kenya",
    purchaseDate: "2026-08-20",
    warrantyExpiry: "2027-08-20",
    notes: "Color night vision with built-in mic & phone streaming app.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-item-5",
    name: "Cat6 Pure Copper Solid UTP Cable Roll (305m)",
    brand: "D-Link",
    model: "NCB-C6UBLUR-305",
    category: "cable",
    quantity: 2,
    unitCost: 12000,
    sellingPrice: 16000,
    serialNumbers: "DL-CAT6-305M-A, DL-CAT6-305M-B",
    condition: "new",
    supplier: "Kenya Networking Hub",
    purchaseDate: "2026-08-12",
    notes: "Zero-latency pure copper for POS & server trunking.",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_JOBS: JobScheduleItem[] = [
  {
    id: "job-1",
    clientName: "David Mwangi",
    company: "Peak Logistics Hub",
    phone: "+254 722 345 678",
    location: "Mombasa Rd, Nairobi",
    visitDate: new Date().toISOString().slice(0, 10),
    timeSlot: "11:00 AM - 01:00 PM",
    serviceType: "Wi-Fi & Network Fix",
    status: "scheduled",
    notes: "Warehouse Wi-Fi dropping packet connection during barcode scan checkout.",
    hardwareSerialNumbers: "UniFi AP-AC-LR #US98421, Mikrotik RB750Gr3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    clientName: "Grace Wanjiku",
    company: "Stratbridge Advisory Suites",
    phone: "+254 733 987 654",
    location: "Westlands, Nairobi",
    visitDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    timeSlot: "02:30 PM - 04:30 PM",
    serviceType: "CCTV & Cameras Setup",
    status: "scheduled",
    notes: "Install 4 HD security dome cameras covering entrance & executive boardroom.",
    hardwareSerialNumbers: "Hikvision 8CH 4K NVR #HK90214",
    createdAt: new Date().toISOString(),
  },
];

const getInitialSeedReviews = (): ReviewItem[] => {
  return TESTIMONIALS.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    location: t.location,
    avatarText: t.avatarText,
    content: t.content,
    rating: t.rating,
    highlight: t.highlight,
    status: "approved" as const,
    createdAt: "2026-08-01T10:00:00.000Z",
  }));
};

class DataStorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    setTimeout(() => {
      this.fetchFromSupabase();
    }, 800);
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Storage listener error", err);
      }
    });
  }

  // --- REVIEWS ---
  public getReviews(): ReviewItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!stored) {
        const seed = getInitialSeedReviews();
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(stored);
    } catch {
      return getInitialSeedReviews();
    }
  }

  public getApprovedReviews(): ReviewItem[] {
    return this.getReviews().filter((r) => r.status === "approved");
  }

  public addReview(review: ReviewItem | (Omit<ReviewItem, "id" | "createdAt" | "status"> & { status?: "approved" | "pending" | "rejected"; id?: string; createdAt?: string })): ReviewItem {
    const all = this.getReviews();
    const initials = review.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CL";

    const newReview: ReviewItem = {
      ...review,
      id: review.id || `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      avatarText: review.avatarText || initials,
      status: review.status || "approved",
      createdAt: review.createdAt || new Date().toISOString(),
    };

    const updated = [newReview, ...all];
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save review to storage", err);
    }

    this.notify();
    this.syncReviewToSupabase(newReview);
    return newReview;
  }

  public updateReviewStatus(id: string, status: "approved" | "pending" | "rejected") {
    const all = this.getReviews().map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    this.notify();
  }

  public deleteReview(id: string) {
    const all = this.getReviews().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    this.notify();
  }

  // --- INQUIRIES & LEADS CRM ---
  public getInquiries(): InquiryLead[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public addInquiry(lead: Omit<InquiryLead, "id" | "createdAt" | "status">): InquiryLead {
    const all = this.getInquiries();
    const newInquiry: InquiryLead = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...all];
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save inquiry to storage", err);
    }

    this.notify();
    this.syncInquiryToSupabase(newInquiry);
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: "new" | "contacted" | "quote_sent" | "completed") {
    const all = this.getInquiries().map((inq) => (inq.id === id ? { ...inq, status } : inq));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(all));
    this.notify();
  }

  public updateInquiryNotes(id: string, notes: string) {
    const all = this.getInquiries().map((inq) => (inq.id === id ? { ...inq, notes } : inq));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(all));
    this.notify();
  }

  public deleteInquiry(id: string) {
    const all = this.getInquiries().filter((inq) => inq.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(all));
    this.notify();
  }

  // --- ON-SITE DISPATCH & JOBS SCHEDULER ---
  public getJobs(): JobScheduleItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
        return INITIAL_JOBS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_JOBS;
    }
  }

  public addJob(job: Omit<JobScheduleItem, "id" | "createdAt">): JobScheduleItem {
    const all = this.getJobs();
    const newJob: JobScheduleItem = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newJob, ...all];
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
    this.notify();
    return newJob;
  }

  public updateJobStatus(id: string, status: JobScheduleItem["status"]) {
    const all = this.getJobs().map((j) => (j.id === id ? { ...j, status } : j));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    this.notify();
  }

  public updateJobNotes(id: string, notes: string, hardwareSerialNumbers?: string) {
    const all = this.getJobs().map((j) => 
      j.id === id ? { ...j, notes, ...(hardwareSerialNumbers !== undefined ? { hardwareSerialNumbers } : {}) } : j
    );
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    this.notify();
  }

  public deleteJob(id: string) {
    const all = this.getJobs().filter((j) => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(all));
    this.notify();
  }

  // --- SITE BANNER SETTINGS ---
  public getBannerConfig(): SiteBannerConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BANNER);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(DEFAULT_BANNER));
        return DEFAULT_BANNER;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BANNER;
    }
  }

  public saveBannerConfig(config: SiteBannerConfig) {
    localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(config));
    this.notify();
  }

  // --- ADMIN PIN / SECURITY ---
  public getAdminPin(): string {
    // 1. Check localStorage for an admin-changed override
    const localOverride = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    if (localOverride) return localOverride;
    // 2. Check environment variable (if set in Vercel)
    const envPin = import.meta.env.VITE_ADMIN_PIN as string | undefined;
    if (envPin && envPin.trim().length > 0) return envPin.trim();
    // 3. Fallback PIN (2540)
    return "2540";
  }

  public setAdminPin(newPin: string) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin);
    this.notify();
  }

  // --- KRENOVATE SYSTEMS: COMPANY PROFILE ---
  public getCompanyProfile(): CompanyProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_PROFILE);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILE, JSON.stringify(DEFAULT_COMPANY_PROFILE));
        return DEFAULT_COMPANY_PROFILE;
      }
      return { ...DEFAULT_COMPANY_PROFILE, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_COMPANY_PROFILE;
    }
  }

  public saveCompanyProfile(profile: CompanyProfile) {
    localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILE, JSON.stringify(profile));
    this.notify();
  }

  // --- KRENOVATE SYSTEMS: SAVED CLIENTS ---
  public getClients(): SavedClient[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
        return INITIAL_CLIENTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_CLIENTS;
    }
  }

  public saveClient(client: Omit<SavedClient, "id" | "createdAt"> & { id?: string }): SavedClient {
    const all = this.getClients();
    if (client.id) {
      const updated = all.map((c) =>
        c.id === client.id ? { ...c, ...client } : c
      );
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
      this.notify();
      return all.find((c) => c.id === client.id)!;
    } else {
      const newClient: SavedClient = {
        ...client,
        id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newClient, ...all];
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
      this.notify();
      return newClient;
    }
  }

  public deleteClient(id: string) {
    const all = this.getClients().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(all));
    this.notify();
  }

  // --- KRENOVATE SYSTEMS: INVOICES & QUOTATIONS ---
  public getInvoices(): InvoiceDocument[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
        return INITIAL_INVOICES;
      }
      // Only return non-deleted documents
      return (JSON.parse(stored) as InvoiceDocument[]).filter((inv) => !inv.deletedAt);
    } catch {
      return INITIAL_INVOICES;
    }
  }

  /** Returns only soft-deleted documents (recycle bin) */
  public getDeletedInvoices(): InvoiceDocument[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!stored) return [];
      return (JSON.parse(stored) as InvoiceDocument[]).filter((inv) => Boolean(inv.deletedAt));
    } catch {
      return [];
    }
  }

  public getInvoiceById(id: string): InvoiceDocument | undefined {
    return this.getInvoices().find((inv) => inv.id === id);
  }

  public saveInvoice(doc: Omit<InvoiceDocument, "id" | "createdAt" | "updatedAt"> & { id?: string }): InvoiceDocument {
    const all = this.getInvoices();
    if (doc.id) {
      const updated = all.map((inv) =>
        inv.id === doc.id
          ? {
              ...inv,
              ...doc,
              updatedAt: new Date().toISOString(),
            }
          : inv
      );
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
      this.notify();
      return this.getInvoiceById(doc.id)!;
    } else {
      const newDoc: InvoiceDocument = {
        ...doc,
        id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newDoc, ...all];
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
      this.notify();
      return newDoc;
    }
  }

  /** Soft-delete: moves to recycle bin (sets deletedAt timestamp) */
  public softDeleteInvoice(id: string) {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      const all: InvoiceDocument[] = stored ? JSON.parse(stored) : [];
      const updated = all.map((inv) =>
        inv.id === id ? { ...inv, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : inv
      );
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
      this.notify();
    } catch { /* silent */ }
  }

  /** Restore from recycle bin */
  public restoreInvoice(id: string) {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      const all: InvoiceDocument[] = stored ? JSON.parse(stored) : [];
      const updated = all.map((inv) => {
        if (inv.id === id) {
          const { deletedAt: _removed, ...rest } = inv;
          return { ...rest, updatedAt: new Date().toISOString() };
        }
        return inv;
      });
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(updated));
      this.notify();
    } catch { /* silent */ }
  }

  /** Permanently erase from storage — no recovery */
  public permanentDeleteInvoice(id: string) {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
      const all: InvoiceDocument[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(all.filter((inv) => inv.id !== id)));
      this.notify();
    } catch { /* silent */ }
  }

  /** @deprecated Use softDeleteInvoice instead */
  public deleteInvoice(id: string) {
    this.softDeleteInvoice(id);
  }

  public duplicateInvoice(id: string): InvoiceDocument | undefined {
    const original = this.getInvoiceById(id);
    if (!original) return undefined;

    const newDocType = original.docType;
    const nextNumber = this.getNextDocNumber(newDocType);

    const cloned: Omit<InvoiceDocument, "id" | "createdAt" | "updatedAt"> = {
      ...original,
      docNumber: nextNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: "draft",
      items: original.items.map((item) => ({
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      })),
    };

    return this.saveInvoice(cloned);
  }

  public updateInvoiceStatus(id: string, status: InvoiceDocument["status"]) {
    const all = this.getInvoices().map((inv) =>
      inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv
    );
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(all));
    this.notify();
  }

  public getNextDocNumber(docType: "quotation" | "invoice" | "receipt"): string {
    const all = this.getInvoices();
    const prefix = docType === "quotation" ? "KRN-QT" : docType === "invoice" ? "KRN-INV" : "KRN-REC";
    const year = new Date().getFullYear();
    
    // Count existing for this prefix and year
    const matching = all.filter((inv) => inv.docNumber.startsWith(`${prefix}-${year}`));
    const nextSeq = matching.length + 1;
    return `${prefix}-${year}-${String(nextSeq).padStart(3, "0")}`;
  }

  // --- SUPABASE CLOUD SYNC ---
  public getSupabaseSettings(): SupabaseSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUPABASE_SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SUPABASE_SETTINGS, JSON.stringify(DEFAULT_SUPABASE_CONFIG));
        return DEFAULT_SUPABASE_CONFIG;
      }
      const parsed = JSON.parse(stored);
      if (!parsed.url || !parsed.anonKey) {
        return DEFAULT_SUPABASE_CONFIG;
      }
      return parsed;
    } catch {
      return DEFAULT_SUPABASE_CONFIG;
    }
  }

  public saveSupabaseSettings(settings: SupabaseSettings) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_SETTINGS, JSON.stringify(settings));
    this.notify();
    this.fetchFromSupabase();
  }

  public async testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; tablesCreated?: boolean }> {
    if (!url.trim() || !key.trim()) {
      return { success: false, message: "Please provide both Supabase URL and Anon Key." };
    }

    try {
      const cleanUrl = url.trim().replace(/\/$/, "");
      const cleanKey = key.trim();

      const healthRes = await fetch(`${cleanUrl}/auth/v1/health`, {
        method: "GET",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });

      if (!healthRes.ok && healthRes.status !== 200) {
        return { success: false, message: `Could not connect to Supabase: Status ${healthRes.status}` };
      }

      const tableRes = await fetch(`${cleanUrl}/rest/v1/reviews?select=id&limit=1`, {
        method: "GET",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });

      if (tableRes.ok || tableRes.status === 200) {
        return { 
          success: true, 
          message: "🟢 Connected to Supabase successfully! Tables are active and ready.",
          tablesCreated: true 
        };
      } else {
        return { 
          success: true, 
          message: "🟢 Connected to Supabase Project! ⚠️ Next step: Run the SQL setup script below in your Supabase SQL Editor to create the tables.",
          tablesCreated: false 
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, message: `Could not connect to Supabase: ${msg}` };
    }
  }

  public async pushAllToSupabase(): Promise<{ success: boolean; message: string }> {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) {
      return { success: false, message: "Supabase is not configured or disabled." };
    }

    const cleanUrl = config.url.trim().replace(/\/$/, "");
    const cleanKey = config.anonKey.trim();

    try {
      // 1. Push reviews
      const reviews = this.getReviews();
      if (reviews.length > 0) {
        await fetch(`${cleanUrl}/rest/v1/reviews`, {
          method: "POST",
          headers: {
            apikey: cleanKey,
            Authorization: `Bearer ${cleanKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(reviews),
        });
      }

      // 2. Push inquiries
      const inquiries = this.getInquiries();
      if (inquiries.length > 0) {
        await fetch(`${cleanUrl}/rest/v1/inquiries`, {
          method: "POST",
          headers: {
            apikey: cleanKey,
            Authorization: `Bearer ${cleanKey}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(inquiries),
        });
      }

      return { success: true, message: `Successfully pushed ${reviews.length} reviews and ${inquiries.length} inquiries to Supabase!` };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, message: `Failed to push to Supabase: ${msg}` };
    }
  }

  public async fetchFromSupabase() {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) return;

    const cleanUrl = config.url.trim().replace(/\/$/, "");
    const cleanKey = config.anonKey.trim();

    try {
      // Fetch reviews
      const revRes = await fetch(`${cleanUrl}/rest/v1/reviews?select=*`, {
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });
      if (revRes.ok) {
        const remoteReviews: ReviewItem[] = await revRes.json();
        if (remoteReviews && remoteReviews.length > 0) {
          const local = this.getReviews();
          const merged = [...remoteReviews];
          local.forEach((loc) => {
            if (!merged.some((m) => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(merged));
          this.notify();
        }
      }

      // Fetch inquiries
      const inqRes = await fetch(`${cleanUrl}/rest/v1/inquiries?select=*`, {
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
        },
      });
      if (inqRes.ok) {
        const remoteInquiries: InquiryLead[] = await inqRes.json();
        if (remoteInquiries && remoteInquiries.length > 0) {
          const local = this.getInquiries();
          const merged = [...remoteInquiries];
          local.forEach((loc) => {
            if (!merged.some((m) => m.id === loc.id)) {
              merged.push(loc);
            }
          });
          localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(merged));
          this.notify();
        }
      }
    } catch (err: unknown) {
      console.warn("fetchFromSupabase failed:", err);
    }
  }

  // --- WEBSITE CONTENT CMS ---
  public getSiteContent(): SiteContent {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
        return DEFAULT_SITE_CONTENT;
      }
      const parsed = JSON.parse(stored);
      return {
        siteInfo: { ...DEFAULT_SITE_CONTENT.siteInfo, ...(parsed.siteInfo || {}) },
        services: parsed.services?.length ? parsed.services : DEFAULT_SITE_CONTENT.services,
        caseStudies: parsed.caseStudies?.length ? parsed.caseStudies : DEFAULT_SITE_CONTENT.caseStudies,
        partners: parsed.partners?.length ? parsed.partners : DEFAULT_SITE_CONTENT.partners,
        credentials: parsed.credentials?.length ? parsed.credentials : DEFAULT_SITE_CONTENT.credentials,
      };
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  }

  public saveSiteContent(content: SiteContent) {
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
    this.notify();
  }

  public restoreDefaultSiteContent(): SiteContent {
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
    this.notify();
    return DEFAULT_SITE_CONTENT;
  }

  public getSiteServices(): ServiceItem[] {
    return this.getSiteContent().services;
  }

  public saveSiteServices(services: ServiceItem[]) {
    const current = this.getSiteContent();
    this.saveSiteContent({ ...current, services });
  }

  public getSiteCaseStudies(): CaseStudyItem[] {
    return this.getSiteContent().caseStudies;
  }

  public saveSiteCaseStudies(caseStudies: CaseStudyItem[]) {
    const current = this.getSiteContent();
    this.saveSiteContent({ ...current, caseStudies });
  }

  // --- SUBSCRIBERS & EMAIL BROADCASTS ---
  public getSubscribers(): SubscriberItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS));
        return INITIAL_SUBSCRIBERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  }

  public addSubscriber(sub: Omit<SubscriberItem, "id" | "subscribedAt" | "status"> & { id?: string; status?: "subscribed" | "unsubscribed" }): { success: boolean; isNew: boolean; subscriber: SubscriberItem } {
    const current = this.getSubscribers();
    const cleanEmail = sub.email.trim().toLowerCase();
    const existingIndex = current.findIndex((s) => s.email.toLowerCase() === cleanEmail);

    if (existingIndex >= 0) {
      // Update existing
      const updated: SubscriberItem = {
        ...current[existingIndex],
        name: sub.name || current[existingIndex].name,
        phone: sub.phone || current[existingIndex].phone,
        status: "subscribed",
      };
      current[existingIndex] = updated;
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(current));
      this.notify();
      return { success: true, isNew: false, subscriber: updated };
    }

    const newSub: SubscriberItem = {
      id: sub.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name: sub.name?.trim() || "",
      phone: sub.phone?.trim() || "",
      source: sub.source || "Website Form",
      status: "subscribed",
      subscribedAt: new Date().toISOString(),
    };

    const next = [newSub, ...current];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(next));
    this.notify();
    return { success: true, isNew: true, subscriber: newSub };
  }

  public updateSubscriberStatus(id: string, status: "subscribed" | "unsubscribed") {
    const current = this.getSubscribers();
    const next = current.map((s) => (s.id === id ? { ...s, status } : s));
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(next));
    this.notify();
  }

  public removeSubscriber(id: string) {
    const current = this.getSubscribers();
    const next = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(next));
    this.notify();
  }

  public importSubscribers(list: { email: string; name?: string; phone?: string; source?: string }[]): { added: number; updated: number } {
    const current = this.getSubscribers();
    let added = 0;
    let updated = 0;

    list.forEach((item) => {
      const cleanEmail = item.email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) return;

      const idx = current.findIndex((s) => s.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        current[idx] = {
          ...current[idx],
          name: item.name?.trim() || current[idx].name,
          phone: item.phone?.trim() || current[idx].phone,
          source: item.source || current[idx].source,
          status: "subscribed",
        };
        updated++;
      } else {
        current.unshift({
          id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          email: cleanEmail,
          name: item.name?.trim() || "",
          phone: item.phone?.trim() || "",
          source: item.source || "CSV Import",
          status: "subscribed",
          subscribedAt: new Date().toISOString(),
        });
        added++;
      }
    });

    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(current));
    this.notify();
    return { added, updated };
  }

  // --- RESEND SETTINGS ---
  public getResendSettings(): ResendSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESEND_SETTINGS);
      if (!stored) return DEFAULT_RESEND_SETTINGS;
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_RESEND_SETTINGS,
        ...parsed,
        apiKey: parsed.apiKey?.trim() ? parsed.apiKey.trim() : DEFAULT_RESEND_SETTINGS.apiKey,
      };
    } catch {
      return DEFAULT_RESEND_SETTINGS;
    }
  }

  public saveResendSettings(settings: ResendSettings) {
    localStorage.setItem(STORAGE_KEYS.RESEND_SETTINGS, JSON.stringify(settings));
    this.notify();
  }

  // --- BROADCAST HISTORY ---
  public getBroadcastHistory(): EmailBroadcastItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BROADCAST_HISTORY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public addBroadcastItem(item: Omit<EmailBroadcastItem, "id" | "sentAt"> & { id?: string; sentAt?: string }): EmailBroadcastItem {
    const current = this.getBroadcastHistory();
    const newItem: EmailBroadcastItem = {
      id: item.id || `bc_${Date.now()}`,
      sentAt: item.sentAt || new Date().toISOString(),
      ...item,
    };
    const next = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.BROADCAST_HISTORY, JSON.stringify(next));
    this.notify();
    return newItem;
  }

  public clearBroadcastHistory() {
    localStorage.setItem(STORAGE_KEYS.BROADCAST_HISTORY, JSON.stringify([]));
    this.notify();
  }


  public exportFullBackup() {
    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      siteName: "Peter Kivevo | The IT Guy",
      data: {
        reviews: this.getReviews(),
        inquiries: this.getInquiries(),
        jobs: this.getJobs(),
        banner: this.getBannerConfig(),
        supabaseSettings: this.getSupabaseSettings(),
        companyProfile: this.getCompanyProfile(),
        clients: this.getClients(),
        invoices: this.getInvoices(),
        siteContent: this.getSiteContent(),
        subscribers: this.getSubscribers(),
        resendSettings: this.getResendSettings(),
        broadcastHistory: this.getBroadcastHistory(),
        payments: this.getPayments(),
        expenses: this.getExpenses(),
        inventory: this.getInventory(),
      },
    };
  }

  // --- EARNINGS & PAYMENT LEDGER ---
  public getPayments(): PaymentRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
        return INITIAL_PAYMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_PAYMENTS;
    }
  }

  public addPayment(payment: Omit<PaymentRecord, "id" | "createdAt">): PaymentRecord {
    const all = this.getPayments();
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPayment, ...all];
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(updated));
    this.notify();
    return newPayment;
  }

  public deletePayment(id: string) {
    const all = this.getPayments().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(all));
    this.notify();
  }

  // --- BUSINESS EXPENSES LEDGER ---
  public getExpenses(): ExpenseRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
        return INITIAL_EXPENSES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_EXPENSES;
    }
  }

  public addExpense(expense: Omit<ExpenseRecord, "id" | "createdAt">): ExpenseRecord {
    const all = this.getExpenses();
    const newExpense: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...all];
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated));
    this.notify();
    return newExpense;
  }

  public deleteExpense(id: string) {
    const all = this.getExpenses().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(all));
    this.notify();
  }

  // --- HARDWARE INVENTORY MANAGEMENT ---
  public getInventory(): InventoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
        return INITIAL_INVENTORY;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_INVENTORY;
    }
  }

  public saveInventoryItem(item: Omit<InventoryItem, "id" | "createdAt"> & { id?: string }): InventoryItem {
    const all = this.getInventory();
    if (item.id) {
      const updated = all.map((i) => (i.id === item.id ? { ...i, ...item } : i));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
      this.notify();
      return all.find((i) => i.id === item.id)!;
    } else {
      const newItem: InventoryItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...all];
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
      this.notify();
      return newItem;
    }
  }

  public deleteInventoryItem(id: string) {
    const all = this.getInventory().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(all));
    this.notify();
  }

  public updateInventoryQuantity(id: string, delta: number) {
    const all = this.getInventory();
    const updated = all.map((i) => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    });
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
    this.notify();
  }

  // --- INVOICE PARTIAL PAYMENT & LEDGER SYNC ---
  public recordInvoicePayment(
    invoiceId: string,
    payment: {
      amount: number;
      method: "mpesa" | "bank" | "cash" | "cheque";
      mpesaCode?: string;
      mpesaPhone?: string;
      bankRef?: string;
      date: string;
      notes?: string;
    }
  ): InvoiceDocument | undefined {
    const inv = this.getInvoiceById(invoiceId);
    if (!inv) return undefined;

    const paymentEntry: InvoicePayment = {
      ...payment,
      id: `inv-pay-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };

    const existingPayments = inv.payments || [];
    const updatedPayments = [...existingPayments, paymentEntry];

    // Compute invoice total to check if fully paid
    const subtotal = inv.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const discount =
      inv.discountType === "percentage"
        ? subtotal * (inv.discountValue / 100)
        : Math.min(subtotal, inv.discountValue);
    const afterDiscount = Math.max(0, subtotal - discount);
    const vat = inv.vatEnabled ? afterDiscount * ((inv.vatPercent || 16) / 100) : 0;
    const totalAmount = afterDiscount + vat;

    const totalPaidSoFar = updatedPayments.reduce((s, p) => s + p.amount, 0);
    const isFullyPaid = totalPaidSoFar >= totalAmount - 1; // allow small rounding diff

    const updatedInvoice: InvoiceDocument = {
      ...inv,
      payments: updatedPayments,
      status: isFullyPaid ? "paid" : inv.status === "draft" ? "sent" : inv.status,
      updatedAt: new Date().toISOString(),
    };

    // Save invoice
    const allInvoices = this.getInvoices().map((item) =>
      item.id === invoiceId ? updatedInvoice : item
    );
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(allInvoices));

    // Also auto-record to general payment ledger
    this.addPayment({
      invoiceId: inv.id,
      clientName: inv.client.company || inv.client.name,
      description: `Payment for ${inv.docNumber} (${inv.items.map((i) => i.desc).slice(0, 2).join(", ")})`,
      amount: payment.amount,
      paymentMethod: payment.method,
      mpesaCode: payment.mpesaCode,
      mpesaPhone: payment.mpesaPhone,
      bankRef: payment.bankRef,
      category: inv.items.some((i) => i.desc.toLowerCase().includes("web"))
        ? "website"
        : inv.items.some((i) => i.desc.toLowerCase().includes("wi-fi") || i.desc.toLowerCase().includes("vlan"))
        ? "wifi_network"
        : inv.items.some((i) => i.desc.toLowerCase().includes("cctv") || i.desc.toLowerCase().includes("camera"))
        ? "cctv"
        : "computer_support",
      date: payment.date,
      notes: payment.notes || `Linked to invoice ${inv.docNumber}`,
    });

    this.notify();
    return updatedInvoice;
  }

  public importFullBackup(backup: { data?: Record<string, unknown> } | null | undefined): { success: boolean; message: string } {
    try {
      if (!backup || !backup.data) {
        return { success: false, message: "Invalid backup format: missing data payload." };
      }
      const d = backup.data;
      if (d.reviews) localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(d.reviews));
      if (d.inquiries) localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(d.inquiries));
      if (d.jobs) localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(d.jobs));
      if (d.banner) localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(d.banner));
      if (d.supabaseSettings) localStorage.setItem(STORAGE_KEYS.SUPABASE_SETTINGS, JSON.stringify(d.supabaseSettings));
      if (d.companyProfile) localStorage.setItem(STORAGE_KEYS.COMPANY_PROFILE, JSON.stringify(d.companyProfile));
      if (d.clients) localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(d.clients));
      if (d.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(d.invoices));
      if (d.siteContent) localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(d.siteContent));
      if (d.subscribers) localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(d.subscribers));
      if (d.resendSettings) localStorage.setItem(STORAGE_KEYS.RESEND_SETTINGS, JSON.stringify(d.resendSettings));
      if (d.broadcastHistory) localStorage.setItem(STORAGE_KEYS.BROADCAST_HISTORY, JSON.stringify(d.broadcastHistory));
      if (d.payments) localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(d.payments));
      if (d.expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(d.expenses));
      if (d.inventory) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(d.inventory));
      if (d.kraSettings) localStorage.setItem(STORAGE_KEYS.KRA_SETTINGS, JSON.stringify(d.kraSettings));
      if (d.whtCertificates) localStorage.setItem(STORAGE_KEYS.WHT_CERTIFICATES, JSON.stringify(d.whtCertificates));

      this.notify();
      return { success: true, message: "Complete backup restored successfully!" };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to restore backup.";
      return { success: false, message };
    }
  }

  // ==========================================
  // KRA Tax & eTIMS Compliance Methods
  // ==========================================

  public getKRAProfile(): KRAProfileSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.KRA_SETTINGS);
    if (!raw) return { ...DEFAULT_KRA_PROFILE };
    try {
      return { ...DEFAULT_KRA_PROFILE, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_KRA_PROFILE };
    }
  }

  public saveKRAProfile(profile: Partial<KRAProfileSettings>): KRAProfileSettings {
    const current = this.getKRAProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.KRA_SETTINGS, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  public getWhtCertificates(): WhtCertificateRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WHT_CERTIFICATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WHT_CERTIFICATES, JSON.stringify(INITIAL_WHT_CERTIFICATES));
      return [...INITIAL_WHT_CERTIFICATES];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_WHT_CERTIFICATES];
    }
  }

  public addWhtCertificate(cert: Omit<WhtCertificateRecord, "id" | "createdAt">): WhtCertificateRecord {
    const items = this.getWhtCertificates();
    const newCert: WhtCertificateRecord = {
      ...cert,
      id: `wht-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCert, ...items];
    localStorage.setItem(STORAGE_KEYS.WHT_CERTIFICATES, JSON.stringify(updated));
    this.notify();
    return newCert;
  }

  public updateWhtCertificate(id: string, updates: Partial<WhtCertificateRecord>): boolean {
    const items = this.getWhtCertificates();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    items[idx] = { ...items[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.WHT_CERTIFICATES, JSON.stringify(items));
    this.notify();
    return true;
  }

  public deleteWhtCertificate(id: string): boolean {
    const items = this.getWhtCertificates();
    const filtered = items.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.WHT_CERTIFICATES, JSON.stringify(filtered));
    this.notify();
    return true;
  }

  public generateEtimsDetails(docNumber: string, amount: number, clientPin?: string): { controlCode: string; internalSign: string; qrData: string } {
    const kra = this.getKRAProfile();
    const cleanDoc = docNumber.replace(/[^A-Za-z0-9]/g, "");
    const hashSeed = `${cleanDoc}-${amount}-${Date.now().toString(36).toUpperCase()}`;
    
    const signPart1 = Math.abs(hashSeed.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0))
      .toString(16)
      .toUpperCase()
      .padStart(8, "0")
      .slice(0, 8);
    const signPart2 = Math.floor(1000 + Math.random() * 9000).toString();

    const controlCode = `${kra.etimsControlPrefix}-${cleanDoc.slice(-4) || "0001"}-${signPart2}`;
    const internalSign = `${signPart1.slice(0, 4)}-${signPart1.slice(4, 8)}-${signPart2}`;
    const qrData = `KRA-eTIMS|${kra.kraPin}|${clientPin || "NOT-PROVIDED"}|${docNumber}|${amount.toFixed(2)}|${controlCode}|${new Date().toISOString()}`;

    return { controlCode, internalSign, qrData };
  }

  public calculateTaxReturn(periodType: "monthly" | "annual", year: number, month?: number): KRATaxReturnSummary {
    const kra = this.getKRAProfile();
    const invoices = this.getInvoices().filter((inv) => !inv.deletedAt && (inv.status === "paid" || inv.status === "sent"));
    const expenses = this.getExpenses();
    const whtCerts = this.getWhtCertificates();

    const periodInvoices = invoices.filter((inv) => {
      const d = new Date(inv.issueDate);
      if (isNaN(d.getTime())) return false;
      const yrMatch = d.getFullYear() === year;
      if (!yrMatch) return false;
      if (periodType === "monthly" && month !== undefined) {
        return d.getMonth() + 1 === month;
      }
      return true;
    });

    const periodExpenses = expenses.filter((exp) => {
      const d = new Date(exp.date);
      if (isNaN(d.getTime())) return false;
      const yrMatch = d.getFullYear() === year;
      if (!yrMatch) return false;
      if (periodType === "monthly" && month !== undefined) {
        return d.getMonth() + 1 === month;
      }
      return true;
    });

    const periodWhtCerts = whtCerts.filter((cert) => {
      const d = new Date(cert.dateWithheld);
      if (isNaN(d.getTime())) return false;
      const yrMatch = d.getFullYear() === year;
      if (!yrMatch) return false;
      if (periodType === "monthly" && month !== undefined) {
        return d.getMonth() + 1 === month;
      }
      return true;
    });

    let grossSales = 0;
    let totalVatInvoiced = 0;

    periodInvoices.forEach((inv) => {
      const subtotal = inv.items.reduce((s, i) => s + (i.qty || 1) * (i.unitPrice || 0), 0);
      const discount = inv.discountType === "percentage" ? (subtotal * (inv.discountValue || 0)) / 100 : (inv.discountValue || 0);
      const afterDiscount = Math.max(0, subtotal - discount);
      const vat = inv.vatEnabled ? afterDiscount * ((inv.vatPercent || 16) / 100) : 0;

      grossSales += afterDiscount;
      totalVatInvoiced += vat;
    });

    const totalExpenses = periodExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    const allowableDeductions = totalExpenses;
    const netTaxableIncome = Math.max(0, grossSales - allowableDeductions);

    const whtDeductedCredits = periodWhtCerts.reduce((s, c) => s + (c.whtAmount || 0), 0);

    let grossTaxLiability = 0;
    let outputTax = 0;
    let inputTaxCredit = 0;
    let personalRelief = 0;

    if (periodType === "monthly") {
      if (kra.taxObligation === "turnover_tax") {
        grossTaxLiability = grossSales * ((kra.turnoverTaxRate || 3) / 100);
        outputTax = grossTaxLiability;
      } else if (kra.taxObligation === "standard_vat") {
        outputTax = totalVatInvoiced;
        const hardwareExpenses = periodExpenses.filter((e) => e.category === "hardware_parts" || e.category === "software_tools");
        inputTaxCredit = hardwareExpenses.reduce((s, e) => s + (e.amount * 0.16) / 1.16, 0);
        grossTaxLiability = Math.max(0, outputTax - inputTaxCredit);
      } else {
        grossTaxLiability = (grossSales - allowableDeductions) * 0.15;
      }
    } else {
      let remainingTaxable = netTaxableIncome;
      let computedTax = 0;

      if (remainingTaxable > 0) {
        const band1 = Math.min(remainingTaxable, 288000);
        computedTax += band1 * 0.10;
        remainingTaxable -= band1;
      }
      if (remainingTaxable > 0) {
        const band2 = Math.min(remainingTaxable, 100000);
        computedTax += band2 * 0.25;
        remainingTaxable -= band2;
      }
      if (remainingTaxable > 0) {
        const band3 = Math.min(remainingTaxable, 5612000);
        computedTax += band3 * 0.30;
        remainingTaxable -= band3;
      }
      if (remainingTaxable > 0) {
        const band4 = Math.min(remainingTaxable, 3600000);
        computedTax += band4 * 0.325;
        remainingTaxable -= band4;
      }
      if (remainingTaxable > 0) {
        computedTax += remainingTaxable * 0.35;
      }

      grossTaxLiability = computedTax;
      personalRelief = kra.annualPersonalRelief || 28800;
    }

    const netTaxPayable = Math.max(0, grossTaxLiability - personalRelief - whtDeductedCredits);
    const isRefund = grossTaxLiability - personalRelief - whtDeductedCredits < 0;

    let dueDate = "";
    let daysRemaining = 0;
    const now = new Date();

    if (periodType === "monthly") {
      const targetMonth = month !== undefined ? month : now.getMonth() + 1;
      const nextMonth = targetMonth === 12 ? 1 : targetMonth + 1;
      const nextYear = targetMonth === 12 ? year + 1 : year;
      const targetDue = new Date(nextYear, nextMonth - 1, 20);
      dueDate = targetDue.toISOString().split("T")[0];
      const diffMs = targetDue.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    } else {
      const targetDue = new Date(year + 1, 5, 30);
      dueDate = targetDue.toISOString().split("T")[0];
      const diffMs = targetDue.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    const filingStatus: KRATaxReturnSummary["filingStatus"] =
      daysRemaining < 0 ? "overdue" : daysRemaining <= 5 ? "due_soon" : "ready";

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const periodLabel = periodType === "monthly" && month !== undefined
      ? `${monthNames[month - 1]} ${year}`
      : `Tax Year ${year}`;

    return {
      periodType,
      periodLabel,
      grossSales,
      totalVatInvoiced,
      totalExpenses,
      allowableDeductions,
      netTaxableIncome,
      outputTax,
      inputTaxCredit,
      whtDeductedCredits,
      grossTaxLiability,
      personalRelief,
      netTaxPayable,
      isRefund,
      dueDate,
      daysRemaining,
      filingStatus,
    };
  }

  private async syncReviewToSupabase(review: ReviewItem) {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) return;

    try {
      const cleanUrl = config.url.trim().replace(/\/$/, "");
      const cleanKey = config.anonKey.trim();
      await fetch(`${cleanUrl}/rest/v1/reviews`, {
        method: "POST",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(review),
      });
    } catch (err) {
      console.warn("Background Supabase review sync error:", err);
    }
  }

  private async syncInquiryToSupabase(inquiry: InquiryLead) {
    const config = this.getSupabaseSettings();
    if (!config.enabled || !config.url || !config.anonKey) return;

    try {
      const cleanUrl = config.url.trim().replace(/\/$/, "");
      const cleanKey = config.anonKey.trim();
      await fetch(`${cleanUrl}/rest/v1/inquiries`, {
        method: "POST",
        headers: {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(inquiry),
      });
    } catch (err) {
      console.warn("Background Supabase inquiry sync error:", err);
    }
  }
  // ==========================================
  // CLIENT IT VAULT & NETWORK DOSSIERS
  // ==========================================
  public getClientVaults(): ClientVaultRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENT_VAULTS);
      if (!stored) {
        const seedVaults: ClientVaultRecord[] = [
          {
            id: "vault-1",
            clientName: "David Mwangi",
            company: "Peak Logistics Hub Ltd",
            location: "Westlands, Nairobi (4th Floor)",
            contactPhone: "+254 722 345 678",
            contactEmail: "david@peaklogistics.co.ke",
            gatewayIp: "192.168.10.1",
            subnetMask: "255.255.255.0",
            dhcpRange: "192.168.10.50 - 192.168.10.200",
            vlans: "VLAN 10: Management (192.168.10.0/24), VLAN 20: Operations (192.168.20.0/24), VLAN 30: Guest Wi-Fi (192.168.30.0/24)",
            primaryDns: "1.1.1.1 / 8.8.8.8",
            wifiSsidStaff: "Peak_Logistics_Secure",
            wifiPassStaff: "PeakLog@2026Secure",
            wifiSsidGuest: "Peak_Guest_WiFi",
            wifiPassGuest: "KaribuPeak2026",
            ispProvider: "Safaricom Business Fiber",
            circuitId: "SAF-NBO-WST-88192",
            accountNumber: "ACC-9921448",
            bandwidthCir: "50 Mbps Dedicated CIR (1:1)",
            supportContact: "business@safaricom.co.ke / 0722 002 222",
            routerAdminUrl: "https://192.168.10.1:8443",
            routerAdminUser: "admin",
            routerAdminPass: "PeakUniFi#2026!",
            cctvNvrIp: "192.168.10.250",
            cctvNvrUser: "admin",
            cctvNvrPass: "PeakHikvision$2026",
            serverRdpIp: "192.168.10.10",
            serverRdpUser: "Administrator",
            serverRdpPass: "PeakServer@Admin99",
            domainName: "peaklogistics.co.ke",
            domainExpiryDate: "2026-11-30",
            sslExpiryDate: "2026-10-15",
            m365LicenseCount: 15,
            m365RenewalDate: "2026-12-15",
            antivirusBrand: "Kaspersky Endpoint Security Cloud",
            antivirusExpiryDate: "2027-01-20",
            backupRetentionPolicy: "Daily NAS Synology Mirror + Weekly Encrypted Cloud Offsite (30-day retention)",
            notes: "Access requires visitor badge at 4th floor security. Server rack key is with operations manager.",
            updatedAt: new Date().toISOString(),
            createdAt: "2026-08-01T08:00:00.000Z",
          },
        ];
        localStorage.setItem(STORAGE_KEYS.CLIENT_VAULTS, JSON.stringify(seedVaults));
        return seedVaults;
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public saveClientVault(vault: ClientVaultRecord): ClientVaultRecord {
    const all = this.getClientVaults();
    const existingIdx = all.findIndex((v) => v.id === vault.id);
    let updated: ClientVaultRecord[];
    const itemToSave = { ...vault, updatedAt: new Date().toISOString() };
    if (existingIdx >= 0) {
      updated = [...all];
      updated[existingIdx] = itemToSave;
    } else {
      updated = [itemToSave, ...all];
    }
    localStorage.setItem(STORAGE_KEYS.CLIENT_VAULTS, JSON.stringify(updated));
    return itemToSave;
  }

  public deleteClientVault(id: string): void {
    const all = this.getClientVaults();
    const updated = all.filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENT_VAULTS, JSON.stringify(updated));
  }

  // ==========================================
  // EQUIPMENT INTAKE & DIAGNOSTIC SLIPS
  // ==========================================
  public getEquipmentIntakes(): EquipmentIntakeRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EQUIPMENT_INTAKES);
      if (!stored) {
        const seedIntakes: EquipmentIntakeRecord[] = [
          {
            id: "intake-1",
            intakeNumber: "KRN-INTAKE-2026-001",
            clientName: "Mary Wanjiku",
            company: "After40 Hotel",
            phone: "+254 733 987 654",
            email: "mary@after40hotel.com",
            deviceType: "laptop",
            brandModel: "Dell Latitude 5420 (Core i7 / 16GB RAM)",
            serialNumber: "DELL-LAT-88491-SN",
            passcodePattern: "Mary@Hotel123",
            accessories: {
              powerAdapter: true,
              bag: true,
              cables: false,
              mouse: true,
              other: "USB-C Dongle",
            },
            cosmeticCondition: "minor_scratches",
            reportedFault: "Laptop overheating and fan running at max speed constantly. Sudden blue screens under heavy load.",
            diagnosticFee: 1500,
            estimatedCost: 6500,
            priority: "urgent",
            status: "diagnosing",
            agreedTerms: true,
            intakeDate: new Date().toISOString().slice(0, 10),
            notes: "Cleaned heat sink, applying Arctic MX-4 thermal compound. Bench thermal testing in progress.",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(STORAGE_KEYS.EQUIPMENT_INTAKES, JSON.stringify(seedIntakes));
        return seedIntakes;
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public saveEquipmentIntake(intake: EquipmentIntakeRecord): EquipmentIntakeRecord {
    const all = this.getEquipmentIntakes();
    const existingIdx = all.findIndex((i) => i.id === intake.id);
    let updated: EquipmentIntakeRecord[];
    if (existingIdx >= 0) {
      updated = [...all];
      updated[existingIdx] = intake;
    } else {
      updated = [intake, ...all];
    }
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT_INTAKES, JSON.stringify(updated));
    return intake;
  }

  public deleteEquipmentIntake(id: string): void {
    const all = this.getEquipmentIntakes();
    const updated = all.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT_INTAKES, JSON.stringify(updated));
  }

  // ==========================================
  // M-PESA STK & TRANSACTION HUB
  // ==========================================
  public getMPesaTransactions(): MPesaTransactionRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MPESA_TRANSACTIONS);
      if (!stored) {
        const seedTxs: MPesaTransactionRecord[] = [
          {
            id: "tx-1",
            receiptNumber: "QHB72991LK",
            invoiceId: "inv-1",
            invoiceDocNumber: "KRN-INV-2026-001",
            clientName: "Mary Wanjiku (After40 Hotel)",
            clientPhone: "254733987654",
            amount: 70000,
            transactionType: "STK_PUSH",
            status: "completed",
            resultDesc: "The service request is processed successfully.",
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(STORAGE_KEYS.MPESA_TRANSACTIONS, JSON.stringify(seedTxs));
        return seedTxs;
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public addMPesaTransaction(tx: Omit<MPesaTransactionRecord, "id" | "createdAt">): MPesaTransactionRecord {
    const all = this.getMPesaTransactions();
    const newTx: MPesaTransactionRecord = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...all];
    localStorage.setItem(STORAGE_KEYS.MPESA_TRANSACTIONS, JSON.stringify(updated));
    return newTx;
  }

  public updateMPesaTransactionStatus(id: string, status: MPesaTransactionRecord["status"]) {
    const all = this.getMPesaTransactions();
    const updated = all.map((t) => (t.id === id ? { ...t, status } : t));
    localStorage.setItem(STORAGE_KEYS.MPESA_TRANSACTIONS, JSON.stringify(updated));
  }

  // ==========================================
  // WHATSAPP PROMO CAMPAIGNS
  // ==========================================
  public getWhatsAppCampaigns(): WhatsAppCampaignRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WHATSAPP_CAMPAIGNS);
      if (!stored) {
        const seedCampaigns: WhatsAppCampaignRecord[] = [
          {
            id: "camp-1",
            campaignTitle: "Q3 Business Wi-Fi Speed & Security Tune-up",
            targetAudience: "wifi_clients",
            templateCategory: "wifi_upgrade",
            messageTemplate: "Hello {{name}}! 👋\n\nHope {{company}} is having a productive week! 🚀\n\nIs your office Wi-Fi keeping up with your team's demand? Krenovate Systems is running our *Q3 Corporate Wi-Fi & Bandwidth Optimization Special* in Nairobi:\n\n• Seamless Access Point Firmware Upgrades\n• Isolated Guest Wi-Fi & Staff Bandwidth Shaping\n• Signal Coverage & Dead-Zone Heatmap Audit\n\nReply to this message if you'd like us to schedule a priority on-site tune-up!\n\nBest regards,\nPeter Kivevo — Krenovate Systems\n📞 0722 000 000",
            recipientCount: 12,
            dispatchedCount: 12,
            lastDispatchedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: "camp-2",
            campaignTitle: "CCTV Preventive Lens & NVR Storage Health Check",
            targetAudience: "cctv_clients",
            templateCategory: "cctv_maintenance",
            messageTemplate: "Hello {{name}}! 📹\n\nRoutine security reminder from *Krenovate Systems* for {{company}}.\n\nWhen was the last time your CCTV hard drives were checked for bad sectors? Dust buildup on outdoor lenses and power supply drops can cause surveillance blind spots.\n\nOur *CCTV Health Package* includes:\n✔ 4K Camera Lens Cleaning & Angle Realignment\n✔ NVR Hard Drive Health & Recording Continuity Check\n✔ Mobile App Remote Access & Cloud Backup Re-sync\n\nWould you like us to pass by this week for your scheduled preventive audit?\n\n— Peter Kivevo John (Krenovate Systems)",
            recipientCount: 8,
            dispatchedCount: 0,
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(STORAGE_KEYS.WHATSAPP_CAMPAIGNS, JSON.stringify(seedCampaigns));
        return seedCampaigns;
      }
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  public saveWhatsAppCampaign(camp: WhatsAppCampaignRecord): WhatsAppCampaignRecord {
    const all = this.getWhatsAppCampaigns();
    const existingIdx = all.findIndex((c) => c.id === camp.id);
    let updated: WhatsAppCampaignRecord[];
    if (existingIdx >= 0) {
      updated = [...all];
      updated[existingIdx] = camp;
    } else {
      updated = [camp, ...all];
    }
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_CAMPAIGNS, JSON.stringify(updated));
    return camp;
  }

  public deleteWhatsAppCampaign(id: string): void {
    const all = this.getWhatsAppCampaigns();
    const updated = all.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_CAMPAIGNS, JSON.stringify(updated));
  }
}

export const dataStorage = new DataStorageService();

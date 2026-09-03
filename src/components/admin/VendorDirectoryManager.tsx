import React, { useState, useEffect } from "react";
import {
  dataStorage,
  VendorRecord,
  WholesalePriceBenchmark
} from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Tag,
  Search,
  Plus,
  Trash2,
  Edit3,
  Calculator,
  TrendingUp,
  Percent,
  Check,
  X,
  Store,
  Clock,
  ShieldCheck,
  Laptop,
  Wifi,
  Tv,
  Printer as PrinterIcon,
  Cable,
  PackageCheck
} from "lucide-react";

export const VendorDirectoryManager: React.FC = () => {
  const { toast } = useToast();

  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [benchmarks, setBenchmarks] = useState<WholesalePriceBenchmark[]>([]);
  const [activeTab, setActiveTab] = useState<"directory" | "wholesale_index" | "calculator">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Vendor Modal State
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorRecord | null>(null);
  const [vendorForm, setVendorForm] = useState<Omit<VendorRecord, "id" | "createdAt">>({
    companyName: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    email: "",
    location: "Nairobi CBD",
    category: "laptops_computers",
    paymentTerms: "cash_on_delivery",
    rating: 5,
    notes: "",
  });

  // Benchmark Modal State
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState<WholesalePriceBenchmark | null>(null);
  const [benchmarkForm, setBenchmarkForm] = useState<Omit<WholesalePriceBenchmark, "id" | "updatedAt">>({
    itemName: "",
    category: "Laptops",
    typicalWholesaleKes: 50000,
    recommendedRetailKes: 60000,
    preferredVendorName: "",
    warrantyPeriod: "12 Months",
    notes: "",
  });

  // Margin Calculator State
  const [calcCost, setCalcCost] = useState<number>(69500);
  const [calcMarginPct, setCalcMarginPct] = useState<number>(20);
  const [calcIncludeVat, setCalcIncludeVat] = useState<boolean>(true);
  const [calcTransportKes, setCalcTransportKes] = useState<number>(1000);

  useEffect(() => {
    const load = () => {
      setVendors(dataStorage.getVendors());
      setBenchmarks(dataStorage.getWholesaleBenchmarks());
    };
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  // Save Vendor
  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.companyName.trim() || !vendorForm.phone.trim()) {
      toast({ title: "Required Fields Missing", description: "Company name and phone are required.", variant: "destructive" });
      return;
    }

    dataStorage.saveVendor({
      ...vendorForm,
      id: editingVendor ? editingVendor.id : `v-${Date.now()}`,
      createdAt: editingVendor ? editingVendor.createdAt : new Date().toISOString(),
    });

    setShowVendorModal(false);
    setEditingVendor(null);
    toast({ title: "Vendor Saved! 🏢", description: `${vendorForm.companyName} added to directory.` });
  };

  // Save Benchmark
  const handleSaveBenchmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!benchmarkForm.itemName.trim() || !benchmarkForm.typicalWholesaleKes) {
      toast({ title: "Item Name & Wholesale Cost Required", variant: "destructive" });
      return;
    }

    dataStorage.saveWholesaleBenchmark({
      ...benchmarkForm,
      id: editingBenchmark ? editingBenchmark.id : `bench-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });

    setShowBenchmarkModal(false);
    setEditingBenchmark(null);
    toast({ title: "Wholesale Benchmark Saved! 📦", description: `${benchmarkForm.itemName} price tracked.` });
  };

  // Calculator Math
  const wholesaleBase = Number(calcCost) || 0;
  const transport = Number(calcTransportKes) || 0;
  const totalLandedCost = wholesaleBase + transport;
  const marginDecimal = (Number(calcMarginPct) || 0) / 100;
  
  // Selling before VAT
  const sellingBeforeVat = marginDecimal < 1 ? Math.round(totalLandedCost / (1 - marginDecimal)) : totalLandedCost * 1.5;
  const grossProfitKes = sellingBeforeVat - totalLandedCost;
  const vatAmountKes = calcIncludeVat ? Math.round(sellingBeforeVat * 0.16) : 0;
  const finalInvoicePrice = sellingBeforeVat + vatAmountKes;

  const filteredVendors = vendors.filter((v) => {
    if (categoryFilter !== "all" && v.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.companyName.toLowerCase().includes(q) ||
        v.contactPerson.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        (v.notes || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredBenchmarks = benchmarks.filter((b) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.itemName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.preferredVendorName || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoryIcons: Record<string, any> = {
    laptops_computers: Laptop,
    networking_ubiquiti: Wifi,
    cctv_security: Tv,
    printers_toners: PrinterIcon,
    cabling_accessories: Cable,
    general_it: Store,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  Nairobi Hardware Vendors &amp; Wholesale Price Watch
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold">
                  {vendors.length} Suppliers
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct Nairobi CBD tech importers, dealer price index &amp; instant quote margin estimator.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "directory" ? "bg-cyan-600 text-white shadow-sm" : "bg-navy-900 text-slate-400 hover:text-white border border-border"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Vendors ({vendors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("wholesale_index")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "wholesale_index" ? "bg-cyan-600 text-white shadow-sm" : "bg-navy-900 text-slate-400 hover:text-white border border-border"
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Wholesale Price Watch ({benchmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "calculator" ? "bg-cyan-600 text-white shadow-sm" : "bg-navy-900 text-slate-400 hover:text-white border border-border"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Margin Calculator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VENDORS DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor, contact, building..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white placeholder:text-slate-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingVendor(null);
                setVendorForm({
                  companyName: "",
                  contactPerson: "",
                  phone: "",
                  whatsapp: "",
                  email: "",
                  location: "Nairobi CBD",
                  category: "laptops_computers",
                  paymentTerms: "cash_on_delivery",
                  rating: 5,
                  notes: "",
                });
                setShowVendorModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((v) => {
              const Icon = categoryIcons[v.category] || Store;
              return (
                <div
                  key={v.id}
                  className="p-5 rounded-3xl bg-navy-900 border border-border hover:border-cyan-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-sm text-white">{v.companyName}</h3>
                          <span className="text-[10px] font-mono text-cyan-300 capitalize">
                            {v.category.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-navy-950 text-slate-300 border border-border">
                        {v.paymentTerms.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{v.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-mono">{v.phone}</span>
                        <span className="text-[11px] text-slate-400">({v.contactPerson})</span>
                      </div>
                      {v.email && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{v.email}</span>
                        </div>
                      )}
                    </div>

                    {v.notes && (
                      <p className="text-[11px] text-slate-400 bg-navy-950 p-2.5 rounded-xl border border-border line-clamp-2">
                        {v.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${(v.whatsapp || v.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${v.contactPerson}, this is Peter from Krenovate Systems. Inquiring about current wholesale stock & dealer pricing.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Rep</span>
                      </a>
                      <a
                        href={`tel:${v.phone}`}
                        className="p-1.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-white border border-border"
                        title="Call Rep"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingVendor(v);
                          setVendorForm(v);
                          setShowVendorModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${v.companyName} from vendor directory?`)) {
                            dataStorage.deleteVendor(v.id);
                            toast({ title: "Vendor Removed" });
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WHOLESALE PRICE BENCHMARK WATCHLIST */}
      {activeTab === "wholesale_index" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hardware benchmark..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-navy-900 border border-border text-white placeholder:text-slate-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingBenchmark(null);
                setBenchmarkForm({
                  itemName: "",
                  category: "Laptops",
                  typicalWholesaleKes: 50000,
                  recommendedRetailKes: 60000,
                  preferredVendorName: "",
                  warrantyPeriod: "12 Months",
                  notes: "",
                });
                setShowBenchmarkModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Track New Hardware Price</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-navy-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-navy-950 text-slate-300 font-mono text-[11px] border-b border-border">
                  <th className="py-3 px-4">Hardware Item / Specification</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Wholesale Cost (KES)</th>
                  <th className="py-3 px-3 text-right">Selling Price (KES)</th>
                  <th className="py-3 px-3 text-center">Gross Profit</th>
                  <th className="py-3 px-4">Preferred Nairobi Dealer</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {filteredBenchmarks.map((b) => {
                  const profit = b.recommendedRetailKes - b.typicalWholesaleKes;
                  const margin = Math.round((profit / b.recommendedRetailKes) * 100);
                  return (
                    <tr key={b.id} className="hover:bg-navy-950/50 transition-colors">
                      <td className="py-3 px-4 font-sans font-bold text-white">
                        <div>{b.itemName}</div>
                        <div className="text-[10px] font-mono text-slate-400 font-normal mt-0.5">Warranty: {b.warrantyPeriod}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{b.category}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-200">
                        {b.typicalWholesaleKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-cyan-300">
                        {b.recommendedRetailKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                          +KES {profit.toLocaleString()} ({margin}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300 truncate max-w-[200px]">
                        {b.preferredVendorName || "Open Market"}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setCalcCost(b.typicalWholesaleKes);
                            setActiveTab("calculator");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-navy-950 hover:bg-cyan-600 hover:text-white text-slate-300 text-[11px] font-bold border border-border"
                        >
                          Calculate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROFIT & SELLING PRICE CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-navy-900 border border-border space-y-5 text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                Wholesale Margin &amp; Quote Estimator
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Supplier Wholesale Buying Price (KES) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold">KES</span>
                  <input
                    type="number"
                    value={calcCost}
                    onChange={(e) => setCalcCost(Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono font-bold text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Target Gross Margin %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calcMarginPct}
                      onChange={(e) => setCalcMarginPct(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-cyan-300 font-mono font-bold"
                    />
                    <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Transport / Logistics (KES)
                  </label>
                  <input
                    type="number"
                    value={calcTransportKes}
                    onChange={(e) => setCalcTransportKes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>

              {/* Quick Margin Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Quick Margin Presets:</span>
                <div className="flex items-center gap-2">
                  {[15, 20, 25, 30, 35].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setCalcMarginPct(pct)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                        calcMarginPct === pct ? "bg-cyan-600 text-white border-cyan-400" : "bg-navy-950 text-slate-400 border-border hover:text-white"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 16% VAT Toggle */}
              <div className="p-3.5 rounded-xl bg-navy-950 border border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Include KRA VAT (16%)</div>
                  <div className="text-[10px] text-slate-400">Adds 16% Output VAT onto client formal invoice</div>
                </div>
                <input
                  type="checkbox"
                  checked={calcIncludeVat}
                  onChange={(e) => setCalcIncludeVat(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-cyan-500/30 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Financial Calculation Breakdown</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{calcMarginPct}% Target Margin</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Wholesale Supplier Cost:</span>
                  <span>KES {wholesaleBase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300">
                  <span>Transport &amp; Handover Transit:</span>
                  <span>KES {transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-amber-300 border-t border-border/60 pt-2 font-bold">
                  <span>Total Landed Cost:</span>
                  <span>KES {totalLandedCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 rounded-xl border border-emerald-500/20">
                  <span>Net Gross Margin (Profit):</span>
                  <span>+ KES {grossProfitKes.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1 text-slate-300">
                  <span>Base Quote Price (Excl. VAT):</span>
                  <span className="font-bold text-white">KES {sellingBeforeVat.toLocaleString()}</span>
                </div>

                {calcIncludeVat && (
                  <div className="flex justify-between py-1 text-slate-400">
                    <span>KRA 16% VAT Remittance:</span>
                    <span>+ KES {vatAmountKes.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Final Client Quote Display */}
            <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-center space-y-1">
              <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest block">
                Recommended Client Formal Quotation Price:
              </span>
              <div className="text-3xl sm:text-4xl font-black font-heading text-white font-mono tracking-tight">
                KES {finalInvoicePrice.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Guarantees KES {grossProfitKes.toLocaleString()} gross profit in pocket after wholesale procurement &amp; transit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VENDOR MODAL */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-heading font-bold text-sm text-white">
                {editingVendor ? "Edit Nairobi Supplier" : "Add New Nairobi Hardware Supplier"}
              </h3>
              <button onClick={() => setShowVendorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={vendorForm.companyName}
                  onChange={(e) => setVendorForm({ ...vendorForm, companyName: e.target.value })}
                  placeholder="e.g. Eurocom Systems Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sales Rep Name</label>
                  <input
                    type="text"
                    value={vendorForm.contactPerson}
                    onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                    placeholder="e.g. Dennis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Shop / Building Location</label>
                <input
                  type="text"
                  value={vendorForm.location}
                  onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                  placeholder="e.g. Revlon Plaza, Biashara Street, Nairobi CBD"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={vendorForm.category}
                    onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  >
                    <option value="laptops_computers">Laptops &amp; Computers</option>
                    <option value="networking_ubiquiti">Networking &amp; Ubiquiti</option>
                    <option value="cctv_security">CCTV &amp; Surveillance</option>
                    <option value="printers_toners">Printers &amp; Toners</option>
                    <option value="cabling_accessories">Cat6 Cables &amp; Racks</option>
                    <option value="general_it">General IT Importer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Payment Terms</label>
                  <select
                    value={vendorForm.paymentTerms}
                    onChange={(e) => setVendorForm({ ...vendorForm, paymentTerms: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  >
                    <option value="cash_on_delivery">Cash on Delivery</option>
                    <option value="mpesa_paybill">M-Pesa Till / Paybill</option>
                    <option value="30_day_credit">30-Day Credit Account</option>
                    <option value="cheque">Company Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Notes / Special Perks</label>
                <input
                  type="text"
                  value={vendorForm.notes || ""}
                  onChange={(e) => setVendorForm({ ...vendorForm, notes: e.target.value })}
                  placeholder="e.g. 1-hour dispatch, discounts on cash orders"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowVendorModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 border border-border text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BENCHMARK MODAL */}
      {showBenchmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-heading font-bold text-sm text-white">
                {editingBenchmark ? "Edit Hardware Benchmark" : "Track New Hardware Wholesale Price"}
              </h3>
              <button onClick={() => setShowBenchmarkModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBenchmark} className="space-y-4">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Item Name &amp; Spec *</label>
                <input
                  type="text"
                  required
                  value={benchmarkForm.itemName}
                  onChange={(e) => setBenchmarkForm({ ...benchmarkForm, itemName: e.target.value })}
                  placeholder="e.g. Ubiquiti UniFi U6-Pro Access Point"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Wholesale Cost (KES) *</label>
                  <input
                    type="number"
                    required
                    value={benchmarkForm.typicalWholesaleKes}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, typicalWholesaleKes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Recommended Retail (KES)</label>
                  <input
                    type="number"
                    value={benchmarkForm.recommendedRetailKes}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, recommendedRetailKes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-cyan-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={benchmarkForm.category}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, category: e.target.value })}
                    placeholder="e.g. Networking / Laptops"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Preferred Dealer</label>
                  <input
                    type="text"
                    value={benchmarkForm.preferredVendorName || ""}
                    onChange={(e) => setBenchmarkForm({ ...benchmarkForm, preferredVendorName: e.target.value })}
                    placeholder="e.g. Bright Technologies Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Official Warranty Duration</label>
                <input
                  type="text"
                  value={benchmarkForm.warrantyPeriod}
                  onChange={(e) => setBenchmarkForm({ ...benchmarkForm, warrantyPeriod: e.target.value })}
                  placeholder="e.g. 12 Months Official Brand"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-border text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowBenchmarkModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 border border-border text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  Save Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

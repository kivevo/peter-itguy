import React, { useState, useEffect } from "react";
import { dataStorage, InventoryItem } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Camera, 
  Laptop, 
  Cable, 
  Building2, 
  Tag, 
  DollarSign, 
  Clock, 
  Check, 
  X,
  Layers,
  ArrowUpRight
} from "lucide-react";

export const InventoryManager: React.FC = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");

  // Modal states
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form state
  const [itemForm, setItemForm] = useState<{
    name: string;
    brand: string;
    model: string;
    category: InventoryItem["category"];
    quantity: number;
    unitCost: number;
    sellingPrice: number;
    serialNumbers: string;
    deployedAt: string;
    condition: InventoryItem["condition"];
    supplier: string;
    purchaseDate: string;
    warrantyExpiry: string;
    notes: string;
  }>({
    name: "",
    brand: "",
    model: "",
    category: "access_point",
    quantity: 1,
    unitCost: 0,
    sellingPrice: 0,
    serialNumbers: "",
    deployedAt: "",
    condition: "new",
    supplier: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    warrantyExpiry: "",
    notes: "",
  });

  useEffect(() => {
    const load = () => setInventory(dataStorage.getInventory());
    load();
    const unsub = dataStorage.subscribe(load);
    return () => unsub();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setItemForm({
      name: "",
      brand: "",
      model: "",
      category: "access_point",
      quantity: 1,
      unitCost: 0,
      sellingPrice: 0,
      serialNumbers: "",
      deployedAt: "",
      condition: "new",
      supplier: "",
      purchaseDate: new Date().toISOString().slice(0, 10),
      warrantyExpiry: "",
      notes: "",
    });
    setShowItemModal(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      brand: item.brand,
      model: item.model,
      category: item.category,
      quantity: item.quantity,
      unitCost: item.unitCost,
      sellingPrice: item.sellingPrice,
      serialNumbers: item.serialNumbers,
      deployedAt: item.deployedAt || "",
      condition: item.condition,
      supplier: item.supplier || "",
      purchaseDate: item.purchaseDate || "",
      warrantyExpiry: item.warrantyExpiry || "",
      notes: item.notes || "",
    });
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.brand) {
      toast({
        title: "Missing Name / Brand",
        description: "Please specify hardware name and brand.",
        variant: "destructive",
      });
      return;
    }

    dataStorage.saveInventoryItem({
      ...(editingItem ? { id: editingItem.id } : {}),
      name: itemForm.name,
      brand: itemForm.brand,
      model: itemForm.model,
      category: itemForm.category,
      quantity: Number(itemForm.quantity) || 0,
      unitCost: Number(itemForm.unitCost) || 0,
      sellingPrice: Number(itemForm.sellingPrice) || 0,
      serialNumbers: itemForm.serialNumbers,
      deployedAt: itemForm.deployedAt || undefined,
      condition: itemForm.condition,
      supplier: itemForm.supplier || undefined,
      purchaseDate: itemForm.purchaseDate || undefined,
      warrantyExpiry: itemForm.warrantyExpiry || undefined,
      notes: itemForm.notes || undefined,
    });

    setShowItemModal(false);
    toast({
      title: editingItem ? "Stock Item Updated! 📦" : "New Hardware Added! 📦",
      description: `${itemForm.name} saved in inventory records.`,
    });
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from inventory?`)) {
      dataStorage.deleteInventoryItem(id);
      toast({ title: "Item Removed", description: "Hardware record deleted." });
    }
  };

  const handleAdjustQuantity = (id: string, delta: number) => {
    dataStorage.updateInventoryQuantity(id, delta);
  };

  const exportInventoryCSV = () => {
    let csv = "data:text/csv;charset=utf-8,ID,Name,Brand,Model,Category,Quantity,Unit Cost (KES),Selling Price (KES),Potential Revenue (KES),Condition,Serial Numbers,Deployed At,Supplier,Warranty Expiry\n";
    
    inventory.forEach((i) => {
      const potRev = i.quantity * i.sellingPrice;
      csv += `"${i.id}","${i.name}","${i.brand}","${i.model}","${i.category}",${i.quantity},${i.unitCost},${i.sellingPrice},${potRev},"${i.condition}","${i.serialNumbers}","${i.deployedAt || ""}","${i.supplier || ""}","${i.warrantyExpiry || ""}"\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `peter_itguy_hardware_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Hardware Inventory Exported! 📊",
      description: "Downloaded CSV stock list.",
    });
  };

  // Metrics
  const totalStockCount = inventory.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  const totalCostValue = inventory.reduce((s, i) => s + (i.quantity * i.unitCost), 0);
  const totalRetailValue = inventory.reduce((s, i) => s + (i.quantity * i.sellingPrice), 0);
  const lowStockItems = inventory.filter((i) => i.quantity <= 1);
  const deployedItemsCount = inventory.filter((i) => i.deployedAt && i.deployedAt.trim().length > 0).length;

  // Filtered List
  const filteredInventory = inventory.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (conditionFilter !== "all" && item.condition !== conditionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.serialNumbers.toLowerCase().includes(q) ||
        (item.deployedAt && item.deployedAt.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    router: Server,
    switch: Server,
    access_point: Wifi,
    cable: Cable,
    cctv_camera: Camera,
    nvr: Server,
    laptop: Laptop,
    accessories: Cpu,
    other: Package,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Package className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold font-heading text-white">
                Hardware &amp; Equipment Inventory
              </h2>
              <p className="text-xs text-slate-400">
                Track routers, UniFi access points, Cat6 cables, CCTV cameras, and client site deployments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Hardware Item</span>
          </button>

          <button
            onClick={exportInventoryCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 border border-border/80 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Stock CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Total In Stock</span>
          <p className="text-xl sm:text-2xl font-black font-heading text-white">
            {totalStockCount} <span className="text-xs font-normal text-slate-400">units</span>
          </p>
          <span className="text-[10px] text-teal-400 font-mono block">
            Across {inventory.length} hardware models
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Stock Asset Value (Cost)</span>
          <p className="text-xl sm:text-2xl font-black font-heading text-teal-400">
            KES {totalCostValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 font-mono block">
            Retail Value: KES {totalRetailValue.toLocaleString()}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block">Low Stock Alert</span>
          <p className="text-xl sm:text-2xl font-black font-heading text-amber-300">
            {lowStockItems.length} <span className="text-xs font-normal text-slate-400">items</span>
          </p>
          <span className="text-[10px] text-slate-400 font-mono block">
            Units with &le; 1 item in stock
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-navy-900 border border-border/80 shadow-sm space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Client Deployments</span>
          <p className="text-xl sm:text-2xl font-black font-heading text-purple-300">
            {deployedItemsCount} <span className="text-xs font-normal text-slate-400">sites</span>
          </p>
          <span className="text-[10px] text-slate-400 font-mono block">
            Hardware currently deployed
          </span>
        </div>
      </div>

      {/* Main Stock Table Container */}
      <div className="rounded-3xl bg-navy-900 border border-border/80 p-5 sm:p-6 space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hardware by name, model, brand, serial number, client site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="access_point">Wi-Fi Access Points</option>
              <option value="router">Routers &amp; Gateways</option>
              <option value="switch">PoE &amp; Managed Switches</option>
              <option value="cctv_camera">CCTV Cameras</option>
              <option value="cable">Cat6 Network Cabling</option>
              <option value="accessories">Network Accessories</option>
            </select>

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-950 border border-border text-white text-xs focus:outline-none"
            >
              <option value="all">All Conditions</option>
              <option value="new">Brand New</option>
              <option value="good">Good / Used</option>
              <option value="refurbished">Refurbished</option>
              <option value="faulty">Faulty / For Repair</option>
            </select>
          </div>
        </div>

        {/* Inventory List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-navy-950/60 text-slate-400 font-mono uppercase text-[10px]">
                <th className="p-3">Hardware Item &amp; Model</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Stock Qty</th>
                <th className="p-3 text-right">Unit Cost</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3">Serial Numbers / Deployed At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No hardware found in stock matching your filter.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const Icon = categoryIcons[item.category] || Package;
                  const isLow = item.quantity <= 1;
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-xl bg-navy-950 border border-border/60 text-teal-400 flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{item.name}</p>
                            <span className="text-[11px] font-mono text-slate-400">
                              {item.brand} • {item.model}
                            </span>
                            {item.condition !== "new" && (
                              <span className="ml-2 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                                {item.condition}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                          {item.category.replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-navy-950 p-1 rounded-xl border border-border">
                          <button
                            onClick={() => handleAdjustQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                            title="Decrease quantity"
                          >
                            -
                          </button>
                          <span className={`w-8 text-center font-mono font-bold ${isLow ? "text-amber-400" : "text-white"}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleAdjustQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        {isLow && (
                          <span className="block text-[9px] text-amber-400 font-mono mt-0.5 font-bold">
                            Low Stock
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right font-mono text-slate-400 whitespace-nowrap">
                        KES {item.unitCost.toLocaleString()}
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                        KES {item.sellingPrice.toLocaleString()}
                      </td>

                      <td className="p-3 max-w-xs">
                        {item.serialNumbers && (
                          <p className="font-mono text-[10px] text-slate-400 truncate" title={item.serialNumbers}>
                            SN: {item.serialNumbers}
                          </p>
                        )}
                        {item.deployedAt ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded border border-purple-500/30 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>At: {item.deployedAt}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">In Workshop / Nairobi HQ</span>
                        )}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add / Edit Inventory Item */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-navy-900 border border-teal-500/30 p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-heading font-bold text-base text-white">
                {editingItem ? "Edit Hardware Details" : "Add Hardware to Inventory"}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Hardware Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UniFi U6+ Long-Range Wi-Fi 6 Access Point"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Brand / Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ubiquiti / MikroTik / TP-Link"
                    value={itemForm.brand}
                    onChange={(e) => setItemForm({ ...itemForm, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Model Number</label>
                  <input
                    type="text"
                    placeholder="e.g. U6-Plus / RB760iGS"
                    value={itemForm.model}
                    onChange={(e) => setItemForm({ ...itemForm, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as InventoryItem["category"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="access_point">Wi-Fi Access Point</option>
                    <option value="router">Router / Gateway</option>
                    <option value="switch">PoE &amp; Managed Switch</option>
                    <option value="cctv_camera">CCTV Security Camera</option>
                    <option value="nvr">NVR / DVR Storage</option>
                    <option value="cable">Cat6 Cable Roll</option>
                    <option value="accessories">Patch Panel / Connectors / PoE Injector</option>
                    <option value="laptop">PC / Server / Laptop</option>
                    <option value="other">Other Equipment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Condition</label>
                  <select
                    value={itemForm.condition}
                    onChange={(e) => setItemForm({ ...itemForm, condition: e.target.value as InventoryItem["condition"] })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  >
                    <option value="new">Brand New (Boxed)</option>
                    <option value="good">Good / Tested</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="faulty">Faulty / Needs Service</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Quantity In Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Unit Purchase Cost (KES)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 14500"
                    value={itemForm.unitCost || ""}
                    onChange={(e) => setItemForm({ ...itemForm, unitCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Client Selling Price (KES) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 18500"
                    value={itemForm.sellingPrice || ""}
                    onChange={(e) => setItemForm({ ...itemForm, sellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Deployed At Client Site (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Peak Logistics Mombasa Rd / After40 Hotel"
                    value={itemForm.deployedAt}
                    onChange={(e) => setItemForm({ ...itemForm, deployedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Serial Numbers (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. U6P-984210, U6P-984211, U6P-984212"
                    value={itemForm.serialNumbers}
                    onChange={(e) => setItemForm({ ...itemForm, serialNumbers: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Notes / Supplier Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Sourced from Nairobi Tech Supplies with 1-year warranty"
                    value={itemForm.notes}
                    onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-border text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
                >
                  {editingItem ? "Update Hardware Item" : "Save to Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;

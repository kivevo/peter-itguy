import React, { useState, useEffect } from "react";
import { dataStorage } from "@/services/dataStorage";
import { useToast } from "@/hooks/use-toast";
import {
  Database,
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HardDrive,
  FileJson,
  Layers,
  Sparkles,
  RefreshCw,
  Lock,
  ArrowDownToLine,
  Check
} from "lucide-react";

export const SystemBackupManager: React.FC = () => {
  const { toast } = useToast();

  const [lastBackup, setLastBackup] = useState<string | null>(dataStorage.getLastBackupDate());
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorePreview, setRestorePreview] = useState<{
    version: string;
    timestamp: string;
    modulesCount: number;
    rawData: string;
    stats?: Record<string, number>;
  } | null>(null);

  const calculateStats = () => {
    const backup = dataStorage.exportMasterBackup();
    setStats(backup.stats || {});
    setLastBackup(dataStorage.getLastBackupDate());
  };

  useEffect(() => {
    calculateStats();
    const unsub = dataStorage.subscribe(calculateStats);
    return () => unsub();
  }, []);

  // Download Master JSON Backup
  const handleDownloadBackup = () => {
    setIsExporting(true);
    try {
      const masterBackup = dataStorage.exportMasterBackup();
      const jsonStr = JSON.stringify(masterBackup, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `krenovate_master_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastBackup(masterBackup.timestamp);
      toast({
        title: "Master Backup Downloaded! 🛡️",
        description: `Saved snapshot containing ${Object.keys(masterBackup.data).length} database tables.`,
      });
    } catch (err: any) {
      toast({
        title: "Backup Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Inspect uploaded JSON file
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed || !parsed.data || typeof parsed.data !== "object") {
          toast({
            title: "Invalid Backup File",
            description: "The selected file is not a valid Krenovate master backup.",
            variant: "destructive",
          });
          return;
        }

        const modCount = Object.keys(parsed.data).length;
        setRestorePreview({
          version: parsed.version || "1.0",
          timestamp: parsed.timestamp || new Date().toISOString(),
          modulesCount: modCount,
          rawData: text,
          stats: parsed.stats,
        });

        toast({
          title: "Backup File Verified ✅",
          description: `Found ${modCount} modules dated ${new Date(parsed.timestamp).toLocaleDateString()}.`,
        });
      } catch (err: any) {
        toast({
          title: "File Read Error",
          description: `Could not parse JSON: ${err.message}`,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // Execute restore
  const handleConfirmRestore = () => {
    if (!restorePreview) return;
    setIsRestoring(true);
    try {
      const res = dataStorage.importMasterBackup(restorePreview.rawData);
      if (res.success) {
        toast({
          title: "Master Database Restored! 🚀",
          description: res.message,
        });
        setRestorePreview(null);
        calculateStats();
      } else {
        toast({
          title: "Restore Failed",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Restore Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  // Calculate days since backup
  const daysSinceBackup = lastBackup
    ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  1-Click Master Backup &amp; Disaster Recovery
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-mono font-bold">
                  JSON Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Safeguard all client assets, invoices, passwords, financial ledgers &amp; hardware inventory.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadBackup}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all active:scale-98"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Download Master Backup (.json)</span>
        </button>
      </div>

      {/* Backup Status Banner */}
      <div
        className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          daysSinceBackup <= 7
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {daysSinceBackup <= 7 ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
          )}
          <div>
            <h4 className="font-heading font-bold text-sm text-white">
              {daysSinceBackup <= 7
                ? "System Backup is Healthy & Up to Date"
                : "System Backup Recommended!"}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {lastBackup
                ? `Last master archive generated: ${new Date(lastBackup).toLocaleString()} (${daysSinceBackup} days ago)`
                : "No full system backup recorded on this browser yet. Generate one now to protect your data."}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="px-3.5 py-2 rounded-xl bg-navy-900 border border-border text-xs font-bold text-white hover:bg-navy-800 transition-all shrink-0"
        >
          Backup Now
        </button>
      </div>

      {/* TWO COLUMNS: EXPORT VS IMPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Database Modules Summary */}
        <div className="p-6 rounded-3xl bg-navy-900 border border-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-teal-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                Live Database Content Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              {Object.keys(stats).length} Modules Tracked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {Object.entries(stats).map(([key, count]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-border/60"
              >
                <span className="text-slate-400 capitalize truncate text-[11px]">
                  {key.toLowerCase().replace(/_/g, " ")}:
                </span>
                <span className="font-bold text-white bg-teal-500/15 px-2 py-0.5 rounded text-[11px] text-teal-300">
                  {count}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 font-sans leading-relaxed">
            💡 <strong>Disaster Recovery Guarantee:</strong> Downloading the master JSON allows you to recreate your complete business state on any device, tablet, or fresh browser installation in under 5 seconds.
          </div>
        </div>

        {/* Right Column: Restore from Backup */}
        <div className="p-6 rounded-3xl bg-navy-900 border border-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                Restore Database from JSON Archive
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">Safe Import</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Switched to a new laptop or clearing system cache? Upload your previously saved{" "}
            <code className="px-1 py-0.5 rounded bg-navy-950 text-teal-300 font-mono">.json</code> backup file to restore all client records, invoices, credentials, and settings.
          </p>

          <label className="border-2 border-dashed border-border hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-navy-950/60 transition-all group">
            <FileJson className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Click to Select Backup JSON File</span>
            <span className="text-[10px] text-slate-500">krenovate_master_backup_*.json</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelected}
              className="hidden"
            />
          </label>

          {/* Restore Confirmation Card */}
          {restorePreview && (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ready to Restore:</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-300">
                  Version {restorePreview.version}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-300 space-y-1 bg-navy-950 p-2.5 rounded-xl border border-border">
                <div>Archive Date: <strong>{new Date(restorePreview.timestamp).toLocaleString()}</strong></div>
                <div>Modules in File: <strong>{restorePreview.modulesCount} tables</strong></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestorePreview(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isRestoring}
                  onClick={handleConfirmRestore}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRestoring ? "animate-spin" : ""}`} />
                  <span>Confirm &amp; Restore Database</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

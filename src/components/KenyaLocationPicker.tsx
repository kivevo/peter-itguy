import React, { useState, useEffect, useMemo } from "react";
import {
  KENYA_COUNTIES,
  CountyInfo,
  ConstituencyInfo,
  formatLocationString,
  getEstimatedDispatchSLA
} from "@/data/kenyaLocations";
import {
  MapPin,
  Building,
  Navigation,
  CheckCircle2,
  Search,
  Sparkles,
  ChevronDown,
  Clock,
  Layers
} from "lucide-react";

export interface KenyaLocationValue {
  county: string;
  constituency: string;
  ward: string;
  building: string;
  formattedLocation: string;
  slaBadge: string;
}

interface KenyaLocationPickerProps {
  initialCounty?: string;
  initialConstituency?: string;
  initialWard?: string;
  initialBuilding?: string;
  compact?: boolean;
  showBuildingField?: boolean;
  required?: boolean;
  onChange: (value: KenyaLocationValue) => void;
}

export const KenyaLocationPicker: React.FC<KenyaLocationPickerProps> = ({
  initialCounty = "Nairobi City",
  initialConstituency = "Westlands",
  initialWard = "Parklands / Highridge",
  initialBuilding = "",
  compact = false,
  showBuildingField = true,
  required = true,
  onChange,
}) => {
  const [selectedCountyName, setSelectedCountyName] = useState<string>(initialCounty);
  const [selectedConstituencyName, setSelectedConstituencyName] = useState<string>(initialConstituency);
  const [selectedWardName, setSelectedWardName] = useState<string>(initialWard);
  const [building, setBuilding] = useState<string>(initialBuilding);
  const [countySearch, setCountySearch] = useState<string>("");

  // Find active county object
  const currentCounty = useMemo(() => {
    return (
      KENYA_COUNTIES.find(
        (c) => c.name.toLowerCase() === selectedCountyName.toLowerCase()
      ) || KENYA_COUNTIES.find((c) => c.code === "047")!
    );
  }, [selectedCountyName]);

  // Find active constituency object
  const currentConstituencies = useMemo(() => {
    return currentCounty.constituencies || [];
  }, [currentCounty]);

  const currentConstituency = useMemo(() => {
    return (
      currentConstituencies.find(
        (c) => c.name.toLowerCase() === selectedConstituencyName.toLowerCase()
      ) || currentConstituencies[0]
    );
  }, [currentConstituencies, selectedConstituencyName]);

  // Find active wards list
  const currentWards = useMemo(() => {
    return currentConstituency?.wards || [];
  }, [currentConstituency]);

  // Calculate live SLA badge
  const dispatchSLA = useMemo(() => {
    return getEstimatedDispatchSLA(currentCounty.name, currentConstituency?.name);
  }, [currentCounty, currentConstituency]);

  // Notify parent of updates
  useEffect(() => {
    const formatted = formatLocationString(
      currentCounty.name,
      currentConstituency?.name,
      selectedWardName,
      building
    );

    onChange({
      county: currentCounty.name,
      constituency: currentConstituency?.name || "",
      ward: selectedWardName || "",
      building: building.trim(),
      formattedLocation: formatted,
      slaBadge: dispatchSLA.badge,
    });
  }, [currentCounty, currentConstituency, selectedWardName, building, dispatchSLA, onChange]);

  // When county changes, auto-select its first constituency & ward
  const handleCountyChange = (countyName: string) => {
    setSelectedCountyName(countyName);
    const county = KENYA_COUNTIES.find((c) => c.name === countyName);
    if (county && county.constituencies.length > 0) {
      const firstConst = county.constituencies[0];
      setSelectedConstituencyName(firstConst.name);
      if (firstConst.wards.length > 0) {
        setSelectedWardName(firstConst.wards[0]);
      } else {
        setSelectedWardName("");
      }
    }
  };

  // When constituency changes, auto-select its first ward
  const handleConstituencyChange = (constName: string) => {
    setSelectedConstituencyName(constName);
    const constObj = currentConstituencies.find((c) => c.name === constName);
    if (constObj && constObj.wards.length > 0) {
      setSelectedWardName(constObj.wards[0]);
    } else {
      setSelectedWardName("");
    }
  };

  // Filtered counties for search
  const filteredCounties = useMemo(() => {
    if (!countySearch.trim()) return KENYA_COUNTIES;
    return KENYA_COUNTIES.filter(
      (c) =>
        c.name.toLowerCase().includes(countySearch.toLowerCase()) ||
        c.code.includes(countySearch) ||
        c.capital.toLowerCase().includes(countySearch.toLowerCase())
    );
  }, [countySearch]);

  return (
    <div className="space-y-3.5 w-full">
      {/* Dynamic 3-Tier Grid */}
      <div className={`grid gap-3 ${compact ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
        {/* Tier 1: County Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>1. County *</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              (47 Counties)
            </span>
          </label>
          <div className="relative">
            <select
              required={required}
              value={currentCounty.name}
              onChange={(e) => handleCountyChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 pr-8 transition-colors cursor-pointer"
            >
              <optgroup label="⭐ Major Tech & Commercial Metros">
                <option value="Nairobi City">Nairobi City (Code 047)</option>
                <option value="Kiambu">Kiambu (Code 022)</option>
                <option value="Machakos">Machakos (Code 016)</option>
                <option value="Kajiado">Kajiado (Code 034)</option>
                <option value="Mombasa">Mombasa (Code 001)</option>
                <option value="Nakuru">Nakuru (Code 032)</option>
                <option value="Uasin Gishu">Uasin Gishu / Eldoret (Code 027)</option>
                <option value="Kisumu">Kisumu (Code 042)</option>
              </optgroup>
              <optgroup label="All 47 Counties of Kenya (A–Z)">
                {[...KENYA_COUNTIES]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.capital}) — {c.code}
                    </option>
                  ))}
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>
        </div>

        {/* Tier 2: Constituency / Sub-County Selection */}
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              <span>2. Constituency *</span>
            </span>
            <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400">
              {currentConstituencies.length} in {currentCounty.name.replace(" City", "")}
            </span>
          </label>
          <div className="relative">
            <select
              required={required}
              value={currentConstituency?.name || ""}
              onChange={(e) => handleConstituencyChange(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 pr-8 transition-colors cursor-pointer"
            >
              {currentConstituencies.map((constituency) => (
                <option key={constituency.name} value={constituency.name}>
                  {constituency.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>
        </div>

        {/* Tier 3: Ward / Neighborhood Selection */}
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-teal-500" />
              <span>3. Ward / Area *</span>
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {currentWards.length} Wards
            </span>
          </label>
          <div className="relative">
            <select
              required={required}
              value={selectedWardName}
              onChange={(e) => setSelectedWardName(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 pr-8 transition-colors cursor-pointer"
            >
              {currentWards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>
        </div>
      </div>

      {/* Optional Exact Building / Office Floor / Landmark */}
      {showBuildingField && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-teal-500" />
              <span>Building, Plaza, Floor or Landmark (Optional)</span>
            </span>
            <span className="text-[10px] text-muted-foreground">e.g. Delta Corner / Mirage Tower 2</span>
          </label>
          <input
            type="text"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="e.g. 4th Floor, Apex Business Plaza, Commercial St."
            className="w-full px-3.5 py-2 rounded-xl bg-muted/60 dark:bg-navy-950 border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
          />
        </div>
      )}

      {/* Real-Time Live SLA Dispatch Indicator Pill */}
      <div className={`p-2.5 px-3 rounded-xl border flex items-center justify-between gap-3 text-[11px] font-mono ${dispatchSLA.color} animate-in fade-in duration-150`}>
        <div className="flex items-center gap-2 truncate">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-bold truncate">{dispatchSLA.badge}</span>
        </div>
        <span className="text-[10px] opacity-80 flex-shrink-0 hidden sm:inline">
          {dispatchSLA.responseTime}
        </span>
      </div>
    </div>
  );
};

export default KenyaLocationPicker;

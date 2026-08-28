import React, { useState } from "react";
import { getWhatsAppUrl } from "@/config/site";
import { Calculator, DollarSign, ShieldCheck, ArrowRight, MessageCircle, AlertTriangle } from "lucide-react";

export const DowntimeCalculator: React.FC = () => {
  const [devices, setDevices] = useState(12);
  const [downtimeHours, setDowntimeHours] = useState(4);
  const [hourlyWage, setHourlyWage] = useState(600); // KES per hour

  // Calculations
  const monthlyPayrollLoss = devices * downtimeHours * hourlyWage;
  const estimatedLostSales = downtimeHours * (devices > 10 ? 15000 : 6000); // estimated missed transactions/inquiries
  const totalMonthlyLoss = monthlyPayrollLoss + estimatedLostSales;
  const estimatedAnnualRisk = totalMonthlyLoss * 12;

  return (
    <section className="py-16 lg:py-24 bg-card dark:bg-navy-900 border-y border-border/80 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-mono font-semibold border border-amber-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Loss Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
            How Much Are Computer &amp; Wi-Fi Freezes <br className="hidden sm:inline" />
            <span className="text-gradient-teal">Costing Your Business in Kenya?</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Adjust the sliders below to see how much money slow computers, frozen payment tills, and internet drops cost your company in wasted salary and lost sales.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-muted/40 dark:bg-navy-950 border border-border shadow-card-dark dark:shadow-glow p-6 sm:p-10">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Controls Left */}
            <div className="md:col-span-7 space-y-6">
              {/* Slider 1: Workstations / POS Units */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-foreground">
                  <span>Number of Staff Computers &amp; Payment Tills:</span>
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-base">
                    {devices} devices
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={devices}
                  onChange={(e) => setDevices(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>2 devices (Small Shop)</span>
                  <span>15 (Office / Restaurant)</span>
                  <span>60 (Multi-Branch)</span>
                </div>
              </div>

              {/* Slider 2: Downtime Hours per Month */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-foreground">
                  <span>Hours Lost per Month (Slow Internet &amp; Computer Freezes):</span>
                  <span className="font-mono text-amber-500 font-bold text-base">
                    {downtimeHours} hours
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={downtimeHours}
                  onChange={(e) => setDowntimeHours(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>1 hr (Occasional glitch)</span>
                  <span>5 hrs (Frequent freezes)</span>
                  <span>15 hrs (Serious slowdowns)</span>
                </div>
              </div>

              {/* Slider 3: Average Hourly Labor Cost */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-foreground">
                  <span>Average Staff Salary per Hour (KES):</span>
                  <span className="font-mono text-teal-600 dark:text-teal-400 font-bold text-base">
                    KES {hourlyWage.toLocaleString()} /hr
                  </span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="2000"
                  step="50"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>KES 250 (Retail staff)</span>
                  <span>KES 800 (Office staff)</span>
                  <span>KES 2,000 (Managers)</span>
                </div>
              </div>
            </div>

            {/* Results Right Card */}
            <div className="md:col-span-5 rounded-2xl bg-card dark:bg-navy-900 border border-teal-500/30 p-6 space-y-4 shadow-lg text-center md:text-left">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Estimated Monthly Money Lost
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-rose-500 tracking-tight">
                  KES {totalMonthlyLoss.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lost every month in unproductive staff time and delayed customer orders
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs space-y-1.5 text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Staff Idle Time:</span>
                  <span className="text-foreground font-bold">KES {monthlyPayrollLoss.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delayed Customer Sales:</span>
                  <span className="text-foreground font-bold">~KES {estimatedLostSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/70 text-teal-600 dark:text-teal-400 font-bold">
                  <span>Total Yearly Loss:</span>
                  <span>KES {estimatedAnnualRisk.toLocaleString()} / yr</span>
                </div>
              </div>

              <a
                href={getWhatsAppUrl(
                  `Hi Peter, I used the Downtime Calculator on your site (${devices} devices with ${downtimeHours}hrs monthly downtime = KES ${totalMonthlyLoss.toLocaleString()} lost/mo). I'd like your help fixing our office computers & Wi-Fi.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-glow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Stop Wasting Money — Fix with Peter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DowntimeCalculator;

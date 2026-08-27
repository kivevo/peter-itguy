import React, { useState, useRef, useEffect } from "react";
import { getWhatsAppUrl, SITE_CONFIG } from "@/config/site";
import { Terminal, Play, CornerDownLeft, Sparkles, Check, Copy } from "lucide-react";

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export const InteractiveTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init-1",
      command: "itguy --status",
      output: (
        <div className="space-y-1 text-teal-300">
          <p>🟢 System Status: ALL SYSTEMS OPERATIONAL</p>
          <p>📍 Location: Nairobi GPO 00100 • Coverage: Countrywide Remote & On-site</p>
          <p>⚡ Response SLA: &lt; 15 mins for critical incident triage</p>
        </div>
      ),
      timestamp: "10:42:01",
    },
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const quickCommands = [
    { label: "ping after40hotel.com", cmd: "ping after40hotel.com" },
    { label: "audit --wifi-security", cmd: "audit --wifi-security" },
    { label: "whoami", cmd: "whoami" },
    { label: "connect whatsapp", cmd: "connect whatsapp" },
  ];

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim().toLowerCase();
    const time = new Date().toLocaleTimeString("en-KE", { hour12: false });
    let output: React.ReactNode = null;

    if (trimmed === "ping after40hotel.com") {
      output = (
        <div className="space-y-0.5 text-xs text-slate-300 font-mono">
          <p className="text-teal-400">PING after40hotel.com (104.21.55.2) 56(84) bytes of data.</p>
          <p>64 bytes from 104.21.55.2: icmp_seq=1 ttl=58 time=11.4 ms</p>
          <p>64 bytes from 104.21.55.2: icmp_seq=2 ttl=58 time=10.8 ms</p>
          <p>64 bytes from 104.21.55.2: icmp_seq=3 ttl=58 time=12.1 ms</p>
          <p className="text-emerald-400 font-semibold pt-1">
            --- after40hotel.com ping statistics ---<br />
            3 packets transmitted, 3 received, 0% packet loss • Performance: 40% FASTER than baseline
          </p>
        </div>
      );
    } else if (trimmed.includes("audit")) {
      output = (
        <div className="space-y-1 text-xs text-slate-300 font-mono">
          <p className="text-amber-400">🔍 Running Rapid Network Health Scan...</p>
          <p>[✓] Gateway: Safaricom Fiber (100Mbps Up/Down) — OK</p>
          <p>[✓] VLAN Isolation: Guest Wi-Fi (VLAN 20) separated from POS (VLAN 10) — SECURE</p>
          <p>[✓] DNS Resolution: 1.1.1.1 & 8.8.8.8 Primary/Failover — HEALTHY</p>
          <p>[✓] Off-site Cloud Backup: Automated encrypted sync to AWS S3 — ACTIVE</p>
          <p className="text-emerald-400 font-bold">Audit Score: 98/100 • Zero Critical Bottlenecks</p>
        </div>
      );
    } else if (trimmed === "whoami") {
      output = (
        <div className="space-y-1 text-xs text-slate-300 font-mono">
          <p className="text-teal-300 font-bold">Peter Kivevo John — The IT Guy</p>
          <p>• BSc Computer Science (Catholic University of Eastern Africa)</p>
          <p>• 30+ Regional Samchi Telecom (Safaricom) Branches Supported</p>
          <p>• Specialization: UniFi/MikroTik Networks, IP CCTV, Web Engineering</p>
        </div>
      );
    } else if (trimmed.includes("whatsapp")) {
      output = (
        <div className="space-y-1 text-xs font-mono text-emerald-400">
          <p>Opening direct WhatsApp line with Peter...</p>
          <a
            href={getWhatsAppUrl("Hi Peter, connecting from your website terminal console.")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-teal-300 font-semibold hover:text-white"
          >
            Click here if WhatsApp didn't launch automatically
          </a>
        </div>
      );
      window.open(getWhatsAppUrl("Hi Peter, connecting from your website terminal console."), "_blank");
    } else if (trimmed === "help") {
      output = (
        <div className="space-y-1 text-xs text-slate-300 font-mono">
          <p className="text-teal-400 font-semibold">Available Commands:</p>
          <p>• <span className="text-white">ping after40hotel.com</span> - Run live latency check on client site</p>
          <p>• <span className="text-white">audit --wifi-security</span> - Run simulated network health audit</p>
          <p>• <span className="text-white">whoami</span> - Display engineer credentials & track record</p>
          <p>• <span className="text-white">connect whatsapp</span> - Launch direct chat with Peter</p>
          <p>• <span className="text-white">clear</span> - Clear the terminal output</p>
        </div>
      );
    } else if (trimmed === "clear") {
      setLogs([]);
      return;
    } else {
      output = (
        <div className="text-xs text-rose-400 font-mono">
          Command not recognized: "{rawCmd}". Type <span className="text-white font-bold">help</span> to view available diagnostic tools.
        </div>
      );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: rawCmd,
        output,
        timestamp: time,
      },
    ]);
    setInputVal("");

    // Only scroll the internal terminal box, never the whole window
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputVal.trim()) {
      executeCommand(inputVal);
    }
  };

  return (
    <div className="rounded-3xl bg-navy-950 border border-teal-500/30 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-navy-900/90 px-4 py-3 border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] text-muted-foreground font-semibold ml-2">
            peter@nairobi-edge-gateway:~ (zsh)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
          <Sparkles className="w-3 h-3" />
          <span>Interactive Diagnostic Console</span>
        </div>
      </div>

      {/* Output Console Log Area */}
      <div 
        ref={logContainerRef}
        className="p-4 sm:p-5 h-72 sm:h-80 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-teal-500/20"
      >
        {logs.map((log) => (
          <div key={log.id} className="space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-teal-400 font-bold">peter@itguy:~$</span>
              <span className="text-white font-semibold">{log.command}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{log.timestamp}</span>
            </div>
            <div className="pl-4 border-l border-teal-500/30 py-0.5">
              {log.output}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Click Command Presets */}
      <div className="px-4 py-2.5 bg-navy-900/60 border-t border-border/60 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground uppercase font-bold mr-1">
          Quick Commands:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q.cmd}
            onClick={() => executeCommand(q.cmd)}
            className="px-2.5 py-1 rounded-md bg-navy-800 hover:bg-teal-500/20 text-teal-300 hover:text-white border border-teal-500/20 text-[11px] transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Command Input Field */}
      <div className="p-3 bg-navy-950 border-t border-border flex items-center gap-2">
        <span className="text-teal-400 font-bold text-sm">peter@itguy:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help', 'ping after40hotel.com', or 'whoami' and press Enter..."
          className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-muted-foreground/60"
        />
        <button
          onClick={() => inputVal.trim() && executeCommand(inputVal)}
          aria-label="Execute command"
          className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
export default InteractiveTerminal;

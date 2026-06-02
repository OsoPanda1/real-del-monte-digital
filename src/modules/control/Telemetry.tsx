import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, Cpu, HardDrive, BarChart3 } from "lucide-react";

type Snap = {
  requestsPerMin: number; avgLatencyMs: number; cpuUsagePct: number; memoryUsagePct: number;
  meshOnline: number; meshTotal: number; bandwidthMb: number; logs: string[]; lastUpdate: string;
};

const clamp = (v: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, v));
const rnd = (mn: number, mx: number) => Math.floor(Math.random() * (mx - mn + 1)) + mn;

function buildSnap(prev?: Snap): Snap {
  const now = new Date().toISOString();
  const base = prev ?? { requestsPerMin: 120, avgLatencyMs: 90, cpuUsagePct: 25, memoryUsagePct: 45, meshOnline: 10, meshTotal: 12, bandwidthMb: 24, logs: [], lastUpdate: now };
  const n: Snap = {
    ...base,
    requestsPerMin: clamp(base.requestsPerMin + rnd(-20, 30), 60, 260),
    avgLatencyMs: clamp(base.avgLatencyMs + rnd(-20, 20), 40, 180),
    cpuUsagePct: clamp(base.cpuUsagePct + rnd(-8, 10), 5, 95),
    memoryUsagePct: clamp(base.memoryUsagePct + rnd(-5, 8), 25, 95),
    meshOnline: clamp(base.meshOnline + rnd(-1, 1), 6, base.meshTotal),
    bandwidthMb: clamp(base.bandwidthMb + rnd(-5, 8), 8, 80),
    lastUpdate: now,
  };
  n.logs = [
    `[${now}] kernel.intent → gastronomia (conf: 0.94)`,
    `[${now}] mesh.node.N-03 → heartbeat OK`,
    `[${now}] api.places.query → ${n.avgLatencyMs}ms`,
    `[${now}] mesh.bandwidth → ${n.bandwidthMb}MB/s`,
    ...(base.logs ?? []),
  ].slice(0, 50);
  return n;
}

const sev = (v: number, t1 = 50, t2 = 75, t3 = 90) =>
  v >= t3 ? "text-red-500" : v >= t2 ? "text-amber-400" : v >= t1 ? "text-gold" : "text-emerald-400";

export default function Telemetry() {
  const [s, setS] = useState<Snap>(() => buildSnap());
  useEffect(() => { const id = setInterval(() => setS((p) => buildSnap(p)), 2200); return () => clearInterval(id); }, []);

  const cards = useMemo(() => [
    { label: "Requests/min", value: s.requestsPerMin.toLocaleString("es-MX"), icon: BarChart3, color: "text-electric" },
    { label: "Latencia Avg", value: `${s.avgLatencyMs}ms`, icon: Activity, color: sev(s.avgLatencyMs, 80, 110, 150) },
    { label: "CPU", value: `${s.cpuUsagePct}%`, icon: Cpu, color: sev(s.cpuUsagePct) },
    { label: "Memoria", value: `${s.memoryUsagePct}%`, icon: HardDrive, color: sev(s.memoryUsagePct, 60, 80, 90) },
  ], [s]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 border border-border/20">
            <c.icon className={`h-4 w-4 ${c.color}`} />
            <p className={`mt-2 text-2xl font-display font-bold ${c.color}`}>{c.value}</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4 border border-border/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
            <Wifi className="h-3 w-3 text-emerald-400" />
            Red Mesh Soberana — {s.meshOnline}/{s.meshTotal} nodos
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">BW: {s.bandwidthMb} MB/s</span>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {Array.from({ length: s.meshTotal }).map((_, i) => {
            const on = i < s.meshOnline;
            return (
              <div key={i} className="text-center">
                <div className={`mx-auto h-3 w-3 rounded-full ${on ? "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60" : "bg-muted/40"}`} />
                <span className="block text-[9px] font-mono text-muted-foreground mt-1">N-{String(i + 1).padStart(2, "0")}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 border border-border/20">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-foreground">Log en tiempo real</p>
          <p className="text-[10px] font-mono text-muted-foreground">{s.lastUpdate.slice(11, 19)}</p>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-[10px] text-muted-foreground">
          {s.logs.map((l, i) => <p key={i} className="border-l-2 border-gold/30 pl-2">{l}</p>)}
        </div>
      </div>
    </div>
  );
}

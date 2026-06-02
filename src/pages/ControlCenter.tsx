import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, Database, Clock, TrendingUp, Shield, Cpu, Globe, Network, Layers } from "lucide-react";
import Telemetry from "@/modules/control/Telemetry";

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

const FEDERATIONS = [
  { name: "IDENTITY_CORE", status: "online", icon: Shield },
  { name: "LEDGER_2DBD", status: "online", icon: Database },
  { name: "COMPUTE_EDGE", status: "online", icon: Cpu },
  { name: "ALAMEXA_NEXUS", status: "standby", icon: Network },
  { name: "UTAMV_NEURAL", status: "online", icon: TrendingUp },
  { name: "MEDIA_BROADCAST", status: "online", icon: Globe },
  { name: "RDM_TWIN_4D", status: "online", icon: Layers },
] as const;

export default function ControlCenter() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick((t) => t + 1), 5000); return () => clearInterval(i); }, []);

  const metrics = useMemo(() => ({
    activeUsers: rnd(80, 200), latencyMs: rnd(60, 150), places: 142, uptime: 99.7, intents: rnd(500, 1200),
  }), [tick]);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70">Control Center · RDM-TOS</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">
            Sistema Operativo <span className="text-gradient-gold">Territorial Soberano</span>
          </h1>
          <p className="mt-3 text-sm font-body text-muted-foreground max-w-xl">
            Nodo Cero · Real del Monte. Monitoreo del kernel TAMV en tiempo real.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Usuarios Activos", value: metrics.activeUsers.toLocaleString("es-MX"), icon: Users, color: "text-emerald-400" },
            { label: "Latencia", value: `${metrics.latencyMs}ms`, icon: Zap, color: metrics.latencyMs > 130 ? "text-red-500" : metrics.latencyMs > 100 ? "text-amber-400" : "text-electric" },
            { label: "Lugares Indexados", value: metrics.places, icon: Database, color: "text-gold" },
            { label: "Uptime", value: `${metrics.uptime}%`, icon: Clock, color: "text-emerald-400" },
            { label: "Intents IA", value: metrics.intents.toLocaleString("es-MX"), icon: TrendingUp, color: "text-electric" },
          ].map((m) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 border border-border/20">
              <m.icon className={`h-4 w-4 ${m.color}`} />
              <p className={`mt-2 text-2xl font-display font-bold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{m.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/20">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-4">7 Federaciones TAMV — Estado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {FEDERATIONS.map((f) => (
              <div key={f.name} className="flex flex-col items-center gap-2 rounded-xl p-3 bg-secondary/20 border border-border/20">
                <div className={`h-2 w-2 rounded-full ${f.status === "online" ? "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60" : "bg-amber-400"}`} />
                <f.icon className="h-4 w-4 text-gold" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-center text-foreground">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Telemetría e Infraestructura</h2>
          <Telemetry />
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gold/20">
          <p className="text-[11px] font-mono uppercase tracking-widest text-gold mb-2">TAMV-Consensus · Integridad Global</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-border/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-electric" style={{ width: "94%" }} />
            </div>
            <span className="text-2xl font-display font-bold text-gold">0.94</span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-400">SOVEREIGN_LOCKED</span>
          </div>
          <p className="mt-3 text-[10px] font-mono text-muted-foreground">
            I_TAMV = Σ(Wn · σ(Vn) / Δt) × E_Dignity · Estatuto de Dignidad: ✓
          </p>
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Bot, Brain, ShieldAlert, MapPin, Thermometer, TrendingUp, Sparkles, Send, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const capabilities = [
  {
    icon: MapPin,
    title: "Sugerencias Predictivas",
    description: "Recomienda negocios y experiencias premium según densidad de jugadores, tiempo de estancia y contexto climático.",
    accent: "gold",
  },
  {
    icon: TrendingUp,
    title: "Regulación Económica",
    description: "Ajusta valor virtual de minerales según saturación de zonas, redistribución de flujo y metas de la DAO.",
    accent: "electric",
  },
  {
    icon: ShieldAlert,
    title: "Protección Antifraude",
    description: "Detección de GPS spoofing, velocidades imposibles (>120 km/h) y bloqueo automático de minería sospechosa.",
    accent: "destructive",
  },
  {
    icon: Thermometer,
    title: "Energía de Zona",
    description: "Analiza densidad de jugadores, historial de consumo y contexto temporal para recomendar rutas óptimas.",
    accent: "teal",
  },
];

const accentStyles: Record<string, { border: string; icon: string; bg: string }> = {
  gold: { border: "border-gold/15 hover:border-gold/30", icon: "text-gold", bg: "bg-gold/10" },
  electric: { border: "border-electric/15 hover:border-electric/30", icon: "text-electric", bg: "bg-electric/10" },
  destructive: { border: "border-destructive/15 hover:border-destructive/30", icon: "text-destructive", bg: "bg-destructive/10" },
  teal: { border: "border-teal/15 hover:border-teal/30", icon: "text-teal", bg: "bg-teal/10" },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function RealitoAI() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-8 p-8 max-w-[1400px]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-electric glow-electric"
        >
          <Bot className="h-7 w-7 text-white" />
        </motion.div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1">
            Oráculo Cognitivo
          </p>
          <h1 className="text-4xl font-display font-bold tracking-tight">Realito AI</h1>
          <p className="text-sm font-body text-muted-foreground">
            Instancia Isabella/TAMV para Real del Monte
          </p>
        </div>
      </motion.div>

      {/* Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-7"
      >
        <div className="flex items-center gap-2 mb-5">
          <Brain className="h-4 w-4 text-ore" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Arquitectura Cognitiva</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "FRAMEWORK", value: "Isabella", desc: "Motor cognitivo TAMV", color: "text-foreground" },
            { label: "INSTANCIA", value: "Realito AI", desc: "Entrenada para RDM", color: "text-electric" },
            { label: "RADARES", value: "Horus + Anubis", desc: "Seguimientos y seguridad", color: "text-gold" },
          ].map((block) => (
            <div key={block.label} className="glass rounded-2xl p-5 text-center hover:border-gold/15 transition-colors">
              <p className="text-[9px] font-mono text-muted-foreground tracking-widest">{block.label}</p>
              <p className={cn("mt-2 text-xl font-display font-bold", block.color)}>{block.value}</p>
              <p className="text-[11px] font-body text-muted-foreground mt-1">{block.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Capabilities grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5 md:grid-cols-2">
        {capabilities.map((cap) => {
          const styles = accentStyles[cap.accent];
          return (
            <motion.div
              key={cap.title}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn("glass rounded-2xl p-6 transition-all duration-300", styles.border)}
            >
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl mb-4", styles.bg)}>
                <cap.icon className={cn("h-5 w-5", styles.icon)} />
              </div>
              <h3 className="text-xl font-display font-bold">{cap.title}</h3>
              <p className="mt-2 text-[13px] font-body text-muted-foreground leading-relaxed">{cap.description}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chat Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-gold rounded-3xl overflow-hidden"
      >
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gold/10">
          <Terminal className="h-3.5 w-3.5 text-gold/60" />
          <p className="text-[10px] font-mono text-gold/60 tracking-widest uppercase">Realito AI — Terminal</p>
          <div className="ml-auto flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald/60" />
            <div className="h-2 w-2 rounded-full bg-gold/40" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
        <div className="p-6 space-y-4 font-mono text-sm">
          <div className="flex gap-3">
            <span className="text-electric font-bold">▸</span>
            <span className="text-muted-foreground">¿Dónde conviene comer un paste ahora?</span>
          </div>
          <div className="flex gap-3">
            <Sparkles className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Basado en la energía de zona actual, te recomiendo <span className="text-gold font-semibold">El Portal</span> (calle Hidalgo).
              Densidad de jugadores baja (32%), tiempo de espera estimado: 5 min.
              <span className="text-electric"> Bonus:</span> recarga de energía +15 si minas en el nodo cercano antes de las 14:00.
            </span>
          </div>
          <div className="divider-gold mt-2" />
          <div className="flex items-center gap-3 mt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregunta a Realito..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm font-mono"
            />
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Bot, Brain, ShieldAlert, MapPin, Thermometer, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    icon: MapPin,
    title: "Sugerencias Predictivas",
    description: "Recomienda negocios y experiencias premium según densidad de jugadores, tiempo de estancia y contexto climático.",
    variant: "gold" as const,
  },
  {
    icon: TrendingUp,
    title: "Regulación Económica Dinámica",
    description: "Ajusta valor virtual de minerales según saturación de zonas, redistribución de flujo y metas de la DAO.",
    variant: "teal" as const,
  },
  {
    icon: ShieldAlert,
    title: "Protección Antifraude",
    description: "Detección de GPS spoofing, velocidades imposibles (>120 km/h) y bloqueo automático de minería sospechosa.",
    variant: "destructive" as const,
  },
  {
    icon: Thermometer,
    title: "Energía de Zona",
    description: "Analiza densidad de jugadores, historial de consumo y contexto temporal para recomendar rutas óptimas.",
    variant: "teal" as const,
  },
];

const variantBorder: Record<string, string> = {
  gold: "border-gold/20 hover:border-gold/40",
  teal: "border-teal/20 hover:border-teal/40",
  destructive: "border-destructive/20 hover:border-destructive/40",
};

const variantIcon: Record<string, string> = {
  gold: "text-gold",
  teal: "text-teal",
  destructive: "text-destructive",
};

export default function RealitoAI() {
  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-teal">
            <Bot className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Realito AI</h1>
            <p className="text-sm text-muted-foreground">
              Oráculo cognitivo de Real del Monte — instancia Isabella/TAMV
            </p>
          </div>
        </div>
      </motion.div>

      {/* Architecture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="gradient-card rounded-xl border border-border p-6 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-ore" />
          <h3 className="text-sm font-semibold">Arquitectura Cognitiva</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <p className="text-xs font-mono text-muted-foreground">FRAMEWORK</p>
            <p className="mt-1 font-semibold">Isabella</p>
            <p className="text-xs text-muted-foreground">Motor cognitivo TAMV</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <p className="text-xs font-mono text-muted-foreground">INSTANCIA</p>
            <p className="mt-1 font-semibold text-teal">Realito AI</p>
            <p className="text-xs text-muted-foreground">Entrenada para RDM</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <p className="text-xs font-mono text-muted-foreground">RADARES</p>
            <p className="mt-1 font-semibold text-gold">Horus + Anubis</p>
            <p className="text-xs text-muted-foreground">Seguimientos y seguridad</p>
          </div>
        </div>
      </motion.div>

      {/* Capabilities grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={cn(
              "gradient-card rounded-xl border p-5 shadow-card transition-colors",
              variantBorder[cap.variant]
            )}
          >
            <cap.icon className={cn("h-6 w-6 mb-3", variantIcon[cap.variant])} />
            <h3 className="font-semibold">{cap.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Chat preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="gradient-card rounded-xl border border-glow-teal p-5 shadow-teal"
      >
        <p className="text-xs font-mono text-muted-foreground mb-3">REALITO AI — TERMINAL</p>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex gap-2">
            <span className="text-teal">▶</span>
            <span className="text-muted-foreground">¿Dónde conviene comer un paste ahora?</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gold">◆</span>
            <span>
              Basado en la energía de zona actual, te recomiendo <span className="text-gold">El Portal</span> (calle Hidalgo).
              Densidad de jugadores baja (32%), tiempo de espera estimado: 5 min.
              Bonus: recarga de energía +15 si minas en el nodo cercano antes de las 14:00.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

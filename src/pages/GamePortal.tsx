import { motion } from "framer-motion";
import { Pickaxe, Gem, Trophy, Zap, ShieldCheck, Crown } from "lucide-react";
import { mineralTypes, leaderboard, miningActivityData } from "@/data/mockData";
import { MiniChart } from "@/components/rdm/MiniChart";
import { cn } from "@/lib/utils";

const mineralColors: Record<string, string> = {
  silver: "text-silver",
  "gold-dim": "text-gold-dim",
  gold: "text-gold",
};

const rarityBg: Record<string, string> = {
  "Común": "bg-secondary",
  "Frecuente": "bg-gold-dim/10 border border-gold-dim/20",
  "Raro": "bg-silver/5 border border-silver/20",
  "Épico": "bg-gold/10 border border-gold/30 glow-gold",
};

export default function GamePortal() {
  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Veta Soberana</h1>
        <p className="text-sm text-muted-foreground">Gamificación territorial — Minería Digital de Real del Monte</p>
      </motion.div>

      {/* Mineral cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mineralTypes.map((mineral, i) => (
          <motion.div
            key={mineral.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn("rounded-xl p-5 text-center", rarityBg[mineral.rarity])}
          >
            <Gem className={cn("mx-auto h-8 w-8 mb-2", mineralColors[mineral.color] || "text-foreground")} />
            <h3 className="font-bold">{mineral.name}</h3>
            <p className="text-xs text-muted-foreground">{mineral.rarity}</p>
            <div className="mt-3 space-y-1 text-xs font-mono">
              <p>Spawn: {mineral.spawnRate}%</p>
              <p className="text-gold">Valor: {mineral.value} pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Power-ups */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-gold" /> Power-Ups
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⛏️</span>
                <div>
                  <p className="font-semibold">Pico Cornish</p>
                  <p className="text-xs text-muted-foreground">x2 velocidad de minería</p>
                </div>
              </div>
              <span className="font-mono font-bold text-gold">$100 MXN</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔧</span>
                <div>
                  <p className="font-semibold">Taladro Neumático</p>
                  <p className="text-xs text-muted-foreground">x4 potencia + minerales raros</p>
                </div>
              </div>
              <span className="font-mono font-bold text-gold">$200 MXN</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-glow-gold bg-gold/5 p-3">
              <Crown className="h-4 w-4 text-gold" />
              <div>
                <p className="text-sm font-semibold text-gold">Premium RDM</p>
                <p className="text-xs text-muted-foreground">Minería remota + bolsa de premios · $100 MXN/mes</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold" /> Ranking de Mineros
          </h3>
          <div className="space-y-2">
            {leaderboard.map((player) => (
              <div
                key={player.rank}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3",
                  player.rank === 1 ? "bg-gold/10 border border-gold/20" : "bg-secondary/50"
                )}
              >
                <span className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  player.rank === 1 ? "gradient-gold text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}>
                  {player.rank}
                </span>
                <span className="text-lg">{player.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{player.name}</p>
                  <p className="text-xs text-muted-foreground">Nivel {player.level}</p>
                </div>
                <span className="font-mono text-sm font-bold text-gold">{player.minerals.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mining activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="gradient-card rounded-xl border border-border p-5 shadow-card"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Actividad Minera en Tiempo Real</h3>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal" />
            <span className="text-xs text-muted-foreground font-mono">Antifraude activo</span>
          </div>
        </div>
        <MiniChart data={miningActivityData} color="hsl(25, 80%, 50%)" height={200} showAxis />
      </motion.div>
    </div>
  );
}

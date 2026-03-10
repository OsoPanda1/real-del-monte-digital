import { motion } from "framer-motion";
import { Pickaxe, Gem, Trophy, Zap, ShieldCheck, Crown, Sparkles, Star } from "lucide-react";
import { mineralTypes, leaderboard, miningActivityData } from "@/data/mockData";
import { MiniChart } from "@/components/rdm/MiniChart";
import { cn } from "@/lib/utils";

const mineralColors: Record<string, string> = {
  silver: "text-silver",
  "gold-dim": "text-gold-dim",
  gold: "text-gold",
};

const rarityGradients: Record<string, string> = {
  "Común": "from-secondary/50 to-secondary/20",
  "Frecuente": "from-gold-dim/15 to-gold-dim/5",
  "Raro": "from-electric/10 to-electric/5",
  "Épico": "from-gold/15 to-gold/5",
};

const rarityBorder: Record<string, string> = {
  "Común": "border-border",
  "Frecuente": "border-gold-dim/20",
  "Raro": "border-electric/25",
  "Épico": "border-gold/30",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function GamePortal() {
  return (
    <div className="space-y-8 p-8 max-w-[1400px]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Gamificación Territorial
        </p>
        <h1 className="text-4xl font-display font-bold tracking-tight">Veta Soberana</h1>
        <p className="text-sm font-body text-muted-foreground mt-1">Minería Digital geolocalizada de Real del Monte</p>
      </motion.div>

      {/* Mineral cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mineralTypes.map((mineral, i) => (
          <motion.div
            key={mineral.name}
            variants={item}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-6 text-center bg-gradient-to-b cursor-pointer transition-shadow duration-300",
              rarityGradients[mineral.rarity],
              rarityBorder[mineral.rarity],
              mineral.rarity === "Épico" && "glow-gold"
            )}
          >
            {mineral.rarity === "Épico" && (
              <Sparkles className="absolute top-3 right-3 h-4 w-4 text-gold/40 animate-pulse-gold" />
            )}
            <div className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-4",
              mineral.rarity === "Épico" ? "bg-gold/15" : "bg-secondary/40"
            )}>
              <Gem className={cn("h-8 w-8", mineralColors[mineral.color] || "text-foreground")} />
            </div>
            <h3 className="text-xl font-display font-bold">{mineral.name}</h3>
            <p className="text-[11px] font-body text-muted-foreground mt-1">{mineral.rarity}</p>
            <div className="mt-4 space-y-1.5 text-[11px] font-mono">
              <p className="text-muted-foreground">Spawn: {mineral.spawnRate}%</p>
              <p className="text-gold font-semibold">Valor: {mineral.value} pts</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Power-ups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="mb-5 font-display text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-gold" /> Power-Ups
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-5 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-copper/10">
                  <span className="text-2xl">⛏️</span>
                </div>
                <div>
                  <p className="font-body font-semibold">Pico Cornish</p>
                  <p className="text-[11px] font-body text-muted-foreground">x2 velocidad de minería</p>
                </div>
              </div>
              <span className="font-mono font-bold text-gold text-lg">$100</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-5 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <p className="font-body font-semibold">Taladro Neumático</p>
                  <p className="text-[11px] font-body text-muted-foreground">x4 potencia + minerales raros</p>
                </div>
              </div>
              <span className="font-mono font-bold text-gold text-lg">$200</span>
            </div>
            <div className="mt-4 glass-gold rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-gold" />
                <div>
                  <p className="font-display text-lg font-bold text-gradient-gold">Premium RDM</p>
                  <p className="text-[11px] font-body text-muted-foreground">Minería remota + bolsa de premios · $100 MXN/mes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="mb-5 font-display text-xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" /> Ranking de Mineros
          </h3>
          <div className="space-y-2.5">
            {leaderboard.map((player) => (
              <motion.div
                key={player.rank}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-5 py-4 transition-colors",
                  player.rank === 1 ? "glass-gold" : "bg-secondary/20 hover:bg-secondary/30"
                )}
              >
                <span className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold font-mono",
                  player.rank === 1 ? "gradient-gold text-primary-foreground shadow-gold" :
                  player.rank <= 3 ? "bg-secondary text-gold" : "bg-secondary text-muted-foreground"
                )}>
                  {player.rank}
                </span>
                <span className="text-xl">{player.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-body font-semibold">{player.name}</p>
                  <p className="text-[10px] font-body text-muted-foreground">Nivel {player.level}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-gold">{player.minerals.toLocaleString()}</span>
                  <p className="text-[9px] font-mono text-muted-foreground">minerales</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mining activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-display font-bold">Actividad Minera en Tiempo Real</h3>
          <div className="flex items-center gap-2.5 glass-teal rounded-xl px-4 py-2">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" />
            <span className="text-[10px] font-mono text-teal font-semibold tracking-wider">ANTIFRAUDE ACTIVO</span>
          </div>
        </div>
        <MiniChart data={miningActivityData} color="hsl(25, 80%, 50%)" height={200} showAxis />
      </motion.div>
    </div>
  );
}

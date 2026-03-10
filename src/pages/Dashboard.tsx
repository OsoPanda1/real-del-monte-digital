import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  Pickaxe,
  TrendingUp,
  Hotel,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { KpiCard } from "@/components/rdm/KpiCard";
import { MiniChart } from "@/components/rdm/MiniChart";
import {
  revenueData,
  occupancyData,
  miningActivityData,
  energyNodesData,
  zoneHeatmap,
  sovereigntyMetrics,
} from "@/data/mockData";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <div className="space-y-8 p-8 max-w-[1400px]">
      {/* Header */}
      <motion.div {...fadeUp} className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
            Instrumento de Mando
          </p>
          <h1 className="text-4xl font-display font-bold tracking-tight">Dashboard CEO</h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Real del Monte — Métricas territoriales en tiempo real
          </p>
        </div>
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2.5 glass-gold rounded-xl px-4 py-2.5"
        >
          <Activity className="h-3.5 w-3.5 text-emerald" />
          <span className="text-[11px] font-mono font-semibold text-gold tracking-wider">EN VIVO</span>
        </motion.div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Ingreso Territorial"
          value="$284,000"
          change="+12.4% vs mes anterior"
          changeType="positive"
          icon={DollarSign}
          variant="gold"
        />
        <KpiCard
          title="Jugadores Activos"
          value="2,340"
          change="+340 esta semana"
          changeType="positive"
          icon={Users}
          variant="electric"
        />
        <KpiCard
          title="Minerales Extraídos"
          value="18,920"
          change="Hoy: 1,240"
          changeType="neutral"
          icon={Pickaxe}
          variant="copper"
        />
        <KpiCard
          title="Retención Local"
          value="73%"
          change="+5pp vs trimestre"
          changeType="positive"
          icon={Shield}
          variant="teal"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-bold">Flujo Económico</h3>
              <p className="text-[11px] font-body text-muted-foreground mt-1">Ingreso mensual por suscripciones B2B + gamificación</p>
            </div>
            <div className="rounded-xl bg-gold/10 p-2.5">
              <DollarSign className="h-4 w-4 text-gold" />
            </div>
          </div>
          <MiniChart data={revenueData} color="hsl(43, 80%, 55%)" height={220} showAxis />
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-display font-bold">Ocupación Hotelera</h3>
              <p className="text-[11px] font-body text-muted-foreground mt-1">Reservas directas RDM (no OTAs)</p>
            </div>
            <div className="rounded-xl bg-teal/10 p-2.5">
              <Hotel className="h-4 w-4 text-teal" />
            </div>
          </div>
          <MiniChart data={occupancyData} color="hsl(174, 62%, 47%)" height={220} showAxis />
        </motion.div>
      </div>

      {/* Second row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-display font-bold">Actividad Minera</h3>
            <div className="rounded-xl bg-copper/10 p-2.5">
              <Pickaxe className="h-4 w-4 text-copper" />
            </div>
          </div>
          <MiniChart data={miningActivityData} color="hsl(25, 80%, 50%)" height={180} showAxis />
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-display font-bold">Nodos de Energía</h3>
            <div className="rounded-xl bg-gold/10 p-2.5">
              <Zap className="h-4 w-4 text-gold" />
            </div>
          </div>
          <div className="space-y-3">
            {energyNodesData.map((node) => (
              <div key={node.name} className="flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors">
                <div>
                  <p className="text-[13px] font-body font-semibold">{node.name}</p>
                  <p className="text-[10px] font-body text-muted-foreground">{node.type} · {node.recharges} recargas</p>
                </div>
                <p className="text-sm font-mono font-bold text-gold">${node.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="glass rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-display font-bold">Densidad por Zona</h3>
            <div className="rounded-xl bg-electric/10 p-2.5">
              <TrendingUp className="h-4 w-4 text-electric" />
            </div>
          </div>
          <div className="space-y-4">
            {zoneHeatmap.map((zone) => (
              <div key={zone.zone} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-body font-semibold">{zone.zone}</span>
                  <span className="flex items-center gap-1.5 font-mono text-xs font-medium">
                    {zone.density}%
                    {zone.trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald" />}
                    {zone.trend === "down" && <ArrowDownRight className="h-3 w-3 text-destructive" />}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.density}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-1.5 rounded-full"
                    style={{
                      background: zone.density > 70
                        ? "linear-gradient(90deg, hsl(43, 80%, 55%), hsl(35, 75%, 45%))"
                        : zone.density > 40
                        ? "linear-gradient(90deg, hsl(210, 100%, 55%), hsl(230, 80%, 55%))"
                        : "hsl(222, 15%, 30%)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sovereignty bar */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.7 }}
        className="relative glass-gold rounded-3xl p-8 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(43 80% 55%), transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-4 w-4 text-gold" />
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gold/80">
              Indicadores de Soberanía Territorial
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-display font-bold text-gradient-gold">{sovereigntyMetrics.localRetention}%</p>
              <p className="text-[11px] font-body text-muted-foreground mt-2">Flujo retenido localmente</p>
              <div className="mx-auto mt-3 h-1.5 w-40 rounded-full bg-secondary/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sovereigntyMetrics.localRetention}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-1.5 rounded-full gradient-gold"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-5xl font-display font-bold text-electric">{sovereigntyMetrics.activeBusinesses}</p>
              <p className="text-[11px] font-body text-muted-foreground mt-2">Comercios activos en RDM</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-display font-bold">{sovereigntyMetrics.circularEconomyIndex}</p>
              <p className="text-[11px] font-body text-muted-foreground mt-2">Índice de economía circular</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

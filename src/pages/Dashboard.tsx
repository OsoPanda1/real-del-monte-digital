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
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Dashboard CEO</h1>
          <p className="text-sm text-muted-foreground">
            Instrumento de Mando Territorial — Real del Monte
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
          <span className="h-2 w-2 animate-pulse-gold rounded-full bg-emerald" />
          <span className="text-xs font-mono text-muted-foreground">EN VIVO</span>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          variant="teal"
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
          variant="gold"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Flujo Económico</h3>
              <p className="text-xs text-muted-foreground">Ingreso mensual por suscripciones B2B + gamificación</p>
            </div>
            <DollarSign className="h-4 w-4 text-gold" />
          </div>
          <MiniChart data={revenueData} color="hsl(43, 96%, 56%)" height={220} showAxis />
        </motion.div>

        {/* Occupancy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Ocupación Hotelera</h3>
              <p className="text-xs text-muted-foreground">Reservas directas RDM (no OTAs)</p>
            </div>
            <Hotel className="h-4 w-4 text-teal" />
          </div>
          <MiniChart data={occupancyData} color="hsl(174, 62%, 47%)" height={220} showAxis />
        </motion.div>
      </div>

      {/* Second row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Mining Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Actividad Minera (Hoy)</h3>
            <Pickaxe className="h-4 w-4 text-copper" />
          </div>
          <MiniChart data={miningActivityData} color="hsl(25, 80%, 50%)" height={180} showAxis />
        </motion.div>

        {/* Energy Nodes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Nodos de Energía</h3>
            <Zap className="h-4 w-4 text-gold" />
          </div>
          <div className="space-y-3">
            {energyNodesData.map((node) => (
              <div key={node.name} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                <div>
                  <p className="text-xs font-medium">{node.name}</p>
                  <p className="text-[10px] text-muted-foreground">{node.type} · {node.recharges} recargas</p>
                </div>
                <p className="text-sm font-mono font-semibold text-gold">${node.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Zone Heatmap */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="gradient-card rounded-xl border border-border p-5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Densidad por Zona</h3>
            <TrendingUp className="h-4 w-4 text-teal" />
          </div>
          <div className="space-y-3">
            {zoneHeatmap.map((zone) => (
              <div key={zone.zone} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{zone.zone}</span>
                  <span className="flex items-center gap-1 font-mono">
                    {zone.density}%
                    {zone.trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald" />}
                    {zone.trend === "down" && <ArrowDownRight className="h-3 w-3 text-destructive" />}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${zone.density}%`,
                      background: zone.density > 70
                        ? "hsl(43, 96%, 56%)"
                        : zone.density > 40
                        ? "hsl(174, 62%, 47%)"
                        : "hsl(220, 15%, 40%)",
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="gradient-card rounded-xl border border-glow-gold p-5 shadow-gold"
      >
        <h3 className="mb-4 text-sm font-semibold text-gold">
          Indicadores de Soberanía Territorial
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-gold">{sovereigntyMetrics.localRetention}%</p>
            <p className="text-xs text-muted-foreground">Flujo retenido localmente</p>
            <div className="mx-auto mt-2 h-2 w-32 rounded-full bg-secondary">
              <div className="h-2 rounded-full gradient-gold" style={{ width: `${sovereigntyMetrics.localRetention}%` }} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-teal">{sovereigntyMetrics.activeBusinesses}</p>
            <p className="text-xs text-muted-foreground">Comercios activos en RDM</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{sovereigntyMetrics.circularEconomyIndex}</p>
            <p className="text-xs text-muted-foreground">Índice de economía circular</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Mountain, Pickaxe, Store, Bot, LayoutDashboard, Shield, ArrowRight, Gem, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 p-6 pb-20">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center pt-12"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-gold glow-gold"
        >
          <Mountain className="h-10 w-10 text-primary-foreground" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          RDM <span className="text-gold">DIGITAL</span>
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Sistema Operativo de Pueblo Mágico — Real del Monte.
          Turismo, economía local y experiencia inmersiva en un único gemelo digital vivo.
        </p>
        <p className="mt-2 text-xs font-mono text-muted-foreground">
          Instancia soberana sobre <span className="text-gold">TAMV MD-X5</span>
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={() => navigate("/dashboard")} size="lg">
            Dashboard CEO <LayoutDashboard className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate("/game")} variant="outline" size="lg">
            Veta Soberana <Pickaxe className="h-4 w-4" />
          </Button>
        </div>
      </motion.section>

      {/* Modules */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        {[
          {
            icon: LayoutDashboard,
            title: "Dashboard CEO",
            desc: "Instrumento de mando territorial con métricas en tiempo real",
            path: "/dashboard",
            color: "text-gold",
          },
          {
            icon: Pickaxe,
            title: "Veta Soberana",
            desc: "Gamificación minera geolocalizada con minerales y power-ups",
            path: "/game",
            color: "text-copper",
          },
          {
            icon: Store,
            title: "Portal B2B",
            desc: "Federación comercial con suscripciones por sector",
            path: "/b2b",
            color: "text-teal",
          },
          {
            icon: Bot,
            title: "Realito AI",
            desc: "Oráculo cognitivo con sugerencias predictivas territoriales",
            path: "/realito",
            color: "text-ore",
          },
        ].map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => navigate(mod.path)}
            className="gradient-card cursor-pointer rounded-xl border border-border p-5 shadow-card hover:border-gold/30 transition-all group"
          >
            <mod.icon className={`h-6 w-6 mb-3 ${mod.color}`} />
            <h3 className="font-semibold">{mod.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{mod.desc}</p>
            <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
          </motion.div>
        ))}
      </section>

      {/* Architecture */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-3xl mx-auto"
      >
        <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            Arquitectura Soberana
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            RDM DIGITAL es una instancia soberana de TAMV MD-X5, con gobierno, datos y lógica económica propios del territorio.
            Infraestructura antifrágil con contenedores endurecidos, red aislada y volumen dedicado.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <Gem className="mx-auto h-4 w-4 text-gold mb-1" />
              <p className="text-xs font-semibold">Economía Propia</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <Zap className="mx-auto h-4 w-4 text-teal mb-1" />
              <p className="text-xs font-semibold">DAO Local</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <Bot className="mx-auto h-4 w-4 text-ore mb-1" />
              <p className="text-xs font-semibold">IA Territorial</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

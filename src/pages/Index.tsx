import { motion } from "framer-motion";
import { Mountain, Pickaxe, Store, Bot, LayoutDashboard, Shield, ArrowRight, Gem, Zap, ChevronRight, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="pb-24">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center text-center px-6 pt-20 pb-16"
      >
        {/* Decorative elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(43 80% 55% / 0.15), transparent 70%)' }} />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl gradient-gold glow-gold">
            <Mountain className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg gradient-electric glow-electric" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Sistema Operativo de Pueblo Mágico
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[0.9]">
            RDM <span className="text-gradient-gold">DIGITAL</span>
          </h1>
          <p className="mt-6 max-w-lg text-base font-body text-muted-foreground leading-relaxed mx-auto">
            Turismo, economía local y experiencia inmersiva en un único gemelo digital vivo para Real del Monte.
          </p>
          <p className="mt-3 text-[10px] font-mono text-muted-foreground/60 tracking-wider">
            Instancia soberana sobre <span className="text-gold">TAMV MD-X5</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Button onClick={() => navigate("/dashboard")} size="lg" className="rounded-xl px-8 h-12 text-sm font-semibold shadow-gold">
            Dashboard CEO <LayoutDashboard className="h-4 w-4 ml-1" />
          </Button>
          <Button onClick={() => navigate("/game")} variant="outline" size="lg" className="rounded-xl px-8 h-12 text-sm font-semibold border-gold/20 hover:border-gold/40 hover:bg-gold/5">
            Veta Soberana <Pickaxe className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </motion.section>

      {/* Divider */}
      <div className="divider-gold mx-auto max-w-4xl" />

      {/* Modules */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto px-6 py-16"
      >
        {[
          {
            icon: LayoutDashboard,
            title: "Dashboard CEO",
            desc: "Instrumento de mando territorial con métricas en tiempo real y soberanía económica",
            path: "/dashboard",
            accent: "gold",
          },
          {
            icon: Pickaxe,
            title: "Veta Soberana",
            desc: "Gamificación minera geolocalizada con minerales, power-ups y economía circular",
            path: "/game",
            accent: "copper",
          },
          {
            icon: Store,
            title: "Portal B2B",
            desc: "Federación comercial con suscripciones sectoriales y gobernanza DAO local",
            path: "/b2b",
            accent: "teal",
          },
          {
            icon: Bot,
            title: "Realito AI",
            desc: "Oráculo cognitivo con sugerencias predictivas y regulación económica dinámica",
            path: "/realito",
            accent: "electric",
          },
        ].map((mod) => (
          <motion.div
            key={mod.title}
            variants={item}
            onClick={() => navigate(mod.path)}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`group relative cursor-pointer rounded-2xl glass p-6 transition-all duration-300 hover:border-${mod.accent}/30`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-5 bg-${mod.accent}/10`}>
              <mod.icon className={`h-6 w-6 text-${mod.accent}`} />
            </div>
            <h3 className="text-xl font-display font-bold">{mod.title}</h3>
            <p className="mt-2 text-[13px] font-body text-muted-foreground leading-relaxed">{mod.desc}</p>
            <div className="mt-5 flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-gold transition-colors">
              Explorar <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Architecture */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="relative glass-gold rounded-3xl p-8 md:p-10 overflow-hidden">
          {/* Ambient background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(43 80% 55%), transparent 70%)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-gold" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold/70">Infraestructura</p>
            </div>
            <h2 className="text-3xl font-display font-bold">Arquitectura Soberana</h2>
            <p className="mt-3 text-sm font-body text-muted-foreground leading-relaxed max-w-2xl">
              RDM DIGITAL es una instancia soberana de TAMV MD-X5, con gobierno, datos y lógica económica propios del territorio. Infraestructura antifrágil con contenedores endurecidos, red aislada y volumen dedicado.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Gem, label: "Economía Propia", desc: "Liquidación local", color: "text-gold" },
                { icon: Zap, label: "DAO Local", desc: "Gobernanza autónoma", color: "text-electric" },
                { icon: Bot, label: "IA Territorial", desc: "Realito AI", color: "text-teal" },
              ].map((feat) => (
                <div key={feat.label} className="glass rounded-2xl p-4 text-center group hover:border-gold/20 transition-colors">
                  <feat.icon className={`mx-auto h-5 w-5 mb-2 ${feat.color}`} />
                  <p className="text-sm font-display font-bold">{feat.label}</p>
                  <p className="text-[10px] font-body text-muted-foreground mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

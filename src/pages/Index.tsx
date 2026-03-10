import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Mountain, Pickaxe, Store, Bot, LayoutDashboard, Shield, ChevronRight, Gem, Zap, ArrowDown, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import heroImg from "@/assets/hero-rdm.jpg";
import mineImg from "@/assets/mine-tunnel.jpg";
import rdmLogo from "@/assets/rdm-logo.png";
import pasteriasImg from "@/assets/pasterias.png";
import likesImg from "@/assets/likes.png";
import sanitariosImg from "@/assets/sanitarios.png";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

function GoldDust({ count = 30 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 4,
    size: Math.random() * 2 + 1,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30"
          style={{ left: `${p.x}%`, width: p.size, height: p.size }}
          animate={{ y: ["100vh", "-20px"], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <div className="relative">
      {/* ═══════════════ HERO — Full viewport cinematic ═══════════════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden -m-8 mb-0">
        {/* Parallax background image */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, hsl(222 50% 3% / 0.3) 0%, hsl(222 50% 3% / 0.6) 50%, hsl(222 50% 3% / 0.95) 85%, hsl(222 50% 3%) 100%)"
          }} />
        </motion.div>

        <GoldDust count={40} />

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl">
          <motion.img
            src={rdmLogo}
            alt="RDM Digital"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-32 h-32 md:w-44 md:h-44 mx-auto mb-6 drop-shadow-2xl"
          />

          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 0.7, letterSpacing: "0.35em" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[10px] md:text-xs font-mono uppercase text-gold/70 mb-4"
          >
            Sistema Operativo de Pueblo Mágico
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight leading-[0.85]"
          >
            <span className="text-gradient-gold">RDM</span>{" "}
            <span className="text-foreground">DIGITAL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl font-display italic text-foreground/70 max-w-xl mx-auto leading-relaxed"
          >
            Turismo, economía local y experiencia inmersiva en un único gemelo digital vivo
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="rounded-2xl px-10 h-14 text-sm font-semibold shadow-gold bg-gold text-primary-foreground hover:bg-gold-light relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explorar Dashboard <LayoutDashboard className="h-4 w-4" />
              </span>
            </Button>
            <Button
              onClick={() => navigate("/game")}
              variant="outline"
              size="lg"
              className="rounded-2xl px-10 h-14 text-sm font-semibold border-gold/20 hover:border-gold/40 hover:bg-gold/5 backdrop-blur-sm"
            >
              Veta Soberana <Pickaxe className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground">Descubre</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="h-4 w-4 text-gold/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════ REALITO SHOWCASE — Character panels ═══════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 30%, hsl(210 100% 55% / 0.04), transparent)"
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-electric/70 mb-3">Innovación Turística Inteligente</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Conoce a <span className="text-gradient-electric">Realito</span>
          </h2>
          <p className="mt-4 text-muted-foreground font-body leading-relaxed">
            Tu guía IA de Real del Monte. Te ayuda a encontrar los mejores pastes, navegar la historia minera y descubrir experiencias únicas.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { img: pasteriasImg, title: "Guía Gastronómica", desc: "Encuentra los mejores pastes y platillos con recomendaciones en tiempo real", accent: "gold" },
            { img: sanitariosImg, title: "Asistente Turístico", desc: "Información útil del pueblo: servicios, horarios, rutas y puntos de interés", accent: "electric" },
            { img: likesImg, title: "Reseñas Inteligentes", desc: "Sistema de valoraciones potenciado por IA con insights de la comunidad", accent: "teal" },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group glass rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </div>
              <div className="p-6 -mt-8 relative z-10">
                <h3 className="text-xl font-display font-bold">{card.title}</h3>
                <p className="mt-2 text-[13px] font-body text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ MINE TUNNEL PARALLAX — Immersive divider ═══════════════ */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={mineImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, hsl(222 50% 3% / 0.6), hsl(222 50% 3% / 0.8) 50%, hsl(222 50% 3% / 0.95))"
          }} />
        </motion.div>
        <GoldDust count={20} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-6"
        >
          <Gem className="mx-auto h-8 w-8 text-gold mb-4" />
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight max-w-2xl">
            Donde la <span className="text-gradient-gold">historia minera</span> se convierte en
            <span className="text-electric"> innovación digital</span>
          </h2>
        </motion.div>
      </section>

      {/* ═══════════════ MODULES GRID ═══════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/60 mb-3">Ecosistema Completo</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Módulos de <span className="text-gradient-gold">RDM Digital</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
        >
          {[
            {
              icon: LayoutDashboard,
              title: "Dashboard CEO",
              desc: "Instrumento de mando territorial con métricas en tiempo real y soberanía económica medible",
              path: "/dashboard",
              accent: "gold",
              gradient: "from-gold/10 to-gold/0",
            },
            {
              icon: Pickaxe,
              title: "Veta Soberana",
              desc: "Gamificación minera geolocalizada con minerales, power-ups y economía circular real",
              path: "/game",
              accent: "copper",
              gradient: "from-copper/10 to-copper/0",
            },
            {
              icon: Store,
              title: "Portal B2B",
              desc: "Federación comercial con suscripciones sectoriales y gobernanza DAO local autónoma",
              path: "/b2b",
              accent: "teal",
              gradient: "from-teal/10 to-teal/0",
            },
            {
              icon: Bot,
              title: "Realito AI",
              desc: "Oráculo cognitivo con sugerencias predictivas y regulación económica dinámica territorial",
              path: "/realito",
              accent: "electric",
              gradient: "from-electric/10 to-electric/0",
            },
          ].map((mod) => (
            <motion.div
              key={mod.title}
              variants={item}
              onClick={() => navigate(mod.path)}
              whileHover={{ y: -10, transition: { duration: 0.25 } }}
              className={`group relative cursor-pointer rounded-3xl glass p-7 transition-all duration-300 hover:shadow-elevated bg-gradient-to-b ${mod.gradient}`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-6 bg-${mod.accent}/10 ring-1 ring-${mod.accent}/10`}>
                <mod.icon className={`h-7 w-7 text-${mod.accent}`} />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight">{mod.title}</h3>
              <p className="mt-3 text-[13px] font-body text-muted-foreground leading-relaxed">{mod.desc}</p>
              <div className={`mt-6 flex items-center gap-1.5 text-xs font-mono font-medium text-muted-foreground group-hover:text-${mod.accent} transition-colors duration-300`}>
                <span>Explorar</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                style={{ boxShadow: `inset 0 1px 0 0 hsl(var(--${mod.accent}) / 0.1)` }} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════ ARCHITECTURE — Premium section ═══════════════ */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative glass-gold rounded-[2rem] p-10 md:p-14 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, hsl(43 80% 55%), transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
              style={{ background: "radial-gradient(circle, hsl(210 100% 55%), transparent 70%)" }} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-gold" />
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/70">Infraestructura</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Arquitectura Soberana</h2>
              <p className="mt-4 text-base font-body text-muted-foreground leading-relaxed max-w-2xl">
                RDM DIGITAL es una instancia soberana de TAMV MD-X5, con gobierno, datos y lógica
                económica propios del territorio. Infraestructura antifrágil con contenedores endurecidos,
                red aislada y volumen dedicado.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-5">
                {[
                  { icon: Gem, label: "Economía Propia", desc: "Liquidación local soberana", color: "text-gold", bg: "bg-gold/10" },
                  { icon: Zap, label: "DAO Local", desc: "Gobernanza autónoma territorial", color: "text-electric", bg: "bg-electric/10" },
                  { icon: Bot, label: "IA Territorial", desc: "Realito AI cognitivo", color: "text-teal", bg: "bg-teal/10" },
                ].map((feat) => (
                  <motion.div
                    key={feat.label}
                    whileHover={{ y: -4 }}
                    className="glass rounded-2xl p-5 text-center group hover:border-gold/15 transition-all duration-300"
                  >
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${feat.bg}`}>
                      <feat.icon className={`h-6 w-6 ${feat.color}`} />
                    </div>
                    <p className="text-base font-display font-bold">{feat.label}</p>
                    <p className="text-[11px] font-body text-muted-foreground mt-1">{feat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ FOOTER TAGLINE ═══════════════ */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 80%, hsl(43 80% 55% / 0.04), transparent)"
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50 mb-4">Real del Monte, Hidalgo</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight max-w-xl mx-auto">
            El futuro de los <span className="text-gradient-gold">Pueblos Mágicos</span> empieza aquí
          </h2>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
          <p className="mt-6 text-xs font-mono text-muted-foreground/40 tracking-wider">
            TAMV MD-X5 · Instancia Soberana · v1.0
          </p>
        </motion.div>
      </section>
    </div>
  );
}

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Mountain, Pickaxe, Store, Bot, LayoutDashboard, Shield, ChevronRight, ChevronDown, Gem, Zap, ArrowDown, Sparkles, MapPin, Compass, Utensils, Users, Star, Calendar, Crown, Navigation, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FloatingParticles, FogLayer, TextReveal, StaggerContainer, StaggerItem, GlowCard, MagneticButton, GradientSeparator, MeshGradient } from "@/components/rdm/VisualEffects";
import ExperienceGrid from "@/components/rdm/ExperienceGrid";
import EditorialSection from "@/components/rdm/EditorialSection";
import HomeSections from "@/components/rdm/HomeSections";

import heroImg from "@/assets/hero-aerial.jpg";
import mineImg from "@/assets/mine-tunnel.jpg";
import mineEntrance from "@/assets/mine-entrance.jpg";
import pastesImg from "@/assets/pastes-food.jpg";
import rdmLogo from "@/assets/rdm-logo.png";
import pasteriasImg from "@/assets/pasterias.png";
import likesImg from "@/assets/likes.png";
import sanitariosImg from "@/assets/sanitarios.png";

const slides = [
  { title: "Real del Monte", subtitle: "Pueblo Mágico entre niebla y plata" },
  { title: "Mineral del Monte", subtitle: "Hidalgo · México · 2,700 msnm" },
  { title: "Cuna del Paste", subtitle: "Tradición Cornish desde el siglo XIX" },
  { title: "RDM Digital 2026", subtitle: "Innovación Turística Inteligente" },
];

const stats = [
  { value: "500+", label: "Años de historia" },
  { value: "2,700m", label: "Altitud" },
  { value: "14°C", label: "Temperatura media" },
];

export default function Index() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <FloatingParticles />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <div className="absolute inset-0 ken-burns">
            <img src={heroImg} alt="Vista aérea de Real del Monte" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 20%, hsl(43 80% 55% / 0.12), transparent 50%)" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: `linear-gradient(rgba(212,178,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,178,106,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </motion.div>

        <FogLayer />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-12">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
            {/* Left */}
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-border/30 bg-secondary/20 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_hsl(43_80%_55%/0.9)]" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                  Pueblo Mágico · Hidalgo, México
                </span>
              </div>

              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-tight">
                      Descubre la{" "}
                      <span className="block text-gradient-gold mt-2">
                        magia que vive
                      </span>
                      <span className="block mt-1">en la sierra</span>
                    </h1>
                    <p className="mt-5 text-base font-body text-muted-foreground max-w-lg leading-relaxed">
                      {slides[currentSlide].subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <p className="max-w-xl text-sm font-body text-muted-foreground leading-relaxed">
                A 2,700 metros sobre el nivel del mar, donde la historia minera británica
                se fusiona con la calidez mexicana. Una experiencia que no existe en
                ningún otro lugar del mundo.
              </p>

              <div className="flex flex-wrap gap-4">
                <MagneticButton onClick={() => navigate("/lugares")} className="btn-premium">
                  <span className="flex items-center gap-2">
                    Explorar Experiencias <Compass className="h-4 w-4" />
                  </span>
                </MagneticButton>
                <MagneticButton onClick={() => navigate("/historia")} className="btn-glass">
                  <span className="flex items-center gap-2">
                    Nuestra Historia <Pickaxe className="h-4 w-4" />
                  </span>
                </MagneticButton>
              </div>

              <div className="flex gap-8 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-2xl font-display text-gradient-gold font-bold">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Visual panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/20 glass-card shadow-elevated">
                <div className="absolute inset-0" style={{
                  background: "radial-gradient(circle at 20% 0, hsl(43 80% 55% / 0.2), transparent 55%), radial-gradient(circle at 120% 120%, hsl(220 15% 65% / 0.15), transparent 60%)"
                }} />
                <div className="absolute inset-0 mix-blend-overlay opacity-50">
                  <img src={heroImg} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-2xl border border-border/20 glass p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
                        <MapPin className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-body font-medium">Mineral del Monte</p>
                        <p className="text-[11px] font-body text-muted-foreground">Hidalgo, México</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-gold/25" />
                <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-gold/25" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-gold/25" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-gold/25" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 z-20"
              >
                <img src={rdmLogo} alt="RDM" className="w-24 h-24 drop-shadow-2xl" />
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-24 left-6 lg:left-12 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-gold' : 'w-4 bg-muted-foreground/30'}`} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground">Descubre</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4 text-gold/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ EXPERIENCE GRID ═══ */}
      <ExperienceGrid />

      <div className="max-w-4xl mx-auto px-6"><GradientSeparator /></div>

      {/* ═══ EDITORIAL: HISTORIA ═══ */}
      <EditorialSection
        id="historia-preview"
        chapter="Capítulo I · Orígenes"
        title="La Plata que Forjó un Imperio"
        subtitle="Donde cada piedra cuenta una historia de 500 años"
        body={[
          "En 1560, las entrañas de la sierra revelaron su secreto: vetas de plata que transformarían un continente. Los mineros cornish llegaron en 1824, trayendo tecnología, fútbol y los famosos pastes.",
          "Hoy, los túneles de Real del Monte son testigos silenciosos de una época dorada que dio forma a la identidad de todo un pueblo mágico.",
        ]}
        image={mineEntrance}
        imageAlt="Entrada a mina colonial"
        accentColor="gold"
      />

      {/* ═══ MINE TUNNEL PARALLAX ═══ */}
      <section className="relative h-[65vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 ken-burns">
          <img src={mineImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, hsl(222 50% 3% / 0.5), hsl(222 50% 3% / 0.75) 50%, hsl(222 50% 3% / 0.95))"
        }} />
        <div className="dust-particles" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <Gem className="mx-auto h-8 w-8 text-gold mb-5 animate-pulse-glow" />
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight">
            Donde la <span className="text-gradient-gold">historia minera</span> se convierte en
            <span className="text-gradient-electric"> innovación digital</span>
          </h2>
          <p className="mt-6 text-sm font-body text-muted-foreground max-w-lg mx-auto">
            460 años de historia, plata, oro y tradición cornish. Todo vive ahora en tu bolsillo.
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><GradientSeparator /></div>

      {/* ═══ EDITORIAL: GASTRONOMÍA ═══ */}
      <EditorialSection
        id="gastro-preview"
        chapter="Capítulo II · Sabor"
        title="El Paste: Herencia Viva"
        subtitle="De Cornualles a las calles de Real del Monte"
        body={[
          "Los mineros cornish trajeron una receta sencilla: masa doblada rellena de papa, carne y cebolla. Lo que no sabían es que estaban sembrando la semilla de una tradición que definiría un pueblo.",
          "Hoy, Real del Monte es la Capital Mundial del Paste. Cada bocado es un puente entre dos culturas separadas por un océano.",
        ]}
        image={pastesImg}
        imageAlt="Pastes tradicionales"
        imagePosition="right"
        accentColor="copper"
      />

      <div className="max-w-4xl mx-auto px-6"><GradientSeparator /></div>

      {/* ═══ REALITO SHOWCASE ═══ */}
      <section className="py-28 px-6 lg:px-12 relative overflow-hidden">
        <MeshGradient />
        <div className="max-w-6xl mx-auto relative z-10">
          <TextReveal className="text-center mb-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-electric/70 mb-3">Innovación Turística Inteligente</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              Conoce a <span className="text-gradient-electric">Realito</span>
            </h2>
            <p className="mt-5 text-muted-foreground font-body leading-relaxed max-w-xl mx-auto">
              Tu guía IA de Real del Monte. Te ayuda a encontrar los mejores pastes, navegar la historia minera y descubrir experiencias únicas.
            </p>
          </TextReveal>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            {[
              { img: pasteriasImg, title: "Guía Gastronómica", desc: "Encuentra los mejores pastes y platillos con recomendaciones inteligentes en tiempo real" },
              { img: sanitariosImg, title: "Asistente Turístico", desc: "Información útil del pueblo: servicios, horarios, rutas y puntos de interés cultural" },
              { img: likesImg, title: "Reseñas Inteligentes", desc: "Sistema de valoraciones potenciado por IA con insights auténticos de la comunidad" },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <GlowCard>
                  <div className="group glass-card rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-elevated">
                    <div className="relative h-52 overflow-hidden img-zoom">
                      <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-card" />
                    </div>
                    <div className="p-7 -mt-10 relative z-10">
                      <h3 className="text-2xl font-display font-bold">{card.title}</h3>
                      <p className="mt-3 text-[13px] font-body text-muted-foreground leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6"><GradientSeparator /></div>

      {/* ═══ MODULES ═══ */}
      <section className="py-28 px-6 lg:px-12 relative">
        <MeshGradient />
        <div className="max-w-6xl mx-auto relative z-10">
          <TextReveal className="text-center mb-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/60 mb-3">Ecosistema Completo</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              Módulos de <span className="text-gradient-gold">RDM Digital</span>
            </h2>
          </TextReveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: LayoutDashboard, title: "Dashboard CEO", desc: "Instrumento de mando territorial con métricas en tiempo real", path: "/dashboard", accent: "gold" },
              { icon: Pickaxe, title: "Veta Soberana", desc: "Gamificación minera geolocalizada con economía circular", path: "/game", accent: "copper" },
              { icon: Store, title: "Portal B2B", desc: "Federación comercial con suscripciones sectoriales", path: "/b2b", accent: "teal" },
              { icon: Bot, title: "Realito AI", desc: "Oráculo cognitivo con sugerencias predictivas territoriales", path: "/realito", accent: "electric" },
            ].map((mod) => (
              <StaggerItem key={mod.title}>
                <GlowCard>
                  <motion.div
                    onClick={() => navigate(mod.path)}
                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    className="group cursor-pointer rounded-3xl glass-card p-8 transition-all duration-300 hover:shadow-elevated h-full"
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
                  </motion.div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══ NEW DYNAMIC SECTIONS: Map preview · Eventos · Comercios · Recorridos · Premium ═══ */}
      <HomeSections />

      {/* ═══ ARCHITECTURE ═══ */}
      <section className="py-24 px-6 lg:px-12">
        <TextReveal>
          <div className="max-w-5xl mx-auto relative glass-gold rounded-[2rem] p-10 md:p-14 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, hsl(43 80% 55%), transparent 70%)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-gold" />
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/70">Infraestructura</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Arquitectura Soberana</h2>
              <p className="mt-4 text-base font-body text-muted-foreground leading-relaxed max-w-2xl">
                RDM DIGITAL es una instancia soberana de TAMV MD-X5, con gobierno, datos y lógica
                económica propios del territorio. Infraestructura antifrágil con contenedores endurecidos.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-5">
                {[
                  { icon: Gem, label: "Economía Propia", desc: "Liquidación local", color: "text-gold", bg: "bg-gold/10" },
                  { icon: Zap, label: "DAO Local", desc: "Gobernanza territorial", color: "text-electric", bg: "bg-electric/10" },
                  { icon: Bot, label: "IA Territorial", desc: "Realito AI cognitivo", color: "text-teal", bg: "bg-teal/10" },
                ].map((feat) => (
                  <motion.div key={feat.label} whileHover={{ y: -4 }}
                    className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:border-gold/15">
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
        </TextReveal>
      </section>

      {/* ═══ FOOTER TAGLINE ═══ */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 80%, hsl(43 80% 55% / 0.04), transparent)"
        }} />
        <TextReveal className="relative z-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50 mb-4">Real del Monte, Hidalgo</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight max-w-2xl mx-auto">
            El futuro de los <span className="text-gradient-gold">Pueblos Mágicos</span> empieza aquí
          </h2>
          <div className="separator-gradient max-w-xs mx-auto mt-8" />
          <p className="mt-6 text-xs font-mono text-muted-foreground/40 tracking-wider">
            TAMV MD-X5 · Instancia Soberana · v1.0
          </p>
        </TextReveal>
      </section>
    </div>
  );
}

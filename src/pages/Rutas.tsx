import { motion } from "framer-motion";
import { Compass, Clock, MapPin, Mountain, Footprints, Star } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/rdm/VisualEffects";
import sierraImg from "@/assets/sierra-adventure.jpg";
import mineImg from "@/assets/mine-entrance.jpg";
import heroImg from "@/assets/hero-aerial.jpg";

const routes = [
  {
    name: "Senda de los Mineros",
    desc: "Recorre las galerías históricas y los socavones que forjaron la riqueza de la sierra.",
    image: mineImg,
    duration: "2-3 horas",
    difficulty: "Media",
    distance: "4.2 km",
    rating: 4.9,
    highlights: ["Mina de Acosta", "Socavón del Rey", "Mirador de la Plata"],
  },
  {
    name: "Ruta del Paste",
    desc: "Un recorrido gastronómico por las mejores pasterías del pueblo. Degusta la historia.",
    image: heroImg,
    duration: "1.5-2 horas",
    difficulty: "Fácil",
    distance: "2.8 km",
    rating: 5.0,
    highlights: ["El Portal", "Real Cornish", "Mina del Oro"],
  },
  {
    name: "Sendero del Hiloche",
    desc: "Inmersión total en la sierra: bosque de niebla, arroyos cristalinos y fauna endémica.",
    image: sierraImg,
    duration: "4-5 horas",
    difficulty: "Alta",
    distance: "8.5 km",
    rating: 4.8,
    highlights: ["Bosque de Niebla", "Cascada Escondida", "Mirador del Cerro"],
  },
];

const difficultyColor: Record<string, string> = {
  "Fácil": "text-emerald bg-emerald/10 border-emerald/20",
  "Media": "text-gold bg-gold/10 border-gold/20",
  "Alta": "text-copper bg-copper/10 border-copper/20",
};

export default function Rutas() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden flex items-end">
        <div className="absolute inset-0 ken-burns">
          <img src={sierraImg} alt="Sierra de Pachuca" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative z-10 px-6 lg:px-12 pb-16 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15">
                <Compass className="h-5 w-5 text-teal" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-teal/70">Experiencias Guiadas</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Rutas <span className="text-gradient-gold">Turísticas</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Routes */}
      <section className="py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <StaggerContainer className="space-y-8">
            {routes.map((route) => (
              <StaggerItem key={route.name}>
                <GlowCard>
                  <div className="glass rounded-3xl overflow-hidden group cursor-pointer hover:shadow-elevated transition-all duration-500">
                    <div className="grid lg:grid-cols-[400px_1fr]">
                      <div className="relative h-64 lg:h-auto overflow-hidden img-zoom">
                        <img src={route.image} alt={route.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60 hidden lg:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent lg:hidden" />
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${difficultyColor[route.difficulty]}`}>
                            {route.difficulty}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                            <span className="text-[12px] font-mono font-bold">{route.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-3xl font-display font-bold group-hover:text-gold transition-colors">{route.name}</h3>
                        <p className="mt-3 text-[14px] font-body text-muted-foreground leading-relaxed">{route.desc}</p>
                        
                        <div className="mt-5 flex flex-wrap gap-4 text-[11px] font-mono text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{route.duration}</span>
                          <span className="flex items-center gap-1.5"><Footprints className="h-3.5 w-3.5" />{route.distance}</span>
                          <span className="flex items-center gap-1.5"><Mountain className="h-3.5 w-3.5" />{route.difficulty}</span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {route.highlights.map((h) => (
                            <span key={h} className="glass rounded-full px-3 py-1.5 text-[10px] font-mono text-muted-foreground">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}

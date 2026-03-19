import { motion } from "framer-motion";
import { MapPin, Star, Clock, Compass } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/rdm/VisualEffects";
import mineImg from "@/assets/mine-entrance.jpg";
import panteonImg from "@/assets/panteon-ingles.jpg";
import sierraImg from "@/assets/sierra-adventure.jpg";
import heroImg from "@/assets/hero-aerial.jpg";

const places = [
  { name: "Mina de Acosta", category: "Historia & Minería", image: mineImg, desc: "Desciende a las profundidades de la historia minera. Galerías coloniales del siglo XVIII.", rating: 4.9, schedule: "9:00-17:00" },
  { name: "Panteón Inglés", category: "Cultura", image: panteonImg, desc: "Cementerio británico con vistas a las montañas. El único panteón inglés en Latinoamérica.", rating: 4.8, schedule: "8:00-18:00" },
  { name: "Bosque del Hiloche", category: "Ecoturismo", image: sierraImg, desc: "Senderos entre niebla y pinos centenarios. El pulmón verde de la sierra de Pachuca.", rating: 4.7, schedule: "6:00-18:00" },
  { name: "Plaza Principal", category: "Centro Histórico", image: heroImg, desc: "Corazón del pueblo con arquitectura colonial, kiosco y vista panorámica de la sierra.", rating: 4.9, schedule: "24 horas" },
];

export default function Lugares() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden flex items-end">
        <div className="absolute inset-0 ken-burns">
          <img src={heroImg} alt="Real del Monte" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative z-10 px-6 lg:px-12 pb-16 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/15">
                <MapPin className="h-5 w-5 text-electric" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-electric/70">Nodos Territoriales</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Lugares <span className="text-gradient-electric">Emblemáticos</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <StaggerContainer className="grid gap-6 md:grid-cols-2">
            {places.map((place) => (
              <StaggerItem key={place.name}>
                <GlowCard>
                  <div className="glass rounded-3xl overflow-hidden group cursor-pointer hover:shadow-elevated transition-all duration-500">
                    <div className="relative h-64 overflow-hidden img-zoom">
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider">{place.category}</span>
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-1 glass rounded-full px-3 py-1.5">
                        <Star className="h-3 w-3 text-gold fill-gold" />
                        <span className="text-[11px] font-mono font-bold">{place.rating}</span>
                      </div>
                    </div>
                    <div className="p-7 -mt-8 relative z-10">
                      <h3 className="text-2xl font-display font-bold group-hover:text-gold transition-colors">{place.name}</h3>
                      <p className="mt-3 text-[13px] font-body text-muted-foreground leading-relaxed">{place.desc}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{place.schedule}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Real del Monte</span>
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

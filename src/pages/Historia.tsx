import { motion } from "framer-motion";
import { Pickaxe, Clock, MapPin, BookOpen } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/rdm/VisualEffects";
import EditorialSection from "@/components/rdm/EditorialSection";
import mineImg from "@/assets/mine-entrance.jpg";
import mineDeep from "@/assets/mine-tunnel.jpg";

const timeline = [
  { year: "1560", title: "Fundación", desc: "Primeros asentamientos mineros en la sierra de Pachuca." },
  { year: "1739", title: "Auge Colonial", desc: "La plata de Real del Monte financia el imperio español." },
  { year: "1824", title: "Llegada Cornish", desc: "Mineros ingleses traen tecnología, fútbol y pastes." },
  { year: "1849", title: "Primera Huelga", desc: "La primera huelga laboral de América Latina." },
  { year: "2004", title: "Pueblo Mágico", desc: "Reconocimiento oficial como Pueblo Mágico de México." },
  { year: "2026", title: "RDM Digital", desc: "Nace el primer sistema operativo territorial soberano." },
];

export default function Historia() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-end">
        <div className="absolute inset-0 ken-burns">
          <img src={mineImg} alt="Mina de Acosta" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative z-10 px-6 lg:px-12 pb-16 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                <Pickaxe className="h-5 w-5 text-gold" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70">Capítulo I</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Historia <span className="text-gradient-gold">Minera</span>
            </h1>
            <p className="mt-4 text-base font-body text-muted-foreground max-w-xl">
              500 años de plata, oro y resistencia. La historia que forjó un pueblo entre montañas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Editorial */}
      <EditorialSection
        id="colonial"
        chapter="Capítulo I · Orígenes"
        title="La Plata que Forjó un Imperio"
        subtitle="Donde cada piedra cuenta una historia de 500 años"
        body={[
          "En 1560, las entrañas de la sierra de Pachuca revelaron su secreto más precioso: vetas de plata y oro que transformarían no solo un pueblo, sino el destino de un continente entero.",
          "Los túneles de Real del Monte se convirtieron en arterias de riqueza que alimentaron al imperio español, mientras los mineros forjaban una cultura única de resistencia, solidaridad y tradición.",
        ]}
        image={mineDeep}
        imageAlt="Interior de mina colonial"
        accentColor="gold"
      />

      {/* Timeline */}
      <section className="py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <TextReveal className="text-center mb-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/60 mb-3">Línea del Tiempo</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Cronología <span className="text-gradient-gold">Soberana</span>
            </h2>
          </TextReveal>

          <StaggerContainer className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
            
            {timeline.map((event, i) => (
              <StaggerItem key={event.year} className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                  <GlowCard>
                    <div className="glass rounded-2xl p-6 hover:border-gold/15 transition-all duration-300">
                      <p className="text-3xl font-display font-bold text-gradient-gold">{event.year}</p>
                      <h3 className="text-xl font-display font-bold mt-2">{event.title}</h3>
                      <p className="text-[13px] font-body text-muted-foreground mt-2">{event.desc}</p>
                    </div>
                  </GlowCard>
                </div>
                <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 border-2 border-gold/40 z-10">
                  <div className="h-2 w-2 rounded-full bg-gold" />
                </div>
                <div className="flex-1 hidden md:block" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}

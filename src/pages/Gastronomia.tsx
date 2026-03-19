import { motion } from "framer-motion";
import { Utensils, Star, Clock, MapPin } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/rdm/VisualEffects";
import EditorialSection from "@/components/rdm/EditorialSection";
import pastesImg from "@/assets/pastes-food.jpg";
import pasteriasImg from "@/assets/pasterias.png";

const dishes = [
  { name: "Paste Tradicional", desc: "Papa, carne y cebolla envueltos en masa dorada. El plato insignia cornish-mexicano.", rating: 5.0, price: "$25-45 MXN" },
  { name: "Paste de Mole", desc: "Fusión moderna con mole poblano, queso Oaxaca y epazote fresco de la sierra.", rating: 4.9, price: "$35-55 MXN" },
  { name: "Paste Dulce", desc: "Relleno de piña, manzana o arroz con leche. El postre perfecto a 2,700 metros.", rating: 4.8, price: "$20-35 MXN" },
  { name: "Barbacoa de Hoyo", desc: "Cocinada durante 12 horas bajo tierra con pencas de maguey. Solo fines de semana.", rating: 4.9, price: "$80-120 MXN" },
  { name: "Pulque Curado", desc: "Bebida ancestral fermentada del maguey, curada con frutas frescas de temporada.", rating: 4.7, price: "$30-50 MXN" },
  { name: "Atole de Nuez", desc: "Bebida caliente artesanal, perfecta para las noches frías de la sierra.", rating: 4.8, price: "$25-40 MXN" },
];

export default function Gastronomia() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-end">
        <div className="absolute inset-0 ken-burns">
          <img src={pastesImg} alt="Pastes tradicionales" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="relative z-10 px-6 lg:px-12 pb-16 max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-copper/15">
                <Utensils className="h-5 w-5 text-copper" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-copper/70">Capítulo II</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Gastronomía <span className="text-gradient-gold">Serrana</span>
            </h1>
            <p className="mt-4 text-base font-body text-muted-foreground max-w-xl">
              La fusión cornish-mexicana más auténtica del mundo. Pastes, barbacoa, pulque y más.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Editorial */}
      <EditorialSection
        id="pastes"
        chapter="Capítulo II · Sabor"
        title="El Paste: Herencia Viva"
        subtitle="De las minas de Cornualles a las calles de Real del Monte"
        body={[
          "En 1824, los mineros cornish trajeron consigo una receta sencilla: masa doblada rellena de papa, carne y cebolla. Lo que no sabían es que estaban sembrando la semilla de una tradición que definiría a un pueblo entero.",
          "Hoy, Real del Monte es la Capital Mundial del Paste. Cada bocado es un puente entre dos culturas separadas por un océano, unidas por el sabor y la memoria de las profundidades de la sierra.",
        ]}
        image={pasteriasImg}
        imageAlt="Pasterías de Real del Monte"
        imagePosition="right"
        accentColor="copper"
      />

      {/* Dishes Grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <TextReveal className="text-center mb-16">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-copper/60 mb-3">Menú Territorial</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Sabores de la <span className="text-gradient-gold">Sierra</span>
            </h2>
          </TextReveal>

          <StaggerContainer className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <StaggerItem key={dish.name}>
                <GlowCard>
                  <div className="glass rounded-2xl p-7 hover:border-gold/15 transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                        <span className="text-[12px] font-mono font-bold">{dish.rating}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gold">{dish.price}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold">{dish.name}</h3>
                    <p className="mt-3 text-[13px] font-body text-muted-foreground leading-relaxed">{dish.desc}</p>
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

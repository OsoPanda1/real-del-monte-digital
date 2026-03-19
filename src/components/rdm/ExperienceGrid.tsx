import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Pickaxe, Utensils, Mountain, Palette, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mineImg from "@/assets/mine-entrance.jpg";
import pastesImg from "@/assets/pastes-food.jpg";
import sierraImg from "@/assets/sierra-adventure.jpg";
import panteonImg from "@/assets/panteon-ingles.jpg";

const EXPERIENCES = [
  {
    id: "historia",
    title: "Historia Minera",
    subtitle: "500 años de plata y oro",
    image: mineImg,
    icon: Pickaxe,
    path: "/historia",
    span: "md:col-span-2 md:row-span-2",
    rating: 4.9,
  },
  {
    id: "gastronomia",
    title: "Gastronomía",
    subtitle: "Pastes & tradición cornish",
    image: pastesImg,
    icon: Utensils,
    path: "/gastronomia",
    span: "md:col-span-1 md:row-span-1",
    rating: 5.0,
  },
  {
    id: "aventura",
    title: "Aventura",
    subtitle: "Sierra salvaje de Hidalgo",
    image: sierraImg,
    icon: Mountain,
    path: "/rutas",
    span: "md:col-span-1 md:row-span-1",
    rating: 4.8,
  },
  {
    id: "cultura",
    title: "Cultura Viva",
    subtitle: "Patrimonio colonial",
    image: panteonImg,
    icon: Palette,
    path: "/lugares",
    span: "md:col-span-2 md:row-span-1",
    rating: 4.7,
  },
];

export default function ExperienceGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-28 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/60 mb-3">Experiencias Inmersivas</p>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
            Cinco mundos, <span className="text-gradient-gold">una sierra</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-3">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => navigate(exp.path)}
              className={`relative overflow-hidden rounded-3xl cursor-pointer group ${exp.span} ${exp.id === "historia" ? "min-h-[400px]" : "min-h-[220px]"}`}
            >
              <div className="absolute inset-0 img-zoom">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              
              {/* Rating */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 glass rounded-full px-3 py-1.5">
                <Star className="h-3 w-3 text-gold fill-gold" />
                <span className="text-[11px] font-mono font-bold">{exp.rating}</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 backdrop-blur-sm">
                    <exp.icon className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold/70">{exp.subtitle}</p>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight group-hover:text-gold transition-colors duration-300">
                  {exp.title}
                </h3>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-gold/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

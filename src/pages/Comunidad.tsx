import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, Calendar, MapPin, Clock } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/rdm/VisualEffects";
import likesImg from "@/assets/likes.png";

const posts = [
  { author: "María González", time: "Hace 2 horas", content: "Los pastes de El Portal hoy están increíbles. El de mole es una obra de arte culinaria. 🥧", likes: 45, comments: 12 },
  { author: "Carlos Minero", time: "Hace 5 horas", content: "Encontré una veta de cuarzo rosa cerca del Hiloche. ¡La sierra siempre sorprende! ⛏️💎", likes: 89, comments: 23 },
  { author: "Ana Turista", time: "Ayer", content: "Primera vez en Real del Monte y estoy enamorada. La niebla al amanecer es mágica. Volveré pronto. 🌄", likes: 134, comments: 31 },
  { author: "Don Pedro", time: "Hace 2 días", content: "55 años vendiendo pastes y cada día es diferente. Gracias RDM Digital por visibilizar nuestro trabajo. 🙏", likes: 256, comments: 67 },
];

const events = [
  { title: "Festival del Paste 2026", date: "12-14 Octubre", location: "Plaza Principal", category: "Gastronomía" },
  { title: "Noche de Leyendas", date: "Todos los sábados", location: "Mina de Acosta", category: "Cultura" },
  { title: "Carrera Sierra Minera", date: "8 Noviembre", location: "Bosque del Hiloche", category: "Aventura" },
  { title: "Día de Muertos RDM", date: "1-2 Noviembre", location: "Panteón Inglés", category: "Tradición" },
];

export default function Comunidad() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(210 100% 55% / 0.05), transparent 70%)"
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/15">
                <Users className="h-5 w-5 text-electric" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-electric/70">Red Territorial</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Comunidad <span className="text-gradient-electric">RDM</span>
            </h1>
            <p className="mt-4 text-base font-body text-muted-foreground max-w-xl">
              La voz viva de Real del Monte. Historias, reseñas y experiencias de quienes viven y aman este pueblo.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          {/* Posts */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Publicaciones Recientes</h2>
            <StaggerContainer className="space-y-5">
              {posts.map((post) => (
                <StaggerItem key={post.author}>
                  <div className="glass rounded-2xl p-6 hover:border-gold/15 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                        {post.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-body font-semibold">{post.author}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-[14px] font-body text-secondary-foreground leading-relaxed">{post.content}</p>
                    <div className="mt-4 flex items-center gap-5 text-[12px] font-mono text-muted-foreground">
                      <span className="flex items-center gap-1.5 hover:text-gold transition-colors cursor-pointer">
                        <Heart className="h-3.5 w-3.5" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-electric transition-colors cursor-pointer">
                        <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Events */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Próximos Eventos</h2>
            <StaggerContainer className="space-y-4">
              {events.map((event) => (
                <StaggerItem key={event.title}>
                  <GlowCard>
                    <div className="glass rounded-2xl p-6 hover:border-gold/15 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="glass rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-gold">{event.category}</span>
                      </div>
                      <h3 className="text-lg font-display font-bold">{event.title}</h3>
                      <div className="mt-3 space-y-1.5 text-[11px] font-mono text-muted-foreground">
                        <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</p>
                        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</p>
                      </div>
                    </div>
                  </GlowCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Realito mascot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 glass-gold rounded-3xl p-6 text-center"
            >
              <img src={likesImg} alt="Realito" className="mx-auto w-24 h-24 object-contain mb-4" />
              <h3 className="text-xl font-display font-bold text-gradient-gold">¡Únete a la comunidad!</h3>
              <p className="mt-2 text-[12px] font-body text-muted-foreground">
                Comparte tu experiencia en Real del Monte y sé parte de la red RDM Digital.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

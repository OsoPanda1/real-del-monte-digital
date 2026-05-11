import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Calendar, Compass, Store, Crown, Navigation, Gift, ChevronRight, MapPin, Star, Clock, Sparkles, ShieldCheck } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RDM_CENTER: [number, number] = [20.1413, -98.6735];

export default function HomeSections() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const { data: events } = useQuery({
    queryKey: ["events-home"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("is_active", true).order("starts_at").limit(3);
      return data || [];
    },
  });

  const { data: commerces } = useQuery({
    queryKey: ["commerces-home"],
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("is_subscribed", true).eq("is_active", true).limit(4);
      return data || [];
    },
  });

  const { data: packages } = useQuery({
    queryKey: ["packages-home"],
    queryFn: async () => {
      const { data } = await supabase.from("tour_packages").select("*").eq("is_active", true).order("price").limit(3);
      return data || [];
    },
  });

  const { data: places } = useQuery({
    queryKey: ["places-home"],
    queryFn: async () => {
      const { data } = await supabase.from("places").select("*").eq("is_active", true).limit(8);
      return data || [];
    },
  });

  // Init mini-map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current, {
      center: RDM_CENTER, zoom: 15, zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(mapInstance.current);

    const highlights: { lat: number; lng: number; emoji: string; color: string }[] = [
      { lat: 20.1413, lng: -98.6735, emoji: "🏛️", color: "#3B82F6" },
      { lat: 20.1445, lng: -98.6710, emoji: "⛪", color: "#3B82F6" },
      { lat: 20.1430, lng: -98.6760, emoji: "⛏️", color: "#D4AF37" },
      { lat: 20.1415, lng: -98.6728, emoji: "🥧", color: "#E77C40" },
      { lat: 20.1480, lng: -98.6800, emoji: "🏔️", color: "#3B82F6" },
    ];
    highlights.forEach((h) => {
      L.marker([h.lat, h.lng], {
        icon: L.divIcon({
          className: "rdm-mini-marker",
          html: `<div style="position:relative;width:36px;height:36px;">
            <div style="position:absolute;inset:0;border-radius:50%;background:${h.color}33;animation:rdmPulse 2.4s ease-out infinite;"></div>
            <div style="position:absolute;inset:5px;background:linear-gradient(135deg,${h.color}ee,${h.color}99);border:2px solid ${h.color};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 4px 12px ${h.color}66;">${h.emoji}</div>
          </div>`,
          iconSize: [36, 36], iconAnchor: [18, 18],
        }),
      }).addTo(mapInstance.current!);
    });

    if (!document.getElementById("rdm-marker-keyframes")) {
      const style = document.createElement("style");
      style.id = "rdm-marker-keyframes";
      style.textContent = `@keyframes rdmPulse{0%{transform:scale(0.8);opacity:0.7}80%{transform:scale(1.6);opacity:0}100%{transform:scale(1.6);opacity:0}}`;
      document.head.appendChild(style);
    }

    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, []);

  return (
    <>
      {/* ═══ MAP PREVIEW ═══ */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70 mb-3">Gemelo Digital Territorial</p>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
              Mapa <span className="text-gradient-gold">en tiempo real</span>
            </h2>
            <p className="mt-4 text-sm font-body text-muted-foreground max-w-xl mx-auto">
              Centrado en Real del Monte. Puntos de interés, minas, miradores y comercios oficiales geolocalizados.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-border/30 shadow-elevated cursor-pointer group"
            onClick={() => navigate("/mapa")}
          >
            <div ref={mapRef} className="h-[420px] w-full" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, hsl(222 50% 3% / 0.5) 100%)" }} />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between glass rounded-2xl p-4 border border-border/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-display font-bold">Explorar mapa completo</p>
                  <p className="text-[11px] font-mono text-muted-foreground">5 puntos destacados · 16+ ubicaciones</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SITIOS DE INTERÉS ═══ */}
      <section className="py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-electric/70 mb-2">Lugares Imperdibles</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                Sitios de <span className="text-gradient-gold">interés</span>
              </h2>
            </div>
            <button onClick={() => navigate("/lugares")} className="hidden sm:flex items-center gap-1.5 text-[12px] font-mono text-gold hover:text-gold-glow">
              Ver todos<ChevronRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(places || []).slice(0, 4).map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate("/mapa")}
                className="group cursor-pointer rounded-2xl glass-card overflow-hidden border border-border/20 hover:shadow-elevated transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-electric/10 via-secondary/30 to-gold/10 flex items-center justify-center text-5xl relative">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <span>{p.icon || "📍"}</span>}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-electric mb-1">{p.category}</p>
                  <h3 className="font-display font-bold text-base">{p.name}</h3>
                  {p.rating && (
                    <p className="mt-2 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                      <Star className="h-2.5 w-2.5 fill-gold text-gold" />{p.rating}
                      {p.schedule && <span className="ml-2 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{p.schedule}</span>}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTOS PRÓXIMOS ═══ */}
      {(events || []).length > 0 && (
        <section className="py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-copper/80 mb-3">Agenda Cultural</p>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                Eventos <span className="text-gradient-gold">próximos</span>
              </h2>
            </motion.div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {events!.map((e: any, i: number) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group flex items-center gap-5 rounded-2xl glass-card p-5 border border-border/20 hover:border-gold/30 transition-all"
                >
                  <div className="h-16 w-16 rounded-2xl bg-gold/15 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-mono uppercase text-gold">{new Date(e.starts_at).toLocaleDateString("es-MX", { month: "short" })}</span>
                    <span className="text-2xl font-display font-bold text-gold">{new Date(e.starts_at).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-copper">{e.category}</p>
                    <h3 className="text-lg font-display font-bold mt-0.5">{e.title}</h3>
                    <p className="text-[12px] font-body text-muted-foreground line-clamp-1 mt-0.5">{e.description}</p>
                    {e.location && (
                      <p className="text-[10px] font-mono text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />{e.location}
                      </p>
                    )}
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-gold" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ COMERCIOS OFICIALES ═══ */}
      {(commerces || []).length > 0 && (
        <section className="py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-teal" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-teal">Comercios Verificados</p>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                  Federación <span className="text-gradient-gold">Comercial</span>
                </h2>
              </div>
              <button onClick={() => navigate("/comercios")} className="hidden sm:flex items-center gap-1.5 text-[12px] font-mono text-gold hover:text-gold-glow">
                Ver catálogo<ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {commerces!.map((b: any, i: number) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate("/comercios")}
                  className="group cursor-pointer rounded-2xl glass-card p-6 border border-border/20 hover:border-gold/30 transition-all text-center"
                >
                  <div className="text-5xl mb-3">{b.icon || "🏪"}</div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-teal mb-1">{b.sector}</p>
                  <h3 className="font-display font-bold text-base">{b.name}</h3>
                  <p className="text-[11px] font-body text-muted-foreground mt-2 line-clamp-2">{b.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-gold">
                    <Sparkles className="h-2.5 w-2.5" />Premium
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ RECORRIDOS GUIADOS ═══ */}
      {(packages || []).length > 0 && (
        <section className="py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <Compass className="h-4 w-4 text-teal" />
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-teal">Experiencias Guiadas</p>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                Recorridos <span className="text-gradient-gold">guiados</span>
              </h2>
              <p className="mt-4 text-sm font-body text-muted-foreground max-w-xl mx-auto">
                Reserva con guías certificados. Día y hora a tu medida.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {packages!.map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl glass-card p-6 border border-border/20 hover:shadow-elevated transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-teal">{p.difficulty}</span>
                    <span className="text-lg font-display font-bold text-gradient-gold">${Number(p.price).toLocaleString()}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold">{p.title}</h3>
                  <p className="mt-2 text-[12px] font-body text-muted-foreground leading-relaxed flex-1">{p.description}</p>
                  <p className="mt-3 text-[10px] font-mono text-muted-foreground">{p.duration_min} min</p>
                  <button
                    onClick={() => navigate("/recorridos")}
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl gradient-gold px-4 py-2.5 text-[12px] font-body font-semibold text-primary-foreground shadow-gold"
                  >
                    <Calendar className="h-3.5 w-3.5" />Reservar
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ VETA SOBERANA PREMIUM BANNER ═══ */}
      <section className="py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative rounded-[2rem] glass-gold p-10 md:p-16 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(43 80% 55%), transparent 70%)" }} />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4 rounded-full glass px-3 py-1.5">
                  <Crown className="h-3.5 w-3.5 text-gold" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold">Veta Soberana Premium</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                  Mina, gana, <span className="text-gradient-gold">canjea</span>
                </h2>
                <p className="mt-4 text-sm font-body text-muted-foreground leading-relaxed max-w-lg">
                  Por <span className="text-gold font-bold">$99 MXN/mes</span> activas la minería digital geolocalizada y desbloqueas la bolsa de premios reales: descuentos, productos artesanales y experiencias en hoteles y restaurantes oficiales.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => navigate("/game")} className="flex items-center gap-2 rounded-xl gradient-gold px-5 py-3 text-sm font-body font-semibold text-primary-foreground shadow-gold">
                    <Gift className="h-4 w-4" />Activar Premium
                  </button>
                  <button onClick={() => navigate("/game")} className="flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-body font-medium border border-border/30 hover:border-gold/30">
                    Ver bolsa de premios
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🥧", label: "20% en pastes", value: "$50" },
                  { icon: "💍", label: "Aretes plata", value: "$350" },
                  { icon: "🏨", label: "Noche hotel", value: "$1,800" },
                  { icon: "🍷", label: "Cena 2 pers.", value: "$600" },
                ].map((r, i) => (
                  <motion.div
                    key={r.label}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="rounded-2xl glass p-4 text-center border border-gold/15"
                  >
                    <div className="text-3xl mb-2">{r.icon}</div>
                    <p className="text-[11px] font-body font-medium">{r.label}</p>
                    <p className="text-[10px] font-mono text-gold mt-1">~{r.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

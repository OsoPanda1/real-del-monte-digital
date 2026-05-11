import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Store, MapPin, Star, Phone, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sectors = ["Todos", "Gastronomía", "Hospedaje", "Artesanías", "Tours"];

export default function Comercios() {
  const [activeSector, setActiveSector] = useState("Todos");

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses-catalog"],
    queryFn: async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("is_subscribed", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = (businesses || []).filter((b: any) => activeSector === "Todos" || b.sector === activeSector);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-12 px-6 lg:px-12">
        <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(43 80% 55% / 0.08), transparent 70%)" }} />
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15">
                <Store className="h-5 w-5 text-teal" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-teal/80">Federación Comercial Oficial</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Catálogo de <span className="text-gradient-gold">Comercios</span>
            </h1>
            <p className="mt-3 text-sm font-body text-muted-foreground max-w-xl">
              Solo aparecen los comercios registrados oficialmente en RDM Digital. Cada uno está verificado y aporta a la comunidad.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full glass-teal px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal">Comercio verificado</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sector filters */}
      <section className="px-6 lg:px-12 pb-8">
        <div className="mx-auto max-w-7xl flex flex-wrap gap-3">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSector(s)}
              className={cn(
                "rounded-xl px-4 py-2.5 text-[12px] font-body font-medium transition-all border",
                activeSector === s
                  ? "bg-gold/15 text-gold border-gold/30"
                  : "bg-secondary/20 text-muted-foreground border-border/20 hover:bg-secondary/40"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl">
          {isLoading ? (
            <p className="text-center text-sm font-body text-muted-foreground py-16">Cargando comercios...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl">
              <Store className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-body text-muted-foreground">No hay comercios registrados aún en este sector.</p>
              <p className="text-[11px] font-mono text-muted-foreground/60 mt-2">¿Eres comerciante? Únete a la federación.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b: any, i: number) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-3xl glass-card border border-border/20 transition-shadow hover:shadow-elevated"
                >
                  <div className="h-44 relative overflow-hidden">
                    {b.image_url ? (
                      <img src={b.image_url} alt={b.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/10 via-secondary/30 to-electric/10 flex items-center justify-center text-7xl">
                        {b.icon || "🏪"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full glass-gold px-2.5 py-1">
                      <Sparkles className="h-3 w-3 text-gold" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gold">Premium</span>
                    </div>
                  </div>
                  <div className="p-5 -mt-12 relative z-10">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-teal mb-1">{b.sector}</p>
                    <h3 className="text-xl font-display font-bold">{b.name}</h3>
                    <p className="mt-2 text-[12px] font-body text-muted-foreground leading-relaxed line-clamp-3">
                      {b.description || "Comercio oficial registrado en RDM Digital."}
                    </p>
                    <div className="mt-4 space-y-1.5">
                      {b.contact_phone && (
                        <p className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                          <Phone className="h-3 w-3" />{b.contact_phone}
                        </p>
                      )}
                      {b.contact_email && (
                        <p className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                          <Mail className="h-3 w-3" />{b.contact_email}
                        </p>
                      )}
                      {b.lat && b.lng && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[11px] font-mono text-gold hover:text-gold-glow transition-colors"
                        >
                          <MapPin className="h-3 w-3" />Ver en mapa
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA registro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl glass-gold p-10 text-center"
          >
            <Store className="mx-auto h-10 w-10 text-gold mb-4" />
            <h3 className="text-3xl font-display font-bold">¿Tienes un negocio en Real del Monte?</h3>
            <p className="mt-3 text-sm font-body text-muted-foreground max-w-xl mx-auto">
              Únete a la federación oficial. Visibilidad en mapa, recomendaciones por Realito AI, y participación en la economía Veta Soberana.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              <div className="rounded-xl bg-background/40 p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Plan mensual</p>
                <p className="text-3xl font-display font-bold text-gradient-gold mt-2">$499<span className="text-sm text-muted-foreground"> MXN</span></p>
                <p className="text-[11px] font-body text-muted-foreground mt-1">Visibilidad completa + recompensas</p>
              </div>
              <div className="rounded-xl bg-background/40 p-5 border border-gold/30">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gold">Plan trimestral · Ahorra 15%</p>
                <p className="text-3xl font-display font-bold text-gradient-gold mt-2">$1,299<span className="text-sm text-muted-foreground"> MXN</span></p>
                <p className="text-[11px] font-body text-muted-foreground mt-1">3 meses + perfil destacado</p>
              </div>
            </div>
            <p className="mt-6 text-[11px] font-mono text-muted-foreground">Pago seguro disponible próximamente</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

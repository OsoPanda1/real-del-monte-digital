import { motion } from "framer-motion";
import { Pickaxe, Gem, Trophy, Crown, Sparkles, Lock, Gift, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

export default function GamePortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: premium } = useQuery({
    queryKey: ["premium", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("subscriptions_premium").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: rewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      const { data } = await supabase.from("rewards").select("*, businesses(name, sector, icon)").eq("is_active", true).order("points_cost");
      return data || [];
    },
  });

  const isPremium = premium?.status === "activa";
  const totalMinerals = profile?.total_minerals ?? 0;

  const handleActivatePremium = async () => {
    if (!user) { navigate("/auth"); return; }
    try {
      const { data, error } = await supabase.functions.invoke("create-premium-checkout");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error(e?.message || "No se pudo iniciar el pago");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo abrir el portal");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "success" && user) {
      supabase.functions.invoke("check-subscription").then(() => {
        toast.success("¡Premium activado!");
        window.history.replaceState({}, "", "/game");
      });
    }
  }, [user]);

  const handleRedeem = async (reward: any) => {
    if (!user || !isPremium) { toast.error("Necesitas Premium para canjear"); return; }
    if (totalMinerals < reward.points_cost) { toast.error("No tienes suficientes minerales"); return; }
    const { data, error } = await supabase.from("reward_redemptions").insert({
      user_id: user.id,
      reward_id: reward.id,
    }).select().single();
    if (error) { toast.error("No se pudo canjear"); return; }
    await supabase.from("profiles").update({ total_minerals: totalMinerals - reward.points_cost }).eq("user_id", user.id);
    toast.success(`¡Canjeado! Código: ${data.code}`);
  };

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Gamificación Territorial · Economía Sostenible
        </p>
        <h1 className="text-4xl font-display font-bold tracking-tight">Veta Soberana</h1>
        <p className="text-sm font-body text-muted-foreground mt-1">
          Mina minerales digitales y canjéalos por premios reales en comercios oficiales de Real del Monte.
        </p>
      </motion.div>

      {/* Status bar */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gold/15 flex items-center justify-center">
              <Gem className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Tus minerales</p>
              <p className="text-2xl font-display font-bold text-gradient-gold">{totalMinerals.toLocaleString()}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-electric/15 flex items-center justify-center">
              <Star className="h-6 w-6 text-electric" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Nivel</p>
              <p className="text-2xl font-display font-bold">{profile?.level ?? 1}</p>
            </div>
          </div>
          <div className={cn("rounded-2xl p-5 flex items-center gap-4", isPremium ? "glass-gold" : "glass")}>
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", isPremium ? "bg-gold/30" : "bg-secondary/40")}>
              <Crown className={cn("h-6 w-6", isPremium ? "text-gold" : "text-muted-foreground")} />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Estado</p>
              <p className={cn("text-lg font-display font-bold", isPremium && "text-gradient-gold")}>
                {isPremium ? "Premium activo" : "Cuenta básica"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Paywall */}
      {(!user || !isPremium) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl glass-gold p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, hsl(43 80% 55%), transparent 60%)" }} />
          <Lock className="mx-auto h-12 w-12 text-gold mb-4" />
          <h3 className="text-3xl font-display font-bold">Activa Veta Soberana Premium</h3>
          <p className="mt-3 text-sm font-body text-muted-foreground max-w-xl mx-auto">
            Por <span className="text-gradient-gold font-bold">$99 MXN/mes</span> desbloqueas: minería remota, multiplicadores x2, acceso a la bolsa de premios canjeables y power-ups exclusivos.
          </p>
          <div className="mt-6 grid gap-3 max-w-sm mx-auto text-left">
            {[
              "Minería digital geolocalizada en RDM",
              "Premios reales en hoteles, restaurantes y artesanías",
              "Sin pérdida para la plataforma: comercio aporta el premio",
              "Cooldown justo y stock limitado por premio",
            ].map((b) => (
              <p key={b} className="flex items-center gap-2 text-[12px] font-body text-foreground/90">
                <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0" />{b}
              </p>
            ))}
          </div>
          <button
            onClick={handleActivatePremium}
            className="mt-6 inline-flex items-center gap-2 rounded-xl gradient-gold px-6 py-3 text-sm font-body font-semibold text-primary-foreground shadow-gold hover:shadow-elevated transition-all"
          >
            <Crown className="h-4 w-4" />
            {user ? "Activar Premium" : "Iniciar sesión y activar"}
          </button>
          <p className="mt-3 text-[10px] font-mono text-muted-foreground">Pagos reales con Stripe próximamente · Activación demo gratuita</p>
        </motion.div>
      )}

      {/* Rewards catalog */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Gift className="h-5 w-5 text-gold" />Bolsa de Premios
            </h2>
            <p className="text-[12px] font-body text-muted-foreground mt-1">
              Premios reales aportados por comercios federados. {!isPremium && "Activa Premium para canjear."}
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(rewards || []).map((r: any) => {
            const canRedeem = isPremium && totalMinerals >= r.points_cost;
            return (
              <motion.div
                key={r.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "rounded-2xl glass border p-5 flex flex-col",
                  canRedeem ? "border-gold/30" : "border-border/20"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    "text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md",
                    r.type === "experiencia" ? "bg-gold/15 text-gold" : r.type === "producto" ? "bg-teal/15 text-teal" : "bg-electric/15 text-electric"
                  )}>{r.type}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">stock: {r.stock}</span>
                </div>
                <h3 className="text-lg font-display font-bold">{r.title}</h3>
                <p className="text-[12px] font-body text-muted-foreground mt-1 leading-relaxed flex-1">{r.description}</p>
                {r.businesses && (
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">por {r.businesses.icon} {r.businesses.name}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground">Costo</p>
                    <p className="text-lg font-display font-bold text-gradient-gold">{r.points_cost.toLocaleString()} ⚒️</p>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">~${Number(r.monetary_value).toLocaleString()} MXN</p>
                </div>
                <button
                  onClick={() => handleRedeem(r)}
                  disabled={!canRedeem}
                  className={cn(
                    "mt-3 w-full rounded-xl px-4 py-2.5 text-[12px] font-body font-semibold transition-all",
                    canRedeem
                      ? "gradient-gold text-primary-foreground shadow-gold hover:shadow-elevated"
                      : "bg-secondary/30 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {!isPremium ? "Requiere Premium" : !user ? "Inicia sesión" : totalMinerals < r.points_cost ? "Faltan minerales" : "Canjear"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Economy formula */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />Fórmula de sostenibilidad
        </h3>
        <p className="text-[12px] font-body text-muted-foreground mt-2 leading-relaxed">
          Cada premio tiene un <span className="text-gold font-mono">points_cost</span> calculado para que la plataforma mantenga un margen ≥30%.
          Los comercios federados aportan los premios a cambio de visibilidad y tráfico — no representan costo directo para la plataforma.
          Stock limitado, cooldown de 24h y techo de canje por usuario garantizan estabilidad económica.
        </p>
      </motion.div>
    </div>
  );
}

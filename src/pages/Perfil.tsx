import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  User as UserIcon,
  Pickaxe,
  Crown,
  Store,
  LogOut,
  Settings,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authReady && !user) navigate("/auth");
  }, [authReady, user, navigate]);

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile]);

  const { data: premium } = useQuery({
    queryKey: ["premium-sub", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions_premium")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: businesses } = useQuery({
    queryKey: ["my-businesses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: redemptions } = useQuery({
    queryKey: ["my-redemptions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("reward_redemptions")
        .select("*, rewards(*)")
        .eq("user_id", user!.id)
        .order("redeemed_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim().slice(0, 80) })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("No se pudo guardar el perfil");
    else {
      toast.success("Perfil actualizado");
      refetchProfile();
    }
  };

  const openPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error(e?.message || "No se pudo abrir el portal");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!authReady || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-mono text-muted-foreground">Cargando perfil…</p>
      </div>
    );
  }

  const isPremiumActive = premium?.status === "activa" || profile?.is_premium;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-gold p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold/30 to-electric/30 flex items-center justify-center border border-gold/30">
              <UserIcon className="h-9 w-9 text-gold" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/80 mb-1">
                Pasaporte RDM Digital
              </p>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                {profile?.display_name || user.email?.split("@")[0]}
              </h1>
              <p className="text-[12px] font-mono text-muted-foreground mt-1">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-border/30 bg-background/40 px-4 py-2.5 text-[12px] font-body text-muted-foreground hover:text-foreground hover:border-gold/40 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </motion.div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={Pickaxe}
            label="Minerales acumulados"
            value={profile?.total_minerals ?? 0}
            accent="text-copper"
          />
          <StatCard
            icon={Sparkles}
            label="Nivel del jugador"
            value={profile?.level ?? 1}
            accent="text-electric"
          />
          <StatCard
            icon={Crown}
            label="Membresía"
            value={isPremiumActive ? "Premium" : "Gratuita"}
            accent={isPremiumActive ? "text-gold" : "text-muted-foreground"}
          />
        </div>

        {/* Suscripción */}
        <section className="rounded-3xl glass-card border border-border/20 p-7">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-gold" />
            <h2 className="text-lg font-display font-bold">Mi suscripción Premium</h2>
          </div>
          {isPremiumActive ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 border border-gold/30">
                  <ShieldCheck className="h-3 w-3 text-gold" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold">
                    Activa
                  </span>
                </div>
                {premium?.expires_at && (
                  <p className="mt-3 text-[12px] font-mono text-muted-foreground">
                    Renueva el {new Date(premium.expires_at).toLocaleDateString("es-MX")}
                  </p>
                )}
              </div>
              <button
                onClick={openPortal}
                className="flex items-center gap-2 rounded-xl gradient-gold px-4 py-2.5 text-[12px] font-body font-semibold text-primary-foreground shadow-gold hover:shadow-elevated transition-all"
              >
                <Settings className="h-3.5 w-3.5" />
                Gestionar suscripción
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-sm font-body text-muted-foreground max-w-md">
                Desbloquea minería en mapa real, canje de recompensas y acceso anticipado a
                rutas premium por <span className="text-gold font-semibold">$99 MXN/mes</span>.
              </p>
              <button
                onClick={() => navigate("/game")}
                className="rounded-xl gradient-gold px-4 py-2.5 text-[12px] font-body font-semibold text-primary-foreground shadow-gold"
              >
                Activar Premium
              </button>
            </div>
          )}
        </section>

        {/* Mis comercios */}
        <section className="rounded-3xl glass-card border border-border/20 p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-teal" />
              <h2 className="text-lg font-display font-bold">Mis comercios</h2>
            </div>
            <button
              onClick={() => navigate("/registrar-comercio")}
              className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-gold-glow transition-colors"
            >
              + Registrar nuevo
            </button>
          </div>
          {!businesses?.length ? (
            <p className="text-sm font-body text-muted-foreground py-6 text-center">
              Aún no has registrado ningún comercio. Únete a la federación oficial.
            </p>
          ) : (
            <ul className="divide-y divide-border/20">
              {businesses.map((b: any) => (
                <li key={b.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-background/60 flex items-center justify-center text-xl border border-border/20">
                      {b.icon || "🏪"}
                    </div>
                    <div>
                      <p className="text-sm font-body font-semibold">{b.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{b.sector}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {b.is_subscribed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald/15 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-emerald">
                        <ShieldCheck className="h-3 w-3" />
                        Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-400">
                        Pendiente
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recompensas canjeadas */}
        {!!redemptions?.length && (
          <section className="rounded-3xl glass-card border border-border/20 p-7">
            <h2 className="text-lg font-display font-bold mb-4">Últimas recompensas canjeadas</h2>
            <ul className="space-y-3">
              {redemptions.map((r: any) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl bg-background/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-body font-semibold">{r.rewards?.title}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      Código: {r.code}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(r.redeemed_at).toLocaleDateString("es-MX")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Editar nombre */}
        <section className="rounded-3xl glass-card border border-border/20 p-7">
          <h2 className="text-lg font-display font-bold mb-4">Editar perfil</h2>
          <label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Nombre visible
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={80}
            className="mt-2 w-full rounded-xl bg-background/60 border border-border/30 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold/50"
            placeholder="Tu nombre"
          />
          <button
            onClick={handleSave}
            disabled={saving || !displayName.trim()}
            className="mt-4 rounded-xl gradient-gold px-5 py-2.5 text-[12px] font-body font-semibold text-primary-foreground shadow-gold disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl glass-card border border-border/20 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <p className={`mt-3 text-3xl font-display font-bold ${accent}`}>{value}</p>
    </div>
  );
}

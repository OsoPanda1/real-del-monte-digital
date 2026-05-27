import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Mountain,
  Pickaxe,
  Utensils,
  MapPin,
  Compass,
  Users,
  Bot,
  LayoutDashboard,
  Menu,
  X,
  Navigation,
  LogIn,
  LogOut,
  Store,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import rdmLogo from "@/assets/rdm-logo.png";

const navItems = [
  { path: "/", label: "Inicio", icon: Mountain },
  { path: "/historia", label: "Historia", icon: Pickaxe },
  { path: "/gastronomia", label: "Gastronomía", icon: Utensils },
  { path: "/lugares", label: "Lugares", icon: MapPin },
  { path: "/mapa", label: "Mapa", icon: Navigation },
  { path: "/recorridos", label: "Recorridos", icon: Compass },
  { path: "/comercios", label: "Comercios", icon: Store },
  { path: "/comunidad", label: "Comunidad", icon: Users },
  { path: "/realito", label: "Realito AI", icon: Bot, type: "advanced" as const },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, type: "advanced" as const },
];

const scrollThreshold = 80;
// Ajusta según entorno real
const ENV_LABEL: "DEV" | "STAGE" | "PROD" = "DEV";

type SystemStatus = "ONLINE" | "DEGRADED" | "OFFLINE";

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("ONLINE");
  const navigate = useNavigate();

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth state
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth
      .getSession()
      .then(({ data }) => setUser(data.session?.user ?? null))
      .catch(() => setUser(null));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Placeholder para estado del sistema (futuro: health checks reales)
  useEffect(() => {
    // Aquí podrías hacer ping a endpoints /health y ajustar systemStatus
    setSystemStatus("ONLINE");
  }, []);

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("No se pudo cerrar sesión.");
      return;
    }
    toast.success("Sesión cerrada");
    navigate("/");
  }, [navigate]);

  const statusConfig = useMemo(() => {
    switch (systemStatus) {
      case "ONLINE":
        return {
          label: "Infraestructura estable",
          dotClass: "bg-emerald-400",
          textClass: "text-emerald-400",
        };
      case "DEGRADED":
        return {
          label: "Servicios con degradación",
          dotClass: "bg-amber-400",
          textClass: "text-amber-400",
        };
      case "OFFLINE":
        return {
          label: "Modo isla / Offline",
          dotClass: "bg-red-500",
          textClass: "text-red-500",
        };
      default:
        return {
          label: "Infraestructura estable",
          dotClass: "bg-emerald-400",
          textClass: "text-emerald-400",
        };
    }
  }, [systemStatus]);

  return (
    <>
      {/* Header principal */}
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-2xl border-b border-border/40 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            : "bg-gradient-to-b from-background/95 via-background/70 to-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo y marca */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 shrink-0">
                <img
                  src={rdmLogo}
                  alt="RDM"
                  className="h-10 w-10 drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] transition-transform group-hover:scale-110"
                />
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-[13px] font-display font-bold text-gradient-gold">
                  RDM DIGITAL
                </p>
                <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                  Nodo Cero · Real del Monte
                </p>
              </div>
            </NavLink>

            {/* Nav desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems
                .filter(item => !item.type)
                .map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "relative px-3 py-2 text-[12px] font-body font-medium rounded-xl transition-all duration-300",
                        "text-muted-foreground hover:text-foreground",
                        isActive && "text-gold",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="navActive"
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 26,
                            }}
                            className="absolute inset-0 rounded-xl bg-gold/10 border border-gold/25"
                          />
                        )}
                        <span className="relative flex items-center gap-2">
                          <item.icon className="h-3.5 w-3.5 opacity-70" />
                          <span>{item.label}</span>
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
            </nav>

            {/* Zona derecha */}
            <div className="flex items-center gap-3">
              {/* Env + estado del sistema */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-border/40 bg-background/60 px-3 py-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                    ENV_{ENV_LABEL}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/60 px-3 py-1.5">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      statusConfig.dotClass,
                    )}
                  />
                  <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    <Activity className="h-3 w-3 opacity-70" />
                    <span className={statusConfig.textClass}>
                      {statusConfig.label}
                    </span>
                  </span>
                </div>
              </div>

              {/* Auth */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border/30 bg-secondary/30 px-3 py-2 text-[11px] font-body font-medium text-muted-foreground hover:text-foreground hover:border-gold/40 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Salir
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  className="hidden sm:flex items-center gap-1.5 rounded-xl gradient-gold px-3.5 py-2 text-[11px] font-body font-semibold text-primary-foreground shadow-gold hover:shadow-elevated transition-all"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Entrar
                </NavLink>
              )}

              {/* Botón mobile */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/30 text-muted-foreground hover:text-gold transition-colors bg-background/70"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Capa avanzada desktop (Realito / Dashboard) */}
          <div className="hidden lg:flex justify-end gap-2 pb-2">
            {navItems
              .filter(item => item.type === "advanced")
              .map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-body transition-all",
                      "border-border/40 text-muted-foreground hover:text-foreground hover:border-gold/40 bg-background/60",
                      isActive && "border-gold/50 text-gold",
                    )
                  }
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-background border-l border-border/30 p-6 overflow-y-auto"
            >
              {/* Header mobile */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src={rdmLogo} alt="RDM" className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-display font-bold text-gradient-gold">
                      Panel de Navegación
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
                      RDM_OS · Territorio Digital
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-gold"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Estado del sistema */}
              <div className="mb-6 rounded-xl border border-border/30 bg-background/60 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      statusConfig.dotClass,
                    )}
                  />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    {statusConfig.label}
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                  ENV_{ENV_LABEL}
                </span>
              </div>

              {/* Links mobile */}
              <nav className="space-y-1.5">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-body transition-all",
                        isActive
                          ? "bg-gold/10 text-gold border border-gold/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30",
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-[10px] text-muted-foreground/70">
                        {item.path === "/realito"
                          ? "Asistente territorial"
                          : item.path === "/dashboard"
                          ? "Panel operativo"
                          : ""}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </nav>

              {/* Zona auth mobile */}
              <div className="mt-8 pt-6 border-t border-border/20">
                {user ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/30 px-4 py-3 text-sm font-body text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                ) : (
                  <NavLink
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl gradient-gold px-4 py-3 text-sm font-body font-semibold text-primary-foreground"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar al portal
                  </NavLink>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

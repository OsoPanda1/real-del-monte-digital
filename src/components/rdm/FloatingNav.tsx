import { useState, useEffect, useCallback } from "react";
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
  Calendar,
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
  { path: "/realito", label: "Realito AI", icon: Bot },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const scrollThreshold = 80;

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error("No se pudo cerrar sesión."); return; }
    toast.success("Sesión cerrada");
    navigate("/");
  }, [navigate]);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled ? "bg-background/80 backdrop-blur-2xl border-b border-border/30" : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 shrink-0">
                <img src={rdmLogo} alt="RDM" className="h-10 w-10 drop-shadow-[0_0_12px_rgba(255,215,0,0.4)] transition-transform group-hover:scale-110" />
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-[13px] font-display font-bold text-gradient-gold">RDM DIGITAL</p>
                <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                  Pueblo Mágico · Real del Monte
                </p>
              </div>
            </NavLink>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 8).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "relative px-3 py-2 text-[12px] font-body font-medium rounded-xl transition-all duration-300",
                    "text-muted-foreground hover:text-foreground",
                    isActive && "text-gold"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="navActive"
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                          className="absolute inset-0 rounded-xl bg-gold/10 border border-gold/20"
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* CTA + Auth + Mobile */}
            <div className="flex items-center gap-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border/30 bg-secondary/30 px-3 py-2 text-[11px] font-body font-medium text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all"
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
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/30 text-muted-foreground hover:text-gold transition-colors"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
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
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-background border-l border-border/30 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src={rdmLogo} alt="RDM" className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-display font-bold text-gradient-gold">Navegación</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
                      Real del Monte Digital
                    </p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-gold">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-body transition-all",
                      isActive
                        ? "bg-gold/10 text-gold border border-gold/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-border/20">
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
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

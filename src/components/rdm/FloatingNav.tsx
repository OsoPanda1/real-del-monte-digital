import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Mountain, Pickaxe, Utensils, MapPin, Compass, Users, Calendar, Bot, LayoutDashboard, Store, Menu, X, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import rdmLogo from "@/assets/rdm-logo.png";

const navItems = [
  { path: "/", label: "Inicio", icon: Mountain },
  { path: "/historia", label: "Historia", icon: Pickaxe },
  { path: "/gastronomia", label: "Gastronomía", icon: Utensils },
  { path: "/lugares", label: "Lugares", icon: MapPin },
  { path: "/mapa", label: "Mapa", icon: Navigation },
  { path: "/rutas", label: "Rutas", icon: Compass },
  { path: "/comunidad", label: "Comunidad", icon: Users },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/realito", label: "Realito AI", icon: Bot },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div className={cn(
          "mx-auto max-w-7xl px-4 transition-all duration-500",
          scrolled ? "mx-4 lg:mx-auto" : ""
        )}>
          <nav className={cn(
            "flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500",
            scrolled
              ? "glass shadow-elevated"
              : "bg-transparent"
          )}>
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3">
              <img src={rdmLogo} alt="RDM" className="h-9 w-9 object-contain" />
              <div className="hidden sm:block">
                <p className="text-sm font-display font-bold text-gradient-gold tracking-wide">RDM DIGITAL</p>
                <p className="text-[8px] font-mono text-muted-foreground tracking-[0.2em] uppercase">Pueblo Mágico</p>
              </div>
            </NavLink>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 7).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "relative px-3.5 py-2 text-[12px] font-body font-medium transition-all duration-300 rounded-xl",
                    isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div layoutId="navActive" className="absolute inset-0 rounded-xl bg-gold/10 border border-gold/15" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* CTA + Mobile */}
            <div className="flex items-center gap-3">
              <NavLink to="/dashboard" className="hidden lg:flex items-center gap-2 btn-premium !px-5 !py-2.5 !text-[11px]">
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </NavLink>
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:text-gold transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] glass"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur-2xl border-l border-border/30 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-gold">
                <X className="h-5 w-5" />
              </button>
              <div className="mt-12 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-body transition-all",
                      isActive ? "text-gold bg-gold/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

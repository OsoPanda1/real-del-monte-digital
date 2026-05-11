import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Mountain,
  Store,
  Pickaxe,
  Bot,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Dashboard CEO", icon: LayoutDashboard },
  { path: "/game", label: "Veta Soberana", icon: Pickaxe },
  { path: "/b2b", label: "Portal B2B", icon: Store },
  { path: "/realito", label: "Realito AI", icon: Bot },
];

const sidebarVariants = {
  expanded: { width: 256, transition: { type: "spring" as const, stiffness: 260, damping: 26 } },
  collapsed: { width: 76, transition: { type: "spring" as const, stiffness: 260, damping: 26 } },
};

const brandTextVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = collapsed;

  const activeItem = useMemo(
    () => navItems.find((item) => currentPath.startsWith(item.path)),
    [currentPath]
  );

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      initial={false}
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col",
        "bg-sidebar/85 backdrop-blur-2xl border-r border-sidebar-border"
      )}
    >
      {/* Header / Logo */}
      <div className="flex h-20 items-center gap-3 px-4 border-b border-sidebar-border/60">
        <motion.div
          whileHover={{ rotate: 6, scale: 1.08, filter: "drop-shadow(0 0 16px rgba(255,215,0,0.5))" }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-gold shadow-gold"
        >
          <Mountain className="h-5 w-5 text-primary-foreground" />
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={brandTextVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-display font-bold text-gradient-gold tracking-wide leading-none">
                RDM DIGITAL
              </p>
              <p className="mt-1 text-[9px] font-mono text-muted-foreground tracking-widest uppercase">
                TAMV MD‑X5 · instancia
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back to public portal */}
      <div className="px-3 pt-3">
        <NavLink
          to="/"
          className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-gold hover:bg-sidebar-accent/60 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          {!isCollapsed && <span className="truncate">Volver al portal público</span>}
        </NavLink>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 p-3 mt-2">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: isNavActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-300",
                  (isNavActive || isActive)
                    ? "text-primary-foreground"
                    : "text-sidebar-foreground hover:text-foreground"
                )
              }
            >
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-xl gradient-gold shadow-gold"
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-sidebar-accent/0 group-hover:bg-sidebar-accent/70 transition-colors duration-300" />
              )}
              <item.icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
              {!isCollapsed && (
                <span className="relative z-10 truncate">{item.label}</span>
              )}
              {!isCollapsed && isActive && (
                <span className="relative z-10 ml-auto text-[9px] font-mono uppercase tracking-widest text-primary-foreground/80">
                  activo
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom status + collapse */}
      <div className="p-3 space-y-2 border-t border-sidebar-border/60">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2.5 rounded-xl glass-gold p-3"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] font-body text-foreground leading-tight">
                  Instancia soberana activa
                </p>
                <p className="text-[9px] font-mono text-muted-foreground tracking-wide mt-0.5 truncate">
                  Sesión cifrada · Nodo MD‑X5
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="group flex h-9 w-full items-center justify-center rounded-xl border border-transparent text-muted-foreground hover:text-gold hover:border-gold/40 hover:bg-sidebar-accent/60 transition-all duration-300"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}

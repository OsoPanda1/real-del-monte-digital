import { NavLink, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup, type Variants } from "framer-motion";
import {
  LayoutDashboard,
  Mountain,
  Store,
  Pickaxe,
  Bot,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Definición estricta de rutas con metadatos de sistema para la interfaz cuántica
interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard CEO", icon: LayoutDashboard, tag: "SYS-01" },
  { path: "/game", label: "Veta Soberana", icon: Pickaxe, tag: "MINE-02" },
  { path: "/b2b", label: "Portal B2B", icon: Store, tag: "CORP-03" },
  { path: "/realito", label: "Realito AI", icon: Bot, tag: "AI-CORE" },
];

// Configuraciones de animación optimizadas para hardware (Springs de alta respuesta)
const sidebarVariants: Variants = {
  expanded: { 
    width: 270, 
    transition: { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.8 } 
  },
  collapsed: { 
    width: 84, 
    transition: { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.8 } 
  },
};

const textFadeVariants: Variants = {
  hidden: { opacity: 0, x: -8, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -4, filter: "blur(2px)", transition: { duration: 0.15, ease: "easeIn" as const } },
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();

  // Memoización de ruta para evitar cálculos innecesarios en re-renders
  const currentActiveItem = useMemo(() => {
    return navItems.find((item) => pathname.startsWith(item.path));
  }, [pathname]);

  return (
    <LayoutGroup id="sidebar-quantum-group">
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        initial={false}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden",
          "bg-slate-950/75 dark:bg-zinc-950/80 backdrop-blur-3xl border-r border-white/[0.06]",
          "shadow-[8px_0_40px_-15px_rgba(0,0,0,0.8)] transition-colors duration-500",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-500/[0.02] before:to-transparent before:pointer-events-none"
        )}
      >
        {/* HEADER / BRANDING (NODO CERO) */}
        <div className="relative flex h-24 items-center gap-3.5 px-4.5 border-b border-white/[0.05]">
          <motion.div
            whileHover={{ 
              scale: 1.04, 
              boxShadow: "0 0 25px 3px rgba(245, 158, 11, 0.35)",
              borderColor: "rgba(245, 158, 11, 0.6)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/30",
              "bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-lg shadow-amber-500/10 cursor-pointer"
            )}
          >
            <Mountain className="h-5.5 w-5.5 text-slate-950 stroke-[2.2]" />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                variants={textFadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col min-w-0"
              >
                <span className="text-[15px] font-sans font-black tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]">
                  RDM DIGITAL
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[9px] text-amber-500/70 tracking-widest uppercase font-semibold">
                  <Cpu className="h-2.5 w-2.5 animate-pulse text-amber-400" />
                  NODO_CERO // MD-X5
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACCESO AL PORTAL PÚBLICO */}
        <div className="px-3.5 pt-4">
          <NavLink
            to="/"
            className={({ isActive }) => cn(
              "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-[12px] font-medium transition-all duration-300",
              "text-zinc-400 hover:text-amber-400 border border-transparent hover:border-white/[0.04]",
              "hover:bg-white/[0.02] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
              isActive && "text-amber-400 bg-white/[0.01]"
            )}
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1 group-hover:text-amber-400" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span variants={textFadeVariants} initial="hidden" animate="visible" exit="exit" className="truncate font-semibold tracking-wide">
                  Volver al portal público
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex-1 space-y-1.5 p-3.5 mt-4 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: isNavActive }) =>
                  cn(
                    "group relative flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-[13.5px] font-medium transition-all duration-300",
                    "border border-transparent select-none",
                    (isNavActive || isActive)
                      ? "text-slate-950 font-bold shadow-xl shadow-amber-500/10"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] hover:border-white/[0.04]"
                  )
                }
              >
                {/* Animación de Fondo Activo (Layout Mágico) */}
                {(isActive) && (
                  <motion.div
                    layoutId="activeGlow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 z-0"
                  />
                )}

                {/* Micro-Glow Perimetral cuando el elemento está activo */}
                {isActive && (
                  <div className="absolute -inset-px rounded-xl border border-yellow-300/40 opacity-100 blur-[1px] z-0 pointer-events-none" />
                )}

                {/* Iconografía con Capa de Profundidad */}
                <item.icon 
                  className={cn(
                    "relative z-10 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-105",
                    isActive ? "text-slate-950 stroke-[2.2]" : "text-zinc-400 group-hover:text-amber-400 stroke-[1.8]"
                  )} 
                />

                {/* Texto Reactivo */}
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      variants={textFadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative z-10 truncate tracking-wide"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tag de Sistema Metafísico */}
                {!isCollapsed && (
                  <AnimatePresence>
                    <motion.span 
                      variants={textFadeVariants}
                      className={cn(
                        "relative z-10 ml-auto font-mono text-[9px] tracking-widest font-bold px-1.5 py-0.5 rounded border transition-colors duration-300",
                        isActive 
                          ? "bg-slate-950/20 text-slate-900 border-black/10" 
                          : "bg-white/[0.03] text-zinc-500 border-white/[0.04] group-hover:text-amber-500/80 group-hover:border-amber-500/20"
                      )}
                    >
                      {item.tag}
                    </motion.span>
                  </AnimatePresence>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER: STATUS DE SEGURIDAD SOBERANA + CONTROLADOR */}
        <div className="p-3.5 space-y-3 border-t border-white/[0.05] bg-slate-950/40 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-3.5 border border-amber-500/10",
                  "bg-gradient-to-br from-amber-500/[0.03] via-yellow-600/[0.01] to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] relative overflow-hidden group"
                )}
              >
                {/* Efecto destello Cyberpunk de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                <ShieldCheck className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <div className="min-w-0">
                  <p className="text-[11px] font-sans font-bold text-zinc-200 tracking-wide leading-tight">
                    Instancia Soberana Activa
                  </p>
                  <p className="text-[9px] font-mono text-amber-500/60 tracking-wider mt-1 truncate">
                    SECURE_LINK // NODO_00_M5
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gatillo de Colapso Ergonómico */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            className={cn(
              "group flex h-11 w-full items-center justify-center rounded-xl transition-all duration-300",
              "border border-white/[0.04] text-zinc-400 bg-white/[0.01]",
              "hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/[0.03]",
              "active:scale-[0.98] shadow-sm"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            ) : (
              <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            )}
          </button>
        </div>
      </motion.aside>
    </LayoutGroup>
  );
}

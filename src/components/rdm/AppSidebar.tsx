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
  Home,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/dashboard", label: "Dashboard CEO", icon: LayoutDashboard },
  { path: "/game", label: "Veta Soberana", icon: Pickaxe },
  { path: "/b2b", label: "Portal B2B", icon: Store },
  { path: "/realito", label: "Realito AI", icon: Bot },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col transition-all duration-500 ease-out",
        "bg-sidebar/80 backdrop-blur-2xl border-r border-sidebar-border",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-5 border-b border-sidebar-border/50">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-gold shadow-gold"
        >
          <Mountain className="h-5 w-5 text-primary-foreground" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="overflow-hidden">
              <p className="text-sm font-display font-bold text-gradient-gold tracking-wide">RDM DIGITAL</p>
              <p className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase">TAMV MD-X5</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back to public */}
      <div className="px-3 pt-3">
        <NavLink
          to="/"
          className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-muted-foreground hover:text-gold transition-all duration-300 hover:bg-sidebar-accent/50"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Volver al Portal</span>}
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-300",
                isActive ? "text-primary-foreground" : "text-sidebar-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div layoutId="activeNav" className="absolute inset-0 rounded-xl gradient-gold shadow-gold" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-sidebar-accent/0 group-hover:bg-sidebar-accent/80 transition-colors duration-300" />
              )}
              <item.icon className="relative z-10 h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-2 border-t border-sidebar-border/50">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-xl glass-gold p-3">
            <Sparkles className="h-3.5 w-3.5 text-gold shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-tight">Instancia soberana activa</p>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-9 w-full items-center justify-center rounded-xl text-muted-foreground hover:text-gold hover:bg-sidebar-accent transition-all duration-300"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}

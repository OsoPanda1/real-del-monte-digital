import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "gold" | "teal" | "default" | "copper" | "ore" | "electric";
}

const variantStyles = {
  gold: "glass-gold shadow-gold",
  teal: "glass-teal shadow-teal",
  copper: "glass border-copper/15",
  ore: "glass border-ore/15",
  electric: "glass border-glow-electric shadow-electric",
  default: "glass",
};

const iconVariants = {
  gold: "text-gold bg-gold/10",
  teal: "text-teal bg-teal/10",
  copper: "text-copper bg-copper/10",
  ore: "text-ore bg-ore/10",
  electric: "text-electric bg-electric/10",
  default: "text-muted-foreground bg-secondary",
};

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, variant = "default" }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-body font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "text-[11px] font-mono font-medium",
                changeType === "positive" && "text-emerald",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

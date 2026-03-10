import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  variant?: "gold" | "teal" | "default" | "copper" | "ore";
}

const variantStyles = {
  gold: "border-glow-gold shadow-gold",
  teal: "border-glow-teal shadow-teal",
  copper: "border-copper/20",
  ore: "border-ore/20",
  default: "",
};

const iconVariants = {
  gold: "text-gold",
  teal: "text-teal",
  copper: "text-copper",
  ore: "text-ore",
  default: "text-muted-foreground",
};

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, variant = "default" }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "gradient-card rounded-xl border p-5 shadow-card",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs font-mono font-medium",
                changeType === "positive" && "text-emerald",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg bg-secondary p-2.5", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

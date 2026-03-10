import { motion } from "framer-motion";
import { Store, Check, ArrowRight } from "lucide-react";
import { b2bPlans } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function B2BPortal() {
  return (
    <div className="space-y-6 p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Federación Comercial B2B</h1>
        <p className="text-sm text-muted-foreground">
          Planes de suscripción para comercios de Real del Monte
        </p>
      </motion.div>

      {/* Plans grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {b2bPlans.map((plan, i) => (
          <motion.div
            key={plan.sector}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "gradient-card rounded-xl border border-border p-6 shadow-card hover:border-gold/30 transition-colors",
              plan.sector === "Hoteles" && "border-gold/20 shadow-gold"
            )}
          >
            <div className="mb-4 text-4xl">{plan.icon}</div>
            <h3 className="text-lg font-bold">{plan.sector}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">MXN/mes</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {plan.businesses} comercios activos
            </p>

            <div className="mt-4 space-y-2">
              {plan.sector === "Hoteles" && (
                <>
                  <Benefit text="Reservas directas sin OTA" />
                  <Benefit text="Analítica de visitantes" />
                  <Benefit text="Dashboard de estancias" />
                </>
              )}
              {plan.sector === "Bares" && (
                <>
                  <Benefit text="Happy Hour Digital geolocalizado" />
                  <Benefit text="Alertas de eventos" />
                </>
              )}
              {plan.sector === "Pasterías/Platerías" && (
                <>
                  <Benefit text="Nodo de Energía para jugadores" />
                  <Benefit text="Métricas de conversión" />
                </>
              )}
              {plan.sector === "Artesanías" && (
                <>
                  <Benefit text="Catálogo digital" />
                  <Benefit text="WhatsApp Business integrado" />
                </>
              )}
              {plan.sector === "Tiendas" && (
                <>
                  <Benefit text="Digitalización micro-negocio" />
                  <Benefit text="Ticket promedio analytics" />
                </>
              )}
              {plan.sector === "Góndolas/Semifijos" && (
                <>
                  <Benefit text="Geolocalización en mapa turístico" />
                  <Benefit text="Ubicación dinámica" />
                </>
              )}
            </div>

            <Button className="mt-5 w-full" variant="outline" size="sm">
              Suscribirse <ArrowRight className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* DAO Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="gradient-card rounded-xl border border-glow-teal p-5 shadow-teal"
      >
        <div className="flex items-start gap-3">
          <Store className="mt-0.5 h-5 w-5 text-teal shrink-0" />
          <div>
            <h3 className="font-semibold text-teal">Gobernanza DAO RDM</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Las cuotas, beneficios y reglas comerciales son ajustadas por la DAO de Real del Monte,
              sin modificar la arquitectura base TAMV. Los ingresos se liquidan y reportan en dashboards específicos de RDM.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Check className="h-3 w-3 text-emerald shrink-0" />
      <span className="text-secondary-foreground">{text}</span>
    </div>
  );
}

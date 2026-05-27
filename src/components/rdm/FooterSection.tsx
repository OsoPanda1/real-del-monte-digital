import { Mountain, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import rdmLogo from "@/assets/rdm-logo.png";

const links = {
  Explorar: [
    { label: "Historia Minera", path: "/historia" },
    { label: "Gastronomía", path: "/gastronomia" },
    { label: "Lugares", path: "/lugares" },
    { label: "Mapa Interactivo", path: "/mapa" },
    { label: "Rutas Turísticas", path: "/rutas" },
    { label: "Comunidad", path: "/comunidad" },
  ],
  Plataforma: [
    { label: "Dashboard CEO", path: "/dashboard" },
    { label: "Veta Soberana", path: "/game" },
    { label: "Portal B2B", path: "/b2b" },
    { label: "Realito AI", path: "/realito" },
  ],
};

export default function FooterSection() {
  return (
    <footer className="relative border-t border-border/20 bg-card/50 backdrop-blur-xl">
      {/* Glow / campo energético */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, hsl(43 80% 55% / 0.06), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Marca y narrativa */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={rdmLogo}
                alt="RDM"
                className="h-12 w-12 object-contain drop-shadow-[0_0_18px_rgba(212,175,55,0.5)]"
              />
              <div>
                <p className="text-lg font-display font-bold text-gradient-gold">
                  RDM DIGITAL
                </p>
                <p className="text-[9px] font-mono text-muted-foreground tracking-[0.25em]">
                  TAMV · MD-X5 · NODO CERO
                </p>
              </div>
            </div>

            <p className="text-[13px] font-body text-muted-foreground leading-relaxed max-w-sm">
              Infraestructura cognitiva soberana para Real del Monte: turismo,
              economía local y experiencia territorial operando como un sistema
              operativo vivo.
            </p>

            <div className="space-y-2 text-[12px] font-body text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                Real del Monte, Hidalgo, México
              </div>
              <div className="flex items-center gap-2">
                <Mountain className="h-3.5 w-3.5 text-gold" />
                2,700 msnm · Pueblo Mágico
              </div>
            </div>

            {/* HUD de estado */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/30 bg-background/80 px-3 py-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                Infraestructura territorial · ONLINE · INSTANCIA SOBERANA
              </span>
            </div>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/70 mb-5">
              Explorar territorio
            </h4>
            <ul className="space-y-3">
              {links.Explorar.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[13px] font-body text-muted-foreground hover:text-gold transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/70 mb-5">
              Plataforma operativa
            </h4>
            <ul className="space-y-3">
              {links.Plataforma.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-1.5 text-[13px] font-body text-muted-foreground hover:text-gold transition-colors duration-300"
                  >
                    <span>{item.label}</span>
                    {item.path === "/realito" && (
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-gold/70">
                        AI
                      </span>
                    )}
                    {item.path === "/dashboard" && (
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/70">
                        OPS
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto / Red */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/70 mb-5">
              Contacto y red
            </h4>
            <div className="space-y-4 text-[13px] font-body text-muted-foreground">
              <a
                href="mailto:contacto@rdmdigital.mx"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>contacto@rdmdigital.mx</span>
              </a>
              <a
                href="tel:+527711234567"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>+52 771 123 4567</span>
              </a>
              <a
                href="https://tamv.online"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>TAMV Online Network</span>
              </a>
            </div>
          </div>
        </div>

        {/* Franja inferior */}
        <div className="mt-16 pt-8 border-t border-border/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-muted-foreground/50">
            © 2026 RDM Digital · TAMV MD-X5 · Infraestructura cognitiva de Real
            del Monte.
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/35 tracking-[0.18em] uppercase">
            Territorio como sistema operativo · LATAM.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Mountain, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import rdmLogo from "@/assets/rdm-logo.png";

const links = {
  Explorar: [
    { label: "Historia Minera", path: "/historia" },
    { label: "Gastronomía", path: "/gastronomia" },
    { label: "Lugares", path: "/lugares" },
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
    <footer className="relative border-t border-border/20 bg-card/30 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 100%, hsl(43 80% 55% / 0.03), transparent)"
      }} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <img src={rdmLogo} alt="RDM" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-lg font-display font-bold text-gradient-gold">RDM DIGITAL</p>
                <p className="text-[9px] font-mono text-muted-foreground tracking-[0.2em]">TAMV MD-X5</p>
              </div>
            </div>
            <p className="text-[13px] font-body text-muted-foreground leading-relaxed">
              El sistema operativo soberano de Real del Monte. Turismo, economía local y gamificación
              territorial unificados en una experiencia digital sin precedentes.
            </p>
            <div className="space-y-2 text-[12px] font-body text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> Real del Monte, Hidalgo, México</div>
              <div className="flex items-center gap-2"><Mountain className="h-3.5 w-3.5 text-gold" /> 2,700 msnm · Pueblo Mágico</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/60 mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-[13px] font-body text-muted-foreground hover:text-gold transition-colors duration-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold/60 mb-5">Contacto</h4>
            <div className="space-y-4 text-[13px] font-body text-muted-foreground">
              <a href="mailto:contacto@rdmdigital.mx" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="h-3.5 w-3.5" /> contacto@rdmdigital.mx
              </a>
              <a href="tel:+527711234567" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="h-3.5 w-3.5" /> +52 771 123 4567
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-muted-foreground/40">
            © 2026 RDM Digital · TAMV MD-X5 · Instancia Soberana
          </p>
          <div className="separator-gradient w-20 md:hidden" />
          <p className="text-[10px] font-mono text-muted-foreground/30 tracking-wider">
            Hecho con ❤️ para Real del Monte
          </p>
        </div>
      </div>
    </footer>
  );
}

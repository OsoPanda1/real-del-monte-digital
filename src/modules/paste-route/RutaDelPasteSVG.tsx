import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Clock, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

type Poi = {
  id: string;
  name: string;
  x: number; // 0..1000
  y: number; // 0..600
  type: "pasteria" | "mirador" | "mina" | "plaza";
  desc: string;
  rating: number;
  schedule: string;
};

const POIS: Poi[] = [
  { id: "p1", name: "El Portal", x: 180, y: 380, type: "pasteria", desc: "Pastería tradicional fundada en 1930. Hornos de leña y receta original cornish.", rating: 4.9, schedule: "08:00 – 21:00" },
  { id: "p2", name: "Real Cornish", x: 380, y: 280, type: "pasteria", desc: "Hogar del paste premiado en la Feria Internacional. Mole, piña y crema irlandesa.", rating: 5.0, schedule: "09:00 – 22:00" },
  { id: "p3", name: "Mina del Oro Pastes", x: 580, y: 360, type: "pasteria", desc: "Variedades extremas: chilorio, queso azul y postre de zarzamora.", rating: 4.8, schedule: "07:30 – 20:00" },
  { id: "p4", name: "Plaza Principal", x: 460, y: 470, type: "plaza", desc: "Kiosco neoclásico, punto de encuentro y degustación al aire libre.", rating: 4.7, schedule: "Acceso libre 24/7" },
  { id: "p5", name: "Mina de Acosta", x: 760, y: 200, type: "mina", desc: "Museo minero. Final culinario con paste de minero servido bajo tierra.", rating: 4.9, schedule: "10:00 – 17:00" },
  { id: "p6", name: "Mirador Panteón Inglés", x: 820, y: 480, type: "mirador", desc: "Vista al cementerio inglés, origen cultural del paste en Real del Monte.", rating: 4.8, schedule: "08:00 – 18:00" },
];

const TYPE_COLOR: Record<Poi["type"], string> = {
  pasteria: "#D4AF37",
  mirador: "#7DD3FC",
  mina: "#C97B4A",
  plaza: "#A78BFA",
};

const PATH = "M 180 380 Q 280 320 380 280 T 580 360 Q 520 430 460 470 Q 620 480 760 200 Q 800 360 820 480";

export default function RutaDelPasteSVG() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [drag, setDrag] = useState<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [selected, setSelected] = useState<Poi | null>(null);

  const reset = () => { setScale(1); setTx(0); setTy(0); };
  const zoom = (delta: number, cx?: number, cy?: number) => {
    setScale((s) => {
      const ns = Math.min(3.5, Math.max(0.7, s + delta));
      if (cx != null && cy != null) {
        const k = ns / s;
        setTx((p) => cx - (cx - p) * k);
        setTy((p) => cy - (cy - p) * k);
      }
      return ns;
    });
  };

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoom(e.deltaY > 0 ? -0.15 : 0.15, e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  return (
    <div className="relative">
      <div
        ref={wrapRef}
        className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-navy-dark via-navy to-charcoal aspect-[5/3] cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => setDrag({ x: e.clientX, y: e.clientY, tx, ty })}
        onMouseMove={(e) => { if (drag) { setTx(drag.tx + (e.clientX - drag.x)); setTy(drag.ty + (e.clientY - drag.y)); } }}
        onMouseUp={() => setDrag(null)}
        onMouseLeave={() => setDrag(null)}
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full"
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "0 0", transition: drag ? "none" : "transform 0.2s ease-out" }}
        >
          <defs>
            <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C97B4A" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Stylized topography */}
          <path d="M 0 500 Q 200 420 400 460 T 800 440 L 1000 480 L 1000 600 L 0 600 Z" fill="hsl(var(--forest))" opacity="0.25" />
          <path d="M 0 540 Q 250 480 500 510 T 1000 520 L 1000 600 L 0 600 Z" fill="hsl(var(--forest))" opacity="0.4" />

          {/* Route */}
          <path d={PATH} fill="none" stroke="url(#route-grad)" strokeWidth="5" strokeDasharray="10 6" filter="url(#glow)" strokeLinecap="round" />
          <path d={PATH} fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

          {/* POIs */}
          {POIS.map((p, i) => (
            <g key={p.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelected(p); }}>
              <circle cx={p.x} cy={p.y} r="22" fill={TYPE_COLOR[p.type]} opacity="0.18" />
              <circle cx={p.x} cy={p.y} r="14" fill={TYPE_COLOR[p.type]} stroke="#fff" strokeWidth="2" filter="url(#glow)" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0d0d0d">{i + 1}</text>
              <text x={p.x} y={p.y - 24} textAnchor="middle" fontSize="11" fill="#f0d78c" fontFamily="'Cormorant Garamond', serif" fontStyle="italic">{p.name}</text>
            </g>
          ))}
        </svg>

        {/* Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={() => zoom(0.25)} className="h-9 w-9 rounded-lg bg-navy-dark/80 backdrop-blur border border-gold/30 text-gold hover:bg-gold/10 flex items-center justify-center"><ZoomIn className="h-4 w-4" /></button>
          <button onClick={() => zoom(-0.25)} className="h-9 w-9 rounded-lg bg-navy-dark/80 backdrop-blur border border-gold/30 text-gold hover:bg-gold/10 flex items-center justify-center"><ZoomOut className="h-4 w-4" /></button>
          <button onClick={reset} className="h-9 w-9 rounded-lg bg-navy-dark/80 backdrop-blur border border-gold/30 text-gold hover:bg-gold/10 flex items-center justify-center"><RotateCcw className="h-4 w-4" /></button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider">
          {Object.entries(TYPE_COLOR).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-navy-dark/70 backdrop-blur border border-border/30 text-platinum/80">
              <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {k}
            </span>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-4 rounded-2xl border border-gold/25 bg-gradient-to-br from-navy-dark/95 to-charcoal/95 p-5 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLOR[selected.type] }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70">{selected.type}</span>
                </div>
                <h3 className="font-display text-2xl text-platinum">{selected.name}</h3>
                <p className="mt-2 text-sm font-body text-muted-foreground">{selected.desc}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-platinum/75">
                  <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-gold" /> {selected.rating}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-gold" /> {selected.schedule}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-gold" /> Real del Monte</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="h-8 w-8 rounded-full bg-border/30 hover:bg-border/50 flex items-center justify-center text-platinum"><X className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Pickaxe, Store, Utensils, Gem, Mountain, Camera, X, Star, Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Real del Monte center coordinates
const RDM_CENTER: [number, number] = [20.1413, -98.6735];
const RDM_ZOOM = 15;

type MarkerCategory = "poi" | "mining" | "commerce" | "gastro";

interface MapMarker {
  id: string;
  name: string;
  category: MarkerCategory;
  lat: number;
  lng: number;
  description: string;
  rating?: number;
  schedule?: string;
  icon: string;
}

const markers: MapMarker[] = [
  // Points of interest
  { id: "plaza", name: "Plaza Principal", category: "poi", lat: 20.1413, lng: -98.6735, description: "Corazón del pueblo con arquitectura colonial, kiosco y vista panorámica.", rating: 4.9, schedule: "24 horas", icon: "🏛️" },
  { id: "panteon", name: "Panteón Inglés", category: "poi", lat: 20.1445, lng: -98.6710, description: "Único cementerio británico en Latinoamérica con vistas a la sierra.", rating: 4.8, schedule: "8:00-18:00", icon: "⛪" },
  { id: "museo", name: "Museo de Medicina Laboral", category: "poi", lat: 20.1400, lng: -98.6720, description: "Historia de la medicina minera del siglo XIX en Real del Monte.", rating: 4.6, schedule: "10:00-17:00", icon: "🏥" },
  { id: "hiloche", name: "Cerro del Hiloche", category: "poi", lat: 20.1480, lng: -98.6800, description: "Mirador natural con vistas panorámicas de la sierra de Pachuca.", rating: 4.7, schedule: "6:00-18:00", icon: "🏔️" },

  // Mining nodes (game)
  { id: "acosta", name: "Mina de Acosta", category: "mining", lat: 20.1430, lng: -98.6760, description: "Galerías coloniales del siglo XVIII. Nodo de minería digital: Oro y Plata.", rating: 4.9, schedule: "9:00-17:00", icon: "⛏️" },
  { id: "veta1", name: "Veta La Rica", category: "mining", lat: 20.1395, lng: -98.6705, description: "Nodo de minería digital: Cuarzo y Pirita. Spawn rate alto.", icon: "💎" },
  { id: "veta2", name: "Socavón del Rey", category: "mining", lat: 20.1420, lng: -98.6780, description: "Nodo premium: Plata y Oro. Requiere Pico Cornish.", icon: "🪨" },
  { id: "veta3", name: "Galería San Ramón", category: "mining", lat: 20.1460, lng: -98.6745, description: "Nodo estándar: Cuarzo frecuente. Ideal para principiantes.", icon: "⚒️" },

  // Commerce
  { id: "artesanias", name: "Artesanías RDM", category: "commerce", lat: 20.1408, lng: -98.6730, description: "Platería, textiles y artesanía local. Catálogo digital activo.", rating: 4.5, schedule: "9:00-19:00", icon: "🎨" },
  { id: "plateria", name: "La Plata Viva", category: "commerce", lat: 20.1418, lng: -98.6722, description: "Joyería y platería fina de Real del Monte. Nodo de Energía.", rating: 4.7, schedule: "10:00-18:00", icon: "💍" },
  { id: "tienda1", name: "Tienda El Minero", category: "commerce", lat: 20.1405, lng: -98.6745, description: "Souvenirs, ropa y productos locales del pueblo mágico.", rating: 4.3, schedule: "9:00-20:00", icon: "🏪" },

  // Gastronomy
  { id: "portal", name: "El Portal", category: "gastro", lat: 20.1415, lng: -98.6728, description: "Pastes tradicionales cornish. Nodo de Energía: +15 recarga.", rating: 4.9, schedule: "8:00-20:00", icon: "🥧" },
  { id: "cornish", name: "Real Cornish Pastes", category: "gastro", lat: 20.1410, lng: -98.6740, description: "Pastes artesanales desde 1980. Receta original británica.", rating: 4.8, schedule: "9:00-19:00", icon: "🥟" },
  { id: "minaoro", name: "Mina del Oro Café", category: "gastro", lat: 20.1422, lng: -98.6718, description: "Café de especialidad y pastes gourmet con vista a la plaza.", rating: 4.7, schedule: "8:00-21:00", icon: "☕" },
  { id: "bar1", name: "Bar El Socavón", category: "gastro", lat: 20.1402, lng: -98.6752, description: "Coctelería artesanal y mezcal. Happy Hour Digital activo.", rating: 4.6, schedule: "16:00-01:00", icon: "🍺" },
];

const categoryConfig: Record<MarkerCategory, { label: string; color: string; bgClass: string; textClass: string; borderClass: string; icon: typeof MapPin }> = {
  poi: { label: "Puntos de Interés", color: "#3B82F6", bgClass: "bg-electric/15", textClass: "text-electric", borderClass: "border-electric/20", icon: Camera },
  mining: { label: "Nodos de Minería", color: "#D4AF37", bgClass: "bg-gold/15", textClass: "text-gold", borderClass: "border-gold/20", icon: Pickaxe },
  commerce: { label: "Comercios", color: "#2DD4BF", bgClass: "bg-teal/15", textClass: "text-teal", borderClass: "border-teal/20", icon: Store },
  gastro: { label: "Gastronomía", color: "#E77C40", bgClass: "bg-copper/15", textClass: "text-copper", borderClass: "border-copper/20", icon: Utensils },
};

function createCustomIcon(category: MarkerCategory, emoji: string) {
  const color = categoryConfig[category].color;
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 40px; height: 40px; 
      background: ${color}22; 
      border: 2px solid ${color}; 
      border-radius: 12px; 
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; 
      box-shadow: 0 0 20px ${color}33;
      backdrop-filter: blur(8px);
    ">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

export default function Mapa() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeFilters, setActiveFilters] = useState<MarkerCategory[]>(["poi", "mining", "commerce", "gastro"]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const toggleFilter = (cat: MarkerCategory) => {
    setActiveFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current, {
      center: RDM_CENTER,
      zoom: RDM_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(leafletMap.current);

    L.control.zoom({ position: "bottomright" }).addTo(leafletMap.current);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(leafletMap.current);

    markersLayerRef.current = L.layerGroup().addTo(leafletMap.current);

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  // Update markers on filter change
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    markers
      .filter((m) => activeFilters.includes(m.category))
      .forEach((m) => {
        const marker = L.marker([m.lat, m.lng], {
          icon: createCustomIcon(m.category, m.icon),
        });
        marker.on("click", () => {
          setSelectedMarker(m);
          leafletMap.current?.flyTo([m.lat, m.lng], 17, { duration: 0.8 });
        });
        markersLayerRef.current!.addLayer(marker);
      });
  }, [activeFilters]);

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <section className="relative pt-28 pb-12 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                <Navigation className="h-5 w-5 text-gold" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70">
                Gemelo Digital Territorial
              </p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Mapa <span className="text-gradient-gold">Interactivo</span>
            </h1>
            <p className="mt-3 text-sm font-body text-muted-foreground max-w-lg">
              Explora todos los puntos de interés, nodos de minería digital, comercios y gastronomía de Real del Monte en tiempo real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 lg:px-12 pb-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {(Object.entries(categoryConfig) as [MarkerCategory, typeof categoryConfig[MarkerCategory]][]).map(([key, cfg]) => {
              const active = activeFilters.includes(key);
              const count = markers.filter((m) => m.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[12px] font-body font-medium transition-all duration-300 border",
                    active
                      ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}`
                      : "bg-secondary/20 text-muted-foreground border-border/20 hover:bg-secondary/40"
                  )}
                >
                  <cfg.icon className="h-4 w-4" />
                  {cfg.label}
                  <span className={cn(
                    "ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md",
                    active ? "bg-foreground/10" : "bg-secondary/40"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl overflow-hidden border border-border/20 shadow-elevated"
          >
            <div ref={mapRef} className="h-[600px] lg:h-[700px] w-full" />

            {/* Selected marker detail */}
            <AnimatePresence>
              {selectedMarker && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-4 left-4 w-80 glass rounded-2xl p-5 z-[1000]"
                >
                  <button
                    onClick={() => setSelectedMarker(null)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-gold transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{selectedMarker.icon}</span>
                    <div>
                      <h3 className="text-lg font-display font-bold">{selectedMarker.name}</h3>
                      <span className={cn(
                        "text-[10px] font-mono uppercase tracking-wider",
                        categoryConfig[selectedMarker.category].textClass
                      )}>
                        {categoryConfig[selectedMarker.category].label}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] font-body text-muted-foreground leading-relaxed">
                    {selectedMarker.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
                    {selectedMarker.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-gold fill-gold" />
                        {selectedMarker.rating}
                      </span>
                    )}
                    {selectedMarker.schedule && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedMarker.schedule}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 glass rounded-xl p-3 z-[1000]">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                {markers.filter((m) => activeFilters.includes(m.category)).length} puntos activos
              </p>
              <div className="flex gap-3">
                {(Object.entries(categoryConfig) as [MarkerCategory, typeof categoryConfig[MarkerCategory]][]).map(([key, cfg]) => (
                  activeFilters.includes(key) && (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-[10px] font-mono text-muted-foreground">{cfg.label.split(" ").pop()}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

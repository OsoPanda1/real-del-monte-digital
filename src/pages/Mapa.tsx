import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Pickaxe, Store, Utensils, Camera, X, Star, Clock, Navigation, Search, Locate, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  image_url?: string;
}

const categoryConfig: Record<MarkerCategory, { label: string; color: string; bgClass: string; textClass: string; borderClass: string; icon: typeof MapPin }> = {
  poi: { label: "Puntos de Interés", color: "#3B82F6", bgClass: "bg-electric/15", textClass: "text-electric", borderClass: "border-electric/30", icon: Camera },
  mining: { label: "Nodos de Minería", color: "#D4AF37", bgClass: "bg-gold/15", textClass: "text-gold", borderClass: "border-gold/30", icon: Pickaxe },
  commerce: { label: "Comercios", color: "#2DD4BF", bgClass: "bg-teal/15", textClass: "text-teal", borderClass: "border-teal/30", icon: Store },
  gastro: { label: "Gastronomía", color: "#E77C40", bgClass: "bg-copper/15", textClass: "text-copper", borderClass: "border-copper/30", icon: Utensils },
};

const fallbackMarkers: MapMarker[] = [
  { id: "plaza", name: "Plaza Principal", category: "poi", lat: 20.1413, lng: -98.6735, description: "Corazón del pueblo con arquitectura colonial.", rating: 4.9, schedule: "24 horas", icon: "🏛️" },
  { id: "panteon", name: "Panteón Inglés", category: "poi", lat: 20.1445, lng: -98.6710, description: "Único cementerio británico en Latinoamérica.", rating: 4.8, schedule: "8:00-18:00", icon: "⛪" },
  { id: "museo", name: "Museo de Medicina Laboral", category: "poi", lat: 20.1400, lng: -98.6720, description: "Historia de la medicina minera del siglo XIX.", rating: 4.6, schedule: "10:00-17:00", icon: "🏥" },
  { id: "hiloche", name: "Cerro del Hiloche", category: "poi", lat: 20.1480, lng: -98.6800, description: "Mirador natural con vistas panorámicas.", rating: 4.7, schedule: "6:00-18:00", icon: "🏔️" },
  { id: "acosta", name: "Mina de Acosta", category: "mining", lat: 20.1430, lng: -98.6760, description: "Galerías coloniales del siglo XVIII. Nodo de minería: Oro y Plata.", rating: 4.9, schedule: "9:00-17:00", icon: "⛏️" },
  { id: "veta1", name: "Veta La Rica", category: "mining", lat: 20.1395, lng: -98.6705, description: "Nodo de minería digital: Cuarzo y Pirita.", icon: "💎" },
  { id: "veta2", name: "Socavón del Rey", category: "mining", lat: 20.1420, lng: -98.6780, description: "Nodo premium: Plata y Oro.", icon: "🪨" },
];

function createCustomIcon(category: MarkerCategory, emoji: string, isActive: boolean = false) {
  const color = categoryConfig[category].color;
  const size = isActive ? 52 : 44;
  return L.divIcon({
    className: "rdm-marker",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${color}33;animation:rdmPulse 2.4s ease-out infinite;"></div>
        <div style="position:absolute;inset:6px;background:linear-gradient(135deg,${color}ee,${color}99);border:2px solid ${color};border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:${isActive ? 22 : 18}px;box-shadow:0 4px 16px ${color}66, inset 0 1px 0 rgba(255,255,255,0.2);backdrop-filter:blur(8px);">${emoji}</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export default function Mapa() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [activeFilters, setActiveFilters] = useState<MarkerCategory[]>(["poi", "mining", "commerce", "gastro"]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const { data: dbPlaces } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const { data } = await supabase.from("places").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const { data: dbBusinesses } = useQuery({
    queryKey: ["businesses-map"],
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("is_active", true).eq("is_subscribed", true);
      return data || [];
    },
  });

  const { data: dbNodes } = useQuery({
    queryKey: ["mining-nodes"],
    queryFn: async () => {
      const { data } = await supabase.from("mining_nodes").select("*").eq("is_active", true);
      return data || [];
    },
  });

  const allMarkers: MapMarker[] = (() => {
    const dbMarkers: MapMarker[] = [
      ...(dbPlaces || []).map((p: any) => ({ id: p.id, name: p.name, category: (p.category === "gastro" ? "gastro" : "poi") as MarkerCategory, lat: p.lat, lng: p.lng, description: p.description || "", rating: Number(p.rating) || undefined, schedule: p.schedule || undefined, icon: p.icon || "📍", image_url: p.image_url })),
      ...(dbBusinesses || []).map((b: any) => ({ id: b.id, name: b.name, category: (b.sector === "Gastronomía" ? "gastro" : "commerce") as MarkerCategory, lat: b.lat || 20.1413, lng: b.lng || -98.6735, description: b.description || "", icon: b.icon || "🏪", image_url: b.image_url })),
      ...(dbNodes || []).map((n: any) => ({ id: n.id, name: n.name, category: "mining" as MarkerCategory, lat: n.lat, lng: n.lng, description: `${n.mineral_type} · Rareza: ${n.rarity}`, icon: "⛏️" })),
    ];
    return dbMarkers.length > 0 ? dbMarkers : fallbackMarkers;
  })();

  const filteredMarkers = allMarkers
    .filter((m) => activeFilters.includes(m.category))
    .filter((m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleFilter = (cat: MarkerCategory) => {
    setActiveFilters((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const flyToMarker = (m: MapMarker) => {
    setSelectedMarker(m);
    leafletMap.current?.flyTo([m.lat, m.lng], 17, { duration: 0.9 });
  };

  const recenterMap = () => {
    leafletMap.current?.flyTo(RDM_CENTER, RDM_ZOOM, { duration: 0.8 });
    setSelectedMarker(null);
  };

  const locateMe = () => {
    if (!navigator.geolocation || !leafletMap.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const userLatLng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      if (userMarkerRef.current) leafletMap.current!.removeLayer(userMarkerRef.current);
      userMarkerRef.current = L.marker(userLatLng, {
        icon: L.divIcon({
          className: "user-loc",
          html: `<div style="width:18px;height:18px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 8px rgba(59,130,246,0.25);"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).addTo(leafletMap.current!);
      leafletMap.current!.flyTo(userLatLng, 16, { duration: 0.8 });
    });
  };

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    leafletMap.current = L.map(mapRef.current, { center: RDM_CENTER, zoom: RDM_ZOOM, zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(leafletMap.current);
    L.control.zoom({ position: "bottomright" }).addTo(leafletMap.current);
    markersLayerRef.current = L.layerGroup().addTo(leafletMap.current);

    // inject pulse keyframes once
    if (!document.getElementById("rdm-marker-keyframes")) {
      const style = document.createElement("style");
      style.id = "rdm-marker-keyframes";
      style.textContent = `@keyframes rdmPulse{0%{transform:scale(0.8);opacity:0.7}80%{transform:scale(1.6);opacity:0}100%{transform:scale(1.6);opacity:0}}`;
      document.head.appendChild(style);
    }

    return () => { leafletMap.current?.remove(); leafletMap.current = null; };
  }, []);

  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();
    filteredMarkers.forEach((m) => {
      const isActive = selectedMarker?.id === m.id;
      const marker = L.marker([m.lat, m.lng], { icon: createCustomIcon(m.category, m.icon, isActive) });
      marker.on("click", () => flyToMarker(m));
      markersLayerRef.current!.addLayer(marker);
    });
  }, [filteredMarkers, selectedMarker]);

  return (
    <div className="min-h-screen relative">
      <section className="relative pt-28 pb-8 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                <Navigation className="h-5 w-5 text-gold" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70">Gemelo Digital Territorial</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Mapa <span className="text-gradient-gold">Inmersivo</span>
            </h1>
            <p className="mt-3 text-sm font-body text-muted-foreground max-w-lg">
              Explora puntos de interés, nodos de minería digital, comercios oficiales y gastronomía en tiempo real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="px-6 lg:px-12 pb-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar lugar, restaurante, mina..."
                className="w-full pl-11 pr-4 py-3 rounded-xl glass text-sm font-body placeholder:text-muted-foreground/50 outline-none focus:border-gold/40 transition-all"
              />
            </div>
            <button onClick={() => setShowSidebar((s) => !s)} className="flex items-center gap-2 rounded-xl glass px-4 py-3 text-[12px] font-body text-muted-foreground hover:text-gold transition-all">
              <Layers className="h-4 w-4" />
              {showSidebar ? "Ocultar lista" : "Mostrar lista"}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {(Object.entries(categoryConfig) as [MarkerCategory, typeof categoryConfig[MarkerCategory]][]).map(([key, cfg]) => {
              const active = activeFilters.includes(key);
              const count = allMarkers.filter((m) => m.category === key).length;
              return (
                <button key={key} onClick={() => toggleFilter(key)}
                  className={cn("flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[12px] font-body font-medium transition-all duration-300 border",
                    active ? `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass}` : "bg-secondary/20 text-muted-foreground border-border/20 hover:bg-secondary/40")}>
                  <cfg.icon className="h-4 w-4" />{cfg.label}
                  <span className={cn("ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md", active ? "bg-foreground/10" : "bg-secondary/40")}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map + Sidebar */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className={cn("grid gap-4 transition-all duration-500", showSidebar ? "lg:grid-cols-[320px_1fr]" : "grid-cols-1")}>
            {/* Sidebar list */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-3xl glass-card border border-border/20 p-4 max-h-[700px] overflow-y-auto space-y-2"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 pb-2">
                    {filteredMarkers.length} resultados
                  </p>
                  {filteredMarkers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => flyToMarker(m)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 rounded-xl p-3 transition-all duration-200 border",
                        selectedMarker?.id === m.id
                          ? `${categoryConfig[m.category].bgClass} ${categoryConfig[m.category].borderClass}`
                          : "border-transparent hover:bg-secondary/30"
                      )}
                    >
                      <span className="text-2xl shrink-0">{m.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-body font-medium truncate">{m.name}</p>
                        <p className={cn("text-[10px] font-mono uppercase tracking-wider mt-0.5", categoryConfig[m.category].textClass)}>
                          {categoryConfig[m.category].label}
                        </p>
                        {m.rating && (
                          <p className="text-[10px] font-mono text-muted-foreground mt-1 flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-gold text-gold" />{m.rating}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-3xl overflow-hidden border border-border/20 shadow-elevated">
              <div ref={mapRef} className="h-[700px] w-full" />

              {/* Floating controls top-left */}
              <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <button onClick={recenterMap} className="h-10 w-10 flex items-center justify-center rounded-xl glass border border-border/20 text-muted-foreground hover:text-gold transition-all" title="Centrar en RDM">
                  <Navigation className="h-4 w-4" />
                </button>
                <button onClick={locateMe} className="h-10 w-10 flex items-center justify-center rounded-xl glass border border-border/20 text-muted-foreground hover:text-electric transition-all" title="Mi ubicación">
                  <Locate className="h-4 w-4" />
                </button>
              </div>

              {/* Detail card */}
              <AnimatePresence>
                {selectedMarker && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 glass-card border border-border/30 rounded-2xl overflow-hidden z-[1000] shadow-elevated"
                  >
                    {selectedMarker.image_url && (
                      <div className="h-32 w-full overflow-hidden">
                        <img src={selectedMarker.image_url} alt={selectedMarker.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-5 relative">
                      <button onClick={() => setSelectedMarker(null)} className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full bg-secondary/40 text-muted-foreground hover:text-gold transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{selectedMarker.icon}</span>
                        <div>
                          <h3 className="text-lg font-display font-bold leading-tight">{selectedMarker.name}</h3>
                          <span className={cn("text-[10px] font-mono uppercase tracking-wider", categoryConfig[selectedMarker.category].textClass)}>
                            {categoryConfig[selectedMarker.category].label}
                          </span>
                        </div>
                      </div>
                      <p className="text-[13px] font-body text-muted-foreground leading-relaxed">{selectedMarker.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
                        {selectedMarker.rating && (<span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold fill-gold" />{selectedMarker.rating}</span>)}
                        {selectedMarker.schedule && (<span className="flex items-center gap-1"><Clock className="h-3 w-3" />{selectedMarker.schedule}</span>)}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl gradient-gold px-3 py-2.5 text-[12px] font-body font-semibold text-primary-foreground shadow-gold hover:shadow-elevated transition-all"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Cómo llegar
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

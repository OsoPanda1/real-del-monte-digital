/**
 * Banda dedicatoria con shimmer platino — aparece en todas las páginas.
 */
export default function DedicationBand() {
  return (
    <div
      aria-label="Dedicatoria"
      className="w-full border-t border-platinum/15 bg-gradient-to-r from-transparent via-platinum/[0.04] to-transparent py-5 px-6 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(229,228,226,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 6s ease-in-out infinite",
        }}
      />
      <p className="font-display italic tracking-wide text-[13px] md:text-sm text-platinum/85 relative">
        <span className="bg-gradient-to-r from-platinum/60 via-platinum to-platinum/60 bg-clip-text text-transparent font-semibold">
          Orgullosamente Realmontenses
        </span>
        <span className="mx-2 text-platinum/30">·</span>
        <span className="text-platinum/75">
          Proyecto dedicado a mi madre <span className="text-gold/95 font-medium">Reyna Trejo Serrano</span>
        </span>
        <span className="mx-2 text-platinum/30">·</span>
        <span className="text-gold/80 text-[11px] uppercase tracking-[0.35em] font-mono">Tu Oveja Negra lo Logró</span>
      </p>
      <style>{`@keyframes shimmer { 0%,100% { background-position: -100% 0; } 50% { background-position: 200% 0; } }`}</style>
    </div>
  );
}

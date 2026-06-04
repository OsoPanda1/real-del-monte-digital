/**
 * Banda dedicatoria — aparece en todas las páginas.
 * "Orgullosamente Realmontenses · Proyecto dedicado a mi madre Reyna Trejo Serrano"
 */
export default function DedicationBand() {
  return (
    <div
      aria-label="Dedicatoria"
      className="w-full border-t border-platinum/15 bg-gradient-to-r from-transparent via-platinum/[0.04] to-transparent py-4 px-6 text-center"
    >
      <p className="font-display italic tracking-wide text-[13px] md:text-sm text-platinum/80">
        <span className="bg-gradient-to-r from-platinum/60 via-platinum to-platinum/60 bg-clip-text text-transparent">
          Orgullosamente Realmontenses
        </span>
        <span className="mx-2 text-platinum/30">·</span>
        <span className="text-platinum/75">
          Proyecto dedicado a mi madre <span className="text-gold/90 font-medium">Reyna Trejo Serrano</span>
        </span>
        <span className="mx-2 text-platinum/30">·</span>
        <span className="text-platinum/55 text-[11px] uppercase tracking-[0.3em]">Tu Oveja Negra lo Logró</span>
      </p>
    </div>
  );
}

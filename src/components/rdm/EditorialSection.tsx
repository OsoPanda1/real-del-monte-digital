import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditorialSectionProps {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  body: string[];
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  accentColor?: "gold" | "electric" | "copper" | "teal";
  metaTagline?: string;
}

const accentColors = {
  gold: {
    text: "text-gradient-gold",
    line: "bg-gold",
    badge: "bg-gold/10 text-gold border-gold/20",
    iconDot: "bg-gold",
  },
  electric: {
    text: "text-gradient-electric",
    line: "bg-electric",
    badge: "bg-electric/10 text-electric border-electric/20",
    iconDot: "bg-electric",
  },
  copper: {
    text: "text-copper",
    line: "bg-copper",
    badge: "bg-copper/10 text-copper border-copper/20",
    iconDot: "bg-copper",
  },
  teal: {
    text: "text-teal",
    line: "bg-teal",
    badge: "bg-teal/10 text-teal border-teal/20",
    iconDot: "bg-teal",
  },
} as const;

export default function EditorialSection({
  id,
  chapter,
  title,
  subtitle,
  body,
  image,
  imageAlt,
  imagePosition = "left",
  accentColor = "gold",
  metaTagline = "NODO_CERO · REAL_DEL_MONTE_DIGITAL",
}: EditorialSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const colors = accentColors[accentColor];

  // Motion values para leve efecto parallax / tilt
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 120, damping: 15 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 120, damping: 15 });

  useEffect(() => {
    if (!inView) return;
    // Pequeño reset suave cuando entra en vista
    tiltX.set(0);
    tiltY.set(0);
  }, [inView, tiltX, tiltY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(y * -6);
    tiltY.set(x * 6);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const imgBlock = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === "left" ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl aspect-[4/5] img-zoom shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
      style={{
        rotateX: tiltXSpring,
        rotateY: tiltYSpring,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
      {/* Badge capítulo */}
      <div
        className={cn(
          "absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border backdrop-blur-sm",
          colors.badge,
        )}
      >
        {chapter.split("·")[0]?.trim()}
      </div>
      {/* Corner accents */}
      <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-gold/20" />
      <div className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-gold/20" />
      {/* Micro HUD */}
      <div className="absolute right-4 bottom-4 text-[9px] font-mono uppercase tracking-[0.2em] text-[#f5f5f5]/60">
        RDM_EDITORIAL_NODE
      </div>
    </motion.div>
  );

  const textBlock = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="flex flex-col justify-center space-y-6"
    >
      {/* Meta header */}
      <div className="flex items-center gap-3">
        <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", colors.iconDot)} />
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          {chapter}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className={cn("h-[2px] w-16", colors.line)} />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
          {metaTagline}
        </span>
      </div>

      <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-tight">
        {title}
      </h2>

      <p className={cn("text-lg font-display italic", colors.text)}>{subtitle}</p>

      <div className="space-y-4">
        {body.map((p, i) => (
          <p
            key={i}
            className="text-[14px] font-body text-muted-foreground leading-[1.8]"
          >
            {p}
          </p>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section
      ref={ref}
      id={id}
      className="py-24 px-6 lg:px-12 bg-gradient-to-b from-background via-background/95 to-background"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "grid gap-10 lg:gap-16 items-center",
            imagePosition === "left"
              ? "lg:grid-cols-[1fr_1.2fr]"
              : "lg:grid-cols-[1.2fr_1fr]",
          )}
        >
          {imagePosition === "left" ? (
            <>
              {imgBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imgBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

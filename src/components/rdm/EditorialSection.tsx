import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
}

const accColors = {
  gold: { text: "text-gradient-gold", line: "bg-gold", badge: "bg-gold/10 text-gold border-gold/20" },
  electric: { text: "text-gradient-electric", line: "bg-electric", badge: "bg-electric/10 text-electric border-electric/20" },
  copper: { text: "text-copper", line: "bg-copper", badge: "bg-copper/10 text-copper border-copper/20" },
  teal: { text: "text-teal", line: "bg-teal", badge: "bg-teal/10 text-teal border-teal/20" },
};

export default function EditorialSection({
  id, chapter, title, subtitle, body, image, imageAlt,
  imagePosition = "left", accentColor = "gold",
}: EditorialSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const colors = accColors[accentColor];

  const imgBlock = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === "left" ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl aspect-[4/5] img-zoom"
    >
      <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      <div className={cn("absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest border backdrop-blur-sm", colors.badge)}>
        {chapter.split("·")[0]?.trim()}
      </div>
      {/* Corner accents */}
      <div className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-gold/20" />
      <div className="absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-gold/20" />
    </motion.div>
  );

  const textBlock = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="flex flex-col justify-center space-y-6"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">{chapter}</p>
      <div className={cn("h-[2px] w-16", colors.line)} />
      <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-tight">
        {title}
      </h2>
      <p className={cn("text-lg font-display italic", colors.text)}>{subtitle}</p>
      <div className="space-y-4">
        {body.map((p, i) => (
          <p key={i} className="text-[14px] font-body text-muted-foreground leading-[1.8]">{p}</p>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section ref={ref} id={id} className="py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className={cn(
          "grid gap-10 lg:gap-16 items-center",
          imagePosition === "left" ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]"
        )}>
          {imagePosition === "left" ? <>{imgBlock}{textBlock}</> : <>{textBlock}{imgBlock}</>}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ═══════════════════════════════════════════════════════
// 1. CANVAS FLOATING PARTICLES — Gold dust effect
// ═══════════════════════════════════════════════════════
export const FloatingParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; color: string;
    }

    const colors = ["#D4AF37", "#C9A227", "#B8941F", "#E5C100", "#8BA8C4"];
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.5 + 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" style={{ mixBlendMode: "screen" }} />;
};

// ═══════════════════════════════════════════════════════
// 2. FOG LAYER — Atmospheric mist
// ═══════════════════════════════════════════════════════
export const FogLayer = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      className="absolute inset-0 opacity-20"
      animate={{
        background: [
          "radial-gradient(ellipse 80% 50% at 20% 100%, rgba(200,200,220,0.3) 0%, transparent 50%)",
          "radial-gradient(ellipse 80% 50% at 80% 100%, rgba(200,200,220,0.4) 0%, transparent 50%)",
          "radial-gradient(ellipse 80% 50% at 20% 100%, rgba(200,200,220,0.3) 0%, transparent 50%)",
        ],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════
// 3. PARALLAX IMAGE
// ═══════════════════════════════════════════════════════
export const ParallaxImage = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale }} className="w-full h-full object-cover" />
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 4. TEXT REVEAL ON SCROLL
// ═══════════════════════════════════════════════════════
export const TextReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// 5. MAGNETIC BUTTON
// ═══════════════════════════════════════════════════════
export const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };
  const handleMouseLeave = () => { if (ref.current) ref.current.style.transform = "translate(0, 0)"; };

  return (
    <button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={onClick}
      className={`transition-transform duration-300 ease-out ${className}`} style={{ willChange: "transform" }}>
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════
// 6. SHIMMER BORDER
// ═══════════════════════════════════════════════════════
export const ShimmerBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-transparent via-gold to-transparent opacity-20 animate-pulse-gold" />
    <div className="relative rounded-2xl overflow-hidden">{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════
// 7. KEN BURNS BACKGROUND
// ═══════════════════════════════════════════════════════
export const KenBurnsBackground = ({ src }: { src: string }) => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${src})` }}
      animate={{ scale: [1, 1.1], x: ["0%", "-2%"], y: ["0%", "-2%"] }}
      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════
// 8. STAGGER CONTAINER + ITEM
// ═══════════════════════════════════════════════════════
export const StaggerContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// 9. GLOW CARD
// ═══════════════════════════════════════════════════════
export const GlowCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className={`relative group ${className}`}>
    <div className="absolute -inset-1 bg-gradient-to-r from-gold to-copper rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
    <div className="relative">{children}</div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════
// 10. MESH GRADIENT BACKGROUND
// ═══════════════════════════════════════════════════════
export const MeshGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/3 rounded-full blur-3xl" />
  </div>
);

// ═══════════════════════════════════════════════════════
// 11. GRADIENT SEPARATOR
// ═══════════════════════════════════════════════════════
export const GradientSeparator = ({ className = "" }: { className?: string }) => (
  <div className={`separator-gradient my-12 ${className}`} />
);

// ═══════════════════════════════════════════════════════
// 12. SECTION HEADER
// ═══════════════════════════════════════════════════════
export const SectionHeader = ({ title, subtitle, className = "" }: { title: string; subtitle?: string; className?: string }) => (
  <div className={`mb-12 ${className}`}>
    <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">{title}</h2>
    {subtitle && <p className="mt-3 text-base font-body text-muted-foreground max-w-xl">{subtitle}</p>}
  </div>
);

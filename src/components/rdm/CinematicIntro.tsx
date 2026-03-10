import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import rdmLogo from "@/assets/rdm-logo.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

// Canvas-based gold particle system
function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.6 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      color: ["#D4AF37", "#C9A227", "#E5C100", "#B8941F"][Math.floor(Math.random() * 4)],
    }));

    let raf: number;
    const draw = () => {
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
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" style={{ mixBlendMode: "screen" }} />;
}

// Cinematic letter-by-letter reveal
function LetterReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * 0.035, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 4200),
      setTimeout(() => setPhase(4), 6000),
      setTimeout(() => setPhase(5), 7800),
      setTimeout(() => setPhase(6), 9500),
      setTimeout(() => onComplete(), 10500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (!skipped) { setSkipped(true); onComplete(); }
  }, [skipped, onComplete]);

  return (
    <AnimatePresence>
      {!skipped && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleSkip}
          style={{ background: "hsl(222, 50%, 3%)" }}
        >
          {/* Ambient radial glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 2.5 }}
            style={{ background: "radial-gradient(ellipse 45% 45% at 50% 50%, hsl(43 80% 55% / 0.07), transparent 80%)" }}
          />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: `linear-gradient(rgba(212,178,106,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,178,106,0.4) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />

          {/* Cinematic bars */}
          <motion.div initial={{ height: "15%" }} animate={{ height: phase >= 6 ? "50%" : "12%" }}
            transition={{ duration: 1.5 }} className="absolute top-0 left-0 right-0 bg-black z-20" />
          <motion.div initial={{ height: "15%" }} animate={{ height: phase >= 6 ? "50%" : "12%" }}
            transition={{ duration: 1.5 }} className="absolute bottom-0 left-0 right-0 bg-black z-20" />

          {/* Canvas particles */}
          {phase >= 1 && <CanvasParticles />}

          {/* Scanning line */}
          {phase >= 1 && phase < 6 && (
            <motion.div className="absolute left-0 right-0 h-[1px] z-10"
              style={{ background: "linear-gradient(90deg, transparent, hsl(43 80% 55% / 0.25), transparent)" }}
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-8">
            {/* Phase 1: Logo */}
            {phase >= 1 && (
              <motion.div
                initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: phase >= 5 ? 0.75 : 1, opacity: phase >= 6 ? 0 : 1, filter: "blur(0px)", y: phase >= 5 ? -40 : 0 }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-8"
              >
                <div className="relative">
                  <img src={rdmLogo} alt="RDM Digital" className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-2xl" />
                  <motion.div className="absolute inset-0 rounded-full"
                    animate={{ boxShadow: ["0 0 30px 5px hsl(43 80% 55% / 0.1)", "0 0 60px 15px hsl(43 80% 55% / 0.2)", "0 0 30px 5px hsl(43 80% 55% / 0.1)"] }}
                    transition={{ duration: 3, repeat: Infinity }} />
                </div>
              </motion.div>
            )}

            {/* Phase 2-4: Narrative text */}
            {phase >= 2 && phase < 6 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 6 ? 0 : 1 }} className="mb-3">
                <LetterReveal text="En las entrañas de la sierra..." className="text-lg md:text-2xl font-display italic text-gold-light" />
              </motion.div>
            )}
            {phase >= 3 && phase < 6 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 6 ? 0 : 1 }} className="mb-3">
                <LetterReveal text="donde el oro y la plata forjaron historia" className="text-base md:text-xl font-display text-muted-foreground" />
              </motion.div>
            )}
            {phase >= 4 && phase < 6 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: phase >= 6 ? 0 : 1 }} className="mb-6">
                <LetterReveal text="nace el futuro digital de un pueblo mágico." className="text-base md:text-xl font-display text-foreground" />
              </motion.div>
            )}

            {/* Phase 5: Title */}
            {phase >= 5 && (
              <motion.div initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: phase >= 6 ? 0 : 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-3"
              >
                <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight">
                  <span className="text-gradient-gold">RDM</span>{" "}
                  <span className="text-foreground">DIGITAL</span>
                </h1>
                <motion.p initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 0.5, letterSpacing: "0.3em" }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="text-[10px] md:text-xs font-mono uppercase text-muted-foreground">
                  Sistema Operativo de Pueblo Mágico
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Skip */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-[14%] z-30 text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            Click para continuar
          </motion.p>

          {/* Corners */}
          <div className="absolute top-[12%] left-6 w-6 h-6 border-l border-t border-gold/20 z-30" />
          <div className="absolute top-[12%] right-6 w-6 h-6 border-r border-t border-gold/20 z-30" />
          <div className="absolute bottom-[12%] left-6 w-6 h-6 border-l border-b border-gold/20 z-30" />
          <div className="absolute bottom-[12%] right-6 w-6 h-6 border-r border-b border-gold/20 z-30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

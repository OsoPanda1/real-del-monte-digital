import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import rdmLogo from "@/assets/rdm-logo.png";

interface CinematicIntroProps {
  onComplete: () => void;
}

// Particle component for gold dust effect
function GoldParticles() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    opacity: Math.random() * 0.6 + 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(43 80% 65% / ${p.opacity}), transparent)`,
          }}
          animate={{
            y: [0, -80, -160],
            x: [0, Math.random() * 40 - 20],
            opacity: [0, p.opacity, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Cinematic text reveal
function TextReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.01 }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),    // Logo fade in
      setTimeout(() => setPhase(2), 2800),    // Text line 1
      setTimeout(() => setPhase(3), 4800),    // Text line 2
      setTimeout(() => setPhase(4), 6800),    // Text line 3
      setTimeout(() => setPhase(5), 8500),    // Final reveal
      setTimeout(() => setPhase(6), 10500),   // Fade out
      setTimeout(() => onComplete(), 11500),  // Done
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (!skipped) {
      setSkipped(true);
      onComplete();
    }
  }, [skipped, onComplete]);

  return (
    <AnimatePresence>
      {!skipped && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleSkip}
          style={{ background: "hsl(222, 50%, 3%)" }}
        >
          {/* Ambient background glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 2 }}
            style={{
              background: "radial-gradient(ellipse 50% 50% at 50% 50%, hsl(43 80% 55% / 0.06), transparent 80%)",
            }}
          />

          {/* Horizontal cinematic bars */}
          <div className="absolute top-0 left-0 right-0 h-[12%] bg-black z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-black z-20" />

          {/* Gold particles */}
          {phase >= 1 && <GoldParticles />}

          {/* Scanning line effect */}
          {phase >= 1 && phase < 6 && (
            <motion.div
              className="absolute left-0 right-0 h-[1px] z-10"
              style={{ background: "linear-gradient(90deg, transparent, hsl(43 80% 55% / 0.3), transparent)" }}
              animate={{ top: ["10%", "90%", "10%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl px-8">
            {/* Phase 1: Logo */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
                  animate={{
                    scale: phase >= 5 ? 0.8 : 1,
                    opacity: phase >= 6 ? 0 : 1,
                    filter: "blur(0px)",
                    y: phase >= 5 ? -30 : 0,
                  }}
                  transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mb-8"
                >
                  <div className="relative">
                    <img
                      src={rdmLogo}
                      alt="RDM Digital"
                      className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                    />
                    {/* Glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 30px 5px hsl(43 80% 55% / 0.1)",
                          "0 0 60px 15px hsl(43 80% 55% / 0.2)",
                          "0 0 30px 5px hsl(43 80% 55% / 0.1)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2: First line */}
            {phase >= 2 && phase < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                className="mb-4"
              >
                <TextReveal
                  text="En las entrañas de la sierra..."
                  className="text-lg md:text-2xl font-display italic text-gold-light tracking-wide"
                />
              </motion.div>
            )}

            {/* Phase 3: Second line */}
            {phase >= 3 && phase < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                className="mb-4"
              >
                <TextReveal
                  text="donde el oro y la plata forjaron historia"
                  delay={0}
                  className="text-base md:text-xl font-display text-muted-foreground"
                />
              </motion.div>
            )}

            {/* Phase 4: Third line */}
            {phase >= 4 && phase < 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 6 ? 0 : 1 }}
                className="mb-6"
              >
                <TextReveal
                  text="nace el futuro digital de un pueblo mágico."
                  delay={0}
                  className="text-base md:text-xl font-display text-foreground"
                />
              </motion.div>
            )}

            {/* Phase 5: Final title */}
            {phase >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: phase >= 6 ? 0 : 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-2"
              >
                <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight">
                  <span className="text-gradient-gold">RDM</span>{" "}
                  <span className="text-foreground">DIGITAL</span>
                </h1>
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 0.6, letterSpacing: "0.3em" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="text-[10px] md:text-xs font-mono uppercase text-muted-foreground"
                >
                  Sistema Operativo de Pueblo Mágico
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Skip indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-[14%] z-30 text-center"
          >
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              Click para continuar
            </p>
          </motion.div>

          {/* Corner markers — cinematic framing */}
          <div className="absolute top-[12%] left-6 w-6 h-6 border-l border-t border-gold/20 z-30" />
          <div className="absolute top-[12%] right-6 w-6 h-6 border-r border-t border-gold/20 z-30" />
          <div className="absolute bottom-[12%] left-6 w-6 h-6 border-l border-b border-gold/20 z-30" />
          <div className="absolute bottom-[12%] right-6 w-6 h-6 border-r border-b border-gold/20 z-30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

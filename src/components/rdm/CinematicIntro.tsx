import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import rdmLogo from "@/assets/rdm-logo.png";
import rdmIntroAudio from "@/assets/rdmintro.mp3";

type Stage = "BOOT" | "AUTH" | "ACCESS";

const STAGE_LABELS: Record<Stage, string> = {
  BOOT: "BOOTSTRAPING NODO_CERO",
  AUTH: "SOVEREIGN_AUTH",
  ACCESS: "RDM_OS_READY",
};

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("BOOT");
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const appendLog = (msg: string) =>
    setLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);

  useEffect(() => {
    // Inicialización de motor sonoro (Sound Design Industrial)
    audioRef.current = new Audio(rdmIntroAudio);
    audioRef.current.volume = 0.85;
    audioRef.current.play().catch(() => {
      console.warn("Audio Context Restricted");
    });

    const runSequence = async () => {
      const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

      appendLog("INITIALIZING NODO_CERO_CORE...");
      await wait(700);
      appendLog("LOADING TERRITORIAL_CONTEXT: REAL_DEL_MONTE_HGO_MX");
      await wait(700);
      appendLog("HANDSHAKE: CITEMESH_PROTOCOL_VERIFIED");
      await wait(900);
      appendLog("CHECKING SOVEREIGN_INFRASTRUCTURE: ONLINE");
      await wait(900);

      setStage("AUTH");
      appendLog("DECRYPTING SOVEREIGN_IDENTITY...");
      await wait(900);
      appendLog("VALIDATING RDM_OS_SIGNATURE...");
      await wait(900);
      appendLog("AUTH_CHANNEL: NODO_CERO → REAL_DEL_MONTE_DIGITAL");
      await wait(900);

      appendLog("ACCESS_GRANTED: RDM_CIVILIZATORY_ECOSYSTEM");
      setStage("ACCESS");
      await wait(1200);

      onComplete();
    };

    runSequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#020202] flex flex-col font-mono overflow-hidden">
      {/* Noise / glitch overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08]" />

      {/* Top Status Bar */}
      <div className="relative z-20 border-b border-[#D4AF37]/25 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.35em] text-[#D4AF37]">
              RDM_OS_V1.0
            </span>
          </div>
          <span className="text-[9px] uppercase text-[#D4AF37]/60 tracking-[0.25em]">
            NODO_CERO · TERRITORIAL_BOOTSTRAP
          </span>
        </div>

        <div className="flex gap-4 text-[9px] uppercase text-[#D4AF37]/60">
          <span>{STAGE_LABELS[stage]}</span>
          <span className="flex items-center gap-1">
            <span className="animate-pulse text-[11px] text-red-500">●</span>
            LIVE_LINK
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {stage === "BOOT" && (
            <motion.div
              key="boot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-xl px-6 text-[#D4AF37]/55 text-[11px] space-y-1"
            >
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#D4AF37]/30">▌</span>
                  <span>{log}</span>
                </div>
              ))}
            </motion.div>
          )}

          {stage === "AUTH" && (
            <motion.div
              key="auth"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.img
                src={rdmLogo}
                className="w-32 h-32 brightness-110 contrast-125 drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                initial={{ rotate: -4, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <div className="mt-8 text-white font-semibold text-xs tracking-[0.35em]">
                AUTENTICANDO NODO CERO
              </div>
              <div className="mt-3 text-[10px] text-[#D4AF37]/70 tracking-[0.25em] uppercase">
                REAL_DEL_MONTE · DIGITAL_SOVEREIGN_INFRASTRUCTURE
              </div>
            </motion.div>
          )}

          {stage === "ACCESS" && (
            <motion.div
              key="access"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-6xl font-black tracking-tight text-white"
                initial={{ letterSpacing: "0.35em" }}
                animate={{ letterSpacing: "0.05em" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                ACCESS GRANTED
              </motion.h1>
              <div className="w-64 h-[2px] bg-[#D4AF37] mt-4 mx-auto" />
              <p className="mt-4 text-[11px] text-[#D4AF37]/70 tracking-[0.25em] uppercase">
                REAL_DEL_MONTE DIGITAL · CIVILIZATORY_ECOSYSTEM ONLINE
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-20 border-t border-[#D4AF37]/20 px-6 py-4 text-[9px] text-[#D4AF37]/50 uppercase tracking-[0.2em] flex justify-between">
        <span>© 2026 NODO CERO · REAL DEL MONTE DIGITAL</span>
        <span>DEPLOYMENT_STRATEGY_STATUS: {STAGE_LABELS[stage]}</span>
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import rdmLogo from "@/assets/rdm-logo.png";
import rdmAudio from "@/assets/rdmintro.mp3";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"BOOT" | "SCAN" | "AUTH" | "ACCESS">("BOOT");
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  useEffect(() => {
    // Inicialización del flujo de audio industrial
    audioRef.current = new Audio(rdmAudio);
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => console.warn("Audio blocked"));

    const bootSequence = async () => {
      await new Promise(r => setTimeout(r, 500));
      addLog("INITIALIZING NODO_CERO_CORE...");
      setPhase("SCAN");
      await new Promise(r => setTimeout(r, 1500));
      addLog("ESTABLISHING CITEMESH SECURE LINK...");
      addLog("VERIFYING ID-NVIDA LEDGER INTEGRITY...");
      setPhase("AUTH");
      await new Promise(r => setTimeout(r, 2000));
      addLog("ACCESS_GRANTED: SOVEREIGN_IDENTITY_VERIFIED");
      setPhase("ACCESS");
      await new Promise(r => setTimeout(r, 1500));
      onComplete();
    };

    bootSequence();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black font-mono text-[#D4AF37] flex flex-col p-8 overflow-hidden">
      {/* Glitch Overlay */}
      <motion.div 
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ repeat: Infinity, duration: 0.1 }}
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"
      />

      {/* Header Log */}
      <div className="flex flex-col gap-1 text-[10px] uppercase tracking-widest border-b border-[#D4AF37]/30 pb-4">
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>

      {/* Central Portal */}
      <div className="flex-grow flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          {phase === "SCAN" && (
            <motion.div exit={{ opacity: 0 }} className="flex flex-col items-center">
              <img src={rdmLogo} className="w-32 h-32 opacity-80 animate-pulse" />
              <div className="w-48 h-[1px] bg-[#D4AF37] mt-8 animate-scan" />
            </motion.div>
          )}

          {phase === "AUTH" && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
              <h1 className="text-5xl font-bold tracking-tighter">RDM DIGITAL</h1>
              <p className="text-[10px] mt-4 tracking-[0.5em]">ESTABLECIENDO CONEXIÓN SOBERANA</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer System Status */}
      <div className="border-t border-[#D4AF37]/30 pt-4 text-[9px] flex justify-between">
        <span>ID: NODO_CERO_001</span>
        <span>STATUS: {phase === "ACCESS" ? "OPERATIONAL" : "INITIALIZING"}</span>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(50px); opacity: 0; }
        }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
}

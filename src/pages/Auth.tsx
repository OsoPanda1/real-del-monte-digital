import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Pickaxe, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import rdmLogo from "@/assets/rdm-logo.png";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("¡Cuenta creada! Revisa tu correo para verificar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta, minero! ⛏️");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Error de autenticación");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 30%, hsl(43 80% 55% / 0.06), transparent 70%), radial-gradient(ellipse 50% 60% at 80% 80%, hsl(210 100% 55% / 0.04), transparent)"
      }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 shadow-elevated">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={rdmLogo} alt="RDM" className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-3xl font-display font-bold">
              {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </h1>
            <p className="text-[12px] font-body text-muted-foreground mt-2">
              {mode === "login" ? "Accede a tu perfil de minero digital" : "Únete a la comunidad de Real del Monte"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required
                  placeholder="Nombre de minero" className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-secondary/30 border border-border/30 text-sm font-body placeholder:text-muted-foreground/50 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 outline-none transition-all" />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="correo@ejemplo.com" className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-secondary/30 border border-border/30 text-sm font-body placeholder:text-muted-foreground/50 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 outline-none transition-all" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                placeholder="Contraseña" className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-secondary/30 border border-border/30 text-sm font-body placeholder:text-muted-foreground/50 focus:border-gold/40 focus:ring-1 focus:ring-gold/20 outline-none transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-premium w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  {mode === "login" ? "Entrar" : "Registrarse"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="divider-gold my-6" />

          <p className="text-center text-[12px] font-body text-muted-foreground">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-gold hover:underline font-medium">
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>

        {/* Decorative accents */}
        <div className="absolute -top-3 -left-3 h-6 w-6 border-l-2 border-t-2 border-gold/20" />
        <div className="absolute -top-3 -right-3 h-6 w-6 border-r-2 border-t-2 border-gold/20" />
        <div className="absolute -bottom-3 -left-3 h-6 w-6 border-l-2 border-b-2 border-gold/20" />
        <div className="absolute -bottom-3 -right-3 h-6 w-6 border-r-2 border-b-2 border-gold/20" />
      </motion.div>
    </div>
  );
}

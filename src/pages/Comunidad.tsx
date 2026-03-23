import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, MessageCircle, Calendar, MapPin, Send, Loader2, LogIn } from "lucide-react";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/rdm/VisualEffects";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import likesImg from "@/assets/likes.png";

const events = [
  { title: "Festival del Paste 2026", date: "12-14 Octubre", location: "Plaza Principal", category: "Gastronomía" },
  { title: "Noche de Leyendas", date: "Todos los sábados", location: "Mina de Acosta", category: "Cultura" },
  { title: "Carrera Sierra Minera", date: "8 Noviembre", location: "Bosque del Hiloche", category: "Aventura" },
  { title: "Día de Muertos RDM", date: "1-2 Noviembre", location: "Panteón Inglés", category: "Tradición" },
];

export default function Comunidad() {
  const [user, setUser] = useState<any>(null);
  const [newPost, setNewPost] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;

      // Get profiles for each post
      const userIds = [...new Set(data.map((p: any) => p.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p]));

      return data.map((p: any) => ({
        ...p,
        author: profileMap[p.user_id]?.display_name || "Minero Anónimo",
        avatar: profileMap[p.user_id]?.avatar_url,
      }));
    },
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Debes iniciar sesión");
      const { error } = await supabase.from("community_posts").insert({ user_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPost("");
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("¡Publicación creada! ⛏️");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    createPost.mutate(newPost);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Hace ${hrs}h`;
    return `Hace ${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(210 100% 55% / 0.05), transparent 70%)"
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/15">
                <Users className="h-5 w-5 text-electric" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-electric/70">Red Territorial</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
              Comunidad <span className="text-gradient-electric">RDM</span>
            </h1>
            <p className="mt-4 text-base font-body text-muted-foreground max-w-xl">
              La voz viva de Real del Monte. Comparte, conecta y descubre.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-6 lg:px-12 pb-24">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {/* New post form */}
            {user ? (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmitPost} className="glass rounded-2xl p-5 mb-6">
                <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} rows={3}
                  placeholder="¿Qué descubriste hoy en Real del Monte? ⛏️"
                  className="w-full bg-transparent text-sm font-body placeholder:text-muted-foreground/50 outline-none resize-none" />
                <div className="flex justify-end mt-3">
                  <button type="submit" disabled={createPost.isPending || !newPost.trim()}
                    className="btn-premium !px-5 !py-2.5 !text-[11px] flex items-center gap-2 disabled:opacity-40">
                    {createPost.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Publicar
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-gold rounded-2xl p-5 mb-6 text-center">
                <p className="text-sm font-body text-muted-foreground mb-3">Inicia sesión para publicar</p>
                <button onClick={() => navigate("/auth")} className="btn-premium !px-6 !py-2.5 !text-[11px] inline-flex items-center gap-2">
                  <LogIn className="h-3.5 w-3.5" /> Iniciar Sesión
                </button>
              </motion.div>
            )}

            <h2 className="text-2xl font-display font-bold mb-6">Publicaciones Recientes</h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl p-6 h-32 loading-shimmer" />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-muted-foreground font-body">Aún no hay publicaciones. ¡Sé el primero!</p>
              </div>
            ) : (
              <StaggerContainer className="space-y-5">
                {posts.map((post: any) => (
                  <StaggerItem key={post.id}>
                    <div className="glass rounded-2xl p-6 hover:border-gold/15 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold">
                          {post.author?.[0] || "M"}
                        </div>
                        <div>
                          <p className="text-sm font-body font-semibold">{post.author}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{timeAgo(post.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-[14px] font-body text-secondary-foreground leading-relaxed">{post.content}</p>
                      <div className="mt-4 flex items-center gap-5 text-[12px] font-mono text-muted-foreground">
                        <span className="flex items-center gap-1.5 hover:text-gold transition-colors cursor-pointer">
                          <Heart className="h-3.5 w-3.5" /> {post.likes_count}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-electric transition-colors cursor-pointer">
                          <MessageCircle className="h-3.5 w-3.5" /> {post.comments_count}
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>

          {/* Events sidebar */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Próximos Eventos</h2>
            <StaggerContainer className="space-y-4">
              {events.map((event) => (
                <StaggerItem key={event.title}>
                  <GlowCard>
                    <div className="glass rounded-2xl p-6 hover:border-gold/15 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="glass rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-gold">{event.category}</span>
                      </div>
                      <h3 className="text-lg font-display font-bold">{event.title}</h3>
                      <div className="mt-3 space-y-1.5 text-[11px] font-mono text-muted-foreground">
                        <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{event.date}</p>
                        <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</p>
                      </div>
                    </div>
                  </GlowCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 glass-gold rounded-3xl p-6 text-center">
              <img src={likesImg} alt="Realito" className="mx-auto w-24 h-24 object-contain mb-4" />
              <h3 className="text-xl font-display font-bold text-gradient-gold">¡Únete a la comunidad!</h3>
              <p className="mt-2 text-[12px] font-body text-muted-foreground">
                Comparte tu experiencia en Real del Monte y sé parte de la red RDM Digital.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

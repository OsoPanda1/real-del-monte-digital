import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RdmLayout } from "./layouts/RdmLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { CinematicIntro } from "./components/rdm/CinematicIntro";
import { useState, useCallback } from "react";
import Index from "./pages/Index";
import Historia from "./pages/Historia";
import Gastronomia from "./pages/Gastronomia";
import Lugares from "./pages/Lugares";
import Mapa from "./pages/Mapa";
import Rutas from "./pages/Rutas";
import Comunidad from "./pages/Comunidad";
import Comercios from "./pages/Comercios";
import Recorridos from "./pages/Recorridos";
import Dashboard from "./pages/Dashboard";
import GamePortal from "./pages/GamePortal";
import B2BPortal from "./pages/B2BPortal";
import RealitoAI from "./pages/RealitoAI";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [introComplete, setIntroComplete] = useState(() => {
    if (sessionStorage.getItem("rdm_intro_seen")) return true;
    return false;
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("rdm_intro_seen", "1");
    setIntroComplete(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}
        <BrowserRouter>
          <Routes>
            {/* Public tourism pages with FloatingNav + Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/historia" element={<Historia />} />
              <Route path="/gastronomia" element={<Gastronomia />} />
              <Route path="/lugares" element={<Lugares />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/rutas" element={<Rutas />} />
              <Route path="/recorridos" element={<Recorridos />} />
              <Route path="/comercios" element={<Comercios />} />
              <Route path="/comunidad" element={<Comunidad />} />
            </Route>
            {/* Auth */}
            <Route path="/auth" element={<Auth />} />
            {/* Admin/OS pages with Sidebar */}
            <Route element={<RdmLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/game" element={<GamePortal />} />
              <Route path="/b2b" element={<B2BPortal />} />
              <Route path="/realito" element={<RealitoAI />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RdmLayout } from "./layouts/RdmLayout";
import { CinematicIntro } from "./components/rdm/CinematicIntro";
import { useState, useCallback } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import GamePortal from "./pages/GamePortal";
import B2BPortal from "./pages/B2BPortal";
import RealitoAI from "./pages/RealitoAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}
        <BrowserRouter>
          <Routes>
            <Route element={<RdmLayout />}>
              <Route path="/" element={<Index />} />
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
